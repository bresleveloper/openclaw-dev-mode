import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { _ as assertTranscriptNavigationValid, d as transcriptEventNavigationSql, p as transcriptEventRunIdSql } from "./transcript-payload-Cu49oQKq.mjs";
import { a as createVisibleMessageCursor, l as parseVisibleMessageCursor, o as encodeVisibleMessageCursor, s as normalizeVisibleDeltaLimits } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import "./session-transcript-reconcile-BkwlDaaD.mjs";
import { r as readActivePathEntryRelationFromProjection } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { c as selectMessageRows, n as getMessageRangeReaders, o as selectMessageMetadata, r as parseActiveTranscriptMessageRow, s as selectMessagePayload, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { l as resolveTranscriptBoundaryWindow, o as readVisibleMessageRange, u as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-Cl0GzV50.mjs";
import { n as readSessionTranscriptBoundedMessageTailPageFromProjection, r as withRecentSessionTranscriptActiveEventsInSnapshot, t as readRecentSessionTranscriptMessageEventsFromProjection } from "./session-accessor.sqlite-active-events-read-AJh0lWpC.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-events.ts
/** Reads every message event on the active path. Full callers remain intentionally O(output). */
function readSessionTranscriptMessageEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		return readVisibleMessageRange(projection, 0, visible.total);
	});
}
/** Reads the last active-path message without hydrating its historical ancestors. */
function readLatestSessionTranscriptMessageEvent(scope, options) {
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
	}, options);
}
/** Checks user control facts from an exact input on one active-path snapshot, without loading bodies. */
function everySessionTranscriptUserInputFrom(scope, idempotencyKey, accept, preparedProjection) {
	const read = (projection) => {
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
		}).select(sql`json_object('role', json_extract(${transcriptEventNavigationSql(projection.database.db, "event")}, '$.message.role'),
          'idempotencyKey', json_extract(${transcriptEventNavigationSql(projection.database.db, "event")}, '$.message.idempotencyKey'),
          '__openclaw', json_object('runId', ${transcriptEventRunIdSql(projection.database.db, "event")}),
          'provenance', json_extract(${transcriptEventNavigationSql(projection.database.db, "event")}, '$.message.provenance'))`.as("message_json")).select("event.navigation_valid").where((eb) => eb.or([eb("event.message_role", "=", "user"), eb("event.navigation_valid", "=", 0)]));
		let seen = false;
		for (const row of iterateSqliteQuerySync(projection.database.db, query)) {
			assertTranscriptNavigationValid(row.navigation_valid);
			seen = true;
			if (!accept(JSON.parse(row.message_json))) return false;
		}
		return seen;
	};
	return preparedProjection ? read(preparedProjection) : withCurrentProjectionSnapshot(scope, read);
}
/** Classifies one entry against the authoritative active path and leaf. */
function readSessionTranscriptActivePathEntryRelation(scope, entryId, options = {}) {
	return withCurrentProjectionSnapshot(scope, (projection) => readActivePathEntryRelationFromProjection(projection, entryId), options);
}
/** Reads a bounded context tail, preserving control facts but excluding display-only messages. */
function readRecentSessionTranscriptActiveEvents(scope, maxEvents, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => withRecentSessionTranscriptActiveEventsInSnapshot(projection, maxEvents, (visit) => {
		const events = [];
		visit((event) => events.push(event));
		return events.toReversed();
	}), options);
}
/** Reads one append-stable forward page from the materialized active-message projection. */
function readSessionTranscriptVisibleMessageDeltaCore(scope, limits = {}, options) {
	const { maxMessages, maxBytes } = normalizeVisibleDeltaLimits(limits);
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
			if (anchor?.message_position == null) return reset("anchor_missing");
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
		const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, selectMessagePayload(selectMessageRows(projection.database, projection.resolved.sessionId, {
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
	}, options);
}
/** Reads a bounded active-path tail while preserving transcript line and byte caps. */
function readRecentSessionTranscriptMessageEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => readRecentSessionTranscriptMessageEventsFromProjection(projection, options));
}
/** Reads a message page from either end with index range predicates, never OFFSET scanning. */
function readSessionTranscriptMessageEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const totalMessages = resolveVisibleMessagePositions(projection).total;
		const offset = resolveIntegerOption(options.offset, 0, {
			min: 0,
			max: totalMessages
		});
		const maxMessages = resolveIntegerOption(options.maxMessages, 0, { min: 0 });
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
	return withCurrentProjectionSnapshot(scope, (projection) => readSessionTranscriptBoundedMessageTailPageFromProjection(projection, options), options);
}
//#endregion
export { readSessionTranscriptActivePathEntryRelation as a, readSessionTranscriptMessageEvents as c, readRecentSessionTranscriptMessageEvents as i, readSessionTranscriptVisibleMessageDeltaCore as l, readLatestSessionTranscriptMessageEvent as n, readSessionTranscriptBoundedMessageTailPage as o, readRecentSessionTranscriptActiveEvents as r, readSessionTranscriptMessageEventPage as s, everySessionTranscriptUserInputFrom as t };
