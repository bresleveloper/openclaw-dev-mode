import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { f as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
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
		admit("commit");
		return updated;
	}, options);
}
//#endregion
export { compareSessionProviderReviewInWorker };
