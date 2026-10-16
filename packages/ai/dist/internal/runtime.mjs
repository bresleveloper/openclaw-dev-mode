import { a as isProviderRefusalAssistantError } from "../diagnostics-DzrF1h4J.mjs";
import { o as getEventStreamCompletion } from "../event-stream-C5AbCAaZ.mjs";
import { r as createApiRegistry, t as createLlmRuntime } from "../stream-DFaRxi2D.mjs";
import { A as getSupportedThinkingLevels, D as applyProviderReportedUsageCost, E as headersToRecord, O as calculateCost, j as modelsAreEqual, k as clampThinkingLevel } from "../host-u3o8XiAp.mjs";
import { i as registerSessionResourceCleanupObserver, n as getSessionResourceOwnerId, r as registerSessionResourceCleanup, t as cleanupSessionResources } from "../session-resources-D1wgDQ8C.mjs";
import { A as shortHash, D as parseJsonWithRepair, E as createToolArgumentPreviewSchedule, O as parseStreamingJson, P as sanitizeSurrogates, g as parseTerminalToolCallArguments, k as repairJson } from "../transport-stream-shared-CCR7hSW0.mjs";
import { n as getEnvApiKey, t as findEnvKeys } from "../env-api-keys-CyX4VKGO.mjs";
import { t as createDeferredEventBuffer } from "../deferred-event-buffer-DAvyP7qA.mjs";
import { n as onLlmRequestActivity, t as notifyLlmRequestActivity } from "../llm-request-activity-D8f_oxHj.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, n as createFirstStreamEventTimeoutError, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "../stream-first-event-timeout-D9ZmL_s9.mjs";
import { t as createReasoningTagTextPartitioner } from "../reasoning-tag-text-partitioner-Ju9VpUGl.mjs";
import { t as createSseByteGuard } from "../streaming-byte-guard-CC-HMn_u.mjs";
import { n as resolveOpenAICodexAccountId, t as decodeOpenAICodexJwtPayload } from "../openai-chatgpt-jwt-KWcgd0d_.mjs";
//#region packages/ai/src/internal/default-runtime.ts
const DEFAULT_RUNTIME_KEY = Symbol.for("openclaw.ai.defaultRuntime");
function resolveDefaultRuntime() {
	const globalStore = globalThis;
	if (Object.hasOwn(globalStore, DEFAULT_RUNTIME_KEY)) return globalStore[DEFAULT_RUNTIME_KEY];
	const registry = createApiRegistry();
	const state = {
		registry,
		runtime: createLlmRuntime(registry)
	};
	globalStore[DEFAULT_RUNTIME_KEY] = state;
	return state;
}
const defaultRuntime = resolveDefaultRuntime();
const defaultApiRegistry = defaultRuntime.registry;
const defaultLlmRuntime = defaultRuntime.runtime;
const { getApiProvider, getApiProviders } = defaultApiRegistry;
function clearApiProviders() {
	defaultApiRegistry.clearApiProviders();
}
const { stream, complete, streamSimple, completeSimple } = defaultLlmRuntime;
//#endregion
//#region packages/ai/src/utils/overflow.ts
const CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE = /prompt has [\d,]+ tokens?, but the configured context size is [\d,]+ tokens?/i;
const CONTEXT_OVERFLOW_PATTERN_SCOPES = {
	"assistant-error": [
		/prompt is too long/i,
		/request_too_large/i,
		/input length and `?max_tokens`? exceed context limit: [\d,]+ \+ [\d,]+ > [\d,]+/i,
		/input is too long for requested model/i,
		/exceeds the context window/i,
		/exceeds (?:the )?(?:model'?s )?maximum context length(?: of [\d,]+ tokens?|\s*\([\d,]+\))/i,
		/input token count.*exceeds the maximum/i,
		/maximum prompt length is \d+/i,
		/reduce the length of the messages/i,
		/maximum context length is \d+ tokens/i,
		/exceeds (?:the )?maximum allowed input length of [\d,]+ tokens?/i,
		/input \(\d+ tokens\) is longer than the model'?s context length \(\d+ tokens\)/i,
		/exceeds the limit of \d+/i,
		/(?:exceeds the available context size|context size has been exceeded)/i,
		/greater than the context length/i,
		/context window exceeds limit/i,
		/exceeded model token limit/i,
		/tokens? in request more than max tokens? allowed/i,
		/prompt exceeds max(?:imum)? length/i,
		/too large for model with \d+ maximum context length/i,
		CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE,
		/model_context_window_exceeded/i,
		/prompt too long; exceeded (?:max )?context length/i,
		/context[_ ]length[_ ]exceeded/i,
		/too many tokens/i,
		/token limit exceeded/i,
		/^413\s*(?:status code)?\s*\(no body\)/i
	],
	"failover-explicit": [
		/request_too_large/i,
		/context_overflow/i,
		CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE,
		/invalid_argument[\s\S]*maximum number of tokens/i,
		/request exceeds the maximum size/i,
		/context length exceeded/i,
		/maximum context length/i,
		/prompt is too long/i,
		/prompt too long/i,
		/exceeds model context window/i,
		/model token limit/i,
		/input exceeds[\s\S]*maximum number of tokens/i,
		/^(?=[\s\S]*context window)(?=[\s\S]*ran out of (?:room|space))/i,
		/request size exceeds[\s\S]*context window/i,
		/context overflow:/i,
		/exceed context limit/i,
		/exceeds the model'?s maximum context/i,
		/max_tokens[\s\S]*exceed[\s\S]*context/i,
		/input(?: length[\s\S]*exceed[\s\S]*context| \([\d,]+\s*tokens?\) is longer than (?:the )?model'?s context length)/i,
		/413[\s\S]*too large/i,
		/context_window_exceeded/i,
		/input length [\d,]+\s+tokens? exceeds the model limit/i,
		/上下文过长|上下文超出|上下文长度超|超出最大上下文|请压缩上下文/
	],
	"provider-fallback": [
		/\binput token count exceeds the maximum number of input tokens\b/i,
		/\binput is too long for this model\b/i,
		/\binput exceeds the maximum number of tokens\b/i,
		/\bollama error:\s*context length exceeded(?:,\s*too many tokens)?\b/i,
		/\btotal tokens?.*exceeds? (?:the )?(?:model(?:'s)? )?(?:max|maximum|limit)/i,
		/\b(?:(?:request|prompt) \(\d[\d,]*\s*tokens?\) exceeds (?:the )?available context size|context size has been exceeded)\b/i,
		/\binput (?:is )?too long for (?:the )?model\b/i
	],
	"failover-hint": [/context.*overflow|context window.*(too (?:large|long)|exceed|over|limit|max(?:imum)?|requested|sent|tokens)|prompt.*(too (?:large|long)|exceed|over|limit|max(?:imum)?)|(?:request|input).*(?:context|window|length|token).*(too (?:large|long)|exceed|over|limit|max(?:imum)?)/i],
	"context-window-too-small": [/context window.*(too small|minimum is)/i],
	"tpm-rate-limit-hint": [/\btpm\b|tokens per minute/i],
	"rate-limit-hint": [/rate limit|too many requests|requests per (?:minute|hour|day)|quota|throttl|429\b|tokens per day/i]
};
/** Match one canonical context-overflow wording scope without applying caller policy. */
function matchesContextOverflowMessage(errorMessage, scope) {
	return CONTEXT_OVERFLOW_PATTERN_SCOPES[scope].some((pattern) => pattern.test(errorMessage));
}
const NON_OVERFLOW_PATTERNS = [
	/^(Throttling error|Service unavailable):/i,
	/rate limit/i,
	/too many requests/i
];
function resolveContextInputTokens(message) {
	if (message.usage.contextUsage?.state === "available") return message.usage.contextUsage.promptTokens;
	if (message.usage.contextUsage?.state === "unavailable") return;
	return message.usage.input + message.usage.cacheRead + message.usage.cacheWrite;
}
/**
* Match provider overflow errors, or infer overflow from reported context usage.
* A context window enables silent-overflow detection; silent truncation without
* a length stop remains undetectable because the original token count is unknown.
*/
function isContextOverflow(message, contextWindow) {
	if (isProviderRefusalAssistantError(message)) return false;
	if (message.stopReason === "error" && message.errorMessage) {
		const errorMessage = message.errorMessage;
		if (!NON_OVERFLOW_PATTERNS.some((p) => p.test(errorMessage)) && matchesContextOverflowMessage(errorMessage, "assistant-error")) return true;
	}
	if (contextWindow && message.stopReason === "stop") {
		const inputTokens = resolveContextInputTokens(message);
		if (inputTokens !== void 0 && inputTokens > contextWindow) return true;
	}
	if (contextWindow && message.stopReason === "length" && message.usage.output === 0) {
		const inputTokens = resolveContextInputTokens(message);
		if (inputTokens !== void 0 && inputTokens >= contextWindow * .99) return true;
	}
	return false;
}
//#endregion
export { applyProviderReportedUsageCost, calculateCost, clampThinkingLevel, cleanupSessionResources, clearApiProviders, complete, completeSimple, createDeferredEventBuffer, createFirstStreamEventAbortController, createFirstStreamEventTimeoutError, createReasoningTagTextPartitioner, createSseByteGuard, createToolArgumentPreviewSchedule, decodeOpenAICodexJwtPayload, defaultApiRegistry, defaultLlmRuntime, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getEventStreamCompletion, getFirstStreamEventTimeoutHandler, getFirstStreamEventTimeoutMs, getSessionResourceOwnerId, getSupportedThinkingLevels, headersToRecord, isContextOverflow, matchesContextOverflowMessage, modelsAreEqual, notifyLlmRequestActivity, onLlmRequestActivity, parseJsonWithRepair, parseStreamingJson, parseTerminalToolCallArguments, registerSessionResourceCleanup, registerSessionResourceCleanupObserver, repairJson, resolveOpenAICodexAccountId, sanitizeSurrogates, shortHash, stream, streamSimple, withFirstStreamEventTimeout };
