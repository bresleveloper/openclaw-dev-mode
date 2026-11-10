import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { E as readSqliteDatabaseScopedWriteToken } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { l as readSessionEntryCacheValidityToken, s as cacheValidityTokensEqual } from "./session-participant-identity-Btc25HNW.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as applySessionEntryMaintenanceAgeChange, c as invalidateSessionEntryMaintenanceAgeFact, d as readSessionEntryMaintenanceAgeFact, f as readSessionEntryMaintenanceNextAgeAt } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { S as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { a as deleteMaterializedSessionStatePlans, o as deletePlannedLifecycleArtifactEntries } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { a as refreshSessionPlannerStatisticsInDatabase, r as prepareSessionEntryMaintenanceInDatabase, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-CKTkTTKa.mjs";
import { t as SqliteReclamationInputsChangedError } from "./session-accessor.sqlite-reclamation-worker-diagnostics-DR5Udg-Z.mjs";
//#region src/config/sessions/session-accessor.sqlite-maintenance-transaction.ts
function prepareWorkerAgeFact(database, plan) {
	for (const change of plan.ageChanges ?? []) applySessionEntryMaintenanceAgeChange(database.db, change);
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
		const scopeKeys = [...plan.input.activeSessionKeys ?? []];
		const scopedRevision = readSqliteDatabaseScopedWriteToken(database.db, scopeKeys);
		const prepared = runSqliteDeferredTransactionSync(database.db, () => {
			const planPreparation = prepareSessionEntryMaintenanceInDatabase(database, plan.input, () => plan.input.preservation);
			return {
				noOp: planPreparation.kind === "no-op",
				apply: planPreparation.kind === "no-op" ? planPreparation.apply : planPreparation.captureMutation()
			};
		}, {
			databaseLabel: database.path,
			operationLabel: "session.maintenance.plan.read"
		});
		return {
			apply(current, onArchived) {
				claim.assertCurrent();
				const snapshotCurrent = cacheValidityTokensEqual(revision, readSessionEntryCacheValidityToken(database.db)) || prepared.noOp && plan.input.preparedAgeFactCurrent === true && scopedRevision !== void 0 && scopedRevision === readSqliteDatabaseScopedWriteToken(database.db, scopeKeys);
				const maintenance = prepared.apply(current, onArchived);
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
		const result = finalizeSessionMaintenanceInDatabase(database, plan);
		callbacks.onCommit?.(database, result);
		return result;
	}, plan.databaseOptions, { operationLabel: "session.maintenance.finalize" });
}
/** The native adapter and canonical executor share the same optimistic removal partition. */
function finalizeSessionMaintenanceInDatabase(database, plan) {
	const committedEntryIndices = [];
	const unchanged = plan.entries.filter((planned, index) => {
		const current = readExactSessionEntryRow(database, planned.sessionKey)?.entry;
		if (!sqliteSessionEntriesEqual(current, planned.expectedEntry)) return false;
		committedEntryIndices.push(index);
		return true;
	});
	const archivedTranscripts = deleteMaterializedSessionStatePlans(database, plan.materializedPlans, void 0, new Set(unchanged.map((entry) => entry.sessionKey)));
	deletePlannedLifecycleArtifactEntries(database, unchanged);
	return {
		kind: plan.kind,
		value: {
			archivedTranscripts,
			committedEntryIndices
		}
	};
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
				callbacks.beforeCommit?.(database);
				return {
					kind: "maintenance-age",
					nextAt: readSessionEntryMaintenanceNextAgeAt(database, plan.maintenance),
					ageFact: readSessionEntryMaintenanceAgeFact(database.db, plan.maintenance)
				};
			}
			if (!prepared) prepareWorkerAgeFact(database, plan);
			const maintenance = prepared ? prepared.apply(database, callbacks.onArchived) : applySessionEntryMaintenanceInDatabase(database, plan.input, () => plan.input.preservation, callbacks.onArchived);
			if (maintenance.archived > 0 || maintenance.entryRemovals.length > 0) callbacks.onCommit?.(database);
			callbacks.beforeCommit?.(database, maintenance);
			return {
				kind: plan.kind,
				value: maintenance,
				nextAt: readSessionEntryMaintenanceNextAgeAt(database, plan.input.maintenance),
				ageFact: readSessionEntryMaintenanceAgeFact(database.db, plan.input.maintenance)
			};
		}, plan.databaseOptions, { operationLabel: "session.maintenance.plan.write" });
	} catch (error) {
		if (error instanceof SqliteReclamationInputsChangedError) return { kind: "maintenance-plan-stale" };
		throw error;
	}
}
//#endregion
export { runSessionMaintenanceMetadataInTransaction as i, prepareSessionMaintenanceInWorker as n, reclaimSessionMaintenanceInTransaction as r, finalizeSessionMaintenanceInDatabase as t };
