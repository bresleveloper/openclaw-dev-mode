import { C as latestSubagentRun, D as matchesSubagentChildSessionOwner, H as isDeliverySuspended, T as recordLatestSubagentRun, f as buildSubagentRunReadTopology, p as resolveControllerSessionKey, x as isSameSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { n as hasSubagentRunEnded, r as isRetainedUnendedSubagentRun } from "./subagent-run-liveness-C7bJPLJU.mjs";
//#region src/agents/subagents/registry/subagent-registry-queries.ts
function resolveConcurrencyOwnerSessionKey(entry) {
	return entry.collect ? entry.swarmRequesterSessionKey?.trim() || resolveControllerSessionKey(entry) : resolveControllerSessionKey(entry);
}
function isDeliveryTerminalForRequesterSettle(entry) {
	return isDeliverySuspended(entry) || entry.delivery?.disposition === "delivered" || entry.delivery?.disposition === "intentional_non_delivery" || entry.delivery?.disposition === "permanent_failure";
}
function matchesSubagentRequesterSession(entry, requester) {
	return entry.completionRequesterSessionId === requester.sessionId && entry.completionRequesterLifecycleRevision === requester.lifecycleRevision;
}
/** Lists requester-owned runs, optionally scoped to a requester run or session incarnation. */
function listRunsForRequesterFromRuns(runs, requesterSessionKey, options) {
	const key = requesterSessionKey.trim();
	if (!key) return [];
	const requesterRunId = options?.requesterRunId?.trim();
	const requesterRun = requesterRunId ? runs.get(requesterRunId) : void 0;
	const requesterRunMatchesScope = requesterRun && requesterRun.childSessionKey === key ? requesterRun : void 0;
	const lowerBound = requesterRunMatchesScope?.execution.startedAt ?? requesterRunMatchesScope?.createdAt;
	const upperBound = requesterRunMatchesScope?.execution.endedAt;
	const latestRuns = options?.requesterSessionId === void 0 ? void 0 : buildLatestSubagentRunReadIndexFromRuns(runs);
	return [...runs.values()].filter((entry) => entry.requesterSessionKey === key && (options?.requesterSessionId === void 0 || matchesSubagentRequesterSession(entry, {
		sessionId: options.requesterSessionId,
		lifecycleRevision: options.requesterLifecycleRevision
	})) && (!latestRuns || latestRuns.getLatestSubagentRun(entry.childSessionKey, entry.childAgentId) === entry) && (!options?.requesterAgentId || entry.requesterAgentId === options.requesterAgentId) && (options?.requesterStorePath === void 0 || (entry.requesterStorePath ?? null) === options.requesterStorePath) && (typeof lowerBound !== "number" || entry.createdAt >= lowerBound) && (typeof upperBound !== "number" || entry.createdAt <= upperBound));
}
function selectConnectedSettledSubagentWave(candidates, settledEntry) {
	const targetIndex = candidates.findIndex((entry) => entry.runId === settledEntry.runId);
	const target = candidates[targetIndex];
	if (!target) return [];
	const sorted = candidates.map((entry, originalIndex) => ({
		entry,
		originalIndex,
		endedAt: typeof entry.execution.endedAt === "number" ? entry.execution.endedAt : Number.MAX_SAFE_INTEGER
	})).toSorted((a, b) => a.entry.createdAt - b.entry.createdAt || a.endedAt - b.endedAt || a.originalIndex - b.originalIndex);
	const first = sorted[0];
	if (!first) return [];
	let componentStart = 0;
	let componentEnd = first.endedAt;
	let containsTarget = first.originalIndex === targetIndex;
	for (let index = 1; index <= sorted.length; index += 1) {
		const next = sorted[index];
		if (!next || next.entry.createdAt > componentEnd) {
			if (containsTarget) return [target, ...sorted.slice(componentStart, index).filter((item) => item.originalIndex !== targetIndex).toSorted((a, b) => a.originalIndex - b.originalIndex).map((item) => item.entry)];
			if (!next) break;
			componentStart = index;
			componentEnd = next.endedAt;
			containsTarget = next.originalIndex === targetIndex;
			continue;
		}
		componentEnd = Math.max(componentEnd, next.endedAt);
		containsTarget ||= next.originalIndex === targetIndex;
	}
	return [];
}
function listRunsForControllerFromRuns(runs, controllerSessionKey, controllerAgentId) {
	const key = controllerSessionKey.trim();
	if (!key) return [];
	return [...runs.values()].filter((entry) => resolveControllerSessionKey(entry) === key && (!controllerAgentId || entry.requesterAgentId === controllerAgentId));
}
function buildLatestSubagentRunReadIndexFromRuns(runs) {
	const latestRunByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		const childSessionKey = entry.childSessionKey.trim();
		if (!childSessionKey) continue;
		recordLatestSubagentRun(latestRunByChildSessionKey, childSessionKey, entry);
		const bucket = runsByChildSessionKey.get(childSessionKey);
		if (bucket) bucket.push(entry);
		else runsByChildSessionKey.set(childSessionKey, [entry]);
	}
	return { getLatestSubagentRun: (childSessionKey, childAgentId) => {
		const key = childSessionKey.trim();
		return childAgentId === void 0 ? latestRunByChildSessionKey.get(key) ?? null : latestSubagentRun(runsByChildSessionKey.get(key) ?? [], (entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId)) ?? null;
	} };
}
function buildSubagentRunReadIndexFromRuns(params) {
	const { runs } = params;
	const now = params.now ?? Date.now();
	const topology = buildSubagentRunReadTopology(params);
	const { inputs, inMemoryDisplayByChildSessionKey, runsByChildSessionKey, latestRunsByChildSessionKey, runsByControllerSessionKey, swarmRunsByRequesterSessionKey, getDescendantRuns } = topology;
	const isRetainedReadRun = (entry, clock = now) => {
		if (isRetainedUnendedSubagentRun(entry, clock)) return true;
		if (hasSubagentRunEnded(entry)) return false;
		const current = inMemoryDisplayByChildSessionKey.get(entry.childSessionKey.trim());
		return current !== void 0 && isSameSubagentRun(current, entry) && isRetainedUnendedSubagentRun(current, clock);
	};
	const atTime = (clock, captured) => {
		const activeDescendantCountBySessionKey = /* @__PURE__ */ new Map();
		const pendingDescendantCountBySessionKey = /* @__PURE__ */ new Map();
		const admissionPendingDescendantCountBySessionKey = /* @__PURE__ */ new Map();
		const displayByChildSessionKey = /* @__PURE__ */ new Map();
		const getDisplaySubagentRun = (childSessionKey) => {
			const key = childSessionKey.trim();
			if (!key || !runsByChildSessionKey.has(key)) return null;
			if (displayByChildSessionKey.has(key)) return displayByChildSessionKey.get(key) ?? null;
			const selected = inMemoryDisplayByChildSessionKey.get(key) ?? latestSubagentRun(runsByChildSessionKey.get(key) ?? [], (entry) => captured?.has(entry) ?? isRetainedReadRun(entry, clock)) ?? latestRunsByChildSessionKey.get(key) ?? null;
			displayByChildSessionKey.set(key, selected);
			return selected;
		};
		const countActiveDescendantRuns = (rootSessionKey) => {
			const root = rootSessionKey.trim();
			const descendants = getDescendantRuns(root);
			if (!descendants.length) return 0;
			if (activeDescendantCountBySessionKey.has(root)) return activeDescendantCountBySessionKey.get(root) ?? 0;
			let count = 0;
			for (const entry of descendants) if (isRetainedReadRun(entry, clock)) count += 1;
			activeDescendantCountBySessionKey.set(root, count);
			return count;
		};
		const countPendingDescendantRunsInternal = (rootSessionKey, options) => {
			const excludedRunId = options?.excludeRunId?.trim();
			let count = 0;
			for (const entry of getDescendantRuns(rootSessionKey)) {
				if (entry.runId === excludedRunId) continue;
				if (options?.settledBefore !== void 0 && hasSubagentRunEnded(entry) && entry.execution.endedAt < options.settledBefore) continue;
				if (hasSubagentRunEnded(entry) ? typeof entry.cleanupCompletedAt !== "number" && !(options?.excludeSuspendedDelivery === true && isDeliverySuspended(entry)) && !(options?.treatSuspendedDeliveryAsSettled === true && isDeliveryTerminalForRequesterSettle(entry)) : isRetainedReadRun(entry, clock)) {
					count += 1;
					if (options?.stopAtFirst === true) return count;
				}
			}
			return count;
		};
		const countPendingDescendantRuns = (rootSessionKey, options) => {
			const root = rootSessionKey.trim();
			if (!getDescendantRuns(root).length) return 0;
			const counts = options?.excludeSuspendedDelivery ? admissionPendingDescendantCountBySessionKey : pendingDescendantCountBySessionKey;
			if (counts.has(root)) return counts.get(root) ?? 0;
			const count = countPendingDescendantRunsInternal(root, options);
			counts.set(root, count);
			return count;
		};
		const hasDescendantRunAwaitingSettle = (rootSessionKey, excludeRunId, settledBefore) => countPendingDescendantRunsInternal(rootSessionKey, {
			excludeRunId,
			settledBefore,
			treatSuspendedDeliveryAsSettled: true,
			stopAtFirst: true
		}) > 0;
		const listDescendantRunsForRequester = (rootSessionKey) => [...getDescendantRuns(rootSessionKey)];
		return {
			inputs,
			revision: topology.revision,
			atTime,
			patch,
			getDisplaySubagentRun,
			latestRunsByChildSessionKey,
			runsByChildSessionKey,
			countActiveDescendantRuns,
			countPendingDescendantRuns,
			hasDescendantRunAwaitingSettle,
			listDescendantRunsForRequester,
			runsByControllerSessionKey,
			swarmRunsByRequesterSessionKey
		};
	};
	function patch(changes, inMemoryChanges, clock = Date.now()) {
		topology.patch(changes, inMemoryChanges);
		return atTime(clock);
	}
	return atTime(now, new Set([...runs.values()].filter((entry) => isRetainedReadRun(entry))));
}
/**
* Returns the latest-generation run for a child session.
*
* `matches` narrows the candidates before the generation comparison, so callers
* that own a specific row class (a paused continuation target, say) select the
* newest row of that class rather than the newest row overall. Without it a
* sibling registered at a higher generation hides the row the caller owns.
*/
function getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, matches, childAgentId) {
	const key = childSessionKey.trim();
	if (!key) return;
	return latestSubagentRun(runs instanceof Map ? runs.values() : runs, (entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId) && (!matches || matches(entry)));
}
/** Latest run for a record's child session, scoped to the owner that record captured. */
function getLatestSubagentRunForChild(runs, child) {
	return getLatestSubagentRunByChildSessionKeyFromRuns(runs, child.childSessionKey, void 0, child.childAgentId);
}
/** Returns the preferred run for a child session, active first then latest ended. */
function getSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, childAgentId) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return latestSubagentRun(runs.values(), (entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId) && isRetainedUnendedSubagentRun(entry)) ?? latestSubagentRun(runs.values(), (entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId)) ?? null;
}
function resolveRequesterForChildSessionFromRuns(runs, childSessionKey, childAgentId) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, void 0, childAgentId);
	if (!latest) return null;
	return {
		requesterSessionKey: latest.requesterSessionKey,
		requesterAgentId: latest.requesterAgentId,
		requesterOrigin: latest.requesterOrigin
	};
}
function shouldIgnorePostCompletionAnnounceForSessionFromRuns(runs, childSessionKey, childAgentId) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, void 0, childAgentId);
	return Boolean(latest && latest.spawnMode !== "session" && typeof latest.execution.endedAt === "number" && typeof latest.cleanupCompletedAt === "number" && latest.cleanupCompletedAt >= latest.execution.endedAt);
}
function listSwarmRunsForGroupFromRuns(runs, groupId, requesterSessionKey, requesterAgentId) {
	const key = groupId.trim();
	const requesterKey = requesterSessionKey?.trim();
	return [...runs.values()].filter((entry) => entry.collect === true && entry.groupId === key && (!requesterKey || (entry.swarmRequesterSessionKey ?? entry.requesterSessionKey) === requesterKey) && (!requesterAgentId || entry.requesterAgentId === requesterAgentId));
}
/** Counts active direct child runs plus completed children that still have pending descendants. */
function countActiveRunsForSessionFromRuns(runs, controllerSessionKey, options) {
	const key = controllerSessionKey.trim();
	if (!key) return 0;
	const now = Date.now();
	let readIndex;
	const latestByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		if (options?.collect !== void 0 && entry.collect === true !== options.collect) continue;
		if (resolveConcurrencyOwnerSessionKey(entry) !== key) continue;
		if (options?.requesterAgentId && entry.requesterAgentId !== options.requesterAgentId) continue;
		recordLatestSubagentRun(latestByChildSessionKey, entry.childSessionKey, entry);
	}
	let count = 0;
	for (const entry of latestByChildSessionKey.values()) {
		if (isRetainedUnendedSubagentRun(entry)) {
			count += 1;
			continue;
		}
		readIndex ??= buildSubagentRunReadIndexFromRuns({
			runs,
			now
		});
		if (readIndex.countPendingDescendantRuns(entry.childSessionKey, { excludeSuspendedDelivery: true }) > 0) count += 1;
	}
	return count;
}
function scopeRootDescendantsToRequesterAgent(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds) {
	return requesterAgentId || requesterStorePath !== void 0 || rootRunIds ? new Map([...runs].filter(([, entry]) => entry.requesterSessionKey !== rootSessionKey || (!rootRunIds || rootRunIds.has(entry.runId)) && (!requesterAgentId || entry.requesterAgentId === requesterAgentId) && (requesterStorePath === void 0 || (entry.requesterStorePath ?? null) === requesterStorePath))) : runs;
}
function countActiveDescendantRunsFromRuns(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds) {
	return buildSubagentRunReadIndexFromRuns({ runs: scopeRootDescendantsToRequesterAgent(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds) }).countActiveDescendantRuns(rootSessionKey);
}
/** Counts descendants that are live or ended but not yet cleaned up. */
function countPendingDescendantRunsFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).countPendingDescendantRuns(rootSessionKey);
}
/**
* True when any descendant below a root session has not reached a terminal
* settle. Differs from the pending count in one way: a run whose final
* delivery was suspended counts as settled — suspension is terminal for
* automatic announce retries, so requester-drain decisions must not wait on it.
*/
function hasDescendantRunAwaitingSettleFromRuns(runs, rootSessionKey, excludeRunId, requesterAgentId, requesterStorePath, settledBefore, rootRunIds) {
	return buildSubagentRunReadIndexFromRuns({ runs: scopeRootDescendantsToRequesterAgent(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds) }).hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId, settledBefore);
}
function listDescendantRunsForRequesterFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).listDescendantRunsForRequester(rootSessionKey);
}
//#endregion
export { shouldIgnorePostCompletionAnnounceForSessionFromRuns as _, countPendingDescendantRunsFromRuns as a, getSubagentRunByChildSessionKeyFromRuns as c, listRunsForControllerFromRuns as d, listRunsForRequesterFromRuns as f, selectConnectedSettledSubagentWave as g, resolveRequesterForChildSessionFromRuns as h, countActiveRunsForSessionFromRuns as i, hasDescendantRunAwaitingSettleFromRuns as l, matchesSubagentRequesterSession as m, buildSubagentRunReadIndexFromRuns as n, getLatestSubagentRunByChildSessionKeyFromRuns as o, listSwarmRunsForGroupFromRuns as p, countActiveDescendantRunsFromRuns as r, getLatestSubagentRunForChild as s, buildLatestSubagentRunReadIndexFromRuns as t, listDescendantRunsForRequesterFromRuns as u };
