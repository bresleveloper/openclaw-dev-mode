import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { s as hasUncommittedSqliteWrites } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-B20tITEh.mjs";
import { _ as assertTranscriptNavigationValid, d as transcriptEventNavigationSql, f as transcriptEventResetNavigationSql, u as transcriptEventModelNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { c as selectMessageRows, n as getMessageRangeReaders, o as selectMessageMetadata, r as parseActiveTranscriptMessageRow, s as selectMessagePayload, t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-history-navigation.ts
function parseNavigation(eventJson) {
	const parsed = JSON.parse(eventJson);
	if (!isRecord(parsed)) return;
	const { type, id, parentId, targetId, appendParentId, appendMode, firstKeptEntryId, customType, display } = parsed;
	return {
		type,
		id,
		parentId,
		targetId,
		appendParentId,
		appendMode,
		firstKeptEntryId,
		customType,
		display
	};
}
function navigationCandidatesSql(identitySeq, event, candidate) {
	const match = candidate.eventIds.length > 32 ? sql`1` : candidate.eventIds.length === 1 ? sql`instr(member.value, ${candidate.eventIds[0]}) > 0` : sql`EXISTS (SELECT 1 FROM json_each(${JSON.stringify(candidate.eventIds)}) AS requested
        WHERE instr(member.value, requested.value) > 0)`;
	return sql`CASE WHEN ${identitySeq} IS NOT NULL THEN 0
    WHEN json_valid(${event}) THEN EXISTS (
      SELECT 1 FROM json_each(${event}) AS member
      WHERE member.key = ${candidate.key} AND member.type = 'text' AND ${match}
    ) ELSE 1 END`;
}
function canFilterEventIds(eventIds) {
	return eventIds !== void 0 && eventIds.every((id) => toUSVString(id) === id && !id.includes("\0"));
}
function unindexedNavigationQuery(projection, eventIds) {
	return getActiveTranscriptKysely(projection.database).selectFrom("transcript_events as event").leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "event.session_id").onRef("identity.seq", "=", "event.seq")).select([
		"event.seq as event_seq",
		transcriptEventResetNavigationSql(projection.database.db, "event").as("event_json"),
		sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
	]).where("event.session_id", "=", projection.resolved.sessionId).where("identity.seq", "is", null).$if(canFilterEventIds(eventIds), (filtered) => filtered.where((eb) => navigationCandidatesSql(eb.ref("identity.seq"), transcriptEventNavigationSql(projection.database.db, "event"), {
		key: "id",
		eventIds
	})));
}
function* navigationRows(rows) {
	for (const { event_json, ...row } of rows) {
		const event = parseNavigation(event_json);
		if (event) yield {
			...row,
			event
		};
	}
}
/** Exact legacy handoffs retained raw rows without creating identity ownership. */
function* iterateUnindexedTranscriptNavigation(projection, options = {}) {
	if (!projection.hasUnindexedPrefix || options.eventIds?.length === 0) return;
	const query = unindexedNavigationQuery(projection, options.eventIds).$if(options.controlsOnly === true, (filtered) => filtered.where((eb) => eb.or([eb("event.navigation_valid", "=", 0), eb("event.navigation_last_type", "in", [
		"reset",
		"compaction",
		"custom_message"
	])]))).where("event.seq", "<=", options.maxRawSeq ?? projection.state.indexedSeq).$if(options.afterRawSeq !== void 0, (filtered) => filtered.where("event.seq", ">", options.afterRawSeq)).orderBy("event.seq", "asc");
	yield* navigationRows(iterateSqliteQuerySync(projection.database.db, query));
}
function* iterateUnindexedActiveTranscriptNavigation(projection, options = {}) {
	if (!projection.hasUnindexedPrefix || options.eventIds?.length === 0) return;
	const query = unindexedNavigationQuery(projection, options.eventIds).innerJoin("session_transcript_active_events as active", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.active_position", "active.message_position"]).where("active.event_seq", "<=", options.maxRawSeq ?? projection.state.indexedSeq).$if(options.beforeActivePosition !== void 0, (filtered) => filtered.where("active.active_position", "<", options.beforeActivePosition)).orderBy("active.active_position", options.first ? "asc" : "desc");
	yield* navigationRows(iterateSqliteQuerySync(projection.database.db, query));
}
/** Resolve display navigation without assigning identity or idempotency ownership. */
function findUnindexedActiveTranscriptEntry(projection, eventId) {
	for (const row of iterateUnindexedActiveTranscriptNavigation(projection, { eventIds: [eventId] })) if (typeof row.event.id === "string" && row.event.id.trim() === eventId) return row;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reset-window.ts
function isWindowBoundary(eventType, scope) {
	return eventType === "reset" || scope === "context" && eventType === "compaction";
}
const resetMessageWindowCache = /* @__PURE__ */ new Map();
const resetMessageWindowOwners = /* @__PURE__ */ new WeakSet();
const MAX_RESET_MESSAGE_WINDOW_CACHE = 64;
const MAX_CACHED_UNINDEXED_CONTROLS = 4096;
function cacheResetMessageWindow(key, entry) {
	const { database } = entry;
	if (!resetMessageWindowOwners.has(database)) {
		registerNodeSqliteDisposeCallback(database, () => {
			for (const [cachedKey, cached] of resetMessageWindowCache) if (cached.database === database) resetMessageWindowCache.delete(cachedKey);
		});
		resetMessageWindowOwners.add(database);
	}
	resetMessageWindowCache.delete(key);
	resetMessageWindowCache.set(key, entry);
	pruneMapToMaxSize(resetMessageWindowCache, MAX_RESET_MESSAGE_WINDOW_CACHE);
}
/** Imported controls keep raw identity; resolve their active positions in each read snapshot. */
function readUnindexedHistoryControls(projection, beforeRawSeq) {
	if (!projection.hasUnindexedPrefix) return [];
	const coveredThrough = Math.min(projection.state.indexedSeq, (beforeRawSeq ?? Infinity) - 1);
	const snapshot = projection.unindexedHistoryControls;
	if (snapshot && snapshot.coveredThrough >= coveredThrough) return snapshot.coveredThrough === coveredThrough ? snapshot.rows : snapshot.rows.filter((row) => row.event_seq <= coveredThrough);
	const key = `${projection.database.path}\0${projection.resolved.sessionId}\0unindexed-controls`;
	const cacheable = !hasUncommittedSqliteWrites(projection.database.db);
	const cached = cacheable ? resetMessageWindowCache.get(key) : void 0;
	const reusable = cached?.database === projection.database.db && "controls" in cached && cached.generation === projection.generation && cached.indexedSeq <= projection.state.indexedSeq ? cached : void 0;
	const controls = [...reusable?.controls ?? []];
	if (!reusable || reusable.indexedSeq < coveredThrough) {
		for (const row of iterateUnindexedTranscriptNavigation(projection, {
			afterRawSeq: reusable?.indexedSeq,
			maxRawSeq: coveredThrough,
			controlsOnly: true
		})) {
			const eventType = row.event.type;
			if (eventType === "reset" || eventType === "compaction" || eventType === "custom_message") controls.push(row);
		}
		if (cacheable) {
			if (controls.length <= MAX_CACHED_UNINDEXED_CONTROLS) cacheResetMessageWindow(key, {
				database: projection.database.db,
				generation: projection.generation,
				indexedSeq: coveredThrough,
				controls
			});
			else resetMessageWindowCache.delete(key);
		}
	}
	const eligible = new Map(controls.filter((row) => row.event_seq <= coveredThrough).map((row) => [row.event_seq, row]));
	const rows = eligible.size === 0 ? [] : executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom(sql`json_each(${JSON.stringify([...eligible.keys()])})`.as("requested")).crossJoin("session_transcript_active_events as active").leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).leftJoin("session_transcript_active_events as following", (join) => join.onRef("following.session_id", "=", "active.session_id").on((eb) => eb("following.active_position", "=", eb("active.active_position", "+", 1)))).select([
		"active.event_seq",
		"active.active_position",
		"active.message_position",
		"following.message_position as following_message_position"
	]).where("active.session_id", "=", projection.resolved.sessionId).whereRef("active.event_seq", "=", "requested.value").where("identity.seq", "is", null).orderBy("active.active_position", "asc")).rows.map((row) => Object.assign({}, eligible.get(row.event_seq), row));
	projection.unindexedHistoryControls = {
		coveredThrough,
		rows
	};
	return rows;
}
function readLatestActiveBoundaryMetadataByType(projection, eventType, beforeRawSeq) {
	const db = getActiveTranscriptKysely(projection.database);
	const preparedReset = projection.latestIndexedReset;
	const indexed = eventType === "reset" && preparedReset !== void 0 && (!preparedReset || beforeRawSeq === void 0 || preparedReset.seq < beforeRawSeq) ? preparedReset ?? void 0 : executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select([
		"active.active_position",
		"identity.event_type",
		"identity.seq"
	]).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "=", eventType).$if(beforeRawSeq !== void 0, (query) => query.where("identity.seq", "<", beforeRawSeq)).orderBy("identity.seq", "desc").limit(1));
	let unindexed;
	for (const row of readUnindexedHistoryControls(projection, beforeRawSeq)) if (row.event.type === eventType && (beforeRawSeq === void 0 || row.event_seq < beforeRawSeq) && (!unindexed || row.event_seq > unindexed.event_seq)) unindexed = row;
	return unindexed && (!indexed || unindexed.event_seq > indexed.seq) ? {
		active_position: unindexed.active_position,
		event_type: eventType,
		seq: unindexed.event_seq
	} : indexed;
}
function readLatestActiveBoundaryMetadata(projection, scope, beforeRawSeq) {
	const reset = readLatestActiveBoundaryMetadataByType(projection, "reset", beforeRawSeq);
	if (scope === "history") return reset;
	const compaction = readLatestActiveBoundaryMetadataByType(projection, "compaction", beforeRawSeq);
	return reset && (!compaction || reset.seq > compaction.seq) ? reset : compaction;
}
function readBoundaryWindowFacts(projection, seq, scope) {
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("transcript_events").select([transcriptEventResetNavigationSql(projection.database.db).as("event_json"), sql`${transcriptEventReadBytesSql()} + 1`.as("serialized_bytes")]).where("session_id", "=", projection.resolved.sessionId).where("seq", "=", seq).limit(1));
	if (!row) throw new Error("Active transcript boundary is missing");
	const parsed = JSON.parse(row.event_json);
	if (!isWindowBoundary(parsed.type, scope)) throw new Error("Active transcript boundary has invalid payload");
	return {
		firstKeptEntryId: parsed.firstKeptEntryId,
		sizeBytes: row.serialized_bytes
	};
}
function findLatestResetMessageWindow(projection, scope, beforeRawSeq) {
	const db = getActiveTranscriptKysely(projection.database);
	const latestBoundary = readLatestActiveBoundaryMetadata(projection, scope, beforeRawSeq);
	if (!latestBoundary) return null;
	const boundary = readBoundaryWindowFacts(projection, latestBoundary.seq, scope);
	const postBoundaryMessagePosition = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("active_position", ">", latestBoundary.active_position).where("message_position", "is not", null).orderBy("active_position", "asc").limit(1))?.message_position ?? projection.state.activeMessageCount;
	const keptMessagePositions = [];
	const includesBoundary = latestBoundary.event_type === "compaction";
	let contextPrefixEventCount = includesBoundary ? 1 : 0;
	let contextPrefixSizeBytes = includesBoundary ? boundary.sizeBytes : 0;
	if (typeof boundary.firstKeptEntryId === "string") {
		const indexedFirstKept = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.active_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", boundary.firstKeptEntryId).where("active.active_position", "<", latestBoundary.active_position));
		let unindexedFirstKept;
		for (const row of iterateUnindexedActiveTranscriptNavigation(projection, {
			beforeActivePosition: indexedFirstKept?.active_position ?? latestBoundary.active_position,
			eventIds: [boundary.firstKeptEntryId],
			first: true
		})) if (row.event.id === boundary.firstKeptEntryId) {
			unindexedFirstKept = row;
			break;
		}
		const firstKept = unindexedFirstKept ?? indexedFirstKept;
		if (firstKept && firstKept.active_position < latestBoundary.active_position) {
			const candidateRows = iterateSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
				"active.message_position",
				sql`CASE WHEN json_valid(${transcriptEventNavigationSql(projection.database.db, "event")})
              THEN ${transcriptEventModelNavigationSql(projection.database.db, "event")}
              ELSE ${transcriptEventNavigationSql(projection.database.db, "event")} END`.as("event_json"),
				sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
			]).where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", ">=", firstKept.active_position).where("active.active_position", "<", latestBoundary.active_position).where("active.message_position", "is not", null).$if(scope === "context" && latestBoundary.event_type !== "reset", (query) => query.where("active.context_eligible", "=", 1)).orderBy("active.active_position", "asc"));
			const candidates = [];
			for (const row of candidateRows) try {
				candidates.push({
					message_position: row.message_position,
					serialized_bytes: row.serialized_bytes,
					event: JSON.parse(row.event_json)
				});
			} catch {
				continue;
			}
			let keptRows = candidates;
			if (latestBoundary.event_type === "reset") {
				const keptEntries = new Set(selectResetKeptEntries(candidates.map((row) => row.event)));
				keptRows = candidates.filter((row) => keptEntries.has(row.event));
			}
			contextPrefixEventCount += keptRows.length;
			contextPrefixSizeBytes += keptRows.reduce((total, row) => total + row.serialized_bytes, 0);
			for (const row of keptRows) {
				if (row.message_position === null || row.event.type !== "message") continue;
				const role = row.event.message.role;
				if (scope === "context" || role === "user" || role === "assistant") keptMessagePositions.push(row.message_position);
			}
		}
	}
	return {
		boundarySeq: latestBoundary.seq,
		contextPrefixEventCount,
		keptMessagePositions,
		contextPrefixSizeBytes,
		postBoundaryMessagePosition,
		boundaryActivePosition: latestBoundary.active_position
	};
}
function resolveTranscriptBoundaryWindow(projection, scope = "history", beforeRawSeq) {
	if (beforeRawSeq !== void 0 || hasUncommittedSqliteWrites(projection.database.db)) return findLatestResetMessageWindow(projection, scope, beforeRawSeq);
	const key = `${projection.database.path}\0${projection.resolved.sessionId}\0${scope}`;
	const cached = resetMessageWindowCache.get(key);
	const generation = projection.generation;
	if (cached?.database === projection.database.db && "window" in cached) {
		if (cached.generation === generation && cached.indexedSeq === projection.state.indexedSeq) return cached.window;
		if (cached.generation === generation && cached.window) {
			if (readLatestActiveBoundaryMetadata(projection, scope)?.seq === cached.window.boundarySeq) {
				cacheResetMessageWindow(key, {
					...cached,
					indexedSeq: projection.state.indexedSeq
				});
				return cached.window;
			}
		}
	}
	const window = findLatestResetMessageWindow(projection, scope);
	cacheResetMessageWindow(key, {
		database: projection.database.db,
		generation,
		indexedSeq: projection.state.indexedSeq,
		window
	});
	return window;
}
function selectActiveResetRows(projection) {
	return getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select("active.active_position").where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "=", "reset");
}
/** Closed interval (previous reset, this reset] for an active-path event outside the latest window. */
function resolveClosedResetInterval(projection, target) {
	let closing = target.eventType === "reset" ? { active_position: target.activePosition } : executeSqliteQueryTakeFirstSync(projection.database.db, selectActiveResetRows(projection).where("active.active_position", ">", target.activePosition).orderBy("active.active_position", "asc").limit(1));
	const unindexedResets = readUnindexedHistoryControls(projection).filter((row) => row.event.type === "reset");
	if (target.eventType !== "reset") {
		const unindexedClosing = unindexedResets.find((row) => row.active_position > target.activePosition);
		if (unindexedClosing && (!closing || unindexedClosing.active_position < closing.active_position)) closing = unindexedClosing;
	}
	if (!closing) return;
	let opening = executeSqliteQueryTakeFirstSync(projection.database.db, selectActiveResetRows(projection).where("active.active_position", "<", closing.active_position).orderBy("active.active_position", "desc").limit(1));
	const unindexedOpening = unindexedResets.findLast((row) => row.active_position < closing.active_position);
	if (unindexedOpening && (!opening || unindexedOpening.active_position > opening.active_position)) opening = unindexedOpening;
	return {
		startExclusiveActivePosition: opening?.active_position ?? -1,
		endInclusiveActivePosition: closing.active_position
	};
}
function resolveVisibleMessagePositions(projection) {
	const window = resolveTranscriptBoundaryWindow(projection);
	if (!window) return {
		kept: [],
		postStart: 0,
		total: projection.state.activeMessageCount
	};
	return {
		boundaryActivePosition: window.boundaryActivePosition,
		kept: window.keptMessagePositions,
		postStart: window.postBoundaryMessagePosition,
		total: window.keptMessagePositions.length + Math.max(0, projection.state.activeMessageCount - window.postBoundaryMessagePosition)
	};
}
function selectVisibleMessageRanges(projection, start, endExclusive) {
	const ranges = [];
	if (endExclusive <= start) return ranges;
	const visible = resolveVisibleMessagePositions(projection);
	const boundedStart = Math.min(Math.max(0, start), visible.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), visible.total);
	const keptEnd = Math.min(boundedEnd, visible.kept.length);
	for (let offset = boundedStart; offset < keptEnd; offset += 500) {
		const positions = visible.kept.slice(offset, Math.min(offset + 500, keptEnd));
		const ordinals = new Map(positions.map((position, index) => [position, offset + index]));
		ranges.push({
			positions,
			logicalPosition: (position) => ordinals.get(position)
		});
	}
	const logicalStart = Math.max(boundedStart, visible.kept.length);
	if (boundedEnd > logicalStart) {
		const rawStart = visible.postStart + logicalStart - visible.kept.length;
		ranges.push({
			start: rawStart,
			endExclusive: rawStart + boundedEnd - logicalStart,
			logicalPosition: (position) => logicalStart + position - rawStart
		});
	}
	return ranges;
}
function readVisibleMessageRange(projection, start, endExclusive) {
	return Array.from(iterateVisibleMessageRange(projection, start, endExclusive));
}
function* iterateVisibleMessageRange(projection, start, endExclusive) {
	for (const range of selectVisibleMessageRanges(projection, start, endExclusive)) {
		const rows = "positions" in range ? iterateSqliteQuerySync(projection.database.db, selectMessagePayload(selectMessageRows(projection.database, projection.resolved.sessionId, range))) : getMessageRangeReaders(projection.database).messages({
			sessionId: projection.resolved.sessionId,
			start: range.start,
			endExclusive: range.endExclusive
		});
		for (const row of rows) yield parseActiveTranscriptMessageRow(row);
	}
}
function hasUnindexedVisibleMessages(projection, start, endExclusive) {
	return selectVisibleMessageRanges(projection, start, endExclusive).some((range) => executeSqliteQueryTakeFirstSync(projection.database.db, selectMessageRows(projection.database, projection.resolved.sessionId, range).leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select("active.event_seq").where("identity.seq", "is", null).limit(1)) !== void 0);
}
/** Classify oversized messages from navigation metadata without decoding their payloads. */
function hasOversizedVisibleMessages(projection, start, endExclusive, maxBytes, roles) {
	return selectVisibleMessageRanges(projection, start, endExclusive).some((range) => {
		const row = executeSqliteQueryTakeFirstSync(projection.database.db, selectMessageRows(projection.database, projection.resolved.sessionId, range).select(["active.event_seq", "event.navigation_valid"]).where((eb) => eb(transcriptEventReadBytesSql("event"), ">=", maxBytes)).where((eb) => eb.or([eb("event.message_role", "in", roles), eb("event.navigation_valid", "=", 0)])).limit(1));
		assertTranscriptNavigationValid(row?.navigation_valid);
		return row !== void 0;
	});
}
/** Byte-bounded tails can stop sizing at their first excluded predecessor. */
function* iterateVisibleMessageMetadata(projection, start, endExclusive, direction = "asc") {
	const ranges = selectVisibleMessageRanges(projection, start, endExclusive);
	for (const range of direction === "desc" ? ranges.toReversed() : ranges) {
		const rows = "positions" in range ? iterateSqliteQuerySync(projection.database.db, selectMessageMetadata(selectMessageRows(projection.database, projection.resolved.sessionId, range).clearOrderBy().orderBy("active.message_position", direction))) : getMessageRangeReaders(projection.database)[direction === "desc" ? "metadataDescending" : "metadata"]({
			sessionId: projection.resolved.sessionId,
			start: range.start,
			endExclusive: range.endExclusive
		});
		for (const row of rows) yield {
			event_seq: row.event_seq,
			message_position: row.message_position,
			serialized_bytes: row.serialized_bytes,
			logicalPosition: range.logicalPosition(row.message_position)
		};
	}
}
/** Reads logical transcript bytes, reusing cached retained-tail facts after resets. */
function readVisibleTranscriptStats(projection, freshBoundary = false) {
	if (projection.contextStats) return projection.contextStats;
	if (projection.contextMetadata) {
		const { eventCount, sizeBytes } = projection.contextMetadata;
		return {
			eventCount,
			sizeBytes,
			boundaryActivePosition: -1
		};
	}
	const window = freshBoundary ? findLatestResetMessageWindow(projection, "context") : resolveTranscriptBoundaryWindow(projection, "context");
	const base = getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select((eb) => [eb.fn.count("active.event_seq").as("event_count"), sql`COALESCE(SUM(${transcriptEventReadBytesSql("event")} ), 0)
        + COUNT(*)`.as("size_bytes")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.context_eligible", "=", 1);
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, window ? base.where("active.active_position", ">", window.boundaryActivePosition) : base);
	return {
		eventCount: (row?.event_count ?? 0) + (window?.contextPrefixEventCount ?? 0),
		sizeBytes: (row?.size_bytes ?? 0) + (window?.contextPrefixSizeBytes ?? 0),
		boundaryActivePosition: window?.boundaryActivePosition ?? -1
	};
}
//#endregion
export { readUnindexedHistoryControls as a, resolveClosedResetInterval as c, findUnindexedActiveTranscriptEntry as d, iterateUnindexedActiveTranscriptNavigation as f, iterateVisibleMessageRange as i, resolveTranscriptBoundaryWindow as l, hasUnindexedVisibleMessages as n, readVisibleMessageRange as o, iterateUnindexedTranscriptNavigation as p, iterateVisibleMessageMetadata as r, readVisibleTranscriptStats as s, hasOversizedVisibleMessages as t, resolveVisibleMessagePositions as u };
