import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
//#region src/shared/session-list-visibility.ts
function isSubagentSessionRow(key, entry) {
	return isSubagentSessionKey(key) || Boolean(entry?.spawnedBy && !parseAgentSessionKey(key)?.rest.toLowerCase().startsWith("dashboard:") && !normalizeOptionalString(entry.category));
}
/** Display/discovery classification; routing validates canonical keys separately. */
function isCronSessionDisplayKey(key) {
	return /^(?:cron:|agent::*[^:]+:+cron:+[^:])/u.test(normalizeLowercaseStringOrEmpty(key));
}
/**
* Classify internal lanes from provenance or reserved keys, never transcript text.
* Legacy rows without either and operator-named CLI sessions remain discoverable.
* Cron rows belong to the separate automation filter even when a system created them.
*/
function isSystemCreatedSessionRow(row) {
	if (isCronSessionDisplayKey(row.key)) return false;
	if (/^agent:[^:]+:(?:.+:)?active-memory:[a-f0-9]{12}$/iu.test(row.key.trim())) return true;
	if (row.classification === "heartbeat") return !(row.label?.trim() || row.displayName?.trim() || row.subject?.trim());
	if (row.createdActor?.type === "system") return true;
	if (row.createdVia !== "run" && row.createdVia !== "internal") return false;
	if (row.createdActor?.type === "human") return false;
	return !(row.label?.trim() || row.displayName?.trim() || row.subject?.trim());
}
//#endregion
export { isSubagentSessionRow as n, isSystemCreatedSessionRow as r, isCronSessionDisplayKey as t };
