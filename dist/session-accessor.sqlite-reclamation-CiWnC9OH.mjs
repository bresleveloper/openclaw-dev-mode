import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as resolveOpenClawStateSqlitePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as isAgentHarnessSessionKey, i as MODEL_SELECTION_LOCK_REMOVAL_MESSAGE } from "./agent-harness-session-key-D8EQIzja.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as readSessionEntryCount } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import { n as sqliteLifecycleTargetSnapshotsEqual, r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { a as readLifecycleTargetSnapshot, d as writeSessionEntry, g as deleteSessionDeliveryArtifacts, l as rehomeSessionWindows, n as deleteLifecycleTargetRows, r as deleteSessionEntryRows, t as deleteLegacySessionEntryRows, v as readSessionNodeArtifactFingerprint, w as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { i as isRecentHistoricalSessionId, r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { i as prepareSessionTranscriptArchivePublishPlans, o as recordSessionTranscriptArchivePublishResults } from "./session-accessor.sqlite-archive-store-kernel-GFHc9mfV.mjs";
import { c as readSqliteSessionGenerationClaim, i as readExactSessionEntryRowForCanonicalRepair, l as readSqliteSessionGenerationWindows } from "./session-accessor.sqlite-canonical-repair-C-uEV7oa.mjs";
import { a as deletePlannedLifecycleArtifactEntries, c as planSessionStateDeleteIfUnreferenced, f as readReferencedSessionIdsAfterTargetMutation, i as deleteMaterializedSessionStatePlans, m as shouldRemoveSessionEntry, n as assertRawSessionEntryRemovalUnchanged, p as readSessionGenerationIdsForKeys, s as planSessionStateAfterEntryRemoval, t as assertPlannedLifecycleArtifactEntriesUnchanged, u as projectSessionEntryLifecycleRemovalsInDatabase } from "./session-accessor.sqlite-lifecycle-state-BBji5bes.mjs";
import { t as collectSessionAdmissionReferences } from "./session-history-eviction-candidates-BDyikVxl.mjs";
import { n as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-B6AUFdD6.mjs";
import { n as reclaimSessionMaintenanceInTransaction } from "./session-accessor.sqlite-maintenance-transaction-Bb1T6G3u.mjs";
import { t as appendSessionResetBoundary } from "./session-accessor.sqlite-reset-boundary-DTsZp8DK.mjs";
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
//#region src/config/sessions/session-accessor.lifecycle-types.ts
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection-state.ts
function readProjectedRemovalEntry(database, projected, allowCanonicalRepair = false) {
	if (projected.removal.expectedRawEntryJson === void 0) return (allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, projected.sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, projected.sessionKey))?.entry;
	assertRawSessionEntryRemovalUnchanged(database, projected.sessionKey, projected.removal);
	return projected.expectedEntry;
}
/** The native and worker paths execute the same exact-row batch in their admitted transaction. */
function commitProjectedSessionEntryLifecycleMutationInDatabase(database, options) {
	const { projected, removalPlans, materializationFailed } = options;
	let pendingArchives = true;
	const removedSessionKeys = [];
	if (projected.archiveRecovery?.databaseIdentity === readOpenClawAgentDatabaseIdentity(database).identity) pendingArchives = projected.archiveRecovery.pending;
	const beforeCount = readSessionEntryCount(database);
	const validatedRemovals = projected.removals.filter((removal) => {
		if (materializationFailed && removal.removal.archiveRemovedTranscript === true) return false;
		const entry = readProjectedRemovalEntry(database, removal, options.allowCanonicalRepair);
		if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) {
			const replacedInSameMutation = projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey);
			throw new Error(replacedInSameMutation ? `SQLite session entry has stale lifecycle state for ${removal.sessionKey}` : `SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
		}
		const shouldRemove = shouldRemoveSessionEntry(entry, removal.removal);
		if (!shouldRemove && projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey)) throw new Error(`SQLite session entry has stale lifecycle state for ${removal.sessionKey}`);
		return shouldRemove;
	});
	const archivedTranscripts = deleteMaterializedSessionStatePlans(database, removalPlans, void 0, new Set(validatedRemovals.map((removal) => removal.sessionKey)));
	const legacyReplacementTargets = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry, expectedEntry, routeContext, resetBoundary } of projected.upsertedEntries) {
		const sameKeyRemoval = validatedRemovals.find((removal) => removal.sessionKey === sessionKey);
		const currentEntry = sameKeyRemoval ? readProjectedRemovalEntry(database, sameKeyRemoval, options.allowCanonicalRepair) : (options.allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, sessionKey))?.entry;
		const expectedCurrentEntry = expectedEntry ?? sameKeyRemoval?.expectedEntry;
		if (!sqliteSessionEntriesEqual(currentEntry, expectedCurrentEntry)) {
			if (sameKeyRemoval) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
			throw new SessionEntryLifecycleUpsertConflictError(sessionKey);
		}
		if (sameKeyRemoval && !shouldRemoveSessionEntry(currentEntry, sameKeyRemoval.removal)) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
		if (resetBoundary && expectedEntry?.sessionId) {
			const boundaryScope = {
				...options.resetScope,
				sessionId: expectedEntry.sessionId,
				sessionKey
			};
			appendSessionResetBoundary(database, boundaryScope, expectedEntry, resetBoundary);
		}
		writeSessionEntry(database, sessionKey, entry, {
			allowStoredAliases: options.allowCanonicalRepair === true,
			preserveNodeSuggestions: options.allowCanonicalRepair === true,
			previousEntry: expectedCurrentEntry ?? null,
			...routeContext !== void 0 ? { routeContext } : {}
		});
		const relatedRemovalKeys = validatedRemovals.flatMap((removal) => {
			const removedSessionId = removal.expectedEntry.sessionId;
			return removal.sessionKey !== sessionKey && (removedSessionId === entry.sessionId || removedSessionId === entry.previousSessionId) ? [removal.sessionKey] : [];
		});
		rehomeSessionWindows(database, sessionKey, relatedRemovalKeys);
		for (const legacyKey of relatedRemovalKeys) {
			const removedEntry = validatedRemovals.find((removal) => removal.sessionKey === legacyKey)?.expectedEntry;
			legacyReplacementTargets.set(legacyKey, {
				canonicalKey: sessionKey,
				rehomeMembers: removedEntry?.sessionId === entry.sessionId
			});
		}
	}
	options.afterUpsertsInTransaction?.(database);
	options.afterFreshUpsertsInTransaction?.(database);
	const upsertedKeys = new Set(projected.upsertedEntries.map((upsert) => upsert.sessionKey));
	for (const removal of validatedRemovals) {
		if (upsertedKeys.has(removal.sessionKey)) continue;
		const entry = readProjectedRemovalEntry(database, removal, options.allowCanonicalRepair);
		if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) throw new Error(`SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
		if (!shouldRemoveSessionEntry(entry, removal.removal)) continue;
		const replacement = legacyReplacementTargets.get(removal.sessionKey);
		if (replacement) deleteLegacySessionEntryRows(database, [removal.sessionKey], replacement.canonicalKey, {
			rehomeMembers: replacement.rehomeMembers,
			validatedEntries: /* @__PURE__ */ new Map([[removal.sessionKey, entry]])
		});
		else deleteSessionEntryRows(database, removal.sessionKey, {
			deleteOwnedWindows: removal.removal.deleteOwnedWindows === true,
			deliveryCleanupKeys: removal.removal.deliveryCleanupKeys,
			validatedEntry: entry
		});
		removedSessionKeys.push(removal.sessionKey);
	}
	return {
		archivedTranscripts,
		beforeCount,
		maintenancePlans: [options.applyMaintenance(database)],
		removedSessionKeys,
		pendingArchives
	};
}
/** Adapt cloneable removal inputs to the shared transaction kernel. */
function commitProjectedSessionEntryRemovalsInDatabase(database, input, removalPlans) {
	if (input.projected.upsertedEntries.length > 0) throw new Error("Worker lifecycle removal cannot contain upserts");
	return commitProjectedSessionEntryLifecycleMutationInDatabase(database, {
		...input,
		removalPlans,
		resetScope: { agentId: database.agentId },
		applyMaintenance: (current) => {
			const maintenance = input.maintenance;
			if (!maintenance) return emptySessionEntryMaintenancePlan();
			const preservation = maintenance.preservation;
			if (!preservation) throw new Error("Worker lifecycle removal requires maintenance preservation");
			return applySessionEntryMaintenanceInDatabase(current, maintenance, () => preservation);
		}
	});
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
function deleteSessionBoardRows(database, sessionKeys) {
	const keys = [...new Set(sessionKeys)];
	if (keys.length === 0) return;
	const db = getNodeSqliteKysely(database.db);
	const tables = new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", ["board_tabs", "board_widgets"])).rows.map((row) => row.name));
	if (!tables.has("board_tabs") || !tables.has("board_widgets")) return;
	executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "in", keys));
	executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "in", keys));
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
	if (plan.kind === "deletion-plan") return runOpenClawAgentWriteTransaction((database) => {
		callbacks.beforeMutation?.();
		const value = prepareSessionDeletionInDatabase(database, plan.planning);
		callbacks.onCommit?.(database);
		return {
			kind: plan.kind,
			value
		};
	}, plan.databaseOptions, { operationLabel: "session.deletion.plan" });
	if (plan.kind === "lifecycle-projection-plan" || plan.kind === "lifecycle-projection-count") return runOpenClawAgentWriteTransaction((database) => {
		callbacks.beforeMutation?.();
		const result = plan.kind === "lifecycle-projection-plan" ? {
			kind: plan.kind,
			value: projectSessionEntryLifecycleRemovalsInDatabase(database, plan.input)
		} : {
			kind: plan.kind,
			value: readSessionEntryCount(database)
		};
		callbacks.onCommit?.(database);
		return result;
	}, plan.databaseOptions, { operationLabel: "session.lifecycle.plan" });
	if (plan.kind === "lifecycle-projection-commit") {
		const value = runSqliteSessionDeletionTransaction((database) => {
			callbacks.beforeMutation?.();
			const result = commitProjectedSessionEntryRemovalsInDatabase(database, plan.input, plan.materializedPlans);
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
			deleteSessionBoardRows(transactionDb, sessionKeys);
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
		const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, plan.materializedPlans, protectedSessionIds, excludedSessionKeys, void 0, diskBudget);
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
function prepareReclamationDeleteParams({ commitGuard: _commitGuard, env: _env, descendantRunBasis: _descendantRunBasis, ...params }) {
	return params;
}
function createSessionEntryReclamationPlan(params) {
	return {
		descendantRunBasis: params.deleteParams.descendantRunBasis,
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		deleteParams: prepareReclamationDeleteParams(params.deleteParams),
		kind: "entry",
		materializedPlans: params.materializedPlans,
		preparedTargetSnapshot: params.preparedTargetSnapshot
	};
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
function createSessionMaintenancePlanningOperation(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		input: params.input,
		ageOwner: params.ageOwner,
		kind: "maintenance-plan",
		materializedPlans: []
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
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		kind: "maintenance-finalize"
	};
}
function createHistoryEvictionReclamationPlan(params) {
	return {
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		diskBudget: params.diskBudget,
		kind: "history-eviction",
		materializedPlans: params.materializedPlans,
		protectedSessionIds: [...params.protectedSessionIds],
		sessionId: params.sessionId
	};
}
function createHistoricalGenerationReclamationPlan(params) {
	return {
		descendantRunBasis: params.deleteParams.descendantRunBasis,
		databaseOptions: resolveSessionReclamationDatabaseOptions(params.databaseOptions),
		deleteParams: prepareReclamationDeleteParams(params.deleteParams),
		kind: "historical-generation",
		materializedPlans: params.materializedPlans,
		preparedTargetSnapshot: params.preparedTargetSnapshot,
		protectedSessionIds: [...params.protectedSessionIds],
		sessionId: params.sessionId
	};
}
//#endregion
export { createSessionMaintenanceFinalizationOperation as a, expectedEntryMismatchResult as c, resolveSessionReclamationDatabaseOptions as d, runExclusiveSqliteSessionReclamation as f, prepareSessionDeletionInDatabase as h, createSessionEntryReclamationPlan as i, prepareHistoricalGenerationDeletions as l, SessionEntryLifecycleUpsertConflictError as m, createHistoryEvictionReclamationPlan as n, createSessionMaintenancePlanningOperation as o, commitProjectedSessionEntryLifecycleMutationInDatabase as p, createLifecycleArtifactReclamationPlan as r, createSessionMaintenanceStatisticsOperation as s, createHistoricalGenerationReclamationPlan as t, reclaimSqliteSessionInTransaction as u };
