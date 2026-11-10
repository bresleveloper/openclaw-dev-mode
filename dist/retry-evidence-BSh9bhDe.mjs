import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { T as parseApiErrorInfo, _ as extractLeadingHttpStatus, g as extractErrorHttpStatus, v as extractProviderWrappedHttpStatus } from "./redact-BcXJu5HP.mjs";
import { n as MALFORMED_SSE_MESSAGE_RE, t as INCOMPLETE_ASSISTANT_STREAM_RE } from "./message-patterns-DSkmGYcR.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
import { i as classifyFailoverReasonFromCode } from "./classification-rules-CaFCPBKV.mjs";
import { RETRY_AFTER_TEXT_RE, parseGoogleRetryDelaySeconds, parseRetryAfterErrorSeconds, parseRetryAfterTextSeconds } from "@openclaw/ai/internal/retry-after";
//#region src/agents/failover/retry-evidence.ts
const RETRYABLE_HTTP_STATUS_CODES = /* @__PURE__ */ new Set([
	429,
	500,
	502,
	503,
	504,
	524
]);
const RATE_LIMIT_RETRY_CONTEXT_RE = /rate.?limit|too many requests|resource[_ -]?exhausted|daily (?:request|usage) limit|requests? per day|tokens? per day|quota[_ -]?exceeded/i;
const TRANSIENT_RETRY_EVIDENCE_RE = /overloaded|rate.?limit|too many requests|service.?unavailable|server.?error|internal.?error|provider.?returned.?error|network.?error|connection.?error|connection.?refused|connection.?lost|other side closed|fetch failed|upstream.?connect|reset before headers|socket hang up|socket connection was closed|timed? out|timeout|terminated|websocket.?closed|websocket.?error|ended without|http2 request did not get a response|retry delay|you can retry your request|try your request again|please retry your request|resource[_ -]?exhausted/i;
const LONG_WINDOW_RATE_LIMIT_RE = /\b(?:daily|weekly|monthly|tokens per day|requests per day|per[- ](?:day|week|month)|usage limits?|subscription|insufficient[_ -]?quota|current quota|quota[_ -]?exceeded|(?:go|free)usagelimiterror|available balance|out of budget)\b/i;
const SHORT_RATE_LIMIT_UNIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm)\b/i;
const SHORT_WINDOW_RATE_LIMIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm|model_cooldown)\b|请求过于频繁|调用频率|频率限制/i;
const RETRY_AFTER_VALUE_RE = RETRY_AFTER_TEXT_RE;
const MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS = 60;
/** HTTP statuses the provider SDK transport permits retrying. */
function isRetryableProviderHttpStatus(status) {
	return status === 408 || status === 409 || status === 429 || status >= 500;
}
/** Extract guarded HTTP status evidence for retry and diagnostic consumers. */
function extractFailoverHttpStatus(message, options) {
	if (!message) return;
	return (options?.includeLabeledStatus ? extractErrorHttpStatus(message) : extractLeadingHttpStatus(message.trim()) ?? extractProviderWrappedHttpStatus(message.trim()))?.code;
}
function resolveRetrySignalStatus(signal) {
	return signal.status ?? extractFailoverHttpStatus(signal.message);
}
/** Narrow evidence that replaying the same assistant request may succeed within this session. */
function hasTransientRetryEvidence(signal) {
	const status = resolveRetrySignalStatus(signal);
	return status !== void 0 && RETRYABLE_HTTP_STATUS_CODES.has(status) || INCOMPLETE_ASSISTANT_STREAM_RE.test(signal.message ?? "") || MALFORMED_SSE_MESSAGE_RE.test(signal.message ?? "") || TRANSIENT_RETRY_EVIDENCE_RE.test(signal.message ?? "") || isTransientNetworkError({ code: signal.code });
}
function hasRateLimitRetryContext(signal) {
	return resolveRetrySignalStatus(signal) === 429 || RATE_LIMIT_RETRY_CONTEXT_RE.test(signal.message ?? "");
}
function proseRetrySeconds(message, nowMs) {
	let floor;
	for (const match of message?.matchAll(new RegExp(RETRY_AFTER_VALUE_RE, "gi")) ?? []) {
		const seconds = parseRetryAfterTextSeconds(match[1]?.trim() ?? "", nowMs);
		if (seconds !== void 0) floor = Math.max(floor ?? 0, seconds);
	}
	return floor;
}
function maxDefined(...values) {
	const defined = values.filter((value) => value !== void 0);
	return defined.length > 0 ? Math.max(...defined) : void 0;
}
/** Explicit retry time in error text: prose hints and serialized google.rpc.RetryInfo. */
function retryTextSeconds(message, nowMs) {
	return maxDefined(parseGoogleRetryDelaySeconds(message), proseRetrySeconds(message, nowMs));
}
/**
* Extracts the provider retry floor from error text and response headers. The greatest
* explicit instruction (Retry-After headers, RetryInfo, retry prose) wins.
*/
function resolveRetryAfterMs(message, nowMs = Date.now(), errorBody) {
	const body = typeof errorBody === "string" ? safeParseJsonRecord(errorBody) : errorBody;
	const seconds = maxDefined(parseRetryAfterErrorSeconds(body, nowMs), retryTextSeconds(message, nowMs), parseGoogleRetryDelaySeconds(errorBody));
	return seconds === void 0 ? void 0 : Math.ceil(seconds * 1e3);
}
/** Usage-window evidence is distinct from a temporary throttle's retry floor. */
function hasLongWindowRateLimitEvidence(message) {
	return Boolean(message && LONG_WINDOW_RATE_LIMIT_RE.test(message) && !SHORT_RATE_LIMIT_UNIT_RE.test(message));
}
/** Explicit shared token-bucket exhaustion, distinct from per-request throttling. */
function hasOrganizationTpmRateLimitEvidence(message) {
	return (message?.match(/\brate limit reached\b[^\r\n]*?\bin organization\b[^:\r\n]*?\bon (tokens|requests) per min(?:ute)?\b/i)?.[1])?.toLowerCase() === "tokens";
}
/** Classify provider rate-limit text without deciding a caller's retry policy. */
function classifyRateLimitWindow(message, nowMs = Date.now()) {
	const raw = message?.trim();
	if (!raw) return { kind: "unknown" };
	const hasShortRateLimitUnit = SHORT_RATE_LIMIT_UNIT_RE.test(raw);
	const retryAfterSeconds = retryTextSeconds(raw, nowMs);
	if (retryAfterSeconds !== void 0) return retryAfterSeconds > MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS ? { kind: "long" } : {
		kind: "short",
		retryAfterSeconds
	};
	if (RETRY_AFTER_VALUE_RE.test(raw) && !hasShortRateLimitUnit) return { kind: "long" };
	if (hasLongWindowRateLimitEvidence(raw)) return { kind: "long" };
	if (SHORT_WINDOW_RATE_LIMIT_RE.test(raw) || extractLeadingHttpStatus(raw)?.code === 429) return { kind: "short" };
	return { kind: "unknown" };
}
/** Apply the intra-attempt replay policy to one already-classified failover signal. */
function shouldRetryFailoverSignal(params) {
	if (!hasTransientRetryEvidence(params.signal)) return false;
	const reason = params.classification?.kind === "reason" ? params.classification.reason : void 0;
	const status = resolveRetrySignalStatus(params.signal);
	if (reason === "format" && (status === void 0 || status >= 500 && status < 600 || (classifyFailoverReasonFromCode(params.signal.code) ?? classifyFailoverReasonFromCode(parseApiErrorInfo(params.signal.message)?.code)) === "format")) return false;
	return !(classifyRateLimitWindow(params.signal.message).kind === "long" && (reason === "billing" || reason === "rate_limit" || hasRateLimitRetryContext(params.signal)));
}
//#endregion
export { isRetryableProviderHttpStatus as a, hasOrganizationTpmRateLimitEvidence as i, extractFailoverHttpStatus as n, resolveRetryAfterMs as o, hasLongWindowRateLimitEvidence as r, shouldRetryFailoverSignal as s, classifyRateLimitWindow as t };
