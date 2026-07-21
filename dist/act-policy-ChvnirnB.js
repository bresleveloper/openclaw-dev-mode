//#region extensions/browser/src/browser/act-policy.ts
/** Maximum click delay accepted from model/tool input. */
const ACT_MAX_CLICK_DELAY_MS = 5e3;
/** Maximum explicit wait duration accepted from model/tool input. */
const ACT_MAX_WAIT_TIME_MS = 3e4;
/** Maximum viewport side length accepted by resize actions. */
const ACT_MAX_VIEWPORT_DIMENSION = 8192;
const ACT_MIN_TIMEOUT_MS = 500;
const ACT_MAX_INTERACTION_TIMEOUT_MS = 6e4;
const ACT_MAX_WAIT_TIMEOUT_MS = 12e4;
const ACT_DEFAULT_INTERACTION_TIMEOUT_MS = 8e3;
const ACT_DEFAULT_WAIT_TIMEOUT_MS = 2e4;
function normalizeActBoundedNonNegativeMs(value, fieldName, maxMs) {
	if (value === void 0) return;
	if (!Number.isFinite(value) || value < 0) throw new Error(`${fieldName} must be >= 0`);
	const normalized = Math.floor(value);
	if (normalized > maxMs) throw new Error(`${fieldName} exceeds maximum of ${maxMs}ms`);
	return normalized;
}
/** Clamp interaction actions to the supported browser-control timeout window. */
function resolveActInteractionTimeoutMs(timeoutMs) {
	return Math.max(ACT_MIN_TIMEOUT_MS, Math.min(ACT_MAX_INTERACTION_TIMEOUT_MS, typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.floor(timeoutMs) : ACT_DEFAULT_INTERACTION_TIMEOUT_MS));
}
/** Clamp wait actions to their wider supported browser-control timeout window. */
function resolveActWaitTimeoutMs(timeoutMs) {
	return Math.max(ACT_MIN_TIMEOUT_MS, Math.min(ACT_MAX_WAIT_TIMEOUT_MS, typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.floor(timeoutMs) : ACT_DEFAULT_WAIT_TIMEOUT_MS));
}
//#endregion
export { resolveActInteractionTimeoutMs as a, normalizeActBoundedNonNegativeMs as i, ACT_MAX_VIEWPORT_DIMENSION as n, resolveActWaitTimeoutMs as o, ACT_MAX_WAIT_TIME_MS as r, ACT_MAX_CLICK_DELAY_MS as t };
