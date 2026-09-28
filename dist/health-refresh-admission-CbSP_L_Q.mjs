import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import "./server-constants-Dx_kHnY5.mjs";
//#region src/gateway/server/health-refresh-admission.ts
const backgroundRefreshStartedAt = /* @__PURE__ */ new WeakMap();
/** Shares the existing background cadence across connections and cached health reads. */
function shouldScheduleBackgroundHealthRefresh(refresh, now) {
	const startedAt = backgroundRefreshStartedAt.get(refresh);
	if (startedAt !== void 0 && !isFutureDateTimestampMs(startedAt, { nowMs: now }) && now - startedAt < 6e4) return false;
	backgroundRefreshStartedAt.set(refresh, now);
	return true;
}
//#endregion
export { shouldScheduleBackgroundHealthRefresh as t };
