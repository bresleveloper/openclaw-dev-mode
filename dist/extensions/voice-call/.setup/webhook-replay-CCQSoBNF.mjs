import { isFutureDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/voice-call/src/webhook-replay.ts
const REPLAY_WINDOW_MS = 6e5;
const REPLAY_CACHE_MAX_ENTRIES = 1e4;
const REPLAY_CACHE_PRUNE_INTERVAL = 64;
function createWebhookReplayCache() {
	return {
		seenUntil: /* @__PURE__ */ new Map(),
		calls: 0
	};
}
function pruneWebhookReplayCache(cache, now) {
	for (const [key, reservation] of cache.seenUntil) if (!isFutureDateTimestampMs(reservation.expiresAt, { nowMs: now })) cache.seenUntil.delete(key);
	while (cache.seenUntil.size > REPLAY_CACHE_MAX_ENTRIES) {
		const oldest = cache.seenUntil.keys().next().value;
		if (!oldest) break;
		cache.seenUntil.delete(oldest);
	}
}
function reserveWebhookReplay(cache, replayKey) {
	const now = Date.now();
	cache.calls += 1;
	if (cache.calls % REPLAY_CACHE_PRUNE_INTERVAL === 0) pruneWebhookReplayCache(cache, now);
	const existing = cache.seenUntil.get(replayKey);
	if (existing !== void 0 && isFutureDateTimestampMs(existing.expiresAt, { nowMs: now })) return {
		isReplay: true,
		verifiedRequestKey: replayKey
	};
	const expiresAt = resolveExpiresAtMsFromDurationMs(REPLAY_WINDOW_MS, { nowMs: now });
	if (expiresAt === void 0) return {
		isReplay: false,
		verifiedRequestKey: replayKey
	};
	const reservation = { expiresAt };
	cache.seenUntil.set(replayKey, reservation);
	if (cache.seenUntil.size > REPLAY_CACHE_MAX_ENTRIES) pruneWebhookReplayCache(cache, now);
	return {
		isReplay: false,
		verifiedRequestKey: replayKey,
		releaseReplay: () => {
			if (cache.seenUntil.get(replayKey) === reservation) cache.seenUntil.delete(replayKey);
		}
	};
}
//#endregion
export { reserveWebhookReplay as n, createWebhookReplayCache as t };
