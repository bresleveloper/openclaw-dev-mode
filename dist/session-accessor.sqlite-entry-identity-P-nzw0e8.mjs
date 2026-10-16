import { a as asOptionalRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-identity.ts
function readSessionEntryInstanceId(database, sessionKey) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select(["current_session_id", "entry_json"]).where("session_key", "=", sessionKey));
	if (!row?.entry_json) return;
	try {
		const sessionId = readStringField(asOptionalRecord(JSON.parse(row.entry_json)), "sessionId");
		return sessionId === row.current_session_id ? sessionId : void 0;
	} catch {
		return;
	}
}
//#endregion
export { readSessionEntryInstanceId as t };
