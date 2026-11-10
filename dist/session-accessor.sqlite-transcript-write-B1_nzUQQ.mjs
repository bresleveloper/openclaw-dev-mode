import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as hasSqlitePostCommitScope, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as runOpenClawAgentWriteTransaction, i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { c as transcriptEventJsonSql, d as transcriptEventNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, o as parseSessionTranscriptTreeEntry, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-D61jhi_i.mjs";
import { a as transcriptEventContextEligibility, i as shouldProjectActiveEvent, n as hasTranscriptMessage, t as extractTranscriptIndexEntry } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
import { t as canonicalizeTranscriptEventMedia } from "./transcript-event-media-C4aKs47S.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope, s as resolveSqliteTranscriptScope, u as transcriptWriteScopeIsCurrent } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { i as withTranscriptLockSettlement } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { d as sessionTranscriptIndexNeedsReconcile, l as replaceSessionTranscriptIndexSuffixInTransaction, n as SYNC_REBUILD_MAX_ROWS, s as markSessionTranscriptIndexDirtyInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import { r as scheduleTranscriptProjectionReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as rewriteSqliteTranscriptEventRowsInTransaction, i as replaceSqliteTranscriptEventsInTransaction, r as insertTranscriptRowsWithoutProjectionInTransaction, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { _ as readSessionIdentitySnapshot, a as writeSessionEntry } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { p as resolveSessionPendingInputAppend } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { a as pruneTranscriptReactionsInTransaction, c as readTranscriptContextVersionInTransaction, d as rotateTranscriptGenerationInTransaction, f as touchTranscriptMutationInTransaction, l as readTranscriptGenerationInTransaction, u as readTranscriptMutationStateInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { A as readTranscriptVisibleTailEntryIdInTransaction, E as readTranscriptStorageRows, _ as readTranscriptEventId, j as resolveTranscriptEventAppendParent, m as readEventTimestamp, o as isSqliteTranscriptSnapshotUnchanged, t as assertSqliteTranscriptSnapshotUnchanged, w as readTranscriptSnapshot, y as readTranscriptEventRows } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { n as projectTranscriptRetainedDataSql, r as stageRetainedTranscriptData } from "./session-transcript-retained-data-hvf1GT7-.mjs";
import { l as readTranscriptAppendPostimage, u as retainTranscriptAppendPostimage } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion, t as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as assertNonMessageTranscriptEvent, r as resolveTranscriptAppendRefusal, t as assertLockedTranscriptWriteAllowed } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { t as readTranscriptMirrorFacts } from "./session-accessor.sqlite-transcript-mirror-mjIndN8p.mjs";
import { i as rememberCommittedTranscriptMessageSequencesInTransaction, n as readCommittedTranscriptMessageSequence } from "./session-accessor.sqlite-transcript-sequences-B5FCjqGn.mjs";
import { t as assertLegacyTranscriptPreparation } from "./session-transcript-preparation-HBORI9r1.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-transcript-write-snapshot.ts
/** Prepare without holding a transaction; fresh inserts recheck their original snapshot. */
async function prepareNativeLockedAppend(scope, options) {
	const { preparation, prepareMessageAfterIdempotencyCheckAsync, ...legacy } = options;
	const prepare = preparation?.prepareMessage ?? prepareMessageAfterIdempotencyCheckAsync;
	const retained = {
		...legacy,
		...preparation?.source ? { beforeFreshMessageCommit: preparation.source } : {}
	};
	if (preparation && (options.prepareMessageAfterIdempotencyCheck || options.beforeFreshMessageCommit)) throw new Error("Choose preparation or the legacy transcript callback form, not both.");
	if (!prepare) return () => retained;
	const resolved = resolveSqliteTranscriptScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const identity = readOpenClawAgentDatabaseIdentity(database);
	const version = { ...readTranscriptContextVersionInTransaction(database, resolved.sessionId) };
	const key = readMessageIdempotencyKey(options.message);
	const fresh = !(key && options.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, resolved, key, options.idempotencyLookup) : void 0) && !resolveSessionPendingInputAppend(database, resolved, options.message);
	const message = fresh ? await prepare(options.message) : options.message;
	return (current) => {
		const physical = readOpenClawAgentDatabaseIdentity(current);
		if (physical.identity !== identity.identity || physical.birthtime !== identity.birthtime) throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
		return {
			...retained,
			prepareMessageAfterIdempotencyCheck: () => {
				const next = readTranscriptContextVersionInTransaction(current, resolved.sessionId);
				if (!fresh || next.generation !== version.generation || next.rawSeq !== version.rawSeq || next.updatedAt !== version.updatedAt) throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
				return message;
			}
		};
	};
}
function runTranscriptWriteSnapshotSync(scope, operation, beforeCommitInTransaction, expectedMutationAt, view, diagnosticContext, transaction) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let connection;
	const write = (database) => {
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
		const postimage = readTranscriptAppendPostimage(value);
		view?.assertCurrent();
		assertOwnedTranscriptWriteCommit(fencedScope);
		return ok({
			result: value,
			lifecycleRevision,
			before,
			after: postimage?.anchor.sessionId === resolved.sessionId && getSqliteReadScopeRevision(database.db) === postimage.revision ? { ...postimage.version } : readTranscriptContextVersionInTransaction(database, resolved.sessionId)
		});
	};
	const options = toDatabaseOptions(resolved);
	let result;
	if (transaction) {
		if (getOpenClawAgentDatabaseIfOpen(options) !== transaction || !transaction.db.isTransaction) throw new Error("Transcript write lost its owning transaction");
		assertTransactionUsable(transaction.db);
		result = write(transaction);
		assertTransactionUsable(transaction.db);
	} else result = runOpenClawAgentWriteTransaction(write, options, {
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
    WHEN json_valid(${transcriptEventNavigationSql(params.database.db, "event")})
      AND json_type(${transcriptEventNavigationSql(params.database.db, "event")}, '$.message.idempotencyKey') = 'text'
    THEN trim(json_extract(${transcriptEventNavigationSql(params.database.db, "event")}, '$.message.idempotencyKey'), ${" 	\n\r\f\v\xA0            \u2028\u2029  　﻿"})
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
		projectTranscriptRetainedDataSql(database.db, transcriptEventJsonSql(database.db), retainedCustomDataIds).as("event_json"),
		"seq"
	]).where("session_id", "=", sessionId).where("seq", ">=", startSeq).orderBy("seq", "asc").limit(expectedRows + 1)).rows.map((row) => ({
		createdAt: row.created_at,
		eventJson: row.event_json,
		seq: row.seq
	}));
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
	if (expectedMutationAt !== void 0 && readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt !== expectedMutationAt) throw new Error(`SQLite transcript changed while preparing suffix removal for ${resolved.sessionId}`);
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
		return {
			...suffix,
			incremental: {
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
	return {
		...suffix,
		incremental: {
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
function prepareSqliteTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents, persistedPrefixLength = 0, expectedMutationAt, eventsStartAtPersistedPrefix = false, retainedCustomDataIds = []) {
	if (persistedPrefixLength > 0 || eventsStartAtPersistedPrefix) return {
		...prepareIncrementalTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents, persistedPrefixLength, expectedMutationAt, eventsStartAtPersistedPrefix, retainedCustomDataIds),
		retainedCustomDataIds
	};
	return prepareFullTranscriptSuffixMutation(database, resolved, expectedEvents, nextEvents);
}
/** Mutates an exact transcript suffix while retaining a healthy materialized projection. */
function replaceSqliteTranscriptSuffixInTransaction(database, resolved, input, projection = {}) {
	const db = getSessionKysely(database.db);
	const plan = prepareSqliteTranscriptSuffixMutation(database, resolved, input.expectedEvents, input.nextEvents, input.persistedPrefixLength, input.expectedMutationAt, input.eventsStartAtPersistedPrefix, input.retainedCustomDataIds);
	const retainedCustomDataIds = plan.retainedCustomDataIds ?? [];
	if (plan.expectedRows.length === 0 && plan.next.length === 0) return;
	const projectionIsHealthy = plan.incremental?.projectionWasHealthy ?? !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId);
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
	withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(resolved.sessionId)], () => executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", resolved.sessionId).where("seq", ">=", plan.startSeq)));
	withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(resolved.sessionId)], () => executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", resolved.sessionId).where("seq", ">=", plan.startSeq).$if(stagedData !== void 0, (query) => query.where("seq", "<", stagedData.startSeq))));
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
	if (stagedData) withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(resolved.sessionId)], () => executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", resolved.sessionId).where("seq", ">=", stagedData.startSeq)));
	const removedIdempotencyKeys = new Set([...suffixIdentityKeys.values()].filter((key) => key !== null && !retainedIdempotencyKeys.has(key)));
	const replacementByIdempotencyKey = plan.incremental ? new Map(plan.incremental.replacementByIdempotencyKey) : /* @__PURE__ */ new Map();
	if (!plan.incremental && removedIdempotencyKeys.size > 0) {
		const unownedPrefixRows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([transcriptEventNavigationSql(database.db, "event").as("event_json"), "identity.event_id"]).where("identity.session_id", "=", resolved.sessionId).where("identity.seq", "<", plan.startSeq).where("identity.message_idempotency_key", "is", null).orderBy("identity.seq", "desc")).rows;
		for (const row of unownedPrefixRows) {
			const event = JSON.parse(row.event_json);
			const key = readMessageIdempotencyKey(event.message);
			if (key && removedIdempotencyKeys.has(key) && !replacementByIdempotencyKey.has(key)) replacementByIdempotencyKey.set(key, row.event_id);
		}
	}
	for (const key of removedIdempotencyKeys) {
		const currentOwner = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("event_id").where("session_id", "=", resolved.sessionId).where("message_idempotency_key", "=", key).limit(1));
		const replacementEventId = replacementByIdempotencyKey.get(key);
		if (!currentOwner && replacementEventId) withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(resolved.sessionId)], () => executeSqliteQuerySync(database.db, db.updateTable("transcript_event_identities").set({ message_idempotency_key: key }).where("session_id", "=", resolved.sessionId).where("event_id", "=", replacementEventId)));
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
	let replaced = false;
	runOpenClawAgentWriteTransaction((database) => {
		admit?.("transaction");
		assertOwnedTranscriptWriteCommit(fencedScope);
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!transcriptWriteScopeIsCurrent(fresh?.entry, resolved.sessionId, fencedScope)) return;
		replaceSqliteTranscriptSuffixInTransaction(database, resolved, {
			expectedEvents,
			nextEvents,
			persistedPrefixLength: prefixLength,
			expectedMutationAt,
			eventsStartAtPersistedPrefix,
			retainedCustomDataIds
		}, projection);
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
/** Replaces the active session identity and branch inside the maintenance worker transaction. */
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
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
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
/** Appends one raw transcript event to the additive SQLite transcript store. */
async function appendTranscriptEvent(scope, event, options = {}) {
	assertNonMessageTranscriptEvent(event);
	const resolved = resolveSqliteTranscriptScope(scope);
	if (isMainThread && supportsOpenClawAgentDatabaseExecution(toDatabaseOptions(resolved))) {
		if (options.beforeCommitInTransaction) throw new Error("Transcript transaction callbacks require worker-local execution; use a prepared transcript event");
		const { appendTranscriptEventInWorker } = await import("./session-transcript-event-u_fFoDBI.mjs");
		return appendTranscriptEventInWorker({
			scope: captureLifecycleDatabaseScope(resolved),
			event,
			appendIntent: options.appendIntent
		});
	}
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
	await restoreSessionColdTranscript({
		...scope,
		sessionId: resolved.sessionId
	});
	return runExclusiveSqliteSessionWrite(resolved, async () => {
		return runOpenClawAgentWriteTransaction((database) => {
			options.beforeCommitInTransaction?.();
			return appendTranscriptEventInTransaction(database, resolved, resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options)) !== false;
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.event-append" });
	}, "session.transcript.event-append");
}
function appendTranscriptEventSnapshotSync(scope, event, options = {}, projection, view, transaction) {
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
	}, options.beforeCommitInTransaction, options.expectedMutationAt, view, { eventType: isRecord(event) && typeof event.type === "string" ? event.type : "unknown" }, transaction);
}
async function appendTranscriptMessage(scope, options) {
	assertLegacyTranscriptPreparation(scope, options);
	return await withTranscriptWriteSequence(scope, (transcript) => transcript.appendMessage(options));
}
/** Appends one transcript message synchronously for sync session runtimes. */
function appendTranscriptMessageSync(scope, options) {
	const snapshot = appendTranscriptMessageSnapshotSync(scope, options);
	return snapshot.ok ? ok(snapshot.value.result) : snapshot;
}
function appendTranscriptMessageSnapshotSync(scope, options, preparedMessage, workerOptions, view, transaction) {
	const snapshot = runTranscriptWriteSnapshotSync(scope, (database, resolved) => {
		const committed = appendTranscriptMessageInTransaction(database, resolved, options, preparedMessage, workerOptions);
		const result = committed?.result;
		return retainTranscriptAppendPostimage({
			result,
			visibleTailEntryId: committed?.visibleTailEntryId ?? (result ? readTranscriptVisibleTailEntryIdInTransaction(database, resolved.sessionId, result.messageId) : null)
		}, readTranscriptAppendPostimage(committed));
	}, void 0, options.expectedMutationAt, view, {
		eventType: "message",
		messageRole: isRecord(options.message) && typeof options.message.role === "string" ? options.message.role : "unknown"
	}, transaction);
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
	assertLegacyTranscriptPreparation(scope);
	return withHostTranscriptWriteLock(scope, run);
}
/** Memory sequences retain their actor; durable sequences use the existing worker route. */
async function withTranscriptWriteSequence(scope, run) {
	const assertCurrent = captureOwnedTranscriptWriteAssertion(scope);
	const authority = {
		assertCurrent,
		authorize: assertCurrent
	};
	if (!captureSessionActorStorageOwner(scope, authority)) return withHostTranscriptWriteLock(scope, run);
	const { withActorTranscriptWriteSequence } = await import("./session-actor-transcript-sequence-DNIAtJU9.mjs");
	const result = await withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		}
	}, async (memory) => ({ value: await withActorTranscriptWriteSequence(scope, memory, run) }));
	if (!result) throw new Error("Session transcript window is unavailable");
	return result.value;
}
async function withHostTranscriptWriteLock(scope, run) {
	const fenced = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fenced);
	if (!isMainThread || !supportsOpenClawAgentDatabaseExecution(toDatabaseOptions(resolved))) return runNativeTranscriptWriteLock(fenced, run);
	const captured = captureLifecycleDatabaseScope(resolved);
	const { withWorkerTranscriptWriteLock } = await import("./session-transcript-locked-write-CX50vgVc.mjs");
	return withWorkerTranscriptWriteLock({
		...fenced,
		...captured,
		storePath: captured.path
	}, {
		...fenced,
		...captured,
		storePath: captured.ownerStorePath ?? captured.path
	}, run, runNativeTranscriptWriteLock);
}
async function runNativeTranscriptWriteLock(scope, run, alreadyLocked = false, initialSnapshot, onSnapshot, ownerScope = scope) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(ownerScope);
	const resolved = resolveSqliteTranscriptScope(scope);
	if (!alreadyLocked) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript({
			...scope,
			sessionId: resolved.sessionId
		});
	}
	const databaseOptions = toDatabaseOptions(resolved);
	return await (alreadyLocked ? async (_scope, operation) => operation() : runExclusiveSqliteSessionWrite)(resolved, async () => {
		let transcriptSnapshot = initialSnapshot;
		const context = {
			publishUpdate: async (update) => {
				assertOwnedTranscriptWriteCommit(fencedScope);
				await publishTranscriptUpdate(scope, update);
			},
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
			appendMessage: async (requested) => {
				assertLegacyTranscriptPreparation(fencedScope, requested);
				const prepare = requested.prepareMessageAfterIdempotencyCheckAsync || requested.preparation ? await prepareNativeLockedAppend(scope, requested) : void 0;
				let result;
				const snapshotState = transcriptSnapshot;
				let nextSnapshotState = snapshotState;
				runOpenClawAgentWriteTransaction((writeDatabase) => {
					assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
					const options = prepare?.(writeDatabase) ?? requested;
					const snapshotStillCurrent = snapshotState?.kind === "current" ? isSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotState.rows) : false;
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options)?.result;
					if (snapshotState?.kind === "current") nextSnapshotState = snapshotStillCurrent ? {
						kind: "current",
						rows: readTranscriptEventRows(writeDatabase, resolved.sessionId)
					} : { kind: "stale" };
					assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope);
				}, databaseOptions, { operationLabel: "session.transcript.locked-append" });
				transcriptSnapshot = nextSnapshotState;
				onSnapshot?.(transcriptSnapshot);
				return result;
			},
			appendMessageWithMessageSequence: async (requested) => {
				assertLegacyTranscriptPreparation(fencedScope, requested);
				const prepare = requested.prepareMessageAfterIdempotencyCheckAsync || requested.preparation ? await prepareNativeLockedAppend(scope, requested) : void 0;
				let result;
				let lifecycleRevision;
				let messageSeq;
				runOpenClawAgentWriteTransaction((writeDatabase) => {
					lifecycleRevision = assertLockedTranscriptWriteAllowed(writeDatabase, resolved, fencedScope)?.lifecycleRevision;
					const options = prepare?.(writeDatabase) ?? requested;
					const appended = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					result = appended?.result;
					if (result) {
						rememberCommittedTranscriptMessageSequencesInTransaction(writeDatabase, resolved.sessionId, [result], readTranscriptAppendPostimage(appended));
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
		};
		return await withTranscriptLockSettlement((queue) => run({
			publishUpdate: (update) => queue(() => context.publishUpdate(update)),
			readEvents: () => queue(context.readEvents),
			readMessageFacts: (params) => queue(() => context.readMessageFacts(params)),
			replaceEvents: (events) => queue(() => context.replaceEvents(events)),
			appendMessage: (options) => queue(() => context.appendMessage(options)),
			appendMessageWithMessageSequence: (options) => queue(() => context.appendMessageWithMessageSequence(options))
		}));
	}, "session.transcript.locked-write");
}
//#endregion
export { appendTranscriptMessageSync as a, withTranscriptWriteLock as c, appendTranscriptMessageSnapshotSync as i, withTranscriptWriteSequence as l, appendTranscriptEventSnapshotSync as n, replaceSessionWithBranchedTranscriptInTransaction as o, appendTranscriptMessage as r, rewriteTranscriptEventRowsExact as s, appendTranscriptEvent as t, replaceTranscriptSuffixEventsSync as u };
