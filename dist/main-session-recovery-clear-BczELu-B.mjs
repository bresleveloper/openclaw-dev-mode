//#region src/agents/main-session-recovery/main-session-recovery-clear.ts
function removeMainSessionRecoveryForegroundClaim(claims, claimId) {
	const tokens = claims.tokens.filter((token) => token !== claimId);
	if (tokens.length === 0) return;
	const runIdsByClaimId = Object.fromEntries(Object.entries(claims.runIdsByClaimId ?? {}).filter(([token]) => token !== claimId));
	return {
		lifecycleGeneration: claims.lifecycleGeneration,
		tokens,
		...Object.keys(runIdsByClaimId).length > 0 ? { runIdsByClaimId } : {}
	};
}
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
	if (entry.abortedLastRun === true) return;
	if (clearForceSafeTools) entry.restartRecoveryForceSafeTools = void 0;
	Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
}
//#endregion
export { removeMainSessionRecoveryForegroundClaim as i, buildMainSessionRecoveryClearPatch as n, clearMainSessionRecoveryAfterAgentRun as r, MAIN_SESSION_RECOVERY_CLEAR_PATCH as t };
