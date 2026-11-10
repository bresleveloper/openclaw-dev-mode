import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as resolveOpenClawStateSqlitePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { S as runSqliteSessionDeletionTransaction, d as readSessionNodeArtifactFingerprint, h as readLifecycleTargetSnapshot, l as deleteSessionDeliveryArtifacts, n as deleteLifecycleTargetRows } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as readSqliteSessionGenerationClaim, u as readSqliteSessionGenerationWindows } from "./session-accessor.sqlite-canonical-repair-DvHsP9JX.mjs";
import { i as prepareSessionTranscriptArchivePublishPlans, o as recordSessionTranscriptArchivePublishResults } from "./session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import { n as sqliteLifecycleTargetSnapshotsEqual } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { a as deleteMaterializedSessionStatePlans, c as planSessionStateAfterEntryRemoval, g as shouldRemoveSessionEntry, m as readSessionGenerationIdsForKeys, o as deletePlannedLifecycleArtifactEntries, p as readReferencedSessionIdsAfterTargetMutation, t as assertPlannedLifecycleArtifactEntriesUnchanged, u as projectSessionEntryLifecycleRemovalsInDatabase } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { a as isAgentHarnessSessionKey, i as MODEL_SELECTION_LOCK_REMOVAL_MESSAGE } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { n as isRecentHistoricalSessionId } from "./session-accessor.sqlite-history-recency-CKaFMd_L.mjs";
import { t as collectSessionAdmissionReferences } from "./session-history-eviction-candidates-CgN7hDVZ.mjs";
import { r as reclaimSessionMaintenanceInTransaction } from "./session-accessor.sqlite-maintenance-transaction-CT9KsRGP.mjs";
import { t as commitPreparedSessionEntryLifecycleMutationInDatabase } from "./session-accessor.sqlite-projection-state-C-cqsNKA.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-archive-transaction.ts
/** Archive metadata retains the reclamation worker's transaction and commit authority. */
function reclaimSessionArchivePublicationInTransaction(plan, callbacks) {
	return runOpenClawAgentWriteTransaction((database) => {
		callbacks.beforeMutation?.();
		if (plan.kind === "archive-publish-prepare") {
			const value = prepareSessionTranscriptArchivePublishPlans(database, plan);
			if (value.length > 0) callbacks.onCommit?.(database);
			return {
				kind: plan.kind,
				value
			};
		}
		recordSessionTranscriptArchivePublishResults(database, plan.results, plan.nowMs);
		callbacks.onCommit?.(database);
		return {
			kind: plan.kind,
			value: true
		};
	}, plan.databaseOptions, { operationLabel: `session.${plan.kind}` });
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-deletion-plan.ts
function prepareSessionDeletionInDatabase(database, planning, expectedDatabaseIdentity) {
	switch (planning.operation) {
		case "entry": return {
			operation: planning.operation,
			value: prepareSessionEntryDeletionInDatabase(database, planning.input, expectedDatabaseIdentity)
		};
		case "history": return {
			operation: planning.operation,
			value: prepareSessionHistoricalDeletionInDatabase(database, planning.input, expectedDatabaseIdentity)
		};
		case "check": return {
			operation: planning.operation,
			value: prepareSessionHistoricalReclamationInDatabase(database, planning.input, expectedDatabaseIdentity)
		};
	}
	throw new Error("Unknown SQLite session deletion planning operation");
}
/** Native identity is checked locally; it is never serialized into the planning input. */
function prepareSessionEntryDeletionInDatabase(database, input, expectedDatabaseIdentity) {
	const params = {
		...input.deleteParams,
		expectedDatabaseIdentity
	};
	const { archiveDirectory, allowLockedEntryRemoval, expectedPluginOwnerId } = input;
	const targetSnapshot = readLifecycleTargetSnapshot(database, params.target);
	const current = targetSnapshot[0];
	if (!current) return { kind: "missing" };
	if (!shouldDeleteSqliteSessionEntryLifecycle(database, current.entry, params)) return { kind: "expected-entry-mismatch" };
	if (current.entry.modelSelectionLocked === true && !allowLockedEntryRemoval) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
	if (expectedPluginOwnerId && targetSnapshot.some(({ entry, sessionKey }) => isAgentHarnessSessionKey(sessionKey) || entry.agentHarnessId !== void 0 || entry.modelSelectionLocked !== true || normalizeOptionalString(entry.pluginOwnerId) !== expectedPluginOwnerId)) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
	const deleteTranscriptState = params.archiveTranscript || params.deleteTranscriptWithoutArchive === true;
	const ownedGenerationIds = deleteTranscriptState ? readSessionGenerationIdsForKeys(database, [
		params.target.canonicalKey,
		...params.target.storeKeys,
		...targetSnapshot.map((row) => row.sessionKey)
	]) : [];
	const referencedAfterDelete = readReferencedSessionIdsAfterTargetMutation(database, params.target, deleteTranscriptState ? [.../* @__PURE__ */ new Set([...targetSnapshot.flatMap(({ entry }) => collectSessionStateIdsForEntry(entry)), ...ownedGenerationIds])] : []);
	const entryPlans = deleteTranscriptState ? targetSnapshot.flatMap(({ entry }) => planSessionStateAfterEntryRemoval({
		archiveDirectory,
		archiveTranscript: params.archiveTranscript,
		database,
		entry,
		reason: "deleted",
		referencedSessionIds: referencedAfterDelete
	})) : [];
	const entryPlanIds = new Set(entryPlans.map((plan) => plan.sessionId));
	const historicalGenerationIds = deleteTranscriptState ? ownedGenerationIds.filter((sessionId) => !entryPlanIds.has(sessionId)) : [];
	const preflightFence = collectSessionAdmissionReferences({
		database,
		admissionIdentities: input.admissionIdentities
	});
	for (const sessionId of historicalGenerationIds) if (preflightFence.has(sessionId) && !referencedAfterDelete.has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
	return {
		kind: "ready",
		value: {
			archiveDirectory,
			current,
			entryPlans,
			historicalGenerationIds,
			targetSnapshot
		}
	};
}
/** Preserve reference and live-admission protection before materializing one historical generation. */
function prepareSessionHistoricalDeletionInDatabase(database, input, expectedDatabaseIdentity) {
	const validation = {
		...input.validation,
		deleteParams: {
			...input.validation.deleteParams,
			expectedDatabaseIdentity
		}
	};
	const { sessionId } = input;
	if (!readValidatedSessionDeletionTarget(database, validation)) return { kind: "expected-entry-mismatch" };
	const referencedAfterDelete = readReferencedSessionIdsAfterTargetMutation(database, validation.deleteParams.target, [sessionId]);
	if (referencedAfterDelete.has(sessionId)) return { kind: "skip" };
	if (collectSessionAdmissionReferences({
		database,
		admissionIdentities: input.admissionIdentities
	}).has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
	const plan = planSessionStateDeleteIfUnreferenced({
		archiveDirectory: input.archiveDirectory,
		archiveTranscript: input.archiveTranscript,
		database,
		reason: "deleted",
		referencedSessionIds: referencedAfterDelete,
		sessionId
	});
	return plan ? {
		kind: "ready",
		plan
	} : { kind: "skip" };
}
/** Recheck the same generation after archive materialization; this snapshot grants no authority. */
function prepareSessionHistoricalReclamationInDatabase(database, input, expectedDatabaseIdentity) {
	if (!readValidatedSessionDeletionTarget(database, {
		...input.validation,
		deleteParams: {
			...input.validation.deleteParams,
			expectedDatabaseIdentity
		}
	})) return { kind: "expected-entry-mismatch" };
	const protectedSessionIds = collectSessionAdmissionReferences({
		database,
		admissionIdentities: input.admissionIdentities
	});
	if (protectedSessionIds.has(input.sessionId)) throw new Error(`cannot delete session history while work is in flight for ${input.sessionId}; retry after the run completes`);
	return {
		kind: "ready",
		protectedSessionIds: [...protectedSessionIds]
	};
}
function shouldDeleteSqliteSessionEntryLifecycle(database, entry, params, scope = {
	kind: "entry",
	phase: "plan"
}) {
	if (params.expectedDatabaseIdentity !== void 0 && params.expectedDatabaseIdentity !== readOpenClawAgentDatabaseIdentity(database).identity) return false;
	if (!shouldRemoveSessionEntry(entry, {
		expectedEntry: params.expectedEntry || void 0,
		expectedSessionId: params.expectedSessionId,
		expectedLifecycleRevision: params.expectedLifecycleRevision,
		expectedUpdatedAt: params.expectedUpdatedAt
	})) return false;
	if (scope.kind === "entry" && params.expectedNodeArtifactFingerprint !== void 0 && params.expectedNodeArtifactFingerprint !== readSessionNodeArtifactFingerprint(database, params.target.canonicalKey)) return false;
	if (params.expectedGenerations) {
		const expected = new Map(params.expectedGenerations.map((generation) => [generation.window.session_id, generation]));
		if (readSqliteSessionGenerationWindows(database, scope.kind === "entry" ? [params.target.canonicalKey, ...params.target.storeKeys] : [], scope.kind === "entry" ? collectSessionStateIdsForEntry(entry) : [scope.sessionId]).some((window) => {
			const generation = expected.get(window.session_id);
			return !generation || !isDeepStrictEqual({ ...generation.window }, { ...window }) || scope.phase === "commit" && generation.fingerprint !== readSqliteSessionGenerationClaim(database, window).fingerprint;
		})) return false;
	}
	return true;
}
function readValidatedSessionDeletionTarget(database, validation) {
	const snapshot = readLifecycleTargetSnapshot(database, validation.deleteParams.target);
	const entry = snapshot[0]?.entry;
	if (!sqliteLifecycleTargetSnapshotsEqual(validation.preparedTargetSnapshot, snapshot) || !shouldDeleteSqliteSessionEntryLifecycle(database, entry, validation.deleteParams, validation.scope)) return;
	return {
		snapshot,
		entry
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation.ts
const reclamationQueue = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSessionReclamationQueue"), () => new KeyedAsyncQueue());
/** Bounds materialized archive bytes through the matching reclamation commit. */
function runExclusiveSqliteSessionReclamation(run) {
	return reclamationQueue.enqueue("session-reclamation", run);
}
function resolveSessionReclamationDatabaseOptions(options) {
	const sourceEnv = options.env ?? process.env;
	const sharedStatePath = options.database?.path ?? resolveOpenClawStateSqlitePath(sourceEnv);
	return {
		agentId: normalizeAgentId(options.agentId),
		env: {
			OPENCLAW_STATE_DIR: resolveOpenClawStateDirForDatabasePath(sharedStatePath),
			...isGatewayExternallySupervised(sourceEnv) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
		},
		path: resolveOpenClawAgentSqlitePath(options)
	};
}
function* prepareHistoricalGenerationDeletions(params) {
	const expected = params.deleteParams.expectedGenerations ? new Map(params.deleteParams.expectedGenerations.map((generation) => [generation.window.session_id, generation])) : void 0;
	for (const sessionId of params.sessionIds) {
		const generation = expected?.get(sessionId);
		yield {
			sessionId,
			deleteParams: expected ? {
				...params.deleteParams,
				expectedGenerations: generation ? [generation] : []
			} : params.deleteParams,
			preparedTargetSnapshot: params.preparedTargetSnapshot,
			scope: {
				kind: "historical-generation",
				phase: "plan",
				sessionId
			}
		};
	}
}
function expectedEntryMismatchResult(archivedTranscripts = []) {
	return {
		archivedTranscripts,
		deleted: false,
		expectedEntryMismatch: true
	};
}
function reclaimSqliteSessionInTransaction(plan, callbacks = {}) {
	if (plan.kind === "maintenance-pages") {
		const database = openOpenClawAgentDatabase(plan.databaseOptions);
		return {
			kind: plan.kind,
			value: database.walMaintenance.reclaimFreePages({
				maxPages: plan.maxPages,
				beforeMutation: callbacks.beforeMutation,
				onCommit: () => callbacks.onCommit?.(database),
				afterCommit: callbacks.afterCommit
			})
		};
	}
	const result = reclaimSqliteRowsInTransaction(plan, callbacks);
	callbacks.afterCommit?.();
	if (result.kind === "history-eviction" && result.value.deleted) reclaimSqliteFreePagesBestEffort(plan.databaseOptions);
	return result;
}
function reclaimSqliteRowsInTransaction(plan, callbacks) {
	if (plan.kind === "lifecycle-projection-plan") return runOpenClawAgentWriteTransaction((database) => {
		callbacks.beforeMutation?.();
		const result = {
			kind: plan.kind,
			value: projectSessionEntryLifecycleRemovalsInDatabase(database, plan.input)
		};
		callbacks.onCommit?.(database);
		return result;
	}, plan.databaseOptions, { operationLabel: "session.lifecycle.plan" });
	if (plan.kind === "lifecycle-projection-commit") {
		const value = runSqliteSessionDeletionTransaction((database) => {
			callbacks.beforeMutation?.();
			const progressCardResetKeys = [];
			const projectionReconcileSessionIds = [];
			const result = commitPreparedSessionEntryLifecycleMutationInDatabase(database, plan.input, plan.materializedPlans, {
				resetScope: {
					agentId: plan.agentId,
					path: database.path,
					env: plan.databaseOptions.env
				},
				onResetBoundary: ({ sessionKey, sessionId, progressCardReset, projectionNeedsReconcile }) => {
					if (progressCardReset) progressCardResetKeys.push(sessionKey);
					if (projectionNeedsReconcile) projectionReconcileSessionIds.push(sessionId);
				}
			});
			result.progressCardResetKeys = progressCardResetKeys;
			result.projectionReconcileSessionIds = projectionReconcileSessionIds;
			callbacks.onCommit?.(database, {
				kind: plan.kind,
				value: result
			});
			return result;
		}, plan.databaseOptions, { operationLabel: "session.lifecycle.mutate" });
		return {
			kind: plan.kind,
			value
		};
	}
	if (plan.kind === "archive-publish-prepare" || plan.kind === "archive-publish-record") return reclaimSessionArchivePublicationInTransaction(plan, callbacks);
	if (plan.kind === "maintenance-plan" || plan.kind === "maintenance-age" || plan.kind === "maintenance-finalize" || plan.kind === "maintenance-statistics") return reclaimSessionMaintenanceInTransaction(plan, callbacks);
	if (plan.kind === "entry") {
		const value = runSqliteSessionDeletionTransaction((transactionDb) => {
			callbacks.beforeMutation?.();
			const current = readValidatedSessionDeletionTarget(transactionDb, {
				...plan,
				scope: {
					kind: "entry",
					phase: "commit"
				}
			});
			if (!current) return expectedEntryMismatchResult();
			const { snapshot, entry } = current;
			const sessionKeys = [
				plan.deleteParams.target.canonicalKey,
				...plan.deleteParams.target.storeKeys,
				...snapshot.map((row) => row.sessionKey)
			];
			const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, void 0, new Set(sessionKeys));
			deleteLifecycleTargetRows(transactionDb, plan.deleteParams.target);
			if (plan.deleteParams.deleteDeliveryArtifacts === true) deleteSessionDeliveryArtifacts(transactionDb, plan.deleteParams.target.canonicalKey, sessionKeys);
			callbacks.onCommit?.(transactionDb);
			return {
				archivedTranscripts,
				deleted: true,
				deletedEntry: structuredClone(entry),
				...entry.sessionId ? { deletedSessionId: entry.sessionId } : {}
			};
		}, plan.databaseOptions, { operationLabel: "session.reclaim.entry" });
		return {
			kind: plan.kind,
			value
		};
	}
	if (plan.kind === "lifecycle-artifacts") {
		const value = runSqliteSessionDeletionTransaction((transactionDb) => {
			callbacks.beforeMutation?.();
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, plan.entries);
			const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, void 0, new Set(plan.entries.map((entry) => entry.sessionKey)));
			const removedEntries = deletePlannedLifecycleArtifactEntries(transactionDb, plan.entries);
			callbacks.onCommit?.(transactionDb);
			return {
				archivedTranscripts,
				removedEntries
			};
		}, plan.databaseOptions, { operationLabel: "session.reclaim.lifecycle-artifacts" });
		return {
			kind: plan.kind,
			value
		};
	}
	const value = runOpenClawAgentWriteTransaction((transactionDb) => {
		callbacks.beforeMutation?.();
		const protectedSessionIds = new Set(plan.protectedSessionIds);
		const diskBudget = plan.kind === "history-eviction" ? plan.diskBudget : void 0;
		let excludedSessionKeys;
		if (plan.kind === "historical-generation") {
			const current = readValidatedSessionDeletionTarget(transactionDb, {
				...plan,
				scope: {
					kind: "historical-generation",
					phase: "commit",
					sessionId: plan.sessionId
				}
			});
			if (!current) return {
				archivedTranscripts: [],
				deleted: false,
				expectedEntryMismatch: true
			};
			excludedSessionKeys = /* @__PURE__ */ new Set([
				plan.deleteParams.target.canonicalKey,
				...plan.deleteParams.target.storeKeys,
				...current.snapshot.map((row) => row.sessionKey)
			]);
		} else if (isRecentHistoricalSessionId({
			database: transactionDb,
			...plan.diskBudget,
			sessionId: plan.sessionId
		})) protectedSessionIds.add(plan.sessionId);
		const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, protectedSessionIds, excludedSessionKeys, diskBudget);
		const db = getSessionKysely(transactionDb.db);
		const deleted = executeSqliteQuerySync(transactionDb.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", plan.sessionId)).rows.length === 0;
		if (deleted) callbacks.onCommit?.(transactionDb);
		return {
			archivedTranscripts: deleted ? archivedTranscripts : [],
			deleted
		};
	}, plan.databaseOptions, { operationLabel: `session.reclaim.${plan.kind}` });
	return {
		kind: plan.kind,
		value
	};
}
function reclaimSqliteFreePagesBestEffort(databaseOptions) {
	try {
		openOpenClawAgentDatabase(databaseOptions).walMaintenance.reclaimFreePages({ checkpointMode: "PASSIVE" });
	} catch {}
}
function prepareReclamationDeleteParams({ commitGuard: _commitGuard, env: _env, ...params }) {
	return params;
}
function createLifecycleArtifactReclamationPlan(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		agentId: params.agentId,
		entries: params.entries,
		kind: "lifecycle-artifacts",
		materializedPlans: params.materializedPlans
	};
}
function createSessionMaintenanceStatisticsOperation(databaseOptions) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(databaseOptions),
		kind: "maintenance-statistics",
		materializedPlans: []
	};
}
function createSessionMaintenanceFinalizationOperation(params) {
	return {
		...params,
		entries: params.entries.map((removal) => ({
			...removal,
			expectedEntry: removal.expectedEntry && { ...removal.expectedEntry }
		})),
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		kind: "maintenance-finalize"
	};
}
//#endregion
export { prepareHistoricalGenerationDeletions as a, resolveSessionReclamationDatabaseOptions as c, expectedEntryMismatchResult as i, runExclusiveSqliteSessionReclamation as l, createSessionMaintenanceFinalizationOperation as n, prepareReclamationDeleteParams as o, createSessionMaintenanceStatisticsOperation as r, reclaimSqliteSessionInTransaction as s, createLifecycleArtifactReclamationPlan as t, prepareSessionDeletionInDatabase as u };
