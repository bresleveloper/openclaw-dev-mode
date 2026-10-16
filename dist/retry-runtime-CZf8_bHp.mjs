import { c as resolveRetryConfig } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./backoff-BrzXG7iD.mjs";
import "./retry-after-D_Ri68m5.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import "./retryable-network-errors-D2gJmBqw.mjs";
//#region src/infra/retry-policy.ts
/** Default retry envelope for channel API operations that hit transient network edges. */
const CHANNEL_API_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 400,
	maxDelayMs: 3e4,
	jitter: .1
};
const CHANNEL_API_RETRY_RE = /429|421|timeout|connect|reset|closed|unavailable|temporarily|misdirected request/i;
const log = createSubsystemLogger("retry-policy");
function resolveChannelApiShouldRetry(params) {
	if (!params.shouldRetry) return (err) => CHANNEL_API_RETRY_RE.test(formatErrorMessage(err));
	if (params.strictShouldRetry) return params.shouldRetry;
	return (err, attempt) => params.shouldRetry?.(err, attempt) || CHANNEL_API_RETRY_RE.test(formatErrorMessage(err));
}
function getChannelApiRetryAfterMs(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "parameters" in err && err.parameters && typeof err.parameters === "object" ? err.parameters.retry_after : "response" in err && err.response && typeof err.response === "object" && "parameters" in err.response ? err.response.parameters?.retry_after : "error" in err && err.error && typeof err.error === "object" && "parameters" in err.error ? err.error.parameters?.retry_after : void 0;
	return typeof candidate === "number" && Number.isFinite(candidate) ? candidate * 1e3 : void 0;
}
/** Creates a generic rate-limit-aware retry runner from explicit retry policy pieces. */
function createRateLimitRetryRunner(params) {
	const retryConfig = resolveRetryConfig(params.defaults, {
		...params.configRetry,
		...params.retry
	});
	return (fn, label) => retryAsync(fn, {
		...retryConfig,
		label,
		shouldRetry: params.shouldRetry,
		retryAfterMs: params.retryAfterMs,
		onRetry: params.verbose ? (info) => {
			const labelText = info.label ?? "request";
			const maxRetries = Math.max(1, info.maxAttempts - 1);
			log.warn(`${params.logLabel} ${labelText} rate limited, retry ${info.attempt}/${maxRetries} in ${info.delayMs}ms`);
		} : void 0
	});
}
/** Creates the channel API retry runner used by outbound messaging integrations. */
function createChannelApiRetryRunner(params) {
	const retryConfig = resolveRetryConfig(CHANNEL_API_RETRY_DEFAULTS, {
		...params.configRetry,
		...params.retry
	});
	const shouldRetry = resolveChannelApiShouldRetry(params);
	return (fn, label) => retryAsync(fn, {
		...retryConfig,
		label,
		shouldRetry,
		retryAfterMs: params.retryAfterMs ?? getChannelApiRetryAfterMs,
		...params.retryAfterMaxDelayMs !== void 0 ? { retryAfterMaxDelayMs: params.retryAfterMaxDelayMs } : {},
		onRetry: params.verbose ? (info) => {
			const maxRetries = Math.max(1, info.maxAttempts - 1);
			log.warn(`channel send retry ${info.attempt}/${maxRetries} for ${info.label ?? label ?? "request"} in ${info.delayMs}ms: ${formatErrorMessage(info.err)}`);
		} : void 0
	});
}
//#endregion
//#region src/plugin-sdk/retry-runtime.ts
/** Transient failures that prove the request did not reach the remote server. */
const PRE_CONNECT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ENETUNREACH",
	"ENOTFOUND",
	"UND_ERR_CONNECT_TIMEOUT"
]);
/** Network failures that are transient for idempotent or deduplicated requests. */
const TRANSIENT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	...PRE_CONNECT_NETWORK_ERROR_CODES,
	"ECONNRESET",
	"EPIPE",
	"ETIMEDOUT",
	"UND_ERR_BODY_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_SOCKET"
]);
/** Classifies a normalized transport code without imposing a plugin-specific error shape. */
function classifyTransientNetworkErrorCode(code) {
	const normalized = code?.trim().toUpperCase();
	if (!normalized) return;
	if (PRE_CONNECT_NETWORK_ERROR_CODES.has(normalized)) return "pre-connect";
	return TRANSIENT_NETWORK_ERROR_CODES.has(normalized) ? "ambiguous" : void 0;
}
//#endregion
export { createRateLimitRetryRunner as i, CHANNEL_API_RETRY_DEFAULTS as n, createChannelApiRetryRunner as r, classifyTransientNetworkErrorCode as t };
