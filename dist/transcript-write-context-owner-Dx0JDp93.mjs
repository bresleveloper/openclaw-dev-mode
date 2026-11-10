import { a as runWithCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/transcript-write-context-owner.ts
const ownedTranscriptWriteContext = new AsyncLocalStorage();
/** Runs detached work without retaining an attempt-owned transcript context. */
function runWithoutOwnedSessionTranscriptWrites(run) {
	return ownedTranscriptWriteContext.exit(() => runWithCliHistoryWriter(void 0, run));
}
//#endregion
export { runWithoutOwnedSessionTranscriptWrites as n, ownedTranscriptWriteContext as t };
