import { a as isProviderRefusalAssistantError } from "./diagnostics-DzrF1h4J.mjs";
//#region packages/ai/src/utils/overflow.ts
const CONFIGURED_CONTEXT_SIZE_OVERFLOW_RE = /prompt has [\d,]+ tokens?, but the configured context size is [\d,]+ tokens?/i;
const REQUEST_BUDGET_OVERFLOW_RE = /context window exceeded: estimated input \d+ leaves only \d+ output tokens within the \d+-token context\./i;
const CONTEXT_OVERFLOW_PATTERN_SCOPES = {
	"assistant-error": [
		REQUEST_BUDGET_OVERFLOW_RE,
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
		/decoder prompt \(length [\d,]+\)(?: plus the number of requested output tokens \(at least 1\))? is longer than the maximum model length of [\d,]+/i,
		/engine prompt length [\d,]+ exceeds the max_model_len [\d,]+/i,
		/`?inputs`? tokens \+ `?max_new_tokens`? must be <= [\d,]+/i,
		/`?inputs`? must have less than [\d,]+ tokens/i,
		/greater than the context length|model is loaded with context length of only \d[\d,]* tokens, which is not enough/i,
		/context window exceeds limit/i,
		/exceeded model token limit/i,
		/tokens? in request more than max tokens? allowed/i,
		/prompt exceeds max(?:imum)? length/i,
		/range of input length should be \[1, [\d,]+\]/i,
		/length of prompt_tokens \([\d,]+\) must be less than max_seq_len \([\d,]+\)/i,
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
		REQUEST_BUDGET_OVERFLOW_RE,
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
		/`?inputs`? tokens \+ `?max_new_tokens`? must be <= [\d,]+/i,
		/`?inputs`? must have less than [\d,]+ tokens/i,
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
export { matchesContextOverflowMessage as n, isContextOverflow as t };
