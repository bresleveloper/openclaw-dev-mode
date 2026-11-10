import { x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { h as releaseExitedOpenClawAgentDatabaseLeaseInDatabase } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
//#region src/state/openclaw-agent-execution-cleanup.worker.ts
function executeAgentDatabaseCleanupCommand(command, database, env) {
	runOpenClawStateWriteTransaction((current) => {
		if (current.path !== command.input.sharedStatePath || requireOpenClawStateDatabaseIdentity(current).key !== command.input.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
		releaseExitedOpenClawAgentDatabaseLeaseInDatabase(current.db, command.input, command.input.outcome, () => requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: "agent-integrity-invalidated"
		}));
	}, {
		database,
		path: database.path,
		env
	});
}
//#endregion
export { executeAgentDatabaseCleanupCommand };
