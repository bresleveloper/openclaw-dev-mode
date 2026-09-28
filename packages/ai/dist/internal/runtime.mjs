import { n as getEnvApiKey, t as findEnvKeys } from "../env-api-keys-DrgeBuva.mjs";
import { a as isProviderRefusalAssistantError } from "../diagnostics-DzrF1h4J.mjs";
import { a as getEventStreamCompletion } from "../event-stream-D8PARQfL.mjs";
import { n as createApiRegistry, t as createLlmRuntime } from "../stream-CREqxHgU.mjs";
import { A as headersToRecord, F as modelsAreEqual, M as calculateCost, N as clampThinkingLevel, P as getSupportedThinkingLevels, j as applyProviderReportedUsageCost, v as sanitizeSurrogates } from "../host-yTvBrYM2.mjs";
import { D as repairJson, E as parseStreamingJson, O as shortHash, T as parseJsonWithRepair, h as parseTerminalToolCallArguments, w as createToolArgumentPreviewSchedule } from "../transport-stream-shared-B5RioB_Q.mjs";
import { t as createDeferredEventBuffer } from "../deferred-event-buffer-DAvyP7qA.mjs";
import { n as onLlmRequestActivity, t as notifyLlmRequestActivity } from "../llm-request-activity-BjtkplhG.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, n as createFirstStreamEventTimeoutError, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "../stream-first-event-timeout-BeptfRL6.mjs";
import { t as createReasoningTagTextPartitioner } from "../reasoning-tag-text-partitioner-BKmeGUBE.mjs";
import { t as createSseByteGuard } from "../streaming-byte-guard-CC-HMn_u.mjs";
import { n as registerSessionResourceCleanup, t as cleanupSessionResources } from "../session-resources-CkR4WWy1.mjs";
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
/**
* Patterns that indicate non-overflow errors (e.g. rate limiting, server errors).
* Error messages matching any of these are excluded from overflow detection
* even if they also match an OVERFLOW_PATTERN.
*
* Example: Bedrock formats throttling errors as "ThrottlingException: Too many tokens,
* please wait before trying again." which would match the /too many tokens/i overflow
* pattern without this exclusion.
*/
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
* Check if an assistant message represents a context overflow error.
*
* This handles two cases:
* 1. Error-based overflow: Most providers return stopReason "error" with a
*    specific error message pattern.
* 2. Silent overflow: Some providers accept overflow requests and return
*    successfully. For these, we check if usage.input exceeds the context window.
*
* ## Reliability by Provider
*
* **Reliable detection (returns error with detectable message):**
* - Anthropic: "prompt is too long: X tokens > Y maximum" or "request_too_large"
* - OpenAI (Completions & Responses): "exceeds the context window" or "exceeds the model's maximum context length of X tokens"
* - Google Gemini: "input token count exceeds the maximum"
* - xAI (Grok): "maximum prompt length is X but request contains Y"
* - Groq: "reduce the length of the messages"
* - Cerebras: 413 status code (no body)
* - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
* - OpenRouter (all backends): "maximum context length is X tokens"
* - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
* - llama.cpp: "exceeds the available context size"
* - LM Studio: "greater than the context length"
* - Kimi For Coding: "exceeded model token limit: X (requested: Y)"
* - z.ai: "tokens in request more than max tokens allowed" or "Prompt exceeds max length"
*
* **Unreliable detection:**
* - z.ai: Sometimes accepts overflow silently (detectable via usage.input > contextWindow),
*   sometimes returns rate limit errors instead of the explicit overflow error above. Pass
*   contextWindow param to detect silent overflow.
* - Xiaomi MiMo: Truncates input to fit contextWindow then returns stopReason "length" with
*   output=0. Pass contextWindow param to detect via the "filled context + zero output" signal.
* - Ollama: May truncate input silently for some setups, but may also return explicit
*   overflow errors that match the patterns above. Silent truncation still cannot be
*   detected here because we do not know the expected token count.
*
* ## Custom Providers
*
* If you've added custom models via settings.json, this function may not detect
* overflow errors from those providers. To add support:
*
* 1. Send a request that exceeds the model's context window
* 2. Check the errorMessage in the response
* 3. Create a regex pattern that matches the error
* 4. The pattern should be added to the appropriate canonical scope in this file, or
*    check the errorMessage yourself before calling this function
*
* @param message - The assistant message to check
* @param contextWindow - Optional context window size for detecting silent overflow (z.ai)
* @returns true if the message indicates a context overflow
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
export { applyProviderReportedUsageCost, calculateCost, clampThinkingLevel, cleanupSessionResources, clearApiProviders, complete, completeSimple, createDeferredEventBuffer, createFirstStreamEventAbortController, createFirstStreamEventTimeoutError, createReasoningTagTextPartitioner, createSseByteGuard, createToolArgumentPreviewSchedule, decodeOpenAICodexJwtPayload, defaultApiRegistry, defaultLlmRuntime, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getEventStreamCompletion, getFirstStreamEventTimeoutHandler, getFirstStreamEventTimeoutMs, getSupportedThinkingLevels, headersToRecord, isContextOverflow, matchesContextOverflowMessage, modelsAreEqual, notifyLlmRequestActivity, onLlmRequestActivity, parseJsonWithRepair, parseStreamingJson, parseTerminalToolCallArguments, registerSessionResourceCleanup, repairJson, resolveOpenAICodexAccountId, sanitizeSurrogates, shortHash, stream, streamSimple, withFirstStreamEventTimeout };
