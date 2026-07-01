import { j as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS, s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { u as toErrorObject } from "./errors-DCRXIYSQ.js";
import { v as sleep } from "./utils-BApvfmPs.js";
import "./number-coercion-EqFmHmOw.js";
import { t as generateSecureFraction } from "./secure-random-Ds4AFLgz.js";
//#region src/infra/retry.ts
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
const clampNumber = (value, fallback, min, max) => {
	const next = asFiniteNumber(value);
	if (next === void 0) return fallback;
	const floor = typeof min === "number" ? min : Number.NEGATIVE_INFINITY;
	const ceiling = typeof max === "number" ? max : Number.POSITIVE_INFINITY;
	return Math.min(Math.max(next, floor), ceiling);
};
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(typeof value === "number" && Number.isFinite(value) ? value : fallback));
}
function resolveRetryDelayMs(value) {
	if (value === Number.POSITIVE_INFINITY) return MAX_TIMER_TIMEOUT_MS;
	return resolveTimerTimeoutMs(value, 0, 0);
}
/** Resolves retry config overrides into clamped timer-safe settings. */
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttemptCount(clampNumber(overrides?.attempts, defaults.attempts, 1), defaults.attempts);
	const minDelayMs = resolveRetryDelayMs(Math.round(clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0)));
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveRetryDelayMs(Math.round(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0)))),
		jitter: clampNumber(overrides?.jitter, defaults.jitter, 0, 1)
	};
}
function applyJitter(delayMs, jitter, mode = "symmetric") {
	if (jitter <= 0) return delayMs;
	const fraction = generateSecureFraction();
	const raw = delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
	return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
/** Runs an async operation until it succeeds, retry policy stops, or attempts are exhausted. */
async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
	if (typeof attemptsOrOptions === "number") {
		const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
		let lastErr;
		for (let i = 0; i < attempts; i += 1) try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (i === attempts - 1) break;
			await sleep(resolveRetryDelayMs(initialDelayMs * 2 ** i));
		}
		throw toErrorObject(lastErr ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
	}
	const options = attemptsOrOptions;
	const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
	const maxAttempts = resolved.attempts;
	const minDelayMs = resolved.minDelayMs;
	const maxDelayMs = Number.isFinite(resolved.maxDelayMs) && resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
	const jitter = resolved.jitter;
	const shouldRetry = options.shouldRetry ?? (() => true);
	let lastErr;
	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
		return await fn();
	} catch (err) {
		lastErr = err;
		if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
		const retryAfterMs = options.retryAfterMs?.(err);
		const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
		const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : minDelayMs * 2 ** (attempt - 1);
		let delay = Math.min(baseDelay, maxDelayMs);
		delay = applyJitter(delay, jitter, hasRetryAfter && typeof retryAfterMs === "number" && retryAfterMs <= maxDelayMs ? "positive" : "symmetric");
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
	throw toErrorObject(lastErr ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
}
//#endregion
export { retryAsync as n, resolveRetryConfig as t };
