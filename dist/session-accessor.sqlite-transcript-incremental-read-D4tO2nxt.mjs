import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as readHotSessionTranscriptSnapshot } from "./session-cold-storage-state-CWFSrppd.mjs";
import "./session-cold-storage-read-DxurMT4l.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-incremental-read.ts
function loadTranscriptEventRowsAfterSeqInDatabase(database, sessionId, afterSeq) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "incremental", () => {
		const query = getSessionKysely(database.db).selectFrom("transcript_events").select([transcriptEventJsonSql(database.db).as("event_json"), "seq"]).where("session_id", "=", sessionId).where("seq", ">", afterSeq);
		return executeSqliteQuerySync(database.db, query.orderBy("seq", "asc")).rows.map((row) => ({
			event: JSON.parse(row.event_json),
			seq: coerceRequiredSqliteNumber(row.seq)
		}));
	});
}
//#endregion
export { loadTranscriptEventRowsAfterSeqInDatabase as t };
