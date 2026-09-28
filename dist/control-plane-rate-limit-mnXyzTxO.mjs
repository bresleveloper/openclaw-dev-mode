import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { t as normalizeControlPlaneIdentityPart } from "./control-plane-identity-CDhSlyN5.mjs";
const CONTROL_PLANE_RATE_LIMIT_WINDOW_MS = 6e4;
const CONTROL_PLANE_BUCKET_MAX_STALE_MS = 3e5;
/** Hard cap to prevent memory DoS from rapid unique-key injection (CWE-400). */
const CONTROL_PLANE_BUCKET_MAX_ENTRIES = 1e4;
const controlPlaneBuckets = /* @__PURE__ */ new Map();
/** Builds a stable throttle key while avoiding shared fallback buckets for anonymous clients. */
function resolveControlPlaneRateLimitKey(client) {
	const deviceId = normalizeControlPlaneIdentityPart(client?.connect?.device?.id, "unknown-device");
	const clientIp = normalizeControlPlaneIdentityPart(client?.clientIp, "unknown-ip");
	if (deviceId === "unknown-device" && clientIp === "unknown-ip") {
		const connId = normalizeControlPlaneIdentityPart(client?.connId, "");
		if (connId) return `${deviceId}|${clientIp}|conn=${connId}`;
	}
	return `${deviceId}|${clientIp}`;
}
/** Consumes one write budget unit and reports retry state for gateway error responses. */
function consumeControlPlaneWriteBudget(params) {
	const key = `${params.method}|${resolveControlPlaneRateLimitKey(params.client)}`;
	if (isDevMode()) return {
		allowed: true,
		retryAfterMs: 0,
		remaining: 30,
		key
	};
	const nowMs = params.nowMs ?? Date.now();
	const bucket = controlPlaneBuckets.get(key);
	if (!bucket || nowMs - bucket.windowStartMs >= 6e4) {
		if (!controlPlaneBuckets.has(key) && controlPlaneBuckets.size >= CONTROL_PLANE_BUCKET_MAX_ENTRIES) pruneMapToMaxSize(controlPlaneBuckets, 9999);
		controlPlaneBuckets.set(key, {
			count: 1,
			windowStartMs: nowMs
		});
		return {
			allowed: true,
			retryAfterMs: 0,
			remaining: 29,
			key
		};
	}
	if (bucket.count >= 30) return {
		allowed: false,
		retryAfterMs: Math.max(0, bucket.windowStartMs + CONTROL_PLANE_RATE_LIMIT_WINDOW_MS - nowMs),
		remaining: 0,
		key
	};
	bucket.count += 1;
	return {
		allowed: true,
		retryAfterMs: 0,
		remaining: Math.max(0, 30 - bucket.count),
		key
	};
}
/**
* Remove buckets whose rate-limit window expired more than
* CONTROL_PLANE_BUCKET_MAX_STALE_MS ago.  Called periodically
* by the gateway maintenance timer to prevent unbounded growth.
*/
function pruneStaleControlPlaneBuckets(nowMs = Date.now()) {
	let pruned = 0;
	for (const [key, bucket] of controlPlaneBuckets) if (nowMs - bucket.windowStartMs > CONTROL_PLANE_BUCKET_MAX_STALE_MS) {
		controlPlaneBuckets.delete(key);
		pruned += 1;
	}
	return pruned;
}
//#endregion
export { consumeControlPlaneWriteBudget as n, pruneStaleControlPlaneBuckets as r, CONTROL_PLANE_RATE_LIMIT_WINDOW_MS as t };
