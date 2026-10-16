import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { h as releaseExitedOpenClawAgentDatabaseLeaseInDatabase } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
//#region src/state/openclaw-agent-execution-cleanup.worker.ts
function executeAgentDatabaseCleanupCommand(command, database, env) {
	runOpenClawStateWriteTransaction((current) => {
		if (current.path !== command.input.sharedStatePath || requireOpenClawStateDatabaseIdentity(current).key !== command.input.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
		releaseExitedOpenClawAgentDatabaseLeaseInDatabase(current.db, command.input, () => requestSqliteWorkerOperationAdmission({
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
