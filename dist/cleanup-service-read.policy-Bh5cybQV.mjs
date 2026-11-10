import { a as asOptionalRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { u as shouldPreserveMaintenanceEntry } from "./store-maintenance-BqMt1Twc.mjs";
//#region src/config/sessions/cleanup-service-read.policy.ts
/** Missing transcript cleanup cannot retire protected or still-initializing sessions. */
function shouldPreserveSessionCleanupEntry(sessionKey, entry) {
	if ((entry.modelSelectionLocked === true || entry.archivedAt !== void 0) && shouldPreserveMaintenanceEntry({
		key: sessionKey,
		entry
	})) return true;
	const legacySessionFile = readStringField(asOptionalRecord(entry), "sessionFile");
	return Boolean(parseAgentSessionKey(sessionKey) && (entry.initializationPending === true || entry.sessionId === sessionKey && !legacySessionFile?.trim()));
}
//#endregion
export { shouldPreserveSessionCleanupEntry as t };
