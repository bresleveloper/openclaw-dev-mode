import { n as createSqliteQueryCache, o as getNodeSqliteKysely, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { t as readTranscriptContextFacts } from "./session-transcript-context-facts-JwNz0kep.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark.ts
const retainedWatermarkQuery = createSqliteQueryCache((database) => {
	const db = getNodeSqliteKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectNoFrom((eb) => [eb.fn.coalesce(eb.selectFrom("session_transcript_cold_archives").select("last_seq").where("session_id", "=", sessionId), eb.selectFrom("transcript_events").select((inner) => inner.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId)).as("max_seq"), eb.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId).as("generation")]);
	});
});
/** Read hot generation and retained cold position together on the admitted snapshot. */
function readSessionTranscriptWatermarkInDatabase(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) return { ...actor.hot.transcript.watermark };
	const context = readTranscriptContextFacts(database, sessionId);
	if (context) return {
		generation: context.version.generation,
		maxSeq: context.version.rawSeq
	};
	const row = retainedWatermarkQuery(database.db)(sessionId);
	return {
		generation: row?.generation ?? null,
		maxSeq: row?.max_seq ?? null
	};
}
/** Reads the append and rewrite tokens that validate transcript-derived caches. */
function readSessionTranscriptWatermark(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptWatermarkInDatabase(database, resolved.sessionId), toDatabaseOptions(resolved));
	return result.found ? result.value : {
		generation: null,
		maxSeq: null
	};
}
//#endregion
export { readSessionTranscriptWatermarkInDatabase as n, readSessionTranscriptWatermark as t };
