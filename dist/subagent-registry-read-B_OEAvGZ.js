import { d as getAgentRunContext } from "./agent-events-7y1r8HOP.js";
import { H as subagentRuns, b as listDescendantRunsForRequesterFromRuns, m as countActiveDescendantRunsFromRuns, p as buildSubagentRunReadIndexFromRuns, t as getSubagentRunsSnapshotForRead, v as getSubagentRunByChildSessionKeyFromRuns, x as listRunsForControllerFromRuns } from "./subagent-registry-state-Cv1s7-5K.js";
//#region src/agents/subagent-registry-read.ts
/**
* Read-only subagent registry accessors.
*
* Combines persisted snapshots with in-memory live runs for UI, announce, control, and recovery paths.
*/
/** Builds a reusable read index from the current persisted and in-memory run state. */
function buildSubagentRunReadIndex(now = Date.now()) {
	return buildSubagentRunReadIndexFromRuns({
		runs: getSubagentRunsSnapshotForRead(subagentRuns),
		inMemoryRuns: subagentRuns.values(),
		now
	});
}
/** Lists runs controlled by a session key. */
function listSubagentRunsForController(controllerSessionKey) {
	return listRunsForControllerFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), controllerSessionKey);
}
/** Counts active descendant runs for a requester/session tree. */
function countActiveDescendantRuns(rootSessionKey) {
	return countActiveDescendantRunsFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Lists descendant runs under a requester/session tree. */
function listDescendantRunsForRequester(rootSessionKey) {
	return listDescendantRunsForRequesterFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Returns the preferred run for a child session, favoring active over ended runs. */
function getSubagentRunByChildSessionKey(childSessionKey) {
	return getSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
}
/** Returns whether a registry entry still has a live agent run context. */
function isSubagentRunLive(entry) {
	if (!entry || typeof entry.endedAt === "number") return false;
	return Boolean(getAgentRunContext(entry.runId));
}
/** Returns the run to display for a child session, using live memory before snapshot state. */
function getSessionDisplaySubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	let latestInMemoryActive = null;
	let latestInMemoryEnded = null;
	for (const entry of subagentRuns.values()) {
		if (entry.childSessionKey !== key) continue;
		if (typeof entry.endedAt === "number") {
			if (!latestInMemoryEnded || entry.createdAt > latestInMemoryEnded.createdAt) latestInMemoryEnded = entry;
			continue;
		}
		if (!latestInMemoryActive || entry.createdAt > latestInMemoryActive.createdAt) latestInMemoryActive = entry;
	}
	if (latestInMemoryEnded || latestInMemoryActive) {
		if (latestInMemoryEnded && (!latestInMemoryActive || latestInMemoryEnded.createdAt > latestInMemoryActive.createdAt)) return latestInMemoryEnded;
		return latestInMemoryActive ?? latestInMemoryEnded;
	}
	return getSubagentRunByChildSessionKey(key);
}
/** Returns the most recently created run for a child session from readable registry state. */
function getLatestSubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	let latest = null;
	for (const entry of getSubagentRunsSnapshotForRead(subagentRuns).values()) {
		if (entry.childSessionKey !== key) continue;
		if (!latest || entry.createdAt > latest.createdAt) latest = entry;
	}
	return latest;
}
//#endregion
export { isSubagentRunLive as a, getSessionDisplaySubagentRunByChildSessionKey as i, countActiveDescendantRuns as n, listDescendantRunsForRequester as o, getLatestSubagentRunByChildSessionKey as r, listSubagentRunsForController as s, buildSubagentRunReadIndex as t };
