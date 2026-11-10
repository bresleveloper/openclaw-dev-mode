import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as requestSessionEntryCurrentAdmission } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { n as repositoryWorkspacePublication } from "./session-repository-workspaces.receipts-CKIZXgWP.mjs";
import { a as findSessionRepositoryWorkspaceInDatabase, i as deleteSessionRepositoryWorkspaceInDatabase, n as bindSessionRepositoryWorkspaceBaseInDatabase, o as readSessionRepositoryWorkspaceInDatabase, r as createSessionRepositoryWorkspaceInDatabase, t as acceptSessionRepositoryWorkspaceCheckpointInDatabase } from "./session-repository-workspaces.kernel-C8Kf32oF.mjs";
//#region src/state/session-repository-workspaces.worker.ts
const repositoryWorkspaceOperations = {
	"repositoryWorkspaces.get": (input, { open }) => readSessionRepositoryWorkspaceInDatabase(open().db, input.workspaceId),
	"repositoryWorkspaces.find": (input, { open }) => findSessionRepositoryWorkspaceInDatabase(open().db, input),
	"repositoryWorkspaces.create": (input, { open }) => mutate(open(), "repositoryWorkspaces.create", (db) => createSessionRepositoryWorkspaceInDatabase(db, input, input.nowMs ?? Date.now())),
	"repositoryWorkspaces.bindBase": (input, { open }) => mutate(open(), "repositoryWorkspaces.bindBase", (db) => bindSessionRepositoryWorkspaceBaseInDatabase(db, input, input.nowMs ?? Date.now())),
	"repositoryWorkspaces.acceptCheckpoint": (input, { open }) => mutate(open(), "repositoryWorkspaces.acceptCheckpoint", (db) => acceptSessionRepositoryWorkspaceCheckpointInDatabase(db, input, input.nowMs ?? Date.now())),
	"repositoryWorkspaces.delete": (input, { open }) => mutate(open(), "repositoryWorkspaces.delete", (db) => deleteSessionRepositoryWorkspaceInDatabase(db, input.workspaceId), input.sessionEntryCurrentSource)
};
function mutate(database, operationLabel, operation, sessionEntryCurrentSource) {
	const admit = (stage, facts) => requestSessionEntryCurrentAdmission(sessionEntryCurrentSource, {
		stage,
		facts
	}, { lookup: "logical" });
	return runOpenClawStateWriteTransaction(({ db }) => {
		admit("transaction", void 0);
		const { result, receipt } = repositoryWorkspacePublication.capture(db, () => operation(db));
		admit("commit", result);
		deferSqliteWorkerCommitReceipt(db, {
			result,
			receipt: repositoryWorkspacePublication.bound(receipt)
		});
		return result;
	}, { database }, { operationLabel });
}
//#endregion
export { repositoryWorkspaceOperations };
