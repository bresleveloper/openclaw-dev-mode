import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { D as extractLeadingHttpStatus, E as extractErrorHttpStatus, F as parseApiErrorInfo, O as extractProviderWrappedHttpStatus } from "./redact-DJ8j6ADa.mjs";
import { t as durationUnitMs } from "./duration-units-DX2PgIpo.mjs";
import { t as INCOMPLETE_ASSISTANT_STREAM_RE } from "./message-patterns-Oyttjfxg.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
import { i as classifyFailoverReasonFromCode } from "./classification-rules-CID2woQZ.mjs";
import { parseRetryAfterErrorSeconds, parseRetryAfterHttpDateMs } from "@openclaw/ai/internal/retry-after";
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
const LONG_WINDOW_RATE_LIMIT_RE = /\b(?:daily|weekly|monthly|tokens per day|requests per day|per[- ](?:day|week|month)|usage limit|subscription|insufficient[_ -]?quota|current quota|quota[_ -]?exceeded|(?:go|free)usagelimiterror|available balance|out of budget)\b/i;
const SHORT_RATE_LIMIT_UNIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm)\b/i;
const SHORT_WINDOW_RATE_LIMIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm|model_cooldown)\b|请求过于频繁|调用频率|频率限制/i;
const RETRY_AFTER_VALUE_RE = /\b(?:retry[- ]after\b\s*:?\s*(?:in\b\s*)?|(?:please\s+)?try again in\s+)([^\r\n;]+)/i;
const RETRY_AFTER_NUMBER_RE = /^(\d+(?:\.\d+)?|Infinity)\s*([a-z]+)?\b/i;
const RETRY_AFTER_UNIT_MS = /* @__PURE__ */ new Map([
	["milliseconds", durationUnitMs.millisecond],
	["millisecond", durationUnitMs.millisecond],
	["msecs", durationUnitMs.millisecond],
	["msec", durationUnitMs.millisecond],
	["ms", durationUnitMs.millisecond],
	["seconds", durationUnitMs.second],
	["second", durationUnitMs.second],
	["secs", durationUnitMs.second],
	["sec", durationUnitMs.second],
	["s", durationUnitMs.second],
	["minutes", durationUnitMs.minute],
	["minute", durationUnitMs.minute],
	["mins", durationUnitMs.minute],
	["min", durationUnitMs.minute],
	["m", durationUnitMs.minute],
	["hours", durationUnitMs.hour],
	["hour", durationUnitMs.hour],
	["hrs", durationUnitMs.hour],
	["hr", durationUnitMs.hour],
	["h", durationUnitMs.hour],
	["days", durationUnitMs.day],
	["day", durationUnitMs.day],
	["d", durationUnitMs.day]
]);
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
	return status !== void 0 && RETRYABLE_HTTP_STATUS_CODES.has(status) || INCOMPLETE_ASSISTANT_STREAM_RE.test(signal.message ?? "") || TRANSIENT_RETRY_EVIDENCE_RE.test(signal.message ?? "") || isTransientNetworkError({ code: signal.code });
}
function hasRateLimitRetryContext(signal) {
	return resolveRetrySignalStatus(signal) === 429 || RATE_LIMIT_RETRY_CONTEXT_RE.test(signal.message ?? "");
}
function parseRetryAfterSeconds(valueText, nowMs) {
	const secondsMatch = RETRY_AFTER_NUMBER_RE.exec(valueText);
	if (secondsMatch?.[1]) {
		const value = /^infinity$/i.test(secondsMatch[1]) ? Infinity : Number(secondsMatch[1]);
		if (Number.isNaN(value) || value < 0) return;
		const unit = secondsMatch[2]?.toLowerCase();
		const unitMilliseconds = RETRY_AFTER_UNIT_MS.get(unit ?? "s");
		if (unitMilliseconds === void 0) return;
		return unitMilliseconds === durationUnitMs.millisecond ? value / durationUnitMs.second : value * (unitMilliseconds / durationUnitMs.second);
	}
	const retryAtMs = parseRetryAfterHttpDateMs(valueText, nowMs);
	return retryAtMs === void 0 ? void 0 : Math.max(0, (retryAtMs - nowMs) / 1e3);
}
function retryTextSeconds(message, nowMs) {
	let floor;
	for (const match of message?.matchAll(new RegExp(RETRY_AFTER_VALUE_RE, "gi")) ?? []) {
		const seconds = parseRetryAfterSeconds(match[1]?.trim() ?? "", nowMs);
		if (seconds !== void 0) floor = Math.max(floor ?? 0, seconds);
	}
	return floor;
}
/** Extracts the provider retry floor from error text and response headers. */
function resolveRetryAfterMs(message, nowMs = Date.now(), errorBody) {
	const body = typeof errorBody === "string" ? safeParseJsonRecord(errorBody) : errorBody;
	const headerSeconds = parseRetryAfterErrorSeconds(body, nowMs);
	const seconds = retryTextSeconds(message, nowMs);
	return headerSeconds === void 0 && seconds === void 0 ? void 0 : Math.ceil(Math.max(headerSeconds ?? 0, seconds ?? 0) * 1e3);
}
/** Usage-window evidence is distinct from a temporary throttle's retry floor. */
function hasLongWindowRateLimitEvidence(message) {
	return Boolean(message && LONG_WINDOW_RATE_LIMIT_RE.test(message) && !SHORT_RATE_LIMIT_UNIT_RE.test(message));
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
	if (classifyRateLimitWindow(params.signal.message).kind === "long" && (reason === "billing" || reason === "rate_limit" || hasRateLimitRetryContext(params.signal))) return false;
	return true;
}
//#endregion
export { resolveRetryAfterMs as a, isRetryableProviderHttpStatus as i, extractFailoverHttpStatus as n, shouldRetryFailoverSignal as o, hasLongWindowRateLimitEvidence as r, classifyRateLimitWindow as t };
