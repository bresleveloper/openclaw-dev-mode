import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { h as readSessionEntryCacheValidityToken, p as cacheValidityTokensEqual } from "./internal-session-key-CPayZwJR.mjs";
import { A as readSessionEntryMaintenanceNextAgeAt, D as invalidateSessionEntryMaintenanceAgeFact, E as captureSessionEntryMaintenanceAgeFact, w as applySessionEntryMaintenanceAgeChange } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { w as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { a as deletePlannedLifecycleArtifactEntries, i as deleteMaterializedSessionStatePlans, o as partitionUnchangedPlannedLifecycleArtifactEntries } from "./session-accessor.sqlite-lifecycle-state-CQczfYh9.mjs";
import { a as refreshSessionPlannerStatisticsInDatabase, r as prepareSessionEntryMaintenanceInDatabase, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-DacppKvc.mjs";
import { t as SqliteReclamationInputsChangedError } from "./session-accessor.sqlite-reclamation-worker-diagnostics-hJYsjFvr.mjs";
//#region src/config/sessions/session-accessor.sqlite-maintenance-transaction.ts
var MaintenancePreservationRequiredError = class extends Error {};
const ageOwners = /* @__PURE__ */ new WeakMap();
const ageCaptureIds = /* @__PURE__ */ new WeakMap();
let nextAgeCaptureId = 0;
function prepareWorkerAgeFact(database, plan) {
	if (plan.ageOwner !== void 0 && ageOwners.get(database.db) !== plan.ageOwner) {
		invalidateSessionEntryMaintenanceAgeFact(database.db);
		ageOwners.set(database.db, plan.ageOwner);
	}
	for (const change of plan.ageChanges ?? []) applySessionEntryMaintenanceAgeChange(database.db, change);
}
function captureWorkerAgeSnapshot(database, maintenance) {
	const revision = readSessionEntryCacheValidityToken(database.db);
	const capture = captureSessionEntryMaintenanceAgeFact(database.db, maintenance);
	let id = ageCaptureIds.get(capture);
	if (id === void 0) {
		id = ++nextAgeCaptureId;
		ageCaptureIds.set(capture, id);
	}
	return {
		incarnation: readOpenClawAgentDatabaseIdentity(database).incarnation,
		revision,
		capture: id
	};
}
function readPreservation(input) {
	if (input.preservation === null) throw new MaintenancePreservationRequiredError("SQLite maintenance requires session preservation");
	return input.preservation;
}
/** Retain the snapshot connection; its revision fences age facts, not unrelated row writes. */
function prepareSessionMaintenanceInWorker(plan) {
	const reader = retainOpenClawAgentDatabaseReadOnly(plan.databaseOptions);
	if (!reader.found) throw new Error(`Cannot plan SQLite maintenance: ${reader.reason}`);
	const { database, claim } = reader;
	try {
		claim.assertCurrent();
		prepareWorkerAgeFact(database, plan);
		const revision = readSessionEntryCacheValidityToken(database.db);
		let apply;
		try {
			apply = runSqliteDeferredTransactionSync(database.db, () => prepareSessionEntryMaintenanceInDatabase(database, plan.input, () => readPreservation(plan.input)), {
				databaseLabel: database.path,
				operationLabel: "session.maintenance.plan.read"
			});
		} catch (error) {
			if (!(error instanceof MaintenancePreservationRequiredError)) throw error;
			apply = () => {
				throw error;
			};
		}
		return {
			apply(current, onArchived) {
				claim.assertCurrent();
				const snapshotCurrent = cacheValidityTokensEqual(revision, readSessionEntryCacheValidityToken(database.db));
				const maintenance = apply(current, onArchived);
				if (!snapshotCurrent) invalidateSessionEntryMaintenanceAgeFact(current.db);
				return maintenance;
			},
			release: claim.release
		};
	} catch (error) {
		claim.release();
		throw error;
	}
}
function reclaimSessionMaintenanceInTransaction(plan, callbacks, prepared) {
	if (plan.kind !== "maintenance-finalize") return runSessionMaintenanceMetadataInTransaction(plan, callbacks, prepared);
	return runSqliteSessionDeletionTransaction((database) => {
		callbacks.beforeMutation?.();
		const partition = partitionUnchangedPlannedLifecycleArtifactEntries(database, plan.entries);
		const archivedTranscripts = deleteMaterializedSessionStatePlans(database, plan.materializedPlans, void 0, new Set(partition.unchanged.map((entry) => entry.sessionKey)));
		deletePlannedLifecycleArtifactEntries(database, partition.unchanged);
		const result = {
			kind: plan.kind,
			value: {
				archivedTranscripts,
				changedEntries: partition.changed,
				committedEntries: partition.unchanged
			}
		};
		callbacks.onCommit?.(database, result);
		return result;
	}, plan.databaseOptions, { operationLabel: "session.maintenance.finalize" });
}
function runSessionMaintenanceMetadataInTransaction(plan, callbacks, prepared) {
	if (plan.kind === "maintenance-statistics") {
		const database = openOpenClawAgentDatabase(plan.databaseOptions);
		runWithSqliteBusyTimeout(database.db, 0, () => runOpenClawAgentWriteTransaction((current) => {
			callbacks.beforeMutation?.(current);
			refreshSessionPlannerStatisticsInDatabase(current);
			callbacks.onCommit?.(current);
			callbacks.beforeCommit?.(current);
		}, plan.databaseOptions, {
			busyTimeoutMs: 0,
			operationLabel: "session.maintenance.statistics"
		}));
		return {
			kind: plan.kind,
			value: true
		};
	}
	try {
		return runOpenClawAgentWriteTransaction((database) => {
			callbacks.beforeMutation?.(database);
			if (plan.kind === "maintenance-age") {
				for (const change of plan.ageChanges ?? []) applySessionEntryMaintenanceAgeChange(database.db, change);
				const snapshot = captureWorkerAgeSnapshot(database, plan.maintenance);
				if (!isOpenClawAgentDatabasePathCurrent(database) || plan.expected && (plan.expected.incarnation !== snapshot.incarnation || plan.expected.capture !== snapshot.capture || !cacheValidityTokensEqual(plan.expected.revision, snapshot.revision))) return { kind: "maintenance-plan-stale" };
				callbacks.beforeCommit?.(database);
				return {
					kind: "maintenance-age",
					nextAt: readSessionEntryMaintenanceNextAgeAt(database, plan.maintenance)
				};
			}
			if (!prepared) prepareWorkerAgeFact(database, plan);
			const maintenance = prepared ? prepared.apply(database, callbacks.onArchived) : applySessionEntryMaintenanceInDatabase(database, plan.input, () => readPreservation(plan.input), callbacks.onArchived);
			if (maintenance.archived > 0 || maintenance.entryRemovals.length > 0) callbacks.onCommit?.(database);
			callbacks.beforeCommit?.(database);
			return {
				kind: plan.kind,
				value: maintenance,
				ageSnapshot: captureWorkerAgeSnapshot(database, plan.input.maintenance)
			};
		}, plan.databaseOptions, { operationLabel: "session.maintenance.plan.write" });
	} catch (error) {
		if (error instanceof SqliteReclamationInputsChangedError) return { kind: "maintenance-plan-stale" };
		if (error instanceof MaintenancePreservationRequiredError) return { kind: "maintenance-preservation-required" };
		throw error;
	}
}
//#endregion
export { reclaimSessionMaintenanceInTransaction as n, runSessionMaintenanceMetadataInTransaction as r, prepareSessionMaintenanceInWorker as t };
