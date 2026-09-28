import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { a as iterateSqliteQuerySync, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import "./session-transcript-reconcile-Cef06Gbk.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { a as selectMessageMetadata, n as getMessageRangeReaders, o as selectMessagePayload, r as parseActiveTranscriptMessageRow, s as selectMessageRows, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-CEJGTMGy.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { _ as resolveTranscriptBoundaryWindow, a as createVisibleMessageCursor, c as parseVisibleMessageCursor, d as iterateVisibleMessageMetadata, f as iterateVisibleMessageRange, h as readVisibleTranscriptStats, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, m as readVisibleMessageRange, n as DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, o as encodeVisibleMessageCursor, r as MAX_VISIBLE_MESSAGE_MAX_BYTES, s as normalizeVisibleMessageLimit, t as DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, v as resolveVisibleMessagePositions } from "./session-accessor.sqlite-visible-cursor-BfibSXF5.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-events.ts
/** Reads every message event on the active path. Full callers remain intentionally O(output). */
function readSessionTranscriptMessageEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		return readVisibleMessageRange(projection, 0, visible.total);
	});
}
/** Reads the last active-path message without hydrating its historical ancestors. */
function readLatestSessionTranscriptMessageEvent(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const row = getMessageRangeReaders(projection.database).latest({
			sessionId: projection.resolved.sessionId,
			start: 0,
			endExclusive: fence?.beforeActiveMessagePosition ?? projection.state.activeMessageCount
		});
		return row ? parseActiveTranscriptMessageRow(row) : void 0;
	});
}
/** Checks user control facts from an exact input on one active-path snapshot, without loading bodies. */
function everySessionTranscriptUserInputFrom(scope, idempotencyKey, accept) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const end = fence?.beforeActiveMessagePosition ?? projection.state.activeMessageCount;
		const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.message_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.message_idempotency_key", "=", idempotencyKey).where("active.message_position", "is not", null).where("active.message_position", "<", end).limit(1));
		if (anchor?.message_position == null) return false;
		const postStart = resolveTranscriptBoundaryWindow(projection, "history", fence?.beforeRawSeq)?.postBoundaryMessagePosition ?? 0;
		if (anchor.message_position < postStart) return false;
		const query = selectMessageRows(projection.database, projection.resolved.sessionId, {
			start: anchor.message_position,
			endExclusive: end
		}).select(sql`json_object('role', json_extract(${transcriptEventNavigationSql("event")}, '$.message.role'),
          'idempotencyKey', json_extract(${transcriptEventNavigationSql("event")}, '$.message.idempotencyKey'),
          '__openclaw', json_object('runId', json_extract(${transcriptEventNavigationSql("event")}, '$.message.__openclaw.runId')),
          'provenance', json_extract(${transcriptEventNavigationSql("event")}, '$.message.provenance'))`.as("message_json")).where(sql`json_extract(${transcriptEventNavigationSql("event")}, '$.message.role')`, "=", "user");
		let seen = false;
		for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
			seen = true;
			if (!accept(JSON.parse(row.message_json))) return false;
		}
		return seen;
	});
}
/** Visits messages synchronously inside one active-path read snapshot. */
function visitSessionTranscriptMessageEvents(scope, visit) {
	withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		for (const entry of iterateVisibleMessageRange(projection, 0, visible.total)) visit(entry);
	});
}
/** Classifies one entry against the authoritative active path and leaf. */
function readSessionTranscriptActivePathEntryRelation(scope, entryId) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		if (projection.state.leafEventId === entryId || entryId === null) return projection.state.leafEventId === entryId ? "exact" : "off-path";
		const db = getActiveTranscriptKysely(projection.database);
		return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("identity.seq").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", entryId).limit(1)) ? "ancestor" : "off-path";
	});
}
/** Reads a bounded context tail, preserving control facts but excluding display-only messages. */
function readRecentSessionTranscriptActiveEvents(scope, maxEvents) {
	return withRecentSessionTranscriptActiveEvents(scope, maxEvents, (visit) => {
		const events = [];
		visit((event) => events.push(event));
		return events.toReversed();
	});
}
/** Runs repeatable newest-first visits synchronously inside one context-tail snapshot. */
function withRecentSessionTranscriptActiveEvents(scope, maxEvents, read) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const limit = Math.max(0, Math.floor(Number.isFinite(maxEvents) ? maxEvents : 0));
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
	});
}
/** Reads logical transcript event count and JSONL byte size. */
function readSessionTranscriptActiveStats(scope) {
	return withCurrentProjectionSnapshot(scope, readVisibleTranscriptStats);
}
/** Reads one append-stable forward page from the materialized active-message projection. */
function readSessionTranscriptVisibleMessageDeltaCore(scope, limits = {}) {
	const maxMessages = normalizeVisibleMessageLimit(limits.maxMessages, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxMessages");
	const maxBytes = normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const transcriptFence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const generation = projection.generation;
		if (!generation) return { kind: "missing" };
		const initialCursor = createVisibleMessageCursor({
			agentId: projection.resolved.agentId,
			generation,
			sessionId: projection.resolved.sessionId
		});
		const reset = (reason) => ({
			kind: "reset",
			cursor: encodeVisibleMessageCursor(initialCursor),
			reason
		});
		const cursor = limits.cursor !== void 0 ? parseVisibleMessageCursor(limits.cursor) : initialCursor;
		if (!cursor) return reset("invalid_cursor");
		if (cursor.agentId !== projection.resolved.agentId || cursor.sessionId !== projection.resolved.sessionId) return reset("scope_mismatch");
		if (cursor.generation !== generation) return reset("generation_mismatch");
		if (transcriptFence !== void 0 && cursor.lastMessagePosition >= transcriptFence.beforeActiveMessagePosition) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		let startPosition = 0;
		if (cursor.lastEventSeq >= 0) {
			const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("event_seq", "=", cursor.lastEventSeq).where("message_position", "is not", null));
			if (anchor?.message_position === null || anchor?.message_position === void 0) return reset("anchor_missing");
			if (anchor.message_position !== cursor.lastMessagePosition) return reset("anchor_moved");
			startPosition = anchor.message_position + 1;
		}
		const metadata = executeSqliteQuerySync(projection.database.db, selectMessageMetadata(selectMessageRows(projection.database, projection.resolved.sessionId, {
			start: startPosition,
			endExclusive: transcriptFence?.beforeActiveMessagePosition ?? projection.state.activeMessageCount
		})).select("active.event_seq").limit(maxMessages + 1)).rows;
		let serializedBytes = 0;
		let selectedCount = 0;
		for (const row of metadata) {
			if (selectedCount >= maxMessages || serializedBytes + row.serialized_bytes > maxBytes) break;
			serializedBytes += row.serialized_bytes;
			selectedCount += 1;
		}
		const lastSelected = metadata[selectedCount - 1];
		const lastEventSeq = lastSelected?.event_seq ?? cursor.lastEventSeq;
		const lastMessagePosition = lastSelected?.message_position ?? cursor.lastMessagePosition;
		const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, selectMessagePayload(projection.database, selectMessageRows(projection.database, projection.resolved.sessionId, {
			start: startPosition,
			endExclusive: lastMessagePosition + 1
		})).leftJoin("session_transcript_active_events as parent_active", (join) => join.onRef("parent_active.session_id", "=", "active.session_id").on((eb) => eb("parent_active.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_event_identities as parent_identity", (join) => join.onRef("parent_identity.session_id", "=", "parent_active.session_id").onRef("parent_identity.seq", "=", "parent_active.event_seq")).select("parent_identity.event_id as parent_id")).rows.map((row) => {
			const { event, eventSeq, seq } = parseActiveTranscriptMessageRow(row);
			return {
				event,
				eventSeq,
				parentId: row.parent_id,
				seq
			};
		});
		const requiredBytes = selectedCount === 0 && metadata[0] ? metadata[0].serialized_bytes : void 0;
		return {
			kind: "page",
			cursor: encodeVisibleMessageCursor({
				...cursor,
				lastEventSeq,
				lastMessagePosition
			}),
			events: rows,
			hasMore: selectedCount < metadata.length,
			...requiredBytes !== void 0 ? { requiredBytes } : {},
			serializedBytes
		};
	});
}
/** Reads a bounded active-path tail while preserving transcript line and byte caps. */
function readRecentSessionTranscriptMessageEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxLines = Math.max(0, Math.floor(Number.isFinite(options.maxLines) ? options.maxLines : 0));
		if (maxMessages === 0 || maxLines === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			totalMessages: visible.total
		};
		const maxBytes = Math.max(1024, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 8388608));
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
	});
}
/** Reads a message page from either end with index range predicates, never OFFSET scanning. */
function readSessionTranscriptMessageEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const totalMessages = resolveVisibleMessagePositions(projection).total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0));
		const endExclusive = options.offsetFrom === "start" ? Math.min(totalMessages, offset + maxMessages) : totalMessages - offset;
		const start = options.offsetFrom === "start" ? offset : Math.max(0, endExclusive - maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleMessageRange(projection, start, endExclusive),
			totalMessages
		};
	}, options);
}
/** Reads a tail page whose materialized event payloads fit a hard byte budget. */
function readSessionTranscriptBoundedMessageTailPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const snapshot = {
			boundarySeq: resolveTranscriptBoundaryWindow(projection)?.boundarySeq,
			generation: projection.generation,
			indexedSeq: projection.state.indexedSeq
		};
		const totalMessages = visible.total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxBytes = Math.max(0, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 0));
		const endExclusive = Math.max(0, totalMessages - offset);
		const start = Math.max(0, endExclusive - maxMessages);
		const scannedMessages = endExclusive - start;
		if (scannedMessages === 0 || maxBytes === 0) return {
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
			activeLeafEntryId: projection.state.leafEventId,
			events,
			newestContiguousEventCount: newestContiguousEventCount ?? selectedPositions.length,
			scannedMessages,
			serializedBytes,
			snapshot,
			totalMessages
		};
	}, options);
}
//#endregion
export { readSessionTranscriptActivePathEntryRelation as a, readSessionTranscriptMessageEventPage as c, visitSessionTranscriptMessageEvents as d, withRecentSessionTranscriptActiveEvents as f, readRecentSessionTranscriptMessageEvents as i, readSessionTranscriptMessageEvents as l, readLatestSessionTranscriptMessageEvent as n, readSessionTranscriptActiveStats as o, readRecentSessionTranscriptActiveEvents as r, readSessionTranscriptBoundedMessageTailPage as s, everySessionTranscriptUserInputFrom as t, readSessionTranscriptVisibleMessageDeltaCore as u };
