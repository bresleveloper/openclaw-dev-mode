import { n as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-mI3FEuTy.mjs";
import { t as applySessionResetInDatabase } from "./session-reset.kernel-Z6zcgB3b.mjs";
import { r as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CNfHtLgK.mjs";
//#region src/config/sessions/session-reset.worker.ts
function commitSessionReset(input, { writeTransaction, admit }) {
	return writeTransaction("session.lifecycle.reset", "Session reset", (database) => {
		let projectionNeedsReconcile = false;
		const { current, written, progressCardReset } = applySessionResetInDatabase(database, input, {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		});
		const candidate = {
			kind: "session-reset",
			mutation: {
				nextEntry: input.nextEntry,
				...current ? { previousEntry: current.entry } : {},
				...current?.entry.sessionId ? { previousSessionId: current.entry.sessionId } : {}
			},
			previousSessionKeys: input.prepared.map((row) => row.sessionKey),
			progressCardReset,
			projectionNeedsReconcile,
			publication: prepareSessionEntryReplacementPublication({
				previous: new Map(input.prepared.map((row) => [row.sessionKey, row.entry])),
				current: /* @__PURE__ */ new Map([[input.target.canonicalKey, written]]),
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: current?.entry.sessionId !== written.sessionId ? [input.target.canonicalKey] : [],
				maintenancePlans: []
			}, database)
		};
		return transferSessionEntryWorkerCandidate(database, admit, candidate);
	});
}
//#endregion
export { commitSessionReset };
