import { S as isSubagentSessionKey, x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { h as listRunningSessions, m as listFinishedSessions } from "./bash-process-registry-CkYBcnWR.mjs";
import { s as bindRequesterYieldCronAuthority } from "./cron-creator-authority-context-DhhZn7kB.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-Bmw8_ghL.mjs";
//#region src/agents/openclaw-tools.requester-yield.ts
const ISOLATED_AUTOMATION_YIELD_UNSUPPORTED_ERROR = "Isolated automation turns cannot use sessions_yield because no requester continuation is available. Finish this turn so the scheduler can handle child output under the job's delivery policy.";
const SWARM_COLLECTOR_YIELD_UNSUPPORTED_ERROR = "Collector runs cannot use sessions_yield because their results are collected explicitly instead of announced. Finish this turn so the collected result is recorded for whoever waits on this run.";
function filterRequesterYieldTools(tools, requesterSessionKey) {
	return isCronSessionKey(requesterSessionKey) ? tools.filter((tool) => tool.name !== "sessions_yield") : tools;
}
function createRequesterYieldCallback(params) {
	if (isCronSessionKey(params.requesterSessionKey)) return () => ({ error: ISOLATED_AUTOMATION_YIELD_UNSUPPORTED_ERROR });
	if (params.swarmCollector === true) return () => ({ error: SWARM_COLLECTOR_YIELD_UNSUPPORTED_ERROR });
	const canWaitForMessage = isSubagentSessionKey(params.requesterSessionKey);
	const requesterSessionKey = params.requesterSessionKey?.trim() || void 0;
	const hasRegistryClaim = Boolean(requesterSessionKey && params.requesterTurnRunId);
	if (!params.claimYieldCompletion && !canWaitForMessage && !requesterSessionKey) return;
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
			const { markRequesterTurnYielded } = await import("./subagent-registry-DJ5MZmgl.mjs");
			const markYielded = () => markRequesterTurnYielded({
				requesterSessionKey: params.requesterSessionKey,
				requesterAgentId: params.requesterAgentId,
				requesterTurnRunId: params.requesterTurnRunId
			});
			registryClaimed = (withCronAuthority ? withCronAuthority(markYielded) : markYielded()) > 0;
		}
		if (runtimeClaimed || registryClaimed) return true;
		if (canWaitForMessage) {
			if (listRunningSessions().some((session) => session.scopeKey === processScopeKey) || listFinishedSessions().some((session) => session.scopeKey === processScopeKey && session.terminalPollObserved !== true)) return { error: "Background exec is still running or has an uncollected result in this subagent session. Use process to poll and collect it before yielding; background exec completion cannot resume this subagent, and run-scoped proxy credentials expire when the turn ends." };
			if (intent?.waitFor === "message") return true;
		}
		if (requesterSessionKey) {
			const { listUnsettledRequesterChildren } = await import("./subagent-registry-DJ5MZmgl.mjs");
			const pendingChildren = listUnsettledRequesterChildren({
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
