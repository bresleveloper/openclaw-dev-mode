import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/session-entry-json.ts
function hasValidSessionEntryIdentity(entry) {
	return typeof entry.sessionId === "string" && typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt);
}
function parseSqliteSessionEntryRecord(row) {
	try {
		const record = JSON.parse(row.entry_json);
		if (!isRecord(record)) return null;
		if (!hasValidSessionEntryIdentity(record)) return null;
		if (row.current_session_id !== void 0 && row.current_session_id !== record.sessionId || row.updated_at !== void 0 && row.updated_at !== record.updatedAt) return null;
		return record;
	} catch {
		return null;
	}
}
//#endregion
export { parseSqliteSessionEntryRecord as n, hasValidSessionEntryIdentity as t };
