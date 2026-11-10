import { m as buildRestartRecoveryClaimCleanupPatch, v as hasMainSessionRecoveryClaim } from "./store-maintenance-BqMt1Twc.mjs";
//#region src/config/sessions/terminal-status.ts
/** Returns true for terminal statuses that a later visible turn may recover in place. */
function isRecoverableTerminalSessionStatus(status) {
	return status === "failed" || status === "timeout" || status === "killed";
}
/** Clears stale terminal lifecycle fields before reusing a recoverable session entry. */
function recoverTerminalSessionEntryForVisibleTurn(entry) {
	if (entry.restartRecoveryHarnessCompletion || entry.abortedLastRun === true && hasMainSessionRecoveryClaim(entry)) return {
		...entry,
		abortedLastRun: true
	};
	return {
		...entry,
		...buildRestartRecoveryClaimCleanupPatch({
			entry,
			recordTerminalSource: false
		}),
		status: void 0,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		lastRunError: void 0,
		abortedLastRun: void 0
	};
}
//#endregion
export { recoverTerminalSessionEntryForVisibleTurn as n, isRecoverableTerminalSessionStatus as t };
