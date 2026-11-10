import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { g as jsonValid, m as jsonSetPath, p as jsonRemovePaths, u as jsonPathValue } from "./json-values-BQ6WshKk.mjs";
import { c as transcriptEventJsonSql, d as transcriptEventNavigationSql, h as transcriptEventWithoutCustomDataBytesSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { o as readNextTranscriptSeq } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-transcript-retained-data.ts
/** Admit suffix repairs against their projected bytes without decoding opaque bodies. */
function transcriptRetainedDataBytesSql(database, retainedIds) {
	if (retainedIds.length === 0) return transcriptEventReadBytesSql();
	const event = transcriptEventNavigationSql(database);
	return sql`CASE WHEN ${jsonValid(database, event)} THEN
    CASE WHEN ${jsonPathValue(database, event, sql.lit("$.type"))} = 'custom'
      AND ${jsonPathValue(database, event, sql.lit("$.id"))} IN (${sql.join(retainedIds)})
      THEN ${transcriptEventWithoutCustomDataBytesSql(database)} ELSE ${transcriptEventReadBytesSql()} END
    ELSE ${transcriptEventReadBytesSql()} END`;
}
/** Custom data is opaque to topology and indexing; cleanup keeps it in SQLite. */
function projectTranscriptRetainedDataSql(database, event, retainedIds) {
	return retainedIds.length === 0 ? event : sql`CASE WHEN ${jsonValid(database, event)} THEN
        CASE WHEN ${jsonPathValue(database, event, sql.lit("$.type"))} = 'custom'
          AND ${jsonPathValue(database, event, sql.lit("$.id"))} IN (${sql.join(retainedIds)})
        THEN ${jsonRemovePaths(database, event, [sql.lit("$.data")])} ELSE ${event} END
      ELSE ${event} END`;
}
/** Stage opaque payloads inside the same transaction before their old suffix rows are removed. */
function stageRetainedTranscriptData(database, sessionId, expectedRows, next, retainedIds) {
	if (retainedIds.length === 0) return;
	const retained = new Set(retainedIds);
	const originals = new Map(expectedRows.flatMap((row) => {
		const event = JSON.parse(row.eventJson);
		return isRecord(event) && event.type === "custom" && typeof event.id === "string" && retained.has(event.id) ? [[event.id, {
			row,
			event
		}]] : [];
	}));
	const copies = next.flatMap((event, index) => {
		if (!isRecord(event) || event.type !== "custom" || typeof event.id !== "string" || !retained.has(event.id)) return [];
		const original = originals.get(event.id);
		if (!original) throw new Error("Retained transcript data has no original suffix row");
		const { parentId: _oldParent, ...before } = original.event;
		const { parentId, ...after } = event;
		if (Object.hasOwn(before, "data") || Object.hasOwn(after, "data") || !isDeepStrictEqual(before, after) || parentId !== null && typeof parentId !== "string") throw new Error("Retained transcript data permits only parent repair");
		return [{
			index,
			sourceSeq: original.row.seq,
			parentId
		}];
	});
	if (copies.length === 0) return;
	const startSeq = readNextTranscriptSeq(database, sessionId) + next.length;
	const sources = /* @__PURE__ */ new Map();
	for (const [offset, copy] of copies.entries()) {
		const stagedSeq = startSeq + offset;
		copyRetainedTranscriptPayload(database, sessionId, copy.sourceSeq, stagedSeq, copy.parentId);
		sources.set(copy.index, stagedSeq);
	}
	return {
		startSeq,
		sources
	};
}
/** Copy a transaction-owned payload without materializing it in JavaScript. */
function copyRetainedTranscriptPayload(database, sessionId, sourceSeq, destinationSeq, parentId) {
	const db = getSessionKysely(database.db);
	if (withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => executeSqliteQuerySync(database.db, db.insertInto("transcript_events").columns([
		"session_id",
		"seq",
		"event_json",
		"event_zstd",
		"event_utf8_bytes",
		"navigation_json",
		"navigation_type",
		"navigation_custom_type",
		"navigation_display",
		"message_role",
		"navigation_last_type",
		"navigation_last_custom_type",
		"navigation_valid",
		"created_at"
	]).expression(db.selectFrom("transcript_events").select((eb) => {
		const eventJson = parentId === void 0 ? eb.ref("event_json") : jsonSetPath(database.db, transcriptEventJsonSql(database.db), sql.lit("$.parentId"), sql.val(parentId));
		return [
			eb.val(sessionId).as("session_id"),
			eb.val(destinationSeq).as("seq"),
			eventJson.as("event_json"),
			parentId === void 0 ? eb.ref("event_zstd").as("event_zstd") : eb.val(null).as("event_zstd"),
			parentId !== void 0 && isPostgresSqlConnection(database.db) ? eb.fn("octet_length", [eventJson]).as("event_utf8_bytes") : (parentId === void 0 ? eb.ref("event_utf8_bytes") : eb.val(null)).as("event_utf8_bytes"),
			parentId === void 0 ? eb.ref("navigation_json").as("navigation_json") : eb.val(null).as("navigation_json"),
			"navigation_type",
			"navigation_custom_type",
			"navigation_display",
			"message_role",
			"navigation_last_type",
			"navigation_last_custom_type",
			"navigation_valid",
			"created_at"
		];
	}).where("session_id", "=", sessionId).where("seq", "=", sourceSeq)))).numAffectedRows !== 1n) throw new Error("Retained transcript payload disappeared during suffix insertion");
}
//#endregion
export { transcriptRetainedDataBytesSql as i, projectTranscriptRetainedDataSql as n, stageRetainedTranscriptData as r, copyRetainedTranscriptPayload as t };
