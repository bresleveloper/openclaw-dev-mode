import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { a as readSnapshotEventRows, r as parseActiveTranscriptMessageRow, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { l as resolveTranscriptBoundaryWindow, o as readVisibleMessageRange, r as iterateVisibleMessageMetadata, t as hasOversizedVisibleMessages, u as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-Cl0GzV50.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-events-read.ts
/** Reads a bounded active-path tail while preserving transcript line and byte caps. */
function readRecentSessionTranscriptMessageEventsFromProjection(projection, options) {
	const visible = resolveVisibleMessagePositions(projection);
	const maxMessages = resolveIntegerOption(options.maxMessages, 0, {
		min: 0,
		max: MAX_VISIBLE_MESSAGE_MAX_MESSAGES
	});
	const maxLines = resolveIntegerOption(options.maxLines, 0, { min: 0 });
	if (maxMessages === 0 || maxLines === 0) return {
		activeLeafEntryId: projection.state.leafEventId,
		events: [],
		totalMessages: visible.total
	};
	const maxBytes = resolveIntegerOption(options.maxBytes, 8388608, { min: 1024 });
	const candidates = iterateVisibleMessageMetadata(projection, Math.max(0, visible.total - Math.min(maxLines, maxMessages)), visible.total, "desc");
	let selectedStart = visible.total;
	let bytes = 0;
	for (const row of candidates) {
		if (selectedStart < visible.total && bytes + row.serialized_bytes > maxBytes) break;
		selectedStart = row.logicalPosition;
		bytes += row.serialized_bytes;
	}
	return {
		activeLeafEntryId: projection.state.leafEventId,
		events: readVisibleMessageRange(projection, selectedStart, visible.total),
		totalMessages: visible.total
	};
}
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
	const selected = [];
	let newestContiguousEventCount;
	let serializedBytes = 0;
	for (let index = metadata.length - 1; index >= 0; index -= 1) {
		const row = metadata[index];
		if (serializedBytes + row.serialized_bytes > maxBytes) {
			newestContiguousEventCount ??= selected.length;
			continue;
		}
		selected.push(row);
		serializedBytes += row.serialized_bytes;
	}
	const payloads = new Map(selected.length === 0 ? [] : readSnapshotEventRows(projection, selected.map((row) => row.event_seq)).map((row) => [row.seq, row]));
	const events = selected.toSorted((left, right) => left.message_position - right.message_position).flatMap((row) => {
		const payload = payloads.get(row.event_seq);
		return payload === void 0 ? [] : [parseActiveTranscriptMessageRow({
			...row,
			...payload
		})];
	});
	return {
		...checked,
		activeLeafEntryId: projection.state.leafEventId,
		events,
		newestContiguousEventCount: newestContiguousEventCount ?? selected.length,
		scannedMessages,
		serializedBytes,
		snapshot,
		totalMessages
	};
}
//#endregion
export { readSessionTranscriptBoundedMessageTailPageFromProjection as n, withRecentSessionTranscriptActiveEventsInSnapshot as r, readRecentSessionTranscriptMessageEventsFromProjection as t };
