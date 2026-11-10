import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { s as hasUncommittedSqliteWrites } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, p as sql, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { _ as assertTranscriptNavigationValid, c as transcriptEventJsonSql, o as readTranscriptPayload } from "./transcript-payload-Cu49oQKq.mjs";
import { t as SOURCE_PAGE_MAX_BYTES } from "./session-transcript-source-pages-DzseyJB5.mjs";
import { r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE } from "./internal-runtime-context-DLJtDQoI.mjs";
import { t as isVisibleHistoryNonMessageEvent } from "./session-history-visibility-CUkAHE4T.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-Da7SpARz.mjs";
import { n as isVisibleTranscriptRecord } from "./transcript-visible-record-CmGktXrb.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { n as resolveHistoryAnchorPageRange, r as resolveTranscriptPageEnd, t as boundHistoryAnchorPageRange } from "./transcript-anchor-page-CKxnXLW4.mjs";
import { n as createTranscriptDisplaySource, t as createTranscriptDisplayPositionFromActivity } from "./transcript-display-position-BHW0T3ai.mjs";
import { n as createTranscriptRawDeltaCursor } from "./session-transcript-raw-cursor-fGQxJVDh.mjs";
import { n as resolveSessionTranscriptReadFence, r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { a as readSnapshotEventRows, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { n as readTranscriptRawDeltaFromProjection } from "./session-accessor.sqlite-raw-delta-read-D_J6L0BJ.mjs";
import { a as readUnindexedHistoryControls, c as resolveClosedResetInterval, d as findUnindexedActiveTranscriptEntry, i as iterateVisibleMessageRange, l as resolveTranscriptBoundaryWindow, n as hasUnindexedVisibleMessages, o as readVisibleMessageRange, p as iterateUnindexedTranscriptNavigation, r as iterateVisibleMessageMetadata, u as resolveVisibleMessagePositions } from "./session-accessor.sqlite-reset-window-Cl0GzV50.mjs";
import { t as engineIndexHint } from "./index-hint-Bu_q2kZQ.mjs";
//#region src/config/sessions/session-accessor.sqlite-display-position.ts
function readTranscriptDisplaySource(projection) {
	const generation = projection.generation;
	return generation ? createTranscriptDisplaySource([
		"sqlite",
		projection.database.path,
		projection.resolved.agentId,
		projection.resolved.sessionId,
		generation
	]) : void 0;
}
/** Enrich only selected rows, in their existing snapshot; anchor lookups never load payloads. */
function positionTranscriptDisplayEvents(projection, source, events, indexedSeq = projection.state.indexedSeq) {
	if (!source || events.length === 0) return events;
	const activities = events.map(({ event }) => readNestedToolActivity(asOptionalRecord(event)?.message)?.details);
	const anchors = [...new Set(activities.flatMap((activity) => activity?.afterEntryId ?? []))];
	const sequences = /* @__PURE__ */ new Map();
	const beforeRawSeq = resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	})?.beforeRawSeq;
	const maxSeq = Math.min(indexedSeq, beforeRawSeq === void 0 ? Infinity : beforeRawSeq - 1);
	if (anchors.length > 0) {
		const rows = executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom(sql`${sqliteStringSet(anchors)}`.as("requested")).crossJoin("transcript_event_identities as identity").select(["identity.event_id", "identity.seq"]).where("identity.session_id", "=", projection.resolved.sessionId).whereRef("identity.event_id", "=", "requested.value").where("identity.seq", "<=", maxSeq)).rows;
		for (const row of rows) sequences.set(row.event_id, row.seq);
	}
	if (projection.hasUnindexedPrefix) {
		const missing = new Set(anchors.filter((id) => !sequences.has(id)));
		if (missing.size > 0) for (const row of iterateUnindexedTranscriptNavigation(projection, {
			eventIds: [...missing],
			maxRawSeq: maxSeq
		})) {
			const id = typeof row.event.id === "string" ? row.event.id.trim() : void 0;
			if (id !== void 0 && missing.has(id)) sequences.set(id, row.event_seq);
		}
	}
	return events.map((row, index) => ({
		...row,
		displayPosition: createTranscriptDisplayPositionFromActivity(source, row.eventSeq, activities[index], (id) => sequences.get(id))
	}));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-interval.ts
