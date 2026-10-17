import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sql, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as stageSqliteTransactionState, r as hasSqlitePostCommitScope } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as assertOwnedTranscriptWriteCommit, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as clearAllCliSessions } from "./cli-session-binding-CMk8AbZT.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope, m as transcriptWriteScopeIsCurrent, p as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { C as transcriptEventContextEligibility, S as shouldProjectActiveEvent, b as extractTranscriptIndexEntry, d as replaceSessionTranscriptIndexSuffixInTransaction, f as sessionTranscriptIndexNeedsReconcile, l as markSessionTranscriptIndexDirtyInTransaction, n as SYNC_REBUILD_MAX_ROWS, x as hasTranscriptMessage } from "./session-transcript-index-FbEuN6S5.mjs";
import { l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, o as parseSessionTranscriptTreeEntry, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-CaYJo8Xs.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { t as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { d as writeSessionEntry, o as readSessionEntrySelectionSnapshot, s as readSessionIdentitySnapshot } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { r as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { a as insertTranscriptRowsWithoutProjectionInTransaction, d as rewriteSqliteTranscriptEventRowsInTransaction, f as scheduleTranscriptProjectionReconcile, r as canonicalizeTranscriptEventMedia, t as appendTranscriptEventInTransaction, u as replaceSqliteTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { a as pruneTranscriptReactionsInTransaction, c as readTranscriptGenerationInTransaction, d as touchTranscriptMutationInTransaction, l as readTranscriptMutationStateInTransaction, s as readTranscriptContextVersionInTransaction, u as rotateTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { A as resolveTranscriptEventAppendParent, _ as readTranscriptEventMessage, c as loadTranscriptEventsFromDatabase, g as readTranscriptEventId, k as readTranscriptVisibleTailEntryIdInTransaction, p as readEventTimestamp, v as readTranscriptEventRows, w as readTranscriptStorageRows, x as readTranscriptSnapshot } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { n as projectTranscriptRetainedDataSql, r as stageRetainedTranscriptData } from "./session-transcript-retained-data-31r579xq.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import "./types-BZlUzQZy.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { t as createTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-J9plH1Sq.mjs";
import { i as rememberCommittedTranscriptMessageSequencesInTransaction, n as readCommittedTranscriptMessageSequence } from "./session-accessor.sqlite-transcript-sequences-BVG-PGVB.mjs";
import { i as resolveTranscriptAppendRefusal, n as assertNonMessageTranscriptEvent, t as assertLockedTranscriptWriteAllowed } from "./session-accessor.sqlite-transcript-write-guard-Dit9k70E.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-mirror.ts
const TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE = 900;
/** Returns raw events only when the transcript identity projection is not current. */
function loadTranscriptEventsForMirrorFallback(database, sessionId) {
	const db = getSessionKysely(database.db);
	const latest = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	if (!latest) return [];
	const state = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", sessionId));
	if (state && state.needs_rebuild === 0 && state.indexed_seq === latest.seq) return;
	return loadTranscriptEventsFromDatabase(database, sessionId);
}
/** Reads the bounded identity facts needed by transcript mirrors. */
function readTranscriptMirrorFacts(database, resolved, params) {
	return runSqliteDeferredTransactionSync(database.db, () => readTranscriptMirrorFactsInSnapshot(database, resolved, params), {
		databaseLabel: database.path,
		operationLabel: "session.transcript.mirror-facts"
	});
}
/** Reads mirror facts after the caller has established one SQLite snapshot. */
function readTranscriptMirrorFactsInSnapshot(database, resolved, params) {
	assertSessionTranscriptHot(database.db, resolved.sessionId);
	const idempotencyKeys = [...new Set(params.idempotencyKeys)];
	const fallbackEvents = loadTranscriptEventsForMirrorFallback(database, resolved.sessionId);
	if (fallbackEvents !== void 0) return readMirrorFactsFromEvents(fallbackEvents, new Set(idempotencyKeys));
	const db = getSessionKysely(database.db);
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	let anchorsReady;
	for (const batch of chunkItems(idempotencyKeys, TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE)) {
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).leftJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
			"identity.event_id",
			"identity.message_idempotency_key",
			"identity.seq",
			"identity.parent_id",
			transcriptEventJsonSql(database.db, "event").as("event_json"),
			"active.message_position",
			"rewrite.generation"
		]).where("identity.session_id", "=", resolved.sessionId).where("identity.message_idempotency_key", "in", batch).orderBy("identity.seq", "asc")).rows;
		for (const row of rows) {
			const idempotencyKey = row.message_idempotency_key;
			if (!idempotencyKey) continue;
			facts.existingIdempotencyKeys.add(idempotencyKey);
			anchorsReady ??= !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId);
			const anchor = anchorsReady ? createTranscriptEntryAnchor({
				database,
				resolved,
				entryId: row.event_id,
				row
			}) : void 0;
			if (anchor) facts.anchorsByIdempotencyKey.set(idempotencyKey, anchor);
			const message = readTranscriptEventMessage(JSON.parse(row.event_json));
			if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
		}
	}
	return facts;
}
/** Extracts supplied mirror identities from authoritative transcript events. */
function readMirrorFactsFromEvents(events, candidateKeys) {
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	for (const event of events) {
		const message = readTranscriptEventMessage(event);
		const idempotencyKey = readMessageIdempotencyKey(message);
		if (!idempotencyKey || !candidateKeys.has(idempotencyKey)) continue;
		facts.existingIdempotencyKeys.add(idempotencyKey);
		if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
	}
	return facts;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-write-snapshot.ts
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
function runTranscriptWriteSnapshotSync(scope, operation, beforeCommitInTransaction, expectedMutationAt, view, diagnosticContext) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let connection;
	const result = runOpenClawAgentWriteTransaction((database) => {
		connection = database.db;
		beforeCommitInTransaction?.();
		view?.assertCurrent();
		assertOwnedTranscriptWriteCommit(fencedScope);
		const fresh = readSessionEntryRow(database, resolved.sessionKey, "list");
		const refusal = resolveTranscriptAppendRefusal(fresh?.entry, resolved, fencedScope);
		if (refusal) return err(refusal);
		const before = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
		if (expectedMutationAt !== void 0 && before.updatedAt !== expectedMutationAt) throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
		const lifecycleRevision = fresh?.entry.lifecycleRevision;
		const value = operation(database, resolved);
		view?.assertCurrent();
		assertOwnedTranscriptWriteCommit(fencedScope);
		return ok({
			result: value,
			lifecycleRevision,
			before,
			after: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
		});
	}, toDatabaseOptions(resolved), {
		operationLabel: "session.transcript.write-snapshot",
		diagnosticContext: {
			sessionId: resolved.sessionId,
			requestedEvents: 1,
			...diagnosticContext
		}
	});
	if (result.ok && connection && hasSqlitePostCommitScope(connection)) view?.onPendingTransaction(connection);
	if (fencedScope.expectedWriterRunId !== void 0 && !result.ok) throw new SessionTranscriptWriterClaimReboundError(result.error);
	return result;
}
//#endregion
//#region src/config/sessions/session-entry-projection.ts
const SESSION_ENTRY_PRIVATE_CLEAR_PATCH = {
	activeWriterRunId: void 0,
	lastRunId: void 0,
	lifecycleRunId: void 0,
	mainRestartRecovery: void 0,
	pendingProjectGitUrl: void 0,
	pendingWorktree: void 0,
	sessionDiffBaselineCapture: void 0,
	transcriptByteCompactionLatch: void 0
};
const PRIVATE_SESSION_ENTRY_KEYS = [
	"inheritedGitContributorProfileIds",
	"profileInvolvement",
	"cliHistoryBoundary",
	"publicShare",
	"activeWriterRunId",
	"lastRunId",
	"lifecycleRunId",
	"mainRestartRecovery",
	"pendingProjectGitUrl",
	"pendingWorktree",
	"sessionDiffBaselineCapture",
	"transcriptByteCompactionLatch"
];
function stripPrivateSessionEntryFields(entry) {
	const projected = { ...entry };
	for (const key of PRIVATE_SESSION_ENTRY_KEYS) delete projected[key];
	delete projected.thinkingLevelSelection;
	delete projected.compactionCheckpoints;
	if (entry.modelFallback) {
		const { prevThinkingLevelSelection: _privateSelection, ...modelFallback } = entry.modelFallback;
		projected.modelFallback = modelFallback;
	} else delete projected.modelFallback;
	return projected;
}
function projectPublicSessionEntry(entry) {
	return stripPrivateSessionEntryFields(entry);
}
function projectPublicSessionEntryPatch(patch) {
	return stripPrivateSessionEntryFields(patch);
}
const COMPACTION_RUN_USAGE_CLEAR_PATCH = {
	inputTokens: void 0,
	outputTokens: void 0,
	cacheRead: void 0,
	cacheWrite: void 0,
	estimatedCostUsd: void 0
};
function projectCompactionAccountingPatch(current, params) {
	const incrementBy = Math.max(0, params.amount ?? 1);
	const tokensAfter = typeof params.tokensAfter === "number" && Number.isFinite(params.tokensAfter) && params.tokensAfter >= 0 ? Math.floor(params.tokensAfter) : void 0;
	const patch = {
		compactionCount: (current.compactionCount ?? 0) + incrementBy,
		transcriptByteCompactionLatch: params.transcriptByteCompactionLatch,
		updatedAt: params.now ?? Date.now(),
		...incrementBy > 0 || tokensAfter !== void 0 ? COMPACTION_RUN_USAGE_CLEAR_PATCH : {},
		...incrementBy > 0 ? { contextBudgetStatus: void 0 } : {}
	};
	if (params.compactionKind === "context-engine") clearAllCliSessions(patch);
	if (tokensAfter !== void 0) Object.assign(patch, {
		totalTokens: tokensAfter,
		totalTokensFresh: true,
		totalTokensVersion: 1
	});
	else if (incrementBy > 0) {
		patch.totalTokensFresh = false;
		patch.totalTokensVersion = void 0;
	}
	return patch;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-suffix-idempotency.ts
/** Prepares idempotency-owner changes before the bounded suffix write transaction. */
function prepareIncrementalSuffixIdempotencyMutation(params) {
	const db = getSessionKysely(params.database.db);
	const suffixIdentityKeys = executeSqliteQuerySync(params.database.db, db.selectFrom("transcript_event_identities").select(["event_id", "message_idempotency_key"]).where("session_id", "=", params.resolved.sessionId).where("seq", ">=", params.startSeq).orderBy("seq", "asc").limit(params.expectedRows.length + 1)).rows.map((row) => [row.event_id, row.message_idempotency_key]);
	if (suffixIdentityKeys.length > params.expectedRows.length) throw new Error(`SQLite transcript changed while preparing suffix removal for ${params.resolved.sessionId}`);
	const suffixIdentityMap = new Map(suffixIdentityKeys);
	const retainedIdempotencyKeys = new Set(params.next.flatMap((event) => {
		const eventId = readTranscriptEventId(event);
		const storedKey = eventId ? suffixIdentityMap.get(eventId) : void 0;
		const nextKey = isRecord(event) ? readMessageIdempotencyKey(event.message) : null;
		return storedKey && storedKey === nextKey ? [storedKey] : [];
	}));
	const removedKeys = [...new Set(suffixIdentityKeys.flatMap(([, key]) => key && !retainedIdempotencyKeys.has(key) ? [key] : []))];
	if (removedKeys.length === 0) return {
		suffixIdentityKeys,
		replacementByIdempotencyKey: []
	};
	const extractedKey = sql`CASE
    WHEN json_valid(${transcriptEventNavigationSql("event")})
      AND json_type(${transcriptEventNavigationSql("event")}, '$.message.idempotencyKey') = 'text'
    THEN trim(json_extract(${transcriptEventNavigationSql("event")}, '$.message.idempotencyKey'), ${" 	\n\r\f\v\xA0            \u2028\u2029  　﻿"})
  END`;
	return {
		suffixIdentityKeys,
		replacementByIdempotencyKey: executeSqliteQuerySync(params.database.db, db.with("candidates", (query) => query.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.event_id",
			"identity.seq",
			extractedKey.as("idempotency_key")
		]).where("identity.session_id", "=", params.resolved.sessionId).where("identity.seq", "<", params.startSeq).where("identity.message_idempotency_key", "is", null).where(extractedKey, "in", removedKeys)).with("latest", (query) => query.selectFrom("candidates").select(["idempotency_key", sql`max(seq)`.as("seq")]).groupBy("idempotency_key")).selectFrom("candidates").innerJoin("latest", (join) => join.onRef("latest.idempotency_key", "=", "candidates.idempotency_key").onRef("latest.seq", "=", "candidates.seq")).select(["candidates.event_id", "candidates.idempotency_key"])).rows.map((row) => [row.idempotency_key, row.event_id])
	};
}
//#endregion
//#region src/config/sessions/session-transcript-suffix-projection.ts
function prepareTranscriptIndexProjection(events, seqByIndex, createdAtByIndex) {
	const tree = scanSessionTranscriptTree(events);
	const visibleIndexes = tree.nodes.length > 0 ? selectSessionTranscriptTreePathNodes(tree, tree.leafId).map((node) => node.index) : tree.hasLeafControl ? [] : events.map((_event, index) => index);
	const activeRows = [];
	let activeMessageCount = 0;
	for (const index of visibleIndexes) {
		const event = events[index];
		if (!shouldProjectActiveEvent(event)) continue;
		const messagePosition = hasTranscriptMessage(event) ? activeMessageCount++ : null;
		const createdAt = createdAtByIndex[index] ?? Date.now();
		const ftsEntry = extractTranscriptIndexEntry(event, createdAt);
		activeRows.push({
			activePosition: activeRows.length,
			contextEligible: transcriptEventContextEligibility(event),
			eventSeq: seqByIndex[index] ?? index,
			messagePosition,
			...ftsEntry ? { ftsEntry } : {}
		});
	}
	return {
		activeMessageCount,
		activeRows,
		indexedSeq: seqByIndex.at(-1) ?? -1,
		leafEventId: tree.appendParentId
	};
}
function prepareFullTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents) {
	const expectedRows = readTranscriptStorageRows(database, resolved.sessionId);
	const expected = expectedEvents.map(canonicalizeTranscriptEventMedia);
	const next = nextEvents.map(canonicalizeTranscriptEventMedia);
	const expectedJson = expected.map((event) => JSON.stringify(event));
	if (expectedRows.length !== expectedJson.length || expectedRows.some((row, index) => row.eventJson !== expectedJson[index])) throw new Error(`SQLite transcript changed while preparing suffix removal for ${resolved.sessionId}`);
	const nextJson = next.map((event) => JSON.stringify(event));
	let prefixLength = 0;
	while (prefixLength < expectedJson.length && prefixLength < nextJson.length && expectedJson[prefixLength] === nextJson[prefixLength]) prefixLength += 1;
	if (!(prefixLength === expectedJson.length && prefixLength === nextJson.length) && (next.length > expected.length || prefixLength === 0)) throw new Error(`Transcript mutation is not a bounded suffix removal for ${resolved.sessionId}`);
	const startSeq = expectedRows[prefixLength]?.seq ?? (expectedRows.at(-1)?.seq ?? -1) + 1;
	const nextSeqByIndex = next.map((_event, index) => index < prefixLength ? expectedRows[index]?.seq ?? index : startSeq + index - prefixLength);
	const previousProjection = prepareTranscriptIndexProjection(expected, expectedRows.map((row) => row.seq), expectedRows.map((row) => row.createdAt));
	const storedCreatedAtByEventId = new Map(expected.flatMap((event, index) => {
		const eventId = readTranscriptEventId(event);
		const createdAt = expectedRows[index]?.createdAt;
		return eventId && createdAt !== void 0 ? [[eventId, createdAt]] : [];
	}));
	const nextCreatedAt = next.map((event, index) => {
		if (index < prefixLength) return expectedRows[index]?.createdAt ?? Date.now();
		const eventId = readTranscriptEventId(event);
		return (eventId ? storedCreatedAtByEventId.get(eventId) : void 0) ?? readEventTimestamp(event) ?? Date.now();
	});
	return {
		expectedRows,
		next,
		nextCreatedAt,
		nextProjection: prepareTranscriptIndexProjection(next, nextSeqByIndex, nextCreatedAt),
		prefixLength,
		previousProjection,
		startSeq
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-suffix.ts
function readTranscriptSuffixStorageRows(database, sessionId, startSeq, expectedRows, retainedCustomDataIds) {
	return executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select([
		"created_at",
		projectTranscriptRetainedDataSql(transcriptEventJsonSql(database.db), retainedCustomDataIds).as("event_json"),
		"seq"
	]).where("session_id", "=", sessionId).where("seq", ">=", startSeq).orderBy("seq", "asc").limit(expectedRows + 1)).rows.map((row) => ({
		createdAt: row.created_at,
		eventJson: row.event_json,
		seq: row.seq
	}));
}
function verifyIncrementalPlanningFence(database, resolved, expectedMutationAt) {
	if (readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt !== expectedMutationAt) throw new Error(`SQLite transcript changed while planning suffix removal for ${resolved.sessionId}`);
}
function prepareIncrementalTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents, persistedPrefixLength, expectedMutationAt, eventsStartAtPersistedPrefix = false, retainedCustomDataIds = []) {
	const expectedTail = (eventsStartAtPersistedPrefix ? expectedEvents : expectedEvents.slice(persistedPrefixLength)).map(canonicalizeTranscriptEventMedia);
	const nextTail = (eventsStartAtPersistedPrefix ? nextEvents : nextEvents.slice(persistedPrefixLength)).map(canonicalizeTranscriptEventMedia);
	if (expectedTail.length > 4e3 || nextTail.length > 4e3) throw new Error(`Transcript suffix exceeds synchronous planning row limit for ${resolved.sessionId}`);
	const expectedJson = expectedTail.map((event) => JSON.stringify(event));
	const nextJson = nextTail.map((event) => JSON.stringify(event));
	let bytes = 0;
	for (const json of [...expectedJson, ...nextJson]) {
		bytes += Buffer.byteLength(json, "utf8");
		if (bytes > 4194304) throw new Error(`Transcript suffix exceeds synchronous planning byte limit for ${resolved.sessionId}`);
	}
	let localPrefixLength = 0;
	while (localPrefixLength < expectedJson.length && localPrefixLength < nextJson.length && expectedJson[localPrefixLength] === nextJson[localPrefixLength]) localPrefixLength += 1;
	if (nextTail.length > expectedTail.length) throw new Error(`Transcript mutation is not a bounded suffix removal for ${resolved.sessionId}`);
	const currentMutationAt = readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt;
	if (expectedMutationAt !== void 0 && currentMutationAt !== expectedMutationAt) throw new Error(`SQLite transcript changed while preparing suffix removal for ${resolved.sessionId}`);
	const db = getSessionKysely(database.db);
	const storedTail = readTranscriptSuffixStorageRows(database, resolved.sessionId, persistedPrefixLength, expectedTail.length, retainedCustomDataIds);
	if (storedTail.length !== expectedJson.length || storedTail.some((row, index) => row.eventJson !== expectedJson[index])) throw new Error(`SQLite transcript changed while preparing suffix removal for ${resolved.sessionId}`);
	const expectedRows = storedTail.slice(localPrefixLength);
	const next = nextTail.slice(localPrefixLength);
	const startSeq = expectedRows[0]?.seq ?? (storedTail.at(-1)?.seq ?? persistedPrefixLength - 1) + 1;
	const storedCreatedAtByEventId = new Map(expectedTail.flatMap((event, index) => {
		const eventId = readTranscriptEventId(event);
		const createdAt = storedTail[index]?.createdAt;
		return eventId && createdAt !== void 0 ? [[eventId, createdAt]] : [];
	}));
	const nextCreatedAt = next.map((event) => {
		const eventId = readTranscriptEventId(event);
		return (eventId ? storedCreatedAtByEventId.get(eventId) : void 0) ?? readEventTimestamp(event) ?? Date.now();
	});
	const idempotencyMutation = prepareIncrementalSuffixIdempotencyMutation({
		database,
		expectedRows,
		next,
		resolved,
		startSeq
	});
	const projectionWasHealthy = !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId);
	const suffix = {
		expectedRows,
		next,
		nextCreatedAt,
		prefixLength: 0,
		startSeq
	};
	const prepareReconciledMutation = () => {
		verifyIncrementalPlanningFence(database, resolved, currentMutationAt);
		return {
			...suffix,
			incremental: {
				expectedMutationAt: currentMutationAt,
				projectionWasHealthy: false,
				removedMessageIds: [],
				retainedActiveCount: 0,
				...idempotencyMutation
			},
			nextProjection: {
				activeMessageCount: 0,
				activeRows: [],
				indexedSeq: startSeq - 1,
				leafEventId: null
			}
		};
	};
	if (!projectionWasHealthy) return prepareReconciledMutation();
	const anchorId = parseSessionTranscriptTreeEntry(next[0])?.parentId ?? parseSessionTranscriptTreeEntry(expectedTail[localPrefixLength])?.parentId ?? null;
	const anchor = anchorId ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select(["active.active_position", "identity.event_id"]).where("identity.session_id", "=", resolved.sessionId).where("identity.event_id", "=", anchorId)) : void 0;
	const knownRelativeIds = new Set(anchorId ? [anchorId] : []);
	const suffixRedirectsOutsideProjection = next.some((event) => {
		const treeEntry = parseSessionTranscriptTreeEntry(event);
		if (!treeEntry) return false;
		const redirectsOutside = treeEntry.parentId === null || !knownRelativeIds.has(treeEntry.parentId) || isSessionTranscriptLeafControl(event) && treeEntry.appendParentId !== null && !knownRelativeIds.has(treeEntry.appendParentId);
		knownRelativeIds.add(treeEntry.id);
		return redirectsOutside;
	});
	if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_active_events").select("event_seq").where("session_id", "=", resolved.sessionId).where("event_seq", "=", startSeq)) || !anchorId || !anchor || suffixRedirectsOutsideProjection) return prepareReconciledMutation();
	const retainedActiveCount = anchor.active_position + 1;
	const activeSuffixRows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select(["active.message_position", "identity.event_id"]).where("identity.session_id", "=", resolved.sessionId).where("active.active_position", ">=", retainedActiveCount).limit(SYNC_REBUILD_MAX_ROWS + 1)).rows;
	if (activeSuffixRows.length > 4e3) throw new Error(`Transcript active suffix exceeds synchronous planning row limit for ${resolved.sessionId}`);
	const removedMessageIds = activeSuffixRows.flatMap((row) => row.message_position === null ? [] : [row.event_id]);
	const retainedMessagePosition = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", resolved.sessionId).where("active_position", "<", retainedActiveCount).where("message_position", "is not", null).orderBy("active_position", "desc").limit(1))?.message_position;
	const retainedMessageCount = retainedMessagePosition === null || retainedMessagePosition === void 0 ? 0 : retainedMessagePosition + 1;
	const projectionEvents = [{
		type: "custom",
		id: anchorId,
		parentId: null
	}, ...next];
	const relativeProjection = prepareTranscriptIndexProjection(projectionEvents, projectionEvents.map((_event, index) => startSeq + index - 1), [Date.now(), ...nextCreatedAt]);
	const activeRows = [];
	for (const row of relativeProjection.activeRows) {
		if (row.eventSeq < startSeq) continue;
		activeRows.push({
			...row,
			activePosition: retainedActiveCount + activeRows.length,
			messagePosition: row.messagePosition === null ? null : retainedMessageCount + row.messagePosition
		});
	}
	const addedMessages = activeRows.filter((row) => row.messagePosition !== null).length;
	verifyIncrementalPlanningFence(database, resolved, currentMutationAt);
	return {
		...suffix,
		incremental: {
			expectedMutationAt: currentMutationAt,
			projectionWasHealthy,
			removedMessageIds,
			retainedActiveCount,
			...idempotencyMutation
		},
		nextProjection: {
			activeMessageCount: retainedMessageCount + addedMessages,
			activeRows,
			indexedSeq: next.length > 0 ? startSeq + next.length - 1 : startSeq - 1,
			leafEventId: relativeProjection.leafEventId
		}
	};
}
/** Plans bounded suffix work before the synchronous SQLite write transaction. */
function prepareSqliteTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents, persistedPrefixLength = 0, expectedMutationAt, eventsStartAtPersistedPrefix = false, retainedCustomDataIds = []) {
	if (persistedPrefixLength > 0 || eventsStartAtPersistedPrefix) return {
		...prepareIncrementalTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents, persistedPrefixLength, expectedMutationAt, eventsStartAtPersistedPrefix, retainedCustomDataIds),
		retainedCustomDataIds
	};
	return prepareFullTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents);
}
/** Mutates an exact transcript suffix while retaining a healthy materialized projection. */
function replaceSqliteTranscriptSuffixInTransaction(database, resolved, plan, projection = {}) {
	const db = getSessionKysely(database.db);
	if (plan.incremental && readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt !== plan.incremental.expectedMutationAt) throw new Error(`SQLite transcript changed while preparing suffix removal for ${resolved.sessionId}`);
	const retainedCustomDataIds = plan.retainedCustomDataIds ?? [];
	const storedRows = plan.incremental ? readTranscriptSuffixStorageRows(database, resolved.sessionId, plan.startSeq, plan.expectedRows.length, retainedCustomDataIds) : readTranscriptStorageRows(database, resolved.sessionId);
	if (storedRows.length !== plan.expectedRows.length || storedRows.some((row, index) => {
		const expected = plan.expectedRows[index];
		return expected === void 0 || row.seq !== expected.seq || row.createdAt !== expected.createdAt || row.eventJson !== expected.eventJson;
	})) throw new Error(`SQLite transcript changed while preparing suffix removal for ${resolved.sessionId}`);
	if (plan.expectedRows.length === 0 && plan.next.length === 0) return;
	const projectionIsHealthy = plan.incremental?.projectionWasHealthy !== false && !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId);
	const suffixIdentityKeys = new Map(plan.incremental?.suffixIdentityKeys ?? executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities").select(["event_id", "message_idempotency_key"]).where("session_id", "=", resolved.sessionId).where("seq", ">=", plan.startSeq)).rows.map((row) => [row.event_id, row.message_idempotency_key]));
	const insertEvents = plan.incremental ? plan.next : plan.next.slice(plan.prefixLength);
	const insertCreatedAt = plan.incremental ? plan.nextCreatedAt : plan.nextCreatedAt.slice(plan.prefixLength);
	const retainedIdempotencyKeys = new Set(insertEvents.flatMap((event) => {
		const eventId = readTranscriptEventId(event);
		const storedKey = eventId ? suffixIdentityKeys.get(eventId) : void 0;
		const nextKey = isRecord(event) ? readMessageIdempotencyKey(event.message) : null;
		return storedKey && storedKey === nextKey ? [storedKey] : [];
	}));
	const stagedData = stageRetainedTranscriptData(database, resolved.sessionId, plan.expectedRows, insertEvents, retainedCustomDataIds);
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", resolved.sessionId).where("seq", ">=", plan.startSeq));
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", resolved.sessionId).where("seq", ">=", plan.startSeq).$if(stagedData !== void 0, (query) => query.where("seq", "<", stagedData.startSeq)));
	insertTranscriptRowsWithoutProjectionInTransaction(database, resolved.sessionId, insertEvents.map((event, index) => {
		const seq = plan.startSeq + index;
		const createdAt = insertCreatedAt[index] ?? Date.now();
		const eventId = readTranscriptEventId(event);
		const storedKey = eventId ? suffixIdentityKeys.get(eventId) : void 0;
		const nextKey = isRecord(event) ? readMessageIdempotencyKey(event.message) : null;
		const storedEventSeq = stagedData?.sources.get(index);
		const row = {
			event,
			seq,
			createdAt
		};
		if (storedEventSeq !== void 0) row.storedEventSeq = storedEventSeq;
		if (storedKey && storedKey === nextKey) row.messageIdempotencyKey = storedKey;
		return row;
	}), retainedIdempotencyKeys);
	pruneTranscriptReactionsInTransaction(database, resolved, [...suffixIdentityKeys.keys()]);
	if (stagedData) executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", resolved.sessionId).where("seq", ">=", stagedData.startSeq));
	const removedIdempotencyKeys = new Set([...suffixIdentityKeys.values()].filter((key) => key !== null && !retainedIdempotencyKeys.has(key)));
	const replacementByIdempotencyKey = plan.incremental ? new Map(plan.incremental.replacementByIdempotencyKey) : /* @__PURE__ */ new Map();
	if (!plan.incremental && removedIdempotencyKeys.size > 0) {
		const unownedPrefixRows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([transcriptEventNavigationSql("event").as("event_json"), "identity.event_id"]).where("identity.session_id", "=", resolved.sessionId).where("identity.seq", "<", plan.startSeq).where("identity.message_idempotency_key", "is", null).orderBy("identity.seq", "desc")).rows;
		for (const row of unownedPrefixRows) {
			const event = JSON.parse(row.event_json);
			const key = readMessageIdempotencyKey(event.message);
			if (key && removedIdempotencyKeys.has(key) && !replacementByIdempotencyKey.has(key)) replacementByIdempotencyKey.set(key, row.event_id);
		}
	}
	for (const key of removedIdempotencyKeys) {
		const currentOwner = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("event_id").where("session_id", "=", resolved.sessionId).where("message_idempotency_key", "=", key).limit(1));
		const replacementEventId = replacementByIdempotencyKey.get(key);
		if (!currentOwner && replacementEventId) executeSqliteQuerySync(database.db, db.updateTable("transcript_event_identities").set({ message_idempotency_key: key }).where("session_id", "=", resolved.sessionId).where("event_id", "=", replacementEventId));
	}
	rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	if (projectionIsHealthy) replaceSessionTranscriptIndexSuffixInTransaction(database.db, resolved.sessionId, {
		unchangedBeforeSeq: plan.startSeq,
		...plan.previousProjection ? { previous: plan.previousProjection } : {},
		next: plan.nextProjection,
		...plan.incremental ? {
			removedMessageIds: plan.incremental.removedMessageIds,
			retainedActiveCount: plan.incremental.retainedActiveCount
		} : {}
	});
	else {
		markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
		projection.onProjectionReconcileNeeded?.();
		scheduleTranscriptProjectionReconcile(database, resolved.sessionId, true, projection);
	}
	touchTranscriptMutationInTransaction(database, resolved.sessionId);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-suffix-write.ts
