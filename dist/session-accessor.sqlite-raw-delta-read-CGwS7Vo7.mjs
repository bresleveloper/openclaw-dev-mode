import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { s as normalizeVisibleMessageLimit } from "./session-accessor.sqlite-visible-cursor-BfibSXF5.mjs";
import { t as readSessionTranscriptHotWatermark } from "./session-accessor.sqlite-transcript-watermark-read-CUQyYPNl.mjs";
//#region src/config/sessions/session-accessor.sqlite-raw-delta-read.ts
const RAW_TRANSCRIPT_CURSOR_VERSION = 1;
const DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS = 1e3;
const DEFAULT_RAW_TRANSCRIPT_MAX_BYTES = 1e6;
const MAX_RAW_TRANSCRIPT_EVENTS = 1e4;
const MAX_RAW_TRANSCRIPT_BYTES = 67108864;
function encodeRawTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
/** Mint the raw-delta cursor for a generation-consistent transcript snapshot. */
function createTranscriptRawDeltaCursor(params) {
	return encodeRawTranscriptCursor({
		...params,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	});
}
function parseRawTranscriptCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== RAW_TRANSCRIPT_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastSeq) || (parsed.lastSeq ?? -2) < -1) return;
		return parsed;
	} catch {
		return;
	}
}
function bootstrapCursor(scope, generation) {
	return {
		agentId: scope.agentId,
		generation,
		lastSeq: -1,
		sessionId: scope.sessionId,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	};
}
/** Host adapters validate limits before acquiring a database handle. */
function normalizeRawDeltaLimits(limits) {
	return {
		maxEvents: normalizeVisibleMessageLimit(limits.maxEvents, DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS, MAX_RAW_TRANSCRIPT_EVENTS, "maxEvents"),
		maxBytes: normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_RAW_TRANSCRIPT_MAX_BYTES, MAX_RAW_TRANSCRIPT_BYTES, "maxBytes")
	};
}
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
	const initialCursor = bootstrapCursor(scope, generation);
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
	const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(database, transcript.select([transcriptEventJsonSql(database).as("event_json"), "seq"]).where("seq", ">", cursor.lastSeq).where("seq", "<=", lastSeq).orderBy("seq", "asc")).rows.map((row) => ({
		event: JSON.parse(row.event_json),
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
export { readTranscriptRawDeltaFromProjection as i, normalizeRawDeltaLimits as n, readRawDeltaInTransaction as r, createTranscriptRawDeltaCursor as t };
