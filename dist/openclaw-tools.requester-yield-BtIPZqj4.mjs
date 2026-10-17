import { S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
import { f as listFinishedSessions, p as listRunningSessions } from "./bash-process-registry-BsL_e5bm.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { s as bindRequesterYieldCronAuthority } from "./cron-creator-authority-context-aezDQHzt.mjs";
//#region src/agents/openclaw-tools.requester-yield.ts
const ISOLATED_AUTOMATION_YIELD_UNSUPPORTED_ERROR = "Isolated automation turns cannot use sessions_yield because no requester continuation is available. Finish this turn so the scheduler can handle child output under the job's delivery policy.";
const SWARM_COLLECTOR_YIELD_UNSUPPORTED_ERROR = "Collector runs cannot use sessions_yield because their results are collected explicitly instead of announced. Finish this turn so the collected result is recorded for whoever waits on this run.";
function filterRequesterYieldTools(tools, requesterSessionKey) {
	return isCronSessionKey(requesterSessionKey) ? tools.filter((tool) => tool.name !== "sessions_yield") : tools;
}
function createRequesterYieldCallback(params) {
	if (isCronSessionKey(params.requesterSessionKey)) return () => ({ error: ISOLATED_AUTOMATION_YIELD_UNSUPPORTED_ERROR });
	if (params.swarmCollector === true) return () => ({ error: SWARM_COLLECTOR_YIELD_UNSUPPORTED_ERROR });
	const requesterSessionKey = params.requesterSessionKey?.trim() || void 0;
	const hasRegistryClaim = Boolean(requesterSessionKey && params.requesterTurnRunId);
	if (!params.claimYieldCompletion && !requesterSessionKey) return;
	const withCronAuthority = bindRequesterYieldCronAuthority(params.requesterTurnRunId);
	const processScopeKey = resolveProcessToolScopeKey({
		scopeKey: params.processScopeKey,
		sessionKey: params.requesterSessionKey,
		agentId: params.requesterAgentId
	});
	return async (intent) => {
		const runtimeClaimed = await params.claimYieldCompletion?.() ?? false;
		let registryClaimed = false;
		if (hasRegistryClaim) {
			const { markRequesterTurnYielded } = await import("./subagent-registry-D46a4hLM.mjs");
			const markYielded = () => markRequesterTurnYielded({
				requesterSessionKey: params.requesterSessionKey,
				requesterAgentId: params.requesterAgentId,
				requesterTurnRunId: params.requesterTurnRunId
			});
			registryClaimed = await (withCronAuthority ? withCronAuthority(markYielded) : markYielded()) > 0;
		}
		const completionClaimed = runtimeClaimed || registryClaimed;
		if (requesterSessionKey && params.requesterTurnRunId) {
			const { claimSubagentYield } = await import("./subagent-registry-D46a4hLM.mjs");
			const claim = await claimSubagentYield({
				runId: params.requesterTurnRunId,
				sessionKey: requesterSessionKey,
				agentId: params.requesterAgentId,
				waitForMessage: intent?.waitFor === "message",
				acknowledgment: intent?.acknowledgment,
				hasPendingWork: () => !completionClaimed && (listRunningSessions().some((session) => session.scopeKey === processScopeKey) || listFinishedSessions().some((session) => session.scopeKey === processScopeKey && session.terminalPollObserved !== true))
			});
			if (claim === "pending-work") return { error: "Background exec is still running or has an uncollected result in this subagent session. Use process to poll and collect it before yielding; background exec completion cannot resume this subagent, and run-scoped proxy credentials expire when the turn ends." };
			if (claim !== "nothing-pending") return claim;
		}
		if (completionClaimed) return true;
		if (requesterSessionKey) {
			const { listUnsettledRequesterChildren } = await import("./subagent-registry-D46a4hLM.mjs");
			const pendingChildren = await listUnsettledRequesterChildren({
				requesterSessionKey,
				requesterAgentId: params.requesterAgentId,
				excludeRequesterTurnRunId: params.requesterTurnRunId
			});
			if (pendingChildren.length > 0) return { pendingChildren };
		}
		return false;
	};
}
//#endregion
export { filterRequesterYieldTools as n, createRequesterYieldCallback as t };
