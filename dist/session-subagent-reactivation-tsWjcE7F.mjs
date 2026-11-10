import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { O as isSameSubagentRun, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { a as getLatestSubagentRunByChildSessionKey, i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-DY0g8fGW.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { a as assertSubagentRegistryWriteSourceCurrent, s as restoreSubagentRunsFromDisk } from "./subagent-registry-persistence-DE7WA4wN.mjs";
//#region src/gateway/session-subagent-reactivation.ts
/** Persist the dispatched follow-up prompt so restart recovery cannot reuse the original task. */
async function reactivateCompletedSubagentSession(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const existing = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, (entry) => entry.pauseReason === "sessions_yield") ?? await getLatestSubagentRunByChildSessionKey(params.sessionKey);
	if (!existing || typeof existing.execution.endedAt !== "number") return false;
	if (params.gatewayContextResolver && !params.gatewayContextResolver()) return false;
	if (params.acpSession) {
		const [acpMeta] = await readAcpSessionMetaForEntries({
			cfg: params.acpSession.cfg,
			entries: [{
				agentId: params.acpSession.activeSessionAgentId,
				sessionKey: params.sessionKey,
				entry: params.acpSession.sessionEntry
			}]
		});
		params.assertCurrent?.();
		if (acpMeta) return false;
	}
	const stateContext = captureOpenClawStateWorkerContext();
	const liveSource = () => getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, (entry) => entry.runId === existing.runId);
	if (!liveSource()) await restoreSubagentRunsFromDisk({
		runs: subagentRuns,
		mergeOnly: true,
		context: stateContext,
		assertCurrent: params.assertCurrent
	});
	const source = liveSource();
	if (!source || !isSameSubagentRun(source, existing)) return false;
	const latest = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey);
	const assertOriginalOwnerCurrent = () => {
		assertSubagentRegistryWriteSourceCurrent(stateContext);
		const current = liveSource();
		const currentLatest = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey);
		if (!isSameSubagentRunOwner(current, source) || (latest ? !isSameSubagentRunOwner(currentLatest, latest) : currentLatest !== void 0) || current && typeof current.execution.endedAt !== "number") throw new Error("subagent follow-up source changed while its writes settled");
		params.assertCurrent?.();
		if (params.gatewayContextResolver && !params.gatewayContextResolver()) throw new Error("subagent follow-up Gateway owner retired");
	};
	const runtime = await import("./subagent-registry-BSZR34Tv.mjs");
	assertOriginalOwnerCurrent();
	const task = params.task;
	const hasTask = typeof task === "string" && task.trim().length > 0;
	const gatewayBinding = params.gatewayContextResolver ? { gatewayContextResolver: params.gatewayContextResolver } : {};
	if (source.pauseReason === "sessions_yield" ? await runtime.adoptPausedSubagentRunForFollowUp({
		childSessionKey: params.sessionKey,
		runId,
		task: hasTask ? task : source.task,
		assertCurrent: assertOriginalOwnerCurrent,
		...gatewayBinding
	}) : await runtime.replaceSubagentRunAfterSteerCore({
		previousRunId: source.runId,
		nextRunId: runId,
		preserveCompletedRun: true,
		runTimeoutSeconds: source.runTimeoutSeconds ?? 0,
		...hasTask ? { task } : {},
		assertCurrent: assertOriginalOwnerCurrent,
		...gatewayBinding
	})) return true;
	if (getLatestLiveSubagentRunByChildSessionKey(params.sessionKey)?.runId === runId) return true;
	throw new Error("subagent follow-up owner replacement was rejected");
}
//#endregion
export { reactivateCompletedSubagentSession as t };
