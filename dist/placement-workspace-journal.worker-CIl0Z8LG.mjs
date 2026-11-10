import { n as createPlacementWorkspaceJournalOps } from "./placement-workspace-journal-LUopYVRV.mjs";
//#region src/gateway/worker-environments/placement-workspace-journal.worker.ts
function operation(type, execute, now = Date.now) {
	return (input, { writeAdmitted }) => writeAdmitted(({ db }) => {
		return {
			type,
			...execute(createPlacementWorkspaceJournalOps({
				now: () => now(input),
				write: (write) => write(db)
			}), input)
		};
	}, {
		operationLabel: type,
		receipt: "result",
		transactionEnvironment: "process"
	});
}
const workspaceJournalOperations = {
	"placementJournals.begin": operation("placementJournals.begin", (journal, input) => journal.beginWorkspaceReconciliation(input.owner, input.journal), (input) => input.nowMs ?? Date.now()),
	"placementJournals.abort": operation("placementJournals.abort", (journal, input) => journal.abortWorkspaceReconciliation(input.owner, { force: input.force })),
	"placementJournals.prune": operation("placementJournals.prune", (journal, _input) => journal.pruneOrphanedWorkspaceReconciliations())
};
//#endregion
export { workspaceJournalOperations };
