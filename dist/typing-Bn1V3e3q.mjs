import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { h as finiteSecondsToTimerSafeMilliseconds, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CuVhdCBs.mjs";
import { o as isSilentReplyPrefixText, r as SILENT_REPLY_TOKEN, s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { t as createTypingKeepaliveLoop } from "./typing-lifecycle-Bm2Zb1VW.mjs";
//#region src/auto-reply/reply/typing.ts
/** Typing indicator lifecycle controller for reply runs. */
const DEFAULT_TYPING_INTERVAL_SECONDS = 6;
const DEFAULT_TYPING_TTL_MS = 12e4;
const MAX_TYPING_INTERVAL_MS = Math.floor(MAX_TIMER_TIMEOUT_MS / 2);
function resolveTypingIntervalMs(seconds) {
	if (Number.isFinite(seconds) && (seconds ?? 0) <= 0) return 0;
	const intervalMs = finiteSecondsToTimerSafeMilliseconds(seconds ?? DEFAULT_TYPING_INTERVAL_SECONDS) ?? DEFAULT_TYPING_INTERVAL_SECONDS * 1e3;
	return Math.min(intervalMs, MAX_TYPING_INTERVAL_MS);
}
/** Creates a typing controller that seals itself after run and dispatch completion. */
function createTypingController(params) {
	const { onReplyStart, onCleanup, keepalive = true, silentToken = SILENT_REPLY_TOKEN, log } = params;
	if (!onReplyStart && !onCleanup) return {
		onReplyStart: async () => {},
		startTypingLoop: async () => {},
		startTypingOnText: async () => {},
		refreshTypingTtl: () => {},
		isActive: () => false,
		markRunComplete: () => {},
		markDispatchIdle: () => {},
		cleanup: () => {}
	};
	let active = false;
	let runComplete = false;
	let dispatchIdle = false;
	let triggerInFlight = false;
	let sealed = false;
	let typingTtlTimer;
	const typingIntervalMs = resolveTypingIntervalMs(params.typingIntervalSeconds);
	const typingTtlMs = Math.max(DEFAULT_TYPING_TTL_MS, typingIntervalMs * 2);
	const formatTypingTtl = (ms) => {
		if (ms % 6e4 === 0) return `${ms / 6e4}m`;
		return `${Math.round(ms / 1e3)}s`;
	};
	const cleanup = () => {
		if (sealed) return;
		if (typingTtlTimer) {
			clearTimeout(typingTtlTimer);
			typingTtlTimer = void 0;
		}
		if (dispatchIdleTimer) {
			clearTimeout(dispatchIdleTimer);
			dispatchIdleTimer = void 0;
		}
		typingLoop.stop();
		if (active) onCleanup?.();
		sealed = true;
	};
	const refreshTypingTtl = () => {
		if (sealed || typingIntervalMs <= 0) return;
		if (typingTtlTimer) clearTimeout(typingTtlTimer);
		typingTtlTimer = setTimeout(() => {
			if (!typingLoop.isRunning()) return;
			log?.(`typing TTL reached (${formatTypingTtl(typingTtlMs)}); stopping typing indicator`);
			cleanup();
		}, typingTtlMs);
	};
	const isActive = () => active && !sealed;
	const triggerTyping = async () => {
		if (triggerInFlight || sealed || runComplete) return;
		triggerInFlight = true;
		try {
			await onReplyStart?.();
			refreshTypingTtl();
		} catch (err) {
			log?.(`typing start failed: ${String(err)}`);
		} finally {
			triggerInFlight = false;
		}
	};
	const scheduleTyping = async () => {
		triggerTyping();
		await Promise.resolve();
	};
	const typingLoop = createTypingKeepaliveLoop({
		intervalMs: typingIntervalMs,
		onTick: triggerTyping
	});
	const ensureStart = async () => {
		if (sealed || runComplete) return;
		if (active) return;
		active = true;
		await scheduleTyping();
	};
	const maybeStopOnIdle = () => {
		if (active && runComplete && dispatchIdle) cleanup();
	};
	const startTypingLoop = async () => {
		if (sealed || runComplete) return;
		refreshTypingTtl();
		if (!onReplyStart) return;
		if (keepalive && typingLoop.isRunning()) return;
		await ensureStart();
		if (keepalive && !sealed && !runComplete) typingLoop.start();
	};
	const startTypingOnText = async (text) => {
		if (sealed) return;
		const trimmed = normalizeOptionalString(text);
		if (!trimmed) return;
		if (silentToken && (isSilentReplyText(trimmed, silentToken) || isSilentReplyPrefixText(trimmed, silentToken))) return;
		refreshTypingTtl();
		await startTypingLoop();
	};
	let dispatchIdleTimer;
	const DISPATCH_IDLE_GRACE_MS = 1e4;
	const markRunComplete = () => {
		runComplete = true;
		maybeStopOnIdle();
		if (!sealed && !dispatchIdle) dispatchIdleTimer = setTimeout(() => {
			if (!sealed && !dispatchIdle) {
				log?.("typing: dispatch idle not received after run complete; forcing cleanup");
				cleanup();
			}
		}, DISPATCH_IDLE_GRACE_MS);
	};
	const markDispatchIdle = () => {
		dispatchIdle = true;
		if (dispatchIdleTimer) {
			clearTimeout(dispatchIdleTimer);
			dispatchIdleTimer = void 0;
		}
		maybeStopOnIdle();
	};
	return {
		onReplyStart: ensureStart,
		startTypingLoop,
		startTypingOnText,
		refreshTypingTtl,
		isActive,
		markRunComplete,
		markDispatchIdle,
		cleanup
	};
}
//#endregion
export { resolveTypingIntervalMs as n, createTypingController as t };
