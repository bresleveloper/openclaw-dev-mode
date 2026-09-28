import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { p as openClawStateDatabaseCache } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, r as isArtifactPreservingStateRead, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { I as withSharedStateWriteCoordinator, c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { s as invalidateSuccessfulMigrationCheckpointsInTransaction } from "./startup-migration-checkpoint-C2dAjwWy.mjs";
import { a as recordLegacyMigrationRun } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/deferred-plugin-migrations.ts
const RUN_PREFIX = "deferred-plugin-migration:";
const deferredPluginMigrationSchema = object({
	pluginId: string().min(1),
	reason: string().min(1),
	command: string().min(1),
	requiresStateMigration: literal(true).optional(),
	requiresDoctorInspection: literal(true).optional(),
	configPaths: array(array(string().min(1)).min(1)).optional(),
	validationExcludedPaths: array(array(string().min(1)).min(1)).optional()
});
var DeferredPluginMigrationConflictError = class extends Error {
	constructor(pending) {
		super("Plugin migration obligations changed while their inputs were being prepared. Retained inputs remain protected; run \"openclaw doctor --fix\" after the other repair finishes.");
		this.name = "DeferredPluginMigrationConflictError";
		this.pending = pending;
	}
};
/** Missing metadata cannot release inputs already claimed by an unfinished migration. */
function mergeDeferredPluginMigration(previous, current) {
	const mergePaths = (before = [], after = []) => [...new Map([...before, ...after].map((segments) => [JSON.stringify(segments), segments])).values()];
	const configPaths = mergePaths(previous?.configPaths, current.configPaths);
	const validationExcludedPaths = mergePaths(previous?.validationExcludedPaths, current.validationExcludedPaths);
	return {
		pluginId: current.pluginId,
		reason: current.reason,
		command: current.command,
		...previous?.requiresStateMigration || current.requiresStateMigration ? { requiresStateMigration: true } : {},
		...previous?.requiresDoctorInspection || current.requiresDoctorInspection ? { requiresDoctorInspection: true } : {},
		...configPaths.length > 0 ? { configPaths } : {},
		...validationExcludedPaths.length > 0 ? { validationExcludedPaths } : {}
	};
}
function readPendingMigrationRows(database) {
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("migration_runs").select(["id", "report_json"]).where("id", "like", `${RUN_PREFIX}%`).where("status", "=", "pending").orderBy("id")).rows;
}
function pendingMigrationRecords(rows) {
	return rows.map((row) => deferredPluginMigrationSchema.parse(JSON.parse(row.report_json)));
}
function readPendingMigrationRecords(database) {
	return tableExists(database, "migration_runs") ? pendingMigrationRecords(readPendingMigrationRows(database)) : [];
}
function assertPendingGeneration(current, expected) {
	if (!isDeepStrictEqual(current, expected)) throw new DeferredPluginMigrationConflictError(current);
}
function readDeferredPluginMigrations(options = {}) {
	return (options.artifactPreservingReadOnly === false ? withExistingOpenClawStateDatabaseReadOnly : withExistingOpenClawStateDatabaseArtifactPreservingReadOnly)(({ db }) => readPendingMigrationRecords(db), options) ?? [];
}
/** Keep asynchronous config inspection off the main thread without creating state. */
async function readDeferredPluginMigrationsAsync(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	context.admission.assertCurrent();
	const pending = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "plugins.deferredMigrations.read",
		input: { artifactPreservingReadOnly: options.artifactPreservingReadOnly !== false || isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return pending ?? [];
}
/** Bind asynchronous settlement to the same pending records, including newly added owners. */
function assertDeferredPluginMigrationsCurrent(params) {
	withDeferredPluginMigrationsCurrent(params, () => void 0);
}
/** Keep competing obligation writers excluded until synchronous input publication finishes. */
function withDeferredPluginMigrationsCurrent(params, publish) {
	const databasePath = resolveOpenClawStateSqlitePath(params.env);
	const existing = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(databasePath);
	return withSharedStateWriteCoordinator({
		databasePath,
		existing: existing?.db
	}, () => {
		if (params.expectedPending.length === 0 && !existing?.db.isTransaction) {
			if (!withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => readPendingMigrationRecords(db), params)?.length) return publish();
		}
		return runOpenClawStateWriteTransaction(({ db }) => {
			const pending = pendingMigrationRecords(readPendingMigrationRows(db));
			if (!isDeepStrictEqual(pending, params.expectedPending) && params.onConflict) return params.onConflict(pending);
			assertPendingGeneration(pending, params.expectedPending);
			return publish();
		}, { env: params.env }, { operationLabel: "state.plugin-migration-input-publication" });
	});
}
function formatDeferredPluginMigration(pending, env = process.env) {
	const retry = pending.command === "openclaw doctor --fix" ? "" : ", then \"openclaw doctor --fix\"";
	const next = isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE_CONVERGENCE) ? `Let the current update or repair finish. If this warning remains afterward, run "${pending.command}"${retry} to retry the upgrade.` : `Run "${pending.command}"${retry} to retry the upgrade.`;
	return `Plugin "${pending.pluginId}" data/settings upgrade is unfinished: ${pending.reason} Your existing data and settings have been kept. ${next}`;
}
/** Only the migration owner can resolve a pending record after its work completes. */
function recordDeferredPluginMigrations(params) {
	if (params.pending.length === 0 && !params.resolvedPluginIds?.length) return;
	const pendingById = new Map(params.pending.map((pending) => [pending.pluginId, deferredPluginMigrationSchema.parse(pending)]));
	const transitions = runOpenClawStateWriteTransaction(({ db }) => {
		const currentRows = readPendingMigrationRows(db);
		if (params.expectedPending) assertPendingGeneration(pendingMigrationRecords(currentRows), params.expectedPending);
		const rows = new Map(currentRows.map((row) => [row.id, row]));
		const deferred = [];
		const resolved = [];
		const now = Date.now();
		for (const current of pendingById.values()) {
			const runId = `${RUN_PREFIX}${current.pluginId}`;
			const previous = rows.get(runId);
			const pending = mergeDeferredPluginMigration(previous ? deferredPluginMigrationSchema.parse(JSON.parse(previous.report_json)) : void 0, current);
			const reportJson = JSON.stringify(pending);
			if (previous?.report_json === reportJson) continue;
			recordLegacyMigrationRun(db, {
				runId,
				startedAt: now,
				finishedAt: null,
				status: "pending",
				reportJson,
				upsert: true
			});
			deferred.push(pending);
		}
		for (const pluginId of new Set(params.resolvedPluginIds)) {
			const runId = `${RUN_PREFIX}${pluginId}`;
			const previous = rows.get(runId);
			if (pendingById.has(pluginId) || !previous) continue;
			recordLegacyMigrationRun(db, {
				runId,
				startedAt: now,
				finishedAt: now,
				status: "completed",
				reportJson: previous.report_json,
				upsert: true
			});
			resolved.push(pluginId);
		}
		if (deferred.length > 0) invalidateSuccessfulMigrationCheckpointsInTransaction(db);
		return {
			deferred,
			resolved,
			pending: pendingMigrationRecords(readPendingMigrationRows(db))
		};
	}, { env: params.env }, { operationLabel: "state.plugin-migration-deferral" });
	const log = createSubsystemLogger("state-migrations");
	for (const pending of transitions.deferred) log.warn(formatDeferredPluginMigration(pending, params.env), {
		pluginId: pending.pluginId,
		reason: pending.reason,
		action: pending.command,
		status: "pending"
	});
	for (const pluginId of transitions.resolved) log.info(`Deferred state migration completed for plugin "${pluginId}".`, {
		pluginId,
		status: "completed"
	});
	return transitions.pending;
}
//#endregion
export { readDeferredPluginMigrations as a, withDeferredPluginMigrationsCurrent as c, mergeDeferredPluginMigration as i, assertDeferredPluginMigrationsCurrent as n, readDeferredPluginMigrationsAsync as o, formatDeferredPluginMigration as r, recordDeferredPluginMigrations as s, DeferredPluginMigrationConflictError as t };
