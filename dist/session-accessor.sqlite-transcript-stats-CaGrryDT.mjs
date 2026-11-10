import { f as sqliteStringSetEntries, l as prepareSqliteQuerySync, n as createSqliteQueryCache, p as sql, r as encodeSqliteStringSet } from "./kysely-sync-9fPQaMlh.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-stats.ts
function transcriptStatsFromRow(row) {
	return {
		eventCount: row?.eventCount ?? 0,
		maxSeq: row?.maxSeq ?? 0,
		sizeBytes: row?.sizeBytes ?? 0,
		...row?.lastMutationAtMs != null ? { lastMutationAtMs: row.lastMutationAtMs } : {},
		...row?.lastObservedMutationAtMs != null ? { lastObservedMutationAtMs: row.lastObservedMutationAtMs } : {}
	};
}
const transcriptStatsQuery = createSqliteQueryCache((database) => {
	const db = getSessionKysely(database);
	const prepare = (point, includeGeneration = false) => prepareSqliteQuerySync(database, (parameter) => {
		const id = parameter((ids) => ids[0]);
		const requested = () => point ? db.selectNoFrom([id.as("value"), sql.lit(0).as("key")]) : sqliteStringSetEntries(parameter(encodeSqliteStringSet));
		return db.selectFrom(requested().as("target")).leftJoin(db.selectFrom("transcript_events").select((eb) => [
			"session_id",
			eb.fn.count("seq").as("event_count"),
			eb.fn.max("seq").as("max_seq"),
			sql`COALESCE(SUM(${transcriptEventReadBytesSql()}), 0) + COUNT(*) - 1`.as("size_bytes")
		]).$call((query) => point ? query.where("session_id", "=", id) : query.where("session_id", "in", db.selectFrom(requested().as("ids")).select("ids.value")).groupBy("session_id")).as("events"), "events.session_id", "target.value").leftJoin("session_transcript_cold_archives as cold", "cold.session_id", "target.value").leftJoin("session_windows as session", "session.session_id", "target.value").where((eb) => eb.or([
			eb("events.session_id", "is not", null),
			eb("cold.session_id", "is not", null),
			eb("session.session_id", "is not", null)
		])).select((eb) => [
			"target.key as position",
			eb.fn.coalesce("cold.event_count", "events.event_count", eb.val(0)).as("eventCount"),
			eb.fn.coalesce("cold.last_seq", "events.max_seq", eb.val(0)).as("maxSeq"),
			eb.fn.coalesce("cold.raw_bytes", "events.size_bytes", eb.val(0)).as("sizeBytes"),
			"session.transcript_observed_at as lastObservedMutationAtMs",
			"session.transcript_updated_at as lastMutationAtMs",
			"cold.session_id as coldSessionId",
			(includeGeneration ? eb.selectFrom("transcript_rewrite_watermarks as rewrite").select("rewrite.generation").whereRef("rewrite.session_id", "=", "target.value") : eb.val(null)).as("generation")
		]);
	});
	return {
		point: prepare(true),
		batch: prepare(false),
		export: prepare(true, true),
		batchWithGeneration: prepare(false, true)
	};
});
/** Read ordered stats in bounded statements, preserving duplicate and missing session IDs. */
function readTranscriptStatsBatchFromDatabase(database, sessionIds, options = {}) {
	const queries = transcriptStatsQuery(database.db);
	const point = sessionIds.length <= 10;
	const read = options.includeGeneration ? point ? queries.export : queries.batchWithGeneration : point ? queries.point : queries.batch;
	return chunkItems(sessionIds, point ? 1 : 400).flatMap((chunk) => {
		const rows = new Map(read(chunk).rows.map((row) => [row.position, row]));
		return chunk.map((_, position) => {
			const row = rows.get(position);
			return {
				...transcriptStatsFromRow(row),
				...options.includeGeneration ? {
					generation: row?.generation ?? null,
					cold: row?.coldSessionId != null
				} : {}
			};
		});
	});
}
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsFromDatabase(database, sessionId) {
	return readTranscriptStatsBatchFromDatabase(database, [sessionId])[0];
}
/** Export readers carry the rewrite identity in their existing statistics statement. */
function readTranscriptExportStatsFromDatabase(database, sessionId) {
	const row = transcriptStatsQuery(database.db).export([sessionId]).rows[0];
	return {
		generation: row?.generation ?? null,
		cold: row?.coldSessionId != null,
		stats: transcriptStatsFromRow(row)
	};
}
//#endregion
export { readTranscriptStatsBatchFromDatabase as n, readTranscriptStatsFromDatabase as r, readTranscriptExportStatsFromDatabase as t };
