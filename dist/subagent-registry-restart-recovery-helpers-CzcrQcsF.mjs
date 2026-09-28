import { u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
//#region src/agents/subagents/registry/subagent-registry-restart-recovery-helpers.ts
function getRestartRecoveryReplayError(entry) {
	return entry.terminalOwner !== "interrupted-recovery" || entry.pauseReason === "sessions_yield" || entry.execution.status !== "terminal" || typeof entry.execution.endedAt !== "number" || entry.execution.outcome?.status !== "error" || entry.endedReason !== "subagent-error" ? void 0 : entry.execution.outcome.error ?? "subagent run interrupted by gateway restart";
}
function isRestartRecoveryLifecycleCurrent(receipt) {
	return !receipt.lifecycleGeneration || isAgentEventLifecycleGenerationCurrent(receipt.lifecycleGeneration);
}
function isRetiredSubagentExecution(entry) {
	return (entry.execution.status === "running" || entry.execution.status === "interrupted") && typeof entry.execution.lifecycleGeneration === "string" && !isAgentEventLifecycleGenerationCurrent(entry.execution.lifecycleGeneration);
}
function isRetiredSubagentSessionOwner(entry, session) {
	return session?.status === "running" && isRetiredSubagentExecution(entry) && ownsSubagentSessionExecution(entry, session);
}
function ownsSubagentSessionExecution(entry, session) {
	return session.lifecycleRunId === entry.runId || entry.execution.transcriptTarget !== void 0 && entry.taskRunId !== void 0 && session.lifecycleRunId === (session.subagentRecovery?.sessionLifecycleRunId ?? entry.taskRunId) && session.subagentRecovery?.lastRunId === entry.runId;
}
//#endregion
export { ownsSubagentSessionExecution as a, isRetiredSubagentSessionOwner as i, isRestartRecoveryLifecycleCurrent as n, isRetiredSubagentExecution as r, getRestartRecoveryReplayError as t };
