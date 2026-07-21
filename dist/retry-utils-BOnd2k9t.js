import { o as resolveSafeTimeoutDelayMs } from "./timeouts-DdTImbzl.js";
//#region packages/memory-host-sdk/src/host/retry-utils.ts
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
function asFiniteNumber(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return value;
}
function clampNumber(value, fallback, min, max) {
	const next = asFiniteNumber(value);
	if (next === void 0) return fallback;
	const floor = typeof min === "number" ? min : Number.NEGATIVE_INFINITY;
	const ceiling = typeof max === "number" ? max : Number.POSITIVE_INFINITY;
	return Math.min(Math.max(next, floor), ceiling);
}
function resolveAttempts(value, fallback) {
	if (typeof value !== "number" || !Number.isSafeInteger(value)) return fallback;
	return Math.max(1, value);
}
/** Resolve retry settings with clamped positive timeout values. */
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttempts(overrides?.attempts, defaults.attempts);
	const minDelayMs = resolveSafeTimeoutDelayMs(Math.round(clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0)), { minMs: 0 });
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveSafeTimeoutDelayMs(Math.round(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0)), { minMs: 0 })),
		jitter: clampNumber(overrides?.jitter, defaults.jitter, 0, 1)
	};
}
function applyJitter(delayMs, jitter) {
	if (jitter <= 0) return delayMs;
	const offset = (Math.random() * 2 - 1) * jitter;
	return Math.max(0, Math.round(delayMs * (1 + offset)));
}
/** Run an async operation with exponential backoff retry handling. */
async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
	if (typeof attemptsOrOptions === "number") {
		const attempts = resolveAttempts(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
		let lastErr;
		for (let i = 0; i < attempts; i += 1) try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (i === attempts - 1) break;
			await sleep(resolveSafeTimeoutDelayMs(initialDelayMs * 2 ** i, { minMs: 0 }));
		}
		throw toLintErrorObject(lastErr ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
	}
	const options = attemptsOrOptions;
	const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
	const maxAttempts = resolved.attempts;
	const minDelayMs = resolved.minDelayMs;
	const maxDelayMs = Number.isFinite(resolved.maxDelayMs) && resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
	const shouldRetry = options.shouldRetry ?? (() => true);
	let lastErr;
	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
		return await fn();
	} catch (err) {
		lastErr = err;
		if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
		const retryAfterMs = options.retryAfterMs?.(err);
		const baseDelay = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) ? Math.max(resolveSafeTimeoutDelayMs(retryAfterMs, { minMs: 0 }), minDelayMs) : resolveSafeTimeoutDelayMs(minDelayMs * 2 ** (attempt - 1), { minMs: 0 });
		let delay = Math.min(baseDelay, maxDelayMs);
		delay = applyJitter(delay, resolved.jitter);
		delay = Math.min(Math.max(delay, minDelayMs), maxDelayMs);
		options.onRetry?.({
			attempt,
			maxAttempts,
			delayMs: delay,
			err,
			label: options.label
		});
		if (delay > 0) await sleep(delay);
	}
	throw toLintErrorObject(lastErr ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { toLintErrorObject as n, retryAsync as t };
