import { l as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { h as subagentRuns, l as getSubagentRunsForRequesterSession } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { n as hasSubagentRunEnded } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { t as captureOperatorToolGatewayContinuationContext } from "./server-plugin-in-process-authority-CiYjs5MA.mjs";
import "./server-plugin-in-process-dispatch-D8bA485y.mjs";
import { O as resumeSubagentRun, j as settleRequesterAfterSessionSpawns } from "./subagent-registry-CfK3_UcO.mjs";
import { o as mutateSubagentRuns } from "./subagent-registry-persistence-DE7WA4wN.mjs";
import { a as retireAcceptedSessionSpawnCompletionForRun, r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-Bo7jgCE_.mjs";
//#region src/agents/subagents/registry/subagent-registry-requester-claim.ts
/** An inline terminal result consumes the same durable obligation as a late completion. */
async function acknowledgeSubagentResultForRequesterTurn(params) {
	const assertCurrent = captureGatewayToolCallerAssertion();
	const caller = getGatewayToolCallerIdentity();
	const instance = caller?.operationalRunInstance;
	if (caller && (caller.agentId !== params.requesterAgentId || caller.sessionKey !== params.requesterSessionKey || instance && instance.runId !== params.requesterTurnRunId)) throw new Error("Inline child result differs from its admitted requester turn.");
	const accepted = await mutateSubagentRuns([params.runId], (rows) => {
		const entry = rows.get(params.runId);
		if (!entry || entry.requesterSessionKey !== params.requesterSessionKey || entry.requesterAgentId !== params.requesterAgentId || entry.requesterTurnRunId !== params.requesterTurnRunId || entry.requesterTurnYielded || entry.killIntent || entry.killReconciliation) throw new Error("Inline child result no longer belongs to its requester turn.");
		const next = {
			...entry,
			expectsCompletionMessage: false,
			completion: {
				...entry.completion,
				required: false
			},
			delivery: {
				status: "delivered",
				announcedAt: Date.now()
			}
		};
		return {
			value: {
				receipt: {
					runId: entry.taskRunId ?? entry.runId,
					childSessionKey: entry.childSessionKey
				},
				ended: hasSubagentRunEnded(entry)
			},
			postimages: /* @__PURE__ */ new Map([[entry.runId, next]])
		};
	}, {
		runs: subagentRuns,
		assertCurrent
	});
	if (instance) retireAcceptedSessionSpawnCompletionForRun(instance, accepted.receipt);
	if (accepted.ended) resumeSubagentRun(params.runId);
}
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
export { acknowledgeSubagentResultForRequesterTurn, reconcileRequesterTurnClaimForRun };
