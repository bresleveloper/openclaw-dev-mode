import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
//#region src/auto-reply/reply/abort-cutoff.ts
function resolveAbortCutoffFromContext(ctx) {
	const messageSid = normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid);
	const timestamp = asFiniteNumber(ctx.Timestamp);
	if (!messageSid && timestamp === void 0) return;
	return {
		messageSid,
		timestamp
	};
}
function readAbortCutoffFromSessionEntry(entry) {
	if (!entry) return;
	const messageSid = normalizeOptionalString(entry.abortCutoffMessageSid);
	const timestamp = asFiniteNumber(entry.abortCutoffTimestamp);
	if (!messageSid && timestamp === void 0) return;
	return {
		messageSid,
		timestamp
	};
}
function hasAbortCutoff(entry) {
	return readAbortCutoffFromSessionEntry(entry) !== void 0;
}
function applyAbortCutoffToSessionEntry(entry, cutoff) {
	entry.abortCutoffMessageSid = cutoff?.messageSid;
	entry.abortCutoffTimestamp = cutoff?.timestamp;
}
function toNumericMessageSid(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || !/^\d+$/.test(trimmed)) return;
	try {
		return BigInt(trimmed);
	} catch {
		return;
	}
}
function shouldSkipMessageByAbortCutoff(params) {
	const cutoffSid = normalizeOptionalString(params.cutoffMessageSid);
	const currentSid = normalizeOptionalString(params.messageSid);
	if (cutoffSid && currentSid) {
		const cutoffNumeric = toNumericMessageSid(cutoffSid);
		const currentNumeric = toNumericMessageSid(currentSid);
		if (cutoffNumeric !== void 0 && currentNumeric !== void 0) return currentNumeric <= cutoffNumeric;
		if (currentSid === cutoffSid) return true;
	}
	const cutoffTimestamp = asFiniteNumber(params.cutoffTimestamp);
	const timestamp = asFiniteNumber(params.timestamp);
	return cutoffTimestamp !== void 0 && timestamp !== void 0 && timestamp <= cutoffTimestamp;
}
function shouldPersistAbortCutoff(params) {
	const commandSessionKey = normalizeOptionalString(params.commandSessionKey);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey);
	if (!commandSessionKey || !targetSessionKey) return true;
	return commandSessionKey === targetSessionKey;
}
//#endregion
export { shouldPersistAbortCutoff as a, resolveAbortCutoffFromContext as i, hasAbortCutoff as n, shouldSkipMessageByAbortCutoff as o, readAbortCutoffFromSessionEntry as r, applyAbortCutoffToSessionEntry as t };
