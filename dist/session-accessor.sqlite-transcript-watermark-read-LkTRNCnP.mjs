import { n as createSqliteQueryCache, o as getNodeSqliteKysely, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as readTranscriptContextFacts } from "./session-transcript-context-facts-JwNz0kep.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark-read.ts
const hotWatermarkQuery = createSqliteQueryCache((database) => {
	const db = getNodeSqliteKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectNoFrom((eb) => [
			eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId).as("max_seq"),
			eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId).as("generation"),
			eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", sessionId)).as("is_cold")
		]);
	});
});
/** Reads hot append and rewrite tokens together on the caller's admitted connection. */
function readSessionTranscriptHotWatermark(database, sessionId, options = {}) {
	const context = readTranscriptContextFacts(database, sessionId);
	if (context?.cold === false) return {
		generation: context.version.generation,
		maxSeq: context.version.rawSeq
	};
	const row = hotWatermarkQuery(database.db)(sessionId);
	if (options.requireHot && row?.is_cold) throw new SessionTranscriptColdError(sessionId);
	return {
		generation: row?.generation ?? null,
		maxSeq: row?.max_seq ?? null
	};
}
//#endregion
export { readSessionTranscriptHotWatermark as t };
