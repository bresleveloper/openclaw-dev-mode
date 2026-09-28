import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as iterateSqliteQuerySync, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { d as transcriptEventResetNavigationSql, s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { o as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { i as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-CEJGTMGy.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { _ as resolveTranscriptBoundaryWindow, b as iterateUnindexedActiveTranscriptNavigation, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, n as DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, p as readUnindexedHistoryControls, r as MAX_VISIBLE_MESSAGE_MAX_BYTES, s as normalizeVisibleMessageLimit, t as DEFAULT_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-BfibSXF5.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-context.ts
function readBoundedRetentionRanges(projection, rows, headerOffset) {
	const sequences = /* @__PURE__ */ new Map();
	const cuts = rows.flatMap(({ event, seq }, endIndex) => {
		const entry = asOptionalRecord(event);
		if (typeof entry?.id !== "string") return [];
		if (!projection.hasUnindexedPrefix || !sequences.has(entry.id)) sequences.set(entry.id, seq);
		return (entry.type === "compaction" || entry.type === "reset") && typeof entry.firstKeptEntryId === "string" ? [{
			id: entry.id,
			firstKeptEntryId: entry.firstKeptEntryId,
			endIndex,
			seq
		}] : [];
	});
	const missing = [...new Set(cuts.map((cut) => cut.firstKeptEntryId))].filter((id) => !sequences.has(id));
	if (missing.length > 0) {
		const lastSelectedSeq = Math.max(...rows.map((row) => row.seq));
		const db = getActiveTranscriptKysely(projection.database);
		const anchors = executeSqliteQuerySync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select(["identity.event_id", "identity.seq"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "in", missing).where("identity.seq", "<=", lastSelectedSeq)).rows;
		for (const anchor of anchors) sequences.set(anchor.event_id, anchor.seq);
	}
	if (projection.hasUnindexedPrefix && cuts.length > 0) {
		const unresolved = new Set(cuts.map((cut) => cut.firstKeptEntryId));
		for (const row of iterateUnindexedActiveTranscriptNavigation(projection, {
			eventIds: [...unresolved],
			maxRawSeq: Math.max(...cuts.map((cut) => cut.seq)) - 1,
			first: true
		})) {
			const id = typeof row.event.id === "string" ? row.event.id : void 0;
			if (id === void 0 || !unresolved.delete(id)) continue;
			const selectedSeq = sequences.get(id);
			if (selectedSeq === void 0 || row.event_seq < selectedSeq) sequences.set(id, row.event_seq);
			if (unresolved.size === 0) break;
		}
	}
	const ranges = /* @__PURE__ */ new Map();
	for (const cut of cuts) {
		const firstSeq = sequences.get(cut.firstKeptEntryId);
		if (firstSeq === void 0 || projection.hasUnindexedPrefix && firstSeq >= cut.seq) continue;
		let start = cut.endIndex > 0 && rows[0].seq >= firstSeq ? 0 : Math.min(1, cut.endIndex);
		let end = start === 0 ? 0 : cut.endIndex;
		while (start < end) {
			const middle = Math.floor((start + end) / 2);
			if (rows[middle].seq < firstSeq) start = middle + 1;
			else end = middle;
		}
		ranges.set(cut.id, {
			startIndex: start + headerOffset,
			endIndex: cut.endIndex + headerOffset
		});
	}
	return ranges;
}
function readUnindexedLogicalParents(projection, contextSequences, payloads) {
	const parents = /* @__PURE__ */ new Map();
	if (contextSequences.length === 0) return parents;
	const rows = executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").leftJoin("session_transcript_active_events as previous", (join) => join.onRef("previous.session_id", "=", "active.session_id").on((eb) => eb("previous.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_events as parent", (join) => join.onRef("parent.session_id", "=", "previous.session_id").onRef("parent.seq", "=", "previous.event_seq")).select((eb) => [
		"active.event_seq",
		"previous.event_seq as parent_seq",
		eb.fn.coalesce(transcriptEventResetNavigationSql("parent"), eb.val("null")).as("parent_json")
	]).where("active.session_id", "=", projection.resolved.sessionId).where("active.event_seq", "in", contextSequences)).rows;
	for (const row of rows) {
		const entry = asOptionalRecord(payloads.get(row.event_seq));
		if (typeof entry?.id !== "string") continue;
		const parent = row.parent_seq === null ? void 0 : asOptionalRecord(JSON.parse(row.parent_json));
		parents.set(entry.id, typeof parent?.id === "string" ? parent.id : null);
	}
	return parents;
}
/** Reads one byte-bounded active branch without materializing abandoned transcript history. */
function readSessionTranscriptBoundedActiveContextCore(scope, options) {
	const maxBytes = normalizeVisibleMessageLimit(options.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	const maxEvents = normalizeVisibleMessageLimit(options.maxEvents, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxEvents");
	const read = (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const fence = options.ignoreReadFence ? void 0 : resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const transcript = db.selectFrom("transcript_events").where("session_id", "=", projection.resolved.sessionId);
		const header = executeSqliteQueryTakeFirstSync(projection.database.db, transcript.select("seq").where(sql`json_extract(${transcriptEventNavigationSql()}, '$.type')`, "=", "session").orderBy("seq", "asc").limit(1));
		const headerBytes = header ? executeSqliteQueryTakeFirstSync(projection.database.db, transcript.select(sql`${transcriptEventReadBytesSql()} + 1`.as("serialized_bytes")).where("seq", "=", header.seq)).serialized_bytes : 0;
		if (headerBytes > maxBytes) throw new RangeError("Session transcript header exceeds the active-context byte limit");
		const retained = resolveTranscriptBoundaryWindow(projection, "context", fence?.beforeRawSeq)?.keptMessagePositions.slice(-(maxEvents + 1)) ?? [];
		const metadata = iterateSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.event_seq", sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")]).where("active.session_id", "=", projection.resolved.sessionId).$if(fence !== void 0, (query) => query.where("active.event_seq", "<", fence.beforeRawSeq)).where((eb) => retained.length > 0 ? eb.or([eb("active.context_eligible", "=", 1), eb("active.message_position", "in", retained)]) : eb("active.context_eligible", "=", 1)).orderBy("active.active_position", "desc").limit(maxEvents + 1));
		const selectedSequences = [];
		let serializedBytes = headerBytes;
		let truncated = false;
		for (const row of metadata) {
			if (selectedSequences.length >= maxEvents || serializedBytes + row.serialized_bytes > maxBytes) {
				truncated = true;
				break;
			}
			selectedSequences.push(row.event_seq);
			serializedBytes += row.serialized_bytes;
		}
		let boundary = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom(db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select((eb) => [
			"active.active_position",
			"identity.seq",
			eb.fn.count("identity.seq").over().as("boundary_count")
		]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "in", ["compaction", "reset"]).$if(fence !== void 0, (query) => query.where("identity.seq", "<", fence.beforeRawSeq)).orderBy("active.active_position", "desc").limit(1).as("boundary")).innerJoin("transcript_events as event", (join) => join.on("event.session_id", "=", projection.resolved.sessionId).onRef("event.seq", "=", "boundary.seq")).select([
			"boundary.active_position",
			"boundary.seq",
			"boundary.boundary_count",
			sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
		]));
		let boundaryCount = boundary?.boundary_count ?? 0;
		if (projection.hasUnindexedPrefix) for (const row of readUnindexedHistoryControls(projection, fence?.beforeRawSeq)) {
			if (row.event.type !== "compaction" && row.event.type !== "reset" || fence !== void 0 && row.event_seq >= fence.beforeRawSeq) continue;
			boundaryCount += 1;
			if (!boundary || row.active_position > boundary.active_position) boundary = {
				active_position: row.active_position,
				seq: row.event_seq,
				serialized_bytes: row.serialized_bytes,
				boundary_count: boundaryCount
			};
		}
		const contextSequences = selectedSequences.toSorted((left, right) => left - right);
		let injectedBoundarySeq;
		if (boundary && !selectedSequences.includes(boundary.seq)) {
			if (serializedBytes + boundary.serialized_bytes <= maxBytes) {
				injectedBoundarySeq = boundary.seq;
				contextSequences.unshift(boundary.seq);
				serializedBytes += boundary.serialized_bytes;
			} else truncated = true;
		}
		const payloadSequences = header ? [header.seq, ...contextSequences] : contextSequences;
		const payloads = new Map((payloadSequences.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, transcript.select(["seq", transcriptEventJsonSql(projection.database.db).as("event_json")]).where("seq", "in", payloadSequences)).rows).map((row) => [row.seq, JSON.parse(row.event_json)]));
		const parents = projection.hasUnindexedPrefix ? readUnindexedLogicalParents(projection, contextSequences, payloads) : new Map((contextSequences.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as entry", (join) => join.onRef("entry.session_id", "=", "active.session_id").onRef("entry.seq", "=", "active.event_seq")).leftJoin("session_transcript_active_events as previous", (join) => join.onRef("previous.session_id", "=", "active.session_id").on((eb) => eb("previous.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_event_identities as parent", (join) => join.onRef("parent.session_id", "=", "previous.session_id").onRef("parent.seq", "=", "previous.event_seq")).select(["entry.event_id", "parent.event_id as parent_id"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.event_seq", "in", contextSequences)).rows).map((row) => [row.event_id, row.parent_id]));
		const events = header ? [payloads.get(header.seq)] : [];
		const rows = contextSequences.map((seq) => ({
			event: payloads.get(seq),
			seq
		}));
		const opaqueParents = /* @__PURE__ */ new Map();
		let previousId;
		for (const { event, seq } of rows) {
			const entry = asOptionalRecord(event);
			if (seq === injectedBoundarySeq) previousId = entry?.id;
			else if (entry && "id" in entry && "parentId" in entry) {
				if (typeof previousId === "string" && typeof entry.parentId === "string" && entry.parentId !== previousId) opaqueParents.set(entry.parentId, previousId);
				previousId = entry.id;
			}
			events.push(event);
		}
		const activeLeafEntryId = fence ? fence.admission.effectiveParentId : projection.state.leafEventId;
		if (activeLeafEntryId && previousId !== activeLeafEntryId) opaqueParents.set(activeLeafEntryId, typeof previousId === "string" ? previousId : null);
		const firstKeptRanges = readBoundedRetentionRanges(projection, rows, header ? 1 : 0);
		const version = readTranscriptContextVersionInTransaction(projection.database, projection.resolved.sessionId);
		return {
			version,
			activeLeafEntryId,
			opaqueParents,
			parents,
			firstKeptRanges,
			persistedSuffixStartSeq: contextSequences[0] ?? (header ? header.seq + 1 : 0),
			boundaryCount,
			events,
			serializedBytes,
			totalEvents: projection.state.activeEventCount,
			transcriptMutationAt: version.updatedAt,
			truncated
		};
	};
	return withCurrentProjectionSnapshot(scope, read, {
		readOnly: options.readOnly,
		resolvedScope: options.resolvedScope
	});
}
//#endregion
export { readSessionTranscriptBoundedActiveContextCore as t };
