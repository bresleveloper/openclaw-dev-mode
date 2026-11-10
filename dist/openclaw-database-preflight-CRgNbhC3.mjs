import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { S as readSqliteDatabaseCleanClose } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { _ as withSqliteReadOnlyWorkerScope, c as resolveSqliteInspectionSignal, i as isSqliteInspectionDeadlineOwnedByCaller } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as isArtifactPreservingStateRead, r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import { i as deferSqliteSnapshotCleanupAfterRead, t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as isSameOpenClawAgentDatabasePath, i as isPersistentOpenClawAgentDatabasePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { r as configureSqliteReadOnlyPragmas } from "./sqlite-wal-D2XTertL.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readSqliteUserVersion, n as createNewerSqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { n as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-DmM7omMC.mjs";
import { i as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as readStateSchemaPublicationBlocker } from "./openclaw-state-schema-publication-C2fzjU88.mjs";
import { l as getCanonicalSqliteTableNames, t as adoptSqliteSchemaContracts } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { n as assertNoLegacyStateRuntimeRepair } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { a as inspectOpenClawStateOwnershipFromDatabase } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import "./session-key-CSDERtm3.mjs";
import { s as readAgentDeletionRecoveryHoldsInWorker } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { c as createAgentDatabaseInspectionRefusal, f as inspectAgentDatabaseAdmission, r as canIsolateAgentDatabase, t as AgentDatabaseAdmissionError, v as recordAgentDatabaseAdmissions } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as getAgentDatabaseStartupAdmission } from "./agent-database-startup-DQZqWc4z.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths, t as isConfiguredAgentDatabaseTarget } from "./targets-DJGC6v85.mjs";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-WZhAVK2X.mjs";
import { n as describeDeferredStateSchemaPublication, r as formatIndeterminateDatabaseReadiness, t as OpenClawDatabaseSchemaPreflightError } from "./openclaw-database-preflight.messages-CM7IJdZy.mjs";
import { n as inspectStateDatabaseSchema, r as inspectCurrentStateStartupSchema, t as captureStateSchemaInspectionContracts } from "./openclaw-state-schema-preflight-Bedbs0Wt.mjs";
import { t as createAgentSchemaInspectionWorker } from "./openclaw-agent-schema-inspection-worker-CarmFjwL.mjs";
import { n as discoverAgentDatabaseMigrationTargets } from "./state-migrations.media-persistence-targets-DLYjscc_.mjs";
import { t as requestOpenClawAgentDatabaseIntegrityCheck } from "./openclaw-database-verify-sjxhYkvz.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import { availableParallelism } from "node:os";
import path from "node:path";
//#region src/state/openclaw-database-preflight-agent-scheduler.ts
const AGENT_DATABASE_STARTUP_WAIT_MS = 5e3;
async function preflightAgentDatabasesBounded(targets, inspect, result, signal, startup) {
	const inspectedAgentPaths = /* @__PURE__ */ new Set();
	const inspectedAgentTargets = /* @__PURE__ */ new Set();
	const claimAgentTarget = (realPath, agentId) => {
		const inspectionKey = `${realPath}\0${agentId ?? ""}`;
		if (inspectedAgentTargets.has(inspectionKey) || agentId === void 0 && inspectedAgentPaths.has(realPath)) return false;
		inspectedAgentPaths.add(realPath);
		inspectedAgentTargets.add(inspectionKey);
		return true;
	};
	const inspections = [];
	const failures = /* @__PURE__ */ new Map();
	let nextInspectionIndex = 0;
	const readers = [];
	const foreground = createDeferredCore();
	const completions = targets.map(() => createDeferredCore());
	for (const completion of completions) completion.promise.catch(() => {});
	const deferred = /* @__PURE__ */ new Set();
	const concurrency = Math.min(2, availableParallelism(), targets.length);
	let deferredRefusals = [];
	const inspectionSignal = startup ? signal ? AbortSignal.any([startup.signal, signal]) : startup.signal : resolveSqliteInspectionSignal(signal);
	const deadlineOwnedByCaller = startup !== void 0 || isSqliteInspectionDeadlineOwnedByCaller();
	const settleForeground = () => {
		if (!startup || deferred.size === 0 || deferredRefusals.length > 0 || failures.size > 0) return;
		if (targets.some((_, index) => inspections[index] === void 0 && !deferred.has(index))) return;
		try {
			deferredRefusals = startup.defer([...deferred].map((index) => ({
				target: targets[index],
				result: completions[index].promise
			})), "Inspection and writable admission continue after the Gateway listener binds.");
			foreground.resolve();
		} catch (error) {
			foreground.reject(error);
		}
	};
	const worker = async () => {
		try {
			var _usingCtx$2 = _usingCtx();
			const reader = _usingCtx$2.a(createAgentSchemaInspectionWorker());
			readers.push(reader);
			while (true) {
				if (inspectionSignal?.aborted || failures.size > 0) return;
				const index = nextInspectionIndex;
				if (index >= targets.length) return;
				nextInspectionIndex += 1;
				const target = targets[index];
				if (target === void 0) continue;
				const inspection = {
					incompatible: [],
					indeterminate: []
				};
				try {
					const disposition = await inspect(target, inspection, claimAgentTarget, (input, requestSignal, snapshot) => reader.inspect(input, inspectionSignal ?? requestSignal, snapshot));
					inspections[index] = inspection;
					completions[index].resolve(inspection);
					if (disposition === "defer" && startup?.canDefer(target)) deferred.add(index);
				} catch (error) {
					failures.set(index, error);
					completions[index].reject(error);
					return;
				} finally {
					settleForeground();
				}
			}
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			await _usingCtx$2.d();
		}
	};
	const completed = Promise.all(Array.from({ length: concurrency }, () => withSqliteReadOnlyWorkerScope(worker, {
		signal: inspectionSignal ?? new AbortController().signal,
		deadlineOwnedByCaller
	}))).finally(() => {
		for (let index = 0; index < targets.length; index += 1) if (inspections[index] === void 0) completions[index].reject(inspectionSignal?.reason ?? failures.values().next().value ?? /* @__PURE__ */ new Error("Inspection cancelled"));
	});
	startup?.track(completed);
	const timer = startup && setTimeout(() => {
		if (failures.size > 0 || inspectionSignal?.aborted) return;
		targets.forEach((target, index) => {
			if (inspections[index] === void 0 && startup.canDefer(target)) deferred.add(index);
		});
		settleForeground();
	}, AGENT_DATABASE_STARTUP_WAIT_MS);
	timer?.unref();
	try {
		await (startup ? Promise.race([completed, foreground.promise]) : completed);
	} finally {
		clearTimeout(timer);
	}
	for (let index = 0; index < targets.length; index += 1) if (failures.has(index) && (!deferred.has(index) || deferredRefusals.length === 0)) throw failures.get(index);
	inspectionSignal?.throwIfAborted();
	for (const [index, inspection] of inspections.entries()) {
		if (inspection === void 0 || deferred.has(index)) continue;
		result.incompatible.push(...inspection.incompatible);
		result.indeterminate.push(...inspection.indeterminate);
		if (inspection.agentRefusals?.length) (result.agentRefusals ??= []).push(...inspection.agentRefusals);
		if (inspection.pendingMigrations?.length) (result.pendingMigrations ??= []).push(...inspection.pendingMigrations);
	}
	if (deferredRefusals.length) (result.agentRefusals ??= []).push(...deferredRefusals);
	return {
		schemaProcessCount: readers.reduce((count, reader) => count + reader.processCount, 0),
		schemaInspectionCount: readers.reduce((count, reader) => count + reader.inspectionCount, 0),
		schemaSnapshotCount: readers.reduce((count, reader) => count + reader.snapshotCount, 0)
	};
}
//#endregion
//#region src/state/openclaw-database-preflight-cleanup.ts
/** Failed retirement keeps its existing snapshot owner and cannot admit more schemas. */
async function cleanupOpenClawStatePreflight(options) {
	const cleanupErrors = [];
	if (options.database) {
		try {
			options.closeAdmission?.();
		} catch (error) {
			cleanupErrors.push(error);
		}
		try {
			clearNodeSqliteKyselyCacheForDatabase(options.database);
			options.database.close();
		} catch (error) {
			cleanupErrors.push(error);
		}
	}
	try {
		if (options.snapshot && !await options.snapshot.cleanupAsync()) cleanupErrors.push(new SqliteSnapshotCleanupError(`SQLite read-only worker snapshot cleanup failed: ${options.snapshot.location}`));
	} catch (error) {
		if (options.inspectionErrors.length > 0 || cleanupErrors.length > 0 || !deferSqliteSnapshotCleanupAfterRead(error, options.snapshot?.cleanupRoot)) cleanupErrors.push(error);
	}
	if (cleanupErrors.length > 0) throwSqliteLifecycleErrors([...options.inspectionErrors, ...cleanupErrors], "State database schema inspection cleanup failed");
}
//#endregion
//#region src/state/openclaw-database-preflight-targets.ts
function inspectDatabaseCandidatePresence(databasePath) {
	try {
		statSync(databasePath);
		return { status: "present" };
	} catch (error) {
		return hasNodeErrorCode(error, "ENOENT") ? { status: "absent" } : {
			status: "indeterminate",
			reason: formatErrorMessage(error)
		};
	}
}
/** An inspected custom path supplies recovery ownership, never migration admission. */
function recordAgentDatabaseRecoveryInspection(prepared, pathname, realPath, inspection) {
	const metadata = inspection.agentSchemaMeta;
	if (inspection.failure || inspection.reason || metadata?.role !== "agent" || !metadata.agentId || !isValidAgentId(metadata.agentId)) prepared?.discovery.failures.push({
		path: pathname,
		reason: "Could not verify the owner of a held custom session store."
	});
	else prepared?.discovery.unverifiedTargets.push({
		agentId: normalizeAgentId(metadata.agentId),
		path: pathname,
		realPath,
		source: "configured"
	});
}
/** Select read-only inspection targets from the captured shared-state ownership facts. */
function collectAgentDatabasePreflightTargets(options) {
	const { registeredDatabases, deletionJournal, purpose } = options;
	const retainedDeletions = deletionJournal.status === "present" ? deletionJournal.entries : [];
	let agentTargets = registeredDatabases;
	let configuredTargets = [];
	const retainedAgentIds = new Set(retainedDeletions.filter((deletion) => deletion.cleanupCompleted || deletion.manualClawRemoval).map((deletion) => deletion.agentId));
	const retainedPaths = /* @__PURE__ */ new Set();
	const failures = [];
	let preparedDiscovery;
	if (options.configuredAgentDatabaseTargets !== void 0) configuredTargets = typeof options.configuredAgentDatabaseTargets === "function" ? options.configuredAgentDatabaseTargets(registeredDatabases) : options.configuredAgentDatabaseTargets;
	if (purpose === "maintenance" && options.configuredAgentDatabaseTargets !== void 0) {
		const discovery = discoverAgentDatabaseMigrationTargets({
			env: options.env,
			configuredAgentDatabaseTargets: configuredTargets,
			registeredAgentDatabases: registeredDatabases,
			deletionJournal
		});
		preparedDiscovery = {
			stateDir: resolveStateDir(options.env),
			configuredAgentDatabaseTargets: configuredTargets,
			registeredAgentDatabases: registeredDatabases,
			discovery
		};
		agentTargets = discovery.schemaTargets;
		for (const retained of [...discovery.retainedTargets, ...discovery.unverifiedTargets]) retainedPaths.add(retained.realPath);
		failures.push(...discovery.failures);
	}
	const candidates = [
		...configuredTargets,
		...agentTargets,
		...options.configuredAgentDatabaseTargets !== void 0 ? registeredDatabases.filter((database) => isPersistentOpenClawAgentDatabasePath(database.path, options.env)) : [],
		...(options.configuredAgentDatabaseCandidatePaths ?? []).map((candidatePath) => ({
			agentId: options.inspectCandidateOwners ? resolveUnsuffixedSqliteTargetFromSessionStorePath(candidatePath).agentId : void 0,
			path: candidatePath
		}))
	];
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const retained = [...retainedPaths];
	const classifyDeletion = createAgentDatabaseDeletionClassifier({
		env: options.env,
		retainedDeletions: deletionJournal,
		configuredAgentDatabaseTargets: configuredTargets,
		registeredAgentDatabases: registeredDatabases
	});
	return {
		configuredTargets,
		candidates: purpose === "runtime" ? candidates.filter((row) => typeof classifyDeletion(row.path, row.agentId) !== "object") : deletionJournal.status === "unavailable" ? preparedDiscovery && options.onAgentDatabaseDiscovery ? (options.configuredAgentDatabaseCandidatePaths ?? []).filter((pathname) => !retained.some((candidate) => samePath(candidate, pathname))).map((pathname) => ({
			agentId: void 0,
			path: pathname,
			holdForDeletionRecovery: true
		})) : [] : candidates.filter((row) => {
			if (deletionJournal.status === "present" && deletionJournal.held.some((target) => samePath(target.path, row.path))) return options.inspectHeldAgentDatabaseTargets?.some((target) => target.agentId === row.agentId && samePath(target.path, row.path)) === true;
			return row.agentId === void 0 || !retainedAgentIds.has(row.agentId);
		}),
		isRetainedPath: (pathname) => purpose === "runtime" ? typeof classifyDeletion(pathname) === "object" : retained.some((candidate) => samePath(candidate, pathname)),
		failures,
		preparedDiscovery
	};
}
//#endregion
//#region src/state/openclaw-database-preflight-state-path.ts
/** Compare one explicit SQLite file with this release's canonical shared-state schema. */
async function preflightOpenClawStateDatabasePath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	const base = {
		schema: "openclaw.state-schema-preflight.v1",
		databasePath: resolvedPath,
		targetVersion: 22
	};
	let database;
	let foundVersion = null;
	let contentVersion;
	let deferredPublication;
	let ownership = null;
	const result = (status, details = {}) => ({
		...base,
		foundVersion,
		...contentVersion !== void 0 && contentVersion !== foundVersion ? { contentVersion } : {},
		...deferredPublication ? { deferredPublication } : {},
		ownership,
		issues: details.issues ?? [],
		status,
		requiresWrite: details.requiresWrite ?? false,
		...details.reason ? { reason: details.reason } : {}
	});
	try {
		const inspectionPath = realpathSync.native(resolvedPath);
		const sidecars = [
			"-wal",
			"-shm",
			"-journal"
		].filter((suffix) => existsSync(`${inspectionPath}${suffix}`));
		if (sidecars.length > 0) throw new Error(`SQLite preflight requires a consolidated snapshot with no sidecars; found ${sidecars.join(", ")}. Create a WAL-aware online backup and preflight the resulting standalone file.`);
		database = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(inspectionPath), { readOnly: true });
		setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		configureSqliteReadOnlyPragmas(database);
		foundVersion = readSqliteUserVersion(database);
		if (!Number.isSafeInteger(foundVersion) || foundVersion < 0) throw new Error(`OpenClaw state database ${resolvedPath} has invalid schema version metadata.`);
		contentVersion = foundVersion > 22 ? foundVersion : readStateSchemaContentVersion(database);
		if (contentVersion > 22) {
			try {
				ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
			} catch {}
			return result("incompatible", { reason: createNewerSqliteSchemaVersionError("OpenClaw state database", resolvedPath, contentVersion, 22).message });
		}
		assertSqliteIntegrity(database, resolvedPath);
		ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
		if (readStateSchemaContentVersion(database) < 22) return result("migration-required", { requiresWrite: true });
		if (foundVersion < contentVersion) deferredPublication = describeDeferredStateSchemaPublication(readStateSchemaPublicationBlocker(database), resolvedPath, foundVersion, contentVersion);
		const { blockingIssues, startupRepairableIssues } = inspectCurrentStateStartupSchema(database, resolvedPath, foundVersion);
		if (blockingIssues.length > 0) return result("incompatible", { issues: blockingIssues });
		assertNoLegacyStateRuntimeRepair(database, resolvedPath);
		return result(startupRepairableIssues.length > 0 ? "startup-repairable" : "exact", {
			issues: startupRepairableIssues,
			requiresWrite: startupRepairableIssues.length > 0
		});
	} catch (error) {
		return result("indeterminate", { reason: formatErrorMessage(error) });
	} finally {
		database?.close();
	}
}
//#endregion
//#region src/state/openclaw-database-preflight.ts
const indeterminateCauses = /* @__PURE__ */ new WeakMap();
var AgentDatabaseRecoveryHeldError = class extends Error {};
/** Verify persisted runtime schemas before certifying repair or accepting restart. */
async function assertOpenClawDatabasesReady(options) {
	const schemas = await preflightOpenClawDatabaseSchemas({
		env: options.env,
		onAgentInspection: options.onAgentInspection,
		verifyCurrentSchemaShape: true,
		...options.config ? {
			agentAdmissionConfig: options.config,
			configuredAgentDatabaseTargets: [],
			configuredAgentDatabaseCandidatePaths: resolveConfiguredAgentDatabaseCandidatePaths(options.config, { env: options.env })
		} : {},
		...options.operation === "gateway-startup" ? { requireStartupMigrationReadiness: true } : {},
		...options.operation === "doctor" ? {
			configuredAgentDatabaseTargets: options.configuredAgentDatabaseTargets,
			inspectHeldAgentDatabaseTargets: options.configuredAgentDatabaseTargets.filter((target) => !options.config || !canIsolateAgentDatabase(options.config, target.agentId))
		} : {}
	}, options.operation === "doctor" ? "maintenance" : "runtime");
	const failures = [];
	for (const refusal of schemas.agentRefusals ?? []) {
		const error = new AgentDatabaseAdmissionError(refusal);
		if (!(error.cause instanceof AgentDatabaseRecoveryHeldError) && (!options.config || (refusal.code === "agent-database-ownership-mismatch" || options.operation === "gateway-startup" && refusal.code !== "agent-database-inspection-pending") && !canIsolateAgentDatabase(options.config, refusal.agentId))) failures.push(error);
	}
	if (schemas.incompatible.length > 0) failures.push(new OpenClawDatabaseSchemaPreflightError(schemas.incompatible, { operation: options.operation }));
	if (schemas.indeterminate.length > 0) {
		const causes = schemas.indeterminate.flatMap((row) => indeterminateCauses.has(row) ? [indeterminateCauses.get(row)] : []);
		failures.push(options.operation === "gateway-startup" && schemas.indeterminate.length === 1 && causes.length === 1 ? causes[0] : new Error(formatIndeterminateDatabaseReadiness(schemas.indeterminate, options.operation, indeterminateCauses), { cause: new AggregateError(causes) }));
	}
	if (failures.length > 0) throw failures.length === 1 ? failures[0] : new AggregateError(failures, failures.map((error) => formatErrorMessage(error)).join("\n"));
	if (options.operation === "gateway-startup") recordAgentDatabaseAdmissions(schemas.agentRefusals ?? [], {
		env: options.env,
		source: "startup"
	});
	if (options.operation === "doctor") {
		for (const publication of schemas.deferredSchemaPublications ?? []) options.onDeferredSchemaPublication?.(publication);
		options.onVerified?.(schemas);
	}
}
/** Read schema headers and optionally verify current schema shape without repairing it. */
async function preflightOpenClawDatabaseSchemas(inputOptions, purpose = "maintenance") {
	const options = isArtifactPreservingStateRead("agent") ? {
		...inputOptions,
		preserveSourceArtifacts: true
	} : inputOptions;
	options.signal?.throwIfAborted();
	const supportedVersions = options.supportedVersions ?? {
		state: 22,
		agent: 27
	};
	const result = {
		incompatible: [],
		indeterminate: []
	};
	const startup = options.requireStartupMigrationReadiness ? getAgentDatabaseStartupAdmission() : void 0;
	const admissionConfig = options.agentAdmissionConfig;
	const admittedAgentIds = new Set(admissionConfig ? listConfiguredSessionStoreAgentIds(admissionConfig) : []);
	const scheduling = startup?.scheduling(options.env, admissionConfig ? options.configuredAgentDatabaseCandidatePaths ?? resolveConfiguredAgentDatabaseCandidatePaths(admissionConfig, { env: options.env }) : [], admittedAgentIds);
	const prepareSchemaHeader = startup?.prepareSchemaHeaders(options.env);
	const preparedStartup = options.reuseStartupSchemaPreparation && !options.requireStartupMigrationReadiness && !options.verifyCurrentSchemaShape && !options.openStateSchemaReadAdmission ? getAgentDatabaseStartupAdmission() : void 0;
	const assertPreparedStateSchema = preparedStartup?.takePreparedStateSchema(options.env);
	const readPreparedSchemaHeader = preparedStartup?.takePreparedSchemaHeaders(options.env);
	const refusalOwner = startup ?? preparedStartup;
	const priorRefusals = refusalOwner?.captureRefusals(options.env);
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	let registeredDatabases = [];
	let deletionJournal = {
		status: "unavailable",
		cause: "missing",
		reason: "shared state database missing"
	};
	let stateDatabase;
	let closeStateSchemaReadAdmission;
	let stateSnapshot;
	const stateInspectionErrors = [];
	const statePresence = inspectDatabaseCandidatePresence(statePath);
	if (statePresence.status === "indeterminate") {
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: statePresence.reason
		});
		return result;
	}
	try {
		if (statePresence.status === "present") try {
			var _usingCtx$1 = _usingCtx();
			const activeSnapshot = getActiveOpenClawStateDatabaseReadSnapshot({ env: options.env });
			const assertStateSource = activeSnapshot ? void 0 : assertPreparedStateSchema;
			const cleanClose = purpose === "runtime" && readSqliteDatabaseCleanClose(statePath);
			let stateLocation = activeSnapshot?.location ?? (cleanClose || assertStateSource ? statePath : void 0);
			options.signal?.throwIfAborted();
			const input = {
				pathname: statePath,
				supportedVersion: supportedVersions.state,
				requireStartupMigrationReadiness: options.requireStartupMigrationReadiness,
				verifyCurrentSchemaShape: options.verifyCurrentSchemaShape,
				scope: options.scope,
				purpose
			};
			const inspectSource = stateLocation === void 0 && options.preserveSourceArtifacts === false;
			const reader = _usingCtx$1.a(!assertStateSource && (purpose === "runtime" || inspectSource) && !options.requireStartupMigrationReadiness && !options.openStateSchemaReadAdmission ? createAgentSchemaInspectionWorker() : void 0);
			if (reader) input.schemaContracts = captureStateSchemaInspectionContracts();
			let inspection = reader && inspectSource ? await reader.inspectState(input, options.signal) : null;
			if (!inspection) {
				if (stateLocation === void 0) {
					stateSnapshot = await prepareSqliteReadOnlyLocation(realpathSync.native(statePath), {
						preserveSourceArtifacts: options.preserveSourceArtifacts ?? true,
						allowLiveOwner: options.preserveSourceArtifacts !== false,
						signal: options.signal,
						requireCleanup: true
					});
					stateLocation = stateSnapshot.location;
				}
				options.signal?.throwIfAborted();
				if (reader) inspection = await reader.inspectState(input, options.signal, stateLocation);
				else {
					stateDatabase = openNodeSqliteDatabase(cleanClose ? resolveImmutableSqliteFileUri(stateLocation) : stateLocation, { readOnly: true });
					closeStateSchemaReadAdmission = options.openStateSchemaReadAdmission?.(stateDatabase);
					stateDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
					const admittedDatabase = stateDatabase;
					assertStateSource?.();
					inspection = assertStateSource ? runSqliteDeferredTransactionSync(admittedDatabase, () => inspectStateDatabaseSchema(admittedDatabase, input), { operationLabel: "state.startup-prepared-schema" }) : inspectStateDatabaseSchema(stateDatabase, input);
					assertStateSource?.();
				}
			}
			if (!inspection) throw new Error("Missing state schema inspection result");
			adoptSqliteSchemaContracts(inspection.schemaContracts ?? []);
			Object.assign(result, inspection.schemas);
			stateInspectionErrors.push(...inspection.inspectionErrors);
			if (startup && inspection.inspectionErrors.length === 0 && inspection.schemas.incompatible.length === 0 && inspection.schemas.indeterminate.length === 0 && !inspection.schemas.pendingMigrations?.length) startup.recordStateSchemaPreparation(options.env);
			if (options.scope === "state" || !inspection.deletionJournal) return result;
			registeredDatabases = inspection.registeredDatabases ?? [];
			deletionJournal = inspection.deletionJournal;
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		const failure = normalizeOpenClawStateSchemaReadError(error, statePath);
		stateInspectionErrors.push(failure);
		if (options.signal?.aborted || options.requireStartupMigrationReadiness) throw failure;
		const row = {
			kind: "state",
			path: statePath,
			reason: formatErrorMessage(failure)
		};
		indeterminateCauses.set(row, failure);
		result.indeterminate.push(row);
		return result;
	} finally {
		await cleanupOpenClawStatePreflight({
			database: stateDatabase,
			closeAdmission: closeStateSchemaReadAdmission,
			snapshot: stateSnapshot,
			inspectionErrors: stateInspectionErrors
		});
	}
	if (options.scope === "state") return result;
	const { candidates, configuredTargets, isRetainedPath, failures, preparedDiscovery } = collectAgentDatabasePreflightTargets({
		...options,
		registeredDatabases,
		deletionJournal,
		purpose,
		inspectCandidateOwners: Boolean(options.requireStartupMigrationReadiness || options.agentAdmissionConfig)
	});
	const recordRecoveryFailure = (pathname, reason) => {
		preparedDiscovery?.discovery.failures.push({
			path: pathname,
			reason
		});
	};
	for (const failure of failures) result.indeterminate.push({
		kind: "agent",
		...failure
	});
	const admissionTargets = admissionConfig && (purpose === "runtime" || options.requireStartupMigrationReadiness || options.reuseStartupSchemaPreparation) ? [...configuredTargets, ...(options.configuredAgentDatabaseCandidatePaths ?? resolveConfiguredAgentDatabaseCandidatePaths(admissionConfig, { env: options.env })).map((pathname) => ({ path: pathname }))] : void 0;
	const recordInspectionFailure = (row, inspection, error) => {
		if (startup?.recordInspectionFailure(row, inspection, error)) return true;
		if (!admissionTargets || !admissionConfig || options.requireStartupMigrationReadiness || !row.agentId || !canIsolateAgentDatabase(admissionConfig, row.agentId)) return false;
		(inspection.agentRefusals ??= []).push(createAgentDatabaseInspectionRefusal({
			agentId: row.agentId,
			paths: [row.path],
			reason: formatErrorMessage(error),
			cause: error
		}));
		return true;
	};
	const skipped = /* @__PURE__ */ new Set();
	let recoveryHolds;
	const inspectionTargets = candidates.filter((row) => {
		if (!admissionTargets || isConfiguredAgentDatabaseTarget(admissionTargets, row.agentId, row.path)) return true;
		if (options.requireStartupMigrationReadiness && !skipped.has(row.path)) {
			createSubsystemLogger("state/agent-admission").warn(`Skipped ${path.basename(row.path)}: database is not a configured target; run openclaw doctor to inspect retained data.`);
			skipped.add(row.path);
		}
		return false;
	}).map((row) => Object.assign({}, row, { presence: inspectDatabaseCandidatePresence(row.path) })).filter((row) => row.presence.status !== "absent");
	if (options.requireStartupMigrationReadiness && inspectionTargets.length === 0) getCanonicalSqliteTableNames(OPENCLAW_AGENT_SCHEMA_SQL);
	const stats = await preflightAgentDatabasesBounded(inspectionTargets, async (row, inspection, claimAgentTarget, inspectSchema) => {
		const agentPath = row.path;
		if (refusalOwner?.reuseRefusal(row, inspection, priorRefusals)) return;
		const { presence } = row;
		if (presence.status === "indeterminate") {
			if (row.holdForDeletionRecovery) {
				recordRecoveryFailure(agentPath, presence.reason);
				return;
			}
			if (!recordInspectionFailure(row, inspection, new Error(presence.reason))) inspection.indeterminate.push({
				kind: "agent",
				path: agentPath,
				reason: presence.reason
			});
			return;
		}
		let agentSnapshot;
		let readSucceeded = false;
		try {
			const realAgentPath = realpathSync.native(agentPath);
			if (row.agentId === void 0 && isRetainedPath(realAgentPath)) return;
			if (!claimAgentTarget(realAgentPath, row.agentId)) return;
			let schemaInspection = readPreparedSchemaHeader?.(realAgentPath, supportedVersions.agent) ?? null;
			const recordPreparedSchemaHeader = prepareSchemaHeader?.(realAgentPath);
			const inspectOwnership = row.holdForDeletionRecovery || row.agentId !== void 0 && admittedAgentIds.has(row.agentId);
			const schemaInput = {
				pathname: realAgentPath,
				agentId: row.agentId,
				supportedVersion: supportedVersions.agent,
				inspectOwnership,
				verifyCurrentSchemaShape: row.holdForDeletionRecovery ? false : options.verifyCurrentSchemaShape,
				requireStartupMigrationReadiness: row.holdForDeletionRecovery ? false : options.requireStartupMigrationReadiness,
				deferRuntimeIntegrity: purpose === "runtime" && options.preserveSourceArtifacts !== true && scheduling?.canDefer(row)
			};
			if (!schemaInspection && (options.preserveSourceArtifacts !== true || purpose === "runtime" && readSqliteDatabaseCleanClose(realAgentPath))) schemaInspection = await inspectSchema(schemaInput, options.signal);
			if (!schemaInspection) {
				agentSnapshot = await prepareSqliteReadOnlyLocation(realAgentPath, {
					preserveSourceArtifacts: options.preserveSourceArtifacts ?? true,
					allowLiveOwner: options.preserveSourceArtifacts !== false,
					signal: options.signal,
					requireCleanup: true
				});
				options.signal?.throwIfAborted();
				schemaInspection = await inspectSchema(schemaInput, options.signal, agentSnapshot.location);
			}
			if (!schemaInspection) throw new Error(`Agent database inspection returned no result: ${agentPath}`);
			readSucceeded = !schemaInspection.failure && !schemaInspection.reason;
			const { version: agentVersion, writerAppVersion, agentSchemaMeta } = schemaInspection;
			if (row.holdForDeletionRecovery) {
				recordAgentDatabaseRecoveryInspection(preparedDiscovery, agentPath, realAgentPath, schemaInspection);
				return;
			}
			if (agentVersion < supportedVersions.agent && purpose === "runtime" && row.agentId && (await (recoveryHolds ??= withArtifactPreservingStateReads(() => readAgentDeletionRecoveryHoldsInWorker({ env: options.env })))).some((held) => held.agentId === row.agentId && isSameOpenClawAgentDatabasePath(held.path, realAgentPath))) {
				const cause = new AgentDatabaseRecoveryHeldError(`Agent ${row.agentId} database is held for deletion recovery at schema ${agentVersion}; migration to schema ${supportedVersions.agent} requires Doctor.`);
				const refusal = createAgentDatabaseInspectionRefusal({
					agentId: row.agentId,
					paths: [agentPath],
					reason: cause.message,
					cause
				});
				(inspection.agentRefusals ??= []).push(refusal);
				createSubsystemLogger("state/agent-admission").warn(`${refusal.reason} ${refusal.repairHint}`);
				return;
			}
			if (agentVersion <= supportedVersions.agent && inspectOwnership && row.agentId) {
				const refusal = inspectAgentDatabaseAdmission({
					agentId: row.agentId,
					path: agentPath,
					metadata: agentSchemaMeta ?? null
				});
				if (refusal) {
					(inspection.agentRefusals ??= []).push(refusal);
					return;
				}
			}
			if (agentVersion < supportedVersions.agent) (inspection.pendingMigrations ??= []).push({
				kind: "agent",
				path: agentPath,
				...row.agentId !== void 0 ? { agentId: row.agentId } : {},
				foundVersion: agentVersion,
				supportedVersion: supportedVersions.agent
			});
			if (schemaInspection.failure && !schemaInspection.reason) throw schemaInspection.failure;
			if (schemaInspection?.reason) {
				if (startup || admissionTargets && !options.requireStartupMigrationReadiness) throw schemaInspection.failure ?? new Error(schemaInspection.reason);
				const failure = {
					kind: "agent",
					path: agentPath,
					reason: schemaInspection.reason,
					...options.requireStartupMigrationReadiness ? { agentId: row.agentId } : {}
				};
				if (schemaInspection.failure) indeterminateCauses.set(failure, schemaInspection.failure);
				inspection.indeterminate.push(failure);
				return;
			}
			if (agentVersion > supportedVersions.agent) {
				const incompatible = {
					kind: "agent",
					path: agentPath,
					...row.agentId !== void 0 ? { agentId: row.agentId } : {},
					foundVersion: agentVersion,
					supportedVersion: supportedVersions.agent,
					...writerAppVersion ? { writerAppVersion } : {}
				};
				if (!admissionTargets || !admissionConfig || !row.agentId || !canIsolateAgentDatabase(admissionConfig, row.agentId) || !recordInspectionFailure(row, inspection, new OpenClawDatabaseSchemaPreflightError([incompatible]))) inspection.incompatible.push(incompatible);
			}
			if (schemaInspection.integrityGateOutcome === "cached" && !readSqliteDatabaseCleanClose(agentPath)) requestOpenClawAgentDatabaseIntegrityCheck({
				check: "quick",
				path: agentPath,
				env: options.env ?? process.env
			});
			recordPreparedSchemaHeader?.(schemaInspection);
			return schemaInspection.preparationPending ? "defer" : void 0;
		} catch (error) {
			if (options.signal?.aborted) throw error;
			if (row.holdForDeletionRecovery) {
				recordRecoveryFailure(agentPath, formatErrorMessage(error));
				return;
			}
			if (recordInspectionFailure(row, inspection, error)) return;
			if (options.requireStartupMigrationReadiness) throw error;
			const failure = {
				kind: "agent",
				path: agentPath,
				reason: formatErrorMessage(error)
			};
			indeterminateCauses.set(failure, error);
			inspection.indeterminate.push(failure);
		} finally {
			if (agentSnapshot) {
				let failure;
				try {
					if (!await agentSnapshot.cleanupAsync()) failure = { error: /* @__PURE__ */ new Error(`SQLite read-only worker snapshot cleanup failed: ${agentSnapshot.location}`) };
				} catch (error) {
					if (!readSucceeded || !deferSqliteSnapshotCleanupAfterRead(error, agentSnapshot.cleanupRoot)) failure = { error };
				}
				if (failure && !recordInspectionFailure(row, inspection, failure.error)) {
					if (row.holdForDeletionRecovery) recordRecoveryFailure(agentPath, formatErrorMessage(failure.error));
					else inspection.indeterminate.push({
						kind: "agent",
						path: agentPath,
						reason: formatErrorMessage(failure.error)
					});
				}
			}
		}
	}, result, options.signal, scheduling);
	if (preparedDiscovery) options.onAgentDatabaseDiscovery?.(preparedDiscovery);
	options.onAgentInspection?.(stats);
	return result;
}
//#endregion
export { preflightOpenClawDatabaseSchemas as n, preflightOpenClawStateDatabasePath as r, assertOpenClawDatabasesReady as t };
