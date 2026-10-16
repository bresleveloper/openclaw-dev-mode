import { a as getNodeSqliteKysely, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark-read.ts
function prepareHotWatermarkQuery(database) {
	const db = getNodeSqliteKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectNoFrom((eb) => [eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId).as("max_seq"), eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId).as("generation")]);
	});
}
const hotWatermarkQuery = createSqliteQueryCache(prepareHotWatermarkQuery);
/** Reads hot append and rewrite tokens together on the caller's admitted connection. */
function readSessionTranscriptHotWatermark(database, sessionId) {
	const row = hotWatermarkQuery(database.db)(sessionId);
	return {
		generation: row?.generation ?? null,
		maxSeq: row?.max_seq ?? null
	};
}
//#endregion
export { readSessionTranscriptHotWatermark as t };
