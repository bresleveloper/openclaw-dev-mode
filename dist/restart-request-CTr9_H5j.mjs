import "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
//#region src/gateway/server-methods/restart-request.ts
function parseRestartDeliveryContext(params) {
	const raw = params.deliveryContext;
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {
		deliveryContext: void 0,
		threadId: void 0
	};
	const context = raw;
	const deliveryContext = {
		channel: normalizeOptionalString(context.channel),
		to: normalizeOptionalString(context.to),
		accountId: normalizeOptionalString(context.accountId)
	};
	return {
		deliveryContext: deliveryContext.channel || deliveryContext.to || deliveryContext.accountId ? deliveryContext : void 0,
		threadId: stringifyRouteThreadId(context.threadId)
	};
}
function parseRestartRequestParams(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const { deliveryContext, threadId } = parseRestartDeliveryContext(params);
	const note = normalizeOptionalString(params.note);
	const continuationMessage = normalizeOptionalString(params.continuationMessage);
	const restartDelayMsRaw = params.restartDelayMs;
	return {
		sessionKey,
		deliveryContext,
		threadId,
		note,
		continuationMessage,
		restartDelayMs: typeof restartDelayMsRaw === "number" && Number.isFinite(restartDelayMsRaw) ? Math.max(0, Math.floor(restartDelayMsRaw)) : void 0
	};
}
function parseTargetedGatewayRestart(value) {
	if (value === void 0) return;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const target = value;
	if (typeof target.pid !== "number" || !Number.isSafeInteger(target.pid) || target.pid <= 0 || typeof target.ownerId !== "string" || !target.ownerId.trim() || typeof target.port !== "number" || !Number.isInteger(target.port) || target.port <= 0 || target.port > 65535) return null;
	return {
		pid: target.pid,
		ownerId: target.ownerId.trim(),
		port: target.port
	};
}
function parseTargetedGatewayRestartIntent(value, reason) {
	if (value !== void 0 && (!value || typeof value !== "object" || Array.isArray(value))) return null;
	const raw = value ?? {};
	const force = raw.force === true;
	const budget = force ? raw.drainBudgetMs : raw.waitMs;
	const waitMs = typeof budget === "number" && Number.isSafeInteger(budget) && budget >= 0 && budget <= 2147e6 ? budget : void 0;
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
