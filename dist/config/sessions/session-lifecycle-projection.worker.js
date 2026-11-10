import { r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { i as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-QuvwmAax.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "../../openclaw-agent-db-identity-CnM2kzVa.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "../../openclaw-agent-db-_fC-kf1x.mjs";
import { t as collectLifecycleIdentityChanges } from "../../session-accessor.sqlite-identity-2UHa91m7.mjs";
import { u as prepareSessionActorEntryPatch } from "../../session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { n as hasPendingSessionTranscriptArchives } from "../../session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import { d as readProjectedLifecycleStore, h as selectProjectedLifecycleRemovals, s as finishProjectedLifecycleRemovalPlans } from "../../session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { t as commitPreparedSessionEntryLifecycleMutationInDatabase } from "../../session-accessor.sqlite-projection-state-C-cqsNKA.mjs";
import { r as prepareSessionEntryReplacementPublication } from "../../session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { i as transferSessionEntryWorkerCandidate } from "../../session-entry-patch.worker-CyYnfK5G.mjs";
//#region src/config/sessions/session-lifecycle-projection.worker.ts
function commitSessionLifecycleProjection(input, { writeTransaction, admit, options }) {
	return writeTransaction("session.lifecycle.project", "Session lifecycle", (database) => {
		const progressCardResetKeys = [];
		const projectionReconcileSessionIds = [];
		const postimages = /* @__PURE__ */ new Map();
		const archivedPrevious = /* @__PURE__ */ new Map();
		const upsert = input.projected.upsertedEntries[0];
		const publishActorEntry = input.projected.upsertedEntries.length === 1 && input.projected.removals.length === 0 && upsert && !upsert.resetBoundary ? prepareSessionActorEntryPatch(database, upsert.sessionKey) : void 0;
		const result = commitPreparedSessionEntryLifecycleMutationInDatabase(database, input, input.removalPlans, {
			resetScope: {
				agentId: input.agentId,
				path: database.path,
				env: options.env
			},
			currentEntrySnapshot: publishActorEntry?.snapshot(),
			postimages,
			onArchived: (sessionKey, previous) => archivedPrevious.set(sessionKey, previous),
			onResetBoundary: ({ sessionKey, sessionId, progressCardReset, projectionNeedsReconcile }) => {
				if (progressCardReset) progressCardResetKeys.push(sessionKey);
				if (projectionNeedsReconcile) projectionReconcileSessionIds.push(sessionId);
			}
		});
		const identity = collectLifecycleIdentityChanges(input.projected, result.removedSessionKeys);
		for (const [sessionKey, previous] of archivedPrevious) if (!identity.previous.has(sessionKey)) identity.previous.set(sessionKey, previous);
		for (const sessionKey of identity.current.keys()) if (!postimages.has(sessionKey)) identity.current.delete(sessionKey);
		for (const [sessionKey, postimage] of postimages) identity.current.set(sessionKey, postimage.entry);
		const candidate = {
			kind: "session-lifecycle-projection",
			result,
			progressCardResetKeys,
			projectionReconcileSessionIds,
			publication: prepareSessionEntryReplacementPublication({
				...identity,
				pendingArchiveRecovery: result.pendingArchives,
				membershipInvalidatedKeys: [...result.removedSessionKeys, ...input.projected.upsertedEntries.flatMap(({ sessionKey, entry, expectedEntry }) => entry.sessionId !== expectedEntry?.sessionId ? [sessionKey] : [])],
				maintenancePlans: result.maintenancePlans
			}, database, { postimages })
		};
		if (result.maintenancePlans.every((plan) => plan.archivedEntries.length === 0 && plan.entryRemovals.length === 0)) publishActorEntry?.publish(postimages, candidate.publication);
		return transferSessionEntryWorkerCandidate(database, admit, candidate);
	});
}
/** Private planning commands borrow the executor's admitted connection. */
function bindSqliteWorkerBackend(binding, context) {
	const database = getOpenClawAgentDatabaseIfOpen({
		agentId: binding.agentId,
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (!database || database.db !== context.database || database.path !== context.databasePath) throw new Error("Session lifecycle planning lost its canonical database owner");
	let closed = false;
	const assertOpen = () => {
		if (closed || !database.db.isOpen) throw new Error("Session lifecycle planning domain is closed");
		assertTransactionUsable(database.db);
	};
	return {
		execute(command) {
			assertOpen();
			const prepare = () => {
				if (command.type === "prepare") {
					const input = command.input;
					const upsert = input.upserts[0];
					const retained = !input.allowCanonicalRepair && input.removals.length === 0 && input.upserts.length === 1 && upsert && !upsert.relatedSessionKeys?.length ? prepareSessionActorEntryPatch(database, upsert.sessionKey.trim())?.snapshot() : void 0;
					const store = retained && (upsert?.relatedSessionKeys === void 0 || !retained.entry.parentSessionKey) ? { [retained.sessionKey]: retained.entry } : readProjectedLifecycleStore(database, input);
					const identity = readOpenClawAgentDatabaseIdentity(database).identity;
					return {
						store,
						selected: selectProjectedLifecycleRemovals(database, store, input.removals),
						archiveRecovery: typeof identity === "string" ? {
							pending: hasPendingSessionTranscriptArchives(database),
							databaseIdentity: identity
						} : void 0
					};
				}
				const input = command.input;
				return finishProjectedLifecycleRemovalPlans(database, input.archiveDirectory, input.store, input.selected, input.upsertedEntries);
			};
			return command.type === "prepare" && command.input.removals.length === 0 ? prepare() : runSqliteDeferredTransactionSync(database.db, prepare);
		},
		assertSettled() {
			assertOpen();
			if (database.db.isTransaction) throw new Error("Session lifecycle planning left a transaction open");
		},
		close() {
			closed = true;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend, commitSessionLifecycleProjection };
