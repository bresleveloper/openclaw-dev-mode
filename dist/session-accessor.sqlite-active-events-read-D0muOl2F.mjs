import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES } from "./session-accessor.sqlite-visible-cursor-CJh4GhW9.mjs";
import { o as selectMessagePayload, r as parseActiveTranscriptMessageRow, s as selectMessageRows, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-Daj5_oBL.mjs";
import { d as resolveVisibleMessagePositions, i as iterateVisibleMessageMetadata, n as hasOversizedVisibleMessages, u as resolveTranscriptBoundaryWindow } from "./session-accessor.sqlite-reset-window-BfaTzfLM.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-events-read.ts
/** Runs repeatable newest-first visits synchronously inside one context-tail snapshot. */
function withRecentSessionTranscriptActiveEventsInSnapshot(projection, maxEvents, read) {
	const limit = resolveIntegerOption(maxEvents, 0, { min: 0 });
	const query = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(transcriptEventJsonSql(projection.database.db, "event").as("event_json")).where("active.session_id", "=", projection.resolved.sessionId).where("active.context_eligible", "=", 1).orderBy("active.active_position", "desc").limit(limit);
	let active = true;
	try {
		return read((visitor) => {
			if (!active) throw new Error("Transcript visitor used outside its read snapshot");
			if (limit === 0) return;
			let parseError;
			for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
				let event;
				try {
					event = JSON.parse(row.event_json);
				} catch (error) {
					parseError = toErrorObject(error, "Transcript event JSON parsing failed");
					continue;
				}
				visitor(event);
			}
			if (parseError !== void 0) throw parseError;
		});
	} finally {
		active = false;
	}
}
function readSessionTranscriptBoundedMessageTailPageFromProjection(projection, options) {
	const visible = resolveVisibleMessagePositions(projection);
	const snapshot = {
		boundarySeq: resolveTranscriptBoundaryWindow(projection)?.boundarySeq,
		generation: projection.generation,
		indexedSeq: projection.state.indexedSeq
	};
	const totalMessages = visible.total;
	const offset = resolveIntegerOption(options.offset, 0, {
		min: 0,
		max: totalMessages
	});
	const maxMessages = resolveIntegerOption(options.maxMessages, 0, {
		min: 0,
		max: MAX_VISIBLE_MESSAGE_MAX_MESSAGES
	});
	const maxBytes = resolveIntegerOption(options.maxBytes, 0, { min: 0 });
	const endExclusive = Math.max(0, totalMessages - offset);
	const start = Math.max(0, endExclusive - maxMessages);
	const scannedMessages = endExclusive - start;
	const oversized = options.oversizedMessageCheck;
	const checked = oversized ? { hasOversizedMessages: hasOversizedVisibleMessages(projection, oversized.includeEarlier ? 0 : start, endExclusive, maxBytes, oversized.roles) } : {};
	if (scannedMessages === 0 || maxBytes === 0) return {
		...checked,
		activeLeafEntryId: projection.state.leafEventId,
		events: [],
		newestContiguousEventCount: 0,
		scannedMessages,
		serializedBytes: 0,
		snapshot,
		totalMessages
	};
	const metadata = Array.from(iterateVisibleMessageMetadata(projection, start, endExclusive));
	if (metadata.length !== scannedMessages) throw new Error("Active transcript bounded message page is incomplete");
	const selectedPositions = [];
	let newestContiguousEventCount;
	let serializedBytes = 0;
	for (let index = metadata.length - 1; index >= 0; index -= 1) {
		const row = metadata[index];
		if (serializedBytes + row.serialized_bytes > maxBytes) {
			newestContiguousEventCount ??= selectedPositions.length;
			continue;
		}
		selectedPositions.push(row.message_position);
		serializedBytes += row.serialized_bytes;
	}
	const events = selectedPositions.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, selectMessagePayload(projection.database, selectMessageRows(projection.database, projection.resolved.sessionId, { positions: selectedPositions }))).rows.map(parseActiveTranscriptMessageRow);
	return {
		...checked,
		activeLeafEntryId: projection.state.leafEventId,
		events,
		newestContiguousEventCount: newestContiguousEventCount ?? selectedPositions.length,
		scannedMessages,
		serializedBytes,
		snapshot,
		totalMessages
	};
}
//#endregion
export { withRecentSessionTranscriptActiveEventsInSnapshot as n, readSessionTranscriptBoundedMessageTailPageFromProjection as t };
