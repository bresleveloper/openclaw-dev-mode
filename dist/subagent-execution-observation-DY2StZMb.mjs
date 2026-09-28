import { A as getSubagentRunsForRequesterSession, O as getSubagentRunsForChildSession, a as isSubagentRunLive, j as subagentRuns, n as hasSubagentRunEnded, o as isSubagentRunQueued } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { r as recordLatestSubagentRun, t as compareSubagentRunGeneration } from "./subagent-run-generation-BpwN1g73.mjs";
//#region src/agents/subagents/registry/subagent-execution-observation.ts
function isYieldedSubagentRun(entry) {
	return entry.pauseReason === "sessions_yield" && !entry.killIntent && !entry.killReconciliation && entry.suppressAnnounceReason !== "killed" && entry.endedReason !== "subagent-killed";
}
/** Project recorded execution separately from completion and requester delivery. */
function observeSubagentExecution(entry, children) {
	if (isYieldedSubagentRun(entry)) {
		const latestChildren = /* @__PURE__ */ new Map();
		for (const child of children) if (child.requesterSessionKey === entry.childSessionKey) recordLatestSubagentRun(latestChildren, child.childSessionKey, child);
		const pending = [...latestChildren.values()].filter((child) => child.collect !== true && child.expectsCompletionMessage === true && child.suppressAnnounceReason !== "steer-restart" && (isYieldedSubagentRun(child) || !hasSubagentRunEnded(child) || child.requesterSettleWake !== void 0 || typeof child.cleanupCompletedAt !== "number")).toSorted((left, right) => left.runId.localeCompare(right.runId));
		return {
			state: "waiting",
			wait: pending.length > 0 ? {
				kind: "children",
				pendingCount: pending.length,
				dependencies: pending.slice(0, 32).map((child) => Object.assign({
					runId: child.runId,
					sessionKey: child.childSessionKey
				}, child.label ? { label: child.label } : {}))
			} : { kind: "external" }
		};
	}
	if (hasSubagentRunEnded(entry)) return { state: "finished" };
	if (entry.execution.status === "interrupted") return { state: "unknown" };
	const current = subagentRuns.get(entry.runId);
	if (!current || current.childSessionKey !== entry.childSessionKey || current.requesterSessionKey !== entry.requesterSessionKey || (current.taskRunId ?? current.runId) !== (entry.taskRunId ?? entry.runId) || compareSubagentRunGeneration(current, entry) !== 0) return { state: "unknown" };
	if (isSubagentRunLive(current)) return { state: current.execution.status === "queued" ? "queued" : "running" };
	if (isSubagentRunQueued(current)) return { state: "queued" };
	return { state: "unknown" };
}
/** Observe only the current memory owner of this exact delegated task. */
function getSubagentExecutionObservation(params) {
	let owner;
	for (const entry of getSubagentRunsForChildSession(params.childSessionKey)) if (!owner || compareSubagentRunGeneration(entry, owner) > 0) owner = entry;
	if (!owner || (owner.taskRunId ?? owner.runId) !== params.taskRunId || params.generation !== void 0 && owner.generation !== params.generation) return;
	return {
		...observeSubagentExecution(owner, getSubagentRunsForRequesterSession(owner.childSessionKey)),
		executionRunId: owner.runId
	};
}
//#endregion
export { observeSubagentExecution as n, getSubagentExecutionObservation as t };
