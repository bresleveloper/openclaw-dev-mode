import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-D1TSJMmX.mjs";
import { o as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { t as applySessionEntryPatchInDatabase } from "./session-accessor.sqlite-entry-mutation-CUpzFtYy.mjs";
import { r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import { n as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-mI3FEuTy.mjs";
import { t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-Cn1WSw9n.mjs";
//#region src/acp/runtime/session-meta-entry.worker.ts
/** Finite ACP field changes use the canonical entry kernel and its commit publication. */
function mutateAcpSessionEntryInWorker(opened, options, input, admit) {
	assertCanonicalSessionKeyWrite(input.sessionKey, input.agentId);
	return runOpenClawAgentWriteTransaction((database) => {
		if (database.db !== opened.db) throw new Error("ACP entry mutation lost its canonical database owner");
		admit("transaction");
		const prepared = readSessionEntrySelectionSnapshot(database, input.sessionKey, true);
		const existing = prepared[0]?.entry;
		assertAcpSessionMutationEntry(existing, input.expectedEntry, input.expectedControlBinding, "entry mutation");
		const mutation = input.mutation;
		const base = existing ?? (mutation.kind === "touch" ? mutation.fallbackEntry : void 0);
		if (!base) {
			const result = { entry: null };
			deferSqliteWorkerCommitReceipt(database.db, {
				kind: "acp-entry-mutation",
				result
			});
			admit("commit");
			return result;
		}
		const next = mutation.kind === "touch" ? mergeSessionEntry(base, { updatedAt: mutation.updatedAt }) : structuredClone(base);
		delete next.acp;
		const changed = applySessionEntryPatchInDatabase(database, {
			operationLabel: "session-entry.patch",
			validateCanonicalKeys: false,
			readSnapshot: (current) => readSessionEntrySelectionSnapshot(current, input.sessionKey, true),
			prepared,
			sessionKey: input.sessionKey,
			writeBase: base,
			next: mutation.kind === "clear-legacy" && !base.acp ? void 0 : next,
			options: {}
		});
		const publication = changed.identity ? prepareSessionEntryReplacementPublication({
			pendingArchiveRecovery: false,
			previous: changed.identity.previous,
			current: changed.identity.current,
			maintenancePlans: [],
			membershipInvalidatedKeys: []
		}, database) : void 0;
		const result = {
			entry: changed.entry,
			...publication ? { publication } : {}
		};
		deferSqliteWorkerCommitReceipt(database.db, {
			kind: "acp-entry-mutation",
			result
		});
		admit("commit", publication);
		return result;
	}, options, { operationLabel: "session-entry.acp" });
}
//#endregion
export { mutateAcpSessionEntryInWorker };
