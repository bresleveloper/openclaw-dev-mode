import { a as resolveGlobalMap, d as extractErrorCode, l as collectErrorGraphCandidates, r as pruneMapToMaxSize, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { A as describeAgentPathMigration, F as resolveOpenClawStateDirForDatabasePath, G as getSqliteRuntimeCapabilities, I as resolveOpenClawStateSqliteDir, L as resolveOpenClawStateSqlitePath, M as resolveDatabasePath, R as resolveQuarantineStorePath, W as ensureSqliteLibrarySelected, d as resolveRuntimeProcessEntrypointUrl, j as existingPathOrUndefined, u as captureRuntimeWorkerSource, x as StateDatabaseOfflineMaintenanceError, y as StateDatabaseAdmissionPendingError, z as warnAgentPathMigration } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { Dt as assertExistingDatabaseIdentity, E as resolveSqliteDatabaseFilePath, G as SqliteCoordinatorError, J as throwSqliteLifecycleErrors, K as createSqliteLifecycleAggregateError, Mt as readDatabaseIdentityBirthtime, V as withSqlitePostCommitPublications, Y as OPENCLAW_STATE_SCHEMA_SQL, xt as quoteSqliteIdentifier } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection, n as captureSqliteReaderOwner } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord, r as asOptionalRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { A as resolveConfigIncludes, C as resolveIncludeRoots, D as hashConfigIncludeRaw, E as resolveProfileStateDir, O as readConfigIncludeFileWithGuards, R as expandHomePrefix, T as normalizeProfileName, V as resolveUserPath, W as resolveIdentityPathViaExistingAncestorSync, b as resolveConfigPath, j as parseJsonWithJson5Fallback, k as resolveConfigIncludeWritePath, q as resolveConfigEnvVars, t as createSubsystemLogger, w as resolveStateDir, z as resolveRequiredHomeDir } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { M as readStringValue, O as normalizeOptionalLowercaseString, S as resolveNonNegativeIntegerOption, a as DEFAULT_SECRET_PROVIDER_ALIAS, k as normalizeOptionalString } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { A as runScopedSqliteReadOnlyOperation, C as readSqliteUserVersion, Mt as isArtifactPreservingStateRead, Nt as withArtifactPreservingStateReads, S as isSqliteSchemaVersionError, Tt as retainSnapshotWork, gt as resolveOpenClawAgentSqlitePath, ht as resolveIncognitoOpenClawAgentSqlitePath, i as retainOpenClawStateWorkerErrorPayload, jt as artifactPreservingReads, r as hydrateOpenClawStateWorkerError, wt as retainSnapshotTempDirectory } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import { _ as mapRetainedOperation, c as WorkerTaskError, g as flatMapRetainedOperation, l as DEFAULT_WORKER_PENDING_BYTES, m as createRetainedOperation, n as createOwnedWorkerTaskPool, s as resolveStateReadWorkerCount, u as captureRetainedNativeWorkerSource } from "./openclaw-state-read-worker-task-pool-CsV_Xz7_.mjs";
import { n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { n as syncDirectorySync } from "./openclaw-state-read-directory-durability-DR8KRku8.mjs";
import { B as prepareSqliteReadOnlyLocation, C as cloneEnvWithPlatformSemantics, D as admitStateSchemaFacts, G as isUpdateRehearsalPrivateDatabase, H as prepareSqliteReadOnlyLocationSync, J as quarantineOrphanedSqliteSidecars, M as getStateRuntimeSchemaAdmission, N as getStateSchemaVersionAdmission, O as assertSupportedStateSchemaVersion, P as publishStateRuntimeSchemaAdmission, S as applyConfigEnvVars, T as SQLITE_IDLE_HANDLE_TTL_MS, Tt as recordExistingOpenClawStateSchemaDatabase, U as startSqliteReadOnlyLocationAsync, V as prepareSqliteReadOnlyLocationAwaited, W as withSqliteSnapshotWorker, X as prepareSqliteReadOnlyLocationFromOwnedDatabase, Y as resolveSqliteDatabaseFilePaths, a as confirmCachedOpenClawStateDatabaseIntegrity, b as captureOpenClawStateWorkerContextWithAdmission, bt as hashFileDescriptorSync, d as registerOpenClawStateDatabaseAsyncResource, dt as SqliteRepairableForeignKeyError, f as registerOpenClawStateDatabaseLifecycleListener, ft as assertSqliteIntegrity, g as assertStateDatabaseIntegrityOnce, gt as sqliteIntegrityCheckSteps, i as captureOpenClawStateIntegrityAdmission, it as configureSqlitePreSchemaPragmas, j as createStateSchemaAdmission, k as readStateSchemaContentVersion, m as retainOpenClawStateDatabaseForIndependentRead, n as borrowOpenClawStateDatabaseForAsyncRead, nt as createPrivateSqliteTempDirectorySync, ot as createSqliteWalReclamationResult, p as requireOpenClawStateDatabaseIdentity, pt as isTerminalSqliteIntegrityError, r as captureOpenClawStateDatabaseReadAdmission, rt as configureSqliteConnectionPragmas, s as openClawStateDatabaseCache, st as prepareSqliteDatabaseDirectory, u as recordOpenClawStateDatabaseOpenFailure, v as captureOpenClawStateReadContextWithAdmission, w as isTruthyEnvValue, wt as isExistingOpenClawStateSchema, y as captureOpenClawStateReadWorkerContextWithAdmission, z as openSqliteReadOnlyDatabase } from "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import { t as formatErrorMessage } from "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { t as isPromiseLike } from "./openclaw-state-read-promise-like-D7-l5Fsp.mjs";
import { C as enableNodeSqliteKyselyStatementCache, a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { M as resolveImmutableSqliteFileUri, S as getOpenClawDatabaseMaintenanceScope, T as observeOpenClawDatabaseMaintenanceResource, c as applyPrivateModeSync, g as StateDatabaseReadAdmissionInvalidatedError, h as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, k as openNodeSqliteDatabase, n as assertStateDatabaseAccessAllowed, o as getStateDatabaseSchemaLease, s as withStateDatabaseColdAdmission, y as allowsMaintenanceLiveAuthorityReads } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { E as runSqliteSchemaReadSnapshotSync, m as getAdmittedSqliteSchemaFacts, x as runSqliteReadOperationSync } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { a as getSqliteWorkerStateIntegrityAdmission, n as captureSqliteWorkerWalMaintenanceSuspension, r as getSqliteWorkerExistingDatabaseIdentity } from "./openclaw-state-read-sqlite-worker-state-context-BUv34tes.mjs";
import { a as tableExists, m as requireNativeDatabaseFile, n as ensureColumn, o as tableHasColumn } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { i as setSqliteBusyTimeout, r as runWithSqliteBusyTimeout } from "./openclaw-state-read-sqlite-busy-timeout-BW3lmGFD.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { i as runSqliteImmediateTransactionSync, o as runSqliteSingleStatementSync, t as assertTransactionUsable } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { a as readTrackedStateDatabaseIdentity, r as openTrackedStateDatabase } from "./openclaw-state-read-openclaw-state-db-handle-BSLzO3AU.mjs";
import { n as StartupMaintenanceRequiredError } from "./openclaw-state-read-startup-maintenance-required-C7h5z_Lq.mjs";
import { A as versionedStateMigrations, At as openEngineStore, B as StateSchemaMutationConflictError, C as assertOpenClawStateDatabaseForMaintenance, Ct as ensureStatePostgresFragment, D as migrateBoundedStateSchema, Dt as stateEngineSchema, E as markCurrentStateSchemaVersion, Et as stateEngineInput, G as backfillCronRunLogEntryJson, H as migratePredicateColumnsV21, J as repairLegacySubagentExecutionPayloads, K as backfillDeliveryQueueEntriesFromEntryJson, L as assertOpenClawStateWriteAllowed, O as openClawStateMigrationAssertions, Ot as readStateSchemaPublicationBlocker, P as getOpenClawStateRuntimeSchema, S as migrateSingletonStateFoldInV12, St as assertStateFileSnapshotAllowed, T as executeCanonicalStateSchema, Tt as isStatePostgres, U as backfillAcpReplayEstimatedBytes, V as withStateDatabaseSchemaMaintenance, W as backfillCronJobsFromJobJson, Y as repairLegacySubagentRetainedResults, _ as logRetiredStateTableMigration, _t as createSqliteTableContractReader, a as assertExistingOpenClawStateRuntimeSchema, at as CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS, c as isOpenClawStateSchemaFastPathEligible, d as assertCanonicalStateSchemaShape, dt as migrateLegacyCronRunLogsToTaskRuns, g as repairLegacyGatewayRestartHandoffsForStrictMigration, h as migrateWorkerPlacementExecutionModeSchema, i as withOpenClawStateReadOnlyLocation, j as writeCurrentStateSchemaMetadata, k as runStateSchemaMigrationTransaction, m as migrateAgentDatabaseRelativePaths, o as assertCurrentStateRuntimeSchema, ot as CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS, p as dropLegacyStateTables, q as ensureOperatorApprovalResolutionRefs, r as openOpenClawStateReadOnlyLocation, s as assertNoLegacyStateRuntimeRepair, st as ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS, t as assertStateReadSchema, v as runRetiredStateTableMigrations, vt as getCanonicalSqliteNamedIndexContracts, w as assertOpenClawStateDatabaseOwner, wt as inspectStateSqlite, x as createStateConfigMachineTable, xt as admitStatePostgres, y as migrateSessionWatchCursorProvenance, yt as getCanonicalSqliteTableNames, z as isOpenClawStateWriteContentionError } from "./openclaw-state-read.worker.js";
import { t as LEGACY_IMPLICIT_AGENT_ID } from "./openclaw-state-read-session-key-CJdIm256.mjs";
import { t as observeOwnedDirectory } from "./openclaw-state-read-owned-directory-observation-6SUeitZe.mjs";
import { u as acquireSqliteDatabaseAdmissionTurn } from "./openclaw-state-read-sqlite-worker-store-BDES2IEB.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-read-openclaw-state-feature-schema-XEi5Ut_x.mjs";
import fs, { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { createHash } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import "node:fs/promises";
import { performance as performance$1 } from "node:perf_hooks";
import { isProxy } from "node:util/types";
import JSON5 from "json5";
//#region src/cli/command-format.ts
const CLI_PREFIX_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b|^openclaw\b/;
const CONTAINER_FLAG_RE = /(?:^|\s)--container(?:\s|=|$)/;
const PROFILE_FLAG_RE = /(?:^|\s)--profile(?:\s|=|$)/;
const DEV_FLAG_RE = /(?:^|\s)--dev(?:\s|$)/;
const UPDATE_RE = /^(?:\s+--(?:dev|no-color|(?:profile|log-level)[=\s]+\S+))*\s+update(?:\s|$)/;
const CONTAINER_HINT_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/;
function formatCliCommand(command, env = process.env) {
	const rawContainer = env.OPENCLAW_CONTAINER_HINT?.trim();
	const container = rawContainer && CONTAINER_HINT_RE.test(rawContainer) ? rawContainer : void 0;
	const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
	if (!container && !profile) return command;
	if (!CLI_PREFIX_RE.test(command)) return command;
	let addition;
	if (container && !CONTAINER_FLAG_RE.test(command) && !UPDATE_RE.test(command.replace(CLI_PREFIX_RE, ""))) addition = `--container ${container}`;
	if (!container && profile && !PROFILE_FLAG_RE.test(command) && !DEV_FLAG_RE.test(command)) addition = `--profile ${profile}`;
	return addition ? command.replace(CLI_PREFIX_RE, (match) => `${match} ${addition}`) : command;
}
//#endregion
//#region src/config/model-policy-allowlist-migration.ts
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isRecord(value) && Object.hasOwn(value, "allow");
}
//#endregion
//#region src/config/runtime-config-publication.ts
/** The runtime config owner publishes identity facts before notifying consumers. */
const runtimeConfigPublication = {};
//#endregion
//#region src/shared/immutable-data.ts
const deeplyFrozenPlainData = /* @__PURE__ */ new WeakSet();
function isPlainDataObject(value) {
	if (isProxy(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype || Array.isArray(value) && prototype === Array.prototype;
}
function inspectPlainData(value, freeze, requireFrozen = true) {
	if (!value || typeof value !== "object") return typeof value !== "function";
	if (deeplyFrozenPlainData.has(value)) return true;
	if (!freeze && requireFrozen && (isProxy(value) || !Object.isFrozen(value))) return false;
	let plain = true;
	const inspected = /* @__PURE__ */ new Set();
	const pending = [value];
	while (pending.length) {
		const candidate = pending.pop();
		if (inspected.has(candidate)) continue;
		if (!isPlainDataObject(candidate)) {
			if (!freeze) return false;
			plain = false;
			continue;
		}
		if (!freeze && requireFrozen && !Object.isFrozen(candidate)) return false;
		inspected.add(candidate);
		for (const key of Reflect.ownKeys(candidate)) {
			const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
			const member = descriptor.value;
			if (!("value" in descriptor) || typeof member === "function") {
				if (!freeze) return false;
				plain = false;
				continue;
			}
			if (member && typeof member === "object" && !deeplyFrozenPlainData.has(member)) pending.push(member);
		}
		if (freeze) Object.freeze(candidate);
	}
	if (plain && (freeze || requireFrozen)) for (const candidate of inspected) deeplyFrozenPlainData.add(candidate);
	return plain;
}
/** Immutable graphs keep their classification for exactly as long as their objects live. */
function isDeeplyFrozenPlainData(value) {
	return inspectPlainData(value, false);
}
/** Freeze an owner's cloned JSON snapshot without executing opaque members. */
function freezeJsonSnapshot(value) {
	inspectPlainData(value, true);
	return value;
}
//#endregion
//#region src/agents/agent-dir-registry.ts
/** Process-local reverse registry from prepared agent directories to agent ids. */
const agentIdsByDir = /* @__PURE__ */ new Map();
const preparedPaths = resolveGlobalMap(Symbol.for("openclaw.agentDirPreparedPaths"), (paths) => {
	for (const prepared of paths.values()) prepared.close();
	paths.clear();
}, "shared-state");
function registryPath(agentDir, env, registering = false) {
	const pathname = path.resolve(resolveUserPath(agentDir, env));
	const cached = preparedPaths.get(pathname);
	if (cached) return cached.key;
	const key = normalizeAgentDirRegistryPath(pathname, env);
	if (!isMainThread || !registering && !agentIdsByDir.has(key)) return key;
	const observations = [];
	const prepared = {
		key,
		close: () => observations.forEach((observation) => observation.close())
	};
	preparedPaths.set(pathname, prepared);
	for (let child = pathname; path.dirname(child) !== child; child = path.dirname(child)) {
		const basename = path.basename(child);
		observations.push(observeOwnedDirectory(path.dirname(child), (filename) => {
			if (filename === void 0 || filename === basename) {
				if (resolveIdentityPathViaExistingAncestorSync(pathname) === key) return;
				preparedPaths.delete(pathname);
				prepared.close();
			}
		}, { recoveryIntervalMs: 3e4 }));
	}
	const capacity = Math.max(256, agentIdsByDir.size + 1);
	for (const [oldestPath, oldest] of preparedPaths) {
		if (preparedPaths.size <= capacity) break;
		preparedPaths.delete(oldestPath);
		oldest.close();
	}
	return key;
}
function normalizeAgentDirRegistryPath(agentDir, env = process.env) {
	return resolveIdentityPathViaExistingAncestorSync(resolveUserPath(agentDir, env));
}
/** Register a resolved agent directory for later reverse lookup. */
function registerResolvedAgentDir(params) {
	const key = registryPath(params.agentDir, params.env, true);
	const agentIds = agentIdsByDir.get(key) ?? /* @__PURE__ */ new Set();
	const agentId = normalizeAgentId(params.agentId);
	if (agentIds.has(agentId)) return false;
	agentIds.add(agentId);
	agentIdsByDir.set(key, agentIds);
	return true;
}
//#endregion
//#region src/agents/agent-roster.ts
function collectAgentEntries(cfg, withSource, limit) {
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const result = [];
		for (const id in roster.value) {
			if (!Object.hasOwn(roster.value, id)) continue;
			const entry = roster.value[id];
			if (isRecord(entry)) {
				const projected = {
					...entry,
					id
				};
				result.push(withSource ? {
					entry: projected,
					source: {
						kind: "entries",
						key: id
					}
				} : projected);
				if (result.length === limit) break;
			}
		}
		return result;
	}
	if (roster?.kind !== "list" || !Array.isArray(roster.value)) return [];
	const listed = [];
	roster.value.some((entry, index) => {
		if (entry !== null && typeof entry === "object") listed.push({
			entry,
			source: {
				kind: "list",
				index
			}
		});
		return listed.length === limit;
	});
	return withSource ? listed : listed.map(({ entry }) => entry);
}
/** Lists valid configured agent entries from config. */
function listAgentEntriesWithSource(cfg) {
	return collectAgentEntries(cfg, true);
}
/** Lists valid configured agent entries from either supported representation. */
function listAgentEntries(cfg) {
	return collectAgentEntries(cfg, false);
}
/** Reads the explicitly owned raw roster without normalizing malformed values. */
function readAgentRosterProperty(raw) {
	if (!isRecord(raw)) return;
	const agents = raw.agents;
	if (!isRecord(agents)) return;
	for (const kind of ["entries", "list"]) {
		const value = agents[kind];
		if (Object.hasOwn(agents, kind) && value !== void 0) return {
			kind,
			value
		};
	}
}
/** True when raw config explicitly owns either supported roster representation. */
function hasAgentRosterProperty(raw) {
	return readAgentRosterProperty(raw) !== void 0;
}
/** Lists unique configured agent ids. */
function listAgentIds(cfg) {
	const agents = listAgentEntries(cfg);
	if (agents.length === 0 && !hasAgentRosterProperty(cfg)) return [LEGACY_IMPLICIT_AGENT_ID];
	return [...new Set(agents.map((entry) => normalizeAgentId(entry?.id)))];
}
function tryResolveSoleAgentId(cfg) {
	const agents = collectAgentEntries(cfg, false, 2);
	if (agents.length === 0) {
		if (!hasAgentRosterProperty(cfg)) return LEGACY_IMPLICIT_AGENT_ID;
		return;
	}
	return agents.length === 1 ? normalizeAgentId(agents[0].id) : void 0;
}
function tryResolveRawLegacyDefaultAgentId(cfg) {
	if (cfg.agents?.ownership === "explicit") return;
	const marked = collectAgentEntries(cfg, false).filter((entry) => entry.default === true);
	return marked.length === 1 ? normalizeAgentId(marked[0].id) : void 0;
}
/** @deprecated Use tryResolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
function tryResolveDefaultAgentId(cfg) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwner(cfg) {
	return tryResolveDefaultAgentId(cfg);
}
//#endregion
//#region src/agents/workspace-default-path.ts
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
	const workspaceDir = env.OPENCLAW_WORKSPACE_DIR?.trim();
	if (workspaceDir) return path.resolve(workspaceDir);
	if (env.OPENCLAW_STATE_DIR?.trim()) return path.join(resolveStateDir(env, homedir), "workspace");
	const home = resolveRequiredHomeDir(env, homedir);
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (profile && normalizeOptionalLowercaseString(profile) !== "default") return path.join(resolveProfileStateDir(profile, env, homedir), "workspace");
	return path.join(home, ".openclaw", "workspace");
}
resolveDefaultAgentWorkspaceDir();
//#endregion
//#region src/agents/agent-scope-config.ts
/** Resolves configured agent ids, directories, workspaces, and merged agent defaults. */
var AgentSelectionRequiredError = class extends Error {
	constructor(agentIds, context) {
		const surface = context?.surface ?? "this operation";
		const hint = context?.hint ?? "Select an agent explicitly; CLI callers can pass --agent <id>, channels can add a binding, and ambient services can set their agentId target.";
		super(`Multiple agents are configured, but ${surface} has no explicit owner. ${hint}`);
		this.code = "AGENT_SELECTION_REQUIRED";
		this.name = "AgentSelectionRequiredError";
		this.agentIds = agentIds;
		this.surface = surface;
		this.hint = hint;
	}
};
let activeAgentRosterFactsBatch;
const agentRosterFacts = /* @__PURE__ */ new WeakMap();
function readAgentRosterFacts(cfg) {
	if (void 0 === cfg) return activeAgentRosterFactsBatch.facts;
	const current = runtimeConfigPublication.current;
	const publication = current?.config === cfg ? current.revision : void 0;
	if (publication === void 0 && !isDeeplyFrozenPlainData(cfg)) return;
	let cached = agentRosterFacts.get(cfg);
	if (!cached || cached.publication !== publication) {
		cached = {
			publication,
			facts: {}
		};
		agentRosterFacts.set(cfg, cached);
	}
	return cached.facts;
}
/** Returns a configured agent id or throws the canonical CLI selection error. */
function resolveConfiguredAgentId(cfg, agentId) {
	if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${agentId}". Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	return agentId;
}
function resolveSoleAgentId(cfg, context) {
	const sole = tryResolveSoleAgentId(cfg);
	if (sole) return sole;
	const agentIds = listAgentIds(cfg);
	if (agentIds.length === 0) throw new Error("No agents configured. Run `openclaw onboard` or `openclaw agents add` first.");
	throw new AgentSelectionRequiredError(agentIds, context);
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwnerAgentId(cfg) {
	const facts = readAgentRosterFacts(cfg);
	if (facts?.legacyDataOwnerAgentId) return facts.legacyDataOwnerAgentId.value;
	const value = tryResolveLegacyDataOwner(cfg);
	if (facts) facts.legacyDataOwnerAgentId = { value };
	return value;
}
/** Resolves the recorded default after migration, or a sole/raw legacy owner. */
function tryResolveLegacyCompatibilityAgentId(cfg) {
	const facts = readAgentRosterFacts(cfg);
	if (facts?.compatibilityAgentId) return facts.compatibilityAgentId.value;
	let value;
	if (cfg.agents?.ownership === "explicit") {
		const recorded = normalizeOptionalString(cfg.agents.defaults?.systemAgent?.agentId);
		const agentId = recorded ? normalizeAgentId(recorded) : void 0;
		value = agentId && listAgentIds(cfg).includes(agentId) ? agentId : void 0;
	} else value = tryResolveLegacyDataOwnerAgentId(cfg);
	if (facts) facts.compatibilityAgentId = { value };
	return value;
}
/** Resolves the owner for ambient system work and explicit requests. */
function tryResolveAmbientOwnerAgentId(cfg, requestedAgentId) {
	const explicitAgentId = normalizeOptionalString(requestedAgentId) ?? normalizeOptionalString(cfg.agents?.defaults?.systemAgent?.agentId);
	return explicitAgentId ? normalizeAgentId(explicitAgentId) : tryResolveLegacyCompatibilityAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
/**
* @deprecated Ambient system work uses resolveAmbientOwnerAgentId so the configured
* system agent is honored; explicit-selection surfaces use resolveSoleAgentId. This
* accepts raw shipped markers only for input compatibility.
*/
function resolveDefaultAgentId(cfg, context) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? resolveSoleAgentId(cfg, context);
}
function resolveAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const facts = readAgentRosterFacts(cfg);
	if (facts) {
		const found = (facts.entryByNormalizedId ??= buildAgentEntryIndex(cfg)).get(id);
		return found ? found.clone ? { ...found.entry } : found.entry : void 0;
	}
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const entries = roster.value;
		for (const key in entries) {
			if (!Object.hasOwn(entries, key)) continue;
			const entry = entries[key];
			if (isRecord(entry) && normalizeAgentId(key) === id) return {
				...entry,
				id: key
			};
		}
		return;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => entry !== null && typeof entry === "object" && normalizeAgentId(entry.id) === id);
}
/**
* First-match index over the projected roster for batch point lookups.
*
* Keyed entries must stay clone-on-read (callers may mutate the returned
* entry); list entries keep the original object, matching the direct
* traversal semantics of `resolveAgentEntry` outside a batch.
*/
function buildAgentEntryIndex(cfg) {
	const index = /* @__PURE__ */ new Map();
	for (const { entry, source } of listAgentEntriesWithSource(cfg)) {
		const normalizedId = normalizeAgentId(entry?.id);
		if (!index.has(normalizedId)) index.set(normalizedId, {
			clone: source.kind === "entries",
			entry
		});
	}
	return index;
}
/** Resolves merged config for one agent id. */
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const entry = resolveAgentEntry(cfg, id) ?? (!hasAgentRosterProperty(cfg) && id === "main" ? { id } : void 0);
	if (!entry) return;
	const agentDefaults = cfg.agents?.defaults;
	return {
		name: readStringValue(entry.name),
		workspace: readStringValue(entry.workspace),
		agentDir: readStringValue(entry.agentDir),
		model: typeof entry.model === "string" || entry.model && typeof entry.model === "object" ? entry.model : void 0,
		...entry.models ? { models: entry.models } : {},
		...entry.params ? { params: entry.params } : {},
		...entry.runtime ? { runtime: entry.runtime } : {},
		...hasExplicitModelPolicyAllow(entry.modelPolicy) ? { modelPolicy: entry.modelPolicy } : {},
		utilityModel: readStringValue(entry.utilityModel),
		decisionModel: readStringValue(entry.decisionModel),
		thinkingDefault: entry.thinkingDefault,
		verboseDefault: entry.verboseDefault ?? agentDefaults?.verboseDefault,
		toolProgressDetail: entry.toolProgressDetail ?? agentDefaults?.toolProgressDetail,
		reasoningDefault: entry.reasoningDefault,
		fastModeDefault: entry.fastModeDefault ?? agentDefaults?.fastModeDefault,
		contextInjection: entry.contextInjection,
		bootstrapMaxChars: entry.bootstrapMaxChars,
		bootstrapTotalMaxChars: entry.bootstrapTotalMaxChars,
		experimental: typeof entry.experimental === "object" && entry.experimental ? {
			...agentDefaults?.experimental,
			...entry.experimental
		} : agentDefaults?.experimental,
		skills: Array.isArray(entry.skills) ? entry.skills : void 0,
		memory: entry.memory,
		humanDelay: entry.humanDelay,
		typingMode: entry.typingMode ?? agentDefaults?.typingMode,
		tts: entry.tts,
		contextLimits: typeof entry.contextLimits === "object" && entry.contextLimits ? {
			...agentDefaults?.contextLimits,
			...entry.contextLimits
		} : agentDefaults?.contextLimits,
		heartbeat: entry.heartbeat,
		identity: entry.identity,
		groupChat: entry.groupChat,
		subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : void 0,
		embeddedAgent: typeof entry.embeddedAgent === "object" && entry.embeddedAgent ? entry.embeddedAgent : void 0,
		sandbox: entry.sandbox,
		tools: entry.tools
	};
}
function resolveEffectiveAgentDir(cfg, agentId, deps) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.agentDir?.trim();
	const env = deps?.env ?? process.env;
	return configured ? resolveUserPath(configured, env, deps?.homedir) : path.join(resolveStateDir(env, deps?.homedir), "agents", id, "agent");
}
function resolveAgentDir(cfg, agentId, env = process.env) {
	const agentDir = resolveEffectiveAgentDir(cfg, agentId, { env });
	registerResolvedAgentDir({
		agentId,
		agentDir,
		env
	});
	return agentDir;
}
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
/** Resolves only the legacy unsuffixed target, without reading ownership state. */
function resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath) {
	const concrete = resolveConcreteSessionStorePath(storePath);
	if (!concrete) throw new Error("Session storage requires a concrete store path");
	const resolved = path.resolve(concrete);
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
function listSqliteTargetCandidatePathsForSessionStorePath(storePath, agentId) {
	const unsuffixedTarget = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	if (unsuffixedTarget.agentId || unsuffixedTarget.shared) return [unsuffixedTarget.path];
	const directory = path.dirname(unsuffixedTarget.path);
	const baseName = path.basename(unsuffixedTarget.path, ".sqlite");
	const prefix = agentId ? `${baseName}.${normalizeAgentId(agentId)}` : void 0;
	const candidateNames = /* @__PURE__ */ new Set([path.basename(unsuffixedTarget.path)]);
	try {
		for (const fileName of readdirSync(directory)) {
			const databaseName = fileName.replace(/-(?:wal|shm|journal)$/u, "");
			if (databaseName.startsWith(`${baseName}.`) && databaseName.endsWith(".sqlite") && (!prefix || parseSqliteTargetSuffixIndex(databaseName, prefix) !== void 0)) candidateNames.add(databaseName);
		}
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
	return [...candidateNames].map((fileName) => path.join(directory, fileName));
}
function parseSqliteTargetSuffixIndex(fileName, prefix) {
	if (fileName === `${prefix}.sqlite`) return 1;
	if (!fileName.startsWith(`${prefix}.`) || !fileName.endsWith(".sqlite")) return;
	const rawValue = fileName.slice(prefix.length + 1, -7);
	if (!/^[1-9]\d*$/.test(rawValue)) return;
	const value = Number(rawValue);
	return Number.isSafeInteger(value) && value >= 2 && String(value) === rawValue ? value : void 0;
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
//#region src/config/sessions/paths.ts
function resolveSessionTranscriptsDirForAgent(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	if (!agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	const root = resolveStateDir(env, homedir);
	const id = normalizeAgentId(agentId);
	return path.join(root, "agents", id, "sessions");
}
var SessionStoreAgentIdRequiredError = class extends Error {
	constructor() {
		super("Session store path requires an explicit agent id.");
		this.name = "SessionStoreAgentIdRequiredError";
	}
};
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
function resolveSessionStorePathCore(store, opts) {
	const env = opts?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	if (!store) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		return path.join(resolveSessionTranscriptsDirForAgent(agentId, env, homedir), "sessions.json");
	}
	let expandedStore = store;
	if (expandedStore.includes("{agentId}")) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		expandedStore = expandedStore.replaceAll("{agentId}", agentId);
	}
	if (expandedStore.startsWith("~")) expandedStore = expandHomePrefix(expandedStore, {
		home: resolveRequiredHomeDir(env, homedir),
		env,
		homedir
	});
	return path.isAbsolute(expandedStore) ? path.resolve(expandedStore) : path.resolve(resolveStateDir(env, homedir), expandedStore);
}
function resolveAgentsDirFromSessionStorePath(storePath) {
	const candidateAbsPath = path.resolve(storePath);
	if (path.basename(candidateAbsPath) !== "sessions.json") return;
	const sessionsDir = path.dirname(candidateAbsPath);
	if (path.basename(sessionsDir) !== "sessions") return;
	const agentDir = path.dirname(sessionsDir);
	const agentsDir = path.dirname(agentDir);
	if (path.basename(agentsDir) !== "agents") return;
	return agentsDir;
}
//#endregion
//#region src/state/openclaw-state-db-transaction.ts
const managedStateTransactions = resolveGlobalSingleton(Symbol.for("openclaw.managedStateTransactions"), () => /* @__PURE__ */ new WeakSet());
/** Only the synchronous transaction owner may lend its uncommitted authority rows. */
function isManagedStateTransaction(database) {
	return database.isTransaction && managedStateTransactions.has(database);
}
function runManagedStateTransaction(database, operation, options) {
	if (database.isTransaction && !managedStateTransactions.has(database)) throw new Error("Cannot join an unmanaged shared-state transaction; enter through runOpenClawStateWriteTransaction before BEGIN.");
	const transaction = () => withSqlitePostCommitPublications(database, () => {
		const outer = !database.isTransaction;
		if (outer) managedStateTransactions.add(database);
		try {
			return options.singleStatement ? runSqliteSingleStatementSync(database, operation) : runSqliteImmediateTransactionSync(database, operation, options);
		} finally {
			if (outer) managedStateTransactions.delete(database);
		}
	});
	return options.busyTimeoutMs === void 0 || isPostgresSqlConnection(database) ? transaction() : runWithSqliteBusyTimeout(database, options.busyTimeoutMs, transaction);
}
//#endregion
//#region src/state/openclaw-state-db-readonly-reuse.ts
const maintenanceReaders = /* @__PURE__ */ new WeakMap();
/** Mutable maintenance owns this live reader until drainage; each guard queries current rows. */
function withMaintenanceOpenClawStateDatabaseReadOnly(operation, pathname) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	if (!scope || !allowsMaintenanceLiveAuthorityReads(scope, pathname)) return { reused: false };
	scope.assertReadAdmission();
	let readers = maintenanceReaders.get(scope);
	if (!readers) {
		readers = /* @__PURE__ */ new Map();
		maintenanceReaders.set(scope, readers);
	}
	let reader = readers.get(pathname);
	if (!reader) {
		const admission = captureOpenClawStateDatabaseReadAdmission(pathname);
		assertExistingDatabaseIdentity(pathname, admission.identity.key, admission.identity.birthtime);
		const connection = openOpenClawStateReadOnlyLocation(pathname, pathname);
		let closed = false;
		const close = () => {
			if (closed) return;
			if (!connection.close()) throw new Error("Maintenance authority reader cleanup is incomplete");
			closed = true;
			readers.delete(pathname);
			unregister();
		};
		const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === admission.identity.key || identity.canonicalPath === admission.identity.canonicalPath) close();
		} });
		scope.own(connection, "shared-handles", close);
		reader = { read(readOperation) {
			admission.assertCurrent();
			assertExistingDatabaseIdentity(pathname, admission.identity.key, admission.identity.birthtime);
			const value = runSqliteReadOperationSync(connection.database.db, () => {
				assertStateReadSchema(connection.database.db, pathname);
				return readOperation(connection.database);
			});
			if (isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite maintenance authority read must remain synchronous");
			return value;
		} };
		readers.set(pathname, reader);
	}
	return {
		reused: true,
		value: reader.read(operation)
	};
}
/** Current-authority guards can borrow their writer; discovery sees committed rows. */
function withCachedOpenClawStateDatabaseReadOnly(operation, pathname, currentAuthority) {
	return openClawStateDatabaseCache.withCachedOpenClawStateDatabase(pathname, { readOnly: true }, (opened) => {
		if (!opened.db.isOpen) return { reused: false };
		const ownedTransaction = currentAuthority && isManagedStateTransaction(opened.db);
		if (opened.db.isTransaction && !ownedTransaction) return { reused: false };
		try {
			if (isExistingOpenClawStateSchema(pathname, opened.db)) assertStateReadSchema(opened.db, pathname);
			observeOpenClawDatabaseMaintenanceResource(opened.db);
			const value = operation(opened);
			if (ownedTransaction && isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite current-authority read must remain synchronous");
			return {
				reused: true,
				value
			};
		} catch (error) {
			openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(opened, error);
			throw error;
		}
	}) ?? { reused: false };
}
/** A native read borrow can avoid copying only while its original physical path still matches. */
function canReadWarmNativeSourceIndependently(database, pathname, admittedIdentity) {
	const identity = requireOpenClawStateDatabaseIdentity(database);
	if (identity.key !== admittedIdentity) return false;
	try {
		assertExistingDatabaseIdentity(pathname, identity.key);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/openclaw-state-read-pool.ts
function stateReadPools(state) {
	return [state.pool, state.awaitedPool].filter((pool) => pool !== void 0);
}
function createStateReadPool(workerUrl, nativeSource) {
	ensureSqliteLibrarySelected();
	return createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: resolveStateReadWorkerCount(),
		idleTimeoutMs: SQLITE_IDLE_HANDLE_TTL_MS,
		burstIdleTimeoutMs: 3e4,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, nativeSource ? {
		retainedTransport: true,
		nativeSource,
		databaseAccess: "read-only"
	} : { databaseAccess: "read-only" });
}
function closeReadResources(pool, key) {
	return getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources ? pool.closeResources(key) : pool.rotate();
}
/** The same task/close contract; promise-only callers do not synchronously service it. */
function startReadTask(selection, input, options) {
	if (selection.retained) return selection.pool.startTask(input, options);
	const task = selection.pool.runTask(input, options);
	const result = createRetainedOperation(() => {});
	task.result.then(result.resolve, result.reject);
	return {
		...result.operation,
		release(closeOptions) {
			const closed = createRetainedOperation(() => {});
			task.close(closeOptions).then(closed.resolve, closed.reject);
			return closed.operation;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-request.ts
function stringBytes(values) {
	return values.reduce((bytes, value) => bytes + Buffer.byteLength(value ?? "", "utf8"), 0);
}
function commandBytes(value) {
	if (typeof value === "string") return Buffer.byteLength(JSON.stringify(value), "utf8");
	if (typeof value === "number" || typeof value === "bigint") return 8;
	if (typeof value === "boolean") return 1;
	if (value === null || value === void 0) return 0;
	if (Array.isArray(value)) return value.reduce((bytes, entry) => bytes + 8 + commandBytes(entry), 0);
	return Object.entries(value).reduce((bytes, [key, entry]) => bytes + Buffer.byteLength(key, "utf8") + 8 + commandBytes(entry), 0);
}
function requestBytes(request) {
	return commandBytes(request.command) + stringBytes([
		...Object.entries(request.context.environment).flatMap(([key, value]) => [key, value]),
		request.context.existingSchemaPath,
		request.databasePath,
		request.location,
		request.expectedIdentity,
		request.snapshotRoot
	]);
}
//#endregion
//#region src/state/openclaw-state-read-worker.ts
function decodeOpenClawStateReadReply(reply) {
	if (reply.ok) return { value: reply };
	const error = new Error(reply.message);
	retainOpenClawStateWorkerErrorPayload(error, reply.error);
	return {
		error: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true }),
		sourceAdmitted: reply.sourceAdmitted === true
	};
}
async function closeReadPool(state) {
	if (state.closing) return await state.closing;
	const pools = stateReadPools(state);
	if (!pools.length) return;
	const closing = (async () => {
		const results = await Promise.allSettled(pools.map(async (pool) => {
			await closeReadResources(pool);
			await pool.close();
		}));
		throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader pools cleanup failed");
		state.pool = void 0;
		state.awaitedPool = void 0;
	})();
	state.closing = closing;
	try {
		await closing;
	} finally {
		state.closing = void 0;
	}
}
function readRuntimes() {
	return resolveGlobalSingleton(Symbol.for("openclaw.stateReadWorkers"), () => {
		const sources = /* @__PURE__ */ new Map();
		registerOpenClawStateDatabaseAsyncResource({
			phase: "after-resources",
			async close(identity) {
				const results = await Promise.allSettled([...sources.values()].map(async (state) => {
					if (identity) {
						const resources = await Promise.allSettled(stateReadPools(state).map((pool) => closeReadResources(pool, identity.key)));
						throwSqliteLifecycleErrors(resources.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader resources cleanup failed");
					} else await closeReadPool(state);
				}));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
			}
		});
		registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened" && event.identity) {
				const identity = event.identity;
				for (const state of sources.values()) Promise.allSettled(stateReadPools(state).map((pool) => closeReadResources(pool, identity.key))).then((results) => throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader invalidation failed")).catch((error) => {
					process.emitWarning(`Shared-state reader invalidation failed: ${String(error)}`);
				});
			}
		});
		return sources;
	});
}
function readPool(state, admitted, awaitedOnly) {
	if (state.sealed && !admitted || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
	const retained = !awaitedOnly || state.pool !== void 0;
	const key = retained ? "pool" : "awaitedPool";
	if (!state[key]) state[key] = createStateReadPool(state.workerUrl, retained ? state.nativeSource : void 0);
	return {
		pool: state[key],
		retained
	};
}
/** Capture the execution source before snapshot preparation yields. */
function captureOpenClawStateReadSource() {
	const captured = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("stateRead"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration: captured.runtimeGeneration });
	const sources = readRuntimes();
	let runtime = sources.get(nativeSource);
	if (!runtime) {
		const created = {
			nativeSource,
			workerUrl: captured.moduleUrl,
			operations: /* @__PURE__ */ new Set(),
			servicing: false,
			sealed: false
		};
		nativeSource.retain(created, () => {
			created.sealed = true;
			if (!created.stopping) created.stopping = Promise.resolve().then(async () => {
				const results = await Promise.allSettled([...created.operations].map((operation) => Promise.resolve().then(() => operation.close())));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
				await closeReadPool(created);
				sources.delete(nativeSource);
			}).finally(() => {
				created.stopping = void 0;
			});
			return created.stopping;
		});
		sources.set(nativeSource, created);
		runtime = created;
	}
	const state = runtime;
	const admitted = /* @__PURE__ */ new Set();
	return {
		createTransport: (command, onChunk, onChunkAsync, awaitedOnly = false) => createReadTransport(command, state, () => admitted.size > 0, onChunk, onChunkAsync, awaitedOnly),
		own(service, close) {
			if (state.sealed || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
			const inContext = AsyncLocalStorage.snapshot();
			const operation = {
				service: () => inContext(service),
				close: () => inContext(close)
			};
			state.operations.add(operation);
			admitted.add(operation);
			return () => {
				state.operations.delete(operation);
				admitted.delete(operation);
			};
		},
		service() {
			if (state.servicing) return;
			state.servicing = true;
			const errors = [];
			try {
				const operations = Array.from(state.operations);
				for (const operation of operations) if (state.operations.has(operation)) try {
					operation.service();
				} catch (error) {
					errors.push(error);
				}
			} finally {
				state.servicing = false;
			}
			throwSqliteLifecycleErrors(errors, "Shared-state reader source cleanup failed");
		}
	};
}
function createReadTransport(command, state, ownsAdmission, onChunk, onChunkAsync, awaitedOnly = false) {
	const capturedCommand = structuredClone(command);
	const tasks = /* @__PURE__ */ new Map();
	let closed = false;
	let closing;
	let pendingChunks = 0;
	const startCloseTask = (task) => {
		try {
			return mapRetainedOperation(task.release(tasks.get(task)?.retire ? { retire: true } : void 0), () => {
				tasks.delete(task);
			});
		} catch (error) {
			const completion = createRetainedOperation(() => {});
			completion.reject(error);
			return completion.operation;
		}
	};
	const startRun = (context, location, checkFreshAdmission, readCommand, authority, expectedIdentity, snapshotRoot) => {
		const inContext = AsyncLocalStorage.snapshot();
		let task;
		let releaseAdmission;
		let retireAfterRead = false;
		const cleanup = { retire: true };
		const completion = createRetainedOperation(() => inContext(service));
		function service() {
			if (!task || completion.operation.read().status !== "pending") return;
			let outcome;
			try {
				task.service();
				const read = task.read();
				if (read.status === "pending") return;
				if (read.status === "rejected") throw read.error;
				const reply = read.value;
				cleanup.retire = retireAfterRead || Boolean(reply.nativeCleanupFailure);
				outcome = decodeOpenClawStateReadReply(reply);
			} catch (error) {
				outcome = { error };
			}
			releaseAdmission?.();
			releaseAdmission = void 0;
			cleanup.retire ||= "error" in outcome;
			completion.resolve(outcome);
		}
		try {
			if (closed) throw new WorkerTaskError("Shared-state read transport is closed", "unavailable");
			const request = {
				context: {
					environment: { ...context.environment },
					existingSchemaPath: context.existingSchemaPath,
					stateIntegrity: context.stateIntegrity
				},
				databasePath: context.admission.databasePath,
				location,
				checkFreshAdmission,
				expectedIdentity,
				snapshotRoot,
				command: { ...readCommand }
			};
			const pool = readPool(state, ownsAdmission(), awaitedOnly);
			retireAfterRead = !pool.retained && !context.maintenanceScope && readCommand.type !== "admit";
			task = startReadTask(pool, () => {
				const turn = acquireSqliteDatabaseAdmissionTurn(resolveSqliteDatabaseFilePath(location));
				if (!turn) {
					authority.assertCurrent();
					return request;
				}
				return turn.then((release) => {
					releaseAdmission = release;
					try {
						authority.assertCurrent();
						return request;
					} catch (error) {
						releaseAdmission();
						releaseAdmission = void 0;
						throw error;
					}
				});
			}, {
				signal: authority.signal,
				inputBytes: requestBytes(request),
				diagnosticOperation: readCommand.type,
				...onChunkAsync ? { async onRequest(value, { signal: taskSignal }) {
					authority.assertCurrent();
					const signal = AbortSignal.any([authority.signal, taskSignal]);
					signal.throwIfAborted();
					pendingChunks += 1;
					try {
						await onChunkAsync(value, signal);
						signal.throwIfAborted();
						authority.assertCurrent();
						return {
							input: null,
							timeoutMs: 3e5
						};
					} finally {
						pendingChunks -= 1;
						closing?.service();
					}
				} } : onChunk ? { onRequestSync(value) {
					authority.assertCurrent();
					onChunk(value);
					return {
						input: null,
						timeoutMs: 3e5
					};
				} } : {}
			});
			tasks.set(task, cleanup);
			task.result.then(() => completion.operation.service(), () => completion.operation.service());
			completion.operation.service();
		} catch (error) {
			releaseAdmission?.();
			releaseAdmission = void 0;
			completion.reject(error);
		}
		return {
			task,
			operation: completion.operation
		};
	};
	const startValidateFresh = (context, authority) => {
		const run = startRun(context, context.admission.databasePath, true, { type: "admit" }, authority);
		return flatMapRetainedOperation(run.operation, (read) => {
			if ("error" in read) throw read.error;
			authority.assertCurrent();
			if (!run.task) throw new Error("Shared-state admission completed without its retained task");
			return startCloseTask(run.task);
		});
	};
	const startRead = (source, authority) => startRun(source.context, source.location, source.checkFreshAdmission, capturedCommand, authority, source.expectedIdentity, source.snapshotRoot).operation;
	const startClose = () => {
		closed = true;
		if (closing) return closing;
		const releases = [...tasks.keys()].map(startCloseTask);
		const inContext = AsyncLocalStorage.snapshot();
		const completion = createRetainedOperation(() => inContext(service));
		closing = completion.operation;
		function service() {
			if (completion.operation.read().status !== "pending") return;
			const errors = [];
			let pending = pendingChunks > 0;
			for (const release of releases) {
				release.service();
				const outcome = release.read();
				pending ||= outcome.status === "pending";
				if (outcome.status === "rejected") errors.push(outcome.error);
			}
			if (pending) return;
			closing = void 0;
			try {
				throwSqliteLifecycleErrors(errors, "Shared-state reader task cleanup failed");
				completion.resolve(void 0);
			} catch (error) {
				completion.reject(error);
			}
		}
		for (const release of releases) release.result.then(() => completion.operation.service(), () => completion.operation.service());
		completion.operation.service();
		return completion.operation;
	};
	return {
		startValidateFresh,
		startRead,
		startClose
	};
}
//#endregion
//#region src/state/openclaw-state-read-operation.ts
/** Owns query admission and release together, so a later reader can release an earlier slot. */
function startOpenClawStateReadOperation(command, selection) {
	const { pathname, snapshot, scopes, context, preserveArtifacts, preferIndependentWarmRead, controller, signal, receipt } = selection;
	const resume = AsyncLocalStorage.snapshot();
	const result = createDeferredCore();
	result.promise.catch(() => void 0);
	let outcome = { status: "pending" };
	let source;
	let transport;
	let unregisterSource;
	let unregister;
	let borrowed;
	let prepared;
	let preparation;
	let preparationClose;
	let startPreparedCleanup;
	let releasePreparedSource;
	let expectedIdentity;
	let expectedSourceIdentity;
	let awaitedOnly = selection.snapshotPreparation === "awaited";
	let producerSettled = false;
	let value;
	const errors = [];
	const acceptanceErrors = [];
	let producerStep;
	let cleanupStep;
	let cleanupAttempt;
	let transportStopped = false;
	let cleaned = false;
	let servicing = false;
	const assertReadLifetime = () => {
		signal.throwIfAborted();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		snapshot?.assertCurrent?.();
		borrowed?.assertCurrent();
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
		if (expectedSourceIdentity) assertExistingDatabaseIdentity(pathname, expectedSourceIdentity.key, expectedSourceIdentity.birthtime);
		if (scopes.some((scope) => !scope.active)) throw new Error("Shared-state read scope is closed");
	};
	const authority = {
		signal,
		assertCurrent() {
			assertReadLifetime();
			openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname, "cached-read");
		}
	};
	function settle(cleanupErrors = []) {
		if (outcome.status !== "pending") return;
		try {
			throwSqliteLifecycleErrors([
				...errors,
				...[...new Set(acceptanceErrors)].filter((error) => !errors.includes(error)),
				...cleanupErrors
			], "Shared-state read and cleanup failed");
			outcome = {
				status: "fulfilled",
				value
			};
			result.resolve(value);
		} catch (error) {
			let mapped;
			try {
				mapped = selection.mapError ? selection.mapError(error, receipt.phase) : error;
			} catch (mappingError) {
				mapped = mappingError;
			}
			outcome = {
				status: "rejected",
				error: mapped
			};
			result.reject(mapped);
		}
	}
	function finishCleanup(error) {
		const attempt = cleanupAttempt;
		cleanupAttempt = void 0;
		cleanupStep = void 0;
		if (error) attempt?.reject(error.error);
		else attempt?.resolve();
		if (producerSettled) settle(error ? [error.error] : []);
	}
	function release() {
		borrowed?.release();
		borrowed = void 0;
		snapshot?.release?.();
		cleaned = true;
		unregister?.();
		for (const scope of scopes) scope.resources.delete(resource);
		unregisterSource?.();
		finishCleanup();
	}
	function acceptCleanup(success) {
		if (!success) throw new Error(`Shared-state read snapshot cleanup failed: ${prepared?.cleanupRoot ?? pathname}`);
		prepared = void 0;
		startPreparedCleanup = void 0;
		closePreparation();
	}
	function startPreparationClose() {
		if (!preparation) return;
		if (!preparationClose || preparationClose.read().status === "rejected") {
			preparationClose = preparation.startClose();
			preparationClose.result.then(service, service);
		}
		return preparationClose;
	}
	function closePreparation() {
		const closing = startPreparationClose();
		if (!closing) {
			release();
			return;
		}
		waitRetained("cleanup", closing, () => {
			preparation = void 0;
			preparationClose = void 0;
			release();
		});
	}
	function cleanupPrepared() {
		if (!prepared) {
			closePreparation();
			return;
		}
		releasePreparedSource?.();
		if (startPreparedCleanup) waitRetained("cleanup", startPreparedCleanup(), acceptCleanup);
		else {
			const pending = prepared.cleanupAsync();
			cleanupStep = void 0;
			waitAwaited(pending, acceptCleanup, finishCleanup);
		}
	}
	function waitProducer() {
		cleanupStep = () => {
			if (!producerSettled) {
				if (signal.aborted) {
					const closing = startPreparationClose();
					closing?.service();
					const joined = closing?.read();
					if (joined?.status === "rejected") throw joined.error;
				}
				return false;
			}
			cleanupStep = void 0;
			cleanupPrepared();
			return true;
		};
	}
	function cleanup() {
		if (cleaned) return Promise.resolve();
		if (cleanupAttempt) return cleanupAttempt.promise;
		const attempt = createDeferredCore();
		attempt.promise.catch(() => void 0);
		cleanupAttempt = attempt;
		try {
			if (!transportStopped && transport) waitRetained("cleanup", transport.startClose(), () => {
				transportStopped = true;
				waitProducer();
			});
			else waitProducer();
		} catch (error) {
			finishCleanup({ error });
		}
		service();
		return attempt.promise;
	}
	function finishProducer(error) {
		producerStep = void 0;
		producerSettled = true;
		if (error) errors.push(error.error);
		cleanup();
	}
	function service() {
		if (servicing) return;
		servicing = true;
		try {
			resume(() => {
				let changed;
				do {
					try {
						changed = producerStep?.() ?? false;
					} catch (error) {
						finishProducer({ error });
						changed = true;
					}
					try {
						changed = (cleanupStep?.() ?? false) || changed;
					} catch (error) {
						finishCleanup({ error });
						changed = true;
					}
				} while (changed);
			});
		} finally {
			servicing = false;
		}
	}
	function waitRetained(lane, operation, accept) {
		const step = () => {
			operation.service();
			const next = operation.read();
			if (next.status === "pending") return false;
			if (lane === "producer") producerStep = void 0;
			else cleanupStep = void 0;
			if (next.status === "rejected") throw next.error;
			accept(next.value);
			return true;
		};
		if (lane === "producer") producerStep = step;
		else cleanupStep = step;
		operation.result.then(service, service);
	}
	function waitAwaited(pending, accept, fail) {
		pending.then((next) => resume(() => {
			try {
				accept(next);
			} catch (error) {
				fail({ error });
			}
			service();
		}), (error) => resume(() => {
			fail({ error });
			service();
		}));
	}
	function query() {
		if (!snapshot && !prepared || snapshot?.cleanClose) expectedIdentity = context.admission.identity.key;
		if (prepared) {
			authority.assertCurrent();
			releasePreparedSource = retainSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		}
		receipt.phase = command.type === "admit" ? "before-read" : "unobserved";
		if (!transport) throw new Error("Shared-state read transport is unavailable");
		waitRetained("producer", transport.startRead({
			context,
			location: snapshot?.cleanClose ? resolveImmutableSqliteFileUri(snapshot.location) : prepared?.location ?? snapshot?.location ?? pathname,
			checkFreshAdmission: !borrowed,
			expectedIdentity,
			snapshotRoot: prepared?.cleanupRoot ?? snapshot?.cleanupRoot
		}, authority), acceptReadOutcome);
	}
	function consumeReadOutcome(readOutcome) {
		const admitted = "error" in readOutcome ? readOutcome.sourceAdmitted : readOutcome.value.type === "admit" ? void 0 : readOutcome.value.sourceAdmitted;
		if (admitted === true) receipt.phase = "read";
		else if (admitted === false && receipt.phase !== "read") receipt.phase = "before-read";
		try {
			authority.assertCurrent();
			if (admitted) borrowed?.observe();
		} catch (error) {
			if (!("error" in readOutcome)) throw error;
			acceptanceErrors.push(error);
		}
		if ("error" in readOutcome) throw readOutcome.error;
		return readOutcome.value;
	}
	function acceptReadOutcome(readOutcome) {
		value = consumeReadOutcome(readOutcome);
		finishProducer();
	}
	const resource = { close() {
		controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed"));
		return resume(cleanup);
	} };
	try {
		source = captureOpenClawStateReadSource();
		transport = source.createTransport(command, selection.onChunk, selection.onChunkAsync, awaitedOnly);
		unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
			if (!identity || identity.key === context.admission.identity.key || identity.canonicalPath === context.admission.identity.canonicalPath) await resource.close();
		} });
		context.maintenanceScope?.own(resource, "shared-resources", () => resource.close());
		for (const scope of scopes) scope.resources.add(resource);
		unregisterSource = source.own(service, () => resource.close());
		assertReadLifetime();
		if (snapshot) openClawStateDatabaseCache.assertOpenClawStateDatabaseOpenAllowed(pathname, "cached-read");
		if (command.type === "admit") query();
		else {
			const native = !snapshot && preserveArtifacts ? borrowOpenClawStateDatabaseForAsyncRead(pathname, "cached-read") : void 0;
			borrowed = native ?? (!snapshot && !preserveArtifacts ? retainOpenClawStateDatabaseForIndependentRead(pathname, "cached-read") : void 0);
			const independentWarmSource = native && preferIndependentWarmRead && canReadWarmNativeSourceIndependently(native.database, pathname, context.admission.identity.key);
			if (!snapshot && !borrowed && !existingPathOrUndefined(pathname)) finishProducer();
			else if (native && !independentWarmSource) {
				if (isPostgresSqlConnection(native.database.db)) requireNativeDatabaseFile("postgres", "file-snapshot");
				awaitedOnly = true;
				waitAwaited(prepareSqliteReadOnlyLocationFromOwnedDatabase(native.database.db, authority.assertCurrent, authority.signal, "async"), (location) => {
					prepared = location;
					query();
				}, finishProducer);
			} else if (!snapshot && preserveArtifacts && !independentWarmSource) {
				const sourceIdentity = { key: context.admission.identity.key };
				expectedSourceIdentity = sourceIdentity;
				authority.assertCurrent();
				if (selection.snapshotPreparation === "awaited" && command.type === "plugins.metadata.read" && context.maintenanceScope?.ownsSchemaMaintenance !== true && !getStateDatabaseSchemaLease(pathname)) {
					const capturedCommand = structuredClone(command);
					receipt.phase = "unobserved";
					waitAwaited(withSqliteSnapshotWorker(signal, (worker, stagingRoot) => {
						authority.assertCurrent();
						return runScopedSqliteReadOnlyOperation(worker, pathname, {
							type: "stateSnapshot.read",
							input: {
								stagingRoot,
								expectedSourceIdentity: sourceIdentity,
								command: capturedCommand,
								context: {
									environment: context.environment,
									existingSchemaPath: context.existingSchemaPath
								}
							}
						}, {
							source: "canonical",
							expectedIdentity: sourceIdentity.key,
							env: context.environment,
							signal
						}).then((reply) => consumeReadOutcome(decodeOpenClawStateReadReply(reply)));
					}), (reply) => {
						value = reply;
						finishProducer();
					}, finishProducer);
				} else waitRetained("producer", transport.startValidateFresh(context, authority), () => {
					authority.assertCurrent();
					if (selection.snapshotPreparation === "awaited") {
						waitAwaited(prepareSqliteReadOnlyLocationAwaited(pathname, {
							signal: authority.signal,
							expectedSourceIdentity: sourceIdentity
						}), (location) => {
							prepared = location;
							query();
						}, finishProducer);
						return;
					}
					preparation = startSqliteReadOnlyLocationAsync(pathname, {
						preserveSourceArtifacts: preserveArtifacts,
						signal: authority.signal,
						expectedSourceIdentity
					});
					waitRetained("producer", preparation, (location) => {
						prepared = location;
						startPreparedCleanup = () => location.startCleanup();
						query();
					});
				});
				awaitedOnly ||= selection.snapshotPreparation === "awaited";
			} else query();
		}
	} catch (error) {
		finishProducer({ error });
	}
	service();
	return awaitedOnly ? {
		kind: "awaited-only",
		result: result.promise
	} : {
		kind: "retained",
		operation: {
			result: result.promise,
			read: () => outcome,
			service() {
				source?.service();
				service();
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-scope.ts
/** Closing retains custody for accepted readers, but never admits a new reader. */
function assertRetainedReadScopeAdmission(pathname, scopes) {
	if (scopes.some((scope) => scope?.path === pathname && (!scope.active || scope.work.isClosing))) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state read scope is closing or closed; retry the operation in a current scope.");
}
//#endregion
//#region src/state/openclaw-state-worker-context.ts
/** Capture read authority without constructing a worker environment. */
function captureOpenClawStateReadContext(pathname = resolveOpenClawStateSqlitePath()) {
	return captureOpenClawStateReadContextWithAdmission(pathname, captureOpenClawStateDatabaseReadAdmission);
}
/** Read-only workers need resolved runtime facts, not the initialization environment. */
function captureOpenClawStateReadWorkerContext(options = {}) {
	return captureOpenClawStateReadWorkerContextWithAdmission(options, captureOpenClawStateDatabaseReadAdmission);
}
function captureOpenClawStateWorkerContext(options = {}) {
	return captureOpenClawStateWorkerContextWithAdmission(options, captureOpenClawStateDatabaseReadAdmission);
}
//#endregion
//#region src/state/openclaw-state-db-readonly.ts
const disposableStateReads = resolveGlobalSingleton(Symbol.for("openclaw.disposableStateReads"), () => new AsyncLocalStorage());
const stateSnapshotReads = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotReads"), () => new AsyncLocalStorage());
/** Stable identity and private bytes for reads within the enclosing snapshot scope. */
function getActiveOpenClawStateDatabaseReadSnapshot(options = {}) {
	const current = stateSnapshotReads.getStore();
	return current?.path === resolveReadOnlyPath(options) ? current : void 0;
}
function requiresArtifactPreservingSnapshot(pathname) {
	const required = isArtifactPreservingStateRead("shared", pathname) && !isUpdateRehearsalPrivateDatabase(pathname, process.env) && !disposableStateReads.getStore()?.some((scope) => scope.active && scope.path === pathname);
	if (required) assertStateFileSnapshotAllowed();
	return required;
}
const synchronousReadSnapshots = resolveGlobalSingleton(Symbol.for("openclaw.synchronousStateReadSnapshots"), () => ({ current: void 0 }));
function resolveReadOnlyPath(options) {
	const pathname = resolveDatabasePath(options);
	assertRetainedReadScopeAdmission(pathname, [stateSnapshotReads.getStore(), ...disposableStateReads.getStore() ?? []]);
	isExistingOpenClawStateSchema(pathname);
	return pathname;
}
function withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname, currentAuthority = false) {
	const snapshot = stateSnapshotReads.getStore();
	if (snapshot?.active && snapshot.path === pathname) {
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, snapshot.env);
		return {
			reused: true,
			value: withOpenClawStateReadOnlyLocation(operation, pathname, snapshot.cleanClose ? resolveImmutableSqliteFileUri(snapshot.location) : snapshot.location)
		};
	}
	if (isArtifactPreservingStateRead("agent", pathname) && (requiresArtifactPreservingSnapshot(pathname) || isUpdateRehearsalPrivateDatabase(pathname, process.env))) return { reused: false };
	if (isStatePostgres() && !currentAuthority) return { reused: false };
	return withCachedOpenClawStateDatabaseReadOnly(operation, pathname, currentAuthority || synchronousReadSnapshots.currentAuthorityPath === pathname);
}
function withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname) {
	const env = options.env ?? process.env;
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	if (synchronousReadSnapshots.currentAuthorityPath === pathname) {
		const maintained = withMaintenanceOpenClawStateDatabaseReadOnly(operation, pathname);
		if (maintained.reused) return maintained.value;
	}
	const readers = synchronousReadSnapshots.current;
	if (readers && requiresArtifactPreservingSnapshot(pathname)) {
		let opened = readers.get(pathname);
		if (!opened) {
			opened = openOpenClawStateReadOnlyLocation(pathname, prepareSqliteReadOnlyLocationSync(pathname));
			readers.set(pathname, opened);
		}
		assertStateReadSchema(opened.database.db, pathname);
		const result = operation(opened.database);
		if (isPromiseLike(result)) throw new SqliteCoordinatorError("SQLite metadata snapshot read must remain synchronous");
		return result;
	}
	const prepared = requiresArtifactPreservingSnapshot(pathname) ? prepareSqliteReadOnlyLocationSync(pathname) : void 0;
	return withOpenClawStateReadOnlyLocation(operation, pathname, prepared ?? pathname, void 0, void 0, void 0, !isMainThread && !getOpenClawDatabaseMaintenanceScope());
}
/** Read existing shared state while preserving non-missing filesystem failures. */
function withExistingOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	if (synchronousReadSnapshots.current?.has(pathname)) return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
	if (reused.reused) return reused.value;
	const existingPath = existingPathOrUndefined(pathname);
	return existingPath === void 0 ? void 0 : withFreshOpenClawStateDatabaseReadOnly(operation, options, existingPath);
}
function isStateReadReply(reply, type) {
	return reply.ok && reply.type === type;
}
/** Fixed reads observe committed state unless their owner explicitly selected a snapshot. */
function executeExistingOpenClawStateRead(options, command, readOptions = {}) {
	const type = command.type;
	const { context, current, live, mapError } = readOptions;
	const receipt = { phase: "before-read" };
	let completion;
	try {
		context?.admission.assertCurrent();
		const execute = () => startRetainedOpenClawStateRead(options, command, receipt, readOptions);
		const read = live ? () => artifactPreservingReads.run(false, () => stateSnapshotReads.exit(execute)) : current ? () => stateSnapshotReads.exit(execute) : execute;
		completion = context?.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(read) : read();
	} catch (error) {
		throw mapError ? mapError(error, receipt.phase) : error;
	}
	return (completion.kind === "retained" ? completion.operation.result : completion.result).then((reply) => {
		if (!reply || isStateReadReply(reply, type)) return reply;
		throw new Error(`Unexpected shared-state read reply for ${type}`);
	});
}
function startRetainedOpenClawStateRead(options, command, receipt, { context: capturedContext, signal, current, live, mapError, preferIndependentWarmRead, snapshotPreparation, onChunk, onChunkAsync }) {
	const currentRead = current || live;
	const pathname = resolveReadOnlyPath(options);
	const inherited = stateSnapshotReads.getStore();
	const snapshot = inherited?.active && inherited.path === pathname ? inherited : void 0;
	const scopes = [...snapshot ? [snapshot] : [], ...(disposableStateReads.getStore() ?? []).filter((scope) => scope.active && scope.path === pathname)];
	const env = snapshot?.env ?? options.env;
	const context = capturedContext ?? captureOpenClawStateReadWorkerContext({
		path: pathname,
		env
	});
	if (capturedContext) {
		if (context.admission.databasePath !== pathname) throw new Error("Shared-state read context does not match its selected source");
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	}
	const preserveArtifacts = requiresArtifactPreservingSnapshot(pathname);
	const controller = new AbortController();
	const readSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
	const run = () => {
		const inheritedSource = currentRead ? void 0 : synchronousReadSnapshots.current?.get(pathname)?.snapshotSource?.retain();
		return startOpenClawStateReadOperation(command, {
			pathname,
			snapshot: inheritedSource ?? snapshot,
			scopes,
			context,
			preserveArtifacts,
			preferIndependentWarmRead,
			snapshotPreparation,
			onChunk,
			onChunkAsync,
			controller,
			signal: readSignal,
			receipt,
			mapError
		});
	};
	const tracked = scopes.reduceRight((operation, scope) => () => scope.work.run(() => {
		const completion = operation();
		const result = completion.kind === "retained" ? completion.operation.result : completion.result;
		scope.work.track(() => result).catch(() => void 0);
		return completion;
	}), run);
	const maintenance = context.maintenanceScope;
	let completion;
	if (maintenance) maintenance.run(() => {
		const accepted = tracked();
		completion = accepted;
		return accepted.kind === "retained" ? accepted.operation.result : accepted.result;
	});
	else completion = tracked();
	if (!completion) throw new Error("Shared-state read maintenance scope did not start its operation");
	const result = completion.kind === "retained" ? completion.operation.result : completion.result;
	retainSnapshotWork(result, () => controller.abort(/* @__PURE__ */ new Error("Shared-state read admission closed")));
	return completion;
}
/** Read existing shared state without creating or updating its SQLite sidecars. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	assertStateFileSnapshotAllowed();
	if (openStateSchemaReadAdmission) return withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options, openStateSchemaReadAdmission);
	return withArtifactPreservingStateReads(() => withExistingOpenClawStateDatabaseReadOnly(operation, options));
}
/** Publication guards need current rows, never an inherited discovery snapshot. */
function withExistingOpenClawStateDatabaseCurrentReadOnly(operation, options = {}, openStateSchemaReadAdmission) {
	const pathname = resolveReadOnlyPath(options);
	return stateSnapshotReads.exit(() => {
		if (!openStateSchemaReadAdmission) {
			const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname, true);
			if (reused.reused) return reused.value;
		}
		if (existingPathOrUndefined(pathname) === void 0) return;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, options.env ?? process.env);
		const directRead = (isStatePostgres() || options.allowNativeRead) && !isArtifactPreservingStateRead() && !openStateSchemaReadAdmission;
		if (!directRead) assertStateFileSnapshotAllowed();
		return withOpenClawStateReadOnlyLocation(operation, pathname, directRead ? pathname : prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	});
}
/** Preserve source artifacts while allowing the caller to progress during snapshot preparation. */
function withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(operation, options = {}) {
	assertStateFileSnapshotAllowed();
	return withArtifactPreservingStateReads(async () => {
		const pathname = resolveReadOnlyPath(options);
		const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, pathname);
		if (reused.reused) return reused.value;
		if (existingPathOrUndefined(pathname) === void 0) return;
		const env = options.env ?? process.env;
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		if (!requiresArtifactPreservingSnapshot(pathname)) return withOpenClawStateReadOnlyLocation(operation, pathname, pathname);
		const prepared = await prepareSqliteReadOnlyLocation(pathname, { preserveSourceArtifacts: true });
		try {
			openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		} catch (error) {
			prepared.cleanup();
			throw error;
		}
		return withOpenClawStateReadOnlyLocation(operation, pathname, prepared);
	});
}
//#endregion
//#region src/infra/sqlite-schema-ensure.ts
/** Install missing additive objects using the connection's admitted schema lifecycle. */
function createSqliteSchemaEnsurer(schemaSql, objects) {
	const present = (database) => {
		const facts = getAdmittedSqliteSchemaFacts(database);
		return facts !== void 0 && objects.tables.every((table) => facts.tables.has(table)) && (objects.indexes?.every((index) => facts.indexes.has(index)) ?? true);
	};
	return (database) => {
		if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
		runSqliteReadOperationSync(database, () => {
			if (present(database)) return;
			const install = () => {
				if (!present(database)) database.exec(schemaSql());
			};
			if (database.isTransaction) install();
			else runSqliteImmediateTransactionSync(database, install);
		});
	};
}
//#endregion
//#region src/state/openclaw-state-db-schema-additive.ts
const tableEnsurers = /* @__PURE__ */ new Map();
function ensureTable(database, table, options) {
	if (isPostgresSqlConnection(database)) return ensureStatePostgresFragment(database, table);
	let ensure = tableEnsurers.get(table);
	if (!ensure) {
		const schema = getOpenClawStateFeatureSchemaSql(table, options);
		ensure = createSqliteSchemaEnsurer(() => schema, {
			tables: getCanonicalSqliteTableNames(schema),
			indexes: getCanonicalSqliteNamedIndexContracts(schema).map(({ name }) => name)
		});
		tableEnsurers.set(table, ensure);
	}
	ensure(database);
}
function assertAgentDeletionJournalAvailable(database) {
	if (!tableHasColumn(database, "agent_deletion_journal", "agent_id")) throw new Error("Agent deletion journal missing; run openclaw doctor --fix to reconstruct it before restoring or deleting agents.");
}
function ensureAgentDatabaseLeaseSchema(database) {
	if (tableHasColumn(database, "agent_database_leases", "provenance")) return;
	ensureTable(database, "agent_database_leases");
	ensureColumn(database, "agent_database_leases", "provenance TEXT");
}
/**
* Same-version additive table, registered in LAZY_ADDITIVE_STATE_TABLES so
* existing v6 databases stay valid without it. Uses the canonical schema;
* a downgraded reader simply loses setup-completion reconciliation.
*/
function ensureDevicePairSetupCompletionSchema(database) {
	ensureTable(database, "device_pair_setup_completions");
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
function ensureWorkerSessionToolStateSchema(db) {
	ensureTable(db, "worker_turn_tool_authorities");
	ensureTable(db, "worker_session_tool_operations");
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
	const addedAcpReplayColumns = ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.acpReplay).length > 0;
	if (addedAcpReplayColumns || repairHistoricalRows) backfillAcpReplayEstimatedBytes(db, addedAcpReplayColumns);
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
	ensureColumn(db, ...ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.originalMediaRoot[0]);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.beforeTaskAttribution);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRequester);
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.taskRunDetails);
	if (repairHistoricalRows) {
		repairLegacySubagentExecutionPayloads(db);
		repairLegacySubagentRetainedResults(db);
	}
	ensureColumns(db, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS.workerEnvironments);
	if (repairHistoricalRows || !tableHasColumn(db, "operator_approvals", "resolution_ref")) ensureOperatorApprovalResolutionRefs(db);
}
//#endregion
//#region src/config/resolution-facts.ts
const envSecretRefsByFacts = /* @__PURE__ */ new WeakMap();
function createConfigResolutionFacts(warnings, pendingEnvSecretRefs = /* @__PURE__ */ new Map(), envProvider = DEFAULT_SECRET_PROVIDER_ALIAS, resolvedEnvSecretRefs = /* @__PURE__ */ new Map()) {
	const facts = new Set(warnings.map(({ configPath }) => configPath));
	const provider = envProvider?.trim() || "default";
	if (pendingEnvSecretRefs.size > 0 || resolvedEnvSecretRefs.size > 0) {
		const envSecretRefs = /* @__PURE__ */ new Map();
		for (const [state, refs] of [["pending", pendingEnvSecretRefs], ["resolved", resolvedEnvSecretRefs]]) for (const [path, id] of refs) envSecretRefs.set(path, {
			ref: {
				source: "env",
				provider,
				id
			},
			state
		});
		envSecretRefsByFacts.set(facts, envSecretRefs);
	}
	return facts;
}
//#endregion
//#region src/config/io.read-helpers.ts
function coerceConfig(value) {
	return asOptionalRecord(value) ?? {};
}
function normalizeConfigIoDeps(overrides = {}) {
	const env = overrides.env ?? process.env;
	return {
		fs: overrides.fs ?? fs,
		json5: overrides.json5 ?? JSON5,
		env,
		lowerPrecedenceEnv: overrides.lowerPrecedenceEnv ?? {},
		homedir: overrides.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
		configPath: overrides.configPath ?? "",
		logger: overrides.logger ?? console,
		measure: overrides.measure ?? (async (_name, run) => await run()),
		suppressFutureVersionWarning: overrides.suppressFutureVersionWarning ?? (isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE)),
		observe: overrides.observe ?? true
	};
}
function parseConfigJson5(raw, json5 = JSON5) {
	try {
		return {
			ok: true,
			parsed: parseJsonWithJson5Fallback(raw, json5)
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err)
		};
	}
}
function resolveConfigIncludesForRead(parsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, onIncludeResolved) {
	const allowedRoots = resolveIncludeRoots(deps.env, deps.homedir);
	const recordIncludeWatchPath = (resolvedPath) => {
		includeFilePathsForWatch?.add(path.normalize(resolvedPath));
	};
	const recordIncludeTarget = (resolvedPath, canonicalPath) => {
		if (!includeFileTargetsForWrite) return;
		const normalizedPath = path.normalize(resolvedPath);
		try {
			includeFileTargetsForWrite[normalizedPath] = path.normalize(canonicalPath ?? resolveConfigIncludeWritePath({
				configPath,
				includePath: resolvedPath,
				allowedRoots
			}));
		} catch {}
	};
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
		onLexicalPath: recordIncludeWatchPath,
		onIncludeResolved,
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => {
			try {
				const raw = readConfigIncludeFileWithGuards({
					includePath,
					resolvedPath,
					rootRealDir,
					ioFs: deps.fs,
					onResolvedPath: (canonicalPath) => {
						recordIncludeWatchPath(canonicalPath);
						recordIncludeTarget(resolvedPath, canonicalPath);
					}
				});
				if (includeFileHashesForWrite) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(raw);
				return raw;
			} catch (error) {
				const missing = collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === "ENOENT");
				if (includeFileHashesForWrite && missing) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(null);
				if (missing) recordIncludeTarget(resolvedPath);
				throw error;
			}
		},
		parseJson: (raw) => deps.json5.parse(raw)
	}, { allowedRoots });
}
function resolveConfigForRead(resolvedIncludes, env, lowerPrecedenceEnv = {}) {
	if (resolvedIncludes && typeof resolvedIncludes === "object" && "env" in resolvedIncludes) applyConfigEnvVars(resolvedIncludes, env, { lowerPrecedenceEnv });
	const envWarnings = [];
	const pendingEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedEnvSecretRefs = /* @__PURE__ */ new Map();
	const resolvedConfigRaw = resolveConfigEnvVars(resolvedIncludes, env, {
		onMissing: (warning) => envWarnings.push(warning),
		onPendingEnvSecretRef: (id, configPath) => pendingEnvSecretRefs.set(configPath, id),
		onResolvedEnvSecretRef: (id, configPath) => resolvedEnvSecretRefs.set(configPath, id)
	});
	return {
		resolvedConfigRaw,
		envSnapshotForRestore: cloneEnvWithPlatformSemantics(env),
		envWarnings,
		resolutionFacts: createConfigResolutionFacts(envWarnings, pendingEnvSecretRefs, coerceConfig(resolvedConfigRaw).secrets?.defaults?.env, resolvedEnvSecretRefs)
	};
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
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
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
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
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
//#region src/infra/dedupe.ts
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
function createDedupeCache(options) {
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const maxSize = resolveNonNegativeIntegerOption(options.maxSize, 0);
	const cache = /* @__PURE__ */ new Map();
	let oldestRecordedAt = Number.POSITIVE_INFINITY;
	let newestRecordedAt = Number.NEGATIVE_INFINITY;
	let timestampsOrdered = true;
	const prune = (now) => {
		const cutoff = ttlMs > 0 ? now - ttlMs : void 0;
		if (cutoff !== void 0 && cutoff >= oldestRecordedAt) {
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			for (const [entryKey, entry] of cache) if (entry.recordedAt <= cutoff) cache.delete(entryKey);
			else if (entry.recordedAt < oldestRecordedAt) {
				oldestRecordedAt = entry.recordedAt;
				if (timestampsOrdered) break;
			}
		}
		if (maxSize <= 0) {
			cache.clear();
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			return;
		}
		pruneMapToMaxSize(cache, maxSize);
	};
	const hasUnexpired = (key, now, touchOnRead) => {
		const existing = cache.get(key);
		if (!existing) return false;
		if (ttlMs > 0 && now - existing.recordedAt >= ttlMs) {
			cache.delete(key);
			return false;
		}
		if (touchOnRead) {
			existing.recordedAt = now;
			cache.delete(key);
			cache.set(key, existing);
		}
		return true;
	};
	return {
		check: (key, now, ownerToken) => {
			if (!key) return false;
			const checkedAt = now ?? Date.now();
			if (ttlMs > 0) {
				if (checkedAt < oldestRecordedAt) oldestRecordedAt = checkedAt;
				if (timestampsOrdered) {
					timestampsOrdered = checkedAt >= newestRecordedAt;
					newestRecordedAt = checkedAt;
				}
			}
			if (hasUnexpired(key, checkedAt, true)) return true;
			cache.set(key, {
				recordedAt: checkedAt,
				...ownerToken ? { ownerToken } : {}
			});
			prune(checkedAt);
			return false;
		},
		peek: (key, now = Date.now()) => {
			if (!key) return false;
			return hasUnexpired(key, now, false);
		},
		delete: (key, ownerToken) => {
			if (!key) return;
			if (ownerToken && cache.get(key)?.ownerToken !== ownerToken) return;
			cache.delete(key);
		},
		clear: () => {
			cache.clear();
			oldestRecordedAt = Number.POSITIVE_INFINITY;
			newestRecordedAt = Number.NEGATIVE_INFINITY;
			timestampsOrdered = true;
		},
		size: () => cache.size
	};
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
		if (candidate === pathname || !hasNodeErrorCode(error, "ENOENT")) throw error;
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
//#region src/infra/directory-durability.ts
/** Require a real directory sync at product commit boundaries. */
function requireDirectorySync(outcome, label) {
	if (outcome.status !== "unsupported" || process.platform === "win32") return;
	const code = outcome.code ? ` (${outcome.code})` : "";
	throw new Error(`${label} does not support crash-durable directory synchronization${code}.`);
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
	const indexesStartedAt = performance$1.now();
	const repairedIndexes = repairCanonicalSqliteIndexes(db, databaseLabel, schemaSql, {
		...repairOptions,
		verifyPhysicalIntegrity: false
	});
	if (diagnostics) {
		diagnostics.canonicalIndexMs = Math.floor(performance$1.now() - indexesStartedAt);
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
function assertSqliteIdentifier(identifier) {
	if (!SQLITE_IDENTIFIER_PATTERN.test(identifier)) throw new Error(`invalid SQLite identifier: ${identifier}`);
}
function isMissingColumnError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /^no such column:/iu.test(error.message);
}
//#endregion
//#region src/infra/sqlite-strict.ts
const STRICT_MIGRATION_TABLE_PREFIX = "__openclaw_strict_migration_";
const SQLITE_ROWID_ALIASES = [
	"_rowid_",
	"rowid",
	"oid"
];
function readMainTableList(db, options = {}) {
	return db.prepare("PRAGMA table_list").all().filter((row) => row.schema === "main" && typeof row.name === "string" && (options.includeInternal === true || !row.name.startsWith("sqlite_")));
}
/** Canonical bootstrap needs no legacy rebuild when every ordinary table is already STRICT. */
function hasNonStrictSqliteTables(db) {
	return readMainTableList(db).some((row) => row.type === "table" && Number(row.strict) !== 1);
}
function readTableColumns(db, tableName) {
	return db.prepare(`PRAGMA table_xinfo(${quoteSqliteIdentifier(tableName)})`).all();
}
function readVisibleColumns(db, tableName) {
	return readTableColumns(db, tableName).filter((row) => Number(row.hidden ?? 0) === 0).map((row) => {
		if (typeof row.name !== "string" || row.name.length === 0) throw new Error(`SQLite table ${tableName} has an invalid column name`);
		return row.name;
	});
}
function readTableRowidModel(db, tableName, tableRow) {
	if (Number(tableRow.wr ?? 0) === 1) return {
		alias: null,
		storage: "without-rowid"
	};
	const columns = readTableColumns(db, tableName);
	const primaryKeyColumns = columns.filter((column) => Number(column.pk ?? 0) > 0);
	const primaryKeyIndex = db.prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`).get(tableName);
	const primaryKeyType = primaryKeyColumns[0]?.type;
	if (primaryKeyColumns.length === 1 && typeof primaryKeyType === "string" && primaryKeyType.toUpperCase() === "INTEGER" && !primaryKeyIndex) return {
		alias: null,
		storage: "integer-primary-key"
	};
	const declaredNames = new Set(columns.flatMap((column) => typeof column.name === "string" ? [column.name.toLowerCase()] : []));
	const alias = SQLITE_ROWID_ALIASES.find((candidate) => !declaredNames.has(candidate)) ?? null;
	if (!alias) throw new Error(`SQLite table ${tableName} shadows every rowid alias; its implicit rowids cannot be migrated safely`);
	return {
		alias,
		storage: "implicit"
	};
}
function readCanonicalStrictTables(schemaSql) {
	const canonical = openNodeSqliteDatabase(":memory:");
	try {
		canonical.exec(schemaSql);
		const tables = readMainTableList(canonical).filter((row) => row.type === "table");
		const nonStrict = tables.filter((row) => Number(row.strict ?? 0) !== 1).map((row) => row.name);
		if (nonStrict.length > 0) throw new Error(`Canonical SQLite schema contains non-STRICT tables: ${nonStrict.toSorted().join(", ")}`);
		return tables.map((row) => {
			const schemaRow = canonical.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?").get(row.name);
			if (typeof schemaRow?.sql !== "string") throw new Error(`Canonical SQLite table ${row.name} has no CREATE statement`);
			const rowidModel = readTableRowidModel(canonical, row.name, row);
			return {
				columns: readVisibleColumns(canonical, row.name),
				createSql: schemaRow.sql,
				name: row.name,
				rowidAlias: rowidModel.alias,
				rowidStorage: rowidModel.storage,
				usesAutoincrement: /\bAUTOINCREMENT\b/iu.test(schemaRow.sql)
			};
		}).toSorted((left, right) => left.name.localeCompare(right.name));
	} finally {
		canonical.close();
	}
}
function rewriteCreateTableName(createSql, replacementName) {
	const openingParen = createSql.indexOf("(");
	if (openingParen === -1) throw new Error("Canonical SQLite table CREATE statement has no column list");
	return `CREATE TABLE ${quoteSqliteIdentifier(replacementName)} ${createSql.slice(openingParen)}`;
}
function readPreservedSchemaObjects(db, tableNames) {
	return db.prepare("SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE type IN ('index', 'trigger', 'view')").all().flatMap((row) => {
		if (row.type !== "index" && row.type !== "trigger" && row.type !== "view" || typeof row.name !== "string" || typeof row.tbl_name !== "string" || typeof row.sql !== "string" || row.type === "index" && !tableNames.has(row.tbl_name)) return [];
		return [{
			name: row.name,
			sql: row.sql,
			type: row.type
		}];
	}).toSorted((left, right) => {
		const typeOrder = {
			view: 0,
			index: 1,
			trigger: 2
		};
		return typeOrder[left.type] - typeOrder[right.type] || left.name.localeCompare(right.name);
	});
}
function readAutoincrementHighWater(db, tableName) {
	if (!db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = 'table' AND name = 'sqlite_sequence'").get()) return null;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = ?").get(tableName);
	if (row === void 0) return null;
	const normalized = typeof row.seq === "string" ? /^(\d+)(?:\.0+)?$/u.exec(row.seq)?.[1] : null;
	if (!normalized) throw new Error(`SQLite table ${tableName} has an invalid AUTOINCREMENT high-water mark (${typeof row.seq}: ${String(row.seq)})`);
	return normalized;
}
function restoreAutoincrementHighWater(db, tableName, previousHighWater) {
	if (previousHighWater === null) return;
	const currentHighWater = readAutoincrementHighWater(db, tableName);
	const restored = currentHighWater === null || BigInt(previousHighWater) > BigInt(currentHighWater) ? previousHighWater : currentHighWater;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = ?").run(tableName);
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES (?, CAST(? AS INTEGER))").run(tableName, restored);
}
function assertMatchingColumns(tableName, currentColumns, canonicalColumns) {
	const current = new Set(currentColumns);
	const canonical = new Set(canonicalColumns);
	const missing = canonicalColumns.filter((column) => !current.has(column));
	const extra = currentColumns.filter((column) => !canonical.has(column));
	if (missing.length === 0 && extra.length === 0) return;
	const details = [missing.length > 0 ? `missing ${missing.join(", ")}` : "", extra.length > 0 ? `extra ${extra.join(", ")}` : ""].filter(Boolean).join("; ");
	throw new Error(`SQLite table ${tableName} does not match its canonical columns (${details})`);
}
function readForeignKeysEnabled(db) {
	const row = db.prepare("PRAGMA foreign_keys").get();
	return Number(row?.foreign_keys ?? 0) === 1;
}
/**
* Rebuild canonical non-STRICT tables inside the caller's transaction.
* Foreign-key enforcement must be disabled before BEGIN; integrity is checked
* before this function returns so any bad row or relationship rolls back.
*/
function migrateSqliteSchemaToStrictInTransaction(db, schemaSql, options = {}) {
	if (!db.isTransaction) throw new Error("SQLite STRICT schema migration requires an active transaction");
	const canonicalTables = readCanonicalStrictTables(schemaSql);
	db.exec(schemaSql);
	const currentTableRows = new Map(readMainTableList(db).filter((row) => row.type === "table").map((row) => [row.name, row]));
	const tablesToMigrate = canonicalTables.filter((table) => Number(currentTableRows.get(table.name)?.strict ?? 0) !== 1);
	if (tablesToMigrate.length === 0) return { migratedTables: [] };
	if (readForeignKeysEnabled(db)) throw new Error("SQLite STRICT schema migration requires foreign_keys=OFF before BEGIN");
	const preservedObjects = readPreservedSchemaObjects(db, new Set(tablesToMigrate.map((table) => table.name)));
	for (const type of ["trigger", "view"]) for (const object of preservedObjects) if (object.type === type) db.exec(`DROP ${type.toUpperCase()} ${quoteSqliteIdentifier(object.name)};`);
	for (const [index, table] of tablesToMigrate.entries()) {
		const migrationTable = `${STRICT_MIGRATION_TABLE_PREFIX}${index}_${table.name}`;
		if (currentTableRows.has(migrationTable)) throw new Error(`SQLite STRICT migration table already exists: ${migrationTable}`);
		const currentColumns = readVisibleColumns(db, table.name);
		assertMatchingColumns(table.name, currentColumns, table.columns);
		const currentTableRow = currentTableRows.get(table.name);
		if (!currentTableRow) throw new Error(`SQLite table ${table.name} disappeared during STRICT migration`);
		const currentRowidModel = readTableRowidModel(db, table.name, currentTableRow);
		if (currentRowidModel.storage !== table.rowidStorage) throw new Error(`SQLite table ${table.name} changes rowid storage from ${currentRowidModel.storage} to ${table.rowidStorage}; refusing an identity-changing STRICT migration`);
		const previousHighWater = table.usesAutoincrement ? readAutoincrementHighWater(db, table.name) : null;
		db.exec(rewriteCreateTableName(table.createSql, migrationTable));
		const columns = table.columns.map(quoteSqliteIdentifier);
		if (table.rowidAlias) columns.unshift(quoteSqliteIdentifier(table.rowidAlias));
		const copyColumns = columns.join(", ");
		try {
			db.exec(`INSERT INTO ${quoteSqliteIdentifier(migrationTable)} (${copyColumns}) SELECT ${copyColumns} FROM ${quoteSqliteIdentifier(table.name)};`);
		} catch (error) {
			throw new Error(`Failed migrating SQLite table ${table.name} to STRICT`, { cause: error });
		}
		db.exec(`DROP TABLE ${quoteSqliteIdentifier(table.name)};`);
		db.exec(`ALTER TABLE ${quoteSqliteIdentifier(migrationTable)} RENAME TO ${quoteSqliteIdentifier(table.name)};`);
		restoreAutoincrementHighWater(db, table.name, previousHighWater);
	}
	db.exec(schemaSql);
	const findObject = db.prepare("SELECT 1 AS found FROM sqlite_schema WHERE type = ? AND name = ? LIMIT 1");
	for (const object of preservedObjects) if (!findObject.get(object.type, object.name)) db.exec(object.sql);
	assertSqliteIntegrity(db, options.databaseLabel ?? "SQLite STRICT schema migration");
	return { migratedTables: tablesToMigrate.map((table) => table.name) };
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
createStateSchemaAdmission("state.startup-checkpoint", (value) => value === true ? true : void 0);
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
	assertOpenClawStateDatabaseOwner(database, { pathname });
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
export { resolveUnsuffixedSqliteTargetFromSessionStorePath as A, formatCliCommand as B, captureOpenClawStateReadContext as C, resolveSessionStorePathCore as D, resolveAgentsDirFromSessionStorePath as E, tryResolveLegacyCompatibilityAgentId as F, tryResolveLegacyDataOwnerAgentId as I, listAgentIds as L, resolveConfiguredAgentId as M, resolveDefaultAgentId as N, listSqliteTargetCandidatePathsForSessionStorePath as O, tryResolveAmbientOwnerAgentId as P, normalizeAgentDirRegistryPath as R, withExistingOpenClawStateDatabaseReadOnly as S, runManagedStateTransaction as T, createSqliteSchemaEnsurer as _, hasPreJournalStateSchema as a, withExistingOpenClawStateDatabaseArtifactPreservingReadOnly as b, verifyAndRepairCanonicalSqliteIndexSteps as c, listConfiguredSessionStoreAgentIds as d, assertAgentDeletionJournalAvailable as f, ensureWorkerEnvironmentNodeEnrollmentSchema as g, ensureDevicePairSetupCompletionSchema as h, recoverOrphanTaskDeliveryRows as i, resolveAgentDir as j, parseSqliteTargetSuffixIndex as k, resolveOpenClawAgentDatabaseDiscoveryPaths as l, ensureDevicePairSetupBootstrapSchema as m, openOpenClawStateDatabase as n, migrateSqliteSchemaToStrictInTransaction as o, ensureAgentDatabaseLeaseSchema as p, runOpenClawStateWriteTransaction as r, repairCanonicalSqliteIndexes as s, confirmOpenClawStateDatabaseIntegrity as t, isConfiguredSessionStoreAgentId as u, executeExistingOpenClawStateRead as v, captureOpenClawStateWorkerContext as w, withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync as x, getActiveOpenClawStateDatabaseReadSnapshot as y, freezeJsonSnapshot as z };
