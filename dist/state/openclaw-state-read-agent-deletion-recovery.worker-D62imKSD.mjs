import "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { i as readAgentDeletionJournalInDatabase, l as readAgentDeletionRecoveryHolds, n as listPendingAgentDeletionJournalsInDatabase } from "./openclaw-state-read-agent-deletion-journal-kOb8UH8S.mjs";
//#region src/state/agent-deletion-recovery.worker.ts
const agentRecoveryReadOperations = {
	"agentRecovery.holds": (input, db) => ({
		type: "agentRecovery.holds",
		held: readAgentDeletionRecoveryHolds({
			db,
			path: input.statePath
		})
	}),
	"agentRecovery.pendingDeletions": (_input, db) => ({
		type: "agentRecovery.pendingDeletions",
		...listPendingAgentDeletionJournalsInDatabase({ db })
	}),
	"agentRecovery.creationJournal": (input, db) => ({
		type: "agentRecovery.creationJournal",
		journal: readAgentDeletionJournalInDatabase({ db }, input.agentId, "runtime")
	})
};
//#endregion
export { agentRecoveryReadOperations };
