import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as worktreeRegistryPublication, r as withWorktreeRegistryWorkerReceipt } from "./registry-publication-BJype9QG.mjs";
import { a as getRegistryWorktreeProvisionedPathsInDatabase, c as listRegistryWorktreesInDatabase, i as getRegistryWorktreeProvisionedChunkInDatabase, l as rowToRecord, n as findLiveRegistryWorktreeByPathInDatabase, o as getRegistryWorktreeProvisionedStateInDatabase, r as getRegistryWorktreeInDatabase, s as listLiveRegistryWorktreeIdsInDatabase, t as findLiveRegistryWorktreeByOwnerInDatabase, u as worktreeGcRevision } from "./registry-read.kernel-D89C5gDY.mjs";
import { a as finalizeWorktreeRemovalInDatabase, c as updateRegistryWorktreeInDatabase, d as readWorktreeSlotCountInDatabase, f as releasePendingWorktreeInDatabase, g as reapWorktreeRunLeasesInDatabase, i as deleteRegistryWorktreeInDatabase, l as worktreeRunEndMutation, n as assertWorktreeRegistryPredicates, o as insertRegistryWorktreeInDatabase, p as reservePendingWorktreeInDatabase, r as claimWorktreeRemovalInDatabase, t as abortWorktreeRemovalInDatabase, u as readPendingWorktreesInDatabase } from "./registry-run-end.worker-DYWsmg23.mjs";
import { n as releaseWorktreeRunLeaseInDatabase, t as admitWorktreeRunLeaseInDatabase } from "./run-lease-store.kernel-VlY5KQA0.mjs";
import { t as hasLocalWorkspaceProjectionInDatabase } from "./local-workspace-store.kernel-yWsEWGDM.mjs";
//#region src/agents/worktrees/provisioned-snapshot.worker.ts
function writeProvisionedSnapshotInDatabase(db, input) {
	const kysely = getNodeSqliteKysely(db);
	if (input.kind === "reset") executeSqliteQuerySync(db, kysely.deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", input.worktreeId));
	else executeSqliteQuerySync(db, kysely.insertInto("worktree_provisioned_file_chunks").values({
		worktree_id: input.worktreeId,
		path: input.path,
		chunk_index: input.chunkIndex,
		data: input.data
	}));
}
//#endregion
//#region src/agents/worktrees/registry-retirement.worker.ts
function deferWorktreeCleanupInWorker({ observed, reason, retry, removalToken }, options) {
	return runOpenClawStateWriteTransaction(({ db }) => withWorktreeRegistryWorkerReceipt(db, () => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		if (removalToken) assertWorktreeRegistryPredicates(db, [{
			kind: "removal-claim",
			id: observed.id,
			token: removalToken
		}]);
		const current = getRegistryWorktreeInDatabase(db, observed.id);
		const revision = worktreeGcRevision(observed);
		if (!current || current.removedAt !== void 0 || worktreeGcRevision(current) !== revision) return false;
		const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worktrees").set({ gc_protection_json: reason === null ? null : JSON.stringify({
			revision,
			reason,
			retry
		}) }).where("id", "=", observed.id).returningAll()).rows;
		worktreeRegistryPublication.rows(db, rows);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return true;
	}), options, { operationLabel: "worktrees.deferCleanup" });
}
function retireMissingWorktreeInWorker({ observed, removedAt }, options) {
	return runOpenClawStateWriteTransaction(({ db }) => withWorktreeRegistryWorkerReceipt(db, () => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		if (hasLocalWorkspaceProjectionInDatabase(db, observed.id)) return {
			record: getRegistryWorktreeInDatabase(db, observed.id),
			protection: "local-workspace-projection"
		};
		const retired = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worktrees").set({ removed_at: removedAt }).where("id", "=", observed.id).where("removed_at", "is", null).where((eb) => eb.or([eb("snapshot_ref", "is", null), eb("snapshot_ref", "not like", "refs/openclaw/snapshots/exact-%")])).where("path", "=", observed.path).where("last_active_at", "=", observed.lastActiveAt).where("repo_root", "=", observed.repoRoot).where("repo_fingerprint", "=", observed.repoFingerprint).returningAll()).rows[0];
		worktreeRegistryPublication.rows(db, retired ? [retired] : []);
		const record = retired ? rowToRecord(retired) : getRegistryWorktreeInDatabase(db, observed.id);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return { record };
	}), options, { operationLabel: "worktrees.retireMissing" });
}
//#endregion
//#region src/agents/worktrees/dispatch.worker.ts
const worktreeOperations = {
	"worktrees.assertPredicates": ({ predicates }, { open }) => assertWorktreeRegistryPredicates(open().db, predicates),
	"worktrees.delete": worktreeRunEndMutation("worktrees.delete", deleteRegistryWorktreeInDatabase),
	"worktrees.slotCount": (_input, { open }) => readWorktreeSlotCountInDatabase(open().db),
	"worktrees.pendingSlots": (_input, { open }) => readPendingWorktreesInDatabase(open().db),
	"worktrees.reservePending": worktreeRunEndMutation("worktrees.reservePending", reservePendingWorktreeInDatabase),
	"worktrees.releasePending": worktreeRunEndMutation("worktrees.releasePending", releasePendingWorktreeInDatabase),
	"worktrees.insert": worktreeRunEndMutation("worktrees.insert", insertRegistryWorktreeInDatabase),
	"worktrees.update": worktreeRunEndMutation("worktrees.update", updateRegistryWorktreeInDatabase),
	"worktrees.claimRemoval": worktreeRunEndMutation("worktrees.claimRemoval", claimWorktreeRemovalInDatabase),
	"worktrees.finalizeRemoval": worktreeRunEndMutation("worktrees.finalizeRemoval", finalizeWorktreeRemovalInDatabase),
	"worktrees.abortRemoval": worktreeRunEndMutation("worktrees.abortRemoval", abortWorktreeRemovalInDatabase),
	"worktrees.findLiveByOwner": ({ ownerKind, ownerId }, { open }) => findLiveRegistryWorktreeByOwnerInDatabase(open().db, ownerKind, ownerId),
	"worktrees.get": ({ id }, { open }) => getRegistryWorktreeInDatabase(open().db, id),
	"worktrees.sessionBinding": ({ boundId, ownerId }, { open }) => {
		const { db } = open();
		const bound = boundId ? getRegistryWorktreeInDatabase(db, boundId) : void 0;
		if (bound && bound.removedAt === void 0) return bound;
		return findLiveRegistryWorktreeByOwnerInDatabase(db, "session", ownerId);
	},
	"worktrees.findLiveByPath": ({ path }, { open }) => findLiveRegistryWorktreeByPathInDatabase(open().db, path),
	"worktrees.list": (input, { open }) => listRegistryWorktreesInDatabase(open().db, input),
	"worktrees.liveIds": (_input, { open }) => listLiveRegistryWorktreeIdsInDatabase(open().db),
	"worktrees.provisionedPaths": ({ id }, { open }) => getRegistryWorktreeProvisionedPathsInDatabase(open().db, id),
	"worktrees.provisionedState": ({ id }, { open }) => getRegistryWorktreeProvisionedStateInDatabase(open().db, id),
	"worktrees.provisionedChunk": (input, { open }) => getRegistryWorktreeProvisionedChunkInDatabase(open().db, input),
	"worktrees.writeProvisionedSnapshot": worktreeRunEndMutation("worktrees.writeProvisionedSnapshot", writeProvisionedSnapshotInDatabase),
	"worktrees.retireMissing": (input, { open, stateOptions }) => retireMissingWorktreeInWorker(input, {
		...stateOptions(),
		database: open()
	}),
	"worktrees.deferCleanup": (input, { open, stateOptions }) => deferWorktreeCleanupInWorker(input, {
		...stateOptions(),
		database: open()
	}),
	"worktrees.admitRunLease": (input, { writeAdmitted }) => writeAdmitted(({ db }) => withWorktreeRegistryWorkerReceipt(db, () => admitWorktreeRunLeaseInDatabase(db, input)), { operationLabel: "worktrees.admitRunLease" }),
	"worktrees.releaseRunLease": ({ worktreeId, token }, { writeAdmitted }) => writeAdmitted(({ db }) => withWorktreeRegistryWorkerReceipt(db, () => releaseWorktreeRunLeaseInDatabase(db, worktreeId, token)), { operationLabel: "worktrees.releaseRunLease" }),
	"worktrees.reapRunLeases": ({ scopes }, { writeAdmitted }) => writeAdmitted(({ db }) => withWorktreeRegistryWorkerReceipt(db, () => reapWorktreeRunLeasesInDatabase(db, scopes)), { operationLabel: "worktrees.reapRunLeases" })
};
//#endregion
export { worktreeOperations };
