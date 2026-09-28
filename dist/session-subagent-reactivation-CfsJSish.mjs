import { a as getLatestLiveSubagentRunByChildSessionKey, o as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-read-C2SIiLpb.mjs";
//#region src/gateway/session-subagent-reactivation.ts
/**
* Reactivates a yielded or completed subagent session under its next run id.
*
* `task` is the canonical user-supplied prompt text that just dispatched the
* follow-up. When provided, it is persisted on the new run record so a later
* orphan recovery / gateway restart rewraps the follow-up prompt rather than
* the stale original task. Without this, sessions.send and agent.run callers
* could reactivate a completed run with the new run id but lose the new
* prompt text from restart redispatch.
*/
async function reactivateCompletedSubagentSession(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const paused = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, (entry) => entry.pauseReason === "sessions_yield");
	const existing = paused ?? getLatestSubagentRunByChildSessionKey(params.sessionKey);
	if (!existing || typeof existing.execution.endedAt !== "number") return false;
	const runtime = await import("./subagent-registry-runtime-BBakxXvd.mjs");
	if (params.gatewayContextResolver && !params.gatewayContextResolver()) return false;
	const task = params.task;
	const hasTask = typeof task === "string" && task.trim().length > 0;
	const gatewayBinding = params.gatewayContextResolver ? { gatewayContextResolver: params.gatewayContextResolver } : {};
	if (paused ? runtime.adoptPausedSubagentRunForFollowUp({
		childSessionKey: params.sessionKey,
		runId,
		task: hasTask ? task : paused.task,
		...gatewayBinding
	}) : runtime.replaceSubagentRunAfterSteer({
		previousRunId: existing.runId,
		nextRunId: runId,
		fallback: existing,
		runTimeoutSeconds: existing.runTimeoutSeconds ?? 0,
		persistenceFailure: "throw",
		...hasTask ? { task } : {},
		...gatewayBinding
	})) return true;
	if (getLatestLiveSubagentRunByChildSessionKey(params.sessionKey)?.runId === runId) return true;
	throw new Error("subagent follow-up owner replacement was rejected");
}
//#endregion
export { reactivateCompletedSubagentSession as t };
