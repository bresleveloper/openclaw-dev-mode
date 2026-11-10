import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { m as writeTextAtomic } from "./json-files-DYmSFHoN.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { l as invalidateSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { i as prepareSqliteReadOnlyLocationSync, n as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-N5UzY_DG.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as isStatePostgres } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as parseAgentDeletionDatabasePaths, u as invalidateAgentDeletionJournalStatus } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { b as resolveAgentDeletionRecoveryHolds, h as readAgentDeletionJournalInDatabase, u as parseCleanupPaths, v as reconstructAgentDeletionJournal, y as recordAgentDeletionRecoveryHolds } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { b as prepareStateDatabaseInitialization, u as runOpenClawStateWriteTransaction, x as resolveOpenClawAgentDatabaseDiscoveryPaths } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as isReservedSystemAgentId } from "./agent-id-BxGhTBRK.mjs";
import { o as readAgentDeletionMissingJournalHolds, s as readAgentDeletionRecoveryHolds } from "./agent-deletion-journal-recovery.kernel-BaXrQW7-.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import "./io-DIF-KW3P.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-DJGC6v85.mjs";
import { i as hasSqliteFileFamily } from "./agent-deletion-discovery-WZhAVK2X.mjs";
import { t as createAgentSchemaInspectionWorker } from "./openclaw-agent-schema-inspection-worker-CarmFjwL.mjs";
import { n as isTransientSqliteBackupPath } from "./backup-volatile-filter-60qK_QQY.mjs";
import { n as backupDoctorSqliteDatabases } from "./doctor-migration-backup-CaaJT0rP.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor-agent-deletion-journal-quarantine.ts
function readRecoverySource(database) {
	if (isPostgresSqlConnection(database.db)) requireNativeDatabaseFile("postgres", "repair");
	invalidateSqliteSchemaFacts(database.db);
	const held = tableExists(database.db, "migration_sources") ? readAgentDeletionRecoveryHolds(database) : [];
	if (!tableExists(database.db, "agent_deletion_journal")) return {
		missing: true,
		rows: [],
		invalid: [],
		held
	};
	const rows = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("agent_deletion_journal").selectAll().orderBy("agent_id")).rows;
	return {
		missing: false,
		rows,
		invalid: rows.filter((row) => {
			if (isReservedSystemAgentId(row.agent_id)) return true;
			try {
				readAgentDeletionJournalInDatabase(database, row.agent_id);
				return false;
			} catch (error) {
				if (isSqliteCorruptionError(error)) throw error;
				return true;
			}
		}),
		held
	};
}
/** Doctor preserves unusable journal rows before trading cleanup authority for repair holds. */
async function quarantineAgentDeletionJournal(params) {
	const { env } = params;
	const source = withExistingOpenClawStateDatabaseReadOnly(readRecoverySource, { env }) ?? {
		missing: true,
		rows: [],
		invalid: [],
		held: []
	};
	if (!source.missing && source.invalid.length === 0) return;
	let held = source.missing ? [...params.inventory] : [...source.held];
	if (source.missing && source.held.length === 0) try {
		var _usingCtx$2 = _usingCtx();
		const samePath = createOpenClawAgentDatabasePathMatcher();
		const remaining = [];
		const reader = _usingCtx$2.a(createAgentSchemaInspectionWorker());
		for (const target of held) {
			if (params.configuredTargets.some((configured) => configured.agentId === target.agentId && samePath(configured.path, target.path))) try {
				const input = {
					pathname: target.path,
					agentId: target.agentId,
					env,
					supportedVersion: 27,
					inspectOwnership: true,
					inspectEmptyStore: true
				};
				let inspection = await reader.inspect(input);
				if (!inspection) {
					const snapshot = await prepareSqliteReadOnlyLocation(target.path, {
						preserveSourceArtifacts: true,
						requireCleanup: true
					});
					try {
						inspection = await reader.inspect(input, void 0, snapshot.location);
					} finally {
						if (!await snapshot.cleanupAsync()) inspection = null;
					}
				}
				if (inspection?.emptyStore === true) continue;
			} catch {}
			remaining.push(target);
		}
		held = remaining;
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
	for (const row of source.invalid) {
		const paths = /* @__PURE__ */ new Set([...resolveOpenClawAgentDatabaseDiscoveryPaths({
			agentDir: row.agent_dir,
			agentId: row.agent_id,
			env
		}).filter(hasSqliteFileFamily), ...params.inventory.filter((target) => normalizeAgentId(target.agentId) === normalizeAgentId(row.agent_id)).map((target) => target.path)]);
		try {
			for (const pathname of parseAgentDeletionDatabasePaths(row.database_paths_json)) paths.add(pathname);
		} catch {}
		try {
			for (const cleanup of parseCleanupPaths(row.cleanup_paths_json)) for (const pathname of cleanup.sourcePaths) paths.add(pathname);
		} catch {}
		held.push(...[...paths].filter((pathname) => !SQLITE_SIDECAR_SUFFIXES.some((suffix) => pathname.endsWith(suffix) && paths.has(pathname.slice(0, -suffix.length)))).map((pathname) => ({
			agentId: row.agent_id,
			path: pathname
		})));
	}
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	const assertCurrent = () => maintenance?.assertAdmission();
	const archives = [];
	const warnings = [];
	const agentIds = new Set(held.map((target) => normalizeAgentId(target.agentId)));
	for (const agentId of agentIds) {
		const archive = path.join(resolveStateDir(env), "agents", agentId, "recovery", `deletion-journal-${randomUUID()}.json`);
		assertCurrent();
		try {
			await writeTextAtomic(archive, JSON.stringify({
				source: resolveOpenClawStateSqlitePath(env),
				reason: source.missing ? "missing deletion journal" : "unusable deletion journal",
				journal: source.invalid.filter((row) => normalizeAgentId(row.agent_id) === agentId),
				held: held.filter((target) => normalizeAgentId(target.agentId) === agentId)
			}, null, 2), {
				mode: 384,
				dirMode: 448,
				durable: true,
				beforeRename: async () => {
					assertCurrent();
				}
			});
			archives.push(archive);
		} catch (error) {
			warnings.push(`Warning: Could not save deletion recovery receipt ${archive}: ${formatErrorMessage(error)}. Original journal records remain in place and stores remain held; repair the recovery directory, then run openclaw doctor --fix.`);
		}
	}
	assertCurrent();
	if (warnings.length > 0) held.push(...params.inventory);
	return {
		held: runOpenClawStateWriteTransaction((database) => {
			assertCurrent();
			if (!isDeepStrictEqual(readRecoverySource(database), source)) throw new Error("Agent deletion journal changed before quarantine; stores were left untouched.");
			if (source.missing) return reconstructAgentDeletionJournal(database, held);
			const query = getNodeSqliteKysely(database.db);
			for (const row of warnings.length === 0 ? source.invalid : []) {
				if (isReservedSystemAgentId(row.agent_id)) {
					executeSqliteQuerySync(database.db, query.deleteFrom("agent_deletion_journal").where("agent_id", "=", row.agent_id));
					invalidateAgentDeletionJournalStatus(database.db, row.agent_id);
					continue;
				}
				executeSqliteQuerySync(database.db, query.updateTable("agent_deletion_journal").set({
					operation_id: randomUUID(),
					database_paths_json: JSON.stringify([...new Set(held.filter((target) => normalizeAgentId(target.agentId) === normalizeAgentId(row.agent_id)).map((target) => target.path))]),
					cleanup_paths_json: "[]",
					cleanup_completed: 1,
					delete_files: 0
				}).where("agent_id", "=", row.agent_id));
				invalidateAgentDeletionJournalStatus(database.db, row.agent_id);
			}
			return recordAgentDeletionRecoveryHolds(database, held, {
				excludeMissingJournal: held.filter((target) => source.invalid.some((row) => normalizeAgentId(row.agent_id) === normalizeAgentId(target.agentId))),
				description: warnings.length === 0 ? "Quarantined unusable agent deletion records; stores remain held for explicit recovery." : "Preserved unusable agent deletion records in place; stores remain held for explicit recovery."
			});
		}, { env }),
		archives,
		warnings
	};
}
//#endregion
//#region src/commands/doctor-agent-deletion-journal-restore.ts
function readVerifiedOwner(database, agentId) {
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").selectAll().where("meta_key", "=", "primary"));
	if (row?.role !== "agent" || row.agent_id !== agentId || readSqliteUserVersion(database) !== row.schema_version) return;
	return row;
}
function inspectOwner(pathname, agentId) {
	const snapshot = prepareSqliteReadOnlyLocationSync(pathname);
	let producer;
	let cleanedUp;
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			producer = readVerifiedOwner(_usingCtx$1.u(openNodeSqliteDatabase(snapshot.location, { readOnly: true })), agentId);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} finally {
		cleanedUp = snapshot.cleanup();
	}
	if (!cleanedUp) throw new Error(`Could not release agent recovery inspection snapshot: ${snapshot.location}`);
	return producer;
}
/** Restore configured, verified stores after journal loss; quarantine still needs explicit consent. */
async function restoreDoctorMissingJournalStores(params) {
	const changes = [];
	const warnings = [];
	const restored = [];
	if (params.held.length === 0 || isStatePostgres()) return {
		changes,
		warnings,
		restored
	};
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!maintenance?.ownsSchemaMaintenance) return {
		changes,
		warnings,
		restored
	};
	const snapshot = await createConfigIO({
		env: params.env,
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshot();
	if (!snapshot.valid) return {
		changes,
		warnings,
		restored
	};
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const configured = resolveConfiguredAgentDatabaseTargets(snapshot.sourceConfig, {
		env: params.env,
		registeredDatabases: params.held
	});
	const agentIds = listAgentIds(snapshot.sourceConfig);
	const readEligibleHolds = (database, agentId) => isReservedSystemAgentId(agentId) ? readAgentDeletionRecoveryHolds(database) : readAgentDeletionMissingJournalHolds(database);
	const matchesReceipt = (target, current) => {
		const matches = (database) => readEligibleHolds(database, target.agentId).some((entry) => entry.agentId === target.agentId && samePath(entry.path, target.path)) && !readAgentDeletionJournalInDatabase(database, target.agentId);
		return current ? matches(current) : withExistingOpenClawStateDatabaseCurrentReadOnly(matches, {
			env: params.env,
			allowNativeRead: true
		}) === true;
	};
	const eligible = params.held.flatMap((target) => {
		if (!(isReservedSystemAgentId(target.agentId) ? samePath(target.path, resolveOpenClawAgentSqlitePath({
			agentId: target.agentId,
			env: params.env
		})) : agentIds.includes(target.agentId) && configured.some((entry) => entry.agentId === target.agentId && samePath(entry.path, target.path))) || !matchesReceipt(target)) return [];
		try {
			const producer = inspectOwner(target.path, target.agentId);
			return producer ? [{
				...target,
				producer
			}] : [];
		} catch (error) {
			warnings.push(`Agent ${target.agentId} remains held; could not verify its database ownership: ${formatErrorMessage(error)}`);
			return [];
		}
	});
	if (eligible.length === 0) return {
		changes,
		warnings,
		restored
	};
	const remaining = new Set(eligible);
	const assertCurrent = (database) => {
		maintenance.assertAdmission();
		if (!samePath.isCurrent() || [...remaining].some((target) => !matchesReceipt(target, database))) throw new Error("Agent deletion recovery changed; preserved stores remain held. Rerun Doctor.");
	};
	assertCurrent();
	const backups = await backupDoctorSqliteDatabases({
		env: params.env,
		pendingDatabasePaths: eligible.map((target) => target.path),
		databasePaths: eligible.map((target) => target.path),
		authority: { assertCurrent },
		requireSnapshots: true,
		repair: {
			key: "published-missing-agent-deletion-journal",
			validate: (database) => {
				const owner = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select(["role", "agent_id"]).where("meta_key", "=", "primary"));
				if (owner?.role === "global") {
					const source = {
						db: database,
						path: resolveOpenClawStateSqlitePath(params.env)
					};
					if (eligible.some((target) => !readEligibleHolds(source, target.agentId).some((entry) => entry.agentId === target.agentId && samePath(entry.path, target.path)) || readAgentDeletionJournalInDatabase(source, target.agentId))) throw new Error("Recovery backup does not preserve the deletion reconstruction records.");
				} else if (!eligible.some((target) => target.agentId === owner?.agent_id && isDeepStrictEqual(readVerifiedOwner(database, target.agentId), target.producer))) throw new Error("Recovery backup does not preserve the verified agent ownership metadata.");
			}
		}
	});
	changes.push(...backups.changes);
	warnings.push(...backups.warnings);
	const backupPaths = backups.snapshots ?? [];
	const sharedBackup = backupPaths.find((entry) => samePath(entry.sourcePath, resolveOpenClawStateSqlitePath(params.env)));
	if (!sharedBackup) throw new Error("Agent restoration requires a verified shared-state and reconstruction-record backup.");
	const { createAgent } = await import("./agent-create-BLYqXD7Q.mjs");
	let expectedConfigHash = snapshot.hash ?? null;
	for (const agentId of new Set(eligible.map((target) => target.agentId))) {
		const targets = eligible.filter((target) => target.agentId === agentId);
		assertCurrent();
		if (isReservedSystemAgentId(agentId)) {
			for (const target of targets) if (!isDeepStrictEqual(inspectOwner(target.path, agentId), target.producer)) throw new Error(`System agent ${agentId} ownership changed before recovery.`);
			runOpenClawStateWriteTransaction((database) => {
				assertCurrent(database);
				resolveAgentDeletionRecoveryHolds(database, agentId, targets.map((target) => target.path));
			}, { env: params.env });
		} else {
			const result = await createAgent({
				name: agentId,
				expectedConfigHash,
				restorePaths: targets.map((target) => target.path),
				beforePersistentApply: assertCurrent
			});
			if (result.status === "error") {
				warnings.push(`Agent ${agentId} remains held: ${result.message}`);
				continue;
			}
			expectedConfigHash = result.configHash ?? expectedConfigHash;
		}
		for (const target of targets) {
			if (withExistingOpenClawStateDatabaseCurrentReadOnly((database) => readAgentDeletionRecoveryHolds(database).some((entry) => entry.agentId === target.agentId && samePath(entry.path, target.path)), {
				env: params.env,
				allowNativeRead: true
			}) !== false) throw new Error(`Agent ${agentId} restoration left ${target.path} held.`);
			remaining.delete(target);
			restored.push(target);
			warnings.push(`Warning: Automatically restored agent ${agentId} database ${target.path}${isReservedSystemAgentId(agentId) ? " after verifying reserved system-agent ownership" : " after verifying configured ownership and missing deletion history"}. Verified backup: ${backupPaths.find((entry) => samePath(entry.sourcePath, target.path)).path}; shared state and reconstruction records: ${sharedBackup.path}.`);
		}
	}
	return {
		changes,
		warnings,
		restored
	};
}
//#endregion
//#region src/commands/doctor-agent-deletion-journal.ts
/** Doctor alone reconstructs lost deletion history and records the stores it cannot verify. */
async function repairDoctorAgentDeletionJournal(params) {
	const discovery = params.preflight.agentDatabaseMigrationDiscovery?.discovery;
	const changes = [];
	const recoveryWarnings = [];
	let quarantined = false;
	if (!discovery) return {
		changes,
		warnings: []
	};
	if (discovery.deletionJournal.status === "unavailable" && discovery.deletionJournal.cause === "unreadable" && !params.shouldRepair) return {
		changes,
		warnings: [sanitizeForLog(`${resolveOpenClawStateSqlitePath(params.env)}: ${discovery.deletionJournal.reason}. Stores remain held; restore verified deletion history, then rerun openclaw doctor --fix.`), ...[...discovery.retainedTargets, ...discovery.unverifiedTargets].map(({ agentId, path: pathname }) => sanitizeForLog(`Held agent ${agentId} database ${pathname}; deletion history needs repair.`))]
	};
	const missing = discovery.deletionJournal.status === "unavailable" && discovery.deletionJournal.cause === "missing";
	if (missing && discovery.unverifiedTargets.length === 0 && discovery.failures.length === 0 && prepareStateDatabaseInitialization(resolveOpenClawStateSqlitePath(params.env), params.env).kind === "fresh") return {
		changes,
		warnings: []
	};
	let held = discovery.unverifiedTargets.map(({ agentId, path: pathname }) => ({
		agentId,
		path: pathname
	}));
	if (missing && discovery.failures.length > 0) return {
		changes,
		warnings: ["Agent deletion journal missing; stores remain held because their recovery inventory is incomplete. Repair the listed paths, then rerun openclaw doctor --fix.", ...discovery.failures.map(({ path: pathname, reason }) => sanitizeForLog(`${pathname}: ${reason}`))]
	};
	if (missing && params.preflight.agentDatabaseRecoveryConfigValid !== true) return {
		changes,
		warnings: ["Agent deletion journal missing; stores remain held because the ownership configuration could not be verified. Repair the configuration, then rerun openclaw doctor --fix."]
	};
	if (params.shouldRepair) {
		const recovery = await quarantineAgentDeletionJournal({
			inventory: [
				...discovery.targets,
				...discovery.retainedTargets,
				...held
			],
			configuredTargets: params.preflight.agentDatabaseMigrationDiscovery?.configuredAgentDatabaseTargets ?? [],
			env: params.env
		});
		if (recovery) {
			quarantined = !missing && recovery.warnings.length === 0;
			recoveryWarnings.push(...recovery.warnings.map((warning) => sanitizeForLog(warning)));
			held = recovery.held;
			changes.push(missing ? "Reconstructed the missing agent deletion journal and recorded a Doctor receipt listing held stores." : quarantined ? "Quarantined unusable agent deletion journal records and recorded a Doctor receipt listing held stores." : "Preserved unusable agent deletion journal records in place and recorded a Doctor receipt listing held stores.");
			changes.push(...recovery.archives.map((archive) => sanitizeForLog(`Saved deletion recovery receipt: ${archive}`)));
		}
		const automatic = await restoreDoctorMissingJournalStores({
			env: params.env,
			held
		});
		changes.push(...automatic.changes.map(sanitizeForLog));
		recoveryWarnings.push(...automatic.warnings.map(sanitizeForLog));
		held = held.filter((target) => !automatic.restored.some((restored) => restored.agentId === target.agentId && restored.path === target.path));
	}
	if (held.length === 0 && (!missing || params.shouldRepair)) return {
		changes,
		warnings: recoveryWarnings
	};
	const snapshot = await createConfigIO({
		env: params.env,
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshot();
	const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
	return {
		changes,
		warnings: [
			...recoveryWarnings,
			`Warning: Agent deletion journal ${missing && !params.shouldRepair ? "missing" : quarantined ? "quarantined" : recoveryWarnings.length > 0 ? "unusable" : "reconstructed"}; ${held.length} store${held.length === 1 ? "" : "s"} held back. Updates can continue; held stores remain untouched.`,
			...held.map((target) => {
				if (isTransientSqliteBackupPath(target.path)) return sanitizeForLog(`${target.path}: internal SQLite coordination artifact; preserved without agent restoration or deletion.`);
				if (isReservedSystemAgentId(target.agentId)) return sanitizeForLog(`${target.path}: ${target.agentId} is a reserved system agent and cannot be added or deleted. Run ${formatCliCommand("openclaw doctor --fix", params.env)} to restore its canonical store after ownership, integrity, and backup verification; unverified stores remain untouched.`);
				const workspace = resolveAgentWorkspaceDir(snapshot.sourceConfig, target.agentId, params.env);
				const agentDir = listAgentIds(snapshot.sourceConfig).includes(target.agentId) ? resolveAgentDir(snapshot.sourceConfig, target.agentId, params.env) : path.dirname(target.path);
				const restore = formatCliCommand(`openclaw agents add ${quote(target.agentId)} --workspace ${quote(workspace)} --agent-dir ${quote(agentDir)} --non-interactive`, params.env);
				return sanitizeForLog(`${target.path}: ${path.basename(target.path) === "openclaw-agent.sqlite" ? "verify the workspace" : "restore the original session.store configuration for this database and verify the workspace"}, then run ${restore} to abort deletion and restore; after restoration, run ${formatCliCommand(`openclaw agents delete ${quote(target.agentId)} --force`, params.env)} to confirm deletion instead.`);
			}),
			...missing && !params.shouldRepair ? [`Run ${formatCliCommand("openclaw doctor --fix", params.env)} to reconstruct the journal and restore verified configured stores automatically after verified backups. Other stores remain held.`] : []
		]
	};
}
//#endregion
export { repairDoctorAgentDeletionJournal };
