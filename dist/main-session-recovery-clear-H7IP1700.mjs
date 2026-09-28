//#region src/agents/main-session-recovery/main-session-recovery-clear.ts
const MAIN_SESSION_RECOVERY_CLEAR_PATCH = {
	abortedLastRun: false,
	restartRecoveryRuns: void 0,
	mainRestartRecovery: void 0
};
function buildMainSessionRecoveryClearPatch(entry) {
	if (entry?.abortedLastRun !== true && entry?.restartRecoveryRuns === void 0 && entry?.mainRestartRecovery === void 0) return {};
	return MAIN_SESSION_RECOVERY_CLEAR_PATCH;
}
function clearMainSessionRecoveryAfterAgentRun(entry, clearForceSafeTools) {
	const aborted = entry.abortedLastRun === true;
	if (clearForceSafeTools && !aborted) entry.restartRecoveryForceSafeTools = void 0;
	if (!aborted) Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
}
//#endregion
export { buildMainSessionRecoveryClearPatch as n, clearMainSessionRecoveryAfterAgentRun as r, MAIN_SESSION_RECOVERY_CLEAR_PATCH as t };