/** Replaces an exact transcript suffix synchronously and rotates its cursor generation. */
function replaceTranscriptSuffixEventsSync(scope, expectedEvents, nextEvents, prefixLength = 0, expectedMutationAt, captureVersionInTransaction, eventsStartAtPersistedPrefix = false, retainedCustomDataIds = [], admit, projection) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const owner = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	assertSessionTranscriptHot(owner.db, resolved.sessionId);
	const plan = prepareSqliteTranscriptSuffixMutation(owner, resolved, expectedEvents, nextEvents, prefixLength, expectedMutationAt, eventsStartAtPersistedPrefix, retainedCustomDataIds);
	let replaced = false;
	runOpenClawAgentWriteTransaction((database) => {
		admit?.("transaction");
		assertOwnedTranscriptWriteCommit(fencedScope);
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!transcriptWriteScopeIsCurrent(fresh?.entry, resolved.sessionId, fencedScope)) return;
		replaceSqliteTranscriptSuffixInTransaction(database, resolved, plan, projection);
		const committedVersion = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
		if (captureVersionInTransaction && !stageSqliteTransactionState(database.db, {
			stage: () => {},
			rollback: () => {},
			commit: () => captureVersionInTransaction(committedVersion)
		})) throw new Error("Transcript suffix replacement requires committed transaction state");
		admit?.("commit");
		replaced = true;
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.replace-suffix" });
	if (fencedScope.expectedWriterRunId !== void 0 && !replaced) throw new SessionTranscriptWriterClaimReboundError();
	return replaced;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-write.ts
async function replaceTranscriptEvents(scope, events) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			replaceSqliteTranscriptEventsInTransaction(database, resolved, events);
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.replace" });
	}, "session.transcript.replace");
}
/** Replaces the active session identity and its prepared branch in one commit. */
async function replaceSessionWithBranchedTranscript(scope, branch, onCommitted, assertActive) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...fencedScope,
		sessionId: resolved.sessionId
	});
	const databaseOptions = toDatabaseOptions(resolved);
	const expectedLifecycleRevision = readSessionEntryRow(openOpenClawAgentDatabase(databaseOptions), resolved.sessionKey)?.entry.lifecycleRevision;
	const nextScope = {
		...fencedScope,
		sessionId: branch.sessionId
	};
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		assertActive?.();
		const committed = runOpenClawAgentWriteTransaction((database) => {
			assertActive?.();
			const result = replaceSessionWithBranchedTranscriptInTransaction(database, fencedScope, branch, expectedLifecycleRevision, assertActive);
			return {
				version: result.version,
				publish: prepareSessionIdentityPublication(database, resolved.agentId, result.identity.previous, result.identity.current)
			};
		}, databaseOptions, { operationLabel: "session.transcript.branch" });
		try {
			onCommitted(nextScope, committed.version);
		} finally {
			committed.publish();
		}
	}, "session.transcript.branch");
}
/** One transaction kernel for the retained adapter and the canonical worker. */
function replaceSessionWithBranchedTranscriptInTransaction(database, scope, branch, expectedLifecycleRevision, assertActive, projection) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const nextScope = {
		...fencedScope,
		sessionId: branch.sessionId
	};
	const nextResolved = {
		...resolved,
		sessionId: branch.sessionId
	};
	const fresh = readSessionEntryRow(database, resolved.sessionKey)?.entry;
	if (fresh?.sessionId !== resolved.sessionId || fresh.lifecycleRevision !== expectedLifecycleRevision) {
		const cause = {
			...fresh ? {
				actualSessionId: fresh.sessionId,
				code: "session-rebound"
			} : { code: "session-entry-missing" },
			expectedSessionId: resolved.sessionId,
			sessionKey: scope.sessionKey
		};
		throw new Error(`Branched session was not persisted: ${cause.code}`, { cause });
	}
	assertLockedTranscriptWriteAllowed(database, resolved, fencedScope);
	const identityKeys = collectSessionEntryLookupKeys(resolved.sessionKey);
	const previous = readSessionIdentitySnapshot(database, identityKeys);
	writeSessionEntry(database, resolved.sessionKey, {
		...projectCanonicalSessionEntryShape({ ...fresh }),
		sessionId: branch.sessionId,
		updatedAt: Date.now()
	});
	assertLockedTranscriptWriteAllowed(database, nextResolved, nextScope);
	replaceSqliteTranscriptEventsInTransaction(database, nextResolved, branch.events, projection);
	assertActive?.();
	return {
		identity: {
			previous,
			current: readSessionIdentitySnapshot(database, identityKeys)
		},
		version: readTranscriptContextVersionInTransaction(database, nextResolved.sessionId)
	};
}
/** Rewrites exact transcript rows after atomically validating their generation and bytes. */
async function rewriteTranscriptEventRowsExact(scope, params) {
	if (params.rows.length === 0) return null;
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => {
		const currentGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId) ?? null;
		const initialGenerationMaterialized = params.allowInitialGenerationMaterialization === true && params.expectedGeneration === null;
		if (currentGeneration !== params.expectedGeneration && !initialGenerationMaterialized) return null;
		rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, params.rows);
		const generation = readTranscriptGenerationInTransaction(database, resolved.sessionId);
		return generation ? { generation } : null;
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.rewrite-exact" }), "session.transcript.rewrite-exact");
}
/** Fully replaces rows for one transcript synchronously for sync session runtimes. */
function replaceTranscriptEventsSync(scope, events) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const replaced = runOpenClawAgentWriteTransaction((database) => {
		assertOwnedTranscriptWriteCommit(fencedScope);
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!transcriptWriteScopeIsCurrent(fresh?.entry, resolved.sessionId, fencedScope)) return false;
		replaceSqliteTranscriptEventsInTransaction(database, resolved, events);
		return true;
	}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.replace" });
	if (fencedScope.expectedWriterRunId !== void 0 && !replaced) throw new SessionTranscriptWriterClaimReboundError();
	return replaced;
}
async function trimTranscriptForManualCompact(scope, selectRetainedLines, options = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const snapshotRows = readTranscriptEventRows(database, resolved.sessionId);
		const sessionSnapshot = readSessionEntrySelectionSnapshot(database, resolved.sessionKey, true);
		const retainedLines = selectRetainedLines(snapshotRows.map((row) => row.eventJson));
		if (!retainedLines) return { trimmed: false };
		if (sessionSnapshot[0]?.entry.sessionId !== resolved.sessionId) throw new Error(`Cannot compact SQLite transcript ${resolved.sessionId} without its current session entry`);
		const retainedEvents = retainedLines.map((line) => JSON.parse(line));
		runOpenClawAgentWriteTransaction((writeDatabase) => {
			assertSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotRows);
			const freshSessionSnapshot = readSessionEntrySelectionSnapshot(writeDatabase, resolved.sessionKey, true);
			assertLifecycleTargetSnapshotUnchanged(sessionSnapshot, freshSessionSnapshot, "session.transcript.manual-compact");
			const freshEntry = freshSessionSnapshot[0]?.entry;
			if (!freshEntry || freshEntry.sessionId !== resolved.sessionId) throw new Error(`SQLite session changed before compacting ${resolved.sessionId}`);
			const identityKeys = collectSessionEntryLookupKeys(resolved.sessionKey);
			const previousIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
			replaceSqliteTranscriptEventsInTransaction(writeDatabase, resolved, retainedEvents);
			const nextEntry = structuredClone(freshEntry);
			delete nextEntry.contextBudgetStatus;
			Object.assign(nextEntry, COMPACTION_RUN_USAGE_CLEAR_PATCH);
			delete nextEntry.totalTokens;
			delete nextEntry.totalTokensFresh;
			delete nextEntry.totalTokensVersion;
			clearAllCliSessions(nextEntry);
			nextEntry.updatedAt = options.nowMs ?? Date.now();
			writeSessionEntry(writeDatabase, resolved.sessionKey, nextEntry, { previousEntry: freshEntry });
			const currentIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
			return prepareSessionIdentityPublication(writeDatabase, resolved.agentId, previousIdentity, currentIdentity);
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.manual-compact" })();
		return {
			kept: retainedLines.length,
			trimmed: true
		};
	}, "session.transcript.compact");
}
/** Appends one raw transcript event to the additive SQLite transcript store. */
async function appendTranscriptEvent(scope, event, options = {}) {
	assertNonMessageTranscriptEvent(event);
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			options.beforeCommitInTransaction?.();
			appendTranscriptEventInTransaction(database, resolved, resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options));
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.event-append" });
	}, "session.transcript.event-append");
}
/** Appends one raw non-message transcript event synchronously for sync session runtimes. */
function appendTranscriptEventSync(scope, event, options = {}) {
	const snapshot = appendTranscriptEventSnapshotSync(scope, event, options);
	return snapshot.ok ? ok(snapshot.value.result.appended) : snapshot;
}
function appendTranscriptEventSnapshotSync(scope, event, options = {}, projection, view) {
	assertNonMessageTranscriptEvent(event);
	return runTranscriptWriteSnapshotSync(scope, (database, resolved) => {
		const resolvedEvent = resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options);
		if (appendTranscriptEventInTransaction(database, resolved, resolvedEvent, {
			...projection,
			eventJson: resolvedEvent === event ? projection?.eventJson : void 0
		}) === false) return { appended: false };
		if (isRecord(resolvedEvent) && "parentId" in resolvedEvent && (resolvedEvent.parentId === null || typeof resolvedEvent.parentId === "string")) return {
			appended: true,
			effectiveParentId: resolvedEvent.parentId
		};
		return { appended: true };
	}, options.beforeCommitInTransaction, options.expectedMutationAt, view, { eventType: isRecord(event) && typeof event.type === "string" ? event.type : "unknown" });
}
async function appendTranscriptMessage(scope, options) {
	return await withTranscriptWriteLock(scope, (transcript) => transcript.appendMessage(options));
}
/** Appends one transcript message synchronously for sync session runtimes. */
function appendTranscriptMessageSync(scope, options) {
	const snapshot = appendTranscriptMessageSnapshotSync(scope, options);
	return snapshot.ok ? ok(snapshot.value.result) : snapshot;
}
function appendTranscriptMessageSnapshotSync(scope, options, preparedMessage, workerOptions, view) {
	const snapshot = runTranscriptWriteSnapshotSync(scope, (database, resolved) => {
		const result = appendTranscriptMessageInTransaction(database, resolved, workerOptions?.messageAlreadyRedacted ? {
			...options,
			messageAlreadyRedacted: true
		} : options, preparedMessage, workerOptions);
		return {
			result,
			visibleTailEntryId: result ? readTranscriptVisibleTailEntryIdInTransaction(database, resolved.sessionId, result.messageId) : null
		};
	}, void 0, options.expectedMutationAt, view, {
		eventType: "message",
		messageRole: isRecord(options.message) && typeof options.message.role === "string" ? options.message.role : "unknown"
	});
	if (!snapshot.ok) return snapshot;
	return ok({
		...snapshot.value,
		result: snapshot.value.result.result,
		visibleTail: {
			entryId: snapshot.value.result.visibleTailEntryId,
			generation: snapshot.value.after.generation
		}
	});
}
/** Runs read/append transcript work under one SQLite writer-queue critical section. */
async function withTranscriptWriteLock(scope, run) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...fencedScope,
		sessionId: resolved.sessionId
	});
	const databaseOptions = toDatabaseOptions(resolved);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let transcriptSnapshot;
		return await run({
			readEvents: async () => {
				const database = openOpenClawAgentDatabase(databaseOptions);
				const snapshot = readTranscriptSnapshot(database, resolved.sessionId);
				transcriptSnapshot = {
					kind: "current",
					rows: snapshot.rows
				};
				return snapshot.events;
			},
			readMessageFacts: async (params) => readTranscriptMirrorFacts(openOpenClawAgentDatabase(databaseOptions), resolved, params),
			replaceEvents: async (events) => {
				if (transcriptSnapshot?.kind === "stale") throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
				const expectedSnapshot = transcriptSnapshot?.rows;
				transcriptSnapshot = {
					kind: "current",
					rows: runOpenClawAgentWriteTransaction((writeDatabase) => {
						assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
						if (expectedSnapshot !== void 0) assertSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, expectedSnapshot);
						replaceSqliteTranscriptEventsInTransaction(writeDatabase, resolved, events);
						const nextRows = readTranscriptEventRows(writeDatabase, resolved.sessionId);
						assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
						return nextRows;
					}, databaseOptions, { operationLabel: "session.transcript.locked-replace" })
				};
			},
			appendMessage: async (options) => {
				let result;
				const snapshotState = transcriptSnapshot;
				let nextSnapshotState = snapshotState;
				runOpenClawAgentWriteTransaction((writeDatabase) => {
					assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
					const snapshotStillCurrent = snapshotState?.kind === "current" ? isSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotState.rows) : false;
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					if (snapshotState?.kind === "current") nextSnapshotState = snapshotStillCurrent ? {
						kind: "current",
						rows: readTranscriptEventRows(writeDatabase, resolved.sessionId)
					} : { kind: "stale" };
					assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
				}, databaseOptions, { operationLabel: "session.transcript.locked-append" });
				transcriptSnapshot = nextSnapshotState;
				return result;
			},
			appendMessageWithMessageSequence: async (options) => {
				let result;
				let lifecycleRevision;
				let messageSeq;
				runOpenClawAgentWriteTransaction((writeDatabase) => {
					lifecycleRevision = assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope)?.lifecycleRevision;
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					if (result) {
						rememberCommittedTranscriptMessageSequencesInTransaction(writeDatabase, resolved.sessionId, [result]);
						messageSeq = readCommittedTranscriptMessageSequence(result);
					}
					assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
				}, databaseOptions, { operationLabel: "session.transcript.locked-sequenced-append" });
				return {
					lifecycleRevision,
					...messageSeq !== void 0 ? { messageSeq } : {},
					result
				};
			}
		});
	}, "session.transcript.locked-write");
}
/** Runs synchronous transcript work under one writer queue and SQLite transaction. */
async function withTranscriptWriteTransaction(scope, run) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction(() => run({
		agentId: resolved.agentId,
		sessionId: resolved.sessionId,
		sessionKey: resolved.sessionKey,
		storePath: resolved.path ?? scope.storePath ?? resolveOpenClawAgentSqlitePath({
			agentId: resolved.agentId,
			env: resolved.env
		})
	}), toDatabaseOptions(resolved), { operationLabel: "session.transcript.batch" }), "session.transcript.batch");
}
function isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	const current = readTranscriptEventRows(database, sessionId);
	return current.length === expected.length && current.every((row, index) => row.seq === expected[index]?.seq && row.eventJson === expected[index]?.eventJson);
}
function assertSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	if (!isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected)) throw new SqliteTranscriptMutationConflictError(sessionId);
}
//#endregion
export { SESSION_ENTRY_PRIVATE_CLEAR_PATCH as _, appendTranscriptMessageSnapshotSync as a, projectPublicSessionEntryPatch as b, replaceSessionWithBranchedTranscriptInTransaction as c, rewriteTranscriptEventRowsExact as d, trimTranscriptForManualCompact as f, COMPACTION_RUN_USAGE_CLEAR_PATCH as g, replaceTranscriptSuffixEventsSync as h, appendTranscriptMessage as i, replaceTranscriptEvents as l, withTranscriptWriteTransaction as m, appendTranscriptEventSnapshotSync as n, appendTranscriptMessageSync as o, withTranscriptWriteLock as p, appendTranscriptEventSync as r, replaceSessionWithBranchedTranscript as s, appendTranscriptEvent as t, replaceTranscriptEventsSync as u, projectCompactionAccountingPatch as v, projectPublicSessionEntry as y };
