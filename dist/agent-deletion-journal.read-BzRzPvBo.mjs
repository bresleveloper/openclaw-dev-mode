import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as prepareOpenClawStateReadSource } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as ensureAgentDeletionJournalPhaseSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { m as hasPreJournalStateSchema } from "./openclaw-state-db-BtDOU_3j.mjs";
import { s as readAgentDeletionRecoveryHolds } from "./agent-deletion-journal-recovery.kernel-BaXrQW7-.mjs";
import { _ as readRegisteredAgentDatabaseRows, o as isOpenClawAgentDatabaseRegistryChange, u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import path from "node:path";
//#region src/claws/provenance-secondary-references.ts
const CLAW_SECONDARY_REFERENCE_TABLES = [
	"claw_package_refs",
	"claw_mcp_server_refs",
	"claw_cron_refs"
];
function readClawSecondaryReferenceTables(db, agentId) {
	return CLAW_SECONDARY_REFERENCE_TABLES.filter((table) => {
		if (!tableExists(db, table)) return false;
		return Boolean(db.prepare(`SELECT 1 FROM ${table} WHERE agent_id = ? LIMIT 1`).get(agentId));
	});
}
//#endregion
//#region src/state/agent-deletion-journal-authority.worker.ts
/** Deletion authority requires its admitted journal; unavailable rows must never grant cleanup. */
function readAgentDeletionJournalAuthorityInDatabase(database, agentId) {
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").select([
		"agent_id",
		"operation_id",
		"cleanup_completed"
	]).where("agent_id", "=", normalizeAgentId(agentId)));
	if (!row) return;
	if (typeof row.operation_id !== "string" || !row.operation_id || row.cleanup_completed !== 0 && row.cleanup_completed !== 1) throw new Error("Agent deletion journal authority is unreadable.");
	return {
		agentId: row.agent_id,
		operationId: row.operation_id,
		cleanupCompleted: row.cleanup_completed === 1
	};
}
function hasClawDeletionOwnership(database, agentId) {
	const db = getNodeSqliteKysely(database.db);
	return ["claw_installs", "claw_workspace_files"].some((table) => tableExists(database.db, table) && executeSqliteQueryTakeFirstSync(database.db, db.selectFrom(table).select("agent_id").where("agent_id", "=", agentId).limit(1)) !== void 0) || readClawSecondaryReferenceTables(database.db, agentId).length > 0;
}
function retireAgentDeletionJournalInDatabase(database, agentId, operationId) {
	ensureAgentDeletionJournalPhaseSchema(database.db);
	const retired = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("agent_deletion_journal").set({ phase: "retiring" }).where("agent_id", "=", normalizeAgentId(agentId)).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0)).numAffectedRows === 1n;
	if (retired) sessionChanges.emit({
		all: true,
		scope: "stores"
	}, database.db);
	return retired;
}
//#endregion
//#region src/state/agent-deletion-journal-status.ts
function statusKey(agentId) {
	return {
		name: `agent.deletion-status:${normalizeAgentId(agentId)}`,
		schemaDependent: true,
		read: (value) => value === "absent" || value === "pending" || value === "complete" ? value : void 0
	};
}
/** The journal writer publishes after commit through the existing database-fact transport. */
function publishAgentDeletionJournalStatus(database, agentId, status) {
	publishSqliteDatabaseAdmission(database, statusKey(agentId), status);
}
/** Offline repairs and raw fixture mutations discard only the affected agent's fact. */
function invalidateAgentDeletionJournalStatus(database, agentId) {
	publishSqliteDatabaseAdmission(database, statusKey(agentId), null);
}
function getAgentDeletionJournalStatus(database, agentId) {
	return getSqliteDatabaseAdmission(database, statusKey(agentId)) ?? void 0;
}
/** Synchronous guards consume the same committed fact as asynchronous turn admission. */
function getOrLoadAgentDeletionJournalStatus(statePath, agentId, load) {
	return getOrLoadSqliteDatabaseAdmissionForPath(statePath, statusKey(agentId), load) ?? void 0;
}
const pendingLoads = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionJournalStatusLoads"), () => /* @__PURE__ */ new Map());
/** First admission loads once; journal writes replace the shared fact before observers run. */
async function loadAgentDeletionJournalStatus(statePath, agentId, load) {
	const key = statusKey(agentId);
	const cached = getOrLoadAgentDeletionJournalStatus(statePath, agentId, () => void 0);
	if (cached) return cached;
	const pendingKey = JSON.stringify([statePath, key.name]);
	let pending = pendingLoads.get(pendingKey);
	if (!pending) {
		pending = (async () => {
			const loaded = await load();
			return getOrLoadAgentDeletionJournalStatus(statePath, agentId, () => loaded) ?? loaded;
		})();
		pendingLoads.set(pendingKey, pending);
	}
	try {
		return await pending;
	} finally {
		if (pendingLoads.get(pendingKey) === pending) pendingLoads.delete(pendingKey);
	}
}
//#endregion
//#region src/state/agent-deletion-journal.read.ts
async function readAgentDeletionRecoveryHoldsInWorker(options = {}) {
	const statePath = resolveDatabasePath(options);
	return (await executeExistingOpenClawStateRead({
		...options,
		path: statePath
	}, {
		type: "agentRecovery.holds",
		input: { statePath }
	}, { current: true }))?.held ?? [];
}
async function readAgentDeletionJournalForCreation(agentId, options = {}) {
	return (await executeExistingOpenClawStateRead(options, {
		type: "agentRecovery.creationJournal",
		input: { agentId: normalizeAgentId(agentId) }
	}, { current: true }))?.journal;
}
/** Completed cleanup still retains a deletion tombstone. */
function readAgentDeletionJournalStatusInDatabase(database, agentId) {
	const cached = getAgentDeletionJournalStatus(database, agentId);
	if (cached) return cached;
	if (!tableExists(database, "agent_deletion_journal")) return "absent";
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").select("cleanup_completed").where("agent_id", "=", normalizeAgentId(agentId)));
	return row ? row.cleanup_completed === 1 ? "complete" : "pending" : "absent";
}
async function readAgentDeletionJournalStatusInWorker(agentId, options = {}, signal) {
	signal?.throwIfAborted();
	return loadAgentDeletionJournalStatus(resolveDatabasePath(options), agentId, async () => {
		return (await executeExistingOpenClawStateRead(options, {
			type: "agentDeletionJournal.status",
			agentId: normalizeAgentId(agentId)
		}, {
			current: true,
			signal
		}))?.status ?? "absent";
	});
}
function parseAgentDeletionDatabasePaths(value) {
	const parsed = JSON.parse(value);
	if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")) return parsed;
	throw new Error("Invalid agent deletion database path journal.");
}
/** Read existing deletion history without initializing or repairing the journal. */
function readRetainedAgentDeletionsFromDatabase(database, statePath, purpose = "maintenance") {
	let entries = [];
	let missing = false;
	let unreadableReason;
	try {
		missing = !tableExists(database, "agent_deletion_journal");
		if (!missing) entries = executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").selectAll().where((eb) => {
			const retained = eb.and([eb("cleanup_completed", "=", 1), eb("delete_files", "=", 0)]);
			return purpose === "maintenance" ? eb.or([retained, eb("cleanup_completed", "=", 0)]) : retained;
		}).orderBy("agent_id", "asc")).rows.map((row) => {
			let databasePaths = [];
			try {
				databasePaths = parseAgentDeletionDatabasePaths(row.database_paths_json);
			} catch (error) {
				if (purpose === "maintenance") unreadableReason ??= formatErrorMessage(error);
			}
			const entry = {
				agentId: row.agent_id,
				agentDir: row.agent_dir,
				databasePaths: [path.join(row.agent_dir, "openclaw-agent.sqlite"), ...databasePaths],
				cleanupCompleted: row.cleanup_completed === 1
			};
			if (row.cleanup_completed === 0 && row.phase == null && hasClawDeletionOwnership({ db: database }, row.agent_id)) entry.manualClawRemoval = true;
			return entry;
		});
	} catch (error) {
		if (isSqliteCorruptionError(error)) throw error;
		unreadableReason = formatErrorMessage(error);
	}
	const held = purpose === "maintenance" && tableExists(database, "migration_sources") ? readAgentDeletionRecoveryHolds({
		db: database,
		path: statePath
	}) : [];
	if (missing && held.length === 0 && hasPreJournalStateSchema(database)) return { status: "empty" };
	if (missing || unreadableReason !== void 0) return {
		status: "unavailable",
		cause: missing ? "missing" : "unreadable",
		reason: missing ? "deletion journal missing" : `deletion journal unreadable: ${unreadableReason}`,
		...entries.length || held.length ? { known: {
			entries,
			held
		} } : {}
	};
	return entries.length || held.length ? {
		status: "present",
		entries,
		held
	} : { status: "empty" };
}
/** Read journal and registered-owner facts from one shared-state generation. */
function readAgentDatabaseDeletionSnapshot(env, purpose = "maintenance") {
	return withExistingOpenClawStateDatabaseReadOnly(({ db, path: statePath }) => runSqliteDeferredTransactionSync(db, () => ({
		retainedDeletions: readRetainedAgentDeletionsFromDatabase(db, statePath, purpose),
		registeredAgentDatabases: readRegisteredAgentDatabaseRows(db, statePath, false)
	}), { operationLabel: "agentDeletionJournal.snapshot" }), { env });
}
/** Repeated discovery reads keep their original source custody and observe current committed facts. */
function prepareAgentDatabaseDeletionSnapshotRead(inputOptions = {}, purpose = "maintenance") {
	const env = cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		env,
		path: path.resolve(inputOptions.path ?? resolveOpenClawStateSqlitePath(env))
	};
	const source = prepareOpenClawStateReadSource(options);
	const context = source.workerContext();
	const readSnapshot = async (readContext) => {
		const assertReadCurrent = () => {
			readContext.maintenanceScope?.assertAdmission();
			readContext.admission.assertCurrent();
		};
		assertReadCurrent();
		const reply = await executeExistingOpenClawStateRead(options, {
			type: "agentDatabaseDeletion.snapshot",
			purpose
		}, {
			context: readContext,
			current: true
		});
		assertReadCurrent();
		return {
			snapshot: reply?.snapshot,
			assertCurrent: assertReadCurrent
		};
	};
	const read = () => readSnapshot(context);
	return {
		read,
		async readWithCurrentAdmission() {
			return source.withCurrent(readSnapshot);
		},
		async withCurrentSnapshot(consume) {
			let changed;
			let assertRegistryCurrent;
			const stop = sessionChanges.subscribeFacts((change) => {
				if (isSessionStoreTopologyChange(change) && (!assertRegistryCurrent || !isOpenClawAgentDatabaseRegistryChange(change))) changed = true;
			});
			try {
				for (;;) {
					changed = false;
					const { snapshot, assertCurrent } = await read();
					assertCurrent();
					if (changed) continue;
					assertRegistryCurrent = prepareOpenClawAgentDatabaseRegistrySnapshotRead(options, (mutation) => mutation.kind === "upsert" && mutation.sources.every((registration) => snapshot?.registeredAgentDatabases.some((entry) => entry.agentId === registration.agentId && entry.path === registration.path && entry.schemaVersion === registration.schemaVersion))).assertCurrent;
					return await consume(snapshot, () => {
						assertCurrent();
						if (changed) throw new Error("Agent database deletion snapshot changed during consumption.");
						assertRegistryCurrent?.();
					});
				}
			} finally {
				changed = true;
				stop();
			}
		}
	};
}
//#endregion
export { readAgentDeletionJournalStatusInDatabase as a, readRetainedAgentDeletionsFromDatabase as c, publishAgentDeletionJournalStatus as d, hasClawDeletionOwnership as f, readClawSecondaryReferenceTables as h, readAgentDeletionJournalForCreation as i, getOrLoadAgentDeletionJournalStatus as l, retireAgentDeletionJournalInDatabase as m, prepareAgentDatabaseDeletionSnapshotRead as n, readAgentDeletionJournalStatusInWorker as o, readAgentDeletionJournalAuthorityInDatabase as p, readAgentDatabaseDeletionSnapshot as r, readAgentDeletionRecoveryHoldsInWorker as s, parseAgentDeletionDatabasePaths as t, invalidateAgentDeletionJournalStatus as u };
