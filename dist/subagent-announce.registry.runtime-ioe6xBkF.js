import { o as normalizeDeliveryContext } from "./delivery-context.shared-D36KNc_D.js";
import { C as resolveRequesterForChildSessionFromRuns, H as subagentRuns, S as listRunsForRequesterFromRuns, _ as countPendingDescendantRunsFromRuns, g as countPendingDescendantRunsExcludingRunFromRuns, t as getSubagentRunsSnapshotForRead, w as shouldIgnorePostCompletionAnnounceForSessionFromRuns, y as isSubagentSessionRunActiveFromRuns } from "./subagent-registry-state-Cv1s7-5K.js";
import { n as countActiveDescendantRuns, r as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-read-B_OEAvGZ.js";
import { r as replaceSubagentRunAfterSteer } from "./subagent-registry-steer-runtime-B8p8-E6G.js";
//#region src/agents/subagent-registry-announce-read.ts
/**
* Read-side helpers for subagent completion announcements. These wrappers keep
* announce delivery code on normalized registry snapshots instead of reaching
* into persistence or mutation paths.
*/
/** Resolves the requester session and origin for a child subagent session. */
function resolveRequesterForChildSession(childSessionKey) {
	const resolved = resolveRequesterForChildSessionFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
	if (!resolved) return null;
	return {
		requesterSessionKey: resolved.requesterSessionKey,
		requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin)
	};
}
/** True when a subagent session still has an active run record. */
function isSubagentSessionRunActive(childSessionKey) {
	return isSubagentSessionRunActiveFromRuns(subagentRuns, childSessionKey);
}
/** True when post-completion announce should be skipped for a child session. */
function shouldIgnorePostCompletionAnnounceForSession(childSessionKey) {
	return shouldIgnorePostCompletionAnnounceForSessionFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
}
/** Lists subagent runs requested by one session key. */
function listSubagentRunsForRequester(requesterSessionKey, options) {
	return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
/** Counts pending descendant subagent runs below a root session. */
function countPendingDescendantRuns(rootSessionKey) {
	return countPendingDescendantRunsFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Counts pending descendant runs while excluding one run id. */
function countPendingDescendantRunsExcludingRun(rootSessionKey, excludeRunId) {
	return countPendingDescendantRunsExcludingRunFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey, excludeRunId);
}
//#endregion
export { countActiveDescendantRuns, countPendingDescendantRuns, countPendingDescendantRunsExcludingRun, getLatestSubagentRunByChildSessionKey, isSubagentSessionRunActive, listSubagentRunsForRequester, replaceSubagentRunAfterSteer, resolveRequesterForChildSession, shouldIgnorePostCompletionAnnounceForSession };
