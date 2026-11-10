import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { u as readDatabaseIdentityBirthtime } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, n as OpenClawStateOwnershipError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath, l as resolveQuarantineStorePath, o as resolveOpenClawStateDirForDatabasePath, r as resolveDatabasePath, s as resolveOpenClawStateSqliteDir, t as describeAgentPathMigration, u as warnAgentPathMigration } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, m as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { a as LAZY_ADDITIVE_STATE_TABLES, s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, t as DOCTOR_OWNED_STATE_TABLES } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as StateDatabaseOfflineMaintenanceError, n as StateDatabaseAdmissionPendingError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { m as applyPrivateModeSync, p as withStateDatabaseColdAdmission, r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout, t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, R as revokeSqliteDatabaseAdmissions, ut as quoteSqliteIdentifier, y as prepareSqliteDatabaseCleanClose } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema, v as runSqliteSchemaReadSnapshotSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as captureSqliteReaderOwner } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-BWLpOgrg.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as readOpenClawDatabaseQuarantineFailure, t as clearOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-DTWp4-ja.mjs";
import { a as classifySqliteFtsIntegrityFindings, c as readSqliteIntegrityFindings, d as sqliteIntegrityCheckSteps, i as assertSqliteTableIntegrity, r as assertSqliteIntegrity, s as isTerminalSqliteIntegrityError } from "./sqlite-integrity-06TCB-az.mjs";
import { a as clearOpenClawStateDatabaseOpenFailure, d as confirmCachedOpenClawStateDatabaseIntegrity, i as captureOpenClawStateIntegrityAdmission, l as closeOpenClawStateDatabaseByPathAsync, m as openClawStateDatabaseCache, v as recordOpenClawStateDatabaseOpenFailure } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as truncateSqliteWal } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { n as configureSqlitePreSchemaPragmas, s as createSqliteWalReclamationResult, t as configureSqliteConnectionPragmas, u as prepareSqliteDatabaseDirectory } from "./sqlite-wal-D2XTertL.mjs";
import { a as runSqliteImmediateTransactionSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { p as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists, n as ensureColumn, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { a as readSqliteUserVersion, i as isSqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { i as prepareSqliteReadOnlyLocationSync, n as prepareSqliteReadOnlyLocation, t as openSqliteReadOnlyDatabase } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { a as resolveSqliteDatabaseFilePaths, i as quarantineOrphanedSqliteSidecars } from "./sqlite-files-N5UzY_DG.mjs";
import { a as createStateSchemaAdmission, c as publishStateRuntimeSchemaAdmission, i as readStateSchemaContentVersion, n as admitStateSchemaFacts, o as getStateRuntimeSchemaAdmission, r as assertSupportedStateSchemaVersion, s as getStateSchemaVersionAdmission } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { a as isExistingOpenClawStateSchema, n as assertOpenClawStateSchemaRepairAllowed, o as recordExistingOpenClawStateSchemaDatabase } from "./openclaw-state-db-schema-policy-CuEyLsE2.mjs";
import { a as readTrackedStateDatabaseIdentity, r as openTrackedStateDatabase } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { n as assertStateDatabaseIntegrityOnce } from "./openclaw-state-db-integrity-admission-BHpYd_s7.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as openEngineStore } from "./open-L_IbZFu2.mjs";
import { n as readStateSchemaPublicationBlocker } from "./openclaw-state-schema-publication-C2fzjU88.mjs";
import { a as isStatePostgres, c as stateEngineSchema, i as inspectStateSqlite, n as assertStateFileSnapshotAllowed, s as stateEngineInput, t as admitStatePostgres } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import { a as getSqliteWorkerStateIntegrityAdmission, n as captureSqliteWorkerWalMaintenanceSuspension, r as getSqliteWorkerExistingDatabaseIdentity } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { c as getCanonicalSqliteNamedIndexContracts, l as getCanonicalSqliteTableNames, r as assertSqliteSchemaTablesPresent, s as createSqliteTableContractReader, u as readSqliteSchemaCookie } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { A as runStateSchemaMigrationTransaction, C as assertOpenClawStateDatabaseForMaintenance, D as migrateBoundedStateSchema, E as markCurrentStateSchemaVersion, F as getOpenClawStateRuntimeSchema, M as writeCurrentStateSchemaMetadata, O as openClawStateMigrationAssertions, R as migratePredicateColumnsV21, S as repairAuditEventsSchema, T as executeCanonicalStateSchema, _ as needsSessionWatchCursorProvenanceMigration, b as createStateConfigMachineTable, c as detectOpenClawStateDatabaseSchemaMigrationsFromDatabase, d as migrateWorkerPlacementExecutionModeSchema, f as repairLegacyGatewayRestartHandoffsForStrictMigration, g as migrateSessionWatchCursorProvenance, h as runRetiredStateTableMigrations, i as needsOpenClawStateDatabaseSchemaRepair, j as versionedStateMigrations, k as prepareStateDatabaseSchemaRepair, l as dropLegacyStateTables, m as logRetiredStateTableMigration, n as assertNoLegacyStateRuntimeRepair, o as assertCanonicalAgentDatabasesPrimaryKey, r as isOpenClawStateSchemaFastPathEligible, s as assertCanonicalStateSchemaShape, t as assertCurrentStateRuntimeSchema, u as migrateAgentDatabaseRelativePaths, w as assertOpenClawStateDatabaseOwner, x as migrateSingletonStateFoldInV12, z as migrateLegacyCronRunLogsToTaskRuns } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { n as openDoctorStateSchemaReadAdmission, t as hasDanglingSkillWorkshopCollectionReviewIndex } from "./openclaw-state-db-doctor-schema-l6CS6yvq.mjs";
import { u as repairOperatorApprovalSchema } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { n as withStateDatabaseSchemaMaintenance, t as StateSchemaMutationConflictError } from "./state-database-maintenance-DQhfapFw.mjs";
import { n as assertOpenClawStateWriteAllowed, r as assertOpenClawStateWriteAllowedAtPath, s as isOpenClawStateWriteContentionError } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-C8zbzbYZ.mjs";
import { t as assertExistingOpenClawStateRuntimeSchema } from "./openclaw-state-db-existing-schema-BmPsgSiy.mjs";
import { n as openOpenClawStateReadConnection } from "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import { n as runManagedStateTransaction } from "./openclaw-state-db-transaction-BR8tupS1.mjs";
import "./session-key-CSDERtm3.mjs";
import { o as resolveAgentEntry, v as resolveEffectiveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { a as readAgentRosterProperty, i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { l as ensureFirstUseAdditiveStateColumnsForStrictMigration, n as ensureAdditiveStateColumns } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { d as resolveConfigIncludesForRead, o as normalizeConfigIoDeps, s as parseConfigJson5, t as coerceConfig, u as resolveConfigForRead } from "./io.read-helpers-KYk5dB53.mjs";
import { n as listSqliteTargetCandidatePathsForSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as createDedupeCache } from "./dedupe-5aqLNx3Q.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { r as migrateSqliteSchemaToStrictInTransaction, t as hasNonStrictSqliteTables } from "./sqlite-strict-CTENSqnV.mjs";
import { t as recoverOrphanTaskDeliveryRows } from "./openclaw-state-db-task-delivery-recovery-DFOfs6Y-.mjs";
import fs, { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/targets-configured-agents.ts
/** Lists agent ids whose session stores should be considered configured. */
function listConfiguredSessionStoreAgentIds(cfg) {
	const ids = new Set(listAgentIds(cfg).map((agentId) => normalizeAgentId(agentId)));
	const addAcpAgentId = (agentId) => {
		const raw = agentId?.trim() ?? "";
		if (!raw || raw === "*") return;
		ids.add(normalizeAgentId(raw));
	};
	addAcpAgentId(cfg.acp?.defaultAgent);
	for (const agentId of cfg.acp?.allowedAgents ?? []) addAcpAgentId(agentId);
	for (const agent of listAgentEntries(cfg)) if (agent.runtime?.type === "acp") addAcpAgentId(agent.runtime.acp?.agent ?? agent.id);
	return [...ids];
}
/** Checks whether an agent is configured to own a session store. */
function isConfiguredSessionStoreAgentId(cfg, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	if (resolveAgentEntry(cfg, normalizedAgentId)) return true;
	return listConfiguredSessionStoreAgentIds(cfg).includes(normalizedAgentId);
}
//#endregion
//#region src/config/agent-store-source.ts
/** Inspect authored SQLite locators without runtime config, plugin loading, or state access. */
function readAgentStorePathsFromConfig(env, stateDir) {
	const readEnv = cloneEnvWithPlatformSemantics(env);
	readEnv.OPENCLAW_STATE_DIR = stateDir;
	const configPath = resolveConfigPath(readEnv, stateDir);
	let raw = "{}";
	try {
		raw = fs.readFileSync(configPath, "utf8");
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	const parsed = parseConfigJson5(raw);
	if (!parsed.ok) throw new Error(`Cannot parse agent storage configuration at ${configPath}.`);
	const deps = normalizeConfigIoDeps({
		env: readEnv,
		configPath,
		observe: false
	});
	const source = resolveConfigIncludesForRead(parsed.parsed, configPath, deps);
	if (!isRecord(source) || ["agents", "session"].some((key) => source[key] !== void 0 && !isRecord(source[key]))) throw new Error(`Invalid agent storage configuration at ${configPath}.`);
	const roster = readAgentRosterProperty(source);
	const hasValidStorageLocator = (entry) => isRecord(entry) && (entry.agentDir === void 0 || typeof entry.agentDir === "string");
	if (roster && (roster.kind === "entries" ? !isRecord(roster.value) || Object.values(roster.value).some((entry) => !hasValidStorageLocator(entry)) : !Array.isArray(roster.value) || roster.value.some((entry) => !hasValidStorageLocator(entry) || typeof entry.id !== "string"))) throw new Error(`Invalid agent roster at ${configPath}.`);
	if (isRecord(source.session) && source.session.store !== void 0 && typeof source.session.store !== "string") throw new Error(`Invalid session storage configuration at ${configPath}.`);
	const resolved = resolveConfigForRead(source, readEnv);
	if (resolved.envWarnings.some((warning) => warning.configPath === "session.store" || warning.configPath.endsWith(".agentDir") || warning.configPath.startsWith("agents.list[") && warning.configPath.endsWith(".id") || warning.configPath === "acp.defaultAgent" || warning.configPath.startsWith("acp.allowedAgents") || warning.configPath.endsWith(".runtime.type") || warning.configPath.endsWith(".runtime.acp.agent"))) throw new Error(`Unresolved environment reference in agent storage configuration at ${configPath}.`);
	const config = coerceConfig(resolved.resolvedConfigRaw);
	const agentIds = listAgentIds(config);
	const paths = new Set(agentIds.map((agentId) => path.join(resolveEffectiveAgentDir(config, agentId, { env: readEnv }), "openclaw-agent.sqlite")));
	const stores = new Set(listConfiguredSessionStoreAgentIds(config).map((agentId) => resolveSessionStorePathCore(config.session?.store, {
		agentId,
		env: readEnv
	})));
	for (const store of stores) for (const candidate of listSqliteTargetCandidatePathsForSessionStorePath(store)) paths.add(candidate);
	for (const directory of [readEnv.OPENCLAW_AGENT_DIR, readEnv.PI_CODING_AGENT_DIR]) if (directory?.trim()) paths.add(path.join(resolveUserPath(directory, readEnv), "openclaw-agent.sqlite"));
	return [...paths];
}
//#endregion
//#region src/state/openclaw-agent-db-discovery-paths.ts
/** Recovery also inventories disk collisions at the reserved incognito filename. */
function resolveOpenClawAgentDatabaseDiscoveryPaths(params) {
	return [resolveOpenClawAgentSqlitePath(params), resolveIncognitoOpenClawAgentSqlitePath(params)].map((pathname) => path.join(params.agentDir, path.basename(pathname)));
}
//#endregion
//#region src/state/openclaw-state-db-initialization.ts
/** Capture deletion-history evidence before a native open can create the shared database. */
function prepareStateDatabaseInitialization(pathname, env, initializationAgentPaths = []) {
	try {
		if (resolveSqliteDatabaseFilePaths(resolveQuarantineStorePath(env)).some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) return { kind: "existing" };
		const stateDir = resolveOpenClawStateDirForDatabasePath(pathname);
		const candidates = /* @__PURE__ */ new Set([...initializationAgentPaths, ...readAgentStorePathsFromConfig(env, stateDir)]);
		const agentsDir = path.join(stateDir, "agents");
		if (fs.lstatSync(agentsDir, { throwIfNoEntry: false })?.isSymbolicLink()) return { kind: "unavailable" };
		let entries = [];
		try {
			entries = fs.readdirSync(agentsDir, { withFileTypes: true });
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
		for (const entry of entries) {
			if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
			const agentDir = path.join(agentsDir, entry.name, "agent");
			if (entry.isSymbolicLink() || fs.lstatSync(agentDir, { throwIfNoEntry: false })?.isSymbolicLink()) return { kind: "unavailable" };
			for (const candidate of resolveOpenClawAgentDatabaseDiscoveryPaths({
				agentDir,
				agentId: entry.name,
				env
			})) candidates.add(candidate);
		}
		for (const candidate of candidates) {
			const family = resolveSqliteDatabaseFilePaths(candidate);
			const main = fs.lstatSync(candidate, { throwIfNoEntry: false });
			if (main && (!main.isFile() || main.size > 0) || family.slice(1).some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) return { kind: "existing" };
		}
		if (resolveSqliteDatabaseFilePaths(pathname).some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) return {
			kind: "existing",
			nativeBootstrapEligible: true
		};
		return { kind: "fresh" };
	} catch {
		return { kind: "unavailable" };
	}
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
function ensureOpenClawStatePermissions(pathname, env, options = {}) {
	const dir = path.dirname(pathname);
	const defaultDir = resolveOpenClawStateSqliteDir(env);
	const isDefaultStateDatabase = path.resolve(pathname) === path.resolve(resolveOpenClawStateSqlitePath(env));
	if (isDefaultStateDatabase && dir !== defaultDir) throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
	const dirExisted = existsSync(dir);
	if (options.createDirectory) mkdirSync(dir, {
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
	if (getStateRuntimeSchemaAdmission(database)) return;
	const contentVersion = readStateSchemaContentVersion(database);
	if (contentVersion === 22) return;
	const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
	if (contentVersion === 0 && hasApplicationSchema || contentVersion > 0 && contentVersion < 22) stateDbLog$1.info("state database schema migration pending; verifying integrity first", {
		fromVersion: contentVersion,
		path: pathname,
		toVersion: 22
	});
	assertStateDatabaseIntegrityOnce(database, pathname);
}
function openUnpublishedStateDatabase(params) {
	const open = (schemaOwned) => {
		const existingIdentity = getSqliteWorkerExistingDatabaseIdentity(params.pathname);
		const original = params.existingSchema || existingIdentity ? statSync(params.pathname, { bigint: true }) : statSync(params.pathname, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (existingIdentity && (!original || `file:${original.dev}:${original.ino}` !== existingIdentity)) throw new Error("SQLite database file identity changed before existing-only open");
		if (!original && !schemaOwned) return withStateDatabaseSchemaMaintenance({
			databasePath: params.pathname,
			busyTimeoutMs: params.busyTimeoutMs
		}, () => open(true));
		if (original && !original.isFile()) throw new Error(`Existing shared-state database must be a regular file: ${params.pathname}`);
		const initialization = prepareStateDatabaseInitialization(params.pathname, params.env, params.initializationAgentPaths);
		if (!original) {
			quarantineOrphanedSqliteSidecars(params.pathname);
			ensureOpenClawStatePermissions(params.pathname, params.env, { createDirectory: true });
			prepareSqliteDatabaseDirectory(params.pathname);
		}
		return openNativeStateDatabase(params, initialization, original);
	};
	return open(false);
}
function openNativeStateDatabase(params, initialization, original) {
	const { busyTimeoutMs, lockFailureReporting } = params;
	const assertSameFile = () => {
		if (original) {
			const current = statSync(params.pathname, { bigint: true });
			if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino || readDatabaseIdentityBirthtime(current) !== readDatabaseIdentityBirthtime(original)) throw new Error(`Existing shared-state database generation changed: ${params.pathname}`);
		}
	};
	const db = openTrackedStateDatabase(params.pathname, {
		existingOnly: original !== void 0,
		expectedIdentity: original ? `file:${original.dev}:${original.ino}` : void 0
	});
	let walMaintenance;
	let selected = db;
	let sqlite;
	try {
		assertSameFile();
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, busyTimeoutMs);
		admitStateSchemaFacts(db, params.pathname);
		selected = openEngineStore({
			anchor: db,
			schema: stateEngineSchema,
			input: /* @__PURE__ */ stateEngineInput(),
			existingOnly: params.existingSchema,
			inspectSqlite: () => inspectStateSqlite(db),
			prepareAnchor: () => {},
			admitPostgres: admitStatePostgres,
			closeOnFailure: (connection, error) => {
				selected = connection;
				throw error;
			},
			openSqlite: () => {
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: params.pathname,
					env: params.env
				});
				if (params.existingSchema) {
					assertSameFile();
					params.ensureSchema(db, initialization);
					assertSameFile();
					sqlite = {
						db,
						path: params.pathname,
						walMaintenance: {
							checkpoint: () => false,
							stop: async () => {},
							close: () => true,
							reclaimFreePages: createSqliteWalReclamationResult
						}
					};
					return;
				}
				ensureOpenClawStatePermissions(params.pathname, params.env);
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
						runMaintenance: (operation) => {
							try {
								assertStateDatabaseAccessAllowed(params.pathname);
							} catch (error) {
								if (!(error instanceof StateDatabaseAdmissionPendingError) && !(error instanceof StateDatabaseOfflineMaintenanceError)) throw error;
								stateDbLog$1.debug("Shared-state WAL maintenance deferred during offline maintenance", { path: params.pathname });
								return false;
							}
							return operation();
						},
						isScheduledMaintenanceSuspended: captureSqliteWorkerWalMaintenanceSuspension(),
						foreignKeys: true,
						synchronous: "NORMAL"
					});
					params.ensureSchema(db, initialization);
					return walMaintenance;
				}, { lockFailureReporting });
				ensureOpenClawStatePermissions(params.pathname, params.env);
				assertSameFile();
				sqlite = {
					db,
					path: params.pathname,
					walMaintenance: maintenance
				};
			}
		});
		if (sqlite) return sqlite;
		assertOpenClawStateWriteAllowed({
			database: selected,
			databasePath: params.pathname,
			env: params.env
		});
		return {
			db: selected,
			path: params.pathname,
			walMaintenance: {
				checkpoint: () => false,
				stop: async () => {},
				close: () => true,
				reclaimFreePages: createSqliteWalReclamationResult
			}
		};
	} catch (error) {
		const errors = openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle({
			db: selected,
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
* Verify the whole file before schema convergence. Physical corruption belongs
* to explicit Doctor maintenance, including when only an index is damaged.
*/
function* verifyAndRepairCanonicalSqliteIndexSteps(db, databaseLabel, schemaSql, options = {}) {
	const { diagnostics, reuseIntegrity, ...repairOptions } = options;
	if (reuseIntegrity) {
		if (diagnostics) diagnostics.integrityGateOutcome = "cached";
	} else yield* sqliteIntegrityCheckSteps(db, databaseLabel, diagnostics);
	const indexesStartedAt = performance.now();
	const repairedIndexes = repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, {
		...repairOptions,
		verifyPhysicalIntegrity: false
	});
	if (diagnostics) {
		diagnostics.canonicalIndexMs = Math.floor(performance.now() - indexesStartedAt);
		diagnostics.repairedIndexCount = repairedIndexes.length;
	}
	return repairedIndexes;
}
/**
* Restore every named index when SQLite's IF NOT EXISTS semantics preserve a
* same-name definition that no longer matches the committed schema.
*/
function repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	const indexes = getCanonicalSqliteNamedIndexContracts(schemaSql);
	const indexesByTable = /* @__PURE__ */ new Map();
	for (const index of indexes) {
		assertSqliteIdentifier(index.name);
		assertSqliteIdentifier(index.tableName);
		const tableIndexes = indexesByTable.get(index.tableName) ?? [];
		tableIndexes.push(index);
		indexesByTable.set(index.tableName, tableIndexes);
	}
	const repairIndexes = /* @__PURE__ */ new Set();
	runSqliteSchemaReadSnapshotSync(db, () => {
		const readTable = createSqliteTableContractReader(db);
		for (const tableName of getCanonicalSqliteTableNames(schemaSql)) {
			assertSqliteIdentifier(tableName);
			const table = readTable(tableName);
			if (!table) continue;
			const tableIndexes = indexesByTable.get(tableName) ?? [];
			const canonicalIndexNames = new Set(tableIndexes.map((index) => index.name));
			const actualIndexes = table.indexes;
			const unexpected = actualIndexes.find((index) => index.unique === 1 && index.origin === "c" && index.name !== null && !canonicalIndexNames.has(index.name));
			if (unexpected) throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: unexpected unique index ${unexpected.name}`);
			for (const index of tableIndexes) {
				const actual = actualIndexes.find((candidate) => candidate.name === index.name);
				if (JSON.stringify(actual) !== JSON.stringify(index.fingerprint)) repairIndexes.add(index);
			}
		}
		if (options.verifyPhysicalIntegrity !== false) assertSqliteIntegrity(db, databaseLabel);
	});
	if (repairIndexes.size === 0) return [];
	const savepoint = "repair_canonical_indexes";
	let activeIndex;
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		for (const index of repairIndexes) {
			activeIndex = index;
			db.exec("SAVEPOINT repair_canonical_index;");
			try {
				db.exec(`DROP INDEX IF EXISTS main.${index.name};`);
				assertSqliteIdentifier(index.name);
				const create = index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX";
				db.exec(`${create} main.${index.name} ${index.definition};`);
			} catch (error) {
				db.exec("ROLLBACK TO SAVEPOINT repair_canonical_index;");
				if (options.allowMissingColumns && isMissingColumnError(error)) {
					repairIndexes.delete(index);
					continue;
				}
				throw error;
			} finally {
				db.exec("RELEASE SAVEPOINT repair_canonical_index;");
			}
		}
		if (repairIndexes.size === 0) {
			db.exec(`RELEASE SAVEPOINT ${savepoint};`);
			return [];
		}
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
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`SQLite canonical index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`, { cause: error });
	}
	return [...repairIndexes].map((index) => index.name).toSorted();
}
/** Explicit maintenance only: preserve the damaged image before rebuilding derived indexes. */
function repairSqliteIndexCorruption(database, pathname, options) {
	let repaired = [];
	return runSqliteImmediateTransactionSync(database, () => {
		const names = /* @__PURE__ */ new Set();
		const findings = readSqliteIntegrityFindings(database);
		const ftsTables = classifySqliteFtsIntegrityFindings(database, findings, options.ftsSchemas ?? []);
		if (options.ftsOnly && !ftsTables) throw new Error("Startup repair requires only canonical FTS integrity findings");
		for (const finding of ftsTables ? [] : findings) {
			if (finding === "ok") continue;
			const name = (typeof finding === "string" ? /^(?:row \d+ missing from index|wrong # of entries in index|non-unique entry in index) (.+)$/u.exec(finding) : null)?.[1];
			if (!name) throw new Error(`Unrecognized SQLite integrity finding: ${String(finding)}`);
			names.add(name);
		}
		if (names.size === 0 && !ftsTables) return [];
		const tables = /* @__PURE__ */ new Set();
		for (const name of names) {
			const index = database.prepare("SELECT tbl_name FROM main.sqlite_schema WHERE type = 'index' AND name = ?").get(name);
			if (typeof index?.tbl_name !== "string") throw new Error(`SQLite index repair refused unknown index ${name} for ${pathname}.`);
			tables.add(index.tbl_name);
		}
		for (const table of tables) {
			const statement = database.prepare(`SELECT * FROM main.${quoteSqliteIdentifier(table)} NOT INDEXED`);
			statement.setReadBigInts(true);
			const rows = statement.iterate();
			while (!rows.next().done);
		}
		options.backup();
		repaired = ftsTables ?? [...names].toSorted();
		for (const name of repaired) {
			const identifier = quoteSqliteIdentifier(name);
			database.exec(ftsTables ? `INSERT INTO main.${identifier}(${identifier}) VALUES('rebuild')` : `REINDEX main.${identifier}`);
		}
		assertSqliteIntegrity(database, pathname);
		return repaired;
	}, {
		databaseLabel: pathname,
		operationLabel: "sqlite.index-corruption-repair",
		withCommit: (commit) => {
			if (repaired.length > 0) options.assertCurrent();
			commit();
		}
	});
}
function assertSqliteIdentifier(identifier) {
	if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) throw new Error(`invalid SQLite identifier: ${identifier}`);
}
function isMissingColumnError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /^no such column:/iu.test(error.message);
}
//#endregion
//#region src/infra/sqlite-index-recovery.ts
function syncAndHash(pathname) {
	const descriptor = fs.openSync(pathname, "r+");
	try {
		fs.fsyncSync(descriptor);
		return hashFileDescriptorSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
/** Preserve original pages through the snapshot owner before a Doctor repair writes. */
function backupDoctorSqliteRepair(pathname, repair) {
	const prepared = prepareSqliteReadOnlyLocationSync(pathname);
	try {
		const snapshot = openNodeSqliteDatabase(prepared.location);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
		} finally {
			snapshot.close();
		}
		const directory = createPrivateSqliteTempDirectorySync(path.dirname(pathname), `openclaw-${repair}-recovery-`);
		const backupPath = path.join(directory, "database.sqlite");
		const expected = syncAndHash(prepared.location);
		fs.copyFileSync(prepared.location, backupPath, fs.constants.COPYFILE_EXCL);
		fs.chmodSync(backupPath, 384);
		if (JSON.stringify(syncAndHash(backupPath)) !== JSON.stringify(expected)) throw new Error(`SQLite ${repair} recovery backup verification failed: ${backupPath}`);
		requireDirectorySync(syncDirectorySync(directory), "SQLite recovery directory");
		requireDirectorySync(syncDirectorySync(path.dirname(directory)), "SQLite recovery parent");
		return backupPath;
	} finally {
		prepared.cleanup();
	}
}
/** Doctor holds maintenance authority; the snapshot owner preserves the damaged image. */
function repairDoctorSqliteIndexCorruption(database, pathname, options) {
	let backupPath;
	let indexes;
	try {
		indexes = repairSqliteIndexCorruption(database, pathname, {
			ftsSchemas: options.ftsSchemas,
			ftsOnly: options.ftsOnly,
			assertCurrent: options.assertCurrent,
			backup: () => {
				options.assertCurrent();
				backupPath = backupDoctorSqliteRepair(pathname, "index");
				options.assertCurrent();
			}
		});
	} catch (cause) {
		const preserved = backupPath ? ` Preserved pre-repair database: ${backupPath}.` : "";
		throw new Error(`SQLite index repair refused for ${pathname}.${preserved} Preserve the database and its WAL; restore a verified backup or use SQLite recovery. ${String(cause)}`, { cause });
	}
	return indexes.length > 0 ? [`Saved pre-repair SQLite backup: ${backupPath}`, options.describeRepair?.(indexes) ?? `Warning: Rebuilt corrupt ${options.label} SQLite indexes: ${indexes.join(", ")}. No table rows were removed.`] : [];
}
//#endregion
//#region src/state/agent-deletion-journal-history.ts
function hasPreJournalStateSchema(database) {
	if (isPostgresSqlConnection(database)) return false;
	if (readStateSchemaContentVersion(database) !== 1 || tableExists(database, "config_machine_state") || tableExists(database, "agent_database_leases") || !tableExists(database, "agent_databases") || !tableExists(database, "migration_sources")) return false;
	const db = getNodeSqliteKysely(database);
	const metadata = executeSqliteQueryTakeFirstSync(database, db.selectFrom("schema_meta").selectAll().where("meta_key", "=", "primary"));
	return metadata?.role === "global" && metadata.schema_version === 1 && metadata.agent_id === null && !executeSqliteQueryTakeFirstSync(database, db.selectFrom("migration_sources").select("source_key").where("target_table", "=", "agent_deletion_journal").limit(1));
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
const STARTUP_CHECKPOINT_SCHEMA = `
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
`;
const checkpointAdmission = createStateSchemaAdmission("state.startup-checkpoint", (value) => value === true ? true : void 0);
function isUninitializedNativeStartupDatabase(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if ((getStateSchemaVersionAdmission(db)?.userVersion ?? schema?.userVersion ?? readSqliteUserVersion(db)) !== 0) return false;
	const objects = schema ? [
		...[...schema.tables].map((name) => ({
			type: "table",
			name
		})),
		...[...schema.indexes].map((name) => ({
			type: "index",
			name
		})),
		...[...schema.views].map((name) => ({
			type: "view",
			name
		})),
		...[...schema.triggers.keys()].map((name) => ({
			type: "trigger",
			name
		}))
	].filter(({ name }) => !name.startsWith("sqlite_")) : db.prepare("SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'").all();
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
		db.exec(STARTUP_CHECKPOINT_SCHEMA);
		ensureColumn(db, "schema_meta", "app_version TEXT");
	}, {
		busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
		databaseLabel: pathname,
		operationLabel: "state.schema.ensure-startup-checkpoint"
	});
}
function hasStartupMigrationCheckpointSchema(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tables.has("schema_meta") && schema.tables.has("state_leases") && schema.indexes.has("idx_state_leases_expiry") && schema.indexes.has("idx_state_leases_owner") && tableHasColumn(db, "schema_meta", "app_version");
	const objects = db.prepare(`SELECT type, name FROM sqlite_schema WHERE name IN (
      'schema_meta', 'state_leases', 'idx_state_leases_expiry', 'idx_state_leases_owner'
    )`).all();
	const has = (type, name) => objects.some((row) => row.type === type && row.name === name);
	return has("table", "schema_meta") && has("table", "state_leases") && has("index", "idx_state_leases_expiry") && has("index", "idx_state_leases_owner") && tableHasColumn(db, "schema_meta", "app_version");
}
function withOpenClawStateStartupCheckpointConnection(callback, options, initializeCanonicalSchema) {
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	const open = (schemaOwned) => {
		assertStateDatabaseAccessAllowed(pathname);
		const existing = existsSync(pathname);
		if (!existing && !schemaOwned) return withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => open(true));
		const initialization = prepareStateDatabaseInitialization(pathname, env, options.initializationAgentPaths);
		if (!existing) {
			quarantineOrphanedSqliteSidecars(pathname);
			ensureOpenClawStatePermissions(pathname, env, { createDirectory: true });
		}
		const db = openNodeSqliteDatabase(existing ? resolveExistingSqliteFileUri(pathname) : pathname);
		let ownershipAdmitted = false;
		let result;
		let seal;
		try {
			setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			if (getStateRuntimeSchemaAdmission(db) || checkpointAdmission.get(db)) admitSqliteSchema(db);
			openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			ownershipAdmitted = true;
			ensureOpenClawStatePermissions(pathname, env);
			if (schemaOwned) configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			const operate = () => {
				if (getStateRuntimeSchemaAdmission(db) || checkpointAdmission.get(db)) return { value: callback(db) };
				assertStateDatabaseIntegrityOnce(db, pathname);
				assertSupportedStateSchemaVersion(db, pathname);
				const initialize = isUninitializedNativeStartupDatabase(db);
				const needsSchema = initialize || !hasStartupMigrationCheckpointSchema(db);
				if (needsSchema && !schemaOwned) return;
				const schemaCookie = options.atomic && needsSchema ? readSqliteSchemaCookie(db) : void 0;
				if (initialize) initializeCanonicalSchema(db, pathname, env, initialization);
				if (needsSchema) ensureStartupMigrationCheckpointSchema(db, pathname, env);
				if (schemaCookie !== void 0 && readSqliteSchemaCookie(db) !== schemaCookie) assertSqliteIntegrity(db, pathname);
				admitSqliteSchema(db);
				checkpointAdmission.publish(db, true);
				return { value: callback(db) };
			};
			const restoreForeignKeys = options.atomic === true && !getStateRuntimeSchemaAdmission(db) && !checkpointAdmission.get(db) && isUninitializedNativeStartupDatabase(db) && Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) === 1;
			if (restoreForeignKeys) db.exec("PRAGMA foreign_keys = OFF;");
			try {
				result = options.atomic ? withSqlitePostCommitPublications(db, () => runSqliteDeferredTransactionSync(db, operate, {
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: pathname,
					operationLabel: "state.startup-checkpoint.inspect-and-claim"
				})) : operate();
			} finally {
				if (restoreForeignKeys && db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
			}
			if (result) try {
				truncateSqliteWal(db, pathname);
				seal = prepareSqliteDatabaseCleanClose(db);
			} catch (error) {
				process.emitWarning(`Shared-state clean-close checkpoint failed: ${String(error)}`);
			}
		} finally {
			using closingSeal = seal;
			db.close();
			closingSeal?.publish();
			if (ownershipAdmitted) ensureOpenClawStatePermissions(pathname, env);
		}
		if (result) return result.value;
		return withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => open(true));
	};
	return open(false);
}
/** Admit only recognized native bootstrap; versioned state stays on the read-only path. */
function initializeNativeOpenClawStateConnection(options, initializeCanonicalSchema) {
	assertOpenClawStateSchemaRepairAllowed(resolveDatabasePath(options));
	if (!withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
		return isUninitializedNativeStartupDatabase(db);
	}, options)) return;
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => {
		const initialization = prepareStateDatabaseInitialization(pathname, env, options.initializationAgentPaths);
		const db = openNodeSqliteDatabase(pathname);
		try {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			admitStateSchemaFacts(db, pathname);
			if (!isUninitializedNativeStartupDatabase(db)) return;
			assertStateDatabaseIntegrityOnce(db, pathname);
			initializeCanonicalSchema(db, pathname, env, initialization);
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
function ensureOpenClawStateRuntimeSchema(db, pathname, env, initialization, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, initializeNativeOnly = false) {
	const integrity = getSqliteWorkerStateIntegrityAdmission() ?? (isMainThread ? captureOpenClawStateIntegrityAdmission(pathname) : void 0);
	if (isExistingOpenClawStateSchema(pathname, db)) {
		assertExistingOpenClawStateRuntimeSchema(db, pathname, integrity);
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: pathname,
			env
		});
		return [];
	}
	try {
		if (isOpenClawStateSchemaFastPathEligible(db, pathname, integrity)) {
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
	return withStateDatabaseSchemaMaintenance({
		databasePath: pathname,
		busyTimeoutMs
	}, () => {
		const now = Date.now();
		const retiredTableChanges = [];
		let runtimeReady = false;
		const applied = runStateSchemaMigrationTransaction(db, pathname, () => {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			assertSupportedStateSchemaVersion(db, pathname);
			if (initializeNativeOnly && !isUninitializedNativeStartupDatabase(db)) return [];
			const previousVersion = readStateSchemaContentVersion(db);
			const schema = getAdmittedSqliteSchemaFacts(db);
			if (previousVersion === 0 && schema?.tables.size === 0 && schema.views.size === 0) {
				createStateConfigMachineTable(db);
				executeCanonicalStateSchema(db, {
					includeVersionLazyAdditiveTables: true,
					includeAgentDeletionJournal: initialization.kind === "fresh" || initialization.nativeBootstrapEligible === true
				});
				writeCurrentStateSchemaMetadata(db, now);
				runtimeReady = true;
				return [];
			}
			if (previousVersion === 22) {
				assertNoLegacyStateRuntimeRepair(db, pathname);
				assertStateDatabaseIntegrityOnce(db, pathname);
				const indexes = repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, {
					verifyPhysicalIntegrity: false,
					allowMissingColumns: true,
					validateAfterRepair: () => {
						assertCanonicalStateSchemaShape(db, pathname);
						assertOpenClawStateDatabaseForMaintenance(db, { pathname });
					}
				});
				ensureAdditiveStateColumns(db, "runtime");
				assertCurrentStateRuntimeSchema(db, pathname);
				writeCurrentStateSchemaMetadata(db, now);
				runtimeReady = true;
				return indexes.length > 0 ? [`Rebuilt canonical shared-state SQLite indexes (${indexes.length})`] : [];
			}
			openClawStateMigrationAssertions.get(previousVersion)?.(db, { pathname });
			assertStateDatabaseIntegrityOnce(db, pathname);
			const boundedChanges = migrateBoundedStateSchema(db, previousVersion);
			if (boundedChanges) {
				writeCurrentStateSchemaMetadata(db, now);
				assertCurrentStateRuntimeSchema(db, pathname);
				runtimeReady = true;
				return boundedChanges;
			}
			const includeAgentDeletionJournal = tableExists(db, "agent_deletion_journal") || hasPreJournalStateSchema(db) || (initialization.kind === "fresh" || initialization.nativeBootstrapEligible === true) && isUninitializedNativeStartupDatabase(db);
			dropLegacyStateTables(db);
			const changes = runRetiredStateTableMigrations(db, previousVersion);
			retiredTableChanges.push(...changes);
			if (migrateSingletonStateFoldInV12(db, previousVersion)) changes.push("Folded singleton state tables into config_machine_state (v12)");
			if (migrateWorkerPlacementExecutionModeSchema(db, previousVersion)) changes.push("Migrated cloud worker placements to execution modes");
			const pathMigration = migrateAgentDatabaseRelativePaths(db, previousVersion, pathname);
			changes.push(...describeAgentPathMigration(pathMigration));
			if (migratePredicateColumnsV21(db, previousVersion)) changes.push("Derived meeting transcript selectors and bounded delivery retention columns (v21)");
			ensureAdditiveStateColumns(db, previousVersion < 20 ? "repair" : "runtime");
			for (const migration of versionedStateMigrations) if (migration.migrate(db, previousVersion)) changes.push(migration.applied);
			migrateSessionWatchCursorProvenance(db);
			assertCanonicalStateSchemaShape(db, pathname);
			executeCanonicalStateSchema(db, {
				includeVersionLazyAdditiveTables: true,
				includeAgentDeletionJournal
			});
			migrateLegacyCronRunLogsToTaskRuns(db);
			if (previousVersion < 3 && hasNonStrictSqliteTables(db)) {
				repairLegacyGatewayRestartHandoffsForStrictMigration(db);
				ensureFirstUseAdditiveStateColumnsForStrictMigration(db);
				const strict = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({
					includeVersionLazyAdditiveTables: true,
					includeAgentDeletionJournal
				}), { databaseLabel: pathname });
				if (strict.migratedTables.length > 0) changes.push(`Migrated shared state tables to SQLite STRICT typing (${strict.migratedTables.length})`);
			}
			repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false });
			writeCurrentStateSchemaMetadata(db, now);
			assertOpenClawStateDatabaseForMaintenance(db, { pathname });
			runtimeReady = true;
			warnAgentPathMigration(stateDbLog, pathMigration, pathname);
			return changes;
		}, {
			busyTimeoutMs,
			databaseLabel: pathname,
			operationLabel: "state.schema.ensure"
		});
		if (runtimeReady) publishStateRuntimeSchemaAdmission(db, true);
		retiredTableChanges.forEach(logRetiredStateTableMigration);
		return applied;
	});
}
//#endregion
//#region src/state/openclaw-state-db-repair.ts
function repairStateSchema(pathname, env, scope) {
	assertOpenClawStateSchemaRepairAllowed(pathname);
	const db = openNodeSqliteDatabase(pathname, { enableForeignKeyConstraints: false });
	const rebuiltIndexNames = /* @__PURE__ */ new Set();
	let indexChanges = [];
	let ownershipRefused = false;
	try {
		if (scope !== "automatic") revokeSqliteDatabaseAdmissions(db);
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		const closeReadAdmission = scope === "automatic" ? void 0 : openDoctorStateSchemaReadAdmission(db);
		try {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env,
				inspectOwnership: scope === "automatic" ? void 0 : true
			});
			assertCanonicalAgentDatabasesPrimaryKey(db, pathname);
		} finally {
			closeReadAdmission?.();
		}
		ensureOpenClawStatePermissions(pathname, env);
		if (scope === "automatic") return {
			changes: ensureOpenClawStateRuntimeSchema(db, pathname, env, { kind: "existing" }),
			warnings: []
		};
		if (scope === "version") return {
			changes: runStateSchemaMigrationTransaction(db, pathname, () => {
				assertOpenClawStateDatabaseOwner(db, { pathname });
				const previousVersion = readStateSchemaContentVersion(db);
				if (previousVersion === 22) return [];
				const applied = migrateBoundedStateSchema(db, previousVersion, { versionMigrationOnly: true });
				if (!applied) throw new Error(`No bounded shared-state migration from v${previousVersion}.`);
				markCurrentStateSchemaVersion(db);
				return applied;
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: pathname,
				operationLabel: "state.schema.version-migration"
			}),
			warnings: []
		};
		const repairAdmittedSchema = prepareStateDatabaseSchemaRepair(db, pathname, env);
		const canInspectIndexes = scope !== "readability" && !hasDanglingSkillWorkshopCollectionReviewIndex(db);
		const assertIndexRepairCurrent = () => {
			assertOpenClawStateDatabaseOwner(db, { pathname });
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env,
				inspectOwnership: true
			});
		};
		indexChanges = canInspectIndexes ? repairDoctorSqliteIndexCorruption(db, pathname, {
			label: "shared-state",
			assertCurrent: assertIndexRepairCurrent
		}) : [];
		if (scope === "indexes") {
			if (canInspectIndexes && (indexChanges.length > 0 || openClawStateDatabaseCache.getOpenClawStateDatabaseRecordedFailure(pathname) || readOpenClawDatabaseQuarantineFailure("state", pathname, {
				env,
				fresh: true
			}))) runSqliteImmediateTransactionSync(db, () => {
				if (indexChanges.length === 0) assertSqliteIntegrity(db, pathname);
				assertIndexRepairCurrent();
				if (!clearOpenClawDatabaseQuarantine(pathname, { env })) throw new Error(`Repaired ${pathname}, but its quarantine record could not be cleared.`);
				clearOpenClawStateDatabaseOpenFailure(pathname);
			}, {
				databaseLabel: pathname,
				operationLabel: "state.schema.quarantine-clear"
			});
			return {
				changes: indexChanges,
				warnings: []
			};
		}
		if (scope === "readability") {
			const changes = runSqliteImmediateTransactionSync(db, () => {
				const schemaChanges = repairAdmittedSchema();
				if (schemaChanges.length > 0) {
					assertOpenClawStateDatabaseOwner(db, { pathname });
					assertSqliteTableIntegrity(db, pathname, "skill_workshop_collection_reviews");
				}
				return schemaChanges;
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: pathname,
				operationLabel: "state.schema.readability-repair"
			});
			changes.push(...runSqliteImmediateTransactionSync(db, () => {
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: pathname,
					env,
					inspectOwnership: true
				});
				return recoverOrphanTaskDeliveryRows(db, pathname);
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: pathname,
				operationLabel: "state.schema.readability-recovery"
			}));
			return {
				changes,
				warnings: []
			};
		}
		const applied = [...indexChanges];
		const changes = runStateSchemaMigrationTransaction(db, pathname, () => {
			const previousVersion = readStateSchemaContentVersion(db);
			applied.push(...recoverOrphanTaskDeliveryRows(db, pathname));
			if (previousVersion !== 22) {
				openClawStateMigrationAssertions.get(previousVersion)?.(db, { pathname });
				assertSqliteIntegrity(db, pathname);
				const boundedChanges = migrateBoundedStateSchema(db, previousVersion);
				if (boundedChanges) {
					applied.push(...boundedChanges);
					markCurrentStateSchemaVersion(db);
					assertCurrentStateRuntimeSchema(db, pathname);
					return applied;
				}
			}
			const includeAgentDeletionJournal = tableExists(db, "agent_deletion_journal") || hasPreJournalStateSchema(db);
			const preAuditSchema = previousVersion === 1 && !tableExists(db, "audit_events");
			if (preAuditSchema) assertOpenClawStateDatabaseOwner(db, { pathname });
			if (previousVersion === 22) {
				assertSqliteIntegrity(db, pathname);
				assertSqliteSchemaTablesPresent(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: [...LAZY_ADDITIVE_STATE_TABLES, ...DOCTOR_OWNED_STATE_TABLES] });
			}
			dropLegacyStateTables(db);
			applied.push(...runRetiredStateTableMigrations(db, previousVersion));
			if (migrateSingletonStateFoldInV12(db, previousVersion)) applied.push("Folded singleton state tables into config_machine_state (v12)");
			if (migrateWorkerPlacementExecutionModeSchema(db, previousVersion)) applied.push("Migrated cloud worker placements to execution modes");
			applied.push(...describeAgentPathMigration(migrateAgentDatabaseRelativePaths(db, previousVersion, pathname)));
			if (repairAuditEventsSchema(db)) applied.push(`Migrated shared state audit event ledger → versioned message lifecycle schema`);
			applied.push(...repairOperatorApprovalSchema(db));
			const needsSessionWatchMigration = needsSessionWatchCursorProvenanceMigration(db, previousVersion);
			const sessionWatchResult = migrateSessionWatchCursorProvenance(db);
			if (needsSessionWatchMigration) applied.push(`Migrated shared state session watch cursors → provenance column (${sessionWatchResult.migratedAmbientWatches} ambient, ${sessionWatchResult.removedLegacySentinels} sentinels removed)`);
			assertCanonicalStateSchemaShape(db, pathname);
			if (preAuditSchema || tableExists(db, "audit_events")) {
				if (migratePredicateColumnsV21(db, previousVersion)) applied.push("Derived meeting transcript selectors and bounded delivery retention columns (v21)");
				ensureAdditiveStateColumns(db, "repair");
				for (const migration of versionedStateMigrations) if (migration.migrate(db, previousVersion)) applied.push(migration.applied);
				executeCanonicalStateSchema(db, {
					includeVersionLazyAdditiveTables: previousVersion !== 22,
					includeAgentDeletionJournal
				});
				migrateLegacyCronRunLogsToTaskRuns(db);
				if (previousVersion < 3) {
					repairLegacyGatewayRestartHandoffsForStrictMigration(db);
					ensureFirstUseAdditiveStateColumnsForStrictMigration(db);
				}
				const strictMigration = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({
					includeVersionLazyAdditiveTables: previousVersion !== 22,
					includeAgentDeletionJournal: tableExists(db, "agent_deletion_journal")
				}), { databaseLabel: pathname });
				if (strictMigration.migratedTables.length > 0) applied.push(`Migrated shared state tables to SQLite STRICT typing (${strictMigration.migratedTables.length})`);
				for (const name of repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false })) rebuiltIndexNames.add(name);
			}
			markCurrentStateSchemaVersion(db, { createMetadataIfMissing: previousVersion < 22 });
			if (readStateSchemaContentVersion(db) === 22) assertCurrentStateRuntimeSchema(db, pathname);
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
		if (readStateSchemaContentVersion(db) === 22) publishStateRuntimeSchemaAdmission(db, true);
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
		const reason = scope === "automatic" ? String(err) : String(err).replace(/has a legacy ([a-z ]+) schema; run openclaw doctor --fix to migrate it\./u, "has a legacy $1 schema; automatic repair refused the unrecognized schema shape.");
		return {
			changes: indexChanges,
			warnings: [`Failed migrating shared state database schema at ${pathname}: ${reason}`]
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
//#region src/state/openclaw-state-db-schema-discovery.ts
function detectOpenClawStateDatabaseSchemaMigrations(options = {}, behavior = {}) {
	const pathname = resolveDatabasePath(options);
	if (!existsSync(pathname)) return [];
	if (behavior.artifactPreservingReadOnly) return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
		return detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname);
	}, {
		...options,
		path: pathname
	}) ?? [];
	const db = openSqliteReadOnlyDatabase(pathname, { readOnly: true });
	try {
		return detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname);
	} finally {
		db.close();
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
function readPublishedStateSchemaVersion(database) {
	const admitted = getStateSchemaVersionAdmission(database);
	if (admitted) return admitted.userVersion;
	if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
	return readSqliteUserVersion(database);
}
function repairDoctorStateDatabase(options, scope) {
	if (isStatePostgres()) requireNativeDatabaseFile("postgres", "repair");
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	if (scope === "readability") assertOpenClawStateDatabaseFreshOpenAllowed(options);
	return withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => repairStateSchema(pathname, env, scope));
}
function repairOpenClawStateDatabaseSchema(options = {}) {
	return repairDoctorStateDatabase(options, options.versionMigrationOnly ? "version" : "doctor");
}
/** Explicit Doctor maintenance before config readers encounter a quarantined index. */
function repairOpenClawStateDatabaseIndexesForDoctor(options = {}) {
	return repairDoctorStateDatabase(options, "indexes");
}
/** Repair known catalog damage and preserve orphan rows before Doctor backs up or loads state. */
function repairOpenClawStateDatabaseReadabilityForDoctor(options = {}) {
	return repairDoctorStateDatabase(options, "readability");
}
/** Prepare schema and retire resources only when the admitted operation actually repairs it. */
async function prepareOpenClawStateDatabaseSchema(options = {}, mode = "automatic") {
	if (isStatePostgres()) requireNativeDatabaseFile("postgres", "repair");
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	assertOpenClawStateSchemaRepairAllowed(pathname);
	if (!existsSync(pathname)) return {
		changes: [],
		warnings: []
	};
	const scope = mode === "automatic" ? "automatic" : "doctor";
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: pathname,
		env,
		recoverOrphanedSidecars: false,
		...scope === "doctor" ? { openStateSchemaReadAdmission: openDoctorStateSchemaReadAdmission } : {}
	});
	let repairStarted = false;
	try {
		let needsRepair = mode === "doctor";
		if (mode === "doctor-preparation") try {
			assertOpenClawStateDatabaseFreshOpenAllowed(options);
		} catch {
			needsRepair = true;
		}
		return needsRepair || needsOpenClawStateDatabaseSchemaRepair(pathname, scope) ? withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => {
			repairStarted = true;
			return repairStateSchema(pathname, env, scope);
		}) : {
			changes: [],
			warnings: []
		};
	} finally {
		if (repairStarted) await closeOpenClawStateDatabaseByPathAsync(pathname);
	}
}
/** Bootstrap fresh/native-only state canonically before startup checkpoint access. */
function withOpenClawStateStartupMigrationCheckpointDatabase(callback, options = {}) {
	if (isStatePostgres()) requireNativeDatabaseFile("postgres", "repair");
	assertOpenClawStateSchemaRepairAllowed(resolveDatabasePath(options));
	const database = getOpenClawStateDatabaseIfOpen(options);
	if (database && isPostgresSqlConnection(database.db)) requireNativeDatabaseFile("postgres", "repair");
	if (database && getAdmittedSqliteSchemaFacts(database.db)?.userVersion === 22) {
		const result = runOpenClawStateWriteTransaction(({ db }) => {
			if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
			return callback(db);
		}, {
			env: options.env,
			path: database.path
		}, { operationLabel: "state.startup-checkpoint.write" });
		if (options.sealOnClose) openClawStateDatabaseCache.closeOpenClawStateDatabaseByPath(database.path);
		return result;
	}
	return withOpenClawStateStartupCheckpointConnection(callback, options, ensureOpenClawStateRuntimeSchema);
}
/** Complete native bootstrap without migrating mature shared state. */
function initializeNativeOpenClawStateDatabase(options = {}) {
	if (isStatePostgres()) requireNativeDatabaseFile("postgres", "repair");
	initializeNativeOpenClawStateConnection(options, (db, pathname, env, initialization) => ensureOpenClawStateRuntimeSchema(db, pathname, env, initialization, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, true));
}
/** Open existing shared state without creating, migrating, chmodding, or configuring it. */
async function openExistingOpenClawStateDatabaseReadOnly(options = {}) {
	const pathname = resolveDatabasePath(options);
	isExistingOpenClawStateSchema(pathname);
	if (!existsSync(pathname)) return;
	assertOpenClawStateDatabaseFreshOpenAllowed(options);
	const prepared = isStatePostgres() ? pathname : await prepareSqliteReadOnlyLocation(pathname);
	const connection = openOpenClawStateReadConnection(pathname, prepared);
	const { db } = connection.database;
	try {
		if (isPostgresSqlConnection(db)) assertSupportedStateSchemaVersion(db, pathname);
		else if (isExistingOpenClawStateSchema(pathname, db) || options.requireCanonicalSchema) assertExistingOpenClawStateRuntimeSchema(db, pathname);
		else {
			assertSupportedStateSchemaVersion(db, pathname);
			assertSqliteIntegrity(db, pathname);
			if (readStateSchemaContentVersion(db) === 22) assertOpenClawStateDatabaseForMaintenance(db, { pathname });
		}
	} catch (error) {
		try {
			connection.close();
		} catch {}
		throw error;
	}
	return readOnlyStateDatabase(connection.database, connection.close);
}
function readOnlyStateDatabase(database, close) {
	return {
		...database,
		walMaintenance: {
			checkpoint: () => false,
			stop: async () => {},
			reclaimFreePages: createSqliteWalReclamationResult,
			close
		}
	};
}
function openOpenClawStateDatabaseWithBusyTimeout(options = {}, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, lockFailureReporting = "report", remainingColdAdmissionTimeout) {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const env = options.env ?? process.env;
	const pathname = options.database?.path ?? resolveDatabasePath(options);
	if (isArtifactPreservingStateRead("agent", pathname)) {
		assertStateFileSnapshotAllowed();
		assertOpenClawStateDatabaseFreshOpenAllowed(options);
		const db = openSqliteReadOnlyDatabase(pathname, { timeout: busyTimeoutMs });
		assertSupportedStateSchemaVersion(db, pathname);
		return readOnlyStateDatabase({
			db,
			path: pathname
		}, () => {
			db.close();
			return true;
		});
	}
	const existingSchema = !options.database && isExistingOpenClawStateSchema(pathname);
	const cached = options.database ?? openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname);
	if (cached && (options.database || cached.db.isOpen)) {
		if (!options.database) openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
		assertStateDatabaseSchemaAdmission(cached);
		assertOpenClawStateWriteAllowed({
			database: cached.db,
			databasePath: pathname,
			env,
			schemaReady: openClawStateDatabaseCache.isOpenClawStateDatabaseSchemaReady(cached)
		});
		observeOpenClawDatabaseMaintenanceResource(cached.db);
		if (options.database) openClawStateDatabaseCache.touchStateDatabase(cached);
		else if (!existingSchema && deferredStateDatabases.has(cached.db)) {
			reconcileOpenClawStateSchemaPublication(options);
			if (getStateSchemaVersionAdmission(cached.db)?.userVersion === 22) deferredStateDatabases.delete(cached.db);
		}
		return cached;
	}
	let unpublished;
	try {
		const open = (remaining) => {
			getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
			openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname);
			assertOpenClawStateDatabaseFreshOpenAllowed(options);
			if (cached) openClawStateDatabaseCache.closeStaleCachedOpenClawStateDatabase(cached);
			return openUnpublishedStateDatabase({
				pathname,
				env,
				busyTimeoutMs: remaining(),
				lockFailureReporting,
				existingSchema,
				initializationAgentPaths: options.initializationAgentPaths,
				ensureSchema: (database, initialization) => ensureOpenClawStateRuntimeSchema(database, pathname, env, initialization, remaining()),
				recordOpenFailure: recordOpenClawStateDatabaseOpenFailure
			});
		};
		unpublished = remainingColdAdmissionTimeout ? open(remainingColdAdmissionTimeout) : withStateDatabaseColdAdmission({
			databasePath: pathname,
			busyTimeoutMs
		}, open);
		if (!isPostgresSqlConnection(unpublished.db)) setSqliteBusyTimeout(unpublished.db, busyTimeoutMs);
	} catch (error) {
		if (lockFailureReporting === "report" || !isOpenClawStateWriteContentionError(error)) openClawStateDatabaseCache.recordOpenClawStateDatabaseLifecycleOpenError(pathname, error);
		if (unpublished) {
			const errors = openClawStateDatabaseCache.closeUnpublishedOpenClawStateDatabaseHandle(unpublished);
			if (errors.length > 0) throw createSqliteLifecycleAggregateError([error, ...errors], `Fresh OpenClaw state database open failed releasing access and closing its unpublished handle for ${pathname}.`, error);
		}
		throw error;
	}
	if (existingSchema) recordExistingOpenClawStateSchemaDatabase(unpublished.db, pathname);
	const database = openClawStateDatabaseCache.publishOpenClawStateDatabase(unpublished, env);
	try {
		if (!existingSchema && readPublishedStateSchemaVersion(database.db) < 22) {
			deferredStateDatabases.add(database.db);
			reconcileOpenClawStateSchemaPublication(options);
		}
		return database;
	} catch (error) {
		if (database.db.isOpen && !isPostgresSqlConnection(database.db)) setSqliteBusyTimeout(database.db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		throw error;
	}
}
function openOpenClawStateDatabase(options = {}) {
	return openOpenClawStateDatabaseWithBusyTimeout(options);
}
/** The Gateway watcher also publishes without requiring a new physical database open. */
function reconcileOpenClawStateSchemaPublication(options = {}) {
	if (isExistingOpenClawStateSchema(options.database?.path ?? resolveDatabasePath(options))) return;
	const pending = withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (readPublishedStateSchemaVersion(db) >= 22 || readStateSchemaContentVersion(db) < 22) return;
		if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
		return { blocker: readStateSchemaPublicationBlocker(db) };
	}, options);
	if (!pending || pending.blocker) return pending?.blocker;
	const pathname = resolveDatabasePath(options);
	try {
		return withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => runOpenClawStateWriteTransaction(({ db }) => {
			if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
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
	if (isArtifactPreservingStateRead("agent", options.database?.path ?? resolveDatabasePath(options))) return operation(openOpenClawStateDatabaseWithBusyTimeout(options, busyTimeoutMs));
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	const existing = options.database ?? getOpenClawStateDatabaseIfOpen(options);
	if (existing) {
		assertStateDatabaseSchemaAdmission(existing);
		const execute = () => {
			observeOpenClawDatabaseMaintenanceResource(existing.db);
			openClawStateDatabaseCache.touchStateDatabase(existing);
			return operation(existing);
		};
		if (isPostgresSqlConnection(existing.db)) return execute();
		return runWithSqliteBusyTimeout(existing.db, normalizedTimeoutMs, execute, { lockFailureReporting: "suppress" });
	}
	const opened = openOpenClawStateDatabaseWithBusyTimeout(options, normalizedTimeoutMs, "suppress");
	try {
		if (isPostgresSqlConnection(opened.db)) return operation(opened);
		return runWithSqliteBusyTimeout(opened.db, normalizedTimeoutMs, () => operation(opened), { lockFailureReporting: "suppress" });
	} finally {
		if (opened.db.isOpen && !isPostgresSqlConnection(opened.db)) setSqliteBusyTimeout(opened.db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
	}
}
/** Run an admitted shared-state write; complete single statements may use autocommit. */
function runOpenClawStateWriteTransaction(operation, options = {}, transactionOptions = {}) {
	if (isArtifactPreservingStateRead("agent", options.database?.path ?? resolveDatabasePath(options))) throw new Error("Programming error: shared-state write during artifact-preserving inspection.");
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const existing = options.database ?? getOpenClawStateDatabaseIfOpen(options);
	if (existing) {
		isExistingOpenClawStateSchema(existing.path, existing.db);
		if (options.database) assertStateDatabaseAccessAllowed(existing.path);
	}
	let database = existing;
	let callbackEntered = false;
	let committed;
	const execute = (remaining) => {
		const acquired = database ?? openOpenClawStateDatabaseWithBusyTimeout(options, 5e3, "report", remaining);
		database = acquired;
		return {
			database: acquired,
			value: runManagedStateTransaction(acquired.db, () => {
				assertStateDatabaseSchemaAdmission(acquired);
				if (!options.database) getOpenClawStateDatabaseIfOpen(options);
				assertOpenClawStateWriteAllowed({
					database: acquired.db,
					databasePath: acquired.path,
					env: options.env ?? process.env,
					schemaReady: openClawStateDatabaseCache.isOpenClawStateDatabaseSchemaReady(acquired)
				});
				observeOpenClawDatabaseMaintenanceResource(acquired.db);
				if (options.database) openClawStateDatabaseCache.touchStateDatabase(acquired);
				callbackEntered = true;
				return operation(acquired);
			}, {
				databaseLabel: acquired.path,
				...transactionOptions,
				...remaining ? { busyTimeoutMs: remaining() } : {},
				operationLabel: transactionOptions.operationLabel ?? captureSqliteReaderOwner()?.operation ?? "state.write"
			})
		};
	};
	try {
		committed = existing ? execute() : withStateDatabaseColdAdmission({
			databasePath: resolveDatabasePath(options),
			busyTimeoutMs: transactionOptions.busyTimeoutMs ?? 5e3,
			canRetry() {
				if (callbackEntered || database && (!database.db.isOpen || database.db.isTransaction)) return false;
				if (database) assertTransactionUsable(database.db);
				return true;
			}
		}, execute);
	} catch (error) {
		if (database) openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(database, error);
		throw error;
	}
	try {
		if (!isExistingOpenClawStateSchema(committed.database.path, committed.database.db)) ensureOpenClawStatePermissions(committed.database.path, options.env ?? process.env);
	} catch {}
	return committed.value;
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
		const location = readTrackedStateDatabaseIdentity(database.db)?.canonicalPath;
		if (!location) throw new Error("Existing shared-state schema admission requires a filesystem-backed database.");
		if (!isExistingOpenClawStateSchema(location, database.db)) throw new Error("Existing shared-state schema admission requires its selected physical database.");
		if (isPostgresSqlConnection(database.db)) {
			assertSupportedStateSchemaVersion(database.db, database.path);
			return;
		}
		assertExistingOpenClawStateRuntimeSchema(database.db, database.path);
	}
}
async function confirmOpenClawStateDatabaseIntegrity(pathname) {
	if (isStatePostgres()) requireNativeDatabaseFile("postgres", "integrity");
	return confirmCachedOpenClawStateDatabaseIntegrity(pathname);
}
//#endregion
export { listConfiguredSessionStoreAgentIds as C, isConfiguredSessionStoreAgentId as S, repairCanonicalSqliteIndexes as _, prepareOpenClawStateDatabaseSchema as a, prepareStateDatabaseInitialization as b, repairOpenClawStateDatabaseReadabilityForDoctor as c, runWithOpenClawStateBusyTimeout as d, withOpenClawStateStartupMigrationCheckpointDatabase as f, repairDoctorSqliteIndexCorruption as g, backupDoctorSqliteRepair as h, openOpenClawStateDatabase as i, repairOpenClawStateDatabaseSchema as l, hasPreJournalStateSchema as m, initializeNativeOpenClawStateDatabase as n, reconcileOpenClawStateSchemaPublication as o, detectOpenClawStateDatabaseSchemaMigrations as p, openExistingOpenClawStateDatabaseReadOnly as r, repairOpenClawStateDatabaseIndexesForDoctor as s, confirmOpenClawStateDatabaseIntegrity as t, runOpenClawStateWriteTransaction as u, verifyAndRepairCanonicalSqliteIndexSteps as v, resolveOpenClawAgentDatabaseDiscoveryPaths as x, ensureOpenClawStatePermissions as y };
