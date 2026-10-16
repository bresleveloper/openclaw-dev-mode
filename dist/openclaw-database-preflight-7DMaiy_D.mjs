import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { i as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { d as readSqliteWriterAppVersion } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-Cd5MmsG2.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-BpllCelk.mjs";
import { t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { a as collectSqliteSchemaIssues, o as createSqliteTableContractReader } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { i as readStateSchemaMigrationVersion, r as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { A as STATE_PERSISTENT_SCHEMA_COMPATIBILITY, M as isOpenClawStateFirstUseSchemaIssue, N as isOpenClawStateStartupRepairableSchemaIssue, b as assertOpenClawStateDatabaseForMaintenance, j as getOpenClawStateRuntimeSchema, k as OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, n as assertNoLegacyStateRuntimeRepair, o as assertCanonicalStateSchemaShape, st as readStateSchemaPublicationBlocker, w as openClawStateMigrationAssertions, x as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { a as inspectOpenClawStateOwnershipFromDatabase } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { a as isPersistentOpenClawAgentDatabasePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { _ as recordAgentDatabaseAdmissions, f as inspectAgentDatabaseAdmission, r as canIsolateAgentDatabase, t as AgentDatabaseAdmissionError } from "./agent-database-admission-dWNS6Rcs.mjs";
import { t as readAgentDatabasePreflightTargets } from "./openclaw-agent-db-registry.read-DUQ6FrvR.mjs";
import { s as readRetainedAgentDeletionsFromDatabase } from "./agent-deletion-journal.read-Bkjt0nDs.mjs";
import { t as requestOpenClawAgentDatabaseQuickCheck } from "./openclaw-database-verify-C7BZMETe.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-BbcRkdUC.mjs";
import { t as getAgentDatabaseStartupAdmission } from "./agent-database-startup-n_PGS5Sj.mjs";
import { t as preflightAgentDatabasesBounded } from "./openclaw-database-preflight-agent-scheduler-Dnd_IpU6.mjs";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-BRLBtW0y.mjs";
import { n as discoverAgentDatabaseMigrationTargets } from "./state-migrations.media-persistence-targets-CLRKQZpa.mjs";
import { n as describeDeferredStateSchemaPublication, r as formatIndeterminateDatabaseReadiness, t as OpenClawDatabaseSchemaPreflightError } from "./openclaw-database-preflight.messages-B5IiBjiE.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
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
		cleanupErrors.push(error);
	}
	if (cleanupErrors.length > 0) throwSqliteLifecycleErrors([...options.inspectionErrors, ...cleanupErrors], "State database schema inspection cleanup failed");
}
//#endregion
//#region src/state/openclaw-database-preflight-targets.ts
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
	const retainedAgentIds = new Set(retainedDeletions.map((deletion) => deletion.agentId));
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
		agentTargets = discovery.targets;
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
		candidates: purpose === "runtime" ? candidates.filter((row) => typeof classifyDeletion(row.path, row.agentId) !== "object") : deletionJournal.status === "unavailable" ? preparedDiscovery && options.onAgentDatabaseDiscovery ? (options.configuredAgentDatabaseCandidatePaths ?? []).filter((pathname) => !retained.some((candidate) => samePath(candidate, pathname))).map((pathname) => ({
			agentId: void 0,
			path: pathname,
			holdForDeletionRecovery: true
		})) : [] : candidates.filter((row) => (row.agentId === void 0 || !retainedAgentIds.has(row.agentId)) && !(deletionJournal.status === "present" && deletionJournal.held.some((target) => samePath(target.path, row.path)))),
		isRetainedPath: (pathname) => purpose === "runtime" ? typeof classifyDeletion(pathname) === "object" : retained.some((candidate) => samePath(candidate, pathname)),
		failures,
		preparedDiscovery
	};
}
//#endregion
//#region src/state/openclaw-state-schema-inspection.ts
function deduplicateSchemaIssues(issues) {
	return [...new Map(issues.map((issue) => [`${issue.code}\0${issue.objectName}`, issue])).values()];
}
function inspectCurrentStateStartupSchema(database, databasePath, foundVersion) {
	const metadata = assertOpenClawStateDatabaseOwner(database, { pathname: databasePath });
	if (metadata?.schema_version !== foundVersion) throw new SqliteSchemaMismatchError(`OpenClaw state database ${databasePath} metadata schema version ${typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid"} does not match ${foundVersion}.`);
	const readTable = createSqliteTableContractReader(database);
	const issues = deduplicateSchemaIssues([...collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable), ...collectSqliteSchemaIssues(database, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY, readTable)]);
	return {
		blockingIssues: issues.filter((issue) => !isOpenClawStateStartupRepairableSchemaIssue(issue) && !isOpenClawStateFirstUseSchemaIssue(issue)),
		startupRepairableIssues: issues.filter(isOpenClawStateStartupRepairableSchemaIssue)
	};
}
//#endregion
//#region src/state/openclaw-database-preflight.ts
const indeterminateCauses = /* @__PURE__ */ new WeakMap();
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
		...options.operation === "doctor" ? { configuredAgentDatabaseTargets: options.configuredAgentDatabaseTargets } : {}
	}, options.operation === "doctor" ? "maintenance" : "runtime");
	const failures = [];
	for (const refusal of schemas.agentRefusals ?? []) if (!options.config || (refusal.code === "agent-database-ownership-mismatch" || options.operation === "gateway-startup" && refusal.code !== "agent-database-inspection-pending") && !canIsolateAgentDatabase(options.config, refusal.agentId)) failures.push(new AgentDatabaseAdmissionError(refusal));
	if (schemas.incompatible.length > 0) failures.push(new OpenClawDatabaseSchemaPreflightError(schemas.incompatible, { operation: options.operation }));
	if (schemas.indeterminate.length > 0) {
		const causes = schemas.indeterminate.flatMap((row) => indeterminateCauses.has(row) ? [indeterminateCauses.get(row)] : []);
		failures.push(options.operation === "gateway-startup" && schemas.indeterminate.length === 1 && causes.length === 1 ? causes[0] : new Error(formatIndeterminateDatabaseReadiness(schemas.indeterminate, options.operation), { cause: new AggregateError(causes) }));
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
/** Compare one explicit SQLite file with this release's canonical shared-state schema. */
async function preflightOpenClawStateDatabasePath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	const base = {
		schema: "openclaw.state-schema-preflight.v1",
		databasePath: resolvedPath,
		targetVersion: 20
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
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;`);
		assertSqliteIntegrity(database, resolvedPath);
		foundVersion = readSqliteUserVersion(database);
		if (!Number.isSafeInteger(foundVersion) || foundVersion < 0) throw new Error(`OpenClaw state database ${resolvedPath} has invalid schema version metadata.`);
		contentVersion = foundVersion > 20 ? foundVersion : readStateSchemaContentVersion(database);
		if (contentVersion > 20) {
			try {
				ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
			} catch {}
			return result("incompatible");
		}
		ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
		if (readStateSchemaMigrationVersion(database) < 20) return result("migration-required", { requiresWrite: true });
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
/** Read schema headers and optionally verify current schema shape without repairing it. */
async function preflightOpenClawDatabaseSchemas(options, purpose = "maintenance") {
	options.signal?.throwIfAborted();
	const { supportedVersions = {
		state: 20,
		agent: 24
	} } = options;
	const result = {
		incompatible: [],
		indeterminate: []
	};
	const startup = options.requireStartupMigrationReadiness ? getAgentDatabaseStartupAdmission() : void 0;
	const prepareSchemaHeader = startup?.prepareSchemaHeaders(options.env);
	const preparedStartup = options.reuseStartupSchemaPreparation && !options.requireStartupMigrationReadiness && !options.verifyCurrentSchemaShape && !options.agentAdmissionConfig ? getAgentDatabaseStartupAdmission() : void 0;
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
	const inspectCandidatePresence = (databasePath) => {
		try {
			statSync(databasePath);
			return { status: "present" };
		} catch (error) {
			return hasNodeErrorCode(error, "ENOENT") ? { status: "absent" } : {
				status: "indeterminate",
				reason: formatErrorMessage(error)
			};
		}
	};
	const statePresence = inspectCandidatePresence(statePath);
	if (statePresence.status === "indeterminate") {
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: statePresence.reason
		});
		return result;
	}
	try {
		if (statePresence.status === "present") {
			stateSnapshot = await prepareSqliteReadOnlyLocation(realpathSync.native(statePath), {
				preserveSourceArtifacts: options.preserveSourceArtifacts ?? true,
				allowLiveOwner: options.preserveSourceArtifacts !== false,
				signal: options.signal
			});
			options.signal?.throwIfAborted();
			stateDatabase = openNodeSqliteDatabase(stateSnapshot.location, { readOnly: true });
			closeStateSchemaReadAdmission = options.openStateSchemaReadAdmission?.(stateDatabase);
			stateDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			const stateVersion = readSqliteUserVersion(stateDatabase);
			const contentVersion = stateVersion > supportedVersions.state ? stateVersion : readStateSchemaContentVersion(stateDatabase);
			const migrationVersion = contentVersion > supportedVersions.state ? contentVersion : readStateSchemaMigrationVersion(stateDatabase);
			if (migrationVersion < supportedVersions.state) (result.pendingMigrations ??= []).push({
				kind: "state",
				path: statePath,
				foundVersion: stateVersion,
				supportedVersion: supportedVersions.state
			});
			if (contentVersion > supportedVersions.state) {
				const writerAppVersion = readSqliteWriterAppVersion(stateDatabase);
				result.incompatible.push({
					kind: "state",
					path: statePath,
					foundVersion: contentVersion,
					supportedVersion: supportedVersions.state,
					...writerAppVersion ? { writerAppVersion } : {}
				});
			}
			if (stateVersion < contentVersion && migrationVersion === contentVersion) (result.deferredSchemaPublications ??= []).push(describeDeferredStateSchemaPublication(readStateSchemaPublicationBlocker(stateDatabase), statePath, stateVersion, contentVersion));
			if (options.requireStartupMigrationReadiness && contentVersion <= 20) {
				assertSqliteIntegrity(stateDatabase, statePath);
				assertCanonicalStateSchemaShape(stateDatabase, statePath);
				if (migrationVersion === 20) {
					const { blockingIssues } = inspectCurrentStateStartupSchema(stateDatabase, statePath, stateVersion);
					if (blockingIssues.length > 0) throw new SqliteSchemaMismatchError(`OpenClaw state database ${statePath} requires repair: ${blockingIssues.map((issue) => issue.message).join("; ")}; run openclaw doctor --fix.`);
				} else openClawStateMigrationAssertions.get(migrationVersion)?.(stateDatabase, { pathname: statePath });
			} else if (options.verifyCurrentSchemaShape === true && migrationVersion === 20) try {
				assertOpenClawStateDatabaseForMaintenance(stateDatabase, { pathname: statePath });
			} catch (error) {
				stateInspectionErrors.push(error);
				result.indeterminate.push({
					kind: "state",
					path: statePath,
					reason: formatErrorMessage(error)
				});
			}
			if (options.scope === "state") return result;
			try {
				registeredDatabases = readAgentDatabasePreflightTargets(stateDatabase, statePath);
				deletionJournal = readRetainedAgentDeletionsFromDatabase(stateDatabase, statePath, purpose);
			} catch (error) {
				stateInspectionErrors.push(error);
				result.indeterminate.push({
					kind: "state",
					path: statePath,
					reason: `agent database registry query failed: ${formatErrorMessage(error)}`
				});
				return result;
			}
		}
	} catch (error) {
		const failure = normalizeOpenClawStateSchemaReadError(error, statePath);
		stateInspectionErrors.push(failure);
		if (options.signal?.aborted || options.requireStartupMigrationReadiness) throw failure;
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: formatErrorMessage(failure)
		});
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
	const { candidates, isRetainedPath, failures, preparedDiscovery } = collectAgentDatabasePreflightTargets({
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
	const inspectionTargets = candidates.map(({ agentId, path, holdForDeletionRecovery }) => ({
		agentId,
		path,
		holdForDeletionRecovery,
		presence: inspectCandidatePresence(path)
	})).filter((row) => row.presence.status !== "absent");
	const admittedAgentIds = options.agentAdmissionConfig ? new Set(listAgentIds(options.agentAdmissionConfig)) : void 0;
	const stats = await preflightAgentDatabasesBounded(inspectionTargets, async (row, inspection, claimAgentTarget, inspectSchema) => {
		const agentPath = row.path;
		if (refusalOwner?.reuseRefusal(row, inspection, priorRefusals)) return;
		const { presence } = row;
		if (presence.status === "indeterminate") {
			if (row.holdForDeletionRecovery) {
				recordRecoveryFailure(agentPath, presence.reason);
				return;
			}
			if (!startup?.recordInspectionFailure(row, inspection, new Error(presence.reason))) inspection.indeterminate.push({
				kind: "agent",
				path: agentPath,
				reason: presence.reason
			});
			return;
		}
		let agentSnapshot;
		try {
			const realAgentPath = realpathSync.native(agentPath);
			if (row.agentId === void 0 && isRetainedPath(realAgentPath)) return;
			if (!claimAgentTarget(realAgentPath, row.agentId)) return;
			let schemaInspection = readPreparedSchemaHeader?.(realAgentPath, supportedVersions.agent) ?? null;
			const recordPreparedSchemaHeader = prepareSchemaHeader?.(realAgentPath);
			const inspectOwnership = row.holdForDeletionRecovery || row.agentId !== void 0 && admittedAgentIds?.has(row.agentId) === true;
			const schemaInput = {
				pathname: realAgentPath,
				agentId: row.agentId,
				supportedVersion: supportedVersions.agent,
				inspectOwnership,
				verifyCurrentSchemaShape: row.holdForDeletionRecovery ? false : options.verifyCurrentSchemaShape,
				requireStartupMigrationReadiness: row.holdForDeletionRecovery ? false : options.requireStartupMigrationReadiness,
				startupIntegrityStateDir: options.requireStartupMigrationReadiness ? resolveStateDir(options.env) : void 0
			};
			if (!schemaInspection && options.preserveSourceArtifacts !== true) schemaInspection = await inspectSchema(schemaInput, options.signal);
			if (!schemaInspection) {
				agentSnapshot = await prepareSqliteReadOnlyLocation(realAgentPath, {
					preserveSourceArtifacts: options.preserveSourceArtifacts ?? true,
					allowLiveOwner: options.preserveSourceArtifacts !== false,
					signal: options.signal
				});
				options.signal?.throwIfAborted();
				schemaInspection = await inspectSchema(schemaInput, options.signal, agentSnapshot.location);
			}
			if (!schemaInspection) throw new Error(`Agent database inspection returned no result: ${agentPath}`);
			const { version: agentVersion, writerAppVersion, agentSchemaMeta } = schemaInspection;
			if (row.holdForDeletionRecovery) {
				recordAgentDatabaseRecoveryInspection(preparedDiscovery, agentPath, realAgentPath, schemaInspection);
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
				if (startup) throw schemaInspection.failure ?? new Error(schemaInspection.reason);
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
			if (agentVersion > supportedVersions.agent) inspection.incompatible.push({
				kind: "agent",
				path: agentPath,
				...row.agentId !== void 0 ? { agentId: row.agentId } : {},
				foundVersion: agentVersion,
				supportedVersion: supportedVersions.agent,
				...writerAppVersion ? { writerAppVersion } : {}
			});
			if (schemaInspection.integrityGateOutcome === "cached") requestOpenClawAgentDatabaseQuickCheck({
				path: agentPath,
				env: options.env ?? process.env
			});
			recordPreparedSchemaHeader?.(agentVersion);
		} catch (error) {
			if (options.signal?.aborted) throw error;
			if (row.holdForDeletionRecovery) {
				recordRecoveryFailure(agentPath, formatErrorMessage(error));
				return;
			}
			if (startup?.recordInspectionFailure(row, inspection, error)) return;
			if (options.requireStartupMigrationReadiness) throw error;
			inspection.indeterminate.push({
				kind: "agent",
				path: agentPath,
				reason: formatErrorMessage(error)
			});
		} finally {
			if (agentSnapshot) {
				let failure;
				try {
					if (!await agentSnapshot.cleanupAsync()) failure = { error: /* @__PURE__ */ new Error(`SQLite read-only worker snapshot cleanup failed: ${agentSnapshot.location}`) };
				} catch (error) {
					failure = { error };
				}
				if (failure && !startup?.recordInspectionFailure(row, inspection, failure.error)) {
					if (row.holdForDeletionRecovery) recordRecoveryFailure(agentPath, formatErrorMessage(failure.error));
					else inspection.indeterminate.push({
						kind: "agent",
						path: agentPath,
						reason: formatErrorMessage(failure.error)
					});
				}
			}
		}
	}, result, options.signal, startup?.scheduling(options.env));
	if (preparedDiscovery) options.onAgentDatabaseDiscovery?.(preparedDiscovery);
	options.onAgentInspection?.(stats);
	return result;
}
//#endregion
export { preflightOpenClawDatabaseSchemas as n, preflightOpenClawStateDatabasePath as r, assertOpenClawDatabasesReady as t };
