import { t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-CKTkTTKa.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { n as prepareSessionAgentPurgeInDatabase, t as commitSessionAgentPurgeInDatabase } from "./session-agent-purge.kernel-ryET9A-g.mjs";
import { i as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { r as runSessionNativeBindingTransaction } from "./session-native-binding.worker-D8nGE-b2.mjs";
//#region src/config/sessions/session-agent-purge.worker.ts
function prepareSessionAgentPurge(input, { open }) {
	return prepareSessionAgentPurgeInDatabase(open(), input);
}
function commitSessionAgentPurge(input, context) {
	const mutate = (database, wrapReceipt) => {
		const result = commitSessionAgentPurgeInDatabase(database, input, (current) => applySessionEntryMaintenanceInDatabase(current, input.maintenance, () => {
			if (!input.maintenance.preservation) throw new Error("Agent purge omitted its maintenance protection");
			return input.maintenance.preservation;
		}));
		const candidate = {
			kind: "session-agent-purge",
			result,
			publication: prepareSessionEntryReplacementPublication({
				previous: new Map(input.entryRemovals.flatMap(({ sessionKey, expectedEntry }) => expectedEntry ? [[sessionKey, expectedEntry]] : [])),
				current: /* @__PURE__ */ new Map(),
				pendingArchiveRecovery: true,
				membershipInvalidatedKeys: input.entryRemovals.map(({ sessionKey }) => sessionKey),
				maintenancePlans: result.maintenancePlans
			}, database)
		};
		return transferSessionEntryWorkerCandidate(database, context.admit, candidate, wrapReceipt);
	};
	return input.nativeBindings ? runSessionNativeBindingTransaction(input.nativeBindings, context, "session.entry.purge-deleted-agent", "Agent session purge", mutate) : context.writeTransaction("session.entry.purge-deleted-agent", "Agent session purge", (database) => mutate(database, (receipt) => receipt));
}
//#endregion
export { commitSessionAgentPurge, prepareSessionAgentPurge };
