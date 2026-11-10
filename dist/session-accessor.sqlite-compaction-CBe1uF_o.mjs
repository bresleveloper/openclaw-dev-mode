import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { ot as projectCompactionAccountingPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
import { l as runExclusiveSqliteSessionWrite, s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as writeSessionEntry, g as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { M as resolveTranscriptMessageAppendParent, y as readTranscriptEventRows } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { c as getOwnedSessionTranscriptInitialWriter, h as withOwnedSessionTranscriptWriterFence, t as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-C02sC3zd.mjs";
import { n as ensureSessionEntrySync, t as ensureSessionEntryInTransaction } from "./session-accessor.sqlite-initial-entry-B00nO36i.mjs";
import { n as requireTranscriptEventAppendSnapshot } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { r as resolveTranscriptAppendRefusal, t as assertLockedTranscriptWriteAllowed } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { n as appendTranscriptEventSnapshotSync } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as applyManualCompactInTransaction } from "./session-manual-compact.kernel-F5Q1AUMw.mjs";
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
		let projectionNeedsReconcile = false;
		const appended = appendTranscriptEventSnapshotSync(preparedScope, event, { expectedMutationAt: params.prepared.expectedMutationAt }, worker ? {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		} : void 0);
		const committed = requireTranscriptEventAppendSnapshot(appended, `Session transcript entry was not persisted: ${event.id}`);
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
				after: committed.after
			},
			initialEntry,
			projectionNeedsReconcile
		};
	}, toDatabaseOptions(resolved), { operationLabel: "session.compaction-boundary" });
}
async function trimTranscriptForManualCompact(scope, selectRetainedLines, options = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	if (options.preparation) {
		options.preparation.assertCurrent();
		await options.preparation.restore();
		options.preparation.assertCurrent();
	} else {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript({
			...scope,
			sessionId: resolved.sessionId
		});
	}
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		options.preparation?.assertCurrent();
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const snapshotRows = readTranscriptEventRows(database, resolved.sessionId);
		const sessionSnapshot = options.preparation?.snapshot ?? readSessionEntrySelectionSnapshot(database, resolved.sessionKey, true);
		options.preparation?.assertEntryCurrent(sessionSnapshot[0]?.entry);
		const retainedLines = selectRetainedLines(snapshotRows.map((row) => row.eventJson));
		if (!retainedLines) return { trimmed: false };
		if (sessionSnapshot[0]?.entry.sessionId !== resolved.sessionId) throw new Error(`Cannot compact SQLite transcript ${resolved.sessionId} without its current session entry`);
		const retainedEvents = retainedLines.map((line) => JSON.parse(line));
		runOpenClawAgentWriteTransaction((writeDatabase) => {
			options.preparation?.assertCommitCurrent();
			const identity = applyManualCompactInTransaction(writeDatabase, resolved, {
				rows: snapshotRows,
				entries: sessionSnapshot,
				events: retainedEvents,
				nowMs: options.nowMs
			});
			options.preparation?.assertCommitCurrent();
			return prepareSessionIdentityPublication(writeDatabase, resolved.agentId, identity.previous, identity.current);
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.manual-compact" })();
		return {
			kept: retainedLines.length,
			trimmed: true
		};
	}, "session.transcript.compact");
}
//#endregion
export { persistCompactionBoundaryWithSessionEntrySync as n, trimTranscriptForManualCompact as r, persistCompactionBoundaryWithSessionEntryInWorker as t };
