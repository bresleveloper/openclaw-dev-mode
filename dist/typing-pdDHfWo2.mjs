import { F as resolveTimerTimeoutMs, b as parseFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as createTypingKeepaliveLoop } from "./typing-lifecycle-DcPpCHlK.mjs";
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
	let consecutiveFailures = 0;
	let tripped = false;
	const startTyping = async () => {
		if (closed || tripped) return;
		try {
			await params.start();
			consecutiveFailures = 0;
		} catch (error) {
			consecutiveFailures += 1;
			params.onStartError(error);
			if (consecutiveFailures >= maxConsecutiveFailures) {
				tripped = true;
				keepaliveLoop.stop();
			}
		}
	};
	let startInFlight;
	const fireStart = async () => {
		const pending = startInFlight ??= startTyping();
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
		consecutiveFailures = 0;
		tripped = false;
		clearTtlTimer();
		fireStart().then(() => {
			if (closed || tripped) return;
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
