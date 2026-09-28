//#region src/config/sessions/terminal-status.ts
/** Returns true for terminal statuses that a later visible turn may recover in place. */
function isRecoverableTerminalSessionStatus(status) {
	return status === "failed" || status === "timeout" || status === "killed";
}
/** Clears stale terminal lifecycle fields before reusing a recoverable session entry. */
function recoverTerminalSessionEntryForVisibleTurn(entry) {
	return {
		...entry,
		status: void 0,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		lastRunError: void 0,
		abortedLastRun: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryDeliveryContext: void 0,
		restartRecoveryDeliveryMediaUrls: void 0,
		restartRecoveryDisableMessageTool: void 0,
		restartRecoverySuppressTextDelivery: void 0,
		restartRecoveryDeliveryRequestFingerprint: void 0,
		restartRecoveryDeliveryRunId: void 0,
		restartRecoveryDeliverySourceRunId: void 0,
		restartRecoverySourceReplyDeliveryMode: void 0
	};
}
//#endregion
export { recoverTerminalSessionEntryForVisibleTurn as n, isRecoverableTerminalSessionStatus as t };
