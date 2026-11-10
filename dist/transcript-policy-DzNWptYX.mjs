import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { S as supportsClaudeInHistorySystemMessages } from "./anthropic-B3HirzdP.mjs";
import "./src-D3H6pm7W.mjs";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-DHSjZAkW.mjs";
import { t as buildAnthropicReplayPolicyForModel } from "./provider-replay-helpers-B7QyB_ca.mjs";
import { n as isGoogleModelApi, t as isAnthropicApi } from "./anthropic-api-By56RmAj.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { n as assertMemoryAudienceSession, t as assertMemoryAudienceCurrent } from "./memory-audience-BLl7Ac2w.mjs";
import { supportsNativeOpenAIResponsesEndpoint } from "@openclaw/ai/internal/openai-responses-payload-policy";
import { requiresReasoningContentReplay } from "@openclaw/ai/internal/openai-completions-compat";
import { isDirectAnthropicModel } from "@openclaw/ai/internal/anthropic";
//#region src/agents/embedded-agent-runner/run/agent-hook-context.ts
function buildEmbeddedAgentHookContext(run, agentId, trace) {
	if (run.memoryAudience) assertMemoryAudienceSession(run.memoryAudience, run.sessionKey);
	return {
		runId: run.runId,
		jobId: run.jobId,
		trace,
		agentId,
		sessionKey: run.sessionKey,
		sessionId: run.sessionId,
		memoryAudience: run.memoryAudience,
		assertMemoryAudienceCurrent: run.memoryAudience ? () => assertMemoryAudienceCurrent(run.memoryAudience) : void 0,
		sandboxed: run.sandbox?.enabled === true,
		workspaceDir: run.workspaceDir,
		trigger: run.trigger,
		...buildAgentHookContextChannelFields(run),
		...buildAgentHookContextIdentityFields(run)
	};
}
//#endregion
//#region src/agents/transcript-policy.ts
/**
* Transcript replay policy resolution.
* Combines provider plugin replay hooks with core transport fallbacks so chat
* history sanitization, tool IDs, thinking blocks, and turn validation align.
*/
const DEFAULT_TRANSCRIPT_POLICY = {
	sanitizeMode: "images-only",
	sanitizeToolCallIds: false,
	toolCallIdMode: void 0,
	duplicateToolCallIdStyle: void 0,
	preserveNativeAnthropicToolUseIds: false,
	repairToolUseResultPairing: true,
	preserveSignatures: false,
	appendOnlyRuntimeContext: false,
	inHistorySystemUpdates: false,
	sanitizeThoughtSignatures: void 0,
	dropThinkingBlocks: false,
	dropReasoningFromHistory: false,
	applyGoogleTurnOrdering: false,
	validateGeminiTurns: false,
	validateAnthropicTurns: false,
	allowSyntheticToolResults: false
};
function isOpenAiResponsesCompatibleApi(modelApi) {
	return modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "azure-openai-responses";
}
function modelDisablesReasoningEffort(model) {
	return (model?.compat)?.supportsReasoningEffort === false;
}
/**
* Provides a narrow replay-policy fallback for providers that do not have an
* owning runtime plugin.
*
* This exists to preserve generic custom-provider behavior. Bundled providers
* should express replay ownership through `buildReplayPolicy` instead.
*/
function buildUnownedProviderTransportReplayFallback(params) {
	const isGoogle = isGoogleModelApi(params.modelApi);
	if (isAnthropicApi(params.modelApi)) return {
		...buildAnthropicReplayPolicyForModel(params.modelId ?? void 0, params.model, params.inHistorySystemUpdates),
		...modelDisablesReasoningEffort(params.model) ? { dropThinkingBlocks: true } : {}
	};
	const isStrictOpenAiCompatible = params.modelApi === "openai-completions";
	const isOpenAiResponses = isOpenAiResponsesCompatibleApi(params.modelApi);
	if (!isGoogle && !(isStrictOpenAiCompatible || isOpenAiResponses)) return;
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const isClaudeOpenAiResponses = isOpenAiResponses && /(?:^|[./:_-])claude(?:$|[./:_-])/.test(modelId);
	return {
		sanitizeMode: isGoogle ? "full" : void 0,
		sanitizeToolCallIds: true,
		toolCallIdMode: "strict",
		sanitizeThoughtSignatures: isGoogle ? {
			allowBase64Only: true,
			includeCamelCase: true
		} : void 0,
		dropReasoningFromHistory: isStrictOpenAiCompatible ? params.model?.reasoning !== true && !requiresReasoningContentReplay(params.modelId) : void 0,
		applyAssistantFirstOrderingFix: isGoogle || isStrictOpenAiCompatible ? true : void 0,
		validateGeminiTurns: isGoogle || isStrictOpenAiCompatible ? true : void 0,
		validateAnthropicTurns: isStrictOpenAiCompatible || isClaudeOpenAiResponses ? true : void 0,
		allowSyntheticToolResults: isGoogle || isOpenAiResponses ? true : void 0
	};
}
function mergeTranscriptPolicy(policy, modelApi) {
	const merged = {
		...DEFAULT_TRANSCRIPT_POLICY,
		appendOnlyRuntimeContext: modelApi === "openai-completions" || modelApi === "ollama"
	};
	for (const [key, value] of Object.entries(policy ?? {})) if (value != null) Object.assign(merged, { [key === "applyAssistantFirstOrderingFix" ? "applyGoogleTurnOrdering" : key]: value });
	return merged;
}
const transcriptPolicyCache = /* @__PURE__ */ new WeakMap();
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
function resolveTranscriptPolicy(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const cacheConfig = !params.env || params.env === process.env ? params.config : void 0;
	const cacheKey = cacheConfig ? JSON.stringify({
		provider,
		directApiKey: params.directApiKey === true,
		baseUrl: params.model?.baseUrl?.trim() || (params.env ?? process.env).ANTHROPIC_BASE_URL?.trim() || "",
		modelApi: params.modelApi ?? "",
		modelId: params.modelId ?? "",
		canonicalModelId: typeof params.model?.params?.canonicalModelId === "string" ? params.model.params.canonicalModelId : "",
		dropsThinkingForReasoningCompat: modelDisablesReasoningEffort(params.model),
		preservesReasoningContentReplay: params.model?.reasoning === true,
		workspaceDir: params.workspaceDir ?? "",
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: cacheConfig,
			workspaceDir: params.workspaceDir,
			env: params.env
		})
	}) : void 0;
	if (cacheConfig && cacheKey) {
		const cached = transcriptPolicyCache.get(cacheConfig)?.get(cacheKey);
		if (cached) return cached;
	}
	const runtimePlugin = params.runtimeHandle?.plugin ?? (provider ? resolveProviderRuntimePlugin({
		provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : void 0);
	const context = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		provider,
		modelId: params.modelId ?? "",
		modelApi: params.modelApi,
		model: params.model,
		inHistorySystemUpdates: supportsNativeOpenAIResponsesEndpoint({
			provider,
			api: params.modelApi ?? "",
			baseUrl: params.model?.baseUrl
		}) || params.directApiKey === true && params.modelApi === "anthropic-messages" && isDirectAnthropicModel({
			provider,
			baseUrl: params.model?.baseUrl
		}, params.env) && supportsClaudeInHistorySystemMessages({
			id: params.modelId ?? void 0,
			params: params.model?.params
		})
	};
	const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
	const policy = mergeTranscriptPolicy(buildReplayPolicy ? buildReplayPolicy(context) ?? void 0 : buildUnownedProviderTransportReplayFallback(context), params.modelApi);
	if (policy.inHistorySystemUpdates) {
		policy.inHistorySystemUpdates = context.inHistorySystemUpdates;
		policy.appendOnlyRuntimeContext ||= context.inHistorySystemUpdates;
	}
	if (cacheConfig && cacheKey) {
		let configCache = transcriptPolicyCache.get(cacheConfig);
		if (!configCache) {
			configCache = /* @__PURE__ */ new Map();
			transcriptPolicyCache.set(cacheConfig, configCache);
		}
		configCache.set(cacheKey, policy);
	}
	return policy;
}
//#endregion
export { buildEmbeddedAgentHookContext as n, resolveTranscriptPolicy as t };
