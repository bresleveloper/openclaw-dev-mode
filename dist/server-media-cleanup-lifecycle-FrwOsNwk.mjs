import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
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
	let timeout;
	const timedOut = new Promise((resolve) => {
		timeout = setTimeout(() => resolve(true), params.timeoutMs);
		timeout.unref?.();
	});
	const result = await Promise.race([Promise.allSettled(drains).then(() => false), timedOut]);
	if (timeout) clearTimeout(timeout);
	if (result) {
		params.onTimeout?.();
		return "timed-out";
	}
	return "drained";
}
//#endregion
export { waitForMediaCleanupDrainsToSettle as i, registerMediaCleanupDrain as n, waitForMediaCleanupDrains as r, MEDIA_CLEANUP_STOP_TIMEOUT_MS as t };
