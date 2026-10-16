import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
//#region src/sessions/session-run-error-presentation.ts
const STATE_CONTENTION_SUMMARY = "Your request was interrupted while the server was busy. Check its status before trying again.";
const STATE_CONTENTION_DIAGNOSTIC = "SQLite transaction admission remained busy. Execution may have occurred; check the recorded outcome before resending.";
/** Presentation is not replay authority. Only the direct typed failure is classified. */
function resolveStateContentionPresentation(error) {
	return isSqliteLockError(error) ? {
		errorKind: "state_contention",
		errorMessage: `${STATE_CONTENTION_SUMMARY}\n\n${STATE_CONTENTION_DIAGNOSTIC}`
	} : void 0;
}
//#endregion
export { STATE_CONTENTION_SUMMARY as n, resolveStateContentionPresentation as r, STATE_CONTENTION_DIAGNOSTIC as t };
