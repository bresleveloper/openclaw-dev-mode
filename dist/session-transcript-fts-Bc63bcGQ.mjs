import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/config/sessions/session-transcript-fts.ts
/** Insert both projection records in the caller's synchronous write transaction. */
function createSessionTranscriptFtsInserter(db, sessionId) {
	const kysely = getNodeSqliteKysely(db);
	const insertIdentity = prepareSqliteQuerySync(db, (parameter) => kysely.insertInto("session_transcript_fts_rows").values({
		session_id: sessionId,
		message_id: parameter((entry) => entry.messageId)
	}));
	const insertContent = prepareSqliteQuerySync(db, (parameter) => kysely.insertInto("session_transcript_fts").values({
		rowid: kysely.fn("last_insert_rowid", []),
		text: parameter((entry) => entry.text),
		session_id: sessionId,
		message_id: parameter((entry) => entry.messageId),
		role: parameter((entry) => entry.role),
		timestamp: parameter((entry) => entry.timestamp)
	}));
	return (entry) => {
		insertIdentity(entry);
		insertContent(entry);
	};
}
/** Indexed identities select the work; their delete trigger removes the matching FTS rows. */
function deleteSessionTranscriptFtsRowsInTransaction(db, sessionIds, options = {}) {
	const kysely = getNodeSqliteKysely(db);
	let selected = kysely.selectFrom("session_transcript_fts_rows").select("id");
	selected = typeof sessionIds === "string" ? selected.where("session_id", "=", sessionIds) : selected.where("session_id", "in", sqliteStringSet(sessionIds));
	if (options.messageIds) selected = selected.where("message_id", "in", options.messageIds.length <= 400 ? options.messageIds : sqliteStringSet(options.messageIds));
	if (options.maxRows !== void 0) selected = selected.limit(options.maxRows);
	return Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_fts_rows").where("id", "in", selected)).numAffectedRows ?? 0n);
}
/** Stream only one session's FTS content without scanning other sessions' payloads. */
function selectSessionTranscriptFtsRows(db, sessionId) {
	const kysely = getNodeSqliteKysely(db);
	return kysely.selectFrom("session_transcript_fts").select([
		"text",
		"message_id",
		"role",
		"timestamp"
	]).where("rowid", "in", kysely.selectFrom("session_transcript_fts_rows").select("id").where("session_id", "=", sessionId)).orderBy("rowid");
}
//#endregion
export { deleteSessionTranscriptFtsRowsInTransaction as n, selectSessionTranscriptFtsRows as r, createSessionTranscriptFtsInserter as t };
