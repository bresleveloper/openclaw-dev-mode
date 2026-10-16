import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as prepareSqliteQuerySync, d as sql, i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { r as hasSqlitePostCommitScope } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE } from "./internal-runtime-context-CAWYwg4i.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-Ugk-kDyr.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-CFIuxE4G.mjs";
import { n as isVisibleTranscriptRecord } from "./transcript-visible-record-C_2yzTED.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES } from "./session-accessor.sqlite-visible-cursor-CJh4GhW9.mjs";
import { t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-Daj5_oBL.mjs";
import { a as iterateVisibleMessageRange, d as resolveVisibleMessagePositions, f as findUnindexedActiveTranscriptEntry, i as iterateVisibleMessageMetadata, l as resolveClosedResetInterval, m as iterateUnindexedTranscriptNavigation, o as readUnindexedHistoryControls, r as hasUnindexedVisibleMessages, s as readVisibleMessageRange, t as assertVisibleMessageRangeJson, u as resolveTranscriptBoundaryWindow } from "./session-accessor.sqlite-reset-window-BfaTzfLM.mjs";
import { i as readTranscriptRawDeltaFromProjection, t as createTranscriptRawDeltaCursor } from "./session-accessor.sqlite-raw-delta-read-DBQnPz7-.mjs";
import { n as createTranscriptDisplaySource, t as createTranscriptDisplayPositionFromActivity } from "./transcript-display-position-BHW0T3ai.mjs";
import { n as resolveTranscriptPageEnd, t as resolveHistoryAnchorPageRange } from "./transcript-anchor-page-VHli4oQ1.mjs";
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
function positionTranscriptDisplayEvents(projection, source, events) {
	if (!source || events.length === 0) return events;
	const activities = events.map(({ event }) => readNestedToolActivity(asOptionalRecord(event)?.message)?.details);
	const anchors = [...new Set(activities.flatMap((activity) => activity?.afterEntryId ?? []))];
	const sequences = /* @__PURE__ */ new Map();
	const beforeRawSeq = resolveSqliteSessionTranscriptReadFence({
		database: projection.database,
		...projection.resolved
	})?.beforeRawSeq;
	const maxSeq = Math.min(projection.state.indexedSeq, beforeRawSeq === void 0 ? Infinity : beforeRawSeq - 1);
	if (anchors.length > 0) {
		const rows = executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("transcript_event_identities").select(["event_id", "seq"]).where("session_id", "=", projection.resolved.sessionId).where("event_id", "in", sqliteStringSet(anchors)).where("seq", "<=", maxSeq)).rows;
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
function isVisibleHistoryNonMessageEvent(event) {
	return event.type === "reset" || event.type === "compaction" || event.type === "custom_message" && event.display === true && event.customType !== OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE;
}
/** Select display slots without loading custom content or details into history metadata. */
function isVisibleHistoryNonMessageEventSql(type, event, activeEventSeq, eventSeq) {
	const activeEvent = sql`CASE WHEN ${activeEventSeq} = ${eventSeq} THEN ${event} END`;
	return sql`(${type} IN ('compaction', 'reset', 'custom_message') AND CASE
    WHEN ${type} IN ('compaction', 'reset') THEN 1
    WHEN ${type} = 'custom_message' THEN
      json_type(${activeEvent}, '$.display') = 'true'
      AND json_extract(${activeEvent}, '$.customType') IS NOT ${OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE}
    ELSE 0 END)`;
}
function parseStoredTranscriptEvent(eventJson) {
	return JSON.parse(eventJson);
}
function selectHistoricalDisplayEvents(projection, interval) {
	const active = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active");
	const identity = getActiveTranscriptKysely(projection.database).selectFrom("transcript_event_identities").select([
		"session_id",
		"seq",
		"event_type"
	]).modifyEnd(sql`INDEXED BY idx_agent_transcript_event_identity_sequence`).as("identity");
	const withIdentity = projection.hasUnindexedPrefix ? active.leftJoin(identity, (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")) : active.innerJoin(identity, (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq"));
	const unindexedControls = readUnindexedHistoryControls(projection).filter((row) => isVisibleHistoryNonMessageEvent(row.event) && row.active_position > interval.startExclusiveActivePosition && row.active_position <= interval.endInclusiveActivePosition).map((row) => row.event_seq);
	return withIdentity.innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", ">", interval.startExclusiveActivePosition).where("active.active_position", "<=", interval.endInclusiveActivePosition).where((eb) => eb.or([
		eb("active.message_position", "is not", null),
		isVisibleHistoryNonMessageEventSql(eb.ref("identity.event_type"), transcriptEventNavigationSql("event"), eb.ref("active.event_seq"), eb.ref("event.seq")),
		...unindexedControls.length > 0 ? [eb("active.event_seq", "in", sql`(SELECT value FROM json_each(${JSON.stringify(unindexedControls)}))`)] : []
	]));
}
function selectDisplayableActiveEventById(projection, eventId) {
	return getActiveTranscriptKysely(projection.database).selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
		"active.event_seq",
		"active.active_position",
		"active.message_position",
		"identity.event_type"
	]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", eventId).where((eb) => eb.or([eb("active.message_position", "is not", null), isVisibleHistoryNonMessageEventSql(eb.ref("identity.event_type"), transcriptEventNavigationSql("event"), eb.ref("active.event_seq"), eb.ref("event.seq"))]));
}
function readDisplayableActiveEventById(projection, eventId, maxBytes) {
	const db = getActiveTranscriptKysely(projection.database);
	const indexed = executeSqliteQueryTakeFirstSync(projection.database.db, selectDisplayableActiveEventById(projection, eventId).select((eb) => maxBytes === void 0 ? transcriptEventJsonSql(projection.database.db, "event").as("event_json") : eb.case().when(eb(transcriptEventReadBytesSql("event"), "<=", maxBytes)).then(transcriptEventJsonSql(projection.database.db, "event")).else(null).end().as("event_json")));
	if (indexed) return indexed.event_json === null ? void 0 : {
		...indexed,
		event_json: indexed.event_json
	};
	const unindexed = findUnindexedActiveTranscriptEntry(projection, eventId);
	if (!unindexed || unindexed.message_position === null && !isVisibleHistoryNonMessageEvent(unindexed.event) || maxBytes !== void 0 && unindexed.serialized_bytes - 1 > maxBytes) return;
	const event = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(projection.database.db).as("event_json")).where("session_id", "=", projection.resolved.sessionId).where("seq", "=", unindexed.event_seq));
	return event ? {
		event_seq: unindexed.event_seq,
		active_position: unindexed.active_position,
		message_position: unindexed.message_position,
		event_type: typeof unindexed.event.type === "string" ? unindexed.event.type : null,
		event_json: event.event_json
	} : void 0;
}
function readDisplayableActiveResetMetadataById(projection, eventId) {
	const indexed = executeSqliteQueryTakeFirstSync(projection.database.db, selectDisplayableActiveEventById(projection, eventId));
	if (indexed) return indexed.event_type === "reset" ? {
		active_position: indexed.active_position,
		event_type: "reset"
	} : void 0;
	const unindexed = findUnindexedActiveTranscriptEntry(projection, eventId);
	return unindexed?.event.type === "reset" ? {
		active_position: unindexed.active_position,
		event_type: "reset"
	} : void 0;
}
function countHistoricalDisplayEvents(projection, interval, beforeActivePosition) {
	const query = selectHistoricalDisplayEvents(projection, interval).select((eb) => eb.fn.countAll().as("event_count")).where("active.active_position", "<", beforeActivePosition);
	return executeSqliteQueryTakeFirstSync(projection.database.db, query)?.event_count ?? 0;
}
function readHistoricalDisplayEventRange(projection, displaySource, interval, start, count, anchor, maxBytes) {
	if (count <= 0) return [];
	const query = selectHistoricalDisplayEvents(projection, interval).select((eb) => ["active.event_seq", eb(transcriptEventReadBytesSql("event"), "+", 1).as("serialized_bytes")]);
	const olderCount = anchor.displayPosition - start;
	const older = olderCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, query.where("active.active_position", "<", anchor.activePosition).orderBy("active.active_position", "desc").limit(olderCount)).rows;
	const newer = executeSqliteQuerySync(projection.database.db, query.where("active.active_position", ">=", anchor.activePosition).orderBy("active.active_position", "asc").limit(count - olderCount)).rows;
	const ranged = [...older.toReversed(), ...newer].map((row, index) => Object.assign(row, { displaySeq: start + index + 1 }));
	const selected = (() => {
		if (maxBytes === void 0) return ranged;
		const limit = Math.max(1024, Math.floor(maxBytes));
		let bytes = 2;
		let selectedStart = ranged.length;
		while (selectedStart > 0) {
			const nextBytes = ranged[selectedStart - 1].serialized_bytes;
			if (bytes + nextBytes > limit) break;
			bytes += nextBytes;
			selectedStart--;
		}
		return ranged.slice(selectedStart);
	})();
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
function readHistoricalHistoryAnchorPage(projection, displaySource, row, options, excludeClosingReset = false) {
	const interval = resolveClosedResetIntervalForDisplayable(projection, row);
	if (!interval) return;
	const counts = executeSqliteQueryTakeFirstSync(projection.database.db, selectHistoricalDisplayEvents(projection, interval).select((eb) => [eb.fn.countAll().as("total"), eb.fn.countAll().filterWhere("active.active_position", "<", row.active_position).as("before_anchor")]));
	const anchorPosition = counts?.before_anchor ?? 0;
	const total = excludeClosingReset ? anchorPosition : counts?.total ?? 0;
	const range = resolveHistoryAnchorPageRange(total, excludeClosingReset ? total - 1 : anchorPosition, options);
	return {
		events: readHistoricalDisplayEventRange(projection, displaySource, interval, range.readStart, range.endExclusive - range.readStart, {
			activePosition: row.active_position,
			displayPosition: anchorPosition
		}, options.maxBytes),
		found: true,
		hasOverreadContext: range.hasOverreadContext,
		offset: range.offset,
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
		const type = eb.ref("identity.event_type");
		const event = transcriptEventNavigationSql("event");
		const activeEventSeq = eb.ref("active.event_seq");
		const eventSeq = eb.ref("event.seq");
		if (boundaryActivePosition === void 0) return isVisibleHistoryNonMessageEventSql(type, event, activeEventSeq, eventSeq);
		const inWindow = eb("active.active_position", ">=", boundaryActivePosition);
		return eb.and([inWindow, isVisibleHistoryNonMessageEventSql(type, eb.case().when(inWindow).then(event).else(null).end(), activeEventSeq, eventSeq)]);
	});
}
const historyCountReaders = createSqliteQueryCache(() => /* @__PURE__ */ new Map());
function getHistoryCountReader(database, shape) {
	const readers = historyCountReaders(database.db);
	let read = readers.get(shape);
	if (!read) {
		read = prepareSqliteQueryTakeFirstSync(database.db, (parameter) => selectVisibleHistoryBoundaries(database, parameter((params) => params.sessionId), shape, shape === "reset" ? parameter((params) => params.boundaryActivePosition) : void 0).select((eb) => eb.fn.countAll().as("event_count")));
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
		sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
	]).orderBy("active.active_position", "asc")).rows;
	for (const control of readUnindexedHistoryControls(projection)) {
		if (!isVisibleHistoryNonMessageEvent(control.event) || control.active_position < (visibleMessages.boundaryActivePosition ?? 0)) continue;
		rows.push({
			active_position: control.active_position,
			following_message_position: control.following_message_position,
			event_id: typeof control.event.id === "string" ? control.event.id.trim() : "",
			seq: control.event_seq,
			serialized_bytes: control.serialized_bytes
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
	const position = executeSqliteQueryTakeFirstSync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("event_seq", "=", anchor.rawSeq))?.message_position;
	const boundary = position === null ? history.boundaries.find((entry) => entry.eventSeq === anchor.rawSeq) : void 0;
	const seq = position === void 0 ? void 0 : position === null ? boundary && boundary.displayPosition + 1 : resolveHistoryMessageSequence(resolveVisibleMessagePositions(projection), history, position);
	return seq === anchor.seq && expected.latestResetRawSeq === history.latestResetRawSeq ? void 0 : { anchorSeq: seq };
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-query.ts
const recentHistoryWindows = /* @__PURE__ */ new Map();
/** Reads physical event rows in this snapshot: selected seqs, or every off-active-path row. */
function readSnapshotEventRows(projection, selection) {
	const sessionId = projection.resolved.sessionId;
	const query = getActiveTranscriptKysely(projection.database).selectFrom("transcript_events as event").select(["event.seq", transcriptEventJsonSql(projection.database.db, "event").as("event_json")]).where("event.session_id", "=", sessionId);
	return executeSqliteQuerySync(projection.database.db, selection === "off-active-path" ? query.where((eb) => eb.not(eb.exists(eb.selectFrom("session_transcript_active_events as active").select("active.event_seq").where("active.session_id", "=", sessionId).whereRef("active.event_seq", "=", "event.seq")))).orderBy("event.seq", "asc") : query.where("event.seq", "in", sql`(SELECT value FROM json_each(${JSON.stringify(selection.eventSeqs)}))`)).rows;
}
function readBoundaryEvents(projection, boundaries) {
	const eventSeqs = Array.from(boundaries, (boundary) => boundary.eventSeq);
	if (eventSeqs.length === 0) return /* @__PURE__ */ new Map();
	return new Map(readSnapshotEventRows(projection, { eventSeqs }).map((row) => [row.seq, parseStoredTranscriptEvent(row.event_json)]));
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
	const seq = row.message_position === null ? void 0 : resolveHistoryMessageSequence(resolveVisibleMessagePositions(projection), history, row.message_position);
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
function readSessionTranscriptHistoryEventsFromProjection(projection) {
	const history = resolveVisibleHistoryProjection(projection);
	return readVisibleHistoryRange(projection, 0, history.total, history);
}
/**
* Events outside the active path, such as branches left by rewind or switch. They stay
* switchable, so retention owners must see them; retired active ancestors stay excluded.
*/
function readOffPathSessionTranscriptEventsFromProjection(projection) {
	return readSnapshotEventRows(projection, "off-active-path").map((row) => ({
		event: parseStoredTranscriptEvent(row.event_json),
		eventSeq: row.seq,
		seq: row.seq + 1
	}));
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
	} : resolveRecentHistoryStart(projection, Math.max(0, history.total - maxLines), history.total, history, resolveIntegerOption(options.maxBytes, 8388608, { min: 1024 }), maxMessages);
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
	if (!projection.generation || hasSqlitePostCommitScope(projection.database.db) || projection.database.db.location() === null || options.expectedReadWindow || resolveSessionTranscriptReadFence(projection.resolved)) return read();
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
			recentHistoryWindows.set(key, {
				database: projection.database.db,
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
	const boundedStart = options.maxBytes === void 0 ? requestedStart : resolveRecentHistoryStart(projection, requestedStart, endExclusive, history, resolveIntegerOption(options.maxBytes, 1048576, { min: 1024 }), maxMessages, options.allowOversizedFirst ?? false).start;
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
function readSessionTranscriptHistoryEventByIdFromProjection(projection, eventId, options = {}) {
	const history = resolveVisibleHistoryProjection(projection);
	const resolved = resolveHistoryEventById(projection, eventId, history, options.maxBytes);
	const event = resolved && ("historical" in resolved ? options.currentOnly ? void 0 : resolveHistoricalHistoryEvent(projection, resolved.historical) : resolved);
	if (!event) return;
	return positionTranscriptDisplayEvents(projection, history.displaySource, [event])[0];
}
/** Select ID candidates and projected-history presence from one validated snapshot. */
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
	assertVisibleMessageRangeJson(projection, range.messageStart, range.messageEnd);
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
	if (options.closedResetInterval === true && options.direction === "older") {
		const closingReset = readDisplayableActiveResetMetadataById(projection, options.messageId);
		if (closingReset) {
			const closedPage = readHistoricalHistoryAnchorPage(projection, history.displaySource, closingReset, options, true);
			if (closedPage) return closedPage;
		}
	}
	const windowChange = resolveHistoryReadWindowChange(projection, history, options.expectedReadWindow);
	const anchor = resolveHistoryEventById(projection, options.messageId, history);
	if (windowChange && (!anchor || "historical" in anchor)) return {
		...readSessionTranscriptHistoryEventPageFromProjection(projection, {
			offset: 0,
			maxMessages: options.maxMessages,
			captureReadWindow: true
		}),
		windowReset: true,
		found: true,
		hasOverreadContext: false,
		offset: 0
	};
	if (!anchor || "historical" in anchor) return (anchor && readHistoricalHistoryAnchorPage(projection, history.displaySource, anchor.historical, options)) ?? {
		events: [],
		found: false,
		hasOverreadContext: false,
		offset: 0,
		displaySource: history.displaySource,
		totalMessages: history.total
	};
	const range = resolveHistoryAnchorPageRange(history.total, anchor.seq - 1, options);
	const events = readVisibleHistoryRange(projection, range.readStart, range.endExclusive, history);
	return {
		events,
		...windowChange ? {
			windowReset: true,
			readWindow: captureHistoryReadWindow(history, events)
		} : {},
		found: true,
		hasOverreadContext: range.hasOverreadContext,
		offset: range.offset,
		displaySource: history.displaySource,
		totalMessages: history.total
	};
}
//#endregion
export { readSessionTranscriptHistoryEventLookupFromProjection as a, readTranscriptDisplayDeltaFromProjection as c, resolveVisibleHistoryProjection as d, resolveVisibleHistoryRange as f, readSessionTranscriptHistoryEventByIdFromProjection as i, resolveHistoryMessageSequence as l, readRecentSessionTranscriptHistoryEventsFromProjection as n, readSessionTranscriptHistoryEventPageFromProjection as o, readSessionTranscriptHistoryAnchorPageFromProjection as r, readSessionTranscriptHistoryEventsFromProjection as s, readOffPathSessionTranscriptEventsFromProjection as t, resolveVisibleHistoryEventCount as u };
