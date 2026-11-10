import { h as listLiveAgentRunIds } from "./agent-run-registry-gmaPgO-n.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { l as listSwarmRunReservationIds } from "./swarm-scheduler-CocpuN_N.mjs";
import { n as collectSubagentSessionReadKeys } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, s as getSubagentRunsForChildSession, u as getSubagentSessionReadLookup } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { a as isSubagentRunLive, o as isSubagentRunQueued } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { A as getSubagentRunByChildSessionKeyFromRuns, C as buildLatestSubagentRunReadIndexFromRuns, D as countPendingDescendantRunsFromRuns, N as listRunsForControllerFromRuns, O as getLatestSubagentRunByChildSessionKeyFromRuns, P as listRunsForRequesterFromRuns, R as shouldIgnorePostCompletionAnnounceForSessionFromRuns, T as buildSubagentRunReadIndexFromRuns, b as withSubagentRunReadSnapshot, d as getSubagentSessionListRunsSnapshotForSessions, k as getLatestSubagentRunForChild, l as getSubagentSessionListRunsSnapshotForChildSessions, o as getSubagentRunsSnapshotForChildSession, u as getSubagentSessionListRunsSnapshotForRead } from "./subagent-registry-state-DBdy-FdI.mjs";
//#region src/agents/subagents/registry/subagent-registry-read.ts
/** Resolve live owners through the existing aliases without scanning retained history. */
function listActiveSubagentSessionKeys() {
	const runIds = /* @__PURE__ */ new Set([...listLiveAgentRunIds(), ...listSwarmRunReservationIds()]);
	const sessionKeys = /* @__PURE__ */ new Set();
	for (const runId of getSubagentSessionReadLookup(subagentRuns).selectRunIds(runIds)) {
		const entry = subagentRuns.get(runId);
		if (entry && (isSubagentRunLive(entry) || isSubagentRunQueued(entry))) sessionKeys.add(entry.childSessionKey);
	}
	return [...sessionKeys];
}
/** Builds the session-list index without hydrating full retained registry payloads. */
function buildSubagentSessionListReadIndex(now = Date.now(), sessionKeys, preparedRuns) {
	const runs = preparedRuns ?? (sessionKeys ? getSubagentSessionListRunsSnapshotForSessions(subagentRuns, sessionKeys) : getSubagentSessionListRunsSnapshotForRead(subagentRuns));
	return buildSubagentRunReadIndexFromRuns({
		runs,
		inMemoryRuns: sessionKeys ? [...runs.keys()].flatMap((runId) => subagentRuns.get(runId) ?? []) : subagentRuns.values(),
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
/** Capacity reads retain active-first selection without hydrating child payloads. */
function getSubagentSessionListRunByChildSessionKey(childSessionKey) {
	return getSubagentRunByChildSessionKeyFromRuns(getSubagentSessionListRunsSnapshotForChildSessions([childSessionKey]), childSessionKey, void 0, subagentRuns);
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
async function resolveRequesterForChildSession(childSessionKey, childAgentId) {
	const resolved = getLatestSubagentRunForChild(await getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), {
		childSessionKey,
		childAgentId
	});
	if (!resolved) return null;
	return {
		requesterSessionKey: resolved.requesterSessionKey,
		requesterAgentId: resolved.requesterAgentId,
		requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin)
	};
}
async function shouldIgnorePostCompletionAnnounceForSession(childSessionKey, childAgentId) {
	return shouldIgnorePostCompletionAnnounceForSessionFromRuns(await getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), childSessionKey, childAgentId);
}
/** True when the process-local registry still owns an active run for the child session. */
function isSubagentSessionRunActive(childSessionKey, childAgentId) {
	return isSubagentRunLive(getLatestSubagentRunForChild(subagentRuns, {
		childSessionKey,
		childAgentId
	}));
}
function listSubagentRunsForRequester(requesterSessionKey, options) {
	return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
async function getLatestSubagentRunByChildSessionKey(childSessionKey, childAgentId) {
	return getLatestSubagentRunForChild(await getSubagentRunsSnapshotForChildSession(subagentRuns, childSessionKey, childAgentId), {
		childSessionKey,
		childAgentId
	}) ?? null;
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
export { getLatestSubagentRunByChildSessionKey as a, listActiveSubagentSessionKeys as c, resolveRequesterForChildSession as d, shouldIgnorePostCompletionAnnounceForSession as f, getLatestLiveSubagentRunByChildSessionKey as i, listSubagentRunsForRequester as l, buildSubagentSessionListReadIndex as n, getSubagentSessionListRunByChildSessionKey as o, countPendingDescendantRuns as r, isSubagentSessionRunActive as s, buildLatestSubagentSessionListReadIndex as t, listSubagentSessionListRunsForControllers as u };
