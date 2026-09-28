import { a as isProviderRefusalAssistantError } from "./diagnostics-DzrF1h4J.mjs";
import { n as normalizeLowercaseStringOrEmpty } from "./string-coerce-fsri9iCu.mjs";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import "./provider-error-CRhW7lkJ.mjs";
import { r as asFiniteNumber } from "./base64-CPmadnUf.mjs";
//#region packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
/**
* Normalizes an unknown thrown value into an Error. Non-Error objects become
* the `cause` and have their enumerable fields copied so structured details
* (codes, statuses) survive the coercion.
*/
function toErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	if (typeof code === "string") return code;
	if (typeof code === "number") return String(code);
}
function readErrorName(err) {
	if (!err || typeof err !== "object") return "";
	const name = err.name;
	return typeof name === "string" ? name : "";
}
function collectErrorGraphCandidates(err, resolveNested) {
	if (err == null) return [];
	const candidates = [err];
	const seen = (/* @__PURE__ */ new Set()).add(err);
	for (const current of candidates) {
		if (!current || typeof current !== "object" || !resolveNested) continue;
		for (const nested of resolveNested(current)) if (nested != null && !seen.has(nested)) {
			seen.add(nested);
			candidates.push(nested);
		}
	}
	return candidates;
}
function extractErrorCodeOrErrno(err) {
	const code = extractErrorCode(err);
	if (code) return code.trim().toUpperCase();
	if (!err || typeof err !== "object") return;
	const errno = err.errno;
	if (typeof errno === "string" && errno.trim()) return errno.trim().toUpperCase();
	if (typeof errno === "number" && Number.isFinite(errno)) return String(errno);
}
function collectNestedErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [
			readProperty(current, "cause"),
			readProperty(current, "reason"),
			readProperty(current, "original"),
			readProperty(current, "error"),
			readProperty(current, "suppressed"),
			readProperty(current, "data")
		];
		const errors = readProperty(current, "errors");
		if (Array.isArray(errors)) nested.push(...errors);
		return nested;
	});
}
//#endregion
//#region packages/normalization-core/src/json-coercion.ts
/** Parses JSON without throwing, returning undefined for invalid input. */
function safeParseJson(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
/** Parses JSON into a non-array record, returning undefined for every other result. */
function safeParseJsonRecord(value) {
	return /^[\t\n\r ]*\{/.test(value) ? asOptionalRecord(safeParseJson(value)) : void 0;
}
//#endregion
//#region packages/ai/src/providers/openai-responses-terminal-usage.ts
/**
* Canonical mapping for terminal OpenAI Responses events.
*
* `response.completed`, `response.incomplete`, and `response.failed` are terminal and can carry
* usage, so every Responses path finalizes through the helpers here. Keeping one owner prevents
* package and managed transports from drifting on token buckets, service-tier pricing, or future
* terminal-event semantics.
*/
/** A known output ceiling can resume sampling after admitted tools have settled. */
function isResponsesOutputLimitToolCallError(message) {
	return message.stopReason === "error" && message.errorCode === "incomplete_tool_call" && !isProviderRefusalAssistantError(message) && message.diagnostics?.some(({ type, details }) => type === "openai_responses_terminal" && details?.eventType === "response.incomplete" && details.stopReason === "length" && details.incompleteReason === "max_output_tokens") === true;
}
function readReportedCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function readCount(value) {
	return readReportedCount(value) ?? 0;
}
/**
* Split a terminal usage payload into the priced buckets.
*
* OpenAI includes cache reads and writes in `input_tokens`, so both are subtracted out of the
* billable input bucket. `total_tokens` comes from the payload, but never below the sum of the
* split buckets: proxies routinely omit it (reporting 0 would understate the turn), and a payload
* whose `cached_tokens` exceeds `input_tokens` clamps the input bucket, leaving the reported total
* short of what the buckets actually price.
*/
function mapResponsesTerminalUsage(usage) {
	if (!usage) return;
	const cacheRead = readCount(usage.input_tokens_details?.cached_tokens);
	const cacheWrite = readCount(usage.input_tokens_details?.cache_write_tokens);
	const input = Math.max(0, readCount(usage.input_tokens) - cacheRead - cacheWrite);
	const output = readCount(usage.output_tokens);
	const bucketTotal = input + output + cacheRead + cacheWrite;
	const totalTokens = Math.max(bucketTotal, readCount(usage.total_tokens));
	const reportedInput = readReportedCount(usage.input_tokens);
	const reportedOutput = readReportedCount(usage.output_tokens);
	const reportedTotal = readReportedCount(usage.total_tokens);
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		contextUsage: reportedInput !== void 0 && (reportedOutput !== void 0 || reportedTotal !== void 0 && reportedTotal >= reportedInput) && cacheRead + cacheWrite <= reportedInput ? {
			state: "available",
			promptTokens: reportedInput,
			totalTokens: Math.max(totalTokens, reportedInput + (reportedOutput ?? 0))
		} : { state: "unavailable" },
		totalTokens
	};
}
/** Reasoning tokens are reported by the agent path only; the package path does not track them. */
function readResponsesReasoningTokens(usage) {
	return asFiniteNumber(usage?.output_tokens_details?.reasoning_tokens);
}
function mapResponsesTerminalStopReason(status) {
	if (!status) return "stop";
	switch (status) {
		case "completed": return "stop";
		case "incomplete": return "length";
		case "failed":
		case "cancelled": return "error";
		case "in_progress":
		case "queued": return "stop";
		default: throw new Error(`Unhandled stop reason: ${String(status)}`);
	}
}
/**
* Resolve the terminal stop reason, including the two overrides every Responses path shares: a
* content-filtered turn is a provider error rather than a truncated answer, and a turn that
* produced tool calls reports `toolUse` instead of a plain stop.
*/
function resolveResponsesTerminalStopReason(params) {
	const status = params.status ?? (params.terminalEventType === "response.incomplete" ? "incomplete" : void 0);
	if (status === "incomplete" && params.incompleteReason === "content_filter") return {
		stopReason: "error",
		errorMessage: "Provider incomplete_reason: content_filter"
	};
	const stopReason = mapResponsesTerminalStopReason(status);
	if (stopReason === "stop" && params.hasToolCall) return { stopReason: "toolUse" };
	return { stopReason };
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-errors.ts
const OUTPUT_IDENTITY_ERROR_CODE = "responses_output_identity_conflict";
function outputType(type) {
	return type === "reasoning" || type === "message" || type === "function_call" || type === "compaction" ? type : "other";
}
function isResponsesProviderTool(item) {
	return outputType(item.type) === "other";
}
/** Inspect the admitted request, including payload-hook changes and transport retries. */
function hasOnlyResponsesFunctionTools(request) {
	return request !== void 0 && (request.tools === void 0 || Array.isArray(request.tools) && request.tools.every((tool) => isRecord(tool) && tool.type === "function"));
}
var ResponsesOutputIdentityError = class extends Error {
	constructor(details) {
		super("Responses stream changed output item identity");
		this.code = OUTPUT_IDENTITY_ERROR_CODE;
		this.name = "ResponsesOutputIdentityError";
		this.errorBody = JSON.stringify({
			...details,
			expectedType: outputType(details.expectedType),
			actualType: outputType(details.actualType),
			mismatch: details.expectedType !== details.actualType ? "type" : "call_id",
			eventType: details.eventType === "response.output_item.added" || details.eventType === "response.output_item.done" || details.eventType === "response.completed" || details.eventType === "response.incomplete" ? details.eventType : "unknown",
			retrySafe: details.retrySafe && !details.completedToolCall
		});
	}
};
/** Resume only a response that could not have completed tools or exposed visible output. */
function resolveResponsesOutputIdentityRetry(message) {
	if (message.errorCode !== OUTPUT_IDENTITY_ERROR_CODE) return;
	return message.stopReason === "error" && message.content?.every((block) => block.type === "thinking" || block.type === "text" && block.text.length === 0) === true && safeParseJsonRecord(message.errorBody ?? "")?.retrySafe === true ? "retry" : "stop";
}
//#endregion
//#region packages/ai/src/utils/retryable-network-errors.ts
const WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE = "ERR_WEBSOCKET_NON_RETRYABLE_CLOSE";
const TRANSIENT_NETWORK_CODES = /* @__PURE__ */ new Set([
	"ECONNRESET",
	"ECONNREFUSED",
	"ENOTFOUND",
	"ETIMEDOUT",
	"ESOCKETTIMEDOUT",
	"ECONNABORTED",
	"EPIPE",
	"ENETDOWN",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"EADDRNOTAVAIL",
	"EAI_AGAIN",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_DNS_RESOLVE_FAILED",
	"UND_ERR_CONNECT",
	"UND_ERR_SOCKET",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_BODY_TIMEOUT",
	"ERR_HTTP2_INVALID_SESSION",
	"EPROTO",
	"ERR_SSL_WRONG_VERSION_NUMBER",
	"ERR_SSL_PROTOCOL_RETURNED_AN_ERROR",
	"ERR_WEBSOCKET_TRANSPORT"
]);
const TRANSIENT_NETWORK_ERROR_NAMES = /* @__PURE__ */ new Set([
	"AbortError",
	"ConnectTimeoutError",
	"HeadersTimeoutError",
	"BodyTimeoutError",
	"TimeoutError"
]);
const TRANSIENT_NETWORK_MESSAGE_CODE_RE = /\b(ECONNRESET|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ESOCKETTIMEDOUT|ECONNABORTED|EPIPE|ENETDOWN|EHOSTUNREACH|ENETUNREACH|EADDRNOTAVAIL|EAI_AGAIN|EPROTO|UND_ERR_CONNECT_TIMEOUT|UND_ERR_DNS_RESOLVE_FAILED|UND_ERR_CONNECT|UND_ERR_SOCKET|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|ERR_HTTP2_INVALID_SESSION)\b/i;
const TRANSIENT_NETWORK_MESSAGE_SNIPPETS = [
	"getaddrinfo",
	"socket hang up",
	"client network socket disconnected before secure tls connection was established",
	"network error",
	"network is unreachable",
	"temporary failure in name resolution",
	"upstream connect error",
	"disconnect/reset before headers",
	"tlsv1 alert",
	"ssl routines",
	"packet length too long",
	"write eproto"
];
const RETRYABLE_CONNECTION_ERROR_CODE_RE = /\b(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|EHOSTUNREACH|ENETUNREACH|EAI_AGAIN|UND_ERR_SOCKET)\b/i;
function isWrappedFetchFailedMessage(message) {
	if (message === "fetch failed") return true;
	return /:\s*fetch failed$/.test(message);
}
function hasRetryableConnectionErrorCode(message) {
	return RETRYABLE_CONNECTION_ERROR_CODE_RE.test(message);
}
/** Returns true when any nested error proves a transient network failure. */
function isTransientNetworkError(err) {
	if (!err) return false;
	const candidates = collectNestedErrorCandidates(err);
	if (candidates.some((candidate) => extractErrorCodeOrErrno(candidate) === "ERR_WEBSOCKET_NON_RETRYABLE_CLOSE")) return false;
	for (const candidate of candidates) {
		const code = extractErrorCodeOrErrno(candidate);
		if (code && TRANSIENT_NETWORK_CODES.has(code)) return true;
		const name = readErrorName(candidate);
		if (name && TRANSIENT_NETWORK_ERROR_NAMES.has(name)) return true;
		if (!candidate || typeof candidate !== "object") continue;
		const message = normalizeLowercaseStringOrEmpty(candidate.message);
		if (!message) continue;
		if (TRANSIENT_NETWORK_MESSAGE_CODE_RE.test(message)) return true;
		if (isWrappedFetchFailedMessage(message)) return true;
		if (TRANSIENT_NETWORK_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet))) return true;
	}
	return false;
}
//#endregion
//#region packages/ai/src/transports/model-transport-debug.ts
/**
* Environment-driven debug controls for model transport logging.
*
* Model adapters share these helpers so payload, SSE, and transport diagnostics
* interpret OpenClaw debug environment variables consistently.
*/
function isTruthyEnv(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized.length > 0 && normalized !== "0" && normalized !== "false" && normalized !== "off" && normalized !== "no";
}
/** Resolves model payload debug verbosity from `OPENCLAW_DEBUG_MODEL_PAYLOAD`. */
function resolveModelPayloadDebugMode(env = process.env) {
	const normalized = normalizeLowercaseStringOrEmpty(env.OPENCLAW_DEBUG_MODEL_PAYLOAD);
	if (normalized === "tools" || normalized === "full-redacted") return normalized;
	if (normalized === "summary") return "summary";
	return "off";
}
/** Resolves SSE stream debug verbosity from `OPENCLAW_DEBUG_SSE`. */
function resolveModelSseDebugMode(env = process.env) {
	const normalized = normalizeLowercaseStringOrEmpty(env.OPENCLAW_DEBUG_SSE);
	if (normalized === "peek") return "peek";
	if (normalized === "events" || isTruthyEnv(normalized)) return "events";
	return "off";
}
/** Returns whether any model transport debug channel is enabled. */
function isModelTransportDebugEnabled(env = process.env) {
	return isTruthyEnv(env.OPENCLAW_DEBUG_MODEL_TRANSPORT) || resolveModelPayloadDebugMode(env) !== "off" || resolveModelSseDebugMode(env) !== "off" || isTruthyEnv(env.OPENCLAW_DEBUG_CODE_MODE);
}
/** Emits transport diagnostics at debug, promoted to info by explicit debug flags. */
function emitModelTransportDebug(log, message) {
	if (isModelTransportDebugEnabled()) {
		log.info(message);
		return;
	}
	log.debug(message);
}
//#endregion
//#region packages/ai/src/transports/model-transport-url.ts
/**
* Debug formatting helpers for model transport endpoints.
* Keeps logs useful without exposing credentials, request params, or fragments.
*/
/** Return a sanitized URL suitable for logs and diagnostics. */
function formatModelTransportDebugUrl(rawUrl) {
	try {
		const parsed = new URL(rawUrl);
		parsed.username = "";
		parsed.password = "";
		parsed.search = "";
		parsed.hash = "";
		return parsed.toString();
	} catch {
		return "<invalid-url>";
	}
}
/** Format a configured base URL for debug output, or the implicit default. */
function formatModelTransportDebugBaseUrl(rawUrl) {
	return rawUrl ? formatModelTransportDebugUrl(rawUrl) : "default";
}
//#endregion
export { extractErrorCodeOrErrno as _, resolveModelSseDebugMode as a, isTransientNetworkError as c, isResponsesProviderTool as d, resolveResponsesOutputIdentityRetry as f, resolveResponsesTerminalStopReason as g, readResponsesReasoningTokens as h, resolveModelPayloadDebugMode as i, ResponsesOutputIdentityError as l, mapResponsesTerminalUsage as m, formatModelTransportDebugUrl as n, WEBSOCKET_NON_RETRYABLE_CLOSE_ERROR_CODE as o, isResponsesOutputLimitToolCallError as p, emitModelTransportDebug as r, hasRetryableConnectionErrorCode as s, formatModelTransportDebugBaseUrl as t, hasOnlyResponsesFunctionTools as u, toErrorObject as v };
