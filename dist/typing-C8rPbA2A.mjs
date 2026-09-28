import { F as resolveTimerTimeoutMs, b as parseFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { t as createTypingKeepaliveLoop } from "./typing-lifecycle-BLLp7ZCY.mjs";
//#region src/channels/typing-start-guard.ts
/**
* Creates a small circuit breaker for channel typing-start calls.
*/
function createTypingStartGuard(params) {
	const maxConsecutiveFailures = typeof params.maxConsecutiveFailures === "number" && params.maxConsecutiveFailures > 0 ? Math.floor(params.maxConsecutiveFailures) : void 0;
	let consecutiveFailures = 0;
	let tripped = false;
	const isBlocked = () => {
		if (params.isSealed()) return true;
		if (tripped) return true;
		return params.shouldBlock?.() === true;
	};
	const run = async (start) => {
		if (isBlocked()) return "skipped";
		try {
			await start();
			consecutiveFailures = 0;
			return "started";
		} catch (err) {
			consecutiveFailures += 1;
			params.onStartError?.(err);
			if (params.rethrowOnError) throw err;
			if (maxConsecutiveFailures && consecutiveFailures >= maxConsecutiveFailures) {
				tripped = true;
				params.onTrip?.();
				return "tripped";
			}
			return "failed";
		}
	};
	return {
		run,
		reset: () => {
			consecutiveFailures = 0;
			tripped = false;
		},
		isTripped: () => tripped
	};
}
//#endregion
//#region src/channels/typing.ts
const DEFAULT_MAX_CONSECUTIVE_TYPING_FAILURES = 2;
function resolvePositiveIntegerOption(value, fallback) {
	const parsed = parseFiniteNumber(value);
	return parsed === void 0 || parsed <= 0 ? fallback : Math.max(1, Math.floor(parsed));
}
function createTypingCallbacks(params) {
	const stop = params.stop;
	const keepaliveIntervalMs = resolveTimerTimeoutMs(params.keepaliveIntervalMs, 3e3, 0);
	const maxConsecutiveFailures = resolvePositiveIntegerOption(params.maxConsecutiveFailures, DEFAULT_MAX_CONSECUTIVE_TYPING_FAILURES);
	const maxDurationMs = resolveTimerTimeoutMs(params.maxDurationMs, 6e4, 0);
	let closed = false;
	let ttlTimer;
	const startGuard = createTypingStartGuard({
		isSealed: () => closed,
		onStartError: params.onStartError,
		maxConsecutiveFailures,
		onTrip: () => {
			keepaliveLoop.stop();
		}
	});
	let startInFlight;
	const fireStart = async () => {
		const pending = startInFlight ??= startGuard.run(() => params.start());
		try {
			await pending;
		} finally {
			if (startInFlight === pending) startInFlight = void 0;
		}
	};
	const keepaliveLoop = createTypingKeepaliveLoop({
		intervalMs: keepaliveIntervalMs,
		onTick: fireStart
	});
	const startTtlTimer = () => {
		if (maxDurationMs <= 0) return;
		clearTtlTimer();
		ttlTimer = setTimeout(() => {
			if (!closed) {
				console.warn(`[typing] TTL exceeded (${maxDurationMs}ms), auto-stopping typing indicator`);
				fireStop();
			}
		}, maxDurationMs);
		ttlTimer.unref?.();
	};
	const clearTtlTimer = () => {
		if (ttlTimer) {
			clearTimeout(ttlTimer);
			ttlTimer = void 0;
		}
	};
	const onReplyStart = async () => {
		if (closed) return;
		startGuard.reset();
		clearTtlTimer();
		fireStart().then(() => {
			if (closed || startGuard.isTripped()) return;
			keepaliveLoop.start();
			startTtlTimer();
		});
		await Promise.resolve();
	};
	const fireStop = () => {
		if (closed) return;
		closed = true;
		keepaliveLoop.stop();
		clearTtlTimer();
		if (!stop) return;
		(startInFlight ? startInFlight.then(stop) : stop()).catch((err) => (params.onStopError ?? params.onStartError)(err));
	};
	return {
		onReplyStart,
		onIdle: fireStop,
		onCleanup: fireStop
	};
}
//#endregion
export { createTypingCallbacks as t };
