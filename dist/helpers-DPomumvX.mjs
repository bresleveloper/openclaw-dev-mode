import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { a as bindsClaudeThinkingPrefix } from "./anthropic-Cy4mTngV.mjs";
import "./src-BpANEEBH.mjs";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-Czh46tAs.mjs";
import { n as extractAssistantTextForPhase } from "./chat-message-content-D14VlZZc.mjs";
import { n as deriveContextPromptTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { n as isGoogleModelApi, t as isAnthropicApi } from "./anthropic-api-B6ZukRgl.mjs";
import { u as shouldDropClaudeThinkingBlocks } from "./provider-replay-helpers-CXnvOz8t.mjs";
import { o as extractAssistantVisibleText } from "./embedded-agent-utils-C9EyRsVl.mjs";
import { i as toNormalizedUsage } from "./usage-accumulator-CKETh8nK.mjs";
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
function isClaudeFamilyModelId(modelId) {
	const id = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|[./:_-])claude(?:$|[./:_-])/.test(id);
}
function modelDisablesReasoningEffort(model) {
	return (model?.compat)?.supportsReasoningEffort === false;
}
function shouldPreserveReasoningContentReplay(params) {
	return params.model?.reasoning === true || requiresReasoningContentReplay(params.modelId);
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
	const isAnthropic = isAnthropicApi(params.modelApi);
	const isStrictOpenAiCompatible = params.modelApi === "openai-completions";
	const requiresOpenAiCompatibleToolIdSanitization = params.modelApi === "openai-completions" || params.modelApi === "openai-responses" || params.modelApi === "openai-chatgpt-responses" || params.modelApi === "azure-openai-responses";
	if (!isGoogle && !isAnthropic && !isStrictOpenAiCompatible && !requiresOpenAiCompatibleToolIdSanitization) return;
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const isClaudeOpenAiResponses = isOpenAiResponsesCompatibleApi(params.modelApi) ? isClaudeFamilyModelId(modelId) : false;
	return {
		...isGoogle || isAnthropic ? { sanitizeMode: "full" } : {},
		...isGoogle || isAnthropic || requiresOpenAiCompatibleToolIdSanitization ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict"
		} : {},
		...isAnthropic ? {
			preserveSignatures: true,
			appendOnlyRuntimeContext: bindsClaudeThinkingPrefix({
				id: modelId,
				params: params.model?.params
			})
		} : {},
		...isGoogle ? { sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		} } : {},
		...isAnthropic && shouldDropClaudeThinkingBlocks(modelId, params.model) ? { dropThinkingBlocks: true } : {},
		...isAnthropic && modelDisablesReasoningEffort(params.model) ? { dropThinkingBlocks: true } : {},
		...isStrictOpenAiCompatible ? { dropReasoningFromHistory: !shouldPreserveReasoningContentReplay(params) } : {},
		...isGoogle || isStrictOpenAiCompatible ? { applyAssistantFirstOrderingFix: true } : {},
		...isGoogle || isStrictOpenAiCompatible ? { validateGeminiTurns: true } : {},
		...isAnthropic || isStrictOpenAiCompatible || isClaudeOpenAiResponses ? { validateAnthropicTurns: true } : {},
		...isGoogle || isAnthropic || isOpenAiResponsesCompatibleApi(params.modelApi) ? { allowSyntheticToolResults: true } : {}
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
function mergeTranscriptPolicy(policy, basePolicy = DEFAULT_TRANSCRIPT_POLICY) {
	if (!policy) return basePolicy;
	return {
		...basePolicy,
		...policy.sanitizeMode != null ? { sanitizeMode: policy.sanitizeMode } : {},
		...typeof policy.sanitizeToolCallIds === "boolean" ? { sanitizeToolCallIds: policy.sanitizeToolCallIds } : {},
		...policy.toolCallIdMode ? { toolCallIdMode: policy.toolCallIdMode } : {},
		...policy.duplicateToolCallIdStyle ? { duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle } : {},
		...typeof policy.preserveNativeAnthropicToolUseIds === "boolean" ? { preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds } : {},
		...typeof policy.repairToolUseResultPairing === "boolean" ? { repairToolUseResultPairing: policy.repairToolUseResultPairing } : {},
		...typeof policy.preserveSignatures === "boolean" ? { preserveSignatures: policy.preserveSignatures } : {},
		...typeof policy.appendOnlyRuntimeContext === "boolean" ? { appendOnlyRuntimeContext: policy.appendOnlyRuntimeContext } : {},
		...policy.sanitizeThoughtSignatures ? { sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures } : {},
		...typeof policy.dropThinkingBlocks === "boolean" ? { dropThinkingBlocks: policy.dropThinkingBlocks } : {},
		...typeof policy.dropReasoningFromHistory === "boolean" ? { dropReasoningFromHistory: policy.dropReasoningFromHistory } : {},
		...typeof policy.applyAssistantFirstOrderingFix === "boolean" ? { applyGoogleTurnOrdering: policy.applyAssistantFirstOrderingFix } : {},
		...typeof policy.validateGeminiTurns === "boolean" ? { validateGeminiTurns: policy.validateGeminiTurns } : {},
		...typeof policy.validateAnthropicTurns === "boolean" ? { validateAnthropicTurns: policy.validateAnthropicTurns } : {},
		...typeof policy.allowSyntheticToolResults === "boolean" ? { allowSyntheticToolResults: policy.allowSyntheticToolResults } : {}
	};
}
const transcriptPolicyCache = /* @__PURE__ */ new WeakMap();
function canCacheTranscriptPolicy(params) {
	if (!params.config) return false;
	return !params.env || params.env === process.env;
}
function resolveTranscriptPolicyCacheKey(params) {
	return JSON.stringify({
		provider: params.provider,
		modelApi: params.modelApi ?? "",
		modelId: params.modelId ?? "",
		canonicalModelId: typeof params.model?.params?.canonicalModelId === "string" ? params.model.params.canonicalModelId : "",
		dropsThinkingForReasoningCompat: modelDisablesReasoningEffort(params.model),
		preservesReasoningContentReplay: params.model?.reasoning === true,
		workspaceDir: params.workspaceDir ?? "",
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		})
	});
}
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
function resolveTranscriptPolicy(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const cacheConfig = canCacheTranscriptPolicy(params) ? params.config : void 0;
	const cacheKey = cacheConfig ? resolveTranscriptPolicyCacheKey({
		...params,
		provider,
		config: cacheConfig
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
		model: params.model
	};
	const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
	const policy = buildReplayPolicy ? mergeTranscriptPolicy(buildReplayPolicy(context) ?? void 0) : mergeTranscriptPolicy(buildUnownedProviderTransportReplayFallback({
		modelApi: params.modelApi,
		modelId: params.modelId,
		model: params.model
	}));
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
/**
* Shared run helpers for retry limits, model reporting, and final text.
*/
const RUNTIME_AUTH_REFRESH_MARGIN_MS = 3e5;
const RUNTIME_AUTH_REFRESH_RETRY_MS = 6e4;
const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS = 5e3;
const ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
const ANTHROPIC_MAGIC_STRING_REPLACEMENT = "[redacted]";
function scrubAnthropicRefusalMagic(prompt) {
	if (!prompt.includes(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL)) return prompt;
	return prompt.replaceAll(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL, ANTHROPIC_MAGIC_STRING_REPLACEMENT);
}
/** Anthropic's transport interprets this marker even for native-owned attempts. */
function resolveEmbeddedAttemptBasePrompt(params) {
	if (params.provider !== "anthropic") return params.prompt;
	return scrubAnthropicRefusalMagic(params.prompt);
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
function resolveActiveErrorContext(params) {
	return resolveReportedModelRef(params);
}
function isEmbeddedHarnessProvider(provider) {
	return provider.trim().toLowerCase() === "openclaw";
}
function resolveReportedModelRef(params) {
	const assistantProvider = params.assistant?.provider?.trim();
	const assistantModel = params.assistant?.model?.trim();
	if (!assistantProvider) return {
		provider: params.provider,
		model: assistantModel || params.model
	};
	if (isEmbeddedHarnessProvider(assistantProvider)) return {
		provider: params.provider,
		model: params.model
	};
	return {
		provider: assistantProvider,
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
/**
* Build agentMeta for error return paths, preserving accumulated usage so that
* session totalTokens reflects the actual context size rather than going stale.
* Without this, error returns omit usage and the session keeps whatever
* totalTokens was set by the previous successful run.
*/
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
export { buildUsageAgentMetaFields as a, resolveActiveErrorContext as c, resolveFinalAssistantVisibleText as d, resolveLatestCallUsage as f, resolveTranscriptPolicy as h, buildErrorAgentMeta as i, resolveEmbeddedAttemptBasePrompt as l, resolveReportedModelRef as m, RUNTIME_AUTH_REFRESH_MIN_DELAY_MS as n, createRunRecoveryDiagId as o, resolveMaxRunRetryIterations as p, RUNTIME_AUTH_REFRESH_RETRY_MS as r, normalizeAssistantUsageForContext as s, RUNTIME_AUTH_REFRESH_MARGIN_MS as t, resolveFinalAssistantRawText as u };
