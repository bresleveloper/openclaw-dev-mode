import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { n as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-CTqVQ1k1.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/provider-review-store.worker.ts
function compareSessionProviderReviewInWorker(database, options, input, admit) {
	return runOpenClawAgentWriteTransaction((current) => {
		if (current.db !== database.db) throw new Error("Provider review lost its canonical database owner");
		admit("transaction");
		const entry = readExactSessionEntryRow(current, input.sessionKey)?.entry;
		if (!entry || entry.sessionId !== input.sessionId || entry.lifecycleRevision !== input.lifecycleRevision || !isDeepStrictEqual(entry.providerReview, input.expectedReview) || input.nextReview && input.nextReview.sessionId !== input.sessionId) throw new Error("Provider review changed; refresh the findings before continuing");
		const next = {
			...entry,
			providerReview: input.nextReview
		};
		const updated = writeSessionEntry(current, input.sessionKey, next, {
			canonicalPreviousEntry: entry,
			providerReviewMutation: true
		});
		const publication = prepareSessionEntryReplacementPublication({
			pendingArchiveRecovery: false,
			previous: /* @__PURE__ */ new Map([[input.sessionKey, entry]]),
			current: /* @__PURE__ */ new Map([[input.sessionKey, updated]]),
			maintenancePlans: [],
			membershipInvalidatedKeys: []
		}, current);
		deferSqliteWorkerCommitReceipt(current.db, publication);
		admit("commit", publication);
		return {
			entry: updated,
			publication
		};
	}, options, { operationLabel: "session.provider-review.compare" });
}
//#endregion
export { compareSessionProviderReviewInWorker };
