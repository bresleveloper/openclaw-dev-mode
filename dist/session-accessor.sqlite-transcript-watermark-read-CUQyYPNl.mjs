import { c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark-read.ts
function prepareHotWatermarkQuery(database) {
	const db = getNodeSqliteKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectNoFrom((eb) => [eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId).as("max_seq"), eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId).as("generation")]);
	});
}
const hotWatermarkQueries = /* @__PURE__ */ new WeakMap();
/** Reads hot append and rewrite tokens together on the caller's admitted connection. */
function readSessionTranscriptHotWatermark(database, sessionId) {
	let query = hotWatermarkQueries.get(database.db);
	if (!query) {
		query = prepareHotWatermarkQuery(database.db);
		hotWatermarkQueries.set(database.db, query);
	}
	const row = query(sessionId);
	return {
		generation: row?.generation ?? null,
		maxSeq: row?.max_seq ?? null
	};
}
//#endregion
export { readSessionTranscriptHotWatermark as t };
