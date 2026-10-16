import { l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as assertOwnedTranscriptWriteCommit, o as getOwnedSessionTranscriptInitialWriter, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { l as readTranscriptMutationStateInTransaction, o as readNextTranscriptSeq, s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { j as resolveTranscriptMessageAppendParent, v as readTranscriptEventRows } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { n as ensureSessionEntrySync, t as ensureSessionEntryInTransaction } from "./session-accessor.sqlite-initial-entry-B_o9uZxg.mjs";
import { n as appendTranscriptEventSnapshotSync, v as projectCompactionAccountingPatch } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { i as resolveTranscriptAppendRefusal, t as assertLockedTranscriptWriteAllowed } from "./session-accessor.sqlite-transcript-write-guard-zwgi538F.mjs";
import { n as requireTranscriptEventAppendSnapshot } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
//#region src/config/sessions/session-accessor.sqlite-compaction.ts
/** Commits one compaction boundary and its session accounting as one SQLite write. */
function persistCompactionBoundaryWithSessionEntrySync(scope, params) {
	return persistCompactionBoundary(scope, params).committed;
}
/** The metadata worker borrows its canonical connection for the same atomic boundary. */
function persistCompactionBoundaryWithSessionEntryInWorker(scope, params, context) {
	return persistCompactionBoundary(scope, params, context);
}
function persistCompactionBoundary(scope, params, worker) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const preparedScope = withOwnedSessionTranscriptWriterFence(params.prepared.scope);
	const preparedTarget = resolveSqliteTranscriptScope(preparedScope);
	if (preparedTarget.agentId !== resolved.agentId || preparedTarget.sessionId !== resolved.sessionId || preparedTarget.sessionKey !== resolved.sessionKey || resolveOpenClawAgentSqlitePath(toDatabaseOptions(preparedTarget)) !== resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))) throw new SessionTranscriptWriterClaimReboundError();
	return runOpenClawAgentWriteTransaction((database) => {
		if (worker && database.db !== worker.database) throw new Error("Session compaction lost its borrowed canonical connection");
		worker?.admit("transaction");
		assertOwnedTranscriptWriteCommit(fencedScope);
		assertOwnedTranscriptWriteCommit(preparedScope);
		let initialEntry;
		if (params.prepared.initializeEntry) {
			const entry = {
				sessionId: resolved.sessionId,
				updatedAt: Date.now()
			};
			if (worker) {
				initialEntry = ensureSessionEntryInTransaction(database, preparedTarget, preparedScope, entry, params.initialWriterRunId);
				if (initialEntry.fence) {
					Object.assign(fencedScope, initialEntry.fence);
					Object.assign(preparedScope, initialEntry.fence);
				}
			}
			if (!(worker ? initialEntry?.owned : ensureSessionEntrySync(preparedScope, entry))) throw new Error("Session transcript header was not persisted");
			getOwnedSessionTranscriptInitialWriter({ sessionTarget: preparedScope })?.assertActive();
		}
		assertLockedTranscriptWriteAllowed(database, resolved, fencedScope);
		assertLockedTranscriptWriteAllowed(database, resolved, preparedScope);
		const event = {
			...params.prepared.event,
			parentId: resolveTranscriptMessageAppendParent(database, resolved.sessionId, {
				parentId: params.prepared.event.parentId,
				appendIntent: params.prepared.appendIntent
			})
		};
		const firstAppendedSeq = readNextTranscriptSeq(database, resolved.sessionId);
		let projectionNeedsReconcile = false;
		const appended = appendTranscriptEventSnapshotSync(preparedScope, event, { expectedMutationAt: params.prepared.expectedMutationAt }, worker ? {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		} : void 0);
		const committed = requireTranscriptEventAppendSnapshot(appended, `Session transcript entry was not persisted: ${event.id}`);
		const appendedRows = readTranscriptEventRows(database, resolved.sessionId, { afterSeq: firstAppendedSeq - 1 });
		if (event.type !== "compaction" || appendedRows.length !== 1 || appendedRows[0]?.eventJson !== JSON.stringify(event)) throw new Error("Compaction boundary validation failed");
		assertOwnedTranscriptWriteCommit(fencedScope);
		assertOwnedTranscriptWriteCommit(preparedScope);
		const fresh = readSessionEntryRow(database, resolved.sessionKey)?.entry;
		const refusal = resolveTranscriptAppendRefusal(fresh, resolved, fencedScope);
		if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
		const entry = projectCanonicalSessionEntryShape({
			...fresh,
			...projectCompactionAccountingPatch(fresh, {
				compactionKind: "context-engine",
				transcriptByteCompactionLatch: params.transcriptByteCompactionLatch
			})
		});
		writeSessionEntry(database, resolved.sessionKey, entry, {
			previousEntry: fresh,
			canonicalPreviousEntry: fresh
		});
		worker?.admit("commit");
		return {
			committed: {
				result: event,
				before: committed.before,
				after: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
			},
			initialEntry,
			projectionNeedsReconcile
		};
	}, toDatabaseOptions(resolved), { operationLabel: "session.compaction-boundary" });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-metadata-read.ts
function createTranscriptPresenceQuery(database) {
	const db = getSessionKysely(database.db);
	return prepareSqliteQueryTakeFirstSync(database.db, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectFrom("transcript_events").select("session_id").where("session_id", "=", sessionId).unionAll(db.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", sessionId)).limit(1);
	});
}
const transcriptPresenceQuery = createSqliteQueryCache((db) => createTranscriptPresenceQuery({ db }));
/** Reads physical transcript presence without decoding events or restoring cold storage. */
function hasSessionTranscriptEventsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return Boolean(transcriptPresenceQuery(database.db)(resolved.sessionId));
}
/** Reads both physical mutation fences from the same session window snapshot. */
function readTranscriptMutationStateSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => readTranscriptMutationStateInTransaction(database, resolved.sessionId), {
		databaseLabel: database.path,
		operationLabel: "session transcript mutation read"
	});
}
/** Reads only the current transcript mutation fence without parsing transcript rows. */
function readTranscriptMutationAtSync(scope) {
	return readTranscriptMutationStateSync(scope).updatedAt;
}
//#endregion
export { persistCompactionBoundaryWithSessionEntrySync as a, persistCompactionBoundaryWithSessionEntryInWorker as i, readTranscriptMutationAtSync as n, readTranscriptMutationStateSync as r, hasSessionTranscriptEventsSync as t };
