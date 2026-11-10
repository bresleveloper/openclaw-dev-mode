import { v as parseDateFirstTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { o as runSqliteReadSnapshotSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { S as projectTranscriptNavigationSql, c as transcriptEventJsonSql, d as transcriptEventNavigationSql, f as transcriptEventResetNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, o as parseSessionTranscriptTreeEntry, p as selectSessionTranscriptTreePathNodes, s as resolveSessionTranscriptActiveLeafEntryId } from "./transcript-tree-D61jhi_i.mjs";
import { i as resolveTranscriptAppendParent, r as preparedAssistantMessagesPreserveTurn, t as PREPARED_ASSISTANT_MAX_ANCESTORS } from "./transcript-append-parent-D0iXiZfS.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as resolveSqliteSessionTranscriptReadFence, t as captureSessionTranscriptQuestionAnswers } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { r as readHotSessionTranscriptSnapshot, t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { d as sessionTranscriptIndexNeedsReconcile } from "./session-transcript-index-BTr4by8J.mjs";
import { n as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { c as readTranscriptContextVersionInTransaction, u as readTranscriptMutationStateInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { t as assertSqliteJsonlReadBudget } from "./sqlite-jsonl-budget-Ct596TxU.mjs";
import "./session-cold-storage-read-DxurMT4l.mjs";
import { t as loadTranscriptEventRowsAfterSeqInDatabase } from "./session-accessor.sqlite-transcript-incremental-read-D4tO2nxt.mjs";
import { i as readTranscriptHeaderFromDatabase, r as readLatestAssistantTextFromDatabase, t as findTranscriptEventInRows } from "./session-accessor.sqlite-transcript-metadata-read-BOm6XprL.mjs";
import { r as readTranscriptStatsFromDatabase, t as readTranscriptExportStatsFromDatabase } from "./session-accessor.sqlite-transcript-stats-CaGrryDT.mjs";
//#region src/config/sessions/session-accessor.sqlite-export-slices.ts
/**
* Reads one export snapshot: the head in the first slice's transaction (or the batch head while
* the transcript context version still matches it), then its deferred rows in bounded slices,
* one short read transaction each, parsed after that transaction closed. Every later slice first
* compares the transcript context version, the token writers already validate loaded bytes
* against; on a change the transcript is reread inside one transaction.
*/
function readTranscriptExportInSlices(params) {
	const { sessionId, transaction, batchHead, projectEvent } = params;
	const hot = (snapshot) => {
		if (snapshot === "cold") throw new SessionTranscriptColdError(sessionId);
		return snapshot;
	};
	const readWhole = () => {
		const whole = transaction((database) => hot(params.readHead(database)));
		return whole.found ? whole.value : void 0;
	};
	if (params.projection === "reset-boundary") return readWhole();
	const first = transaction((database) => {
		const snapshot = batchHead?.deferred && isSameTranscriptContextVersion(readTranscriptContextVersionInTransaction(database, sessionId), batchHead.deferred.version) ? batchHead : hot(params.readHead(database, { deferAboveBytes: 0 }));
		const { deferred } = snapshot;
		return {
			snapshot,
			slice: deferred && readTranscriptPayloadSlice(database, sessionId, deferred, deferred.afterSeq)
		};
	});
	if (!first.found) return;
	const { deferred, ...snapshot } = first.value.snapshot;
	if (!deferred) return snapshot;
	const events = [...snapshot.events];
	let slice = first.value.slice;
	while (slice) {
		const { payloads } = slice;
		for (let index = 0; index < payloads.length; index++) {
			const event = JSON.parse(payloads[index]);
			payloads[index] = void 0;
			events.push(projectEvent ? projectEvent(event) : event);
		}
		const afterSeq = slice.resumeAfterSeq;
		if (afterSeq === void 0) break;
		const next = transaction((database) => isSameTranscriptContextVersion(readTranscriptContextVersionInTransaction(database, sessionId), deferred.version) ? readTranscriptPayloadSlice(database, sessionId, deferred, afterSeq) : void 0);
		if (!next.found) return;
		if (!next.value) return readWhole();
		slice = next.value;
	}
	return {
		...snapshot,
		events
	};
}
/** Captures payload text after `afterSeq`, decoded by SQLite, up to the slice budget. */
function readTranscriptPayloadSlice(database, sessionId, { throughSeq }, afterSeq) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "events", () => {
		const slice = { payloads: [] };
		let bytes = 0;
		for (const row of iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select([
			"seq",
			transcriptEventJsonSql(database.db).as("event_json"),
			transcriptEventReadBytesSql().as("payload_bytes")
		]).where("session_id", "=", sessionId).where("seq", "<=", throughSeq).$if(afterSeq !== void 0, (query) => query.where("seq", ">", afterSeq)).orderBy("seq", "asc"))) {
			slice.payloads.push(row.event_json);
			bytes += row.payload_bytes;
			if (bytes >= 2097152) {
				slice.resumeAfterSeq = row.seq;
				break;
			}
		}
		return slice;
	});
}
function isSameTranscriptContextVersion(left, right) {
	return left.generation === right.generation && left.rawSeq === right.rawSeq && left.updatedAt === right.updatedAt;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-parent.ts
/** Validates a prepared assistant from bounded indexed message metadata. */
function canRebasePreparedAssistantInTransaction(database, sessionId, preparedParentId, admittedUserId, questionAnswers = []) {
	const tailId = readActiveTranscriptAppendParentId(database, sessionId);
	if (tailId !== preparedParentId) {
		if (tailId === null || !transcriptEntryIsAncestor(database, sessionId, tailId, preparedParentId)) return false;
	}
	if (admittedUserId && tailId !== admittedUserId && (tailId === null || !transcriptEntryIsAncestor(database, sessionId, tailId, admittedUserId))) return false;
	const db = getSessionKysely(database.db);
	const preparedParent = preparedParentId === null ? void 0 : readTranscriptIdentityInTransaction(database, sessionId, preparedParentId);
	if (preparedParentId !== null && !preparedParent) return false;
	const admitted = admittedUserId ? admittedUserId === preparedParentId ? preparedParent : readTranscriptIdentityInTransaction(database, sessionId, admittedUserId) : void 0;
	if (admittedUserId && !admitted) return false;
	const actor = readSessionActorTransactionState(database, { sessionId });
	const admittedIsNewer = admitted !== void 0 && admitted.seq > (preparedParent?.seq ?? -1);
	if (actor?.transcript.complete && ![...actor.transcript.identities.values()].some((identity) => identity.event_type === "message" && identity.seq > (preparedParent?.seq ?? -1))) return !admittedIsNewer;
	const newerMessageMetadata = Array.from(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
		"identity.event_id",
		"identity.seq",
		transcriptEventReadBytesSql("event").as("serialized_bytes")
	]).where("identity.session_id", "=", sessionId).where("identity.event_type", "=", "message").where("identity.seq", ">", preparedParent?.seq ?? -1).orderBy("identity.seq", "asc").limit(257)));
	if (newerMessageMetadata.length > 256 || newerMessageMetadata.reduce((sum, row) => sum + row.serialized_bytes, 0) > 1048576) return false;
	if (admittedIsNewer && !newerMessageMetadata.some((row) => row.event_id === admittedUserId)) return false;
	if (newerMessageMetadata.length === 0) return !admittedIsNewer;
	const newerRoles = Array.from(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).leftJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.event_id",
		"identity.seq",
		"identity.parent_id",
		"active.message_position",
		"rewrite.generation",
		sql`json_extract(${transcriptEventNavigationSql(database.db, "event")}, '$.message.role')`.as("message_role"),
		sql`json_type(${transcriptEventNavigationSql(database.db, "event")}, '$.message.excludeFromContext') = 'true'
            AND json_type(${transcriptEventNavigationSql(database.db, "event")}, '$.message.__openclaw.contextFreeCommand') = 'true'`.as("context_free_command"),
		sql`json_extract(${transcriptEventNavigationSql(database.db, "event")}, '$.message.provenance.kind')`.as("provenance_kind"),
		sql`json_extract(${transcriptEventNavigationSql(database.db, "event")}, '$.message.provenance.sourceChannel')`.as("provenance_source_channel")
	]).where("identity.session_id", "=", sessionId).where("identity.seq", ">=", newerMessageMetadata[0].seq).where("identity.seq", "<=", newerMessageMetadata.at(-1).seq).where("identity.event_type", "=", "message").orderBy("identity.seq", "asc").limit(256)));
	return preparedAssistantMessagesPreserveTurn(newerRoles, admittedUserId, (row) => {
		const answer = questionAnswers.find((input) => input.entryId === row.event_id);
		return answer !== void 0 && answer.rawSeq === row.seq && answer.effectiveParentId === row.parent_id && answer.activeMessagePosition === row.message_position && answer.generation === row.generation;
	});
}
function resolveTranscriptEventAppendParent(database, sessionId, event, options) {
	if (options.appendIntent !== "active-branch" || !isRecord(event) || !("parentId" in event)) return event;
	const parentId = event.parentId;
	if (parentId !== null && typeof parentId !== "string") return event;
	const effectiveParentId = resolveTranscriptMessageAppendParent(database, sessionId, {
		appendIntent: "active-branch",
		parentId
	});
	return effectiveParentId === parentId ? event : {
		...event,
		parentId: effectiveParentId
	};
}
function resolveTranscriptMessageAppendParent(database, sessionId, options) {
	const tailId = readActiveTranscriptAppendParentId(database, sessionId);
	return resolveTranscriptAppendParent({
		tailId,
		parentId: options.parentId,
		appendIntent: options.appendIntent,
		isAncestor: (leafId, candidateId) => transcriptEntryIsAncestor(database, sessionId, leafId, candidateId)
	});
}
/** Checks the durable tree directly when the materialized active-path projection is dirty. */
function isTranscriptEntryOnActivePathInTransaction(database, sessionId, entryId) {
	const tree = scanSessionTranscriptTree(readTranscriptNavigationEvents(database, sessionId));
	return selectSessionTranscriptTreePathNodes(tree, tree.leafId).some((node) => node.id === entryId);
}
function transcriptEntryIsAncestor(database, sessionId, leafId, candidateId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) {
		let current = actor.transcript.identities.get(leafId);
		for (let depth = 0; current && depth < 4096; depth++) {
			if (current.parent_id === candidateId) return true;
			if (current.parent_id === null) return false;
			current = actor.transcript.identities.get(current.parent_id);
		}
		if (current || actor.transcript.complete) return false;
	}
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.withRecursive("transcript_ancestors", (query) => query.selectFrom("transcript_event_identities").select(["parent_id", sql`1`.as("depth")]).where("session_id", "=", sessionId).where("event_id", "=", leafId).unionAll(query.selectFrom("transcript_event_identities as ti").innerJoin("transcript_ancestors as ancestor", "ti.event_id", "ancestor.parent_id").select(["ti.parent_id", sql`ancestor.depth + 1`.as("depth")]).where("ti.session_id", "=", sessionId).where("ancestor.depth", "<", PREPARED_ASSISTANT_MAX_ANCESTORS))).selectFrom("transcript_ancestors").select("parent_id").where("parent_id", candidateId === null ? "is" : "=", candidateId).limit(1))?.parent_id === candidateId;
}
/** Selects visible identity inside the append transaction, independently of the raw side cursor. */
function readTranscriptVisibleTailEntryIdInTransaction(database, sessionId, messageId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor?.transcript.complete) {
		const tree = scanSessionTranscriptTree(actor.transcript.navigation);
		return selectSessionTranscriptTreePathNodes(tree, tree.leafId).at(-1)?.id ?? null;
	}
	const db = getSessionKysely(database.db);
	const resolveFromNavigation = () => {
		const tree = scanSessionTranscriptTree(readTranscriptNavigationEvents(database, sessionId));
		return selectSessionTranscriptTreePathNodes(tree, tree.leafId).at(-1)?.id ?? null;
	};
	if (!sessionTranscriptIndexNeedsReconcile(database.db, sessionId)) {
		const tail = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(projectTranscriptNavigationSql(database.db, transcriptEventNavigationSql(database.db, "event")).as("event_json")).where("active.session_id", "=", sessionId).orderBy("active.active_position", "desc").limit(1));
		return tail ? resolveSessionTranscriptActiveLeafEntryId([JSON.parse(tail.event_json)]) ?? null : null;
	}
	const message = readTranscriptIdentityInTransaction(database, sessionId, messageId);
	if (!message) return resolveFromNavigation();
	let leafId = null;
	let first = true;
	let needsPrefix = false;
	const navigation = iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(projectTranscriptNavigationSql(database.db, transcriptEventNavigationSql(database.db)).as("event_json")).where("session_id", "=", sessionId).where("seq", ">=", message.seq).orderBy("seq", "asc"));
	for (const row of navigation) {
		const event = JSON.parse(row.event_json);
		if (isSessionTranscriptLeafControl(event)) {
			needsPrefix = true;
			break;
		}
		const selected = resolveSessionTranscriptActiveLeafEntryId([event]);
		if (first && selected !== messageId) {
			needsPrefix = true;
			break;
		}
		first = false;
		if (selected !== void 0) leafId = selected;
	}
	return needsPrefix || first ? resolveFromNavigation() : leafId;
}
function readActiveTranscriptAppendParentId(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor?.transcript.complete) return scanSessionTranscriptTree(actor.transcript.navigation).appendParentId;
	const db = getSessionKysely(database.db);
	const retainedIdentity = actor && [...actor.transcript.identities.values()].at(-1);
	const retainedNavigation = retainedIdentity && actor?.transcript.navigation.findLast((event) => event.seq === retainedIdentity.seq);
	const latest = retainedNavigation ? void 0 : executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as ti").innerJoin("transcript_events as te", (join) => join.onRef("te.session_id", "=", "ti.session_id").onRef("te.seq", "=", "ti.seq")).select(["ti.event_type", projectTranscriptNavigationSql(database.db, transcriptEventNavigationSql(database.db, "te")).as("event_json")]).where("ti.session_id", "=", sessionId).orderBy("ti.seq", "desc").limit(1));
	const resolveFromNavigation = () => scanSessionTranscriptTree(readTranscriptNavigationEvents(database, sessionId)).appendParentId;
	if (!retainedNavigation && !latest) {
		const current = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state as state").innerJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "state.session_id").select("state.leaf_event_id").where("state.session_id", "=", sessionId).where("state.needs_rebuild", "=", 0).where("state.indexed_seq", "=", db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1)).where((eb) => eb.not(eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").where("session_id", "=", sessionId).where("context_eligible", "is", null)))));
		return current ? current.leaf_event_id : resolveFromNavigation();
	}
	try {
		const event = retainedNavigation ?? (latest ? JSON.parse(latest.event_json) : void 0);
		const treeEntry = parseSessionTranscriptTreeEntry(event);
		if (!treeEntry) return resolveFromNavigation();
		if ((retainedNavigation ? retainedIdentity?.event_type : latest?.event_type) !== "leaf") return treeEntry.appendParentId;
		if (actor) return resolveFromNavigation();
		const leafReferencesKnown = treeEntry.leafId !== void 0 && transcriptTreeReferenceExists(database, sessionId, treeEntry.leafId) && transcriptTreeReferenceExists(database, sessionId, treeEntry.appendParentId);
		if (isSessionTranscriptLeafControl(event) && leafReferencesKnown) return treeEntry.appendParentId;
	} catch {}
	return resolveFromNavigation();
}
function readTranscriptNavigationEvents(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor?.transcript.complete) return structuredClone(actor.transcript.navigation);
	const db = getSessionKysely(database.db);
	return Array.from(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(projectTranscriptNavigationSql(database.db, transcriptEventNavigationSql(database.db)).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "asc")), (row) => JSON.parse(row.event_json));
}
function readTranscriptIdentityInTransaction(database, sessionId, eventId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) {
		const row = actor.transcript.identities.get(eventId);
		if (row || actor.transcript.complete) return row ? {
			eventId: row.event_id,
			parentId: row.parent_id,
			seq: row.seq
		} : void 0;
	}
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select([
		"event_id",
		"parent_id",
		"seq"
	]).where("session_id", "=", sessionId).where("event_id", "=", eventId).limit(1));
	return row ? {
		eventId: row.event_id,
		parentId: row.parent_id,
		seq: row.seq
	} : void 0;
}
function transcriptTreeReferenceExists(database, sessionId, eventId) {
	return eventId === null || readTranscriptIdentityInTransaction(database, sessionId, eventId) !== void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-read.ts
function createTranscriptIdentityReader(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	const db = getSessionKysely(database.db);
	let read;
	const prepareRead = () => prepareSqliteQuerySync(database.db, (parameter) => db.selectFrom(db.selectNoFrom((eb) => eb.val(sessionId).as("session_id")).as("target")).leftJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "target.session_id").on("identity.event_id", "=", parameter((eventId) => eventId))).select([
		"identity.event_id",
		"identity.parent_id",
		"identity.seq"
	]).select((eb) => eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", sessionId)).as("cold")));
	return (eventId) => {
		if (actor) {
			if (actor.transcript.coldArchive) throw new SessionTranscriptColdError(sessionId);
			const row = actor.transcript.identities.get(eventId);
			if (row || actor.transcript.complete) return row ? {
				eventId: row.event_id,
				parentId: row.parent_id,
				seq: row.seq
			} : void 0;
		}
		return runSqliteReadOperationSync(database.db, () => {
			assertTransactionUsable(database.db);
			const row = (read ??= prepareRead())(eventId).rows[0];
			assertTransactionUsable(database.db);
			if (row.cold) throw new SessionTranscriptColdError(sessionId);
			return row.event_id !== null && row.seq !== null ? {
				eventId: row.event_id,
				parentId: row.parent_id,
				seq: row.seq
			} : void 0;
		});
	};
}
function readTranscriptIdentityByEventId(database, sessionId, eventId) {
	return createTranscriptIdentityReader(database, sessionId)(eventId);
}
function loadTranscriptEventsSync(scope) {
	return loadTranscriptReadSnapshotSync(scope).events;
}
/** Decode bounded SQLite payload slices after releasing each read transaction. */
function readTranscriptExportSnapshotReadOnlySync(scope, options = {}, batchHead) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return readTranscriptExportInSlices({
		...options,
		sessionId: resolved.sessionId,
		batchHead,
		transaction: (read) => withOpenClawAgentDatabaseReadOnly((database) => runSqliteReadSnapshotSync(database.db, () => read(database), { operationLabel: "session transcript export snapshot" }), toDatabaseOptions(resolved)),
		readHead: (database, slicing) => readTranscriptExportSnapshotFromDatabase(database, resolved, scope, options, slicing)
	});
}
/** The memory worker shares one read transaction across its bounded source batch. */
function readTranscriptExportSnapshotFromDatabase(database, resolved, scope, options, { deferAboveBytes = Number.POSITIVE_INFINITY } = {}) {
	const fence = resolveSqliteSessionTranscriptReadFence({
		database,
		...resolved
	});
	const { stats, generation, cold } = options.previous !== void 0 ? readTranscriptExportStatsFromDatabase(database, resolved.sessionId) : {
		stats: readTranscriptStatsFromDatabase(database, resolved.sessionId),
		generation: null,
		cold: false
	};
	if (cold) throw new SessionTranscriptColdError(resolved.sessionId);
	const throughSeq = Math.min(stats.eventCount === 0 ? -1 : stats.maxSeq, fence ? fence.beforeRawSeq - 1 : Number.POSITIVE_INFINITY);
	const previous = generation !== null && options.previous?.generation === generation && options.previous.throughSeq <= throughSeq ? options.previous : void 0;
	const sessionKey = resolved.sessionKey ?? executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", resolved.sessionId).limit(1))?.session_key;
	const deferred = previous?.throughSeq !== throughSeq && options.projection !== "reset-boundary" && stats.sizeBytes > deferAboveBytes && !isPostgresSqlConnection(database.db);
	if (deferred) prepareTranscriptEventReadQuery(database, resolved.sessionId, {
		beforeEventSeq: fence?.beforeRawSeq,
		maxEventBytes: scope.maxEventBytes
	});
	return {
		events: [...previous?.events ?? [], ...previous?.throughSeq === throughSeq || deferred ? [] : loadTranscriptEventsFromDatabase(database, resolved.sessionId, {
			...options,
			beforeEventSeq: fence?.beforeRawSeq,
			afterEventSeq: previous?.throughSeq,
			maxEventBytes: scope.maxEventBytes
		})],
		stats,
		sessionKey,
		...options.previous !== void 0 ? {
			generation,
			throughSeq
		} : {},
		...deferred ? { deferred: {
			afterSeq: previous?.throughSeq,
			throughSeq,
			version: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
		} } : {}
	};
}
/** Pair loaded bytes with the watermark that also fences opaque navigation edits. */
function loadTranscriptReadSnapshotSync(scope, options = {}) {
	const resolved = options.resolvedScope ?? resolveSqliteTranscriptReadScope(scope);
	const read = (database) => runSqliteDeferredTransactionSync(database.db, () => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		return {
			events: loadTranscriptEventsFromDatabase(database, resolved.sessionId, {
				beforeEventSeq: fence?.beforeRawSeq,
				maxEventBytes: scope.maxEventBytes
			}),
			version: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript fenced read"
	});
	const databaseOptions = toDatabaseOptions(resolved);
	if (!options.readOnly) return read(openOpenClawAgentDatabase(databaseOptions));
	const result = withOpenClawAgentDatabaseReadOnly(read, databaseOptions);
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	return result.value;
}
/** Reads a complete maintenance transcript and its lifecycle snapshot from one transaction. */
function inspectTranscriptEventsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => ({
		events: readTranscriptSnapshot(database, resolved.sessionId).events,
		snapshot: readSessionStateDeleteSnapshot(database.db, resolved.sessionId)
	}), {
		databaseLabel: database.path,
		operationLabel: "session transcript inspection"
	}), toDatabaseOptions(resolved));
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	return result.value;
}
/** Validates a prepared assistant using indexed identities and returns its exact mutation fence. */
function validatePreparedAssistantAppendSync(scope, preparedParentId, admittedUserId) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const questionAnswers = captureSessionTranscriptQuestionAnswers(database, resolved.sessionId, admittedUserId);
	return runSqliteDeferredTransactionSync(database.db, () => canRebasePreparedAssistantInTransaction(database, resolved.sessionId, preparedParentId, admittedUserId, questionAnswers?.answers) ? readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt : void 0, {
		databaseLabel: database.path,
		operationLabel: "prepared assistant validation"
	});
}
/** Loads only the first transcript row for header metadata hot paths. */
function loadTranscriptHeaderSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readTranscriptHeaderFromDatabase(database, resolved.sessionId);
}
/** Loads additive transcript rows after one durable sequence checkpoint. */
function loadTranscriptEventRowsAfterSeqSync(scope, afterSeq) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return loadTranscriptEventRowsAfterSeqInDatabase(database, resolved.sessionId, afterSeq);
}
/** Reads one checkpoint row so incremental consumers can reject transcript rewrites. */
function readTranscriptEventAtSeqSync(scope, seq) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readHotSessionTranscriptSnapshot(database, resolved.sessionId, "checkpoint", () => {
		return readTranscriptEventAtSeqInTransaction(database, resolved.sessionId, seq);
	});
}
/** Reads one raw row within the caller's already validated transcript snapshot. */
function readTranscriptEventAtSeqInTransaction(database, sessionId, seq) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select([transcriptEventJsonSql(database.db).as("event_json"), "seq"]).where("session_id", "=", sessionId).where("seq", "=", seq));
	return row ? {
		event: JSON.parse(row.event_json),
		seq: coerceRequiredSqliteNumber(row.seq)
	} : void 0;
}
/** Select the same fenced rows for synchronous materialization and worker transfer. */
function prepareTranscriptEventReadQuery(database, sessionId, options = {}) {
	const { beforeEventSeq, maxEventBytes } = options;
	const db = getSessionKysely(database.db);
	if (maxEventBytes !== void 0 && Number.isFinite(maxEventBytes) && maxEventBytes >= 0) assertSqliteJsonlReadBudget(database.db, db.selectFrom("transcript_events").select(["event_json", "event_utf8_bytes"]).where("session_id", "=", sessionId).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).as("events"), Math.floor(maxEventBytes), "Trajectory transcript store", { hasExactUtf8Bytes: true });
	return db.selectFrom("transcript_events").where("session_id", "=", sessionId).$if(options.afterEventSeq !== void 0, (query) => query.where("seq", ">", options.afterEventSeq)).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq));
}
function loadTranscriptEventsFromDatabase(database, sessionId, options = {}) {
	return readTranscriptEventsFromDatabase(database, sessionId, Array.from, options);
}
/** Consume synchronously; the iterator cannot outlive its fenced native snapshot. */
function readTranscriptEventsFromDatabase(database, sessionId, consume, options = {}) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "events", () => {
		const rows = iterateSqliteQuerySync(database.db, prepareTranscriptEventReadQuery(database, sessionId, options).select([options.projection === "reset-boundary" ? transcriptEventResetNavigationSql(database.db).as("event_json") : transcriptEventJsonSql(database.db).as("event_json")]).orderBy("seq", "asc"));
		const events = (function* () {
			for (const row of rows) {
				const event = JSON.parse(row.event_json);
				yield options.projectEvent ? options.projectEvent(event) : event;
			}
		})();
		try {
			return consume(events);
		} finally {
			events.return();
		}
	});
}
function readTranscriptSnapshot(database, sessionId) {
	const rows = readTranscriptEventRows(database, sessionId);
	return {
		events: rows.map((row) => JSON.parse(row.eventJson)),
		rows
	};
}
/** Reads canonical transcript text without parsing JSON for snapshot comparison. */
function readTranscriptEventRows(database, sessionId, options = {}) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "raw rows", () => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([transcriptEventJsonSql(database.db).as("event_json"), "seq"]).where("session_id", "=", sessionId).$if(options.afterSeq !== void 0, (query) => query.where("seq", ">", options.afterSeq)).orderBy("seq", "asc")).rows.map((row) => ({
			eventJson: row.event_json,
			seq: coerceRequiredSqliteNumber(row.seq)
		}));
	});
}
/** Reads exact transcript storage rows for guarded doctor rewrites. */
function readTranscriptStorageRows(database, sessionId) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "storage rows", () => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([
			"created_at",
			transcriptEventJsonSql(database.db).as("event_json"),
			"seq"
		]).where("session_id", "=", sessionId).orderBy("seq", "asc")).rows.map((row) => ({
			createdAt: coerceRequiredSqliteNumber(row.created_at),
			eventJson: row.event_json,
			seq: coerceRequiredSqliteNumber(row.seq)
		}));
	});
}
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readTranscriptStatsFromDatabase(database, resolved.sessionId);
}
function loadLatestAssistantText(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readLatestAssistantTextFromDatabase(database, resolved);
}
function findTranscriptEventInDatabase(database, sessionId, match, navigationMatch, { malformed = "skip" } = {}) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "match", () => {
		const events = getSessionKysely(database.db).selectFrom("transcript_events").where("session_id", "=", sessionId);
		const selection = navigationMatch ? transcriptEventNavigationSql(database.db) : transcriptEventJsonSql(database.db);
		for (const row of iterateSqliteQuerySync(database.db, events.select(["seq", selection.as("event_json")]).select((eb) => eb("navigation_json", "is not", null).as("projected")).orderBy("seq", "desc"))) {
			const prefilter = row.projected ? navigationMatch : void 0;
			if (prefilter && !findTranscriptEventInRows([row], prefilter)) continue;
			const payload = prefilter ? executeSqliteQueryTakeFirstSync(database.db, events.select(transcriptEventJsonSql(database.db).as("event_json")).where("seq", "=", row.seq)) : row;
			const found = payload && findTranscriptEventInRows([payload], match, malformed);
			if (found) return found;
		}
	});
}
/** Match assistant identity without decoding unrelated message bodies under the writer lock. */
function findAssistantTranscriptEventInDatabase(database, sessionId, idempotencyKey) {
	const matches = (event) => {
		const message = readTranscriptEventMessage(event);
		return message?.role === "assistant" && (idempotencyKey === void 0 || message.idempotencyKey === idempotencyKey);
	};
	return findTranscriptEventInDatabase(database, sessionId, matches, matches);
}
function readTranscriptEventMessage(event) {
	return asOptionalRecord(asOptionalRecord(event)?.message);
}
function readTranscriptEventId(event) {
	const id = asOptionalRecord(event)?.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function readEventTimestamp(event) {
	return parseDateFirstTimestampMs(asOptionalRecord(event)?.timestamp);
}
function isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	const current = readTranscriptEventRows(database, sessionId);
	return current.length === expected.length && current.every((row, index) => row.seq === expected[index]?.seq && row.eventJson === expected[index]?.eventJson);
}
function assertSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	if (!isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected)) throw new SqliteTranscriptMutationConflictError(sessionId);
}
//#endregion
export { readTranscriptVisibleTailEntryIdInTransaction as A, readTranscriptIdentityByEventId as C, validatePreparedAssistantAppendSync as D, readTranscriptStorageRows as E, resolveTranscriptMessageAppendParent as M, canRebasePreparedAssistantInTransaction as O, readTranscriptExportSnapshotReadOnlySync as S, readTranscriptStatsSync as T, readTranscriptEventId as _, inspectTranscriptEventsSync as a, readTranscriptEventsFromDatabase as b, loadTranscriptEventRowsAfterSeqSync as c, loadTranscriptHeaderSync as d, loadTranscriptReadSnapshotSync as f, readTranscriptEventAtSeqSync as g, readTranscriptEventAtSeqInTransaction as h, findTranscriptEventInDatabase as i, resolveTranscriptEventAppendParent as j, isTranscriptEntryOnActivePathInTransaction as k, loadTranscriptEventsFromDatabase as l, readEventTimestamp as m, createTranscriptIdentityReader as n, isSqliteTranscriptSnapshotUnchanged as o, prepareTranscriptEventReadQuery as p, findAssistantTranscriptEventInDatabase as r, loadLatestAssistantText as s, assertSqliteTranscriptSnapshotUnchanged as t, loadTranscriptEventsSync as u, readTranscriptEventMessage as v, readTranscriptSnapshot as w, readTranscriptExportSnapshotFromDatabase as x, readTranscriptEventRows as y };
