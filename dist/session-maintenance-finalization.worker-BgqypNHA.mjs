import { t as finalizeSessionMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-transaction-CT9KsRGP.mjs";
import { n as collectReclamationDeletionEntries, t as collectReclamationChangedSessionKeys } from "./session-accessor.sqlite-reclamation-publication-Cd995rIj.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { i as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { r as runSessionNativeBindingTransaction } from "./session-native-binding.worker-D8nGE-b2.mjs";
//#region src/config/sessions/session-maintenance-finalization.worker.ts
function finalizeSessionMaintenance(input, context) {
	const plan = {
		...input.plan,
		databaseOptions: {
			...input.plan.databaseOptions,
			...context.options
		}
	};
	const mutate = (database, wrapReceipt) => {
		const result = finalizeSessionMaintenanceInDatabase(database, plan);
		const changedKeys = collectReclamationChangedSessionKeys(plan, result);
		const removedEntries = collectReclamationDeletionEntries(plan, result);
		const candidate = {
			kind: "session-maintenance-finalize",
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
	return input.nativeBindings ? runSessionNativeBindingTransaction(input.nativeBindings, context, "session.maintenance.finalize", "Session maintenance", mutate) : context.writeTransaction("session.maintenance.finalize", "Session maintenance", (database) => mutate(database, (receipt) => receipt));
}
//#endregion
export { finalizeSessionMaintenance };
