import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-DPS9EUx6.mjs";
import { S as supportsClaudeInHistorySystemMessages } from "./anthropic-D-i5CCnY.mjs";
import "./src-UF9QYDzr.mjs";
import { i as generateSecureToken } from "./secure-random-Dimnnrm0.mjs";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-BIyhXAln.mjs";
import { n as extractAssistantTextForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { n as deriveContextPromptTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { t as buildAnthropicReplayPolicyForModel } from "./provider-replay-helpers-Da6bKlcZ.mjs";
import { n as isGoogleModelApi, t as isAnthropicApi } from "./anthropic-api-h8NkJ9yu.mjs";
import { o as extractAssistantVisibleText } from "./embedded-agent-utils-BYhIvAvm.mjs";
import { i as toNormalizedUsage } from "./usage-accumulator-CzWfyqDH.mjs";
import { isDirectAnthropicModel } from "@openclaw/ai/internal/anthropic";
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
		...isGoogle ? { sanitizeMode: "full" } : {},
		sanitizeToolCallIds: true,
		toolCallIdMode: "strict",
		...isGoogle ? { sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		} } : {},
		...isStrictOpenAiCompatible ? { dropReasoningFromHistory: params.model?.reasoning !== true && !requiresReasoningContentReplay(params.modelId) } : {},
		...isGoogle || isStrictOpenAiCompatible ? {
			applyAssistantFirstOrderingFix: true,
			validateGeminiTurns: true
		} : {},
		...isStrictOpenAiCompatible || isClaudeOpenAiResponses ? { validateAnthropicTurns: true } : {},
		...isGoogle || isOpenAiResponses ? { allowSyntheticToolResults: true } : {}
	};
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = /* @__PURE__ */ new Set([
	"kimi-for-coding",
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code",
	"kimi-k2.7-code-highspeed",
	"kimi-k3",
	"kimi-k2-thinking",
	"kimi-k2-thinking-turbo",
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	"mimo-v2.6-flash",
	"mimo-v2.6-pro",
	"mimo-v2.6-pro-ultraspeed"
]);
function requiresReasoningContentReplay(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (!normalized) return false;
	const parts = normalized.split("/").filter(Boolean);
	const finalPart = parts[parts.length - 1] ?? normalized;
	const candidates = [finalPart];
	const colonParts = finalPart.split(":").filter(Boolean);
	if (colonParts.length > 1) candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
	return candidates.some((candidate) => REASONING_CONTENT_REPLAY_MODEL_IDS.has(candidate));
}
function mergeTranscriptPolicy(policy) {
	if (!policy) return DEFAULT_TRANSCRIPT_POLICY;
	const merged = { ...DEFAULT_TRANSCRIPT_POLICY };
	for (const [key, value] of Object.entries(policy)) if (value != null) Object.assign(merged, { [key === "applyAssistantFirstOrderingFix" ? "applyGoogleTurnOrdering" : key]: value });
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
		inHistorySystemUpdates: params.directApiKey === true && params.modelApi === "anthropic-messages" && isDirectAnthropicModel({
			provider,
			baseUrl: params.model?.baseUrl
		}, params.env) && supportsClaudeInHistorySystemMessages({
			id: params.modelId ?? void 0,
			params: params.model?.params
		})
	};
	const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
	const policy = buildReplayPolicy ? mergeTranscriptPolicy(buildReplayPolicy(context) ?? void 0) : mergeTranscriptPolicy(buildUnownedProviderTransportReplayFallback({
		modelApi: params.modelApi,
		modelId: params.modelId,
		model: params.model,
		inHistorySystemUpdates: context.inHistorySystemUpdates
	}));
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
//#region src/agents/embedded-agent-runner/run/helpers.ts
const RUNTIME_AUTH_REFRESH_MARGIN_MS = 3e5;
const RUNTIME_AUTH_REFRESH_RETRY_MS = 6e4;
const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS = 5e3;
const ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
const ANTHROPIC_MAGIC_STRING_REPLACEMENT = "[redacted]";
/** Anthropic's transport interprets this marker even for native-owned attempts. */
function resolveEmbeddedAttemptBasePrompt(params) {
	if (params.provider !== "anthropic") return params.prompt;
	return params.prompt.replaceAll(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL, ANTHROPIC_MAGIC_STRING_REPLACEMENT);
}
function createRunRecoveryDiagId() {
	return `ovf-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
const BASE_RUN_RETRY_ITERATIONS = 24;
const RUN_RETRY_ITERATIONS_PER_PROFILE = 8;
const MIN_RUN_RETRY_ITERATIONS = 32;
const MAX_RUN_RETRY_ITERATIONS = 160;
function resolveMaxRunRetryIterations(profileCandidateCount) {
	const scaled = BASE_RUN_RETRY_ITERATIONS + Math.max(1, profileCandidateCount) * RUN_RETRY_ITERATIONS_PER_PROFILE;
	return Math.min(MAX_RUN_RETRY_ITERATIONS, Math.max(MIN_RUN_RETRY_ITERATIONS, scaled));
}
function resolveReportedModelRef(params) {
	const assistantProvider = params.assistant?.provider?.trim();
	const assistantModel = params.assistant?.model?.trim();
	if (assistantProvider?.toLowerCase() === "openclaw") return {
		provider: params.provider,
		model: params.model
	};
	return {
		provider: assistantProvider || params.provider,
		model: assistantModel || params.model
	};
}
function resolveLatestCallUsage(params) {
	const currentAttempt = params.currentAttemptCandidates.find(hasNonzeroUsage);
	const carriedUsage = hasNonzeroUsage(params.carriedUsage) ? params.carriedUsage : void 0;
	const transcriptFallback = hasNonzeroUsage(params.transcriptFallback) ? params.transcriptFallback : void 0;
	return {
		currentAttempt,
		latest: currentAttempt ?? carriedUsage ?? transcriptFallback
	};
}
function normalizeAssistantUsageForContext(assistant) {
	if (assistant?.api === "cli" && assistant.usage && typeof assistant.usage === "object" && !Array.isArray(assistant.usage) && assistant.usage.contextUsage === void 0) return { contextUsage: { state: "unavailable" } };
	return normalizeUsage(assistant?.usage);
}
function buildUsageAgentMetaFields(params) {
	const usage = toNormalizedUsage(params.usageAccumulator);
	const latestUsage = normalizeUsage(params.latestUsage);
	const lastCallUsage = hasNonzeroUsage(latestUsage) ? latestUsage : hasNonzeroUsage(params.lastRunPromptUsage) ? params.lastRunPromptUsage : void 0;
	return {
		usage,
		lastCallUsage,
		promptTokens: deriveContextPromptTokens({ lastCallUsage }),
		...usage?.cost ? { costUsd: usage.cost.total } : {}
	};
}
/** Error returns retain usage so the session does not keep an older context total. */
function buildErrorAgentMeta(params) {
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: params.usageAccumulator,
		latestUsage: normalizeAssistantUsageForContext(params.currentAttemptAssistant),
		lastRunPromptUsage: params.lastRunPromptUsage
	});
	return {
		sessionId: params.sessionId,
		...params.sessionFile ? { sessionFile: params.sessionFile } : {},
		provider: params.provider,
		model: params.model,
		...params.credentialSource ? { credentialSource: params.credentialSource } : {},
		...params.contextTokens ? { contextTokens: params.contextTokens } : {},
		...params.contextTokens ? { contextTokensSource: "resolved" } : {},
		...usageMeta.usage ? { usage: usageMeta.usage } : {},
		...usageMeta.lastCallUsage ? { lastCallUsage: usageMeta.lastCallUsage } : {},
		...usageMeta.promptTokens ? { promptTokens: usageMeta.promptTokens } : {},
		...usageMeta.costUsd !== void 0 ? { costUsd: usageMeta.costUsd } : {}
	};
}
function resolveFinalAssistantVisibleText(lastAssistant) {
	if (!lastAssistant) return;
	return extractAssistantVisibleText(lastAssistant).trim() || void 0;
}
function resolveFinalAssistantRawText(lastAssistant) {
	if (!lastAssistant) return;
	return (extractAssistantTextForPhase(lastAssistant, { phase: "final_answer" }) ?? extractAssistantTextForPhase(lastAssistant) ?? "").trim() || void 0;
}
//#endregion
export { buildUsageAgentMetaFields as a, resolveEmbeddedAttemptBasePrompt as c, resolveLatestCallUsage as d, resolveMaxRunRetryIterations as f, buildErrorAgentMeta as i, resolveFinalAssistantRawText as l, resolveTranscriptPolicy as m, RUNTIME_AUTH_REFRESH_MIN_DELAY_MS as n, createRunRecoveryDiagId as o, resolveReportedModelRef as p, RUNTIME_AUTH_REFRESH_RETRY_MS as r, normalizeAssistantUsageForContext as s, RUNTIME_AUTH_REFRESH_MARGIN_MS as t, resolveFinalAssistantVisibleText as u };
