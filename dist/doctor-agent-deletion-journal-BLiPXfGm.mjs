import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-BEC3zbaw.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { m as writeTextAtomic } from "./json-files-C5mNTScg.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { b as resolveOpenClawAgentDatabaseDiscoveryPaths, l as runOpenClawStateWriteTransaction, y as prepareStateDatabaseInitialization } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import "./io-CUI9EWW_.mjs";
import { h as recordAgentDeletionRecoveryHolds, l as readAgentDeletionJournalInDatabase, m as reconstructAgentDeletionJournal, o as parseCleanupPaths } from "./agent-deletion-journal-CDljXcnp.mjs";
import { x as isReservedSystemAgentId } from "./agent-database-admission-dWNS6Rcs.mjs";
import { i as readAgentDeletionRecoveryHolds } from "./agent-deletion-journal-recovery.kernel-NYQbfJsi.mjs";
import { t as parseAgentDeletionDatabasePaths } from "./agent-deletion-journal.read-Bkjt0nDs.mjs";
import { i as hasSqliteFileFamily } from "./agent-deletion-discovery-BRLBtW0y.mjs";
import { n as isTransientSqliteBackupPath } from "./backup-volatile-filter-I3J38C_Z.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-agent-deletion-journal-quarantine.ts
function readRecoverySource(database) {
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
	const held = source.missing ? [...params.inventory] : [...source.held];
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
					continue;
				}
				executeSqliteQuerySync(database.db, query.updateTable("agent_deletion_journal").set({
					operation_id: randomUUID(),
					database_paths_json: JSON.stringify([...new Set(held.filter((target) => normalizeAgentId(target.agentId) === normalizeAgentId(row.agent_id)).map((target) => target.path))]),
					cleanup_paths_json: "[]",
					cleanup_completed: 1,
					delete_files: 0
				}).where("agent_id", "=", row.agent_id));
			}
			return recordAgentDeletionRecoveryHolds(database, held, { description: warnings.length === 0 ? "Quarantined unusable agent deletion records; stores remain held for explicit recovery." : "Preserved unusable agent deletion records in place; stores remain held for explicit recovery." });
		}, { env }),
		archives,
		warnings
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
		if (params.preflight.pendingMigrations?.some((entry) => entry.kind === "state")) {
			const { prepareLegacyStateDatabaseSchema } = await import("./state-migrations.doctor-Cz_VEwpW.mjs");
			const { throwIfDoctorStateMigrationRefused } = await import("./state-migrations.messages-CHAbDmBr.mjs");
			throwIfDoctorStateMigrationRefused([await prepareLegacyStateDatabaseSchema(params.env)]);
		}
		const recovery = await quarantineAgentDeletionJournal({
			inventory: [
				...discovery.targets,
				...discovery.retainedTargets,
				...held
			],
			env: params.env
		});
		if (recovery) {
			quarantined = !missing && recovery.warnings.length === 0;
			recoveryWarnings.push(...recovery.warnings.map((warning) => sanitizeForLog(warning)));
			held = recovery.held;
			changes.push(missing ? "Reconstructed the missing agent deletion journal and recorded a Doctor receipt listing held stores." : quarantined ? "Quarantined unusable agent deletion journal records and recorded a Doctor receipt listing held stores." : "Preserved unusable agent deletion journal records in place and recorded a Doctor receipt listing held stores.");
			changes.push(...recovery.archives.map((archive) => sanitizeForLog(`Saved deletion recovery receipt: ${archive}`)));
		}
	}
	if (held.length === 0 && (!missing || params.shouldRepair)) return {
		changes,
		warnings: []
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
				if (isReservedSystemAgentId(target.agentId)) return sanitizeForLog(`${target.path}: ${target.agentId} is a reserved system agent and cannot be added or deleted. Its store remains untouched; review its deletion recovery receipt, then run ${formatCliCommand("openclaw doctor --fix", params.env)}.`);
				const workspace = resolveAgentWorkspaceDir(snapshot.sourceConfig, target.agentId, params.env);
				const agentDir = listAgentIds(snapshot.sourceConfig).includes(target.agentId) ? resolveAgentDir(snapshot.sourceConfig, target.agentId, params.env) : path.dirname(target.path);
				const restore = formatCliCommand(`openclaw agents add ${quote(target.agentId)} --workspace ${quote(workspace)} --agent-dir ${quote(agentDir)} --non-interactive`, params.env);
				return sanitizeForLog(`${target.path}: ${path.basename(target.path) === "openclaw-agent.sqlite" ? "verify the workspace" : "restore the original session.store configuration for this database and verify the workspace"}, then run ${restore} to abort deletion and restore; after restoration, run ${formatCliCommand(`openclaw agents delete ${quote(target.agentId)} --force`, params.env)} to confirm deletion instead.`);
			}),
			...missing && !params.shouldRepair ? [`Run ${formatCliCommand("openclaw doctor --fix", params.env)} to reconstruct the journal without activating held stores.`] : []
		]
	};
}
//#endregion
export { repairDoctorAgentDeletionJournal };
