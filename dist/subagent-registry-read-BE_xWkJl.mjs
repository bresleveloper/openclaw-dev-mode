import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { d as collectSubagentSessionReadKeys } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { i as getSubagentRunsForChildSession, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { a as getSubagentRunsSnapshotForChildSession, d as getSubagentSessionListRunsSnapshotForSessions, l as getSubagentSessionListRunsSnapshotForChildSessions, o as getSubagentRunsSnapshotForController, u as getSubagentSessionListRunsSnapshotForRead, y as withSubagentRunReadSnapshot } from "./subagent-registry-state-CVSclnHX.mjs";
import { a as isSubagentRunLive } from "./subagent-run-liveness-C7bJPLJU.mjs";
import "./subagent-session-metrics-BCHEYB6I.mjs";
import { _ as shouldIgnorePostCompletionAnnounceForSessionFromRuns, a as countPendingDescendantRunsFromRuns, c as getSubagentRunByChildSessionKeyFromRuns, d as listRunsForControllerFromRuns, f as listRunsForRequesterFromRuns, h as resolveRequesterForChildSessionFromRuns, n as buildSubagentRunReadIndexFromRuns, o as getLatestSubagentRunByChildSessionKeyFromRuns, t as buildLatestSubagentRunReadIndexFromRuns } from "./subagent-registry-queries-rT6zMXb5.mjs";
//#region src/agents/subagents/registry/subagent-registry-read.ts
/** Builds the session-list index without hydrating full retained registry payloads. */
function buildSubagentSessionListReadIndex(now = Date.now(), sessionKeys, preparedRuns) {
	const runs = preparedRuns ?? (sessionKeys ? getSubagentSessionListRunsSnapshotForSessions(subagentRuns, sessionKeys) : getSubagentSessionListRunsSnapshotForRead(subagentRuns));
	return buildSubagentRunReadIndexFromRuns({
		runs,
		inMemoryRuns: sessionKeys ? [...runs.keys()].flatMap((runId) => {
			const current = subagentRuns.get(runId);
			return current ? [current] : [];
		}) : subagentRuns.values(),
		now
	});
}
/** Direct-child discovery needs only its controllers, without building global topology. */
function listSubagentSessionListRunsForControllers(controllerSessionKeys) {
	const runs = getSubagentSessionListRunsSnapshotForRead(subagentRuns, controllerSessionKeys);
	return controllerSessionKeys.flatMap((key) => listRunsForControllerFromRuns(runs, key));
}
function buildLatestSubagentSessionListReadIndex(childSessionKeys) {
	return buildLatestSubagentRunReadIndexFromRuns(getSubagentSessionListRunsSnapshotForChildSessions(childSessionKeys));
}
function listSubagentRunsForController(controllerSessionKey, controllerAgentId) {
	return listRunsForControllerFromRuns(getSubagentRunsSnapshotForController(subagentRuns, controllerSessionKey), controllerSessionKey, controllerAgentId);
}
async function countPendingDescendantRuns(rootSessionKey, assertCurrent) {
	assertCurrent();
	const count = await withSubagentRunReadSnapshot(subagentRuns, (snapshot) => {
		assertCurrent();
		const sessionKeys = collectSubagentSessionReadKeys([rootSessionKey], snapshot.values());
		return {
			runIds: [...snapshot.values()].filter((entry) => sessionKeys.has(entry.childSessionKey.trim())).map((entry) => entry.runId),
			sessionKeys: []
		};
	}, (_selection, runs) => {
		assertCurrent();
		return countPendingDescendantRunsFromRuns(new Map(runs), rootSessionKey);
	}, {
		sessionKeys: [rootSessionKey],
		descendants: true
	});
	assertCurrent();
	return count;
}
function resolveRequesterForChildSession(childSessionKey, childAgentId) {
	const resolved = resolveRequesterForChildSessionFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), childSessionKey, childAgentId);
	if (!resolved) return null;
	return {
		requesterSessionKey: resolved.requesterSessionKey,
		requesterAgentId: resolved.requesterAgentId,
		requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin)
	};
}
function shouldIgnorePostCompletionAnnounceForSession(childSessionKey, childAgentId) {
	return shouldIgnorePostCompletionAnnounceForSessionFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), childSessionKey, childAgentId);
}
/** True when the process-local registry still owns an active run for the child session. */
function isSubagentSessionRunActive(childSessionKey, childAgentId) {
	return isSubagentRunLive(getLatestSubagentRunByChildSessionKeyFromRuns(subagentRuns, childSessionKey, void 0, childAgentId));
}
function listSubagentRunsForRequester(requesterSessionKey, options) {
	return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
function getSubagentRunByChildSessionKey(childSessionKey, childAgentId) {
	return getSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), childSessionKey, childAgentId);
}
function getLatestSubagentRunByChildSessionKey(childSessionKey, childAgentId) {
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), childSessionKey, void 0, childAgentId) ?? null;
}
/**
* Returns the authoritative process-local run for mutation ownership checks.
*
* `matches` restricts the search to a row class the caller owns; see
* `getLatestSubagentRunByChildSessionKeyFromRuns`.
*/
function getLatestLiveSubagentRunByChildSessionKey(childSessionKey, matches, childAgentId) {
	const key = childSessionKey.trim();
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsForChildSession(key, childAgentId), key, matches, childAgentId) ?? null;
}
//#endregion
export { getLatestSubagentRunByChildSessionKey as a, listSubagentRunsForController as c, resolveRequesterForChildSession as d, shouldIgnorePostCompletionAnnounceForSession as f, getLatestLiveSubagentRunByChildSessionKey as i, listSubagentRunsForRequester as l, buildSubagentSessionListReadIndex as n, getSubagentRunByChildSessionKey as o, countPendingDescendantRuns as r, isSubagentSessionRunActive as s, buildLatestSubagentSessionListReadIndex as t, listSubagentSessionListRunsForControllers as u };
