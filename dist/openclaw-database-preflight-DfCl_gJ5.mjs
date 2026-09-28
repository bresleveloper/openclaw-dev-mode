import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./kysely-sync-Bn6Qrpbz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { a as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { d as readSqliteWriterAppVersion } from "./sqlite-readonly-location-BpMwSm5l.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { h as hasStateDatabaseSourceExclusion } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as createSqliteTableContractReader, i as collectSqliteSchemaIssues } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-x5nU_jtc.mjs";
import { i as readStateSchemaMigrationVersion, r as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-DX12nO8l.mjs";
import { A as openClawStateMigrationAssertions, B as getOpenClawStateRuntimeSchema, D as assertOpenClawStateDatabaseOwner, E as assertOpenClawStateDatabaseForMaintenance, H as isOpenClawStateStartupRepairableSchemaIssue, L as readStateSchemaPublicationBlocker, R as OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, V as isOpenClawStateFirstUseSchemaIssue, c as assertNoLegacyStateRuntimeRepair, d as assertCanonicalStateSchemaShape, tt as OPENCLAW_STATE_SCHEMA_SQL, z as STATE_PERSISTENT_SCHEMA_COMPATIBILITY } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as inspectOpenClawStateOwnershipFromDatabase } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { c as inspectAgentDatabaseAdmission, f as recordAgentDatabaseAdmissions, r as canIsolateAgentDatabase, t as AgentDatabaseAdmissionError } from "./agent-database-admission-BFwcs62N.mjs";
import { y as readRetainedAgentDeletionsFromDatabase } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { t as readAgentDatabasePreflightTargets } from "./openclaw-agent-db-registry.read-CZdmnVd_.mjs";
import { n as isPersistentOpenClawAgentDatabasePath } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { t as requestOpenClawAgentDatabaseQuickCheck } from "./openclaw-database-verify-Ju-BQfY7.mjs";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-Dmb8-YXN.mjs";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { t as discoverAgentDatabaseMigrationTargets } from "./state-migrations.media-persistence-targets-CvP9Kmvc.mjs";
import { t as getAgentDatabaseStartupAdmission } from "./agent-database-startup-A1bI1F7Q.mjs";
import { t as preflightAgentDatabasesBounded } from "./openclaw-database-preflight-agent-scheduler-DTKyg25c.mjs";
import { n as describeDeferredStateSchemaPublication, r as formatIndeterminateDatabaseReadiness, t as OpenClawDatabaseSchemaPreflightError } from "./openclaw-database-preflight.messages-BNmPUYWC.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-database-preflight.ts
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
	});
	for (const refusal of schemas.agentRefusals ?? []) if (!options.config || (refusal.code === "agent-database-ownership-mismatch" || options.operation === "gateway-startup" && refusal.code !== "agent-database-inspection-pending") && !canIsolateAgentDatabase(options.config, refusal.agentId)) throw new AgentDatabaseAdmissionError(refusal);
	if (schemas.incompatible.length > 0) throw new OpenClawDatabaseSchemaPreflightError(schemas.incompatible, { operation: options.operation });
	if (schemas.indeterminate.length === 0) {
		if (options.operation === "gateway-startup") recordAgentDatabaseAdmissions(schemas.agentRefusals ?? [], {
			env: options.env,
			source: "startup"
		});
		if (options.operation === "doctor") for (const publication of schemas.deferredSchemaPublications ?? []) options.onDeferredSchemaPublication?.(publication);
		return;
	}
	throw new Error(formatIndeterminateDatabaseReadiness(schemas.indeterminate, options.operation));
}
function deduplicateSchemaIssues(issues) {
	return [...new Map(issues.map((issue) => [`${issue.code}\0${issue.objectName}`, issue])).values()];
}
function inspectCurrentStateStartupSchema(database, databasePath, foundVersion) {
	assertOpenClawStateDatabaseOwner(database, { pathname: databasePath });
	const metadata = database.prepare("SELECT schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
	if (metadata?.schema_version !== foundVersion) throw new Error(`OpenClaw state database ${databasePath} metadata schema version ${typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid"} does not match ${foundVersion}.`);
	const readTable = createSqliteTableContractReader(database);
	const issues = deduplicateSchemaIssues([...collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable), ...collectSqliteSchemaIssues(database, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY, readTable)]);
	return {
		blockingIssues: issues.filter((issue) => !isOpenClawStateStartupRepairableSchemaIssue(issue) && !isOpenClawStateFirstUseSchemaIssue(issue)),
		startupRepairableIssues: issues.filter(isOpenClawStateStartupRepairableSchemaIssue)
	};
}
/** Compare one explicit SQLite file with this release's canonical shared-state schema. */
async function preflightOpenClawStateDatabasePath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	const base = {
		schema: "openclaw.state-schema-preflight.v1",
		databasePath: resolvedPath,
		targetVersion: 18
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
		contentVersion = foundVersion > 18 ? foundVersion : readStateSchemaContentVersion(database);
		if (contentVersion > 18) {
			try {
				ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
			} catch {}
			return result("incompatible");
		}
		ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
		if (readStateSchemaMigrationVersion(database) < 18) return result("migration-required", { requiresWrite: true });
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
async function preflightOpenClawDatabaseSchemas(options) {
	options.signal?.throwIfAborted();
	const { supportedVersions = {
		state: 18,
		agent: 23
	} } = options;
	const result = {
		incompatible: [],
		indeterminate: []
	};
	const startup = options.requireStartupMigrationReadiness ? getAgentDatabaseStartupAdmission() : void 0;
	const prepareSchemaHeader = startup?.prepareSchemaHeaders(options.env);
	const readPreparedSchemaHeader = options.reuseStartupSchemaPreparation && !options.requireStartupMigrationReadiness && !options.verifyCurrentSchemaShape && !options.agentAdmissionConfig ? getAgentDatabaseStartupAdmission()?.takePreparedSchemaHeaders(options.env) : void 0;
	const priorRefusals = startup?.captureRefusals(options.env);
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	let registeredDatabases = [];
	let retainedDeletions = "unavailable";
	let stateDatabase;
	let closeStateSchemaReadAdmission;
	let stateSnapshot;
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
				preserveSourceArtifacts: true,
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
			if (options.requireStartupMigrationReadiness && contentVersion <= 18) {
				assertSqliteIntegrity(stateDatabase, statePath);
				assertCanonicalStateSchemaShape(stateDatabase, statePath);
				if (migrationVersion === 18) {
					const { blockingIssues } = inspectCurrentStateStartupSchema(stateDatabase, statePath, stateVersion);
					if (blockingIssues.length > 0) throw new Error(`OpenClaw state database ${statePath} requires repair: ${blockingIssues.map((issue) => issue.message).join("; ")}; run openclaw doctor --fix.`);
				} else openClawStateMigrationAssertions.get(migrationVersion)?.(stateDatabase, { pathname: statePath });
			} else if (options.verifyCurrentSchemaShape === true && migrationVersion === 18) try {
				assertOpenClawStateDatabaseForMaintenance(stateDatabase, { pathname: statePath });
			} catch (error) {
				result.indeterminate.push({
					kind: "state",
					path: statePath,
					reason: formatErrorMessage(error)
				});
			}
			if (options.scope === "state") return result;
			try {
				registeredDatabases = readAgentDatabasePreflightTargets(stateDatabase, statePath);
				retainedDeletions = readRetainedAgentDeletionsFromDatabase(stateDatabase);
			} catch (error) {
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
		if (options.signal?.aborted || options.requireStartupMigrationReadiness) throw failure;
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: formatErrorMessage(failure)
		});
		return result;
	} finally {
		try {
			if (stateDatabase) try {
				closeStateSchemaReadAdmission?.();
			} finally {
				clearNodeSqliteKyselyCacheForDatabase(stateDatabase);
				stateDatabase.close();
			}
		} finally {
			await stateSnapshot?.cleanupAsync();
		}
	}
	if (options.scope === "state") return result;
	let agentTargets = registeredDatabases;
	let configuredTargets = [];
	if (options.configuredAgentDatabaseTargets !== void 0) {
		configuredTargets = typeof options.configuredAgentDatabaseTargets === "function" ? options.configuredAgentDatabaseTargets(registeredDatabases) : options.configuredAgentDatabaseTargets;
		const discovery = discoverAgentDatabaseMigrationTargets({
			env: options.env,
			configuredAgentDatabaseTargets: configuredTargets,
			registeredAgentDatabases: registeredDatabases,
			retainedDeletions
		});
		options.onAgentDatabaseDiscovery?.({
			stateDir: resolveStateDir(options.env),
			configuredAgentDatabaseTargets: configuredTargets,
			registeredAgentDatabases: registeredDatabases,
			discovery
		});
		agentTargets = discovery.targets;
		for (const failure of discovery.failures) result.indeterminate.push({
			kind: "agent",
			...failure
		});
	}
	const candidates = [
		...configuredTargets,
		...agentTargets,
		...options.configuredAgentDatabaseTargets !== void 0 ? registeredDatabases.filter((database) => isPersistentOpenClawAgentDatabasePath(database.path, options.env)) : [],
		...(options.configuredAgentDatabaseCandidatePaths ?? []).map((candidatePath) => ({
			agentId: options.requireStartupMigrationReadiness || options.agentAdmissionConfig ? resolveUnsuffixedSqliteTargetFromSessionStorePath(candidatePath).agentId : void 0,
			path: candidatePath
		}))
	];
	const classify = createAgentDatabaseDeletionClassifier({
		env: options.env,
		retainedDeletions,
		configuredAgentDatabaseTargets: configuredTargets,
		registeredAgentDatabases: registeredDatabases
	});
	const inspectionTargets = candidates.filter((row) => !classify(row.path, row.agentId)).map(({ agentId, path }) => ({
		agentId,
		path,
		presence: inspectCandidatePresence(path)
	})).filter((row) => row.presence.status !== "absent");
	const admittedAgentIds = options.agentAdmissionConfig ? new Set(listAgentIds(options.agentAdmissionConfig)) : void 0;
	const stats = await preflightAgentDatabasesBounded(inspectionTargets, async (row, inspection, claimAgentTarget, inspectSchema) => {
		const agentPath = row.path;
		if (startup?.reuseRefusal(row, inspection, priorRefusals)) return;
		const { presence } = row;
		if (presence.status === "indeterminate") {
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
			if (!claimAgentTarget(realAgentPath, row.agentId)) return;
			let schemaInspection = readPreparedSchemaHeader?.(realAgentPath, supportedVersions.agent) ?? null;
			const recordPreparedSchemaHeader = prepareSchemaHeader?.(realAgentPath);
			const inspectOwnership = row.agentId !== void 0 && admittedAgentIds?.has(row.agentId) === true;
			const schemaInput = {
				pathname: realAgentPath,
				agentId: row.agentId,
				supportedVersion: supportedVersions.agent,
				inspectOwnership,
				verifyCurrentSchemaShape: options.verifyCurrentSchemaShape,
				requireStartupMigrationReadiness: options.requireStartupMigrationReadiness,
				startupIntegrityStateDir: options.requireStartupMigrationReadiness ? resolveStateDir(options.env) : void 0
			};
			if (!schemaInspection && !hasStateDatabaseSourceExclusion(realAgentPath)) schemaInspection = await inspectSchema(schemaInput, options.signal);
			if (!schemaInspection) {
				agentSnapshot = await prepareSqliteReadOnlyLocation(realAgentPath, {
					preserveSourceArtifacts: true,
					signal: options.signal
				});
				options.signal?.throwIfAborted();
				schemaInspection = await inspectSchema(schemaInput, options.signal, agentSnapshot.location);
			}
			if (!schemaInspection) throw new Error(`Agent database inspection returned no result: ${agentPath}`);
			const { version: agentVersion, writerAppVersion, agentSchemaMeta } = schemaInspection;
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
			if (schemaInspection?.failure) throw schemaInspection.failure;
			if (schemaInspection?.reason) {
				if (startup) throw new Error(schemaInspection.reason);
				inspection.indeterminate.push({
					kind: "agent",
					path: agentPath,
					reason: schemaInspection.reason,
					...options.requireStartupMigrationReadiness ? { agentId: row.agentId } : {}
				});
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
				if (failure && !startup?.recordInspectionFailure(row, inspection, failure.error)) inspection.indeterminate.push({
					kind: "agent",
					path: agentPath,
					reason: formatErrorMessage(failure.error)
				});
			}
		}
	}, result, options.signal, startup?.scheduling(options.env));
	options.onAgentInspection?.(stats);
	return result;
}
//#endregion
export { preflightOpenClawDatabaseSchemas as n, preflightOpenClawStateDatabasePath as r, assertOpenClawDatabasesReady as t };
