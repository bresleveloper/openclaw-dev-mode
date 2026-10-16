import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-M64rViod.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { n as captureSqliteReaderOwner } from "./sqlite-reader-lifecycle-CYQdd96B.mjs";
import { c as runSqlitePinnedReadSnapshotSync } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { s as quoteSqliteIdentifier } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { c as readDatabaseIdentityBirthtime } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout, t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError, n as OpenClawStateOwnershipError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { p as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { a as tableHasColumn, i as tableExists, n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { a as LAZY_ADDITIVE_STATE_TABLES, s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, t as DOCTOR_OWNED_STATE_TABLES } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-rkhEAmAi.mjs";
import { a as readSqliteUserVersion, i as isSqliteSchemaVersionError } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { f as prepareSqliteDatabaseDirectory, n as configureSqlitePreSchemaPragmas, t as configureSqliteConnectionPragmas, u as createSqliteWalReclamationResult } from "./sqlite-wal-DUSYRhyv.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, p as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath, l as resolveQuarantineStorePath, o as resolveOpenClawStateDirForDatabasePath, r as resolveDatabasePath, s as resolveOpenClawStateSqliteDir, t as describeAgentPathMigration, u as warnAgentPathMigration } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { h as StateDatabaseOfflineMaintenanceError, i as assertStateDatabaseAccessAllowed, m as StateDatabaseAdmissionPendingError, p as withStateDatabaseColdAdmission } from "./gateway-state-owner-DmHycK5o.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { n as prepareSqliteReadOnlyLocationSync, t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { a as resolveSqliteDatabaseFilePaths, i as quarantineOrphanedSqliteSidecars } from "./sqlite-files-BEC3zbaw.mjs";
import { n as openDoctorStateSchemaReadAdmission, t as hasDanglingSkillWorkshopCollectionReviewIndex } from "./openclaw-state-db-doctor-schema-BlUz8kWR.mjs";
import { c as getCanonicalSqliteTableNames, l as readSqliteSchemaCookie, n as assertSqliteSchemaTablesPresent, r as collectSqliteIndexContract, s as getCanonicalSqliteNamedIndexContracts } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { i as readStateSchemaMigrationVersion, n as assertSupportedStateSchemaVersion, r as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { C as markCurrentStateSchemaVersion, D as versionedStateMigrations, E as runStateSchemaMigrationTransaction, I as migrateLegacyCronRunLogsToTaskRuns, O as writeCurrentStateSchemaMetadata, S as executeCanonicalStateSchema, T as prepareStateDatabaseSchemaRepair, a as assertCanonicalAgentDatabasesPrimaryKey, b as assertOpenClawStateDatabaseForMaintenance, c as dropLegacyStateTables, d as repairLegacyGatewayRestartHandoffsForStrictMigration, f as logRetiredStateTableMigration, h as needsSessionWatchCursorProvenanceMigration, i as needsOpenClawStateDatabaseSchemaRepair, j as getOpenClawStateRuntimeSchema, l as migrateAgentDatabaseRelativePaths, m as migrateSessionWatchCursorProvenance, n as assertNoLegacyStateRuntimeRepair, o as assertCanonicalStateSchemaShape, p as runRetiredStateTableMigrations, r as isOpenClawStateSchemaFastPathEligible, s as detectOpenClawStateDatabaseSchemaMigrationsFromDatabase, st as readStateSchemaPublicationBlocker, t as assertCurrentStateRuntimeSchema, u as migrateWorkerPlacementExecutionModeSchema, v as migrateSingletonStateFoldInV12, w as openClawStateMigrationAssertions, x as assertOpenClawStateDatabaseOwner, y as repairAuditEventsSchema } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-B4yBUiAP.mjs";
import { a as isTerminalSqliteIntegrityError, c as sqliteIntegrityCheckSteps, n as assertSqliteIntegrity, r as assertSqliteTableIntegrity, s as runSqliteIntegrityOperationSync } from "./sqlite-integrity-GtqcmwG3.mjs";
import { f as openClawStateDatabaseCache, g as recordOpenClawStateDatabaseOpenFailure, r as clearOpenClawStateDatabaseOpenFailure, s as closeOpenClawStateDatabaseByPathAsync, w as openTrackedStateDatabase } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as migrateSqliteSchemaToStrictInTransaction } from "./sqlite-strict-CYeSH78z.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as readOpenClawDatabaseQuarantineFailure, r as clearOpenClawDatabaseQuarantine } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { a as isExistingOpenClawStateSchema, n as assertOpenClawStateSchemaRepairAllowed, o as recordExistingOpenClawStateSchemaDatabase } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { d as repairOperatorApprovalSchema, f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as StateSchemaMutationConflictError, n as assertOpenClawStateWriteAllowed, r as assertOpenClawStateWriteAllowedAtPath, s as isOpenClawStateWriteContentionError, u as withStateDatabaseSchemaMaintenance } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { n as assertExistingOpenClawStateRuntimeSchema } from "./openclaw-state-db-existing-schema-C4QR2GGf.mjs";
import { r as openOpenClawStateReadConnection } from "./openclaw-state-db-read-connection-C62_-Nv8.mjs";
import { n as runManagedStateTransaction } from "./openclaw-state-db-transaction-LzNJgkWu.mjs";
import { n as captureSqliteWorkerWalMaintenanceSuspension, r as getSqliteWorkerExistingDatabaseIdentity } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { _ as resolveEffectiveAgentDir, o as resolveAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as readAgentRosterProperty, i as listAgentIds, n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { d as resolveConfigIncludesForRead, o as normalizeConfigIoDeps, s as parseConfigJson5, t as coerceConfig, u as resolveConfigForRead } from "./io.read-helpers-Bvdjf9tk.mjs";
import { c as resolveOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { c as ensureFirstUseAdditiveStateColumnsForStrictMigration, n as ensureAdditiveStateColumns } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { t as recoverOrphanTaskDeliveryRows } from "./openclaw-state-db-task-delivery-recovery-B96Pa83y.mjs";
import fs, { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-sqlite-target-paths.ts
/** Resolves only the legacy unsuffixed target, without reading ownership state. */
function resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath) {
	const resolved = path.resolve(storePath);
	if (resolved.endsWith(".sqlite")) {
		const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
		return {
			path: resolved,
			...agentId ? { agentId } : { shared: true }
		};
	}
	const sessionsDir = path.dirname(resolved);
	if (path.basename(resolved) !== "sessions.json") {
		const sqliteBaseName = path.basename(resolved, path.extname(resolved)) || "openclaw-agent";
		return { path: path.join(sessionsDir, `${sqliteBaseName}.sqlite`) };
	}
	if (path.basename(sessionsDir) !== "sessions") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	const agentDir = path.dirname(sessionsDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return { path: path.join(sessionsDir, "openclaw-agent.sqlite") };
	return {
		agentId: normalizeAgentId(path.basename(agentDir)),
		path: path.join(agentDir, "agent", "openclaw-agent.sqlite")
	};
}
/** List inspection candidates without opening stores or assigning writable ownership. */
function listSqliteTargetCandidatePathsForSessionStorePath(storePath) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixedTarget.agentId || unsuffixedTarget.shared) return [unsuffixedTarget.path];
	const directory = path.dirname(unsuffixedTarget.path);
	const baseName = path.basename(unsuffixedTarget.path, ".sqlite");
	const candidateNames = /* @__PURE__ */ new Set([path.basename(unsuffixedTarget.path)]);
	try {
		for (const fileName of readdirSync(directory)) {
			const databaseName = fileName.replace(/-(?:wal|shm|journal)$/u, "");
			if (databaseName.startsWith(`${baseName}.`) && databaseName.endsWith(".sqlite")) candidateNames.add(databaseName);
		}
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	return [...candidateNames].map((fileName) => path.join(directory, fileName));
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
	if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
	const agentDbDir = path.dirname(databasePath);
	if (path.basename(agentDbDir) !== "agent") return;
	const agentDir = path.dirname(agentDbDir);
	if (path.basename(path.dirname(agentDir)) !== "agents") return;
	return normalizeAgentId(path.basename(agentDir));
}
//#endregion
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
		if ([pathname, resolveQuarantineStorePath(env)].some((databasePath) => resolveSqliteDatabaseFilePaths(databasePath).some((file) => fs.lstatSync(file, { throwIfNoEntry: false })))) return { kind: "existing" };
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
	const contentVersion = readStateSchemaMigrationVersion(database);
	const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
	if (contentVersion === 0 && hasApplicationSchema || contentVersion > 0 && contentVersion < 20) stateDbLog$1.info("state database schema migration pending; verifying integrity first", {
		fromVersion: contentVersion,
		path: pathname,
		toVersion: 20
	});
	if (contentVersion !== 20) assertSqliteIntegrity(database, pathname);
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
	try {
		assertSameFile();
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, busyTimeoutMs);
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: params.pathname,
			env: params.env
		});
		if (params.existingSchema) {
			assertSameFile();
			params.ensureSchema(db, initialization);
			assertSameFile();
			return {
				db,
				path: params.pathname,
				walMaintenance: {
					checkpoint: () => false,
					stop: async () => {},
					close: () => true,
					reclaimFreePages: createSqliteWalReclamationResult
				}
			};
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
* Verify the whole file before schema convergence. Physical corruption belongs
* to explicit Doctor maintenance, including when only an index is damaged.
*/
function verifyAndRepairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, options = {}) {
	return runSqliteIntegrityOperationSync(verifyAndRepairCanonicalSqliteIndexSteps(db, databaseLabel, schemaSql, options));
}
function* verifyAndRepairCanonicalSqliteIndexSteps(db, databaseLabel, schemaSql, options = {}) {
	const { diagnostics, reuseIntegrity, integrityTables, ...repairOptions } = options;
	if (reuseIntegrity) {
		if (diagnostics) diagnostics.integrityGateOutcome = "cached";
	} else yield* sqliteIntegrityCheckSteps(db, databaseLabel, diagnostics, integrityTables);
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
	runSqlitePinnedReadSnapshotSync(db, () => {
		for (const tableName of getCanonicalSqliteTableNames(schemaSql)) {
			assertSqliteIdentifier(tableName);
			if (!db.prepare(`
          SELECT 1 FROM (
            SELECT sql, tbl_name FROM main.sqlite_schema WHERE type = 'table' AND name = ?
          )
        `).get(tableName)) continue;
			const tableIndexes = indexesByTable.get(tableName) ?? [];
			const canonicalIndexNames = new Set(tableIndexes.map((index) => index.name));
			const actualIndexes = db.prepare(`PRAGMA main.index_list(${tableName})`).all();
			const unexpected = actualIndexes.find((index) => index.unique === 1 && index.origin === "c" && !canonicalIndexNames.has(index.name));
			if (unexpected) throw new Error(`SQLite schema is incomplete or noncanonical for ${databaseLabel}: unexpected unique index ${unexpected.name}`);
			for (const index of tableIndexes) {
				const row = actualIndexes.find((candidate) => candidate.name === index.name);
				const actual = row ? collectSqliteIndexContract(db, row) : void 0;
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
			const probeName = findUnusedProbeIndexName(db, index.name);
			try {
				db.exec(createIndexSql(index, probeName));
			} catch (error) {
				if (options.allowMissingColumns && isMissingColumnError(error)) {
					repairIndexes.delete(index);
					continue;
				}
				throw error;
			}
			db.exec(`DROP INDEX IF EXISTS main.${index.name};`);
			db.exec(createIndexSql(index, index.name));
			db.exec(`DROP INDEX main.${probeName};`);
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
		for (const row of database.prepare("PRAGMA integrity_check(2147483647)").iterate()) {
			const finding = row.integrity_check;
			if (finding === "ok") continue;
			const name = (typeof finding === "string" ? /^(?:row \d+ missing from index|wrong # of entries in index|non-unique entry in index) (.+)$/u.exec(finding) : null)?.[1];
			if (!name) throw new Error(`Unrecognized SQLite integrity finding: ${String(finding)}`);
			names.add(name);
		}
		if (names.size === 0) return [];
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
		repaired = [...names].toSorted();
		for (const name of repaired) database.exec(`REINDEX main.${quoteSqliteIdentifier(name)}`);
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
function createIndexSql(index, name) {
	assertSqliteIdentifier(name);
	return `${index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX"} main.${name} ${index.definition};`;
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
/** Doctor holds maintenance authority; the snapshot owner preserves the damaged image. */
function repairDoctorSqliteIndexCorruption(database, pathname, options) {
	let backupPath;
	let indexes;
	try {
		indexes = repairSqliteIndexCorruption(database, pathname, {
			assertCurrent: options.assertCurrent,
			backup: () => {
				options.assertCurrent();
				const prepared = prepareSqliteReadOnlyLocationSync(pathname);
				try {
					const snapshot = openNodeSqliteDatabase(prepared.location);
					try {
						snapshot.exec("PRAGMA journal_mode = DELETE;");
					} finally {
						snapshot.close();
					}
					const directory = createPrivateSqliteTempDirectorySync(path.dirname(pathname), "openclaw-index-recovery-");
					const pendingPath = path.join(directory, "database.sqlite");
					const expected = syncAndHash(prepared.location);
					fs.copyFileSync(prepared.location, pendingPath, fs.constants.COPYFILE_EXCL);
					fs.chmodSync(pendingPath, 384);
					if (JSON.stringify(syncAndHash(pendingPath)) !== JSON.stringify(expected)) throw new Error(`SQLite index recovery backup verification failed: ${pendingPath}`);
					requireDirectorySync(syncDirectorySync(directory), "SQLite index recovery directory");
					requireDirectorySync(syncDirectorySync(path.dirname(directory)), "SQLite index recovery parent");
					backupPath = pendingPath;
				} finally {
					prepared.cleanup();
				}
				options.assertCurrent();
			}
		});
	} catch (cause) {
		const preserved = backupPath ? ` Preserved pre-repair database: ${backupPath}.` : "";
		throw new Error(`SQLite index repair refused for ${pathname}.${preserved} Preserve the database and its WAL; restore a verified backup or use SQLite recovery. ${String(cause)}`, { cause });
	}
	return indexes.length > 0 ? [`Saved pre-repair SQLite backup: ${backupPath}`, `Warning: Rebuilt corrupt ${options.label} SQLite indexes: ${indexes.join(", ")}. No table rows were removed.`] : [];
}
//#endregion
//#region src/state/agent-deletion-journal-history.ts
function hasPreJournalStateSchema(database) {
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
function hasStartupMigrationCheckpointSchema(db) {
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
		try {
			setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			ownershipAdmitted = true;
			ensureOpenClawStatePermissions(pathname, env);
			if (schemaOwned) configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
			const operate = () => {
				assertSqliteIntegrity(db, pathname);
				assertSupportedStateSchemaVersion(db, pathname);
				const initialize = isUninitializedNativeStartupDatabase(db);
				const needsSchema = initialize || !hasStartupMigrationCheckpointSchema(db);
				if (needsSchema && !schemaOwned) return;
				const schemaCookie = options.atomic && needsSchema ? readSqliteSchemaCookie(db) : void 0;
				if (initialize) initializeCanonicalSchema(db, pathname, env, initialization);
				if (needsSchema) ensureStartupMigrationCheckpointSchema(db, pathname, env);
				if (schemaCookie !== void 0 && readSqliteSchemaCookie(db) !== schemaCookie) assertSqliteIntegrity(db, pathname);
				return { value: callback(db) };
			};
			const restoreForeignKeys = options.atomic === true && isUninitializedNativeStartupDatabase(db) && Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) === 1;
			if (restoreForeignKeys) db.exec("PRAGMA foreign_keys = OFF;");
			try {
				result = options.atomic ? runSqliteDeferredTransactionSync(db, operate, {
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: pathname,
					operationLabel: "state.startup-checkpoint.inspect-and-claim"
				}) : operate();
			} finally {
				if (restoreForeignKeys && db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
			}
		} finally {
			db.close();
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
	if (!withExistingOpenClawStateDatabaseReadOnly(({ db }) => isUninitializedNativeStartupDatabase(db), options)) return;
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath(options);
	withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => {
		const db = openNodeSqliteDatabase(pathname);
		try {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
			if (!isUninitializedNativeStartupDatabase(db)) return;
			assertSqliteIntegrity(db, pathname);
			initializeCanonicalSchema(db, pathname, env, { kind: "existing" });
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
	return withStateDatabaseSchemaMaintenance({
		databasePath: pathname,
		busyTimeoutMs
	}, () => {
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
			const includeAgentDeletionJournal = tableExists(db, "agent_deletion_journal") || hasPreJournalStateSchema(db) || initialization.kind === "fresh" && isUninitializedNativeStartupDatabase(db);
			if (previousVersion === 20) {
				assertNoLegacyStateRuntimeRepair(db, pathname);
				const indexes = verifyAndRepairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, {
					allowMissingColumns: true,
					validateAfterRepair: () => {
						assertCanonicalStateSchemaShape(db, pathname);
						assertOpenClawStateDatabaseForMaintenance(db, { pathname });
					}
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
			executeCanonicalStateSchema(db, {
				includeVersionLazyAdditiveTables: true,
				includeAgentDeletionJournal
			});
			migrateLegacyCronRunLogsToTaskRuns(db);
			if (previousVersion < 3) {
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
//#region src/state/openclaw-state-db-repair.ts
function repairStateSchema(pathname, env, scope) {
	assertOpenClawStateSchemaRepairAllowed(pathname);
	const db = openNodeSqliteDatabase(pathname, { enableForeignKeyConstraints: false });
	const rebuiltIndexNames = /* @__PURE__ */ new Set();
	let indexChanges = [];
	let ownershipRefused = false;
	try {
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		const closeReadAdmission = scope === "automatic" ? void 0 : openDoctorStateSchemaReadAdmission(db);
		try {
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
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
		const repairAdmittedSchema = prepareStateDatabaseSchemaRepair(db, pathname, env);
		const canInspectIndexes = scope !== "readability" && !hasDanglingSkillWorkshopCollectionReviewIndex(db);
		const assertIndexRepairCurrent = () => {
			assertOpenClawStateDatabaseOwner(db, { pathname });
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: pathname,
				env
			});
		};
		indexChanges = canInspectIndexes ? repairDoctorSqliteIndexCorruption(db, pathname, {
			label: "shared-state",
			assertCurrent: assertIndexRepairCurrent
		}) : [];
		if (scope === "indexes") {
			if (canInspectIndexes && (indexChanges.length > 0 || openClawStateDatabaseCache.getOpenClawStateDatabaseRecordedFailure(pathname) || readOpenClawDatabaseQuarantineFailure("state", pathname, { env }))) runSqliteImmediateTransactionSync(db, () => {
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
					env
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
			applied.push(...recoverOrphanTaskDeliveryRows(db, pathname));
			const previousVersion = readStateSchemaMigrationVersion(db);
			const includeAgentDeletionJournal = tableExists(db, "agent_deletion_journal") || hasPreJournalStateSchema(db);
			const preAuditSchema = previousVersion === 1 && !tableExists(db, "audit_events");
			if (preAuditSchema) assertOpenClawStateDatabaseOwner(db, { pathname });
			if (previousVersion === 20) {
				for (const name of verifyAndRepairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowMissingColumns: true })) rebuiltIndexNames.add(name);
				assertSqliteSchemaTablesPresent(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: [...LAZY_ADDITIVE_STATE_TABLES, ...DOCTOR_OWNED_STATE_TABLES] });
			} else {
				openClawStateMigrationAssertions.get(previousVersion)?.(db, { pathname });
				assertSqliteIntegrity(db, pathname);
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
				ensureAdditiveStateColumns(db, "repair");
				for (const migration of versionedStateMigrations) if (migration.migrate(db, previousVersion)) applied.push(migration.applied);
				executeCanonicalStateSchema(db, {
					includeVersionLazyAdditiveTables: previousVersion !== 20,
					includeAgentDeletionJournal
				});
				migrateLegacyCronRunLogsToTaskRuns(db);
				if (previousVersion < 3) {
					repairLegacyGatewayRestartHandoffsForStrictMigration(db);
					ensureFirstUseAdditiveStateColumnsForStrictMigration(db);
				}
				const strictMigration = migrateSqliteSchemaToStrictInTransaction(db, getOpenClawStateRuntimeSchema({
					includeVersionLazyAdditiveTables: previousVersion !== 20,
					includeAgentDeletionJournal: tableExists(db, "agent_deletion_journal")
				}), { databaseLabel: pathname });
				if (strictMigration.migratedTables.length > 0) applied.push(`Migrated shared state tables to SQLite STRICT typing (${strictMigration.migratedTables.length})`);
				for (const name of repairCanonicalSqliteIndexes(db, pathname, OPENCLAW_STATE_SCHEMA_SQL, { verifyPhysicalIntegrity: false })) rebuiltIndexNames.add(name);
			}
			markCurrentStateSchemaVersion(db, { createMetadataIfMissing: previousVersion < 20 });
			if (readStateSchemaContentVersion(db) === 20) assertCurrentStateRuntimeSchema(db, pathname);
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
	if (behavior.artifactPreservingReadOnly) return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname), {
		...options,
		path: pathname
	}) ?? [];
	const db = openNodeSqliteDatabase(pathname, { readOnly: true });
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
function repairDoctorStateDatabase(options, scope) {
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
	return repairDoctorStateDatabase(options, "doctor");
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
	return withOpenClawStateStartupCheckpointConnection(callback, options, ensureOpenClawStateRuntimeSchema);
}
/** Complete native bootstrap without migrating mature shared state. */
function initializeNativeOpenClawStateDatabase(options = {}) {
	initializeNativeOpenClawStateConnection(options, (db, pathname, env, initialization) => ensureOpenClawStateRuntimeSchema(db, pathname, env, initialization, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, true));
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
		if (isExistingOpenClawStateSchema(pathname, db) || options.requireCanonicalSchema) assertExistingOpenClawStateRuntimeSchema(db, pathname);
		if (readStateSchemaContentVersion(db) === 20) assertOpenClawStateDatabaseForMaintenance(db, { pathname });
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
			stop: async () => {},
			reclaimFreePages: createSqliteWalReclamationResult,
			close: () => connection.close()
		}
	};
}
/** Open or return a cached shared state database after schema and migration checks. */
function openOpenClawStateDatabaseWithBusyTimeout(options = {}, busyTimeoutMs = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, lockFailureReporting = "report", remainingColdAdmissionTimeout) {
	getOpenClawDatabaseMaintenanceScope()?.assertAdmission();
	const env = options.env ?? process.env;
	const pathname = options.database?.path ?? resolveDatabasePath(options);
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
			if (readSqliteUserVersion(cached.db) === 20) deferredStateDatabases.delete(cached.db);
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
		setSqliteBusyTimeout(unpublished.db, busyTimeoutMs);
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
		if (!existingSchema && readSqliteUserVersion(database.db) < 20) {
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
		if (readSqliteUserVersion(db) >= 20 || readStateSchemaContentVersion(db) < 20) return;
		return { blocker: readStateSchemaPublicationBlocker(db) };
	}, options);
	if (!pending || pending.blocker) return pending?.blocker;
	const pathname = resolveDatabasePath(options);
	try {
		return withStateDatabaseSchemaMaintenance({ databasePath: pathname }, () => runOpenClawStateWriteTransaction(({ db }) => {
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
	let database = existing;
	let callbackEntered = false;
	let committed;
	const execute = (remaining) => {
		const acquired = options.database ? openOpenClawStateDatabase(options) : database ?? openOpenClawStateDatabaseWithBusyTimeout(options, 5e3, "report", remaining);
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
		const location = database.db.location();
		if (!location) throw new Error("Existing shared-state schema admission requires a filesystem-backed database.");
		if (!isExistingOpenClawStateSchema(location, database.db)) throw new Error("Existing shared-state schema admission requires its selected physical database.");
		assertExistingOpenClawStateRuntimeSchema(database.db, database.path);
	}
}
//#endregion
export { listSqliteTargetCandidatePathsForSessionStorePath as C, listConfiguredSessionStoreAgentIds as S, verifyAndRepairCanonicalSqliteIndexes as _, reconcileOpenClawStateSchemaPublication as a, resolveOpenClawAgentDatabaseDiscoveryPaths as b, repairOpenClawStateDatabaseSchema as c, withOpenClawStateStartupMigrationCheckpointDatabase as d, detectOpenClawStateDatabaseSchemaMigrations as f, verifyAndRepairCanonicalSqliteIndexSteps as g, repairCanonicalSqliteIndexes as h, prepareOpenClawStateDatabaseSchema as i, runOpenClawStateWriteTransaction as l, repairDoctorSqliteIndexCorruption as m, openExistingOpenClawStateDatabaseReadOnly as n, repairOpenClawStateDatabaseIndexesForDoctor as o, hasPreJournalStateSchema as p, openOpenClawStateDatabase as r, repairOpenClawStateDatabaseReadabilityForDoctor as s, initializeNativeOpenClawStateDatabase as t, runWithOpenClawStateBusyTimeout as u, ensureOpenClawStatePermissions as v, resolveUnsuffixedSqliteTargetFromSessionStorePath as w, isConfiguredSessionStoreAgentId as x, prepareStateDatabaseInitialization as y };
