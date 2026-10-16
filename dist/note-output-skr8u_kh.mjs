import { AsyncLocalStorage } from "node:async_hooks";
//#region packages/terminal-core/src/note-output.ts
const noteOutputStorage = new AsyncLocalStorage();
/** The invocation's output-mode owner chooses where notes render for work in callback. */
function withNoteOutput(resolveOutput, callback) {
	return noteOutputStorage.run(resolveOutput, callback);
}
function resolveNoteOutput() {
	return noteOutputStorage.getStore()?.() ?? process.stdout;
}
//#endregion
export { withNoteOutput as n, resolveNoteOutput as t };
