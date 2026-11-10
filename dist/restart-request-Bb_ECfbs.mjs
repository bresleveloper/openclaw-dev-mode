import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { N as resolveOptionalIntegerOption, f as asSafeIntegerInRange, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as stringifyRouteThreadId } from "./channel-route-2bD3dZs2.mjs";
//#region src/gateway/server-methods/restart-request.ts
function parseRestartRequestParams(params) {
	const raw = params;
	const sessionKey = normalizeOptionalString(raw.sessionKey);
	const context = asOptionalRecord(raw.deliveryContext);
	const normalizedContext = context ? {
		channel: normalizeOptionalString(context.channel),
		to: normalizeOptionalString(context.to),
		accountId: normalizeOptionalString(context.accountId)
	} : void 0;
	return {
		sessionKey,
		deliveryContext: normalizedContext?.channel || normalizedContext?.to || normalizedContext?.accountId ? normalizedContext : void 0,
		threadId: context ? stringifyRouteThreadId(context.threadId) : void 0,
		note: normalizeOptionalString(raw.note),
		continuationMessage: normalizeOptionalString(raw.continuationMessage),
		restartDelayMs: resolveOptionalIntegerOption(raw.restartDelayMs, { min: 0 })
	};
}
function parseTargetedGatewayRestart(target) {
	if (target === void 0) return;
	if (!isRecord(target)) return null;
	const pid = asSafeIntegerInRange(target.pid, { min: 1 });
	const ownerId = normalizeOptionalString(target.ownerId);
	const port = asSafeIntegerInRange(target.port, {
		min: 1,
		max: 65535
	});
	return pid !== void 0 && ownerId && port !== void 0 ? {
		pid,
		ownerId,
		port
	} : null;
}
function parseTargetedGatewayRestartIntent(value, reason) {
	if (value !== void 0 && !isRecord(value)) return null;
	const raw = value ?? {};
	const force = raw.force === true;
	const budget = force ? raw.drainBudgetMs : raw.waitMs;
	const waitMs = asSafeIntegerInRange(budget, {
		min: 0,
		max: MAX_TIMER_TIMEOUT_MS
	});
	if (raw.force !== void 0 && typeof raw.force !== "boolean" || budget !== void 0 && waitMs === void 0 || force && raw.waitMs !== void 0 || !force && raw.drainBudgetMs !== void 0) return null;
	return {
		...reason ? { reason } : {},
		...force ? { force: true } : {},
		...waitMs !== void 0 ? { waitMs } : {}
	};
}
/**
* Only the predecessor-bound restart may cross a prepared suspension lease.
* The live lock target is sufficient: restart drain becomes the stronger owner
* and explicitly retires the reversible suspension token after delivery.
*/
function isTargetedNonSafeGatewayRestartRequest(params) {
	if (!isRecord(params) || params.safe !== void 0 && params.safe !== false) return false;
	const target = parseTargetedGatewayRestart(params.target);
	return target !== void 0 && target !== null && parseTargetedGatewayRestartIntent(params.restartIntent, void 0) !== null;
}
//#endregion
export { parseTargetedGatewayRestartIntent as i, parseRestartRequestParams as n, parseTargetedGatewayRestart as r, isTargetedNonSafeGatewayRestartRequest as t };
