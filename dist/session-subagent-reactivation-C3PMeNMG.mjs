import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { S as isSameSubagentRunOwner, x as isSameSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { c as restoreSubagentRunsFromDisk, o as assertSubagentRegistryWriteSourceCurrent } from "./subagent-registry-persistence-7pBNp1rN.mjs";
import { a as getLatestSubagentRunByChildSessionKey, i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-BE_xWkJl.mjs";
//#region src/gateway/session-subagent-reactivation.ts
/** Persist the dispatched follow-up prompt so restart recovery cannot reuse the original task. */
async function reactivateCompletedSubagentSession(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const existing = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, (entry) => entry.pauseReason === "sessions_yield") ?? getLatestSubagentRunByChildSessionKey(params.sessionKey);
	if (!existing || typeof existing.execution.endedAt !== "number") return false;
	if (params.gatewayContextResolver && !params.gatewayContextResolver()) return false;
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
	const runtime = await import("./subagent-registry-D46a4hLM.mjs");
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