/** Select display slots without loading custom content or details into history metadata. */
function isVisibleHistoryNonMessageEventSql(type, display, customType, valid) {
	return sql`(${type} IN ('compaction', 'reset', 'custom_message') AND CASE
    WHEN ${type} IN ('compaction', 'reset') THEN TRUE
    WHEN ${type} = 'custom_message' THEN
      ${valid} = 0 OR (${display} = 1 AND (${customType} IS NULL OR ${customType} != ${OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE}))
    ELSE FALSE END)`;
}
const historyNavigationValidSql = sql`CASE WHEN identity.event_type = 'custom_message' THEN event.navigation_valid ELSE 1 END`;
function parseStoredTranscriptEvent(eventJson) {
	return JSON.parse(eventJson);
}
function selectHistoricalDisplayEvents(projection, interval) {
	const active = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active");
	const identity = getActiveTranscriptKysely(projection.database).selectFrom("transcript_event_identities").select([
		"session_id",
		"seq",
		"event_type"
	]).modifyEnd(engineIndexHint(projection.database.db, "idx_agent_transcript_event_identity_sequence")).as("identity");
	const withIdentity = projection.hasUnindexedPrefix ? active.leftJoin(identity, (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")) : active.innerJoin(identity, (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq"));
	const unindexedControls = readUnindexedHistoryControls(projection).filter((row) => isVisibleHistoryNonMessageEvent(row.event) && row.active_position > interval.startExclusiveActivePosition && row.active_position <= interval.endInclusiveActivePosition).map((row) => row.event_seq);
	return withIdentity.innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", ">", interval.startExclusiveActivePosition).where("active.active_position", "<=", interval.endInclusiveActivePosition).where((eb) => eb.or([
		eb("active.message_position", "is not", null),
		isVisibleHistoryNonMessageEventSql(eb.ref("identity.event_type"), eb.ref("event.navigation_display"), eb.ref("event.navigation_custom_type"), eb.ref("event.navigation_valid")),
		...unindexedControls.length > 0 ? [eb("active.event_seq", "in", sql`(SELECT value FROM json_each(${JSON.stringify(unindexedControls)}))`)] : []
	]));
}
function selectDisplayableActiveEventById(projection, eventId) {
	return getActiveTranscriptKysely(projection.database).selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
		"active.event_seq",
		"active.active_position",
		"active.message_position",
		"identity.event_type",
		historyNavigationValidSql.as("navigation_valid")
	]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", eventId).where((eb) => eb.or([eb("active.message_position", "is not", null), isVisibleHistoryNonMessageEventSql(eb.ref("identity.event_type"), eb.ref("event.navigation_display"), eb.ref("event.navigation_custom_type"), eb.ref("event.navigation_valid"))]));
}
function readDisplayableActiveEventById(projection, eventId, maxBytes) {
	const db = getActiveTranscriptKysely(projection.database);
	const indexed = executeSqliteQueryTakeFirstSync(projection.database.db, selectDisplayableActiveEventById(projection, eventId).select((eb) => maxBytes === void 0 ? transcriptEventJsonSql(projection.database.db, "event").as("event_json") : eb.case().when(eb(transcriptEventReadBytesSql("event"), "<=", maxBytes)).then(transcriptEventJsonSql(projection.database.db, "event")).else(null).end().as("event_json")));
	assertTranscriptNavigationValid(indexed?.navigation_valid);
	if (indexed) return indexed.event_json === null ? void 0 : {
		...indexed,
		event_json: indexed.event_json
	};
	const unindexed = findUnindexedActiveTranscriptEntry(projection, eventId);
	if (!unindexed || unindexed.message_position === null && !isVisibleHistoryNonMessageEvent(unindexed.event)) return;
	if (maxBytes !== void 0 && unindexed.serialized_bytes - 1 > maxBytes) return;
	const event = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(projection.database.db).as("event_json")).where("session_id", "=", projection.resolved.sessionId).where("seq", "=", unindexed.event_seq));
	return event ? {
		event_seq: unindexed.event_seq,
		active_position: unindexed.active_position,
		message_position: unindexed.message_position,
		event_type: typeof unindexed.event.type === "string" ? unindexed.event.type : null,
		event_json: event.event_json
	} : void 0;
}
function readDisplayableActiveEventMetadataById(projection, eventId) {
	const indexed = executeSqliteQueryTakeFirstSync(projection.database.db, selectDisplayableActiveEventById(projection, eventId));
	assertTranscriptNavigationValid(indexed?.navigation_valid);
	if (indexed) return indexed;
	const unindexed = findUnindexedActiveTranscriptEntry(projection, eventId);
	if (!unindexed || unindexed.message_position === null && !isVisibleHistoryNonMessageEvent(unindexed.event)) return;
	return {
		event_seq: unindexed.event_seq,
		active_position: unindexed.active_position,
		message_position: unindexed.message_position,
		event_type: typeof unindexed.event.type === "string" ? unindexed.event.type : null
	};
}
function countHistoricalDisplayEvents(projection, interval, beforeActivePosition) {
	const query = selectHistoricalDisplayEvents(projection, interval).select((eb) => [eb.fn.countAll().as("event_count"), eb.fn.min(historyNavigationValidSql).as("navigation_valid")]).where("active.active_position", "<", beforeActivePosition);
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, query);
	assertTranscriptNavigationValid(row?.navigation_valid ?? void 0);
	return row?.event_count ?? 0;
}
function readHistoricalDisplayEventRange(projection, displaySource, interval, start, count, anchor, maxBytes, anchorOptions) {
	if (count <= 0) return [];
	const query = selectHistoricalDisplayEvents(projection, interval).select((eb) => [
		"active.event_seq",
		historyNavigationValidSql.as("navigation_valid"),
		eb(transcriptEventReadBytesSql("event"), "+", 1).as("serialized_bytes")
	]);
	const olderCount = Math.max(0, anchor.displayPosition - start);
	const older = olderCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, query.where("active.active_position", "<", anchor.activePosition).orderBy("active.active_position", "desc").limit(olderCount)).rows;
	const newer = executeSqliteQuerySync(projection.database.db, query.where("active.active_position", start > anchor.displayPosition ? ">" : ">=", anchor.activePosition).orderBy("active.active_position", "asc").limit(count - olderCount)).rows;
	const ranged = [...older.toReversed(), ...newer].map((row, index) => {
		assertTranscriptNavigationValid(row.navigation_valid);
		return Object.assign(row, { displaySeq: start + index + 1 });
	});
	const limit = Math.min(SOURCE_PAGE_MAX_BYTES, Math.max(1024, Math.floor(maxBytes ?? 8388608)));
	const selectedRange = boundHistoryAnchorPageRange({
		readStart: 0,
		endExclusive: ranged.length,
		hasOverreadContext: false,
		offset: 0
	}, anchorOptions ? anchor.displayPosition - start : ranged.length - 1, limit, (position) => ranged[position].serialized_bytes, anchorOptions !== void 0 && maxBytes === void 0);
	const selected = ranged.slice(selectedRange.start, selectedRange.endExclusive);
	if (selected.length === 0) return [];
	const payloads = executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("transcript_events").select(["seq", transcriptEventJsonSql(projection.database.db).as("event_json")]).where("session_id", "=", projection.resolved.sessionId).where("seq", "in", selected.map((row) => row.event_seq))).rows;
	const payloadBySeq = new Map(payloads.map((row) => [row.seq, row.event_json]));
	return positionTranscriptDisplayEvents(projection, displaySource, selected.flatMap((row) => {
		const eventJson = payloadBySeq.get(row.event_seq);
		return eventJson === void 0 ? [] : [{
			event: parseStoredTranscriptEvent(eventJson),
			eventSeq: row.event_seq,
			seq: row.displaySeq
		}];
	}));
}
function resolveClosedResetIntervalForDisplayable(projection, row) {
	if (typeof row.event_type !== "string") return;
	return resolveClosedResetInterval(projection, {
		activePosition: row.active_position,
		eventType: row.event_type
	});
}
function resolveHistoricalHistoryEvent(projection, row) {
	const interval = resolveClosedResetIntervalForDisplayable(projection, row);
	if (!interval) return;
	return {
		event: parseStoredTranscriptEvent(row.event_json),
		eventSeq: row.event_seq,
		seq: countHistoricalDisplayEvents(projection, interval, row.active_position) + 1
	};
}
function readHistoricalHistoryPrecedingEvent(projection, row, event) {
	const interval = resolveClosedResetIntervalForDisplayable(projection, row);
	return interval && event.seq > 1 ? readHistoricalDisplayEventRange(projection, void 0, interval, event.seq - 2, 1, {
		activePosition: row.active_position,
		displayPosition: event.seq - 1
	})[0] : void 0;
}
function readHistoricalHistoryAnchorPage(projection, displaySource, row, options, excludeClosingReset = false) {
	const interval = resolveClosedResetIntervalForDisplayable(projection, row);
	if (!interval) return;
	const counts = executeSqliteQueryTakeFirstSync(projection.database.db, selectHistoricalDisplayEvents(projection, interval).select((eb) => [
		eb.fn.countAll().as("total"),
		eb.fn.min(historyNavigationValidSql).as("navigation_valid"),
		eb.fn.countAll().filterWhere("active.active_position", "<", row.active_position).as("before_anchor")
	]));
	assertTranscriptNavigationValid(counts?.navigation_valid ?? void 0);
	const anchorPosition = counts?.before_anchor ?? 0;
	const total = excludeClosingReset ? anchorPosition : counts?.total ?? 0;
	const range = resolveHistoryAnchorPageRange(total, excludeClosingReset ? total - 1 : anchorPosition, options);
	const requested = range.endExclusive - range.readStart;
	const events = readHistoricalDisplayEventRange(projection, displaySource, interval, range.readStart, requested, {
		activePosition: row.active_position,
		displayPosition: anchorPosition
	}, options.maxBytes, options);
	return {
		events,
		found: true,
		hasOverreadContext: range.hasOverreadContext && events[0]?.seq === range.readStart + 1,
		offset: total - (events.at(-1)?.seq ?? range.endExclusive),
		displaySource,
		totalMessages: total
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-projection.ts
function resolveHistoryBoundaryQueryShape(projection, boundaryActivePosition) {
	if (boundaryActivePosition !== void 0) return "reset";
	if (projection.state.activeEventCount >= projection.state.indexedSeq) return "markers";
	const db = getActiveTranscriptKysely(projection.database);
	return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom(db.selectFrom("transcript_event_identities").select([
		"session_id",
		"event_type",
		"seq"
	]).modifyEnd(sql`INDEXED BY idx_agent_transcript_event_sequence`).as("identity")).select("seq").where("session_id", "=", projection.resolved.sessionId).where("event_type", "in", [
		"compaction",
		"reset",
		"custom_message"
	]).limit(1).offset(Math.max(0, projection.state.activeEventCount - 1))) ? "branch" : "markers";
}
function selectVisibleHistoryBoundaries(database, sessionId, shape, boundaryActivePosition) {
	const db = getActiveTranscriptKysely(database);
	const identity = db.selectFrom("transcript_event_identities").select([
		"session_id",
		"event_id",
		"seq",
		"event_type"
	]).modifyEnd(shape === "markers" ? sql`INDEXED BY idx_agent_transcript_event_sequence` : sql`INDEXED BY idx_agent_transcript_event_identity_sequence`).as("identity");
	return (shape === "markers" ? db.selectFrom(identity).crossJoin("session_transcript_active_events as active") : db.selectFrom("session_transcript_active_events as active").crossJoin(identity)).crossJoin("transcript_events as event").whereRef("identity.session_id", "=", "active.session_id").whereRef("identity.seq", "=", "active.event_seq").whereRef("event.session_id", "=", "active.session_id").whereRef("event.seq", "=", "active.event_seq").where("active.session_id", "=", sessionId).where((eb) => {
		const visible = isVisibleHistoryNonMessageEventSql(eb.ref("identity.event_type"), eb.ref("event.navigation_display"), eb.ref("event.navigation_custom_type"), eb.ref("event.navigation_valid"));
		if (boundaryActivePosition === void 0) return visible;
		const inWindow = eb("active.active_position", ">=", boundaryActivePosition);
		return eb.and([inWindow, visible]);
	});
}
const historyCountReaders = createSqliteQueryCache(() => /* @__PURE__ */ new Map());
function getHistoryCountReader(database, shape) {
	const readers = historyCountReaders(database.db);
	let read = readers.get(shape);
	if (!read) {
		read = prepareSqliteQueryTakeFirstSync(database.db, (parameter) => selectVisibleHistoryBoundaries(database, parameter((params) => params.sessionId), shape, shape === "reset" ? parameter((params) => params.boundaryActivePosition) : void 0).select((eb) => [eb.fn.countAll().as("event_count"), eb.fn.min(historyNavigationValidSql).as("navigation_valid")]));
		readers.set(shape, read);
	}
	return read;
}
function resolveVisibleHistoryEventCount(projection) {
	if (projection.state.activeEventCount === projection.state.activeMessageCount) return projection.state.activeMessageCount;
	const visibleMessages = resolveVisibleMessagePositions(projection);
	const shape = resolveHistoryBoundaryQueryShape(projection, visibleMessages.boundaryActivePosition);
	const count = getHistoryCountReader(projection.database, shape)({
		sessionId: projection.resolved.sessionId,
		boundaryActivePosition: visibleMessages.boundaryActivePosition ?? 0
	});
	assertTranscriptNavigationValid(count?.navigation_valid ?? void 0);
	const unindexed = readUnindexedHistoryControls(projection).filter((row) => isVisibleHistoryNonMessageEvent(row.event) && row.active_position >= (visibleMessages.boundaryActivePosition ?? 0));
	return visibleMessages.total + (count?.event_count ?? 0) + unindexed.length;
}
function resolveVisibleHistoryProjection(projection) {
	const displaySource = readTranscriptDisplaySource(projection);
	if (projection.state.activeEventCount === projection.state.activeMessageCount) return {
		boundaries: [],
		displaySource,
		latestResetRawSeq: null,
		total: projection.state.activeMessageCount
	};
	const visibleMessages = resolveVisibleMessagePositions(projection);
	const latestResetRawSeq = resolveTranscriptBoundaryWindow(projection)?.boundarySeq ?? null;
	const db = getActiveTranscriptKysely(projection.database);
	const rows = executeSqliteQuerySync(projection.database.db, selectVisibleHistoryBoundaries(projection.database, projection.resolved.sessionId, resolveHistoryBoundaryQueryShape(projection, visibleMessages.boundaryActivePosition), visibleMessages.boundaryActivePosition).leftJoin("session_transcript_active_events as following", (join) => join.onRef("following.session_id", "=", "active.session_id").on((eb) => eb("following.active_position", "=", eb("active.active_position", "+", 1)))).select([
		"active.active_position",
		"following.message_position as following_message_position",
		"identity.event_id",
		"identity.seq",
		historyNavigationValidSql.as("navigation_valid"),
		sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
	]).orderBy("active.active_position", "asc")).rows;
	for (const row of rows) assertTranscriptNavigationValid(row.navigation_valid);
	for (const control of readUnindexedHistoryControls(projection)) {
		if (!isVisibleHistoryNonMessageEvent(control.event) || control.active_position < (visibleMessages.boundaryActivePosition ?? 0)) continue;
		rows.push({
			active_position: control.active_position,
			following_message_position: control.following_message_position,
			event_id: typeof control.event.id === "string" ? control.event.id.trim() : "",
			seq: control.event_seq,
			serialized_bytes: control.serialized_bytes,
			navigation_valid: 1
		});
	}
	if (projection.hasUnindexedPrefix) rows.sort((left, right) => left.active_position - right.active_position);
	const readNextMessage = prepareSqliteQuerySync(projection.database.db, (parameter) => db.selectFrom("session_transcript_active_events").select(["active_position", "message_position"]).where("session_id", "=", projection.resolved.sessionId).where("active_position", ">", parameter((position) => position)).where("message_position", "is not", null).orderBy("active_position", "asc").limit(1));
	let nextMessage;
	let searched = false;
	const boundaries = rows.map((row, index) => {
		let nextMessagePosition = row.following_message_position;
		if (nextMessagePosition === null) {
			if (!searched || nextMessage && nextMessage.active_position < row.active_position) {
				nextMessage = readNextMessage(row.active_position).rows[0];
				searched = true;
			}
			nextMessagePosition = nextMessage?.message_position ?? projection.state.activeMessageCount;
		}
		const messagePosition = visibleMessages.kept.length + Math.max(0, nextMessagePosition - visibleMessages.postStart);
		return {
			displayPosition: messagePosition + index,
			eventId: row.event_id,
			eventSeq: row.seq,
			messagePosition,
			serializedBytes: row.serialized_bytes
		};
	});
	return {
		boundaries,
		displaySource,
		latestResetRawSeq,
		total: visibleMessages.total + boundaries.length
	};
}
function resolveVisibleHistoryRange(history, start, endExclusive) {
	const boundedStart = Math.min(Math.max(0, start), history.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), history.total);
	let boundariesBefore = 0;
	let end = history.boundaries.length;
	while (boundariesBefore < end) {
		const middle = Math.floor((boundariesBefore + end) / 2);
		if (history.boundaries[middle].displayPosition < boundedStart) boundariesBefore = middle + 1;
		else end = middle;
	}
	const boundaries = /* @__PURE__ */ new Map();
	for (let index = boundariesBefore; index < history.boundaries.length; index += 1) {
		const boundary = history.boundaries[index];
		if (!(boundary.displayPosition < boundedEnd)) break;
		boundaries.set(boundary.displayPosition, boundary);
	}
	const messageStart = boundedStart - boundariesBefore;
	return {
		boundedEnd,
		boundedStart,
		boundaries,
		messageEnd: messageStart + boundedEnd - boundedStart - boundaries.size,
		messageStart
	};
}
function resolveHistoryMessageSequence(visible, history, messagePosition) {
	const logicalPosition = messagePosition >= visible.postStart ? visible.kept.length + messagePosition - visible.postStart : visible.kept.indexOf(messagePosition);
	if (logicalPosition < 0) return;
	let precedingBoundaries = 0;
	let end = history.boundaries.length;
	while (precedingBoundaries < end) {
		const middle = Math.floor((precedingBoundaries + end) / 2);
		if (history.boundaries[middle].messagePosition <= logicalPosition) precedingBoundaries = middle + 1;
		else end = middle;
	}
	return logicalPosition + 1 + precedingBoundaries;
}
function captureHistoryReadWindow(history, events) {
	const anchor = events.at(-1);
	return {
		source: history.displaySource,
		latestResetRawSeq: history.latestResetRawSeq,
		...anchor ? { anchor: {
			rawSeq: anchor.eventSeq,
			seq: anchor.seq
		} } : {}
	};
}
function resolveHistoryReadWindowChange(projection, history, expected) {
	if (!expected) return;
	if (expected.source !== history.displaySource) return {};
	const anchor = expected.anchor;
	if (!anchor) return expected.latestResetRawSeq === history.latestResetRawSeq ? void 0 : {};
	const position = readActiveTranscriptCoordinate(projection, { eventSeq: anchor.rawSeq })?.message_position;
	const boundary = position === null ? history.boundaries.find((entry) => entry.eventSeq === anchor.rawSeq) : void 0;
	const seq = position === void 0 ? void 0 : position === null ? boundary && boundary.displayPosition + 1 : resolveHistoryMessageSequence(resolveVisibleMessagePositions(projection), history, position);
	return seq === anchor.seq && expected.latestResetRawSeq === history.latestResetRawSeq ? void 0 : { anchorSeq: seq };
}
/** Resolve an indexed coordinate without decoding its message or control payload. */
function readActiveTranscriptCoordinate(projection, selection) {
	const query = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events").select([
		"event_seq",
		"message_position",
		"active_position"
	]).where("session_id", "=", projection.resolved.sessionId);
	return executeSqliteQueryTakeFirstSync(projection.database.db, "eventSeq" in selection ? query.where("event_seq", "=", selection.eventSeq) : query.where("active_position", "=", selection.activePosition));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-query.ts
