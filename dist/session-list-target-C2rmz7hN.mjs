import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
//#region src/shared/session-list-visibility.ts
/** Display/discovery classification; routing validates canonical keys separately. */
function isCronSessionDisplayKey(key) {
	return /^(?:cron:|agent::*[^:]+:+cron:+[^:])/u.test(normalizeLowercaseStringOrEmpty(key));
}
/**
* Classify probes from recorded provenance, never transcript text. Legacy rows
* without provenance and operator-named CLI sessions remain discoverable. Cron
* rows belong to the separate automation filter even when a system created them.
*/
function isSystemCreatedSessionRow(row) {
	if (isCronSessionDisplayKey(row.key)) return false;
	if (row.classification === "heartbeat") return !(row.label?.trim() || row.displayName?.trim() || row.subject?.trim());
	if (row.createdActor?.type === "system") return true;
	if (row.createdVia !== "run" && row.createdVia !== "internal") return false;
	if (row.createdActor?.type === "human") return false;
	return !(row.label?.trim() || row.displayName?.trim() || row.subject?.trim());
}
//#endregion
//#region src/gateway/session-list-target.ts
function readSessionListSelectionFacts(key, entry) {
	const parsed = parseAgentSessionKey(key);
	return {
		agentId: parsed ? normalizeAgentId(parsed.agentId) : void 0,
		isCronRun: isCronRunSessionKey(key),
		isCron: isCronSessionDisplayKey(key),
		isSystem: isSystemCreatedSessionRow({
			key,
			createdActor: entry?.createdActor,
			createdVia: entry?.createdVia,
			label: entry?.label,
			displayName: entry?.displayName,
			subject: entry?.subject,
			classification: entry?.heartbeatIsolatedBaseSessionKey ? "heartbeat" : void 0
		}),
		isSubagent: isSubagentSessionKey(key) || Boolean(entry?.spawnedBy && !parsed?.rest.toLowerCase().startsWith("dashboard:") && !normalizeOptionalString(entry.category)),
		isPhantom: entry?.updatedAt == null && !normalizeOptionalString(entry?.sessionId) && parsed?.rest === "sessions"
	};
}
//#endregion
export { readSessionListSelectionFacts as t };
