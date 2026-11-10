import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
//#region src/auto-reply/reply/abort-cutoff.ts
function buildAbortCutoff(messageSid, rawTimestamp) {
	const timestamp = asFiniteNumber(rawTimestamp);
	return messageSid || timestamp !== void 0 ? {
		messageSid,
		timestamp
	} : void 0;
}
function resolveAbortCutoffFromContext(ctx) {
	return buildAbortCutoff(normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid), ctx.Timestamp);
}
function readAbortCutoffFromSessionEntry(entry) {
	return buildAbortCutoff(normalizeOptionalString(entry?.abortCutoffMessageSid), entry?.abortCutoffTimestamp);
}
function hasAbortCutoff(entry) {
	return readAbortCutoffFromSessionEntry(entry) !== void 0;
}
function applyAbortCutoffToSessionEntry(entry, cutoff) {
	entry.abortCutoffMessageSid = cutoff?.messageSid;
	entry.abortCutoffTimestamp = cutoff?.timestamp;
}
function toNumericMessageSid(value) {
	if (!/^\d+$/.test(value)) return;
	try {
		return BigInt(value);
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
