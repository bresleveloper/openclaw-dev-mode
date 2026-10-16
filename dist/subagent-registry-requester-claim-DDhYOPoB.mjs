import { c as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-BaxMDLZF.mjs";
import { o as captureOperatorToolGatewayContinuationContext } from "./server-plugin-in-process-dispatch-BzMtb5Z5.mjs";
import { o as getSubagentRunsForRequesterSession, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { A as settleRequesterAfterSessionSpawns } from "./subagent-registry-CPK6wmy6.mjs";
import { r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-DpD0J38H.mjs";
//#region src/agents/subagents/registry/subagent-registry-requester-claim.ts
/** Account for committed claims; only retired requesters hand their cohort back to settlement. */
async function reconcileRequesterTurnClaimForRun(params) {
	const requesterTurnRunId = params.requesterRunInstance.runId;
	const ownedEntries = () => [...getSubagentRunsForRequesterSession(params.requesterSessionKey)].filter((entry) => entry.requesterAgentId === params.requesterAgentId && entry.requesterTurnRunId === requesterTurnRunId && entry.expectsCompletionMessage === true);
	const entries = ownedEntries();
	const acceptedEntry = entries.find((entry) => entry.runId === params.runId);
	if (!acceptedEntry) return false;
	mergeAcceptedSessionSpawnsForRun(params.requesterRunInstance, [{
		runId: acceptedEntry.taskRunId ?? acceptedEntry.runId,
		childSessionKey: acceptedEntry.childSessionKey,
		expectsCompletionMessage: true
	}]);
	if (getActiveAgentRunDelegatedAuthority(params.requesterRunInstance)) return true;
	return subagentRuns.runWithCompletionBatchAuthority(entries, async () => {
		const custody = await captureOperatorToolGatewayContinuationContext();
		if (!custody) throw new Error("Committed requester claim has no retained completion custody");
		try {
			const current = ownedEntries();
			if (!current.includes(acceptedEntry)) return false;
			return await subagentRuns.runWithCompletionBatchAuthority(current, () => custody.run(() => settleRequesterAfterSessionSpawns({
				...params,
				requesterTurnRunId,
				requesterYielded: false,
				acceptedSessionSpawns: current.map((entry) => ({
					runId: entry.taskRunId ?? entry.runId,
					childSessionKey: entry.childSessionKey,
					expectsCompletionMessage: true
				})),
				assertCurrent: custody.assertCurrent
			})));
		} finally {
			custody.release();
		}
	});
}
//#endregion
export { reconcileRequesterTurnClaimForRun };
