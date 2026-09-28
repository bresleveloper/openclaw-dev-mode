import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { i as setSqliteBusyTimeout, n as readSqliteBusyTimeout, r as runWithSqliteBusyTimeout, t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync, n as logSlowSqliteCoordinatorWait, o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { l as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { a as tableHasColumns, i as tableHasColumn, r as tableExists, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { i as LAZY_ADDITIVE_STATE_TABLES, o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { a as readSqliteUserVersion, i as isSqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
import { l as createSqliteWalReclamationResult, n as configureSqlitePreSchemaPragmas, t as configureSqliteConnectionPragmas } from "./sqlite-wal-BzoPsBh0.mjs";
import { E as StateSchemaMutationConflictError, s as acquireStateDatabaseCoordinator, v as resolveStateLifecycleRuntimeDirectory, w as withStateSchemaFence } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { r as prepareSqliteReadOnlyLocationSync, t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as getOpenClawDatabaseMaintenanceScope, s as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-C_0BsNDD.mjs";
import { a as isTerminalSqliteIntegrityError, c as sqliteIntegrityCheckSteps, n as assertSqliteIntegrity, r as assertSqliteTableIntegrity, s as runSqliteIntegrityOperationSync, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { g as recordOpenClawStateDatabaseOpenFailure, i as clearOpenClawStateDatabaseOpenFailure, p as openClawStateDatabaseCache, w as openTrackedStateDatabase } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { c as warnAgentPathMigration, o as resolveOpenClawStateSqliteDir, s as resolveOpenClawStateSqlitePath, t as describeAgentPathMigration } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as clearOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-BBmdpwTz.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { c as readSqliteSchemaCookie, n as assertSqliteSchemaTablesPresent, o as getCanonicalSqliteNamedIndexContracts, r as collectSqliteNamedIndexContract, s as getCanonicalSqliteTableNames } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { i as readStateSchemaMigrationVersion, n as assertSupportedStateSchemaVersion, r as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-DX12nO8l.mjs";
import { a as recordExistingOpenClawStateSchemaDatabase, i as isExistingOpenClawStateSchema, n as assertOpenClawStateSchemaRepairAllowed } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { $ as repairLegacyTaskDeliveryStatuses, A as openClawStateMigrationAssertions, B as getOpenClawStateRuntimeSchema, D as assertOpenClawStateDatabaseOwner, Dt as migrateLegacyCronRunLogsToTaskRuns, E as assertOpenClawStateDatabaseForMaintenance, Et as ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS, F as writeCurrentStateSchemaMetadata, G as backfillCronRunLogEntryJson, J as repairLegacySubagentExecutionPayloads, K as backfillDeliveryQueueEntriesFromEntryJson, L as readStateSchemaPublicationBlocker, M as resolveDatabasePath, N as runStateSchemaMigrationTransaction, O as executeCanonicalStateSchema, P as versionedStateMigrations, Q as repairLegacyTaskAgentAttribution, T as repairAuditEventsSchema, Tt as CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS, U as backfillAcpReplayEstimatedBytes, W as backfillCronJobsFromJobJson, X as repairLegacySubagentSuspensionReasons, Y as repairLegacySubagentRetainedResults, Z as repairLegacySubagentTaskBindings, _ as repairLegacyGatewayRestartHandoffsForStrictMigration, b as migrateSessionWatchCursorProvenance, c as assertNoLegacyStateRuntimeRepair, d as assertCanonicalStateSchemaShape, et as repairOperatorApprovalSchema, g as repairAgentDatabasesCompositePrimaryKey, h as migrateWorkerPlacementExecutionModeSchema, j as prepareStateDatabaseSchemaRepair, k as markCurrentStateSchemaVersion, l as isOpenClawStateSchemaFastPathEligible, m as migrateAgentDatabaseRelativePaths, o as assertExistingOpenClawStateRuntimeSchema, p as dropLegacyStateTables, q as ensureOperatorApprovalResolutionRefs, r as openOpenClawStateReadConnection, s as assertCurrentStateRuntimeSchema, tt as OPENCLAW_STATE_SCHEMA_SQL, u as needsOpenClawStateDatabaseSchemaRepair, v as logRetiredStateTableMigration, w as migrateSingletonStateFoldInV12, wt as CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS, x as needsSessionWatchCursorProvenanceMigration, y as runRetiredStateTableMigrations } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-Cy4xw-oI.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { a as assertOpenClawStateWriteAllowed, f as runWithOpenClawStateWriteAccess, l as isOpenClawStateWriteContentionError, n as OpenClawStateOwnershipError } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-CIfR48BB.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { n as migrateSqliteSchemaToStrictInTransaction } from "./sqlite-strict-DxDkCm9i.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import "./openclaw-state-db-schema-discovery-DeDrkSPY.mjs";
import fs, { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { performance as performance$1 } from "node:perf_hooks";
//#region src/state/openclaw-state-db-write-coordination.ts
const coordinatedStateTransactions = resolveGlobalSingleton(Symbol.for("openclaw.coordinatedStateTransactions"), () => /* @__PURE__ */ new WeakSet());
function withSharedStateWriteCoordinator(params, operation) {
	if (params.existing?.isTransaction && !coordinatedStateTransactions.has(params.existing)) throw new Error("Cannot join an uncoordinated shared-state transaction; enter through runOpenClawStateWriteTransaction before BEGIN.");
	const started = performance.now();
	let coordinator;
	try {
		coordinator = acquireStateDatabaseCoordinator({
			databasePath: params.databasePath,
			busyTimeoutMs: params.busyTimeoutMs ?? (params.existing ? readSqliteBusyTimeout(params.existing) : 5e3)
		});
	} finally {
		logSlowSqliteCoordinatorWait(performance.now() - started, {
			databaseLabel: params.databasePath,
			operationLabel: params.operationLabel ?? "state.write"
		});
	}
	return runWithSqliteCoordinator(coordinator, params.operationLabel ?? "state.write", operation);
}
function runCoordinatedStateTransaction(database, operation, options) {
	return withSqlitePostCommitPublications(database, () => {
		const outer = !database.isTransaction;
		if (outer) coordinatedStateTransactions.add(database);
		try {
			return runSqliteImmediateTransactionSync(database, operation, options);
		} finally {
			if (outer) coordinatedStateTransactions.delete(database);
		}
	});
}
//#endregion
//#region src/state/openclaw-state-db-permissions.ts
const OPENCLAW_STATE_DIR_MODE = 448;
const OPENCLAW_STATE_FILE_MODE = 384;
const stateDbLog$2 = createSubsystemLogger("state/db");
/** Targets already warned about, so chmod-less filesystems warn once per path. */
const chmodWarnedTargets = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function bestEffortChmodSync(target, mode) {
	const result = applyPrivateModeSync(target, mode);
	if (result.applied || chmodWarnedTargets.check(target)) return;
	stateDbLog$2.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env) {
	const dir = path.dirname(pathname);
	const defaultDir = resolveOpenClawStateSqliteDir(env);
	const isDefaultStateDatabase = path.resolve(pathname) === path.resolve(resolveOpenClawStateSqlitePath(env));
	if (isDefaultStateDatabase && dir !== defaultDir) throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_STATE_DIR_MODE
	});
	if (isDefaultStateDatabase || !dirExisted) bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) if (existsSync(candidate)) try {
		bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
	} catch (error) {
		if (candidate === pathname || !hasErrnoCode(error, "ENOENT")) throw error;
	}
}
//#endregion
//#region src/state/openclaw-state-db-open.ts
const stateDbLog$1 = createSubsystemLogger("state/db");
function assertStateDatabaseIntegrityBeforeMutation(database, pathname) {
	const contentVersion = readStateSchemaMigrationVersion(database);
	const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
	if (contentVersion === 0 && hasApplicationSchema || contentVersion > 0 && contentVersion < 18) stateDbLog$1.info("state database schema migration pending; verifying integrity first", {
		fromVersion: contentVersion,
		path: pathname,
		toVersion: 18
	});
	if (contentVersion !== 18) assertSqliteIntegrity(database, pathname);
}
function openUnpublishedStateDatabase(params) {
	const { busyTimeoutMs, lockFailureReporting } = params;
	const runtimeDirectory = resolveStateLifecycleRuntimeDirectory();
	const original = params.existingSchema ? statSync(params.pathname) : void 0;
	if (original && !original.isFile()) throw new Error(`Existing shared-state database must be a regular file: ${params.pathname}`);
	const assertSameFile = () => {
		if (original) {
			const current = statSync(params.pathname);
			if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino) throw new Error(`Existing shared-state database generation changed: ${params.pathname}`);
		}
	};
	if (!params.existingSchema) ensureOpenClawStatePermissions(params.pathname, params.env);
	const db = openTrackedStateDatabase(params.pathname, { existingOnly: params.existingSchema });
	let walMaintenance;
	try {
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, busyTimeoutMs);
		if (params.existingSchema) {
			assertSameFile();
			params.ensureSchema(db);
			assertSameFile();
			return {
				db,
				path: params.pathname,
				walMaintenance: {
					checkpoint: () => false,
					close: () => true,
					reclaimFreePages: createSqliteWalReclamationResult
				}
			};
		}
		const maintenance = runWithSqliteBusyTimeout(db, busyTimeoutMs, () => {
			assertSupportedStateSchemaVersion(db, params.pathname);
			assertStateDatabaseIntegrityBeforeMutation(db, params.pathname);
			configureSqlitePreSchemaPragmas(db, { busyTimeoutMs });
			walMaintenance = configureSqliteConnectionPragmas(db, {
				busyTimeoutMs,
				databaseLabel: "openclaw-state",
				databasePath: params.pathname,
				onCheckpointError: (error) => stateDbLog$1.warn("Shared-state WAL maintenance failed", {
					error: formatErrorMessage(error),
					path: params.pathname,
					checkpoint: walMaintenance?.health
				}),
				runMaintenance: (operation) => runWithSqliteCoordinator(acquireStateDatabaseCoordinator({
					databasePath: params.pathname,
					runtimeDirectory,
					busyTimeoutMs: 0
				}), "shared-state WAL maintenance", operation),
				foreignKeys: true,
				synchronous: "NORMAL"
			});
			params.ensureSchema(db);
			return walMaintenance;
		}, { lockFailureReporting });
		ensureOpenClawStatePermissions(params.pathname, params.env);
		return {
			db,
			path: params.pathname,
			walMaintenance: maintenance
		};
	} catch (error) {
		const errors = openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle({
			db,
			path: params.pathname,
			walMaintenance
		});
		if (error instanceof Error && (isSqliteSchemaVersionError(error) || isTerminalSqliteIntegrityError(error))) params.recordOpenFailure(params.pathname, error);
		if (errors.length > 0) throw createSqliteLifecycleAggregateError([error, ...errors], `OpenClaw state database acquisition and cleanup failed for ${params.pathname}.`, error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-index-schema.ts
const SQLITE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
/**
* Verify the whole file once, then use table scans only to locate repairable
* index damage. Healthy opens must not multiply integrity work by table count.
*/
function verifyAndRepairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	return runSqliteIntegrityOperationSync(verifyAndRepairCanonicalSqliteIndexSteps(db, databaseLabel, schemaSql, options));
}
function* verifyAndRepairCanonicalSqliteIndexSteps(db, databaseLabel, schemaSql, options = {}) {
	const { diagnostics, reuseIntegrity, ...repairOptions } = options;
	let integrityFailure;
	try {
		if (reuseIntegrity) {
			if (diagnostics) diagnostics.integrityGateOutcome = "cached";
		} else yield* sqliteIntegrityCheckSteps(db, databaseLabel, diagnostics);
	} catch (error) {
		if (!(error instanceof Error) || !isTerminalSqliteIntegrityError(error)) throw error;
		integrityFailure = error;
	}
	const indexesStartedAt = performance$1.now();
	const repairedIndexes = repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, {
		...repairOptions,
		verifyPhysicalIntegrity: integrityFailure !== void 0
	});
	if (integrityFailure && repairedIndexes.length === 0) throw integrityFailure;
	if (diagnostics) {
		diagnostics.canonicalIndexMs = Math.floor(performance$1.now() - indexesStartedAt);
		diagnostics.repairedIndexCount = repairedIndexes.length;
	}
	return repairedIndexes;
}
/**
* Restore every named index when SQLite's IF NOT EXISTS semantics preserve a
* same-name definition or b-tree that no longer matches the committed schema.
*/
function repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	const indexes = getCanonicalSqliteNamedIndexContracts(schemaSql);
	const indexesByTable = /* @__PURE__ */ new Map();
	const integrityFailuresByTable = /* @__PURE__ */ new Map();
	const repairIndexes = /* @__PURE__ */ new Set();
	for (const index of indexes) {
		assertSqliteIdentifier(index.name);
		assertSqliteIdentifier(index.tableName);
		if (!db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ?").get(index.tableName)) continue;
		const tableIndexes = indexesByTable.get(index.tableName) ?? [];
		tableIndexes.push(index);
		indexesByTable.set(index.tableName, tableIndexes);
		if (!isEqual(collectSqliteNamedIndexContract(db, index.name), index.fingerprint)) repairIndexes.add(index);
	}
	assertNoUnexpectedUniqueIndexes(db, databaseLabel, schemaSql, indexesByTable);
	if (options.verifyPhysicalIntegrity !== false) for (const [tableName, tableIndexes] of indexesByTable) try {
		assertSqliteTableIntegrity(db, databaseLabel, tableName);
	} catch (error) {
		if (error instanceof Error) integrityFailuresByTable.set(tableName, error);
		for (const index of tableIndexes) repairIndexes.add(index);
	}
	if (repairIndexes.size === 0) return [];
	const savepoint = "repair_canonical_indexes";
	let activeIndex;
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		for (const index of repairIndexes) {
			activeIndex = index;
			const probeName = findUnusedProbeIndexName(db, index.name);
			try {
				db.exec(createIndexSql(index, probeName, true));
			} catch (error) {
				if (options.allowMissingColumns && isMissingColumnError(error)) {
					repairIndexes.delete(index);
					continue;
				}
				throw error;
			}
			db.exec(`DROP INDEX IF EXISTS main.${index.name};`);
			db.exec(createIndexSql(index, index.name, true));
			db.exec(`DROP INDEX main.${probeName};`);
		}
		if (repairIndexes.size === 0) {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
			return [];
		}
		for (const tableName of indexesByTable.keys()) assertSqliteTableIntegrity(db, databaseLabel, tableName);
		assertSqliteIntegrity(db, databaseLabel);
		options.validateAfterRepair?.();
		db.exec(`RELEASE SAVEPOINT ${savepoint};`);
	} catch (error) {
		try {
			db.exec(`ROLLBACK TO SAVEPOINT ${savepoint};`);
		} finally {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
		}
		if (error instanceof Error && isTerminalSqliteIntegrityError(error)) throw error;
		const tableIntegrityFailure = activeIndex ? integrityFailuresByTable.get(activeIndex.tableName) : void 0;
		if (tableIntegrityFailure && isTerminalSqliteIntegrityError(tableIntegrityFailure)) throw tableIntegrityFailure;
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`SQLite canonical index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`, { cause: error });
	}
	return [...repairIndexes].map((index) => index.name).toSorted();
}
function assertNoUnexpectedUniqueIndexes(db, databaseLabel, schemaSql, indexesByTable) {
	for (const tableName of getCanonicalSqliteTableNames(schemaSql)) {
		assertSqliteIdentifier(tableName);
		if (!db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ?").get(tableName)) continue;
		const canonicalIndexNames = new Set((indexesByTable.get(tableName) ?? []).map((index) => index.name));
		const unexpected = db.prepare(`PRAGMA main.index_list(${tableName})`).all().find((index) => index.unique === 1 && index.origin === "c" && !canonicalIndexNames.has(index.name));
		if (unexpected) throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: unexpected unique index ${unexpected.name}`);
	}
}
function createIndexSql(index, name, qualifyMain) {
	assertSqliteIdentifier(name);
	return `${index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX"} ${qualifyMain ? `main.${name}` : name} ${index.definition};`;
}
function findUnusedProbeIndexName(db, canonicalName) {
	const prefix = `openclaw_probe_${canonicalName}`;
	for (let suffix = 0; suffix < 100; suffix += 1) {
		const candidate = suffix === 0 ? prefix : `${prefix}_${suffix}`;
		if (!db.prepare("SELECT 1 AS found FROM main.sqlite_schema WHERE name = ?").get(candidate)) return candidate;
	}
	throw new Error(`could not allocate a probe index name for ${canonicalName}`);
}
function assertSqliteIdentifier(identifier) {
	if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) throw new Error(`invalid SQLite identifier: ${identifier}`);
}
function isMissingColumnError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /^no such column:/iu.test(error.message);
}
function isEqual(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
//#endregion
//#region src/state/openclaw-state-db-task-identifiers.ts
/** Doctor and legacy imports own normalization; runtime reads use indexed equality. */
function repairLegacyTaskIdentifiers(db) {
	if (!tableExists(db, "task_runs")) return;
	runSqliteImmediateTransactionSync(db, () => {
		const queries = getNodeSqliteKysely(db);
		const tasks = executeSqliteQuerySync(db, queries.selectFrom("task_runs").select([
			"task_id",
			"run_id",
			"child_session_key"
		])).rows;
		const changed = tasks.filter((task) => task.run_id !== (normalizeOptionalString(task.run_id) ?? null) || task.child_session_key !== (normalizeOptionalString(task.child_session_key) ?? null));
		const runs = /* @__PURE__ */ new Map();
		const changedRunIds = new Set(changed.filter((task) => task.run_id !== (normalizeOptionalString(task.run_id) ?? null)).map((task) => task.run_id));
		const taskChildKeys = new Set(tasks.map((task) => normalizeOptionalString(task.child_session_key)));
		for (const task of tasks) {
			const key = normalizeOptionalString(task.run_id);
			if (!key) continue;
			const previous = runs.get(key);
			if (previous && previous.run_id !== task.run_id) throw new Error(`Cannot normalize task run identifier: tasks ${JSON.stringify(previous.task_id)} and ${JSON.stringify(task.task_id)} have distinct run IDs that become ${JSON.stringify(key)}. Resolve the conflicting bindings before retrying Doctor; no rows were changed.`);
			runs.set(key, task);
		}
		if (tableExists(db, "subagent_runs")) for (const row of iterateSqliteQuerySync(db, queries.selectFrom("subagent_runs").select([
			"run_id",
			"child_session_key",
			"payload_json"
		]))) {
			const childKey = normalizeOptionalString(row.child_session_key);
			const nextChildKey = childKey && taskChildKeys.has(childKey) ? childKey : row.child_session_key;
			const changeChild = nextChildKey !== row.child_session_key;
			const stored = safeParseJsonRecord(row.payload_json);
			const payload = stored && isRecord(stored.parentCompletion) && stored.parentCompletion.completionTarget === "parent" ? stored.parentCompletion : stored;
			if (!payload) {
				if (changeChild || changedRunIds.has(row.run_id)) throw new Error(`Cannot normalize task run identifier for subagent ${JSON.stringify(row.run_id)}: its completion payload is unreadable. Repair that record before retrying Doctor; no rows were changed.`);
				continue;
			}
			const previousRunId = normalizeOptionalString(payload.taskRunId) ?? row.run_id;
			const taskRunId = normalizeOptionalString(previousRunId);
			const task = taskRunId ? runs.get(taskRunId) : void 0;
			if (task && task.run_id !== taskRunId && task.run_id !== previousRunId || !taskRunId && changedRunIds.has(previousRunId)) throw new Error(`Cannot normalize task run identifier for subagent ${JSON.stringify(row.run_id)}: normalization would change its existing task binding. Resolve the conflicting bindings before retrying Doctor; no rows were changed.`);
			const changeRun = task?.run_id === previousRunId && taskRunId !== previousRunId;
			if (!changeRun && !changeChild) continue;
			if (changeRun) payload.taskRunId = taskRunId;
			if (changeChild) {
				payload.childSessionKey = nextChildKey;
				if (isRecord(payload.delivery) && isRecord(payload.delivery.payload) && payload.delivery.payload.childSessionKey === row.child_session_key) payload.delivery.payload.childSessionKey = nextChildKey;
			}
			executeSqliteQuerySync(db, queries.updateTable("subagent_runs").set({
				child_session_key: nextChildKey,
				payload_json: JSON.stringify(stored)
			}).where("run_id", "=", row.run_id));
		}
		for (const task of changed) executeSqliteQuerySync(db, queries.updateTable("task_runs").set({
			run_id: normalizeOptionalString(task.run_id) ?? null,
			child_session_key: normalizeOptionalString(task.child_session_key) ?? null
		}).where("task_id", "=", task.task_id));
	});
}
//#endregion
//#region src/state/openclaw-state-db-schema-additive.ts
const repositoryWorkspacePendingSchemas = /* @__PURE__ */ new WeakSet();
const taskExecutionOwnerSchemas = /* @__PURE__ */ new WeakSet();
function ensureTaskExecutionOwnerSchema(database) {
	if (taskExecutionOwnerSchemas.has(database)) return;
	if (!tableHasColumns(database, "task_runs", [
		"execution_owner_host",
		"execution_owner_pid",
		"execution_owner_start_identity"
	])) {
		ensureColumn(database, "task_runs", "execution_owner_host TEXT");
		ensureColumn(database, "task_runs", "execution_owner_pid INTEGER");
		ensureColumn(database, "task_runs", "execution_owner_start_identity INTEGER");
	}
	const rememberSchema = () => taskExecutionOwnerSchemas.add(database);
	if (database.isTransaction) deferSqlitePostCommitPublication(database, rememberSchema);
	else rememberSchema();
}
function hasRepositoryWorkspacePendingResultSchema(database) {
	if (repositoryWorkspacePendingSchemas.has(database)) return true;
	const exists = tableHasColumn(database, "worker_workspace_pending_results", "repository_workspace_id");
	if (exists && !database.isTransaction) repositoryWorkspacePendingSchemas.add(database);
	return exists;
}
function ensureRepositoryWorkspacePendingResultSchema(database) {
	if (!hasRepositoryWorkspacePendingResultSchema(database)) ensureColumn(database, "worker_workspace_pending_results", "repository_workspace_id TEXT");
}
function ensureSessionRepositoryWorkspaceSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "session_repository_workspaces", { errorMessage: "Repository workspace schema marker is missing." }));
}
function ensureRepositoryGitHubPublicationSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "github_repository_publication_requests", {
		endMarker: "ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;",
		errorMessage: "Repository GitHub publication schema marker is missing."
	}));
}
function ensureGitHubPublicationSessionLifecycleSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "github_publication_session_lifecycles", { errorMessage: "GitHub publication lifecycle schema marker is missing." }));
}
/** Lazily install the additive secret store table and index on first write. */
function ensureSecretStoreSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "secret_store_entries", {
		endMarker: "ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;",
		errorMessage: "OpenClaw secret store schema marker is missing."
	}));
	ensureColumn(database, "secret_store_entries", "allowed_hosts TEXT");
}
/** Lazily install durable MCP OAuth callback correlation on first feature use. */
function ensureMcpOAuthPendingSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "mcp_oauth_pending_authorizations", { errorMessage: "OpenClaw MCP OAuth pending schema marker is missing." }));
}
/** Lazily install the additive device join-code table on first mint or redemption. */
function ensureDevicePairingJoinCodeSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "device_pairing_join_codes", { errorMessage: "OpenClaw device pairing join-code schema marker is missing." }));
}
/** Lazily installs the Gateway's installation-local config revision key owner. */
function ensureConfigRevisionKeySchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "config_revision_keys", { errorMessage: "OpenClaw config revision key schema marker is missing." }));
}
function ensureAgentDeletionJournalSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "agent_deletion_journal"));
}
function ensureAgentDatabaseLeaseSchema(database) {
	ensureAgentDeletionJournalSchema(database);
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "agent_database_leases"));
}
/**
* Same-version additive table, registered in LAZY_ADDITIVE_STATE_TABLES so
* existing v6 databases stay valid without it. Uses the canonical schema;
* a downgraded reader simply loses setup-completion reconciliation.
*/
function ensureDevicePairSetupCompletionSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "device_pair_setup_completions"));
}
/** Lazily add setup correlation only when setup pairing first writes or consumes a token. */
function ensureDevicePairSetupBootstrapSchema(database) {
	ensureColumn(database, "device_bootstrap_tokens", "setup_id TEXT");
}
/** Installs environment-owned node binding columns at first cloud enrollment use. */
function ensureWorkerEnvironmentNodeEnrollmentSchema(database) {
	ensureDevicePairSetupCompletionSchema(database);
	ensureColumn(database, "worker_environments", "node_setup_id TEXT");
	ensureColumn(database, "worker_environments", "node_device_id TEXT");
}
/** Register fixed build ownership on the dedicated node's current transaction. */
function ensureNodeWorkerPreparedWorkspaceSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "node_worker_prepared_workspaces", { errorMessage: "Node prepared workspace schema marker is missing." }));
}
function resolveLegacyManagedImageRoot(recordJson) {
	if (typeof recordJson !== "string") return null;
	let record;
	try {
		record = JSON.parse(recordJson);
	} catch {
		return null;
	}
	if (!isRecord(record) || !isRecord(record.original)) return null;
	const mediaRoot = record.original.mediaRoot;
	if (typeof mediaRoot === "string" && mediaRoot.trim()) return path.resolve(mediaRoot);
	const originalPath = record.original.path;
	if (typeof originalPath !== "string" || !originalPath.trim()) return null;
	const resolvedOriginalPath = path.resolve(originalPath);
	return path.dirname(path.dirname(path.dirname(resolvedOriginalPath)));
}
function backfillLegacyManagedImageRoots(db) {
	const rows = db.prepare("SELECT attachment_id, record_json FROM managed_outgoing_image_records").all();
	const updateRoot = db.prepare("UPDATE managed_outgoing_image_records SET original_media_root = ? WHERE attachment_id = ?");
	const deleteRecord = db.prepare("DELETE FROM managed_outgoing_image_records WHERE attachment_id = ?");
	for (const row of rows) {
		const mediaRoot = resolveLegacyManagedImageRoot(row.record_json);
		if (mediaRoot) updateRoot.run(mediaRoot, row.attachment_id);
		else deleteRecord.run(row.attachment_id);
	}
}
function ensureWorkerSessionToolStateSchema(db) {
	db.exec([extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "worker_turn_tool_authorities"), extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "worker_session_tool_operations")].join("\n"));
}
function ensureGitHubPublicationSchema(db) {
	db.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "github_publication_requests", { endMarker: "ON github_publication_requests(status, updated_at_ms, request_id);" }));
}
/** First personal publication write only; status and old readers leave this surface dormant. */
function ensurePersonalGitHubPublicationSchema(db) {
	db.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "github_personal_publication_requests", {
		endMarker: "ON github_personal_publication_requests(status, updated_at_ms, request_id);",
		errorMessage: "Personal GitHub publication schema marker is missing."
	}));
}
/**
* Add the feature-owned first-use columns that a STRICT rebuild cannot skip.
*
* These columns normally stay absent until their owning feature first writes
* them, and the persistent schema contract accepts that shape. The STRICT
* table rebuild is the one caller that cannot: it recreates each table from
* canonical SQL, which already declares these columns, so a database missing
* them fails the canonical column check and rolls the entire repair back.
* Ensuring them immediately before that rebuild matches the shape the rebuild
* produces anyway, and stays scoped to databases old enough to need it.
*/
function ensureFirstUseAdditiveStateColumnsForStrictMigration(db) {
	for (const { columnName, dataType, tableName } of CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
}
function ensureColumns(db, definitions) {
	const added = [];
	for (const [tableName, definition] of definitions) {
		const columnName = definition.trim().split(/\s+/, 1)[0];
		if (columnName && ensureColumn(db, tableName, definition)) added.push({
			tableName,
			columnName
		});
	}
	return added;
}
/** Runtime pairs new columns with their transforms; full historical repair stays explicit. */
function ensureAdditiveStateColumns(db, scope) {
	const repairHistoricalRows = scope === "repair";
	ensureWorkerSessionToolStateSchema(db);
	for (const { columnName, dataType, tableName } of CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS) ensureColumn(db, tableName, `${columnName} ${dataType}`);
	if (ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageUpdatedAt[0])) db.exec("UPDATE claw_package_refs SET updated_at_ms = installed_at_ms;");
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.packageIntegrity);
	const addedDiagnosticEventSequence = ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.diagnosticSequence[0]);
	if (addedDiagnosticEventSequence) db.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `);
	if (addedDiagnosticEventSequence || repairHistoricalRows) db.exec("DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;");
	const addedCronLogColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronRunLogs);
	if (repairHistoricalRows || addedCronLogColumns.some(({ tableName }) => tableName === "cron_run_logs")) backfillCronRunLogEntryJson(db);
	if (ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.acpReplay).length > 0 || repairHistoricalRows) backfillAcpReplayEstimatedBytes(db);
	const addedCronJobColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.cronJobs);
	if (repairHistoricalRows || addedCronJobColumns.some(({ columnName }) => [
		"name",
		"enabled",
		"agent_id",
		"payload_kind",
		"runtime_updated_at_ms"
	].includes(columnName))) backfillCronJobsFromJobJson(db);
	const addedDeliveryColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.deliveryQueue);
	if (repairHistoricalRows || addedDeliveryColumns.some(({ tableName }) => tableName === "delivery_queue_entries")) backfillDeliveryQueueEntriesFromEntryJson(db);
	if (ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.originalMediaRoot[0])) backfillLegacyManagedImageRoots(db);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.beforeTaskAttribution);
	if (ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRequester[0])) repairLegacyTaskAgentAttribution(db);
	if (repairHistoricalRows) repairLegacyTaskDeliveryStatuses(db);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRunDetails);
	if (repairHistoricalRows) {
		repairLegacySubagentSuspensionReasons(db);
		repairLegacySubagentExecutionPayloads(db);
		repairLegacyTaskIdentifiers(db);
		repairLegacySubagentTaskBindings(db);
		repairLegacySubagentRetainedResults(db);
	}
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.workerEnvironments);
	if (repairHistoricalRows || !tableHasColumn(db, "operator_approvals", "resolution_ref")) ensureOperatorApprovalResolutionRefs(db);
}
//#endregion
//#region src/state/openclaw-state-db-startup-checkpoint.ts
const NATIVE_STARTUP_BOOTSTRAP_OBJECTS = /* @__PURE__ */ new Set([
	"table:device_auth_tokens",
	"index:idx_device_auth_tokens_updated",
	"table:device_identities",
	"index:idx_device_identities_device",
	"table:exec_approvals_config",
	"table:macos_port_guardian_records",
	"index:idx_macos_port_guardian_records_port",
	"table:schema_meta",
	"table:state_leases",
	"index:idx_state_leases_expiry",
	"index:idx_state_leases_owner"
]);
function isUninitializedNativeStartupDatabase(db) {
	if (readSqliteUserVersion(db) !== 0) return false;
	const objects = db.prepare("SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'").all();
	if (objects.some(({ type, name }) => typeof type !== "string" || typeof name !== "string" || !NATIVE_STARTUP_BOOTSTRAP_OBJECTS.has(`${type}:${name}`))) return false;
	const tableNames = new Set(objects.filter(({ type }) => type === "table").map(({ name }) => name));
	if (tableNames.has("schema_meta") && db.prepare("SELECT 1 FROM schema_meta LIMIT 1").get()) return false;
	return !(tableNames.has("state_leases") && db.prepare("SELECT 1 FROM state_leases LIMIT 1").get());
}
function ensureStartupMigrationCheckpointSchema(db, pathname, env) {
	runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: pathname,
			env
		});
		assertSupportedStateSchemaVersion(db, pathname);
		db.exec(`
        CREATE TABLE IF NOT EXISTS schema_meta (
          meta_key TEXT NOT NULL PRIMARY KEY,
          role TEXT NOT NULL,
          schema_version INTEGER NOT NULL,
          agent_id TEXT,
          app_version TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS state_leases (
          scope TEXT NOT NULL,
          lease_key TEXT NOT NULL,
          owner TEXT NOT NULL,
          expires_at INTEGER,
          heartbeat_at INTEGER,
          payload_json TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (scope, lease_key)
        );
        CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
          ON state_leases(expires_at, scope, lease_key)
          WHERE expires_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_state_leases_owner
          ON state_leases(owner, updated_at DESC);
      `);
		ensureColumn(db, "schema_meta", "app_version TEXT");
	}, {
		busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
		databaseLabel: pathname,
		operationLabel: "state.schema.ensure-startup-checkpoint"
	});
}
function withOpenClawStateStartupCheckpointConnection(callback, options, initializeCanonicalSchema) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env
	}, "startup migration checkpoint database operation", () => {
		ensureOpenClawStatePermissions(pathname, env);
		const db = openNodeSqliteDatabase(pathname);
		try {
			configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			const operate = () => {
				assertSqliteIntegrity(db, pathname);
				const schemaCookie = options.atomic ? readSqliteSchemaCookie(db) : void 0;
				if (isUninitializedNativeStartupDatabase(db)) initializeCanonicalSchema(db, pathname, env);
				ensureStartupMigrationCheckpointSchema(db, pathname, env);
				if (options.atomic && readSqliteSchemaCookie(db) !== schemaCookie) assertSqliteIntegrity(db, pathname);
				return callback(db);
			};
			return options.atomic ? runSqliteDeferredTransactionSync(db, operate, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: pathname,
				operationLabel: "state.startup-checkpoint.inspect-and-claim"
			}) : operate();
		} finally {
			db.close();
			ensureOpenClawStatePermissions(pathname, env);
		}
	});
}
/** Admit only recognized native bootstrap; versioned state stays on the read-only path. */
function initializeNativeOpenClawStateConnection(options, initializeCanonicalSchema) {
	assertOpenClawStateSchemaRepairAllowed(resolveDatabasePath(options));
	if (!withExistingOpenClawStateDatabaseReadOnly(({ db }) => isUninitializedNativeStartupDatabase(db), options)) return;
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env
	}, "native state bootstrap", () => {
		const db = openNodeSqliteDatabase(pathname);
		try {
			if (!isUninitializedNativeStartupDatabase(db)) return;
			assertSqliteIntegrity(db, pathname);
			initializeCanonicalSchema(db, pathname, env);
		} finally {
			clearNodeSqliteKyselyCacheForDatabase(db);
			db.close();
		}
		ensureOpenClawStatePermissions(pathname, env);
	});
}
//#endregion
//#region src/state/openclaw-state-db-schema-runtime.ts
const stateDbLog = createSubsystemLogger("state/db");
/** Runtime converges schema; historical row repair belongs to explicit Doctor maintenance. */
function ensureOpenClawStateRuntimeSchema(db, pathname, env, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, initializeNativeOnly = false) {
	if (isExistingOpenClawStateSchema(pathname, db)) {
		assertExistingOpenClawStateRuntimeSchema(db, pathname);
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: pathname,
			env
		});
		return [];
	}
	try {
		if (isOpenClawStateSchemaFastPathEligible(db, pathname)) {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			return [];
		}
	} catch (error) {
		if (!db.isOpen || error instanceof StartupMaintenanceRequiredError) throw error;
	}
	return withStateSchemaFence({ databasePath: pathname }, () => {
		const now = Date.now();
		const retiredTableChanges = [];
		const applied = runStateSchemaMigrationTransaction(db, pathname, () => {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			assertSupportedStateSchemaVersion(db, pathname);
			if (initializeNativeOnly && !isUninitializedNativeStartupDatabase(db)) return [];
			const previousVersion = readStateSchemaMigrationVersion(db);
			if (previousVersion === 18) {
				assertNoLegacyStateRuntimeRepair(db, pathname);
				const indexes = verifyAndRepairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, {
					allowMissingColumns: true,
					validateAfterRepair: () => assertCurrentStateRuntimeSchema(db, pathname)
				});
				ensureAdditiveStateColumns(db, "runtime");
				assertCurrentStateRuntimeSchema(db, pathname);
				writeCurrentStateSchemaMetadata(db, now);
				return indexes.length > 0 ? [`Rebuilt canonical shared-state SQLite indexes (${indexes.length})`] : [];
			}
			openClawStateMigrationAssertions.get(previousVersion)?.(db, { pathname });
			assertSqliteIntegrity(db, pathname);
			dropLegacyStateTables(db);
			const changes = runRetiredStateTableMigrations(db, previousVersion);
			retiredTableChanges.push(...changes);
			if (migrateSingletonStateFoldInV12(db, previousVersion)) changes.push("Folded singleton state tables into config_machine_state (v12)");
			if (migrateWorkerPlacementExecutionModeSchema(db, previousVersion)) changes.push("Migrated cloud worker placements to execution modes");
			const pathMigration = migrateAgentDatabaseRelativePaths(db, previousVersion, pathname);
			changes.push(...describeAgentPathMigration(pathMigration));
			ensureAdditiveStateColumns(db, "repair");
			for (const migration of versionedStateMigrations) if (migration.migrate(db, previousVersion)) changes.push(migration.applied);
			migrateSessionWatchCursorProvenance(db);
			assertCanonicalStateSchemaShape(db, pathname);
			executeCanonicalStateSchema(db, { includeVersionLazyAdditiveTables: true });
			migrateLegacyCronRunLogsToTaskRuns(db);
			if (previousVersion < 3) {
				repairLegacyGatewayRestartHandoffsForStrictMigration(db);
				ensureFirstUseAdditiveStateColumnsForStrictMigration(db);
				const strict = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: true }), { databaseLabel: pathname });
				if (strict.migratedTables.length > 0) changes.push(`Migrated shared state tables to SQLite STRICT typing (${strict.migratedTables.length})`);
			}
			repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false });
			writeCurrentStateSchemaMetadata(db, now);
			assertOpenClawStateDatabaseForMaintenance(db, { pathname });
			warnAgentPathMigration(stateDbLog, pathMigration, pathname);
			return changes;
		}, {
			busyTimeoutMs,
			databaseLabel: pathname,
			operationLabel: "state.schema.ensure"
		});
		retiredTableChanges.forEach(logRetiredStateTableMigration);
		return applied;
	});
}
//#endregion
//#region src/state/openclaw-state-db-task-delivery-recovery.ts
const ORPHAN_PREDICATE = "NOT EXISTS (SELECT 1 FROM task_runs WHERE task_runs.task_id = task_delivery_state.task_id)";
function orphanRows(database) {
	const statement = database.prepare(`SELECT rowid, * FROM task_delivery_state
    WHERE ${ORPHAN_PREDICATE} ORDER BY rowid`);
	statement.setReadBigInts(true);
	return statement.iterate();
}
function encodeOrphanRow(row) {
	if (typeof row.rowid !== "bigint" || typeof row.task_id !== "string" || row.requester_origin_json !== null && typeof row.requester_origin_json !== "string" || row.last_notified_event_at !== null && typeof row.last_notified_event_at !== "bigint") throw new Error("Orphan task delivery values do not match the supported recovery contract.");
	return `${JSON.stringify(row, (_key, value) => typeof value === "bigint" ? value.toString() : value)}\n`;
}
function assertRecoveryShape(database) {
	const columns = database.prepare("PRAGMA table_xinfo(task_delivery_state)").all();
	const expected = [
		{
			cid: 0,
			name: "task_id",
			type: "TEXT",
			notnull: 1,
			dflt_value: null,
			pk: 1,
			hidden: 0
		},
		{
			cid: 1,
			name: "requester_origin_json",
			type: "TEXT",
			notnull: 0,
			dflt_value: null,
			pk: 0,
			hidden: 0
		},
		{
			cid: 2,
			name: "last_notified_event_at",
			type: "INTEGER",
			notnull: 0,
			dflt_value: null,
			pk: 0,
			hidden: 0
		}
	];
	const foreignKeys = database.prepare("PRAGMA foreign_key_list(task_delivery_state)").all();
	const canonicalForeignKey = [{
		id: 0,
		seq: 0,
		table: "task_runs",
		from: "task_id",
		to: "task_id",
		on_update: "NO ACTION",
		on_delete: "CASCADE",
		match: "NONE"
	}];
	const triggers = database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND tbl_name = 'task_delivery_state'").get();
	if (JSON.stringify(columns) !== JSON.stringify(expected) || JSON.stringify(foreignKeys) !== JSON.stringify(canonicalForeignKey) || triggers) throw new Error("Orphan task delivery recovery refused an unrecognized table, foreign key, or trigger.");
}
function assertKnownOrphanIntegrity(database) {
	try {
		assertSqliteIntegrity(database, "task delivery recovery database");
		return 0;
	} catch (error) {
		if (error instanceof SqliteRepairableForeignKeyError) return error.repair.orphanCount;
		throw error;
	}
}
function syncAndHash(filePath) {
	const descriptor = fs.openSync(filePath, "r+");
	try {
		fs.fsyncSync(descriptor);
		return hashFileDescriptorSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
/**
* Caller holds Doctor's ownership/schema fences and its immediate write transaction.
* Foreign-key actions stay disabled: inbound dependents must fail the post-check,
* never cascade into unrelated data. The caller rolls back any failed check.
*/
function recoverOrphanTaskDeliveryRows(database, pathname) {
	if (!tableExists(database, "task_delivery_state") || !tableExists(database, "task_runs") || !database.prepare(`SELECT 1 FROM task_delivery_state WHERE ${ORPHAN_PREDICATE} LIMIT 1`).get()) return [];
	assertRecoveryShape(database);
	const count = assertKnownOrphanIntegrity(database);
	if (!database.isTransaction) throw new Error("Orphan task delivery recovery requires the Doctor write transaction.");
	const prepared = prepareSqliteReadOnlyLocationSync(pathname);
	let recoveryDirectory;
	try {
		const snapshot = openNodeSqliteDatabase(prepared.location);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
			assertRecoveryShape(snapshot);
			if (assertKnownOrphanIntegrity(snapshot) !== count) throw new Error("Orphan task delivery snapshot changed before preservation.");
			const sourceHash = createHash("sha256");
			const snapshotHash = createHash("sha256");
			for (const row of orphanRows(database)) sourceHash.update(encodeOrphanRow(row));
			for (const row of orphanRows(snapshot)) snapshotHash.update(encodeOrphanRow(row));
			if (sourceHash.digest("hex") !== snapshotHash.digest("hex")) throw new Error("Orphan task delivery snapshot does not preserve the current payload.");
		} finally {
			snapshot.close();
		}
		recoveryDirectory = createPrivateSqliteTempDirectorySync(path.dirname(pathname), "openclaw-task-delivery-recovery-");
		const backupPath = path.join(recoveryDirectory, "database.sqlite");
		const expectedBackup = syncAndHash(prepared.location);
		fs.copyFileSync(prepared.location, backupPath, fs.constants.COPYFILE_EXCL);
		fs.chmodSync(backupPath, 384);
		if (JSON.stringify(syncAndHash(backupPath)) !== JSON.stringify(expectedBackup)) throw new Error("Orphan task delivery backup verification failed.");
		const exportPath = path.join(recoveryDirectory, "orphan-rows.jsonl");
		const exportDescriptor = fs.openSync(exportPath, "wx+", 384);
		const exportHash = createHash("sha256");
		let exportedCount = 0;
		try {
			for (const row of orphanRows(database)) {
				const encoded = encodeOrphanRow(row);
				fs.writeFileSync(exportDescriptor, encoded);
				exportHash.update(encoded);
				exportedCount += 1;
			}
			fs.fsyncSync(exportDescriptor);
			if (hashFileDescriptorSync(exportDescriptor).sha256 !== exportHash.digest("hex")) throw new Error("Orphan task delivery export verification failed.");
		} finally {
			fs.closeSync(exportDescriptor);
		}
		if (exportedCount !== count) throw new Error("Orphan task delivery export did not account for every foreign-key violation.");
		fs.writeFileSync(path.join(recoveryDirectory, "manifest.json"), JSON.stringify({
			format: "openclaw.task-delivery-recovery.v1",
			state: "preserved-before-repair",
			sourcePath: pathname,
			backup: {
				file: "database.sqlite",
				...expectedBackup,
				integrity: "structural-ok-known-orphans"
			},
			export: {
				file: "orphan-rows.jsonl",
				...syncAndHash(exportPath),
				count,
				integerEncoding: "decimal-string"
			},
			relation: "task_delivery_state.task_id -> task_runs.task_id",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, null, 2), {
			flag: "wx",
			mode: 384,
			flush: true
		});
		requireDirectorySync(syncDirectorySync(recoveryDirectory), "Task delivery recovery directory");
		requireDirectorySync(syncDirectorySync(path.dirname(recoveryDirectory)), "Task delivery recovery parent");
		const removed = database.prepare(`DELETE FROM task_delivery_state WHERE ${ORPHAN_PREDICATE}`).run();
		if (Number(removed.changes) !== count) throw new Error("Orphan task delivery recovery removed an unexpected number of rows.");
		assertSqliteIntegrity(database, pathname);
		return [`Preserved and recovered ${count} orphan task delivery rows; backup and row export: ${recoveryDirectory}`];
	} catch (error) {
		throw new Error(`Task delivery recovery failed without committing row removal${recoveryDirectory ? `; retained artifacts: ${recoveryDirectory}` : ""}: ${String(error)}`, { cause: error });
	} finally {
		prepared.cleanup();
	}
}
//#endregion
//#region src/state/openclaw-state-db-repair.ts
function repairStateSchema(pathname, env, scope) {
	assertOpenClawStateSchemaRepairAllowed(pathname);
	ensureOpenClawStatePermissions(pathname, env);
	const db = openNodeSqliteDatabase(pathname, { enableForeignKeyConstraints: false });
	const rebuiltIndexNames = /* @__PURE__ */ new Set();
	let ownershipRefused = false;
	try {
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		if (scope === "automatic") return {
			changes: ensureOpenClawStateRuntimeSchema(db, pathname, env),
			warnings: []
		};
		const repairAdmittedSchema = prepareStateDatabaseSchemaRepair(db, pathname, env);
		if (scope === "readability") return {
			changes: runSqliteImmediateTransactionSync(db, () => {
				const changes = repairAdmittedSchema();
				if (changes.length > 0) {
					assertOpenClawStateDatabaseOwner(db, { pathname });
					assertSqliteTableIntegrity(db, pathname, "skill_workshop_collection_reviews");
				}
				return changes;
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: pathname,
				operationLabel: "state.schema.readability-repair"
			}),
			warnings: []
		};
		const applied = [];
		const changes = runStateSchemaMigrationTransaction(db, pathname, () => {
			applied.push(...recoverOrphanTaskDeliveryRows(db, pathname));
			const previousVersion = readStateSchemaMigrationVersion(db);
			const preAuditSchema = previousVersion === 1 && !tableExists(db, "audit_events");
			if (preAuditSchema) assertOpenClawStateDatabaseOwner(db, { pathname });
			if (previousVersion === 18) {
				for (const name of verifyAndRepairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowMissingColumns: true })) rebuiltIndexNames.add(name);
				assertSqliteSchemaTablesPresent(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: LAZY_ADDITIVE_STATE_TABLES });
			} else {
				openClawStateMigrationAssertions.get(previousVersion)?.(db, { pathname });
				assertSqliteIntegrity(db, pathname);
			}
			dropLegacyStateTables(db);
			applied.push(...runRetiredStateTableMigrations(db, previousVersion));
			if (migrateSingletonStateFoldInV12(db, previousVersion)) applied.push("Folded singleton state tables into config_machine_state (v12)");
			if (migrateWorkerPlacementExecutionModeSchema(db, previousVersion)) applied.push("Migrated cloud worker placements to execution modes");
			applied.push(...describeAgentPathMigration(migrateAgentDatabaseRelativePaths(db, previousVersion, pathname)));
			if (repairAgentDatabasesCompositePrimaryKey(db)) applied.push(`Migrated shared state agent database registry primary key → agent_id,path`);
			if (repairAuditEventsSchema(db)) applied.push(`Migrated shared state audit event ledger → versioned message lifecycle schema`);
			applied.push(...repairOperatorApprovalSchema(db));
			const needsSessionWatchMigration = needsSessionWatchCursorProvenanceMigration(db, previousVersion);
			const sessionWatchResult = migrateSessionWatchCursorProvenance(db);
			if (needsSessionWatchMigration) applied.push(`Migrated shared state session watch cursors → provenance column (${sessionWatchResult.migratedAmbientWatches} ambient, ${sessionWatchResult.removedLegacySentinels} sentinels removed)`);
			assertCanonicalStateSchemaShape(db, pathname);
			if (preAuditSchema || tableExists(db, "audit_events")) {
				ensureAdditiveStateColumns(db, "repair");
				for (const migration of versionedStateMigrations) if (migration.migrate(db, previousVersion)) applied.push(migration.applied);
				executeCanonicalStateSchema(db, { includeVersionLazyAdditiveTables: previousVersion !== 18 });
				migrateLegacyCronRunLogsToTaskRuns(db);
				if (previousVersion < 3) {
					repairLegacyGatewayRestartHandoffsForStrictMigration(db);
					ensureFirstUseAdditiveStateColumnsForStrictMigration(db);
				}
				const strictMigration = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: previousVersion !== 18 }), { databaseLabel: pathname });
				if (strictMigration.migratedTables.length > 0) applied.push(`Migrated shared state tables to SQLite STRICT typing (${strictMigration.migratedTables.length})`);
				for (const name of repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false })) rebuiltIndexNames.add(name);
			}
			markCurrentStateSchemaVersion(db, { createMetadataIfMissing: previousVersion < 18 });
			if (readStateSchemaContentVersion(db) === 18) assertCurrentStateRuntimeSchema(db, pathname);
			if (rebuiltIndexNames.size > 0) applied.push(`Rebuilt canonical shared-state SQLite indexes (${rebuiltIndexNames.size})`);
			return applied;
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: pathname,
			operationLabel: "state.schema.repair"
		}, () => {
			applied.push(...repairAdmittedSchema());
			configureSqliteMaintenanceCache(db);
		});
		const quarantineCleared = clearOpenClawDatabaseQuarantine(pathname, { env });
		clearOpenClawStateDatabaseOpenFailure(pathname);
		return {
			changes,
			warnings: quarantineCleared ? [] : [`Persisted quarantine record for ${pathname} could not be cleared; rerun openclaw doctor --fix so the repaired database is not refused again.`]
		};
	} catch (err) {
		if (err instanceof UpdateSchemaRefusalError) throw err;
		if (err instanceof OpenClawStateOwnershipError) {
			ownershipRefused = true;
			throw err;
		}
		return {
			changes: [],
			warnings: [`Failed migrating shared state database schema at ${pathname}: ${scope === "automatic" ? String(err) : String(err).replace(/has a legacy ([a-z ]+) schema; run openclaw doctor --fix to migrate it\./u, "has a legacy $1 schema; automatic repair refused the unrecognized schema shape.")}`]
		};
	} finally {
		if (db.isOpen) {
			clearNodeSqliteKyselyCacheForDatabase(db);
			db.close();
		}
		if (!ownershipRefused) ensureOpenClawStatePermissions(pathname, env);
	}
}
//#endregion
//#region src/state/openclaw-state-db.ts
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowed(options = {}) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(resolveDatabasePath(options), env);
}
const deferredStateDatabases = /* @__PURE__ */ new WeakSet();
function repairOpenClawStateDatabaseSchema(options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env,
		openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
	}, "state schema repair", () => withStateSchemaFence({ databasePath: pathname }, () => repairStateSchema(pathname, env, "doctor")));
}
/** Make exact legacy catalog damage readable before Doctor loads config-dependent state. */
function repairOpenClawStateDatabaseReadabilityForDoctor(options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	assertOpenClawStateDatabaseFreshOpenAllowed(options);
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env,
		openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission
	}, "Doctor state readability repair", () => withStateSchemaFence({ databasePath: pathname }, () => repairStateSchema(pathname, env, "readability")));
}
/** Preparation checks readiness; only Doctor may repair historical or quarantined state. */
function repairOpenClawStateDatabaseSchemaIfNeeded(options = {}, scope = "automatic") {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	return runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env,
		...scope === "doctor" ? { openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission } : {}
	}, "state schema repair preflight/repair", () => {
		let needsRepair = false;
		if (scope === "doctor") try {
			assertOpenClawStateDatabaseFreshOpenAllowed(options);
		} catch {
			needsRepair = true;
		}
		return needsRepair || needsOpenClawStateDatabaseSchemaRepair(pathname, scope) ? withStateSchemaFence({ databasePath: pathname }, () => repairStateSchema(pathname, env, scope)) : {
			changes: [],
			warnings: []
		};
	});
}
/** Bootstrap fresh/native-only state canonically before startup checkpoint access. */
function withOpenClawStateStartupMigrationCheckpointDatabase(callback, options = {}) {
	return withOpenClawStateStartupCheckpointConnection(callback, options, ensureOpenClawStateRuntimeSchema);
}
/** Complete native bootstrap without migrating mature shared state. */
function initializeNativeOpenClawStateDatabase(options = {}) {
	initializeNativeOpenClawStateConnection(options, (db, pathname, env) => ensureOpenClawStateRuntimeSchema(db, pathname, env, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, true));
}
/** Open existing shared state without creating, migrating, chmodding, or configuring it. */
async function openExistingOpenClawStateDatabaseReadOnly(options = {}) {
	const pathname = resolveDatabasePath(options);
	isExistingOpenClawStateSchema(pathname);
	if (!existsSync(pathname)) return;
	assertOpenClawStateDatabaseFreshOpenAllowed(options);
	const prepared = await prepareSqliteReadOnlyLocation(pathname);
	const connection = openOpenClawStateReadConnection(pathname, prepared);
	const { db } = connection.database;
	try {
		assertSupportedStateSchemaVersion(db, pathname);
		assertSqliteIntegrity(db, pathname);
		if (isExistingOpenClawStateSchema(pathname, db)) assertExistingOpenClawStateRuntimeSchema(db, pathname);
		if (readStateSchemaContentVersion(db) === 18) assertOpenClawStateDatabaseForMaintenance(db, { pathname });
	} catch (error) {
		try {
			connection.close();
		} catch {}
		throw error;
	}
	return {
		db,
		path: pathname,
		walMaintenance: {
			checkpoint: () => false,
			reclaimFreePages: createSqliteWalReclamationResult,
			close: () => connection.close()
		}
	};
}
/** Open or return a cached shared state database after schema and migration checks. */
function openOpenClawStateDatabaseWithBusyTimeout(options = {}, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, lockFailureReporting = "report") {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const env = options.env ?? process.env;
	if (options.database) {
		assertStateDatabaseSchemaAdmission(options.database);
		assertOpenClawStateWriteAllowed({
			database: options.database.db,
			databasePath: options.database.path,
			env
		});
		observeOpenClawDatabaseMaintenanceResource(options.database.db);
		openClawStateDatabaseCache.touchStateDatabase(options.database);
		return options.database;
	}
	const pathname = resolveDatabasePath(options);
	const existingSchema = isExistingOpenClawStateSchema(pathname);
	try {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
	} catch (error) {
		openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		throw error;
	}
	const cached = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (cached?.db.isOpen) {
		assertStateDatabaseSchemaAdmission(cached);
		assertOpenClawStateWriteAllowed({
			database: cached.db,
			databasePath: pathname,
			env,
			schemaReady: true
		});
		observeOpenClawDatabaseMaintenanceResource(cached.db);
		if (!existingSchema && deferredStateDatabases.has(cached.db)) {
			reconcileOpenClawStateSchemaPublication(options);
			if (readSqliteUserVersion(cached.db) === 18) deferredStateDatabases.delete(cached.db);
		}
		return cached;
	}
	try {
		assertOpenClawStateDatabaseFreshOpenAllowed(options);
	} catch (error) {
		openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		throw error;
	}
	let unpublished;
	try {
		unpublished = runWithOpenClawStateWriteAccess({
			databasePath: pathname,
			busyTimeoutMs,
			env
		}, "fresh state database open", () => {
			if (cached) openClawStateDatabaseCache.closeStaleCachedOpenClawStateDatabase(cached);
			return unpublished = openUnpublishedStateDatabase({
				pathname,
				env,
				busyTimeoutMs,
				lockFailureReporting,
				existingSchema,
				ensureSchema: (database) => ensureOpenClawStateRuntimeSchema(database, pathname, env, busyTimeoutMs),
				recordOpenFailure: recordOpenClawStateDatabaseOpenFailure
			});
		});
	} catch (error) {
		if (lockFailureReporting === "report" || !isOpenClawStateWriteContentionError(error)) openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		if (unpublished) {
			const errors = openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle(unpublished);
			if (errors.length > 0) throw createSqliteLifecycleAggregateError([error, ...errors], `Fresh OpenClaw state database open failed releasing access and closing its unpublished handle for ${pathname}.`, error);
		}
		throw error;
	}
	if (existingSchema) recordExistingOpenClawStateSchemaDatabase(unpublished.db, pathname);
	const database = openClawStateDatabaseCache.publishOpenClawStateDatabase(unpublished);
	try {
		if (!existingSchema && readSqliteUserVersion(database.db) < 18) {
			deferredStateDatabases.add(database.db);
			reconcileOpenClawStateSchemaPublication(options);
		}
		return database;
	} catch (error) {
		if (database.db.isOpen) setSqliteBusyTimeout(database.db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		throw error;
	}
}
/** Open or return a cached shared state database after schema and migration checks. */
function openOpenClawStateDatabase(options = {}) {
	return openOpenClawStateDatabaseWithBusyTimeout(options);
}
/** The Gateway watcher also publishes without requiring a new physical database open. */
function reconcileOpenClawStateSchemaPublication(options = {}) {
	if (isExistingOpenClawStateSchema(options.database?.path ?? resolveDatabasePath(options))) return;
	const pending = withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (readSqliteUserVersion(db) >= 18 || readStateSchemaContentVersion(db) < 18) return;
		return { blocker: readStateSchemaPublicationBlocker(db) };
	}, options);
	if (!pending || pending.blocker) return pending?.blocker;
	const pathname = resolveDatabasePath(options);
	try {
		return withStateSchemaFence({ databasePath: pathname }, () => runOpenClawStateWriteTransaction(({ db }) => {
			const blocker = readStateSchemaPublicationBlocker(db);
			if (blocker) return blocker;
			assertOpenClawStateDatabaseForMaintenance(db, { pathname });
			markCurrentStateSchemaVersion(db);
		}, options, { operationLabel: "state.schema.publish" }));
	} catch (error) {
		if (error instanceof StateSchemaMutationConflictError) return;
		throw error;
	}
}
/** Run one operation through the shared owner without waiting synchronously on SQLite locks. */
function runWithOpenClawStateBusyTimeout(operation, options, busyTimeoutMs) {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	const existing = options.database ?? getOpenClawStateDatabaseIfOpen(options);
	if (existing) {
		assertStateDatabaseSchemaAdmission(existing);
		return runWithSqliteBusyTimeout(existing.db, normalizedTimeoutMs, () => {
			observeOpenClawDatabaseMaintenanceResource(existing.db);
			openClawStateDatabaseCache.touchStateDatabase(existing);
			return operation(existing);
		}, { lockFailureReporting: "suppress" });
	}
	const opened = openOpenClawStateDatabaseWithBusyTimeout(options, normalizedTimeoutMs, "suppress");
	try {
		return runWithSqliteBusyTimeout(opened.db, normalizedTimeoutMs, () => operation(opened), { lockFailureReporting: "suppress" });
	} finally {
		if (opened.db.isOpen) setSqliteBusyTimeout(opened.db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
	}
}
/** Run a synchronous immediate transaction against the shared state database. */
function runOpenClawStateWriteTransaction(operation, options = {}, transactionOptions = {}) {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const existing = options.database ?? getOpenClawStateDatabaseIfOpen(options);
	if (existing) isExistingOpenClawStateSchema(existing.path, existing.db);
	return withSharedStateWriteCoordinator({
		databasePath: existing?.path ?? resolveDatabasePath(options),
		existing: existing?.db,
		...transactionOptions
	}, () => {
		let database = existing;
		let result;
		try {
			const acquired = options.database ? openOpenClawStateDatabase(options) : database ?? openOpenClawStateDatabase(options);
			database = acquired;
			result = runCoordinatedStateTransaction(acquired.db, () => {
				assertStateDatabaseSchemaAdmission(acquired);
				assertOpenClawStateWriteAllowed({
					database: acquired.db,
					databasePath: acquired.path,
					env: options.env ?? process.env,
					schemaReady: !options.database && acquired === getOpenClawStateDatabaseIfOpen(options)
				});
				observeOpenClawDatabaseMaintenanceResource(acquired.db);
				return operation(acquired);
			}, {
				busyTimeoutMs: transactionOptions.busyTimeoutMs ?? readSqliteBusyTimeout(acquired.db),
				databaseLabel: acquired.path,
				...transactionOptions,
				operationLabel: transactionOptions.operationLabel ?? "state.write"
			});
		} catch (error) {
			if (database) openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(database, error);
			throw error;
		}
		try {
			if (!isExistingOpenClawStateSchema(database.path, database.db)) ensureOpenClawStatePermissions(database.path, options.env ?? process.env);
		} catch {}
		return result;
	});
}
/**
* Return a shared state handle this process already holds open, if any.
*
* Read-only callers use this to avoid opening a connection per call; it never
* creates, repairs, or registers a handle.
*/
function getOpenClawStateDatabaseIfOpen(options = {}) {
	const pathname = resolveDatabasePath(options);
	isExistingOpenClawStateSchema(pathname);
	const cached = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (cached?.db.isOpen) isExistingOpenClawStateSchema(cached.path, cached.db);
	return cached?.db.isOpen ? cached : void 0;
}
function assertStateDatabaseSchemaAdmission(database) {
	if (isExistingOpenClawStateSchema(database.path, database.db)) {
		const location = database.db.location();
		if (!location) throw new Error("Existing shared-state schema admission requires a filesystem-backed database.");
		if (!isExistingOpenClawStateSchema(location, database.db)) throw new Error("Existing shared-state schema admission requires its selected physical database.");
		assertExistingOpenClawStateRuntimeSchema(database.db, database.path);
	}
}
//#endregion
export { repairLegacyTaskIdentifiers as A, ensureRepositoryGitHubPublicationSchema as C, ensureTaskExecutionOwnerSchema as D, ensureSessionRepositoryWorkspaceSchema as E, runCoordinatedStateTransaction as F, withSharedStateWriteCoordinator as I, verifyAndRepairCanonicalSqliteIndexSteps as M, verifyAndRepairCanonicalSqliteIndexes as N, ensureWorkerEnvironmentNodeEnrollmentSchema as O, ensureOpenClawStatePermissions as P, ensurePersonalGitHubPublicationSchema as S, ensureSecretStoreSchema as T, ensureDevicePairingJoinCodeSchema as _, repairOpenClawStateDatabaseReadabilityForDoctor as a, ensureMcpOAuthPendingSchema as b, runOpenClawStateWriteTransaction as c, recoverOrphanTaskDeliveryRows as d, ensureAgentDatabaseLeaseSchema as f, ensureDevicePairSetupCompletionSchema as g, ensureDevicePairSetupBootstrapSchema as h, reconcileOpenClawStateSchemaPublication as i, repairCanonicalSqliteIndexes as j, hasRepositoryWorkspacePendingResultSchema as k, runWithOpenClawStateBusyTimeout as l, ensureConfigRevisionKeySchema as m, openExistingOpenClawStateDatabaseReadOnly as n, repairOpenClawStateDatabaseSchema as o, ensureAgentDeletionJournalSchema as p, openOpenClawStateDatabase as r, repairOpenClawStateDatabaseSchemaIfNeeded as s, initializeNativeOpenClawStateDatabase as t, withOpenClawStateStartupMigrationCheckpointDatabase as u, ensureGitHubPublicationSchema as v, ensureRepositoryWorkspacePendingResultSchema as w, ensureNodeWorkerPreparedWorkspaceSchema as x, ensureGitHubPublicationSessionLifecycleSchema as y };
