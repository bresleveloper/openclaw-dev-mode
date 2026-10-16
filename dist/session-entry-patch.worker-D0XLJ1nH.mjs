import { n as createSqliteWorkerTransferOwner } from "./sqlite-worker-transfer-e5ST79iV.mjs";
import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { a as readLifecycleTargetSnapshot, o as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { t as applySessionEntryPatchInDatabase } from "./session-accessor.sqlite-entry-mutation-9KRjV8tB.mjs";
import { t as sessionEntryPatchPredicateMatches } from "./session-entry-patch-guard-BZPEExfr.mjs";
import { n as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-CTqVQ1k1.mjs";
//#region src/config/sessions/session-entry-patch.worker.ts
function readSessionEntryPatchSnapshot(database, selection) {
	return selection.kind === "target" ? readLifecycleTargetSnapshot(database, selection.target) : readSessionEntrySelectionSnapshot(database, selection.sessionKey, selection.exact);
}
function commitSessionEntryPatch(input, { writeTransaction, admit }) {
	return writeTransaction(input.operationLabel, "Session patch", (database) => {
		let result;
		if (!sessionEntryPatchPredicateMatches(database, input.sessionKey, input.shouldCommitIf)) result = {
			kind: "session-entry-patch",
			entry: null
		};
		else {
			const mutation = applySessionEntryPatchInDatabase(database, {
				...input,
				readSnapshot: (current) => readSessionEntryPatchSnapshot(current, input.selection),
				options: {
					consumePendingReset: input.consumePendingReset,
					providerReviewMutation: input.providerReviewMutation,
					assertCommitAllowed: () => admit("transaction", { kind: "session-entry-patch-validated" })
				}
			});
			const publication = mutation.identity ? prepareSessionEntryReplacementPublication({
				...mutation.identity,
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: [],
				maintenancePlans: []
			}, database) : void 0;
			result = {
				kind: "session-entry-patch",
				entry: mutation.entry,
				publication
			};
		}
		return transferSessionEntryWorkerCandidate(database, admit, result);
	});
}
function transferSessionEntryWorkerCandidate(database, admit, result, wrapReceipt) {
	const transfer = createSqliteWorkerTransferOwner();
	const handle = transfer.start([{
		kind: "patch",
		value: result
	}].values(), { kinds: ["patch"] });
	try {
		admit("transaction", {
			kind: "session-entry-patch-transfer",
			handle
		});
		for (;;) {
			const frame = transfer.next(handle.id);
			admit("transaction", {
				kind: "session-entry-patch-frame",
				frame
			});
			if (frame.done) break;
		}
		const receipt = {
			kind: "session-entry-patch-committed",
			transferId: handle.id
		};
		const publication = wrapReceipt ? wrapReceipt(receipt) : receipt;
		deferSqliteWorkerCommitReceipt(database.db, publication);
		admit("commit", publication);
		return publication;
	} finally {
		transfer.cancel();
	}
}
//#endregion
export { readSessionEntryPatchSnapshot as n, transferSessionEntryWorkerCandidate as r, commitSessionEntryPatch as t };
