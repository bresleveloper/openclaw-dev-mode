import { f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { i as resolveSubagentChildAuthority } from "./subagent-child-owner-match-Dwr-9sla.mjs";
//#region src/agents/subagents/registry/subagent-recovery-state.ts
function isQuietSubagentRestartContinuation(entry) {
	return !entry.collect && entry.expectsCompletionMessage === false && entry.completionTarget === "parent" && entry.execution.interruptionReason === "gateway-restart";
}
function shouldSuppressSubagentRecoverySessionEffects(entry) {
	if (resolveSubagentChildAuthority(entry).status !== "verified") return true;
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
export { shouldSuppressSubagentRecoverySessionEffects as a, isSubagentRecoveryWedgedEntry as i, formatSubagentRecoveryWedgedReason as n, isQuietSubagentRestartContinuation as r, clearWedgedSubagentRecoveryAbort as t };
