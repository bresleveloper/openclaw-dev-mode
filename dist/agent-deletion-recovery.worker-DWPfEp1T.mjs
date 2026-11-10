import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { b as resolveAgentDeletionRecoveryHolds } from "./agent-deletion-journal-DpYVtbBb.mjs";
import "./agent-deletion-journal-recovery.kernel-BaXrQW7-.mjs";
//#region src/state/agent-deletion-recovery.worker.ts
const agentRecoveryOperations = { "agentRecovery.resolveHolds": (input, context) => context.write((database) => {
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: void 0
	});
	const resolved = resolveAgentDeletionRecoveryHolds(database, input.predicate.agentId, input.paths, input.predicate);
	requestSqliteWorkerOperationAdmission({
		stage: "commit",
		facts: void 0
	});
	return resolved;
}, { operationLabel: "agent.recovery.resolve" }) };
//#endregion
export { agentRecoveryOperations };
