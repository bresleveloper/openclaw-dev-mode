import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { o as runWithSqliteCleanup, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { Dr as ZodError, Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { C as closeTrackedStateDatabase, f as openClawStateDatabaseCache, w as openTrackedStateDatabase } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { u as withStateDatabaseSchemaMaintenance } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { t as assertStateReadSchema } from "./openclaw-state-db-read-connection-C62_-Nv8.mjs";
import { n as runManagedStateTransaction } from "./openclaw-state-db-transaction-LzNJgkWu.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as invalidateSuccessfulMigrationCheckpointsInTransaction } from "./startup-migration-checkpoint-Bkqf-Qf8.mjs";
import { s as recordLegacyMigrationRun } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { existsSync } from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
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
const configMigrationCompletion = new AsyncLocalStorage();
/** The package owner may finish inspected config-only work through the normal file publisher. */
async function withDeferredPluginConfigCompletion(params, run) {
	return await configMigrationCompletion.run({
		...params,
		published: false
	}, run);
}
/** The file rollback's live owner also restores its completed migration obligations. */
function withDeferredPluginConfigRollback(params, publish, didMutate) {
	const completion = configMigrationCompletion.getStore();
	if (!completion?.published || completion.configPath !== params.configPath) {
		publish();
		return;
	}
	let failure;
	runOpenClawStateWriteTransaction(({ db }) => {
		params.assertCurrent();
		recordDeferredPluginMigrationsInTransaction(db, {
			pending: completion.expectedPending,
			expectedPending: completion.expectedPending.filter((entry) => !completion.resolvedPluginIds.includes(entry.pluginId))
		});
		try {
			publish();
		} catch (error) {
			if (!didMutate()) throw error;
			failure = { error };
		}
		if (!didMutate()) throw new Error("Config rollback did not publish its restoration.");
	}, { env: params.env }, { operationLabel: "state.plugin-migration-input-rollback" });
	completion.published = false;
	if (failure) throw failure.error;
}
/** Exclude only this write's admitted repairs; persisted rows remain pending until publication. */
function readConfigWritePendingMigrations(configPath, env) {
	const pending = readDeferredPluginMigrations({ env });
	const completion = configMigrationCompletion.getStore();
	if (!completion || completion.configPath !== configPath || completion.published) return pending;
	completion.assertCurrent();
	assertPendingGeneration(pending, completion.expectedPending);
	return pending.filter((entry) => !completion.resolvedPluginIds.includes(entry.pluginId));
}
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
/** Prime resolution in this module before the updater replaces its package. */
async function prepareDeferredPluginMigrationRuntime() {
	const { prepareOpenClawStateLeaseWorkerRuntime } = await import("./openclaw-state-lease-worker-operation-BTGhc6YK.mjs");
	await Promise.all([
		import("./openclaw-state-worker-store-RW5P1VzC.mjs"),
		import("./plugin-lifecycle-lease-D_2q8UjY.mjs"),
		prepareOpenClawStateLeaseWorkerRuntime()
	]);
}
/** Keep asynchronous config inspection off the main thread without creating state. */
async function readDeferredPluginMigrationsAsync(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	context.admission.assertCurrent();
	const pending = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "plugins.deferredMigrations.read",
		input: { artifactPreservingReadOnly: options.artifactPreservingReadOnly !== false || isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return pending ?? [];
}
/** Completion receipts resolve historical warnings without loading their retired reports. */
function readDeferredPluginMigrationCompletions(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (!tableExists(db, "migration_runs")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("migration_runs").select(["id", "finished_at"]).where("id", "like", `${RUN_PREFIX}%`).where("status", "=", "completed")).rows.flatMap(({ id, finished_at }) => finished_at === null ? [] : [{
			pluginId: id.slice(26),
			completedAtMs: finished_at
		}]);
	}, options) ?? [];
}
/** Bind asynchronous settlement to the same pending records, including newly added owners. */
function assertDeferredPluginMigrationsCurrent(params) {
	withDeferredPluginMigrationsCurrent(params, () => void 0);
}
/** Keep competing obligation writers excluded until synchronous input publication finishes. */
function withDeferredPluginMigrationsCurrent(params, publish) {
	const scope = configMigrationCompletion.getStore();
	const completion = scope && scope.configPath === params.configPath && !scope.published ? scope : void 0;
	const expectedPending = completion?.expectedPending ?? params.expectedPending;
	const databasePath = resolveOpenClawStateSqlitePath(params.env);
	const existing = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(databasePath);
	if (expectedPending.length === 0 && !existing) {
		if (!existsSync(databasePath)) return withStateDatabaseSchemaMaintenance({ databasePath }, () => existsSync(databasePath) ? withDeferredPluginMigrationsCurrent(params, publish) : publish());
		const db = openTrackedStateDatabase(databasePath, { existingOnly: true });
		let publication;
		runWithSqliteCleanup({ release() {
			const errors = [];
			try {
				clearNodeSqliteKyselyCacheForDatabase(db);
			} catch (error) {
				errors.push(error);
			}
			try {
				closeTrackedStateDatabase(db);
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Plugin migration publication cleanup failed.");
		} }, "Plugin migration input publication", () => {
			setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			runManagedStateTransaction(db, () => {
				assertStateReadSchema(db, databasePath);
				if (readPendingMigrationRecords(db).length > 0) return;
				const value = publish();
				publication = { value };
				return value;
			}, {
				databaseLabel: databasePath,
				operationLabel: "state.plugin-migration-input-publication"
			});
		});
		if (publication) return publication.value;
	}
	const result = runOpenClawStateWriteTransaction(({ db }) => {
		const pending = pendingMigrationRecords(readPendingMigrationRows(db));
		if (!isDeepStrictEqual(pending, expectedPending) && params.onConflict) return params.onConflict(pending);
		assertPendingGeneration(pending, expectedPending);
		completion?.assertCurrent();
		const published = publish();
		if (completion) {
			completion.assertCurrent();
			recordDeferredPluginMigrationsInTransaction(db, {
				pending: pending.filter((entry) => !completion.resolvedPluginIds.includes(entry.pluginId)),
				resolvedPluginIds: completion.resolvedPluginIds,
				expectedPending
			});
		}
		return published;
	}, { env: params.env }, { operationLabel: "state.plugin-migration-input-publication" });
	if (completion) completion.published = true;
	return result;
}
function formatDeferredPluginMigration(pending, env = process.env) {
	const retry = pending.command === "openclaw doctor --fix" ? "" : ", then \"openclaw doctor --fix\"";
	const next = isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) && !isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE_CONVERGENCE) ? `Let the current update or repair finish. If this warning remains afterward, run "${pending.command}"${retry} to retry the upgrade.` : `Run "${pending.command}"${retry} to retry the upgrade.`;
	return `Plugin "${pending.pluginId}" data/settings upgrade is unfinished: ${pending.reason} Your existing data and settings have been kept. ${next}`;
}
/** Native row transform; the worker owns its transaction and lease grants. */
function recordDeferredPluginMigrationsInTransaction(db, params) {
	const pendingById = new Map(params.pending.map((pending) => [pending.pluginId, deferredPluginMigrationSchema.parse(pending)]));
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
}
/** Only the migration owner can resolve a pending record after its work completes. */
async function recordDeferredPluginMigrations(params) {
	if (params.pending.length === 0 && !params.resolvedPluginIds?.length) return;
	const input = structuredClone({
		pending: params.pending,
		resolvedPluginIds: params.resolvedPluginIds,
		expectedPending: params.expectedPending
	});
	const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-D_2q8UjY.mjs");
	const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-operation-BTGhc6YK.mjs");
	return withPluginLifecycleLease({ env: params.env }, async (lease) => {
		const context = captureOpenClawStateWorkerContext({
			env: params.env,
			path: lease.databasePath
		});
		const result = await runWithOpenClawStateLeaseWorker(lease.stateLease, context, (scope, identity) => scope.execute({
			type: "plugins.deferredMigrations.record",
			input: {
				identity,
				...input
			}
		}), { assertCurrent: () => lease.assertCurrent() });
		if (result.kind === "conflict") throw new DeferredPluginMigrationConflictError(result.pending);
		if (result.kind === "invalid") throw new ZodError(result.issues);
		const transitions = result.transitions;
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
	});
}
//#endregion
export { prepareDeferredPluginMigrationRuntime as a, readDeferredPluginMigrations as c, recordDeferredPluginMigrationsInTransaction as d, withDeferredPluginConfigCompletion as f, mergeDeferredPluginMigration as i, readDeferredPluginMigrationsAsync as l, withDeferredPluginMigrationsCurrent as m, assertDeferredPluginMigrationsCurrent as n, readConfigWritePendingMigrations as o, withDeferredPluginConfigRollback as p, formatDeferredPluginMigration as r, readDeferredPluginMigrationCompletions as s, DeferredPluginMigrationConflictError as t, recordDeferredPluginMigrations as u };
