import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { s as reclaimSqliteSessionInTransaction, u as prepareSessionDeletionInDatabase } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { n as collectReclamationDeletionEntries, t as collectReclamationChangedSessionKeys } from "./session-accessor.sqlite-reclamation-publication-Cd995rIj.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { i as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { r as runSessionNativeBindingTransaction } from "./session-native-binding.worker-D8nGE-b2.mjs";
//#region src/config/sessions/session-entry-deletion.worker.ts
function planSessionDeletionInAgentWorker(planning, { open }) {
	const database = open();
	return runSqliteReadSnapshotSync(database.db, () => prepareSessionDeletionInDatabase(database, planning));
}
function deleteSessionEntryInAgentWorker(input, context) {
	const plan = {
		...input.plan,
		databaseOptions: {
			...input.plan.databaseOptions,
			...context.options
		}
	};
	const mutate = (database, wrapReceipt) => {
		const result = reclaimSqliteSessionInTransaction(plan);
		if (result.kind !== "entry") throw new Error("Session entry deletion returned another reclamation operation");
		const changedKeys = result.value.deleted ? collectReclamationChangedSessionKeys(plan, result) : [];
		const removedEntries = collectReclamationDeletionEntries(plan, result);
		const candidate = {
			kind: "session-entry-deletion",
			result,
			publication: changedKeys.length > 0 ? prepareSessionEntryReplacementPublication({
				previous: new Map(removedEntries.map(({ sessionKey, entry }) => [sessionKey, entry])),
				current: /* @__PURE__ */ new Map(),
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: changedKeys,
				maintenancePlans: []
			}, database) : void 0
		};
		return transferSessionEntryWorkerCandidate(database, context.admit, candidate, wrapReceipt);
	};
	return input.nativeBindings ? runSessionNativeBindingTransaction(input.nativeBindings, context, "session.lifecycle.delete", "Session entry deletion", mutate) : context.writeTransaction("session.lifecycle.delete", "Session entry deletion", (database) => mutate(database, (receipt) => receipt));
}
//#endregion
export { deleteSessionEntryInAgentWorker, planSessionDeletionInAgentWorker };
