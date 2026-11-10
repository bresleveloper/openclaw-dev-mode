import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/harness-completion-compaction.ts
/** Only the requester incarnation advances; task, source and requester scope stay exact. */
function advanceHarnessCompletionClaim(claim, transition) {
	if (!claim || !transition.previous || claim.sessionId !== transition.previous.sessionId || claim.lifecycleRevision !== transition.previous.lifecycleRevision) return;
	const { lifecycleRevision: _previousRevision, ...source } = claim;
	return {
		...source,
		sessionId: transition.current.sessionId,
		...transition.current.lifecycleRevision !== void 0 ? { lifecycleRevision: transition.current.lifecycleRevision } : {}
	};
}
/** Included in the same host-owned commit that replaces the compaction predecessor. */
function projectHarnessCompletionCompaction(entry, sessionId) {
	const claim = entry.restartRecoveryHarnessCompletion;
	const next = advanceHarnessCompletionClaim(claim, {
		previous: entry,
		current: {
			sessionId,
			lifecycleRevision: entry.lifecycleRevision
		}
	});
	if (!next) return {};
	return {
		restartRecoveryHarnessCompletion: next,
		...entry.restartRecoveryTerminalDeliveryEvidence ? { restartRecoveryTerminalDeliveryEvidence: entry.restartRecoveryTerminalDeliveryEvidence.map((receipt) => isDeepStrictEqual(receipt.harnessCompletion, claim) ? {
			...receipt,
			harnessCompletion: next
		} : receipt) } : {}
	};
}
//#endregion
export { projectHarnessCompletionCompaction as n, advanceHarnessCompletionClaim as t };
