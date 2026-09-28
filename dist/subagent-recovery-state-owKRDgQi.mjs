import { u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
//#region src/agents/subagents/registry/subagent-recovery-state.ts
function shouldSuppressSubagentRecoverySessionEffects(entry) {
	if (entry.execution.suppressSessionEffects === true) return true;
	if (entry.killIntent) {
		const killLifecycleGeneration = entry.killIntent.lifecycleGeneration;
		return typeof killLifecycleGeneration !== "string" || killLifecycleGeneration.length === 0 || !isAgentEventLifecycleGenerationCurrent(killLifecycleGeneration);
	}
	const lifecycleGeneration = entry.execution.restartRecovery?.lifecycleGeneration;
	return typeof lifecycleGeneration === "string" && lifecycleGeneration.length > 0 && !isAgentEventLifecycleGenerationCurrent(lifecycleGeneration);
}
function isSubagentRecoveryWedgedEntry(entry) {
	const recovery = entry && typeof entry === "object" ? entry.subagentRecovery : void 0;
	return typeof recovery?.wedgedAt === "number" && Number.isFinite(recovery.wedgedAt) && recovery.wedgedAt > 0;
}
function formatSubagentRecoveryWedgedReason(entry) {
	return entry.subagentRecovery?.wedgedReason?.trim() || "subagent orphan recovery is tombstoned for this session";
}
function clearWedgedSubagentRecoveryAbort(entry, now) {
	if (!isSubagentRecoveryWedgedEntry(entry) || entry.abortedLastRun !== true) return false;
	entry.abortedLastRun = false;
	entry.updatedAt = now;
	return true;
}
//#endregion
export { shouldSuppressSubagentRecoverySessionEffects as i, formatSubagentRecoveryWedgedReason as n, isSubagentRecoveryWedgedEntry as r, clearWedgedSubagentRecoveryAbort as t };
