import { n as assertDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as unregisterOpenClawAgentDatabase } from "./openclaw-agent-db-registry-DuEPPF6m.mjs";
//#region src/state/openclaw-agent-db-registry.worker.ts
const agentDatabaseRegistryOperations = { "agentDatabaseRegistry.remove": (input, { stateOptions }) => {
	const options = stateOptions();
	return runOpenClawStateWriteTransaction((database) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		assertDatabasePathIdentity(input.agentPath, input.identity);
		unregisterOpenClawAgentDatabase({
			agentId: input.agentId,
			path: input.agentPath,
			env: options.env
		});
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		const receipt = {
			agentId: input.agentId,
			agentPath: input.agentPath,
			stateDatabasePath: database.path,
			stateDatabaseIdentity: requireOpenClawStateDatabaseIdentity(database).key
		};
		deferSqliteWorkerCommitReceipt(database.db, receipt);
		return receipt;
	}, options);
} };
//#endregion
export { agentDatabaseRegistryOperations };
