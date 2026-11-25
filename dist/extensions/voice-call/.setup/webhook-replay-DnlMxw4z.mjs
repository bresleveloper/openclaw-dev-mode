import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
// extensions/voice-call/src/webhook-replay.ts
const REPLAY_WINDOW_MS = 6e5;
const REPLAY_CACHE_MAX_ENTRIES = 1e4;
function createWebhookReplayCache() {
	return createDedupeCache({
		ttlMs: REPLAY_WINDOW_MS,
		maxSize: REPLAY_CACHE_MAX_ENTRIES
	});
}
function reserveWebhookReplay(cache, replayKey) {
	const now = Date.now();
	if (asDateTimestampMs(now) !== void 0 && cache.peek(replayKey, now)) return {
		isReplay: true,
		verifiedRequestKey: replayKey
	};
	if (resolveExpiresAtMsFromDurationMs(REPLAY_WINDOW_MS, { nowMs: now }) === void 0) return {
		isReplay: false,
		verifiedRequestKey: replayKey
	};
	const reservation = {};
	cache.check(replayKey, now, reservation);
	return {
		isReplay: false,
		verifiedRequestKey: replayKey,
		releaseReplay: () => cache.delete(replayKey, reservation)
	};
}
export { reserveWebhookReplay as n, createWebhookReplayCache as t };
