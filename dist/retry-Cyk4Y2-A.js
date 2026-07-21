import { j as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS, s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { t as toErrorObject } from "./error-coercion-DgxlWC0n.js";
import "./errors-sMD712F3.js";
import "./utils-CRO4LGEB.js";
import "./number-coercion-EqFmHmOw.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { n as recordRetryAttemptErrors, t as getRetryAttemptErrors } from "./retry-attempt-errors-BSlvmGqS.js";
import { t as generateSecureFraction } from "./secure-random-Ds4AFLgz.js";
//#region src/infra/retry.ts
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
function appendRetryAttemptError(attemptErrors, err) {
	const nestedAttempts = getRetryAttemptErrors(err);
	attemptErrors.push(...nestedAttempts ?? [err]);
}
function createRetryFailure(attemptErrors) {
	const failure = toErrorObject(attemptErrors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
	if (attemptErrors.length > 1) recordRetryAttemptErrors(failure, attemptErrors);
	return failure;
}
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
		const attemptErrors = [];
		for (let i = 0; i < attempts; i += 1) try {
			return await fn();
		} catch (err) {
			appendRetryAttemptError(attemptErrors, err);
			if (i === attempts - 1) break;
			await sleep(resolveRetryDelayMs(initialDelayMs * 2 ** i));
		}
		throw createRetryFailure(attemptErrors);
	}
	const options = attemptsOrOptions;
	const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
	const maxAttempts = resolved.attempts;
	const minDelayMs = resolved.minDelayMs;
	const maxDelayMs = Number.isFinite(resolved.maxDelayMs) && resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
	const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(minDelayMs, resolveRetryDelayMs(Math.round(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0))));
	const jitter = resolved.jitter;
	const shouldRetry = options.shouldRetry ?? (() => true);
	const attemptErrors = [];
	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
		return await fn();
	} catch (err) {
		appendRetryAttemptError(attemptErrors, err);
		if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
		const retryAfterMs = options.retryAfterMs?.(err);
		const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
		const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : minDelayMs * 2 ** (attempt - 1);
		const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
		let delay = Math.min(baseDelay, delayCap);
		delay = applyJitter(delay, jitter, hasRetryAfter && typeof retryAfterMs === "number" && retryAfterMs <= delayCap ? "positive" : "symmetric");
		delay = Math.min(Math.max(delay, minDelayMs), delayCap);
		options.onRetry?.({
			attempt,
			maxAttempts,
			delayMs: delay,
			err,
			label: options.label
		});
		if (delay > 0) await sleep(delay);
	}
	throw createRetryFailure(attemptErrors);
}
//#endregion
export { retryAsync as n, resolveRetryConfig as t };
