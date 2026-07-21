import { n as getEnvApiKey, t as findEnvKeys } from "../env-api-keys-CtMlqaQ4.mjs";
import { n as createApiRegistry, t as createLlmRuntime } from "../stream-CREqxHgU.mjs";
import { a as modelsAreEqual, i as getSupportedThinkingLevels, n as calculateCost, r as clampThinkingLevel, t as applyProviderReportedUsageCost } from "../model-utils-DgmOla96.mjs";
import { n as onLlmRequestActivity, r as createDeferredEventBuffer, t as notifyLlmRequestActivity } from "../llm-request-activity-CehVkZP-.mjs";
import { t as headersToRecord } from "../headers-B_e4-1J0.mjs";
import { n as parseStreamingJson, r as repairJson, t as parseJsonWithRepair } from "../json-parse-DzNSIQBq.mjs";
import { t as sanitizeSurrogates } from "../sanitize-unicode-DT5o51ur.mjs";
import { t as createReasoningTagTextPartitioner } from "../reasoning-tag-text-partitioner-axhAdUwg.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, n as createFirstStreamEventTimeoutError, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "../stream-first-event-timeout-RjWszj8c.mjs";
import { t as shortHash } from "../hash-CHgqbJmD.mjs";
import { i as registerSessionResourceCleanup, n as resolveOpenAICodexAccountId, r as cleanupSessionResources, t as decodeOpenAICodexJwtPayload } from "../openai-chatgpt-jwt-DhAAzLkj.mjs";
import { t as createSseByteGuard } from "../streaming-byte-guard-BrbkbwUu.mjs";
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
const { registerApiProvider, getApiProvider, getApiProviders, unregisterApiProviders, clearApiProviders } = defaultApiRegistry;
const { stream, complete, streamSimple, completeSimple } = defaultLlmRuntime;
//#endregion
//#region packages/ai/src/utils/overflow.ts
const CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE = /prompt has [\d,]+ tokens?, but the configured context size is [\d,]+ tokens?/i;
/** Detects DS4-style raw token-count context overflow errors. */
function isConfiguredContextSizeOverflowError(errorMessage) {
	return CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE.test(errorMessage);
}
/**
* Regex patterns to detect context overflow errors from different providers.
*
* These patterns match error messages returned when the input exceeds
* the model's context window.
*
* Provider-specific patterns (with example error messages):
*
* - Anthropic: "prompt is too long: 213462 tokens > 200000 maximum"
* - Anthropic: "413 {\"error\":{\"type\":\"request_too_large\",\"message\":\"Request exceeds the maximum size\"}}"
* - OpenAI: "Your input exceeds the context window of this model"
* - OpenAI/LiteLLM: "Requested token count exceeds the model's maximum context length of 131072 tokens"
* - Google: "The input token count (1196265) exceeds the maximum number of tokens allowed (1048575)"
* - xAI: "This model's maximum prompt length is 131072 but the request contains 537812 tokens"
* - Groq: "Please reduce the length of the messages or completion"
* - OpenRouter: "This endpoint's maximum context length is X tokens. However, you requested about Y tokens"
* - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
* - llama.cpp: "the request exceeds the available context size, try increasing it"
* - LM Studio: "tokens to keep from the initial prompt is greater than the context length"
* - GitHub Copilot: "prompt token count of X exceeds the limit of Y"
* - MiniMax: "invalid params, context window exceeds limit"
* - Kimi For Coding: "Your request exceeded model token limit: X (requested: Y)"
* - Cerebras: "400/413 status code (no body)"
* - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
* - z.ai: Does NOT error, accepts overflow silently - handled via usage.input > contextWindow
* - Xiaomi MiMo: Truncates input to fill contextWindow exactly, then returns finish_reason "length"
*   with output=0 (no room left to generate). Detected via stopReason "length" + zero output +
*   input filling the context window.
* - Ollama: Some deployments truncate silently, others return errors like "prompt too long; exceeded max context length by X tokens"
*/
const OVERFLOW_PATTERNS = [
	/prompt is too long/i,
	/request_too_large/i,
	/input is too long for requested model/i,
	/exceeds the context window/i,
	/exceeds (?:the )?(?:model'?s )?maximum context length of [\d,]+ tokens?/i,
	/input token count.*exceeds the maximum/i,
	/maximum prompt length is \d+/i,
	/reduce the length of the messages/i,
	/maximum context length is \d+ tokens/i,
	/input \(\d+ tokens\) is longer than the model'?s context length \(\d+ tokens\)/i,
	/exceeds the limit of \d+/i,
	/exceeds the available context size/i,
	/greater than the context length/i,
	/context window exceeds limit/i,
	/exceeded model token limit/i,
	/too large for model with \d+ maximum context length/i,
	CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE,
	/model_context_window_exceeded/i,
	/prompt too long; exceeded (?:max )?context length/i,
	/context[_ ]length[_ ]exceeded/i,
	/too many tokens/i,
	/token limit exceeded/i,
	/^4(?:00|13)\s*(?:status code)?\s*\(no body\)/i
];
/**
* Patterns that indicate non-overflow errors (e.g. rate limiting, server errors).
* Error messages matching unknown of these are excluded from overflow detection
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
	return message.usage.input + message.usage.cacheRead;
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
* - Cerebras: 400/413 status code (no body)
* - Mistral: "Prompt contains X tokens ... too large for model with Y maximum context length"
* - OpenRouter (all backends): "maximum context length is X tokens"
* - Together AI: "The input (X tokens) is longer than the model's context length (Y tokens)."
* - llama.cpp: "exceeds the available context size"
* - LM Studio: "greater than the context length"
* - Kimi For Coding: "exceeded model token limit: X (requested: Y)"
*
* **Unreliable detection:**
* - z.ai: Sometimes accepts overflow silently (detectable via usage.input > contextWindow),
*   sometimes returns rate limit errors. Pass contextWindow param to detect silent overflow.
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
* 4. The pattern should be added to OVERFLOW_PATTERNS in this file, or
*    check the errorMessage yourself before calling this function
*
* @param message - The assistant message to check
* @param contextWindow - Optional context window size for detecting silent overflow (z.ai)
* @returns true if the message indicates a context overflow
*/
function isContextOverflow(message, contextWindow) {
	if (message.stopReason === "error" && message.errorMessage) {
		if (!NON_OVERFLOW_PATTERNS.some((p) => p.test(message.errorMessage)) && OVERFLOW_PATTERNS.some((p) => p.test(message.errorMessage))) return true;
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
export { applyProviderReportedUsageCost, calculateCost, clampThinkingLevel, cleanupSessionResources, clearApiProviders, complete, completeSimple, createDeferredEventBuffer, createFirstStreamEventAbortController, createFirstStreamEventTimeoutError, createReasoningTagTextPartitioner, createSseByteGuard, decodeOpenAICodexJwtPayload, defaultApiRegistry, defaultLlmRuntime, findEnvKeys, getApiProvider, getApiProviders, getEnvApiKey, getFirstStreamEventTimeoutHandler, getFirstStreamEventTimeoutMs, getSupportedThinkingLevels, headersToRecord, isConfiguredContextSizeOverflowError, isContextOverflow, modelsAreEqual, notifyLlmRequestActivity, onLlmRequestActivity, parseJsonWithRepair, parseStreamingJson, registerApiProvider, registerSessionResourceCleanup, repairJson, resolveOpenAICodexAccountId, sanitizeSurrogates, shortHash, stream, streamSimple, unregisterApiProviders, withFirstStreamEventTimeout };
