import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { h as releaseExitedOpenClawAgentDatabaseLeaseInDatabase } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
//#region src/state/openclaw-agent-execution-cleanup.worker.ts
function executeAgentDatabaseCleanupCommand(command, database, env) {
	runOpenClawStateWriteTransaction((current) => {
		if (current.path !== command.input.sharedStatePath || requireOpenClawStateDatabaseIdentity(current).key !== command.input.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
		releaseExitedOpenClawAgentDatabaseLeaseInDatabase(current.db, command.input);
	}, {
		database,
		path: database.path,
		env
	});
}
//#endregion
export { executeAgentDatabaseCleanupCommand };
