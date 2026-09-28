import { F as resolveTimerTimeoutMs, S as parseStrictInteger, a as addTimerTimeoutGraceMs, n as MAX_TIMER_TIMEOUT_MS, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import { i as DEFAULT_BROWSER_ACTION_TIMEOUT_MS } from "./constants-DKjTvIBP.mjs";
import { t as normalizeBrowserTimerDelayMs } from "./timer-delay-DhAs5gz8.mjs";
//#region extensions/browser/src/browser/act-policy.ts
/**
* Browser action limits and timeout normalization.
*
* Shared by the tool schema and runtime action handlers so model-facing limits
* and browser-control enforcement stay aligned.
*/
/** Maximum click delay accepted from model/tool input. */
const ACT_MAX_CLICK_DELAY_MS = 5e3;
/** Maximum explicit wait duration accepted from model/tool input. */
const ACT_MAX_WAIT_TIME_MS = 3e4;
/** Maximum viewport side length accepted by resize actions. */
const ACT_MAX_VIEWPORT_DIMENSION = 8192;
/** Existing-session actions whose runtime accepts a per-call timeout override. */
const EXISTING_SESSION_TIMEOUT_OVERRIDE_KINDS = /* @__PURE__ */ new Set([
	"click",
	"clickCoords",
	"evaluate",
	"wait"
]);
const ACT_MIN_TIMEOUT_MS = 500;
const ACT_MAX_INTERACTION_TIMEOUT_MS = 6e4;
const ACT_MAX_WAIT_TIMEOUT_MS = 12e4;
const ACT_DEFAULT_INTERACTION_TIMEOUT_MS = 8e3;
const ACT_DEFAULT_WAIT_TIMEOUT_MS = 2e4;
/** Grace between the runtime's action budget and an outer transport watchdog. */
const BROWSER_ACTION_TRANSPORT_SLACK_MS = 5e3;
/** Existing-session verification keeps observing after the action settles. */
const EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS = [
	0,
	250,
	500
];
const EXISTING_SESSION_NAVIGATION_GRACE_MS = EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS.reduce((total, delay) => total + delay, 0) + (EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS.at(-1) ?? 0);
/** Keep navigation timeouts consistent across transports and browser backends. */
function resolveBrowserNavigationTimeoutMs(timeoutMs) {
	return Math.min(12e4, resolveTimerTimeoutMs(timeoutMs, 2e4, 1e3));
}
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
function parseTimerInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : parseStrictInteger(value);
}
function resolveNonNegativeTimerMs(value) {
	const parsed = parseTimerInteger(value);
	return parsed !== void 0 && parsed >= 0 ? resolveTimerTimeoutMs(parsed, 0, 0) : 0;
}
function addExecutionBudgetMs(totalMs, nextMs) {
	return Math.min(MAX_TIMER_TIMEOUT_MS, totalMs + nextMs);
}
function multiplyExecutionBudgetMs(durationMs, count) {
	return Math.min(MAX_TIMER_TIMEOUT_MS, durationMs * count);
}
function resolveInteractionTimeoutMs(request) {
	return resolveActInteractionTimeoutMs(parseTimerInteger("timeoutMs" in request ? request.timeoutMs : void 0));
}
function addNavigationGraceMs(durationMs, count = 1) {
	return addExecutionBudgetMs(durationMs, multiplyExecutionBudgetMs(250, count));
}
function isActionObject(value) {
	return isRecord(value);
}
function resolveLeafExecutionBudgetMs(request) {
	switch (request.kind) {
		case "click": {
			const timeoutMs = resolveInteractionTimeoutMs(request);
			const delayMs = Math.min(ACT_MAX_CLICK_DELAY_MS, resolveNonNegativeTimerMs(request.delayMs));
			return addNavigationGraceMs(delayMs > 0 ? addExecutionBudgetMs(timeoutMs * 2, delayMs) : timeoutMs);
		}
		case "clickCoords": {
			const delayMs = Math.min(ACT_MAX_CLICK_DELAY_MS, resolveNonNegativeTimerMs(request.delayMs));
			return addNavigationGraceMs(addExecutionBudgetMs(clampPositiveTimerTimeoutMs(parseTimerInteger(request.timeoutMs)) ?? 0, multiplyExecutionBudgetMs(delayMs, request.doubleClick ? 3 : 1)));
		}
		case "type": {
			const phaseCount = (request.slowly ? 2 : 1) + (request.submit ? 1 : 0);
			return addNavigationGraceMs(multiplyExecutionBudgetMs(resolveInteractionTimeoutMs(request), phaseCount));
		}
		case "press": return addNavigationGraceMs(resolveNonNegativeTimerMs(request.delayMs));
		case "insertText": return addNavigationGraceMs(0);
		case "fill": {
			const fieldCount = (Array.isArray(request.fields) ? request.fields : []).filter((field) => Boolean(field) && typeof field === "object" && typeof field.ref === "string" && Boolean(field.ref.trim())).length;
			return addNavigationGraceMs(multiplyExecutionBudgetMs(resolveInteractionTimeoutMs(request), fieldCount), fieldCount);
		}
		case "evaluate": return addNavigationGraceMs(resolveActWaitTimeoutMs(parseTimerInteger(request.timeoutMs)));
		case "scrollIntoView": return addNavigationGraceMs(resolveActWaitTimeoutMs(parseTimerInteger(request.timeoutMs)));
		case "hover":
		case "drag":
		case "select": return addNavigationGraceMs(resolveInteractionTimeoutMs(request));
		case "resize":
		case "close": return 0;
	}
	return 0;
}
function resolveExecutionBudgetMs(request) {
	if (request.kind === "batch") return (Array.isArray(request.actions) ? request.actions.filter(isActionObject) : []).reduce((totalMs, action) => addExecutionBudgetMs(totalMs, resolveExecutionBudgetMs(action)), 0);
	if (request.kind !== "wait") return resolveLeafExecutionBudgetMs(request);
	const conditionCount = [
		Boolean(request.text),
		Boolean(request.textGone),
		typeof request.selector === "string" && Boolean(request.selector.trim()),
		typeof request.url === "string" && Boolean(request.url.trim()),
		Boolean(request.loadState),
		typeof request.fn === "string" && Boolean(request.fn.trim())
	].filter(Boolean).length;
	const timeoutMs = resolveActWaitTimeoutMs(parseTimerInteger(request.timeoutMs));
	return addExecutionBudgetMs(resolveNonNegativeTimerMs(request.timeMs), multiplyExecutionBudgetMs(timeoutMs, conditionCount));
}
/** Bound logical action and verification phases without renewing every MCP call's budget. */
function resolveExistingSessionActTimeouts(request) {
	const requestedTimeoutMs = EXISTING_SESSION_TIMEOUT_OVERRIDE_KINDS.has(request.kind) && "timeoutMs" in request ? parseTimerInteger(request.timeoutMs) : void 0;
	const timeoutMs = normalizeBrowserTimerDelayMs(requestedTimeoutMs ?? 6e4);
	let actionTimeoutMs = timeoutMs;
	if (request.kind === "wait") {
		const timeMs = resolveNonNegativeTimerMs(request.timeMs);
		actionTimeoutMs = [
			request.text,
			request.textGone,
			request.selector,
			request.url,
			request.loadState,
			request.fn
		].some((value) => typeof value === "string" && Boolean(value.trim())) ? addExecutionBudgetMs(timeMs, Math.max(250, timeoutMs)) : Math.max(timeMs, timeoutMs);
	}
	const verificationTimeoutMs = request.kind === "resize" || request.kind === "close" ? 0 : addExecutionBudgetMs(timeoutMs, EXISTING_SESSION_NAVIGATION_GRACE_MS);
	return {
		timeoutMs,
		bodyTimeoutMs: request.kind === "wait" ? void 0 : actionTimeoutMs,
		verificationTimeoutMs,
		requestTimeoutMs: addExecutionBudgetMs(actionTimeoutMs, verificationTimeoutMs)
	};
}
/**
* Resolve the runtime budget before an outer transport watchdog is armed.
* Wait phases and batch children execute serially, so maxima would abort valid work midway.
*/
function resolveBrowserActExecutionBudgetMs(request) {
	const executionBudgetMs = resolveExecutionBudgetMs(request);
	if (request.kind === "wait") return executionBudgetMs;
	return (request.kind === "batch" ? void 0 : clampPositiveTimerTimeoutMs(parseTimerInteger("timeoutMs" in request ? request.timeoutMs : void 0))) === void 0 ? Math.max(DEFAULT_BROWSER_ACTION_TIMEOUT_MS, executionBudgetMs) : executionBudgetMs;
}
/** Add action transport slack once after the full sequential runtime budget is known. */
function resolveBrowserActRequestTimeoutMs(request) {
	const existingSessionBudgetMs = request.kind === "batch" ? 0 : resolveExistingSessionActTimeouts(request).requestTimeoutMs;
	return addTimerTimeoutGraceMs(Math.max(resolveBrowserActExecutionBudgetMs(request), existingSessionBudgetMs), 5e3) ?? 1;
}
//#endregion
export { EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS as a, resolveActInteractionTimeoutMs as c, resolveBrowserNavigationTimeoutMs as d, resolveExistingSessionActTimeouts as f, BROWSER_ACTION_TRANSPORT_SLACK_MS as i, resolveActWaitTimeoutMs as l, ACT_MAX_VIEWPORT_DIMENSION as n, EXISTING_SESSION_TIMEOUT_OVERRIDE_KINDS as o, ACT_MAX_WAIT_TIME_MS as r, normalizeActBoundedNonNegativeMs as s, ACT_MAX_CLICK_DELAY_MS as t, resolveBrowserActRequestTimeoutMs as u };
