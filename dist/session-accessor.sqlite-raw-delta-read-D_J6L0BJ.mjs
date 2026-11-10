import { i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { o as readTranscriptPayload } from "./transcript-payload-Cu49oQKq.mjs";
import { a as parseRawTranscriptCursor, i as normalizeRawDeltaLimits, r as encodeRawTranscriptCursor, t as bootstrapRawTranscriptCursor } from "./session-transcript-raw-cursor-fGQxJVDh.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-LkTRNCnP.mjs";
//#region src/config/sessions/session-accessor.sqlite-raw-delta-read.ts
/** Read inside the caller's validated projection snapshot on its exact connection. */
function readTranscriptRawDeltaFromProjection(projection, limits = {}) {
	const { maxEvents, maxBytes } = normalizeRawDeltaLimits(limits);
	const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	})?.beforeRawSeq;
	return readRawDeltaInTransaction(projection.database.db, projection.resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq, {
		generation: projection.generation,
		indexedSeq: projection.state.indexedSeq
	});
}
/** The caller owns this synchronous snapshot and any already-captured frontier. */
function readRawDeltaInTransaction(database, scope, encodedCursor, maxEvents, maxBytes, beforeEventSeq, snapshot) {
	const watermark = snapshot ? void 0 : readSessionTranscriptHotWatermark({ db: database }, scope.sessionId);
	const generation = snapshot ? snapshot.generation : watermark?.generation ?? void 0;
	if (generation === void 0) return { kind: "missing" };
	const initialCursor = bootstrapRawTranscriptCursor(scope, generation);
	const reset = (reason) => ({
		kind: "reset",
		cursor: encodeRawTranscriptCursor(initialCursor),
		reason
	});
	const cursor = encodedCursor !== void 0 ? parseRawTranscriptCursor(encodedCursor) : initialCursor;
	if (!cursor) return reset("invalid_cursor");
	if (cursor.agentId !== scope.agentId || cursor.sessionId !== scope.sessionId) return reset("scope_mismatch");
	if (cursor.generation !== generation) return reset("generation_mismatch");
	const transcript = getNodeSqliteKysely(database).selectFrom("transcript_events").where("session_id", "=", scope.sessionId);
	const frontier = snapshot ? snapshot.indexedSeq : watermark?.maxSeq;
	const maxSeq = Math.min(coerceRequiredSqliteNumber(frontier ?? -1), beforeEventSeq === void 0 ? Number.POSITIVE_INFINITY : beforeEventSeq - 1);
	if (cursor.lastSeq > maxSeq) {
		if (beforeEventSeq !== void 0) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		return reset("invalid_cursor");
	}
	let serializedBytes = 0;
	let selectedCount = 0;
	let lastSeq = cursor.lastSeq;
	let hasMore = false;
	let requiredBytes;
	if (lastSeq < maxSeq) {
		const metadataQuery = transcript.select(["seq", sql`${transcriptEventReadBytesSql()} + 1`.as("serialized_bytes")]).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).orderBy("seq", "asc");
		for (let batchSize = 32; lastSeq < maxSeq; batchSize *= 2) {
			const limit = Math.min(batchSize, maxEvents + 1 - selectedCount);
			const metadata = executeSqliteQuerySync(database, metadataQuery.where("seq", ">", lastSeq).limit(limit)).rows;
			for (const row of metadata) {
				const rowBytes = coerceRequiredSqliteNumber(row.serialized_bytes);
				if (selectedCount >= maxEvents || serializedBytes + rowBytes > maxBytes) {
					hasMore = true;
					if (selectedCount === 0) requiredBytes = rowBytes;
					break;
				}
				serializedBytes += rowBytes;
				selectedCount += 1;
				lastSeq = coerceRequiredSqliteNumber(row.seq);
			}
			if (hasMore || metadata.length < limit) break;
		}
	}
	const rows = selectedCount === 0 ? [] : Array.from(iterateSqliteQuerySync(database, transcript.select([
		"event_json",
		"event_zstd",
		"event_utf8_bytes",
		"seq"
	]).where("seq", ">", cursor.lastSeq).where("seq", "<=", lastSeq).orderBy("seq", "asc")), (row) => ({
		event: JSON.parse(readTranscriptPayload(row)),
		seq: coerceRequiredSqliteNumber(row.seq)
	}));
	return {
		kind: "page",
		cursor: encodeRawTranscriptCursor({
			...cursor,
			lastSeq
		}),
		events: rows,
		hasMore,
		...requiredBytes !== void 0 ? { requiredBytes } : {},
		serializedBytes
	};
}
//#endregion
export { readTranscriptRawDeltaFromProjection as n, readRawDeltaInTransaction as t };
