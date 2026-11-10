import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { g as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as writeSessionEntryPatchInDatabase } from "./session-accessor.sqlite-entry-mutation-DzzqdA6S.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-DisS3yfP.mjs";
//#region src/acp/runtime/session-meta-entry.worker.ts
/** Finite ACP field changes use the canonical entry kernel and its commit publication. */
function mutateAcpSessionEntryInWorker(opened, options, input, admit, ownReceipt = true) {
	assertCanonicalSessionKeyWrite(input.sessionKey, input.agentId);
	return runOpenClawAgentWriteTransaction((database) => {
		if (database.db !== opened.db) throw new Error("ACP entry mutation lost its canonical database owner");
		admit("transaction");
		const prepared = readSessionEntrySelectionSnapshot(database, input.sessionKey, true, true);
		const existing = prepared[0]?.entry;
		assertAcpSessionMutationEntry(existing, input.expectedEntry, input.expectedControlBinding, "entry mutation");
		const mutation = input.mutation;
		const base = existing ?? (mutation.kind === "touch" ? mutation.fallbackEntry : void 0);
		if (!base) {
			const result = { entry: null };
			if (ownReceipt) deferSqliteWorkerCommitReceipt(database.db, {
				kind: "acp-entry-mutation",
				result
			});
			admit("commit");
			return result;
		}
		const next = mutation.kind === "touch" ? mergeSessionEntry(base, { updatedAt: mutation.updatedAt }) : structuredClone(base);
		delete next.acp;
		const changed = writeSessionEntryPatchInDatabase(database, {
			fresh: prepared,
			sessionKey: input.sessionKey,
			writeBase: base,
			next,
			options: {}
		});
		const publication = changed.identity ? prepareSessionEntryReplacementPublication({
			pendingArchiveRecovery: false,
			previous: changed.identity.previous,
			current: changed.identity.current,
			maintenancePlans: [],
			membershipInvalidatedKeys: []
		}, database, { postimages: changed.postimages }) : void 0;
		const result = {
			entry: changed.entry,
			...publication ? { publication } : {}
		};
		if (ownReceipt) deferSqliteWorkerCommitReceipt(database.db, {
			kind: "acp-entry-mutation",
			result
		});
		admit("commit", publication);
		return result;
	}, options, { operationLabel: "session-entry.acp" });
}
//#endregion
export { mutateAcpSessionEntryInWorker };
