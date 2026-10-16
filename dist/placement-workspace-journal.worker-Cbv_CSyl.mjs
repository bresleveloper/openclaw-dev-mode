import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as createPlacementWorkspaceJournalOps } from "./placement-workspace-journal-DhEkGjMG.mjs";
//#region src/gateway/worker-environments/placement-workspace-journal.worker.ts
function operation(type, execute, now = Date.now) {
	return (input, { open }) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const receipt = {
			type,
			...execute(createPlacementWorkspaceJournalOps({
				now: () => now(input),
				write: (write) => write(db)
			}), input)
		};
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: receipt
		});
		deferSqliteWorkerCommitReceipt(db, receipt);
		return receipt;
	}, { database: open() }, { operationLabel: type });
}
const workspaceJournalOperations = {
	"placementJournals.begin": operation("placementJournals.begin", (journal, input) => journal.beginWorkspaceReconciliation(input.owner, input.journal), (input) => input.nowMs ?? Date.now()),
	"placementJournals.abort": operation("placementJournals.abort", (journal, input) => journal.abortWorkspaceReconciliation(input.owner, { force: input.force })),
	"placementJournals.prune": operation("placementJournals.prune", (journal, _input) => journal.pruneOrphanedWorkspaceReconciliations())
};
//#endregion
export { workspaceJournalOperations };
