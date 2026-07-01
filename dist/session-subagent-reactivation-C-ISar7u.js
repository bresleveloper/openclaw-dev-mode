import { r as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-read-B_OEAvGZ.js";
//#region src/gateway/session-subagent-reactivation.ts
async function loadSessionSubagentReactivationRuntime() {
	return import("./session-subagent-reactivation.runtime.js");
}
/** Reactivates a completed subagent session by swapping in the new run id. */
async function reactivateCompletedSubagentSession(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const existing = getLatestSubagentRunByChildSessionKey(params.sessionKey);
	if (!existing || typeof existing.endedAt !== "number") return false;
	const { replaceSubagentRunAfterSteer } = await loadSessionSubagentReactivationRuntime();
	return replaceSubagentRunAfterSteer({
		previousRunId: existing.runId,
		nextRunId: runId,
		fallback: existing,
		runTimeoutSeconds: existing.runTimeoutSeconds ?? 0
	});
}
//#endregion
export { reactivateCompletedSubagentSession as t };
