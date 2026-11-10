import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as runWithSqliteCleanup, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { Dr as ZodError, Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as closeTrackedStateDatabase, r as openTrackedStateDatabase } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as withStateDatabaseSchemaMaintenance } from "./state-database-maintenance-DQhfapFw.mjs";
import { t as assertStateReadSchema } from "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import { n as runManagedStateTransaction } from "./openclaw-state-db-transaction-BR8tupS1.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { o as recordLegacyMigrationRun } from "./state-migrations.receipts-CikBNdPu.mjs";
import { o as invalidateSuccessfulMigrationCheckpointsInTransaction } from "./startup-migration-checkpoint-C0_lkd8F.mjs";
import { existsSync } from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/deferred-plugin-migrations.contract.ts
const deferredPluginMigrationSchema = object({
	pluginId: string().min(1),
	reason: string().min(1),
	command: string().min(1),
	requiresStateMigration: literal(true).optional(),
	requiresDoctorInspection: literal(true).optional(),
	configPaths: array(array(string().min(1)).min(1)).optional(),
	validationExcludedPaths: array(array(string().min(1)).min(1)).optional()
});
function sameDeferredPluginMigrationInputs(current, expected) {
	const inputs = (pending) => pending.map(({ reason: _reason, command: _command, ...fields }) => fields);
	return isDeepStrictEqual(inputs(current), inputs(expected));
}
//#endregion
//#region src/infra/deferred-plugin-migrations.ts
const RUN_PREFIX = "deferred-plugin-migration:";
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
/** Ordinary writes consume canonical config; only migration owners supply pending facts. */
async function readConfigWritePendingMigrations(configPath, env, preparedPending) {
	const completion = configMigrationCompletion.getStore();
	if (!completion || completion.configPath !== configPath) return preparedPending;
	completion.assertCurrent();
	if (completion.published) return await readDeferredPluginMigrationsAsync({ env });
	return completion.expectedPending.filter((entry) => !completion.resolvedPluginIds.includes(entry.pluginId));
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
	if (!sameDeferredPluginMigrationInputs(current, expected)) throw new DeferredPluginMigrationConflictError(current);
}
function readDeferredPluginMigrations(options = {}) {
	return (options.artifactPreservingReadOnly === false ? withExistingOpenClawStateDatabaseReadOnly : withExistingOpenClawStateDatabaseArtifactPreservingReadOnly)(({ db }) => readPendingMigrationRecords(db), options) ?? [];
}
/** Prime resolution in this module before the updater replaces its package. */
async function prepareDeferredPluginMigrationRuntime() {
	const { prepareOpenClawStateLeaseWorkerRuntime } = await import("./openclaw-state-lease-worker-operation-8gGJurRc.mjs");
	await Promise.all([
		import("./openclaw-state-worker-store-1jCE83ab.mjs"),
		import("./plugin-lifecycle-lease-C4DiOvV_.mjs"),
		prepareOpenClawStateLeaseWorkerRuntime()
	]);
}
/** Keep Doctor and update inspection off the main thread without creating state. */
async function readDeferredPluginMigrationsAsync(options = {}) {
	const read = () => executeExistingOpenClawStateRead(options, {
		type: "plugins.deferredMigrations.read",
		input: void 0
	});
	const reply = await (options.artifactPreservingReadOnly === false ? read() : withArtifactPreservingStateReads(read));
	if (!reply) return [];
	return reply.pending;
}
/** Completion receipts resolve historical warnings without loading their retired reports. */
function readDeferredPluginMigrationCompletions(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (!tableExists(db, "migration_runs")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("migration_runs").select(["id", "finished_at"]).where("id", "like", `${RUN_PREFIX}%`).where("status", "in", ["completed", "superseded"])).rows.flatMap(({ id, finished_at }) => finished_at === null ? [] : [{
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
	if (expectedPending === void 0) return publish();
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
		if (!sameDeferredPluginMigrationInputs(pending, expectedPending) && params.onConflict) return params.onConflict(pending);
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
	const settlements = new Map(params.settlements?.map((entry) => [entry.pluginId, entry]));
	for (const pluginId of /* @__PURE__ */ new Set([...params.resolvedPluginIds ?? [], ...settlements.keys()])) {
		const runId = `${RUN_PREFIX}${pluginId}`;
		const previous = rows.get(runId);
		if (pendingById.has(pluginId) || !previous) continue;
		const settlement = settlements.get(pluginId);
		recordLegacyMigrationRun(db, {
			runId,
			startedAt: now,
			finishedAt: now,
			status: settlement?.status ?? "completed",
			reportJson: settlement ? JSON.stringify({
				...deferredPluginMigrationSchema.parse(JSON.parse(previous.report_json)),
				reason: settlement.reason
			}) : previous.report_json,
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
	if (params.pending.length === 0 && !params.resolvedPluginIds?.length && !params.settlements?.length) return;
	const input = structuredClone({
		pending: params.pending,
		resolvedPluginIds: params.resolvedPluginIds,
		settlements: params.settlements,
		expectedPending: params.expectedPending
	});
	const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-C4DiOvV_.mjs");
	const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-operation-8gGJurRc.mjs");
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
		for (const pluginId of transitions.resolved) {
			const settlement = params.settlements?.find((entry) => entry.pluginId === pluginId);
			log.info(`Deferred state migration ${settlement ? "settled" : "completed"} for plugin "${pluginId}".`, {
				pluginId,
				status: settlement?.status ?? "completed",
				...settlement ? { reason: settlement.reason } : {}
			});
		}
		return transitions.pending;
	});
}
//#endregion
export { prepareDeferredPluginMigrationRuntime as a, readDeferredPluginMigrations as c, recordDeferredPluginMigrationsInTransaction as d, withDeferredPluginConfigCompletion as f, mergeDeferredPluginMigration as i, readDeferredPluginMigrationsAsync as l, withDeferredPluginMigrationsCurrent as m, assertDeferredPluginMigrationsCurrent as n, readConfigWritePendingMigrations as o, withDeferredPluginConfigRollback as p, formatDeferredPluginMigration as r, readDeferredPluginMigrationCompletions as s, DeferredPluginMigrationConflictError as t, recordDeferredPluginMigrations as u };
