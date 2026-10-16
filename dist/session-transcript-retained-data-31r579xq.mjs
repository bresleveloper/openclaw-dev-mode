import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sql, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { p as transcriptEventWithoutCustomDataBytesSql, s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-Ugk-kDyr.mjs";
import { o as readNextTranscriptSeq } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-transcript-retained-data.ts
/** Admit suffix repairs against their projected bytes without decoding opaque bodies. */
function transcriptRetainedDataBytesSql(retainedIds) {
	if (retainedIds.length === 0) return transcriptEventReadBytesSql();
	const event = transcriptEventNavigationSql();
	return sql`CASE WHEN json_valid(${event}) THEN
    CASE WHEN json_extract(${event}, '$.type') = 'custom'
      AND json_extract(${event}, '$.id') IN (${sql.join(retainedIds)})
      THEN ${transcriptEventWithoutCustomDataBytesSql()} ELSE ${transcriptEventReadBytesSql()} END
    ELSE ${transcriptEventReadBytesSql()} END`;
}
/** Custom data is opaque to topology and indexing; cleanup keeps it in SQLite. */
function projectTranscriptRetainedDataSql(event, retainedIds) {
	return retainedIds.length === 0 ? event : sql`CASE WHEN json_valid(${event}) THEN
        CASE WHEN json_extract(${event}, '$.type') = 'custom'
          AND json_extract(${event}, '$.id') IN (${sql.join(retainedIds)})
        THEN json_remove(${event}, '$.data') ELSE ${event} END
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
	if (executeSqliteQuerySync(database.db, db.insertInto("transcript_events").columns([
		"session_id",
		"seq",
		"event_json",
		"event_zstd",
		"event_utf8_bytes",
		"navigation_json",
		"created_at"
	]).expression(db.selectFrom("transcript_events").select((eb) => {
		const eventJson = parentId === void 0 ? eb.ref("event_json") : sql`json_set(${transcriptEventJsonSql(database.db)}, '$.parentId', ${parentId})`;
		return [
			eb.val(sessionId).as("session_id"),
			eb.val(destinationSeq).as("seq"),
			eventJson.as("event_json"),
			parentId === void 0 ? eb.ref("event_zstd").as("event_zstd") : eb.val(null).as("event_zstd"),
			parentId === void 0 ? eb.ref("event_utf8_bytes").as("event_utf8_bytes") : eb.val(null).as("event_utf8_bytes"),
			parentId === void 0 ? eb.ref("navigation_json").as("navigation_json") : eb.val(null).as("navigation_json"),
			"created_at"
		];
	}).where("session_id", "=", sessionId).where("seq", "=", sourceSeq))).numAffectedRows !== 1n) throw new Error("Retained transcript payload disappeared during suffix insertion");
}
//#endregion
export { transcriptRetainedDataBytesSql as i, projectTranscriptRetainedDataSql as n, stageRetainedTranscriptData as r, copyRetainedTranscriptPayload as t };
