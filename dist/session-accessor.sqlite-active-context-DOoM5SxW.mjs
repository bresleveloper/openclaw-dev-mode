import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { i as isIndexedSessionEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import { _ as assertTranscriptNavigationValid, c as transcriptEventJsonSql, f as transcriptEventResetNavigationSql, u as transcriptEventModelNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { c as normalizeVisibleMessageLimit, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, n as DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES, t as DEFAULT_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { n as collectCacheTtlProjectionPrefix, o as selectBoundedContextRows } from "./session-actor-bounded-history-BC9AvmFD.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { a as readUnindexedHistoryControls, f as iterateUnindexedActiveTranscriptNavigation, l as resolveTranscriptBoundaryWindow } from "./session-accessor.sqlite-reset-window-Cl0GzV50.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
import { t as engineIndexHint } from "./index-hint-Bu_q2kZQ.mjs";
//#region src/config/sessions/session-cache-ttl-prefix.ts
/** Projection dependencies are metadata, separate from the byte-bounded model history. */
function readCacheTtlProjectionPrefix(projection, anchor) {
	if (!anchor || anchor.activePosition === 0) return;
	const entryType = sql`coalesce(identity.event_type, event.navigation_last_type)`;
	const rows = iterateSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).leftJoin(getActiveTranscriptKysely(projection.database).selectFrom("transcript_event_identities").select([
		"session_id",
		"seq",
		"event_type"
	]).modifyEnd(engineIndexHint(projection.database.db, "idx_agent_transcript_event_identity_sequence")).as("identity"), (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select((eb) => eb.case().when(entryType, "=", "reset").then(transcriptEventModelNavigationSql(projection.database.db, "event", sql.lit("reset"))).else(transcriptEventJsonSql(projection.database.db, "event")).end().as("event_json")).select("event.navigation_valid").where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", "<", anchor.activePosition).$call((query) => anchor.beforeRawSeq === void 0 ? query : query.where("active.event_seq", "<", anchor.beforeRawSeq)).where((eb) => eb.case().when("identity.event_type", "not in", ["custom", "reset"]).then(false).else(eb.or([
		eb("event.navigation_valid", "=", 0),
		eb(entryType, "=", "reset"),
		eb.and([eb(entryType, "=", "custom"), eb("event.navigation_last_custom_type", "=", "openclaw.cache-ttl")])
	])).end()).orderBy("active.active_position", "desc"));
	return collectCacheTtlProjectionPrefix(anchor, (function* () {
		for (const row of rows) {
			assertTranscriptNavigationValid(row.navigation_valid);
			yield JSON.parse(row.event_json);
		}
	})());
}
/** Bind hidden anchors while preserving every already-navigable retained boundary. */
function bindCacheTtlProjectionPrefixes(bounded, view) {
	const prefixes = bounded.cacheTtlProjectionPrefixes;
	if (!prefixes?.length) return prefixes;
	const visible = new Set(view.getBranch().map((entry) => entry.id));
	const parents = new Map([...bounded.opaqueParents, ...bounded.parents]);
	return prefixes.flatMap((prefix) => {
		if (prefix.anchorIds.some((id) => view.getEntry(id) !== void 0)) return [prefix];
		const seen = /* @__PURE__ */ new Set();
		let id = bounded.activeLeafEntryId;
		let anchorId;
		while (id && !seen.has(id)) {
			if (visible.has(id)) anchorId = id;
			if (prefix.anchorIds.includes(id)) return [{
				...prefix,
				anchorIds: anchorId ? [anchorId] : []
			}];
			seen.add(id);
			id = parents.get(id) ?? null;
		}
		return [];
	});
}
//#endregion
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
		const lastSelectedSeq = rows.reduce((maximum, row) => Math.max(maximum, row.seq), -Infinity);
		const db = getActiveTranscriptKysely(projection.database);
		const anchors = executeSqliteQuerySync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select(["identity.event_id", "identity.seq"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "in", missing).where("identity.seq", "<=", lastSelectedSeq)).rows;
		for (const anchor of anchors) sequences.set(anchor.event_id, anchor.seq);
	}
	if (projection.hasUnindexedPrefix && cuts.length > 0) {
		const unresolved = new Set(cuts.map((cut) => cut.firstKeptEntryId));
		for (const row of iterateUnindexedActiveTranscriptNavigation(projection, {
			eventIds: [...unresolved],
			maxRawSeq: cuts.reduce((maximum, cut) => Math.max(maximum, cut.seq), -Infinity) - 1,
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
		eb.fn.coalesce(transcriptEventResetNavigationSql(projection.database.db, "parent"), eb.val("null")).as("parent_json")
	]).where("active.session_id", "=", projection.resolved.sessionId).where("active.event_seq", "in", contextSequences)).rows;
	for (const row of rows) {
		const entry = asOptionalRecord(payloads.get(row.event_seq));
		if (typeof entry?.id !== "string") continue;
		const parent = row.parent_seq === null ? void 0 : asOptionalRecord(JSON.parse(row.parent_json));
		parents.set(entry.id, typeof parent?.id === "string" ? parent.id : null);
	}
	return parents;
}
function readIndexedLogicalParents(projection, contextSequences) {
	const actor = readSessionActorTransactionState(projection.database, projection.resolved);
	if (actor?.transcript.complete) {
		const idsByPosition = /* @__PURE__ */ new Map();
		for (const identity of actor.transcript.identities.values()) {
			const active = actor.transcript.active.get(identity.seq);
			if (active) idsByPosition.set(active.active_position, identity.event_id);
		}
		const parents = /* @__PURE__ */ new Map();
		for (const seq of contextSequences) {
			const active = actor.transcript.active.get(seq);
			if (!active) continue;
			const id = idsByPosition.get(active.active_position);
			if (id !== void 0) parents.set(id, idsByPosition.get(active.active_position - 1) ?? null);
		}
		return parents;
	}
	return new Map((contextSequences.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, getActiveTranscriptKysely(projection.database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as entry", (join) => join.onRef("entry.session_id", "=", "active.session_id").onRef("entry.seq", "=", "active.event_seq")).leftJoin("session_transcript_active_events as previous", (join) => join.onRef("previous.session_id", "=", "active.session_id").on((eb) => eb("previous.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_event_identities as parent", (join) => join.onRef("parent.session_id", "=", "previous.session_id").onRef("parent.seq", "=", "previous.event_seq")).select(["entry.event_id", "parent.event_id as parent_id"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.event_seq", "in", contextSequences)).rows).map((row) => [row.event_id, row.parent_id]));
}
/** Reads one byte-bounded active branch without materializing abandoned transcript history. */
function readSessionTranscriptBoundedActiveContextCore(scope, options) {
	const maxBytes = normalizeVisibleMessageLimit(options.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	const maxEvents = normalizeVisibleMessageLimit(options.maxEvents, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxEvents");
	const read = (projection) => {
		const fence = options.ignoreReadFence ? void 0 : resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const consume = (rows, messagePresence) => {
			const consumed = options.onRead?.(projection, rows, messagePresence);
			if (isPromiseLike(consumed)) {
				Promise.resolve(consumed).catch(() => {});
				throw new Error("Transcript snapshot consumers must remain synchronous");
			}
		};
		if (projection.version.rawSeq === null) {
			const activeLeafEntryId = fence ? fence.admission.effectiveParentId : projection.state.leafEventId;
			consume([]);
			return {
				version: projection.version,
				activeLeafEntryId,
				opaqueParents: activeLeafEntryId ? /* @__PURE__ */ new Map([[activeLeafEntryId, null]]) : /* @__PURE__ */ new Map(),
				parents: /* @__PURE__ */ new Map(),
				firstKeptRanges: /* @__PURE__ */ new Map(),
				persistedSuffixStartSeq: 0,
				boundaryCount: 0,
				events: [],
				cacheTtlProjectionPrefixes: [],
				serializedBytes: 0,
				totalEvents: 0,
				transcriptMutationAt: projection.version.updatedAt,
				truncated: false,
				...!fence ? { completeActivePath: true } : {}
			};
		}
		const db = getActiveTranscriptKysely(projection.database);
		const transcript = db.selectFrom("transcript_events").where("session_id", "=", projection.resolved.sessionId);
		const covered = projection.contextMetadata;
		const header = covered ? covered.header : executeSqliteQueryTakeFirstSync(projection.database.db, transcript.select([
			"seq",
			"navigation_valid",
			sql`${transcriptEventReadBytesSql()} + 1`.as("serialized_bytes")
		]).where((eb) => eb.or([eb("navigation_type", "=", "session"), eb("navigation_valid", "=", 0)])).orderBy("seq", "asc").limit(1));
		assertTranscriptNavigationValid(header?.navigation_valid);
		const headerBytes = header?.serialized_bytes ?? 0;
		const retained = covered ? [] : resolveTranscriptBoundaryWindow(projection, "context", fence?.beforeRawSeq)?.keptMessagePositions.slice(-(maxEvents + 1)) ?? [];
		const metadata = covered ? covered.rows.filter((row) => !fence || row.event_seq < fence.beforeRawSeq).slice(0, maxEvents + 1) : iterateSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
			"active.event_seq",
			"active.active_position",
			sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
		]).where("active.session_id", "=", projection.resolved.sessionId).$if(fence !== void 0, (query) => query.where("active.event_seq", "<", fence.beforeRawSeq)).where((eb) => retained.length > 0 ? eb.or([eb("active.context_eligible", "=", 1), eb("active.message_position", "in", retained)]) : eb("active.context_eligible", "=", 1)).orderBy("active.active_position", "desc").limit(maxEvents + 1));
		const selection = selectBoundedContextRows(metadata, headerBytes, {
			maxBytes,
			maxEvents
		});
		const { selectedRows } = selection;
		let { serializedBytes, truncated } = selection;
		const selectedSequences = selectedRows.map((row) => row.event_seq);
		let boundary = covered ? void 0 : executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom(db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select((eb) => [
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
		if (!covered && projection.hasUnindexedPrefix) for (const row of readUnindexedHistoryControls(projection, fence?.beforeRawSeq)) {
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
		const parents = projection.hasUnindexedPrefix ? readUnindexedLogicalParents(projection, contextSequences, payloads) : readIndexedLogicalParents(projection, contextSequences);
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
		const firstSelected = selectedRows.findLast((row) => typeof asOptionalRecord(payloads.get(row.event_seq))?.id === "string");
		const anchorEntry = firstSelected ? asOptionalRecord(payloads.get(firstSelected.event_seq)) : void 0;
		const injectedEntry = injectedBoundarySeq === void 0 ? void 0 : asOptionalRecord(payloads.get(injectedBoundarySeq));
		const cacheTtlProjectionPrefixes = [...boundary && isIndexedSessionEntry(injectedEntry) && injectedEntry.type === "compaction" ? [{
			activePosition: boundary.active_position,
			id: injectedEntry.id,
			entry: injectedEntry
		}] : [], ...firstSelected && typeof anchorEntry?.id === "string" ? [{
			activePosition: firstSelected.active_position,
			id: anchorEntry.id,
			entry: anchorEntry
		}] : []].flatMap((anchor) => {
			const prefix = readCacheTtlProjectionPrefix(projection, {
				...anchor,
				beforeRawSeq: fence?.beforeRawSeq
			});
			return prefix ? [prefix] : [];
		});
		const activeLeafEntryId = fence ? fence.admission.effectiveParentId : projection.state.leafEventId;
		if (activeLeafEntryId && previousId !== activeLeafEntryId) opaqueParents.set(activeLeafEntryId, typeof previousId === "string" ? previousId : null);
		const firstKeptRanges = readBoundedRetentionRanges(projection, rows, header ? 1 : 0);
		const version = projection.version;
		const sizes = new Map(selectedRows.map((row) => [row.event_seq, row.serialized_bytes]));
		if (boundary) sizes.set(boundary.seq, boundary.serialized_bytes);
		consume([...header ? [{
			rawSeq: header.seq,
			serializedBytes: headerBytes
		}] : [], ...contextSequences.map((rawSeq) => ({
			rawSeq,
			serializedBytes: sizes.get(rawSeq)
		}))], events.some((event) => asOptionalRecord(event)?.type === "message") ? true : void 0);
		return {
			version,
			activeLeafEntryId,
			opaqueParents,
			parents,
			firstKeptRanges,
			persistedSuffixStartSeq: contextSequences[0] ?? (header ? header.seq + 1 : 0),
			boundaryCount,
			events,
			cacheTtlProjectionPrefixes,
			serializedBytes,
			totalEvents: projection.state.activeEventCount,
			transcriptMutationAt: version.updatedAt,
			truncated,
			...!truncated && !fence && !projection.hasUnindexedPrefix && selectedRows.length === projection.state.activeEventCount ? { completeActivePath: true } : {}
		};
	};
	return withCurrentProjectionSnapshot(scope, read, {
		readOnly: options.readOnly,
		resolvedScope: options.resolvedScope,
		transaction: options.transaction
	});
}
//#endregion
export { bindCacheTtlProjectionPrefixes as n, readSessionTranscriptBoundedActiveContextCore as t };
