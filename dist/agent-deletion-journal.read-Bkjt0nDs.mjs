import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { i as prepareOpenClawStateReadSource } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { p as hasPreJournalStateSchema } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as sessionChanges, t as isSessionStoreTopologyChange } from "./session-row-changes-BcJIdta8.mjs";
import { i as readAgentDeletionRecoveryHolds } from "./agent-deletion-journal-recovery.kernel-NYQbfJsi.mjs";
import { r as readRegisteredAgentDatabaseRows } from "./openclaw-agent-db-registry.read-DUQ6FrvR.mjs";
import path from "node:path";
//#region src/state/agent-deletion-journal.read.ts
async function readAgentDeletionJournalAuthorityInWorker(agentId, context, signal) {
	context.maintenanceScope?.assertAdmission();
	context.admission.assertCurrent();
	signal.throwIfAborted();
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "agentDeletionJournal.authority",
		agentId: normalizeAgentId(agentId)
	}, {
		context,
		current: true,
		signal
	});
	context.maintenanceScope?.assertAdmission();
	context.admission.assertCurrent();
	signal.throwIfAborted();
	if (reply && (!reply.ok || reply.type !== "agentDeletionJournal.authority")) throw new Error("Unexpected agent deletion journal authority result");
	return reply?.authority;
}
/** Completed cleanup still retains a deletion tombstone. */
function readAgentDeletionJournalStatusInDatabase(database, agentId) {
	if (!tableExists(database, "agent_deletion_journal")) return "absent";
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").select("cleanup_completed").where("agent_id", "=", normalizeAgentId(agentId)));
	return row ? row.cleanup_completed === 1 ? "complete" : "pending" : "absent";
}
async function readAgentDeletionJournalStatusInWorker(agentId, options = {}, signal) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "agentDeletionJournal.status",
		agentId: normalizeAgentId(agentId)
	}, {
		current: true,
		signal
	});
	if (reply && (!reply.ok || reply.type !== "agentDeletionJournal.status")) throw new Error("Unexpected agent deletion journal read result");
	return reply?.status ?? "absent";
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
		if (!missing) entries = executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").select([
			"agent_id",
			"agent_dir",
			"database_paths_json"
		]).where("cleanup_completed", "=", 1).where("delete_files", "=", 0).orderBy("agent_id", "asc")).rows.map((row) => {
			let databasePaths = [];
			try {
				databasePaths = parseAgentDeletionDatabasePaths(row.database_paths_json);
			} catch (error) {
				if (purpose === "maintenance") unreadableReason ??= formatErrorMessage(error);
			}
			return {
				agentId: row.agent_id,
				agentDir: row.agent_dir,
				databasePaths: [path.join(row.agent_dir, "openclaw-agent.sqlite"), ...databasePaths]
			};
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
function readAgentDatabaseDeletionSnapshotInDatabase(database, statePath, purpose = "maintenance") {
	return runSqliteDeferredTransactionSync(database, () => ({
		retainedDeletions: readRetainedAgentDeletionsFromDatabase(database, statePath, purpose),
		registeredAgentDatabases: readRegisteredAgentDatabaseRows(database, statePath, false)
	}));
}
function readAgentDatabaseDeletionSnapshot(env, purpose = "maintenance") {
	return withExistingOpenClawStateDatabaseReadOnly(({ db, path: statePath }) => readAgentDatabaseDeletionSnapshotInDatabase(db, statePath, purpose), { env });
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
		if (reply && (!reply.ok || reply.type !== "agentDatabaseDeletion.snapshot")) throw new Error("Unexpected agent database deletion snapshot result");
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
			const stop = sessionChanges.subscribeFacts((change) => {
				if (isSessionStoreTopologyChange(change)) changed = true;
			});
			try {
				for (;;) {
					changed = false;
					const { snapshot, assertCurrent } = await read();
					assertCurrent();
					if (changed) continue;
					return consume(snapshot);
				}
			} finally {
				stop();
			}
		}
	};
}
//#endregion
export { readAgentDeletionJournalStatusInDatabase as a, readAgentDeletionJournalAuthorityInWorker as i, prepareAgentDatabaseDeletionSnapshotRead as n, readAgentDeletionJournalStatusInWorker as o, readAgentDatabaseDeletionSnapshot as r, readRetainedAgentDeletionsFromDatabase as s, parseAgentDeletionDatabasePaths as t };
