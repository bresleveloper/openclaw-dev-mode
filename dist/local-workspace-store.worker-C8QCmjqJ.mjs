import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as assertWorktreeRegistryPredicates } from "./registry-run-end.worker-DYWsmg23.mjs";
import { r as assertOpenClawStateLeasesWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { t as localWorkspacePublication } from "./local-workspace-publication-vsEiBxXq.mjs";
import { n as mutateLocalWorkspaceProjection } from "./local-workspace-store.kernel-yWsEWGDM.mjs";
//#region src/gateway/worker-environments/local-workspace-store.worker.ts
const localWorkspaceOperations = { "localWorkspace.mutate": (input, { open }) => {
	if (!input.leases.some((lease) => lease.scope === "workspace.local-reconciliation" && lease.key === input.id)) throw new Error("Local workspace mutation requires reconciliation custody");
	return runOpenClawStateWriteTransaction(({ db }) => {
		const { result: row, receipt } = localWorkspacePublication.capture(db, () => mutateLocalWorkspaceProjection(db, input.id, input.mutation));
		assertOpenClawStateLeasesWorkerOwnedInTransaction(db, input.leases, "commit");
		assertWorktreeRegistryPredicates(db, input.predicates);
		deferSqliteWorkerCommitReceipt(db, {
			operationId: input.receipt,
			receipt: localWorkspacePublication.bound(receipt)
		});
		return row;
	}, { database: open() });
} };
//#endregion
export { localWorkspaceOperations };