const recentHistoryWindows = /* @__PURE__ */ new Map();
const historyWindowOwners = /* @__PURE__ */ new WeakSet();
function retainHistoryWindowOwner(database) {
	if (historyWindowOwners.has(database)) return;
	registerNodeSqliteDisposeCallback(database, () => {
		for (const [key, cached] of recentHistoryWindows) if (cached.database === database) recentHistoryWindows.delete(key);
	});
	historyWindowOwners.add(database);
}
function readBoundaryEvents(projection, boundaries) {
	const eventSeqs = Array.from(boundaries, (boundary) => boundary.eventSeq);
	if (eventSeqs.length === 0) return /* @__PURE__ */ new Map();
	return new Map(readSnapshotEventRows(projection, eventSeqs).map((row) => [row.seq, parseStoredTranscriptEvent(readTranscriptPayload(row))]));
}
function readVisibleHistoryRange(projection, start, endExclusive, history) {
	const range = resolveVisibleHistoryRange(history, start, endExclusive);
	if (range.boundedEnd <= range.boundedStart) return [];
	const messages = readVisibleMessageRange(projection, range.messageStart, range.messageEnd);
	const boundaryEvents = readBoundaryEvents(projection, range.boundaries.values());
	return positionTranscriptDisplayEvents(projection, history.displaySource, Array.from(mergeVisibleHistoryEvents(range, messages, boundaryEvents)));
}
function* mergeVisibleHistoryEvents(range, messages, boundaryEvents) {
	const iterator = messages[Symbol.iterator]();
	try {
		for (let displayPosition = range.boundedStart; displayPosition < range.boundedEnd; displayPosition += 1) {
			const boundary = range.boundaries.get(displayPosition);
			if (boundary) {
				const event = boundaryEvents.get(boundary.eventSeq);
				if (event) yield {
					event,
					eventSeq: boundary.eventSeq,
					seq: displayPosition + 1
				};
				continue;
			}
			const message = iterator.next();
			if (!message.done) yield {
				...message.value,
				seq: displayPosition + 1
			};
		}
	} finally {
		iterator.return?.();
	}
}
function resolveRecentHistoryStart(projection, start, endExclusive, history, maxBytes, maxMessages, allowOversizedFirst = true) {
	const { boundedEnd, boundedStart, boundaries, messageEnd, messageStart } = resolveVisibleHistoryRange(history, start, endExclusive);
	const metadataStart = Math.max(messageStart, messageEnd - maxMessages);
	const metadata = iterateVisibleMessageMetadata(projection, metadataStart, messageEnd, "desc");
	let nextMetadata;
	let messageIndex = messageEnd - 1;
	let selectedStart = boundedEnd;
	let selectedCount = 0;
	let bytes = 0;
	try {
		for (let displayPosition = boundedEnd - 1; displayPosition >= boundedStart; displayPosition -= 1) {
			if (selectedCount >= maxMessages) break;
			const boundary = boundaries.get(displayPosition);
			let serializedBytes = boundary?.serializedBytes;
			if (!boundary) {
				nextMetadata ??= metadata.next();
				if (!nextMetadata.done && nextMetadata.value.logicalPosition === messageIndex) {
					serializedBytes = nextMetadata.value.serialized_bytes;
					nextMetadata = void 0;
				}
				messageIndex -= 1;
			}
			if (serializedBytes === void 0) continue;
			if (allowOversizedFirst && selectedCount === 0 && serializedBytes > 8388608) throw new Error(`Transcript history message exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte page limit`);
			if ((!allowOversizedFirst || selectedCount > 0) && bytes + serializedBytes > maxBytes) break;
			selectedStart = displayPosition;
			selectedCount += 1;
			bytes += serializedBytes;
		}
	} finally {
		metadata.return?.();
	}
	return {
		start: selectedStart,
		bytes
	};
}
function resolveHistoryEventSequence(projection, history, row) {
	if (row.message_position === null) {
		const boundary = history.boundaries.find((candidate) => candidate.eventSeq === row.event_seq);
		return boundary === void 0 ? void 0 : boundary.displayPosition + 1;
	}
	return resolveHistoryMessageSequence(resolveVisibleMessagePositions(projection), history, row.message_position);
}
function resolveHistoryEventById(projection, eventId, history, maxBytes) {
	const boundary = history.boundaries.find((candidate) => candidate.eventId === eventId);
	if (boundary) {
		if (maxBytes !== void 0 && boundary.serializedBytes > maxBytes) return;
		const event = readBoundaryEvents(projection, [boundary]).get(boundary.eventSeq);
		return event ? {
			event,
			eventSeq: boundary.eventSeq,
			seq: boundary.displayPosition + 1,
			...maxBytes !== void 0 ? { serializedBytes: boundary.serializedBytes } : {}
		} : void 0;
	}
	const row = readDisplayableActiveEventById(projection, eventId, maxBytes);
	if (!row) return;
	const seq = resolveHistoryEventSequence(projection, history, row);
	return seq === void 0 ? { historical: row } : {
		event: parseStoredTranscriptEvent(row.event_json),
		eventSeq: row.event_seq,
		seq,
		...maxBytes !== void 0 ? { serializedBytes: Buffer.byteLength(row.event_json, "utf8") } : {}
	};
}
/** Raw cursor progress carries the same reset-relative ordinals as pages and live messages. */
function readTranscriptDisplayDeltaFromProjection(projection, readLimits = {}) {
	const result = readTranscriptRawDeltaFromProjection(projection, readLimits);
	if (result.kind !== "page") return result;
	if (result.events.length === 0) return {
		...result,
		activeLeafEntryId: projection.state.leafEventId
	};
	const history = resolveVisibleHistoryProjection(projection);
	const visible = resolveVisibleMessagePositions(projection);
	const firstSeq = result.events[0].seq;
	const lastSeq = result.events.at(-1).seq;
	const db = getActiveTranscriptKysely(projection.database);
	const sequences = new Map(executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events").select(["event_seq", "message_position"]).where("session_id", "=", projection.resolved.sessionId).where("event_seq", ">=", firstSeq).where("event_seq", "<=", lastSeq).where("message_position", "is not", null)).rows.map((row) => [row.event_seq, row.message_position === null ? void 0 : resolveHistoryMessageSequence(visible, history, row.message_position)]));
	for (const boundary of history.boundaries) if (boundary.eventSeq >= firstSeq && boundary.eventSeq <= lastSeq) sequences.set(boundary.eventSeq, boundary.displayPosition + 1);
	const events = positionTranscriptDisplayEvents(projection, history.displaySource, result.events.map((row) => {
		const messageSeq = sequences.get(row.seq);
		return {
			...row,
			eventSeq: row.seq,
			...messageSeq === void 0 ? {} : { messageSeq }
		};
	}));
	return {
		...result,
		activeLeafEntryId: projection.state.leafEventId,
		events
	};
}
function readRecentHistoryInSnapshot(projection, history, options, remember) {
	const windowChange = resolveHistoryReadWindowChange(projection, history, options.expectedReadWindow);
	const captureReadWindow = options.captureReadWindow || windowChange;
	const generation = projection.generation;
	const deltaCursor = generation ? createTranscriptRawDeltaCursor({
		agentId: projection.resolved.agentId,
		generation,
		lastSeq: projection.state.indexedSeq,
		sessionId: projection.resolved.sessionId
	}) : void 0;
	const maxMessages = resolveIntegerOption(options.maxMessages, 0, {
		min: 0,
		max: MAX_VISIBLE_MESSAGE_MAX_MESSAGES
	});
	const maxLines = resolveIntegerOption(options.maxLines, 0, { min: 0 });
	const empty = maxMessages === 0 || maxLines === 0;
	const { start, bytes } = empty ? {
		start: history.total,
		bytes: 0
	} : resolveRecentHistoryStart(projection, Math.max(0, history.total - maxLines), history.total, history, Math.min(resolveIntegerOption(options.maxBytes, SOURCE_PAGE_MAX_BYTES, { min: 1024 }), SOURCE_PAGE_MAX_BYTES), maxMessages);
	const events = empty ? [] : readVisibleHistoryRange(projection, start, history.total, history);
	const page = {
		activeLeafEntryId: projection.state.leafEventId,
		...deltaCursor ? { deltaCursor } : {},
		events,
		displaySource: history.displaySource,
		totalMessages: history.total,
		...captureReadWindow ? { readWindow: captureHistoryReadWindow(history, events) } : {},
		...windowChange ? { windowReset: true } : {}
	};
	if (!empty) remember?.(page, bytes);
	return page;
}
function readRecentSessionTranscriptHistoryEventsFromProjection(projection, options) {
	const read = (remember) => readRecentHistoryInSnapshot(projection, resolveVisibleHistoryProjection(projection), options, remember);
	if (!projection.generation || hasUncommittedSqliteWrites(projection.database.db) || projection.database.db.location() === null || options.expectedReadWindow || resolveSessionTranscriptReadFence(projection.resolved)) return read();
	const key = JSON.stringify([
		projection.database.path,
		projection.resolved.agentId,
		projection.resolved.sessionId
	]);
	const revision = JSON.stringify([
		projection.generation,
		projection.state.indexedSeq,
		options.maxMessages,
		options.maxLines,
		options.maxBytes,
		Boolean(options.captureReadWindow)
	]);
	const cached = recentHistoryWindows.get(key);
	if (cached?.database === projection.database.db && cached.revision === revision) return structuredClone(cached.page);
	recentHistoryWindows.delete(key);
	return read((page, bytes) => {
		if (bytes > 1048576) return;
		try {
			const database = projection.database.db;
			retainHistoryWindowOwner(database);
			recentHistoryWindows.set(key, {
				database,
				revision,
				page: structuredClone(page)
			});
			pruneMapToMaxSize(recentHistoryWindows, 16);
		} catch {}
	});
}
function readSessionTranscriptHistoryEventPageFromProjection(projection, inputOptions) {
	let options = inputOptions;
	const history = resolveVisibleHistoryProjection(projection);
	const windowChange = resolveHistoryReadWindowChange(projection, history, options.expectedReadWindow);
	if (windowChange) {
		const anchor = options.expectedReadWindow?.anchor;
		options = {
			...options,
			captureReadWindow: true,
			expectedReadWindow: void 0,
			...windowChange.anchorSeq !== void 0 && anchor ? { beforeSeq: options.beforeSeq === void 0 ? void 0 : options.beforeSeq + windowChange.anchorSeq - anchor.seq } : {
				beforeSeq: void 0,
				offset: 0
			}
		};
	}
	const endExclusive = resolveTranscriptPageEnd(history.total, options);
	if (options.recentAtHead && endExclusive === history.total) return {
		...readRecentHistoryInSnapshot(projection, history, {
			...options.recentAtHead,
			captureReadWindow: options.captureReadWindow,
			expectedReadWindow: options.expectedReadWindow
		}),
		...windowChange ? { windowReset: true } : {}
	};
	const maxMessages = resolveIntegerOption(options.maxMessages, 0, { min: 0 });
	const requestedStart = Math.max(0, endExclusive - maxMessages);
	const boundedStart = resolveRecentHistoryStart(projection, requestedStart, endExclusive, history, resolveIntegerOption(options.maxBytes, SOURCE_PAGE_MAX_BYTES, { min: 1024 }), maxMessages, options.allowOversizedFirst ?? options.maxBytes === void 0).start;
	if (options.maxBytes === void 0 && boundedStart !== requestedStart) throw new Error(`Transcript history page exceeds the ${SOURCE_PAGE_MAX_BYTES}-byte limit; request a smaller limit`);
	const omittedOversized = maxMessages > 0 && endExclusive > 0 && boundedStart === endExclusive;
	const consumedStart = omittedOversized ? endExclusive - 1 : boundedStart;
	const events = readVisibleHistoryRange(projection, boundedStart, endExclusive, history);
	return {
		activeLeafEntryId: projection.state.leafEventId,
		events,
		displaySource: history.displaySource,
		totalMessages: history.total,
		...options.maxBytes !== void 0 && maxMessages > 0 && consumedStart > 0 ? { olderOffset: resolveTranscriptPageEnd(history.total, { beforeSeq: options.beforeSeq }) - consumedStart } : {},
		...omittedOversized ? { omittedOversized: true } : {},
		...options.captureReadWindow ? { readWindow: captureHistoryReadWindow(history, events) } : {},
		...windowChange ? { windowReset: true } : {}
	};
}
function readSessionTranscriptHistoryEventByIdFromProjection(projection, eventId, options = {}, needsPreceding) {
	const history = resolveVisibleHistoryProjection(projection);
	const resolved = resolveHistoryEventById(projection, eventId, history, options.maxBytes);
	const event = resolved && ("historical" in resolved ? options.currentOnly ? void 0 : resolveHistoricalHistoryEvent(projection, resolved.historical) : resolved);
	if (!event) return;
	const preceding = needsPreceding?.(event) ? resolved && "historical" in resolved ? readHistoricalHistoryPrecedingEvent(projection, resolved.historical, event) : readVisibleHistoryRange(projection, Math.max(0, event.seq - 2), event.seq - 1, history)[0] : void 0;
	return positionTranscriptDisplayEvents(projection, history.displaySource, [{
		...event,
		...preceding ? { preceding } : {}
	}])[0];
}
/** Select ID candidates and projected-history presence from one admitted snapshot. */
function readSessionTranscriptHistoryEventLookupFromProjection(projection, eventId) {
	const history = resolveVisibleHistoryProjection(projection);
	const range = resolveVisibleHistoryRange(history, 0, history.total);
	if (!eventId.trim() || hasUnindexedVisibleMessages(projection, range.messageStart, range.messageEnd)) {
		const events = readVisibleHistoryRange(projection, 0, history.total, history);
		return {
			events,
			hasDisplayMessages: events.some((row) => isVisibleTranscriptRecord(row.event))
		};
	}
	const boundaryEvents = readBoundaryEvents(projection, range.boundaries.values());
	let first;
	let hasDisplayMessages = false;
	for (const event of mergeVisibleHistoryEvents(range, iterateVisibleMessageRange(projection, range.messageStart, range.messageEnd), boundaryEvents)) {
		first ??= event;
		if (isVisibleTranscriptRecord(event.event)) {
			hasDisplayMessages = true;
			break;
		}
	}
	const resolved = resolveHistoryEventById(projection, eventId.trim(), history);
	const event = resolved && !("historical" in resolved) ? resolved : void 0;
	const positioned = positionTranscriptDisplayEvents(projection, history.displaySource, event ? [event] : first ? [first] : []);
	return {
		events: event ? positioned : [],
		hasDisplayMessages
	};
}
function readSessionTranscriptHistoryAnchorPageFromProjection(projection, options) {
	const history = resolveVisibleHistoryProjection(projection);
	const anchor = readDisplayableActiveEventMetadataById(projection, options.messageId);
	if (options.closedResetInterval === true && options.direction === "older" && anchor?.event_type === "reset") {
		const closedPage = readHistoricalHistoryAnchorPage(projection, history.displaySource, anchor, options, true);
		if (closedPage) return {
			...closedPage,
			...options.captureReadWindow ? { readWindow: captureHistoryReadWindow(history, []) } : {}
		};
	}
	const windowChange = resolveHistoryReadWindowChange(projection, history, options.expectedReadWindow);
	const anchorSeq = anchor && resolveHistoryEventSequence(projection, history, anchor);
	if (windowChange && anchorSeq === void 0) return {
		...readSessionTranscriptHistoryEventPageFromProjection(projection, {
			offset: 0,
			maxMessages: options.maxMessages,
			maxBytes: Math.min(options.maxBytes ?? 8388608, SOURCE_PAGE_MAX_BYTES),
			captureReadWindow: true
		}),
		windowReset: true,
		found: true,
		hasOverreadContext: false,
		offset: 0
	};
	if (!anchor || anchorSeq === void 0) {
		const historical = anchor && readHistoricalHistoryAnchorPage(projection, history.displaySource, anchor, options);
		if (historical) return {
			...historical,
			...windowChange ? { windowReset: true } : {},
			...options.captureReadWindow ? { readWindow: captureHistoryReadWindow(history, []) } : {}
		};
		return {
			events: [],
			found: false,
			hasOverreadContext: false,
			offset: 0,
			displaySource: history.displaySource,
			totalMessages: history.total
		};
	}
	const range = resolveHistoryAnchorPageRange(history.total, anchorSeq - 1, options);
	const limit = Math.min(options.maxBytes ?? 8388608, SOURCE_PAGE_MAX_BYTES);
	const visible = resolveVisibleHistoryRange(history, range.readStart, range.endExclusive);
	const sizes = /* @__PURE__ */ new Map();
	let displayPosition = visible.boundedStart;
	for (const row of iterateVisibleMessageMetadata(projection, visible.messageStart, visible.messageEnd, "asc")) {
		while (visible.boundaries.has(displayPosition)) displayPosition++;
		sizes.set(displayPosition++, row.serialized_bytes);
	}
	const { start, endExclusive } = boundHistoryAnchorPageRange(range, anchorSeq - 1, Math.max(1024, limit), (position) => visible.boundaries.get(position)?.serializedBytes ?? sizes.get(position) ?? 0, options.maxBytes === void 0);
	const events = readVisibleHistoryRange(projection, start, endExclusive, history);
	return {
		events,
		...windowChange ? { windowReset: true } : {},
		...windowChange || options.captureReadWindow ? { readWindow: captureHistoryReadWindow(history, events) } : {},
		found: true,
		hasOverreadContext: range.hasOverreadContext && start === range.readStart,
		offset: history.total - endExclusive,
		displaySource: history.displaySource,
		totalMessages: history.total
	};
}
//#endregion
export { readSessionTranscriptHistoryEventPageFromProjection as a, resolveHistoryMessageSequence as c, resolveVisibleHistoryRange as d, parseStoredTranscriptEvent as f, readSessionTranscriptHistoryEventLookupFromProjection as i, resolveVisibleHistoryEventCount as l, readTranscriptDisplaySource as m, readSessionTranscriptHistoryAnchorPageFromProjection as n, readTranscriptDisplayDeltaFromProjection as o, positionTranscriptDisplayEvents as p, readSessionTranscriptHistoryEventByIdFromProjection as r, readActiveTranscriptCoordinate as s, readRecentSessionTranscriptHistoryEventsFromProjection as t, resolveVisibleHistoryProjection as u };
