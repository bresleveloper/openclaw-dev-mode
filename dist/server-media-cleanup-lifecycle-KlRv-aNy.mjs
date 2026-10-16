import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
//#region src/gateway/server-media-cleanup-lifecycle.ts
const MEDIA_CLEANUP_STOP_TIMEOUT_MS = 5e3;
const mediaCleanupDrains = resolveGlobalSingleton(Symbol.for("openclaw.gateway.mediaCleanupDrains"), () => /* @__PURE__ */ new Set());
/** Tracks cleanup work until settlement so later gateway generations retain shared state. */
function registerMediaCleanupDrain(drain) {
	mediaCleanupDrains.add(drain);
	drain.finally(() => mediaCleanupDrains.delete(drain));
}
/** Defers a replacement cleanup owner until every prior gateway generation settles. */
async function waitForMediaCleanupDrainsToSettle() {
	while (mediaCleanupDrains.size > 0) await Promise.allSettled(mediaCleanupDrains);
}
/** Waits for every process-owned cleanup generation, bounded for restart availability. */
async function waitForMediaCleanupDrains(params) {
	const drains = [...mediaCleanupDrains];
	if (drains.length === 0) return "drained";
	if (!await settlesWithin(Promise.allSettled(drains), params.timeoutMs)) {
		params.onTimeout?.();
		return "timed-out";
	}
	return "drained";
}
//#endregion
export { waitForMediaCleanupDrainsToSettle as i, registerMediaCleanupDrain as n, waitForMediaCleanupDrains as r, MEDIA_CLEANUP_STOP_TIMEOUT_MS as t };
