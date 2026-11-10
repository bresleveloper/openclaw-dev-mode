import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isVitestRuntimeEnv } from "./env-DbG527wb.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { m as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as prepareOpenClawStateReadSource, r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { n as resolveRecordedRequester, t as matchesSubagentChildSessionOwner } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { N as recordLatestSubagentRun, O as isSameSubagentRun, i as resolveControllerSessionKey, j as latestSubagentRun, m as isDeliverySuspended, n as collectSubagentSessionReadKeys, r as buildSubagentRunReadTopology, t as SubagentSessionReadLookup, v as projectSubagentRunForSessionList } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, m as immutableSubagentRunSessionList, p as immutableSubagentRun, r as freezeSubagentRunReadRecord, s as getSubagentRunsForChildSession, u as getSubagentSessionReadLookup, y as publishSubagentRunChanges } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { n as hasSubagentRunEnded, r as isRetainedUnendedSubagentRun } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { n as isCanonicalSubagentRunRecord } from "./subagent-registry.store.codec-D57MwX5M.mjs";
import { setImmediate } from "node:timers/promises";
//#region src/agents/subagents/registry/subagent-registry-queries.ts
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
	})) && (!latestRuns || latestRuns.getLatestSubagentRun(entry.childSessionKey, entry.childAgentId) === entry) && (!options?.requesterAgentId || resolveRecordedRequester(entry) === options.requesterAgentId) && (options?.requesterStorePath === void 0 || (entry.requesterStorePath ?? null) === options.requesterStorePath) && (typeof lowerBound !== "number" || entry.createdAt >= lowerBound) && (typeof upperBound !== "number" || entry.createdAt <= upperBound));
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
	let componentStart = 0;
	let componentLength = 0;
	let componentEnd = 0;
	let containsTarget = false;
	for (const next of sorted) {
		if (componentLength > 0 && next.entry.createdAt > componentEnd) {
			if (containsTarget) break;
			componentStart += componentLength;
			componentLength = 0;
		}
		componentEnd = componentLength === 0 ? next.endedAt : Math.max(componentEnd, next.endedAt);
		componentLength += 1;
		containsTarget ||= next.originalIndex === targetIndex;
	}
	return [target, ...sorted.slice(componentStart, componentStart + componentLength).filter((item) => item.originalIndex !== targetIndex).toSorted((a, b) => a.originalIndex - b.originalIndex).map((item) => item.entry)];
}
function listRunsForControllerFromRuns(runs, controllerSessionKey, controllerAgentId) {
	const key = controllerSessionKey.trim();
	if (!key) return [];
	const keyOwner = parseAgentSessionKey(key)?.agentId;
	return [...runs.values()].filter((entry) => resolveControllerSessionKey(entry) === key && (!controllerAgentId || (keyOwner ?? entry.requesterAgentId) === controllerAgentId));
}
function buildLatestSubagentRunReadIndexFromRuns(runs) {
	const runsByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		const childSessionKey = entry.childSessionKey.trim();
		if (!childSessionKey) continue;
		const bucket = runsByChildSessionKey.get(childSessionKey) ?? [];
		bucket.push(entry);
		runsByChildSessionKey.set(childSessionKey, bucket);
	}
	return { getLatestSubagentRun: (childSessionKey, childAgentId) => {
		const key = childSessionKey.trim();
		return latestSubagentRun(runsByChildSessionKey.get(key) ?? [], (entry) => matchesSubagentChildSessionOwner({
			childSessionKey: key,
			childAgentId: entry.childAgentId
		}, key, childAgentId)) ?? null;
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
		const countDescendantRuns = (rootSessionKey, options) => {
			const excludedRunId = options?.excludeRunId?.trim();
			let count = 0;
			for (const entry of getDescendantRuns(rootSessionKey)) {
				if (entry.runId === excludedRunId) continue;
				if (options?.settledBefore !== void 0 && hasSubagentRunEnded(entry) && entry.execution.endedAt < options.settledBefore) continue;
				if (hasSubagentRunEnded(entry) ? !options?.activeOnly && typeof entry.cleanupCompletedAt !== "number" && !(options?.excludeSuspendedDelivery === true && isDeliverySuspended(entry)) && !(options?.treatSuspendedDeliveryAsSettled === true && isDeliveryTerminalForRequesterSettle(entry)) : isRetainedReadRun(entry, clock)) {
					count += 1;
					if (options?.stopAtFirst === true) return count;
				}
			}
			return count;
		};
		const cachedDescendantCount = (rootSessionKey, counts, options) => {
			const root = rootSessionKey.trim();
			if (!getDescendantRuns(root).length) return 0;
			if (counts.has(root)) return counts.get(root) ?? 0;
			const count = countDescendantRuns(root, options);
			counts.set(root, count);
			return count;
		};
		const countActiveDescendantRuns = (rootSessionKey) => cachedDescendantCount(rootSessionKey, activeDescendantCountBySessionKey, { activeOnly: true });
		const countPendingDescendantRuns = (rootSessionKey, options) => cachedDescendantCount(rootSessionKey, options?.excludeSuspendedDelivery ? admissionPendingDescendantCountBySessionKey : pendingDescendantCountBySessionKey, options);
		const hasDescendantRunAwaitingSettle = (rootSessionKey, excludeRunId, settledBefore) => countDescendantRuns(rootSessionKey, {
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
			requesterSessionKeys: topology.requesterSessionKeys,
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
/** Admission prefers a retained active run, then the latest generation. */
function getSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, childAgentId, liveRuns) {
	return getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, (entry) => {
		const live = liveRuns?.get(entry.runId);
		return isRetainedUnendedSubagentRun(live && isSameSubagentRun(live, entry) ? live : entry);
	}, childAgentId) ?? getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, void 0, childAgentId) ?? null;
}
/** Latest run for a record's child session, scoped to the owner that record captured. */
function getLatestSubagentRunForChild(runs, child) {
	return getLatestSubagentRunByChildSessionKeyFromRuns(runs, child.childSessionKey, void 0, child.childAgentId);
}
function shouldIgnorePostCompletionAnnounceForSessionFromRuns(runs, childSessionKey, childAgentId) {
	const latest = getLatestSubagentRunForChild(runs, {
		childSessionKey,
		childAgentId
	});
	return Boolean(latest && latest.spawnMode !== "session" && typeof latest.execution.endedAt === "number" && typeof latest.cleanupCompletedAt === "number" && latest.cleanupCompletedAt >= latest.execution.endedAt);
}
function listSwarmRunsForGroupFromRuns(runs, groupId, requesterSessionKey, requesterAgentId) {
	const key = groupId.trim();
	const requesterKey = requesterSessionKey?.trim();
	return [...runs.values()].filter((entry) => entry.collect === true && entry.groupId === key && (!requesterKey || (entry.swarmRequesterSessionKey ?? entry.requesterSessionKey) === requesterKey) && (!requesterAgentId || resolveRecordedRequester(entry) === requesterAgentId));
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
		if ((entry.collect ? entry.swarmRequesterSessionKey?.trim() || resolveControllerSessionKey(entry) : resolveControllerSessionKey(entry)) !== key) continue;
		if (options?.requesterAgentId && resolveRecordedRequester(entry) !== options.requesterAgentId) continue;
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
function buildScopedSubagentRunReadIndexFromRuns(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds) {
	return buildSubagentRunReadIndexFromRuns({ runs: requesterAgentId || requesterStorePath !== void 0 || rootRunIds ? new Map([...runs].filter(([, entry]) => entry.requesterSessionKey !== rootSessionKey || (!rootRunIds || rootRunIds.has(entry.runId)) && (!requesterAgentId || resolveRecordedRequester(entry) === requesterAgentId) && (requesterStorePath === void 0 || (entry.requesterStorePath ?? null) === requesterStorePath))) : runs });
}
function countActiveDescendantRunsFromRuns(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds) {
	return buildScopedSubagentRunReadIndexFromRuns(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds).countActiveDescendantRuns(rootSessionKey);
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
	return buildScopedSubagentRunReadIndexFromRuns(runs, rootSessionKey, requesterAgentId, requesterStorePath, rootRunIds).hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId, settledBefore);
}
function listDescendantRunsForRequesterFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).listDescendantRunsForRequester(rootSessionKey);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.read.ts
/** Restore publishes only after the streamed snapshot and its reader have settled. */
async function readAllSubagentRunsInWorker(context) {
	const runs = /* @__PURE__ */ new Map();
	const order = [];
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, { type: "subagents.restore" }, {
		context,
		current: true,
		signal: getAsyncWorkSignal(),
		onChunk(value) {
			if (!Array.isArray(value)) throw new Error("Subagent restore omitted its registry batch");
			for (const item of value) {
				if (!isRecord(item) || !isCanonicalSubagentRunRecord(item.entry) || typeof item.createdAt !== "number") throw new Error("Subagent restore returned an invalid registry row");
				const entry = item.entry;
				runs.set(entry.runId, immutableSubagentRun(entry));
				order.push([entry.runId, item.createdAt]);
			}
		}
	});
	if (reply && (!reply.ok || reply.type !== "subagents.restore" || reply.count !== runs.size)) throw new Error("Subagent restore did not settle its complete registry snapshot");
	order.sort((a, b) => a[1] - b[1] || Buffer.compare(Buffer.from(a[0]), Buffer.from(b[0])));
	const restored = new Map(order.map(([runId]) => [runId, runs.get(runId)]));
	await setImmediate();
	return restored;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-cache.ts
function getSessionListLookup(cache, snapshot) {
	const state = cache.state;
	if (state.snapshot !== snapshot) return new SubagentSessionReadLookup(snapshot);
	return state.lookup ??= new SubagentSessionReadLookup(snapshot);
}
function indexedSnapshotRows(snapshot, keys) {
	return keys.map((key) => expectDefined(snapshot.get(key), "indexed subagent cache entry"));
}
function shouldReadPersistedSubagentRuns() {
	return !isVitestRuntimeEnv() || process.env.OPENCLAW_TEST_READ_SUBAGENT_RUNS_FROM_SQLITE === "1";
}
function captureSubagentFactsAdmission(databasePath = resolveOpenClawStateSqlitePath()) {
	return captureOpenClawStateDatabaseReadAdmission(databasePath);
}
function matchesSubagentCacheAdmission(previous, current) {
	if (!previous) return true;
	if (previous.identity.key !== current.identity.key) return false;
	try {
		previous.assertCurrent();
		return true;
	} catch {
		return false;
	}
}
function setOrDeleteRun(runs, runId, entry) {
	if (entry) runs.set(runId, entry);
	else runs.delete(runId);
}
function applySubagentRunChanges(runs, changes) {
	for (const [runId, { entry }] of changes ?? []) setOrDeleteRun(runs, runId, entry);
	return runs;
}
/** Selecting a read must not consume another database owner's publication. */
function selectSubagentCacheStateForRead(state, context) {
	const identity = state.admission?.identity;
	return (context ? matchesSubagentCacheAdmission(state.admission, context.admission) && (state.sourceIdentity === void 0 || state.sourceIdentity === context.admission.identity.key) : !identity || identity === openClawStateDatabaseCache.getKnownOpenClawStateDatabaseIdentity(resolveOpenClawStateSqlitePath())) ? state : {};
}
function rememberSubagentRunsSnapshot(cache, runs, changedRunIds, databasePath) {
	let admission;
	try {
		admission = captureSubagentFactsAdmission(databasePath);
	} catch (error) {
		if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		cache.state = {};
		return;
	}
	const previous = selectSubagentCacheStateForRead(cache.state, { admission });
	const owner = {
		admission,
		sourceIdentity: admission.identity.key,
		pending: previous.pending
	};
	if (previous.pending?.changes && changedRunIds) for (const runId of changedRunIds) {
		const entry = runs.get(runId);
		previous.pending.changes.set(runId, { entry: entry ? cache.copy(entry) : void 0 });
	}
	const snapshot = previous.snapshot;
	if (!changedRunIds) {
		const replacement = new Map([...runs].map(([runId, entry]) => [runId, cache.copy(entry)]));
		if (previous.pending?.changes) {
			previous.pending.replacement = replacement;
			previous.pending.changes.clear();
		}
		cache.state = {
			snapshot: replacement,
			...owner
		};
		return;
	}
	if (!snapshot) {
		const changes = previous.changes ?? /* @__PURE__ */ new Map();
		for (const runId of changedRunIds) {
			const entry = runs.get(runId);
			changes.set(runId, { entry: entry ? cache.copy(entry) : void 0 });
		}
		cache.state = {
			changes,
			...owner
		};
		return;
	}
	const lookup = previous.lookup;
	previous.lookup = void 0;
	for (const runId of new Set(changedRunIds)) {
		const entry = runs.get(runId);
		setOrDeleteRun(snapshot, runId, entry ? cache.copy(entry) : void 0);
		lookup?.set(runId, snapshot.get(runId));
	}
	cache.state = {
		snapshot,
		...owner,
		...lookup ? { lookup } : {}
	};
}
function getPersistedSubagentRunsSnapshot(cache, prepared) {
	const context = prepared ?? captureOpenClawStateReadContext();
	context.maintenanceScope?.assertAdmission();
	const admission = context.admission;
	if (selectSubagentCacheStateForRead(cache.state, context) !== cache.state) {
		if (!prepared) cache.state = {
			admission,
			sourceIdentity: admission.identity.key
		};
		return null;
	}
	return cache.state.pending ? null : cache.state.snapshot ?? null;
}
function loadPersistedSubagentRunsForRead(cache, prepared) {
	const cached = getPersistedSubagentRunsSnapshot(cache, prepared);
	if (cached) return cached;
	throw new Error("Subagent registry facts must be prepared before synchronous reads");
}
function assertSubagentReadContext(context) {
	getAsyncWorkSignal()?.throwIfAborted();
	context.maintenanceScope?.assertAdmission();
	context.admission.assertCurrent();
}
function getSubagentRunsSnapshot(inMemoryRuns, cache, scope) {
	const merged = /* @__PURE__ */ new Map();
	if (shouldReadPersistedSubagentRuns()) {
		const cached = loadPersistedSubagentRunsForRead(cache, scope?.context);
		const persisted = scope?.load ? scope.load() : scope?.selectCached ? indexedSnapshotRows(cached, scope.selectCached(getSessionListLookup(cache, cached))) : cached.values();
		for (const entry of persisted) if (!scope || scope.matches(entry)) merged.set(entry.runId, entry);
		const state = selectSubagentCacheStateForRead(cache.state, scope?.context);
		for (const [runId, { entry }] of state.changes ?? []) setOrDeleteRun(merged, runId, entry && (!scope || scope.matches(entry)) ? entry : void 0);
	}
	for (const [runId, entry] of scope?.liveRunIds ? selectedEntries(inMemoryRuns, scope.liveRunIds) : inMemoryRuns) setOrDeleteRun(merged, runId, !scope || scope.matches(entry) ? cache.project(entry) : void 0);
	return merged;
}
var SubagentSessionListUnavailableError = class extends Error {};
async function readCompactSubagentRuns(context) {
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, { type: "subagents.sessionList" }, { context });
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "subagents.sessionList") throw new Error("Unexpected compact subagent registry read result");
	if ("unavailable" in reply) {
		const failure = new Error(reply.unavailable.message);
		retainOpenClawStateWorkerErrorPayload(failure, reply.unavailable.error);
		throw new SubagentSessionListUnavailableError(reply.unavailable.message, { cause: hydrateOpenClawStateWorkerError(failure, { includeOrdinary: true }) });
	}
	reply.runs.forEach(freezeSubagentRunReadRecord);
	return reply.runs;
}
async function readFullSubagentRuns(context, scope, options = {}) {
	if (scope.kind === "ids" && scope.runIds.length === 0) return /* @__PURE__ */ new Map();
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "subagents.runs",
		scope
	}, options.current ? {
		context,
		current: true
	} : void 0);
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "subagents.runs" || reply.projection === "maintenance") throw new Error("Unexpected subagent registry read result");
	for (const entry of reply.runs.values()) immutableSubagentRun(entry);
	return reply.runs;
}
async function prepareSubagentRunsCache(cache, load, prepared) {
	const context = prepared ?? captureOpenClawStateWorkerContext();
	const sourceIdentity = context.admission.identity.key;
	if (getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	})) return load(context);
	const state = selectSubagentCacheStateForRead(cache.state, context);
	if (state !== cache.state) cache.state = state;
	if (state.snapshot && !state.pending) return state.snapshot;
	if (!state.pending) {
		state.admission = context.admission;
		state.sourceIdentity = sourceIdentity;
		state.pending = { promise: Promise.resolve().then(async () => {
			const runs = await load(context);
			if (!cache.state.snapshot) cache.state = {
				snapshot: applySubagentRunChanges(runs, cache.state.changes),
				admission: context.admission,
				sourceIdentity
			};
		}) };
	}
	const fill = state.pending;
	try {
		await fill.promise;
		return expectDefined(cache.state.snapshot, "prepared subagent registry snapshot");
	} finally {
		if (cache.state.pending === fill) cache.state.pending = void 0;
	}
}
/** Apply local commits made during restore before publishing the durable rows. */
async function consumeFreshSubagentRuns(cache, context, consume) {
	while (cache.state.pending) await cache.state.pending.promise;
	const state = {
		...selectSubagentCacheStateForRead(cache.state, context),
		admission: captureSubagentFactsAdmission(context.admission.databasePath),
		sourceIdentity: context.admission.identity.key
	};
	cache.state = state;
	let result;
	const fill = {
		changes: /* @__PURE__ */ new Map(),
		promise: Promise.resolve().then(async () => {
			const loaded = await readAllSubagentRunsInWorker(context);
			assertSubagentReadContext(context);
			const runs = applySubagentRunChanges(fill.replacement ?? loaded, fill.changes);
			result = consumeSubagentRuns(runs, () => consume(runs));
		})
	};
	state.pending = fill;
	try {
		await fill.promise;
		return result;
	} finally {
		if (cache.state.pending === fill) cache.state.pending = void 0;
	}
}
function acceptedFullSnapshot(cache, context) {
	const state = selectSubagentCacheStateForRead(cache.state, context);
	return !getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	}) ? state.snapshot : void 0;
}
function consumeSubagentRuns(runs, consume) {
	getAsyncWorkSignal()?.throwIfAborted();
	const result = consume(runs);
	if (isPromiseLike(result)) {
		Promise.resolve(result).catch(() => {});
		throw new Error("Subagent registry read consumers must remain synchronous");
	}
	return result;
}
function mergeSelectedFullRuns(cache, inMemoryRuns, persisted, matches, { context, runIds, freshPersisted = false } = {}) {
	const current = context && !freshPersisted ? acceptedFullSnapshot(cache, context) : void 0;
	const merged = /* @__PURE__ */ new Map();
	for (const [runId, entry] of selectedEntries(current ?? persisted, runIds)) if (matches(entry)) merged.set(runId, entry);
	const state = selectSubagentCacheStateForRead(cache.state, context);
	if (context && !freshPersisted && !getActiveOpenClawStateDatabaseReadSnapshot({
		path: context.admission.databasePath,
		env: context.environment
	})) for (const [runId, { entry }] of state.changes ? selectedEntries(state.changes, runIds) : []) setOrDeleteRun(merged, runId, entry && matches(entry) ? entry : void 0);
	for (const [runId, entry] of selectedEntries(inMemoryRuns, runIds)) setOrDeleteRun(merged, runId, matches(entry) ? entry : void 0);
	return merged;
}
function* selectedEntries(rows, runIds) {
	if (!runIds) {
		yield* rows;
		return;
	}
	for (const runId of runIds) {
		const entry = rows.get(runId);
		if (entry !== void 0) yield [runId, entry];
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-snapshot.ts
function selectionScope(selected) {
	const runIds = new Set(selected.runIds);
	const sessionKeys = new Set(selected.sessionKeys);
	return {
		runIds,
		sessionKeys,
		matches: (entry) => runIds.has(entry.runId) || sessionKeys.has(entry.requesterSessionKey.trim()) || Boolean(entry.controllerSessionKey && sessionKeys.has(entry.controllerSessionKey.trim()))
	};
}
/** Merge only indexed scope members; live rows veto moved durable ownership. */
function mergeSubagentRunReadScope(inMemoryRuns, compactCache, compact, readScope) {
	if (readScope !== "all") {
		const live = getSubagentSessionReadLookup(inMemoryRuns);
		const durable = getSessionListLookup(compactCache, compact);
		let liveKeys;
		let persistedKeys;
		if ("runIds" in readScope) {
			liveKeys = live.selectRunIds(readScope.runIds);
			persistedKeys = durable.selectRunIds(readScope.runIds, liveKeys);
		} else if ("childSessionKeys" in readScope) {
			const keys = new Set(readScope.childSessionKeys.map((key) => key.trim()).filter(Boolean));
			liveKeys = live.selectChildren(keys);
			persistedKeys = durable.selectChildren(keys);
		} else {
			liveKeys = live.selectReadScope(readScope.sessionKeys, durable, readScope.descendants);
			persistedKeys = durable.selectReadScope(readScope.sessionKeys, live, readScope.descendants, liveKeys);
		}
		const snapshot = /* @__PURE__ */ new Map();
		for (const key of /* @__PURE__ */ new Set([...persistedKeys, ...liveKeys])) {
			const liveEntry = inMemoryRuns.get(key);
			const entry = liveEntry ? projectSubagentRunForSessionList(liveEntry) : compact.get(key);
			if (entry) snapshot.set(key, entry);
		}
		return snapshot;
	}
	const snapshot = new Map(compact);
	for (const [runId, entry] of inMemoryRuns) snapshot.set(runId, projectSubagentRunForSessionList(entry));
	return snapshot;
}
/** Prepare worker payloads; authority and publications are merged in the caller's consuming frame. */
async function prepareSubagentRunReadSnapshot(params) {
	const { inMemoryRuns, fullCache, compactCache, select, readScope } = params;
	const requestSignal = getAsyncWorkSignal();
	const privateSnapshot = getActiveOpenClawStateDatabaseReadSnapshot();
	const context = shouldReadPersistedSubagentRuns() ? captureOpenClawStateWorkerContext() : void 0;
	const assertCurrent = () => {
		requestSignal?.throwIfAborted();
		getAsyncWorkSignal()?.throwIfAborted();
		if (getActiveOpenClawStateDatabaseReadSnapshot() !== privateSnapshot) throw new Error("Prepared subagent read left its database snapshot scope");
		if (context) assertSubagentReadContext(context);
	};
	const withLiveFacts = (compact) => mergeSubagentRunReadScope(inMemoryRuns, compactCache, compact, readScope);
	const compact = context ? await prepareSubagentRunsCache(compactCache, readCompactSubagentRuns) : /* @__PURE__ */ new Map();
	const selected = select(withLiveFacts(compact));
	const scope = selectionScope(selected);
	let persisted = context ? acceptedFullSnapshot(fullCache, context) : void 0;
	if (!persisted) {
		persisted = /* @__PURE__ */ new Map();
		if (context) {
			const scopes = [{
				kind: "ids",
				runIds: [...scope.runIds].filter((id) => !inMemoryRuns.has(id))
			}, ...[...scope.sessionKeys].map((sessionKey) => ({
				kind: "session",
				sessionKey
			}))];
			for (const payloadScope of scopes) for (const [runId, entry] of await readFullSubagentRuns(context, payloadScope)) persisted.set(runId, entry);
		}
	}
	const preparedPayloads = persisted;
	const missingAtPreparation = new Set(selected.runIds.filter((runId) => !preparedPayloads.has(runId) && !inMemoryRuns.has(runId)));
	return { consume(consume) {
		assertCurrent();
		const currentFull = context ? acceptedFullSnapshot(fullCache, context) : void 0;
		const currentCompact = context && !privateSnapshot ? getPersistedSubagentRunsSnapshot(compactCache) : compact;
		if (!currentCompact || currentCompact !== compact && !currentFull) return { ready: false };
		const snapshot = withLiveFacts(currentCompact);
		const currentScope = selectionScope(select(snapshot));
		const matches = (entry) => scope.matches(entry) || currentScope.matches(entry);
		const full = mergeSelectedFullRuns(fullCache, inMemoryRuns, preparedPayloads, matches, {
			context,
			runIds: new Set(snapshot.keys())
		});
		for (const entry of full.values()) if (inMemoryRuns.get(entry.runId) !== entry) snapshot.set(entry.runId, projectSubagentRunForSessionList(entry));
		const current = select(snapshot);
		if (current.sessionKeys.some((key) => !scope.sessionKeys.has(key)) || current.runIds.some((runId) => {
			const entry = snapshot.get(runId);
			return entry && !matches(entry);
		}) || current.runIds.some((runId) => !full.has(runId) && !missingAtPreparation.has(runId))) return { ready: false };
		const finalScope = selectionScope(current);
		for (const [runId, entry] of full) if (!finalScope.matches(entry)) full.delete(runId);
		return {
			ready: true,
			value: consumeSubagentRuns(full, (runs) => consume(current, runs))
		};
	} };
}
/** The worker selects durable descendants; current liveness remains parent-owned. */
async function prepareSubagentSessionRunReadSnapshot(params) {
	const { inMemoryRuns, fullCache } = params;
	const context = captureOpenClawStateWorkerContext();
	const signal = getAsyncWorkSignal();
	const roots = Object.freeze([...new Set(params.sessionKeys.map((key) => key.trim()).filter(Boolean))].toSorted());
	const links = getSubagentSessionReadLookup(inMemoryRuns).captureTopology();
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "subagents.runs",
		scope: {
			kind: "descendants",
			sessionKeys: roots,
			liveTopology: links
		}
	}, {
		context,
		current: true
	});
	if (reply && (!reply.ok || reply.type !== "subagents.runs" || reply.projection === "maintenance" || !reply.descendants)) throw new Error("Subagent descendant read omitted its selection");
	const persisted = reply?.runs ?? /* @__PURE__ */ new Map();
	const selected = reply?.descendants?.sessionKeys ?? collectSubagentSessionReadKeys(roots, links);
	return { consume(consume) {
		signal?.throwIfAborted();
		assertSubagentReadContext(context);
		const current = getSubagentSessionReadLookup(inMemoryRuns).captureTopology();
		const relevant = (values) => values.filter((entry) => selected.has(entry.childSessionKey.trim()) || selected.has(entry.requesterSessionKey));
		if (current !== links && JSON.stringify(relevant(current)) !== JSON.stringify(relevant(links))) return { ready: false };
		return {
			ready: true,
			value: consumeSubagentRuns(mergeSelectedFullRuns(fullCache, inMemoryRuns, persisted, (entry) => selected.has(entry.childSessionKey.trim()), {
				context,
				freshPersisted: true,
				runIds: /* @__PURE__ */ new Set([...persisted.keys(), ...getSubagentSessionReadLookup(inMemoryRuns).selectChildren(selected)])
			}), consume)
		};
	} };
}
/** Fresh physical maintenance facts combine with current published resident rows. */
async function prepareSubagentMaintenanceReadSnapshot(inMemoryRuns, cache, options) {
	const context = shouldReadPersistedSubagentRuns() ? captureOpenClawStateWorkerContext() : void 0;
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => {
		signal?.throwIfAborted();
		getAsyncWorkSignal()?.throwIfAborted();
		if (context) assertSubagentReadContext(context);
	};
	const capture = (persisted) => {
		assertCurrent();
		const state = context ? selectSubagentCacheStateForRead(cache.state, context) : {};
		const runs = new Map(state.snapshot ?? persisted);
		for (const [runId, { entry }] of state.changes ?? []) if (entry) runs.set(runId, entry);
		else runs.delete(runId);
		for (const [runId, entry] of inMemoryRuns) runs.set(runId, entry);
		return runs;
	};
	if (!context) return { capture: () => capture(/* @__PURE__ */ new Map()) };
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "subagents.runs",
		scope: { kind: "maintenance" }
	}, {
		context,
		current: true,
		live: options?.live
	});
	if (reply && (!reply.ok || reply.type !== "subagents.runs" || reply.projection !== "maintenance")) throw new Error("Unexpected subagent maintenance read result");
	const persisted = reply?.runs ?? /* @__PURE__ */ new Map();
	return { capture() {
		return capture(persisted);
	} };
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-state.ts
const persistedSubagentRunsReadCache = {
	state: {},
	copy: immutableSubagentRun,
	project: (entry) => entry
};
const persistedSubagentSessionListRunsReadCache = {
	state: {},
	copy: immutableSubagentRunSessionList,
	project: projectSubagentRunForSessionList
};
const committedSwarmNotifications = /* @__PURE__ */ new Map();
function swarmNotification(entry) {
	if (!entry?.collect || !entry.swarmRequesterSessionKey || !entry.requesterAgentId || !entry.groupId) return;
	return {
		event: {
			sessionKey: entry.swarmRequesterSessionKey,
			agentId: entry.requesterAgentId,
			reason: "swarm",
			scope: "runtime"
		},
		signature: JSON.stringify([
			entry.swarmRequesterSessionKey,
			entry.requesterAgentId,
			entry.groupId,
			entry.createdAt,
			entry.childSessionKey,
			entry.execution.status,
			entry.collectorCompletion?.status
		])
	};
}
function updateCommittedSwarmNotifications(runs, changedRunIds) {
	const events = /* @__PURE__ */ new Map();
	const ids = changedRunIds ?? /* @__PURE__ */ new Set([...committedSwarmNotifications.keys(), ...runs.keys()]);
	for (const runId of ids) {
		const previous = committedSwarmNotifications.get(runId);
		const next = swarmNotification(runs.get(runId));
		if (previous?.signature === next?.signature) continue;
		if (next) committedSwarmNotifications.set(runId, next);
		else committedSwarmNotifications.delete(runId);
		for (const notification of [previous, next]) if (notification) {
			const event = notification.event;
			events.set(JSON.stringify([event.sessionKey, event.agentId]), event);
		}
	}
	return [...events.values()];
}
function rememberPersistedSubagentRunsSnapshot(runs, changedRunIds, databasePath) {
	const previous = persistedSubagentSessionListRunsReadCache.state.snapshot ?? persistedSubagentRunsReadCache.state.snapshot;
	const keys = previous && changedRunIds?.flatMap((runId) => [previous.get(runId), runs.get(runId)].flatMap((run) => [
		run?.childSessionKey,
		run?.requesterSessionKey,
		run?.controllerSessionKey,
		run?.swarmRequesterSessionKey
	]));
	for (const cache of [persistedSubagentRunsReadCache, persistedSubagentSessionListRunsReadCache]) rememberSubagentRunsSnapshot(cache, runs, changedRunIds, databasePath);
	return keys;
}
/** Publishes registry rows already committed by a cross-owner shared-state transaction. */
function publishSubagentRunsAfterAtomicStore(runs, changedRunIds, databasePath) {
	subagentRuns.settleCompletionAuthorities(runs, changedRunIds);
	const keys = rememberPersistedSubagentRunsSnapshot(runs, changedRunIds, databasePath);
	const events = updateCommittedSwarmNotifications(runs, changedRunIds);
	return () => {
		publishSubagentRunChanges(keys, changedRunIds, "persistence");
		events.forEach(emitSessionLifecycleEvent);
	};
}
/** Hydration establishes a notification baseline before synchronous ownership observers run. */
function rememberRestoredSubagentRunNotification(entry) {
	const notification = swarmNotification(entry);
	if (notification) committedSwarmNotifications.set(entry.runId, notification);
	else committedSwarmNotifications.delete(entry.runId);
}
/** Existing resident facts, fenced by the physical source rather than a publisher's scope. */
function getSubagentSessionListReadSnapshotIdentity() {
	if (!shouldReadPersistedSubagentRuns()) return subagentRuns;
	return getPersistedSubagentRunsSnapshot(persistedSubagentSessionListRunsReadCache) ?? void 0;
}
/** A long-lived projection retains its source; registry publications still own the facts. */
function createSubagentSessionListReadView(options) {
	const path = options.path ?? resolveOpenClawStateSqlitePath(options.env);
	const source = prepareOpenClawStateReadSource({
		path,
		env: options.env
	});
	const cache = persistedSubagentSessionListRunsReadCache;
	const readPersisted = shouldReadPersistedSubagentRuns();
	const matches = () => true;
	const prepare = (context) => prepareSubagentRunsCache(cache, readCompactSubagentRuns, context);
	return {
		snapshotIdentity() {
			if (!readPersisted) return subagentRuns;
			return getPersistedSubagentRunsSnapshot(cache, source.current()) ?? void 0;
		},
		runs(runIds) {
			if (runIds) {
				const persisted = readPersisted ? getPersistedSubagentRunsSnapshot(cache, source.current()) : void 0;
				const selected = /* @__PURE__ */ new Map();
				for (const runId of runIds) {
					const live = subagentRuns.get(runId);
					const entry = live ? cache.project(live) : persisted?.get(runId);
					if (entry) selected.set(runId, entry);
				}
				return selected;
			}
			return getSubagentRunsSnapshot(subagentRuns, cache, {
				context: readPersisted ? source.current() : void 0,
				matches
			});
		},
		async prepare() {
			if (!readPersisted) return;
			if (getActiveOpenClawStateDatabaseReadSnapshot({
				path,
				env: options.env
			})) throw new Error("Resident subagent preparation cannot adopt a private database snapshot");
			await source.withCurrent(prepare);
		}
	};
}
async function prepareSubagentSessionListReadCache() {
	if (!shouldReadPersistedSubagentRuns()) return;
	if (getActiveOpenClawStateDatabaseReadSnapshot()) throw new Error("Resident subagent preparation cannot adopt a private database snapshot");
	await prepareSubagentRunsCache(persistedSubagentSessionListRunsReadCache, readCompactSubagentRuns);
}
/** History can omit retained child hints only after a failed query has settled cleanly. */
async function prepareOptionalSubagentSessionListReadCache() {
	if (!shouldReadPersistedSubagentRuns()) return true;
	try {
		await prepareSubagentSessionListReadCache();
		return true;
	} catch (error) {
		if (!(error instanceof SubagentSessionListUnavailableError)) throw error;
		return false;
	}
}
function clearSubagentRunsReadCacheForTest() {
	committedSwarmNotifications.clear();
	persistedSubagentRunsReadCache.state = {};
	persistedSubagentSessionListRunsReadCache.state = {};
}
/** Consume a canonical worker read without crossing a cache-publication invalidation. */
function consumeFreshSubagentRegistryRows(context, consume) {
	return consumeFreshSubagentRuns(persistedSubagentRunsReadCache, context, consume);
}
/** Registration shares the loaded registry; committed receipts keep retained generations current. */
async function prepareSubagentRegistrationRows(childSessionKey, selectedRunIds, context) {
	const prepared = await prepareSubagentRunsCache(persistedSubagentRunsReadCache, readAllSubagentRunsInWorker, context);
	const runIds = new Set(selectedRunIds);
	return () => mergeSelectedFullRuns(persistedSubagentRunsReadCache, subagentRuns, prepared, (entry) => runIds.has(entry.runId) || entry.childSessionKey.trim() === childSessionKey, { context });
}
function getSubagentRunsSnapshotForRead(inMemoryRuns) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache);
}
/** All generations of exact children, sharing the existing snapshot and its publication-owned lookup. */
function getSubagentSessionListRunsSnapshotForChildSessions(childSessionKeys) {
	const keys = new Set(childSessionKeys.map((key) => key.trim()).filter(Boolean));
	const selected = /* @__PURE__ */ new Map();
	if (keys.size === 0) return selected;
	const cache = persistedSubagentSessionListRunsReadCache;
	if (shouldReadPersistedSubagentRuns()) {
		const snapshot = loadPersistedSubagentRunsForRead(cache);
		const lookup = getSessionListLookup(cache, snapshot);
		for (const runId of lookup.selectChildren(keys)) {
			const persisted = snapshot.get(runId);
			const live = persisted && subagentRuns.get(persisted.runId);
			const entry = live ? cache.project(live) : persisted;
			if (entry && keys.has(entry.childSessionKey.trim())) selected.set(entry.runId, entry);
		}
	}
	for (const key of keys) for (const entry of getSubagentRunsForChildSession(key)) selected.set(entry.runId, cache.project(entry));
	return selected;
}
function prepareSubagentMaintenanceRunsSnapshotForRead(inMemoryRuns, options) {
	return prepareSubagentMaintenanceReadSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, options);
}
/** Hydrate selected payloads, then capture their current graph and raw owners in one frame. */
async function withSubagentRunReadSnapshot(inMemoryRuns, select, consume, readScope) {
	for (;;) {
		const result = (await prepareSubagentRunReadSnapshot({
			inMemoryRuns,
			fullCache: persistedSubagentRunsReadCache,
			compactCache: persistedSubagentSessionListRunsReadCache,
			select,
			readScope
		})).consume(consume);
		if (result.ready) return result.value;
	}
}
function prepareSubagentRunsSnapshotForSessions(inMemoryRuns, sessionKeys) {
	return prepareSubagentSessionRunReadSnapshot({
		inMemoryRuns,
		sessionKeys,
		fullCache: persistedSubagentRunsReadCache
	});
}
async function prepareSubagentRunsSnapshotForRunIds(inMemoryRuns, runIds) {
	const requested = new Set(runIds.map((runId) => runId.trim()));
	const matches = (entry) => requested.has(entry.runId) || Boolean(entry.swarmRunId && requested.has(entry.swarmRunId));
	const prepared = await prepareSubagentRunReadSnapshot({
		inMemoryRuns,
		fullCache: persistedSubagentRunsReadCache,
		compactCache: persistedSubagentSessionListRunsReadCache,
		readScope: { runIds: requested },
		select: (snapshot) => ({
			runIds: [...snapshot.values()].filter(matches).map((entry) => entry.runId),
			sessionKeys: []
		})
	});
	return { consume(consume) {
		return prepared.consume((selection, runs) => {
			const selected = /* @__PURE__ */ new Map();
			for (const runId of selection.runIds) {
				const entry = runs.get(runId);
				if (entry) selected.set(runId, entry);
			}
			return consume(selected);
		});
	} };
}
/** Admission needs current raw owners, not newly projected session-list rows. */
function countActiveSubagentRunsForSession(inMemoryRuns, requesterSessionKey, options) {
	const runs = new Map(shouldReadPersistedSubagentRuns() ? loadPersistedSubagentRunsForRead(persistedSubagentSessionListRunsReadCache) : void 0);
	for (const [runId, entry] of inMemoryRuns) runs.set(runId, entry);
	return countActiveRunsForSessionFromRuns(runs, requesterSessionKey, options);
}
function getSubagentSessionListRunsSnapshotForRead(inMemoryRuns, controllerSessionKeys) {
	if (controllerSessionKeys) {
		const keys = new Set(controllerSessionKeys.map((key) => key.trim()).filter(Boolean));
		if (keys.size === 0) return /* @__PURE__ */ new Map();
		const matches = (entry) => keys.has(resolveControllerSessionKey(entry));
		const cache = persistedSubagentSessionListRunsReadCache;
		const cached = shouldReadPersistedSubagentRuns() ? getPersistedSubagentRunsSnapshot(cache) : null;
		if (!cached) {
			if (!shouldReadPersistedSubagentRuns()) return getSubagentRunsSnapshot(inMemoryRuns, cache, { matches });
			throw new Error("Subagent session-list facts must be prepared before synchronous reads");
		}
		const lookup = getSessionListLookup(cache, cached);
		return getSubagentRunsSnapshot(inMemoryRuns, cache, {
			load: () => indexedSnapshotRows(cached, lookup.selectControllers(keys)),
			matches
		});
	}
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentSessionListRunsReadCache);
}
/** Current control facts reuse the same membership owner as asynchronous payload reads. */
function getSubagentControlRunsSnapshotForRead(sessionKey) {
	const cache = persistedSubagentSessionListRunsReadCache;
	const compact = shouldReadPersistedSubagentRuns() ? loadPersistedSubagentRunsForRead(cache) : /* @__PURE__ */ new Map();
	return mergeSubagentRunReadScope(subagentRuns, cache, compact, {
		sessionKeys: [sessionKey],
		descendants: false
	});
}
/** Exact rows share the owner snapshot while projecting only their complete requester trees. */
function getSubagentSessionListRunsSnapshotForSessions(inMemoryRuns, sessionKeys) {
	if (!sessionKeys.some((key) => key.trim())) return /* @__PURE__ */ new Map();
	const cache = persistedSubagentSessionListRunsReadCache;
	const cached = shouldReadPersistedSubagentRuns() ? getPersistedSubagentRunsSnapshot(cache) : null;
	const live = getSubagentSessionReadLookup(inMemoryRuns);
	const indexed = (cached ? getSessionListLookup(cache, cached) : live).selectSessions(sessionKeys, live);
	const persisted = cached ? indexedSnapshotRows(cached, indexed.cacheKeys) : [];
	return getSubagentRunsSnapshot(inMemoryRuns, cache, {
		load: () => {
			if (cached) return persisted;
			throw new Error("Subagent session-list facts must be prepared before synchronous reads");
		},
		liveRunIds: /* @__PURE__ */ new Set([...live.selectChildren(indexed.sessionKeys), ...persisted.map((entry) => entry.runId)]),
		matches: (entry) => indexed.sessionKeys.has(entry.childSessionKey.trim())
	});
}
function getSubagentRunsSnapshotForChildSession(inMemoryRuns, childSessionKey, childAgentId) {
	const key = childSessionKey.trim();
	if (!key) return Promise.resolve(/* @__PURE__ */ new Map());
	if (!shouldReadPersistedSubagentRuns() || !getActiveOpenClawStateDatabaseReadSnapshot() && getPersistedSubagentRunsSnapshot(persistedSubagentRunsReadCache)) return Promise.resolve(getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		selectCached: (lookup) => lookup.selectChildren(/* @__PURE__ */ new Set([key])),
		matches: (entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId)
	}));
	return withSubagentRunReadSnapshot(inMemoryRuns, (snapshot) => ({
		runIds: [...snapshot.values()].filter((entry) => matchesSubagentChildSessionOwner(entry, key, childAgentId)).map((entry) => entry.runId),
		sessionKeys: []
	}), (_selection, runs) => new Map(runs), { childSessionKeys: [key] });
}
//#endregion
export { getSubagentRunByChildSessionKeyFromRuns as A, buildLatestSubagentRunReadIndexFromRuns as C, countPendingDescendantRunsFromRuns as D, countActiveDescendantRunsFromRuns as E, listSwarmRunsForGroupFromRuns as F, matchesSubagentRequesterSession as I, selectConnectedSettledSubagentWave as L, listDescendantRunsForRequesterFromRuns as M, listRunsForControllerFromRuns as N, getLatestSubagentRunByChildSessionKeyFromRuns as O, listRunsForRequesterFromRuns as P, shouldIgnorePostCompletionAnnounceForSessionFromRuns as R, readFullSubagentRuns as S, buildSubagentRunReadIndexFromRuns as T, prepareSubagentSessionListReadCache as _, getSubagentControlRunsSnapshotForRead as a, withSubagentRunReadSnapshot as b, getSubagentSessionListReadSnapshotIdentity as c, getSubagentSessionListRunsSnapshotForSessions as d, prepareOptionalSubagentSessionListReadCache as f, prepareSubagentRunsSnapshotForSessions as g, prepareSubagentRunsSnapshotForRunIds as h, createSubagentSessionListReadView as i, hasDescendantRunAwaitingSettleFromRuns as j, getLatestSubagentRunForChild as k, getSubagentSessionListRunsSnapshotForChildSessions as l, prepareSubagentRegistrationRows as m, consumeFreshSubagentRegistryRows as n, getSubagentRunsSnapshotForChildSession as o, prepareSubagentMaintenanceRunsSnapshotForRead as p, countActiveSubagentRunsForSession as r, getSubagentRunsSnapshotForRead as s, clearSubagentRunsReadCacheForTest as t, getSubagentSessionListRunsSnapshotForRead as u, publishSubagentRunsAfterAtomicStore as v, buildScopedSubagentRunReadIndexFromRuns as w, assertSubagentReadContext as x, rememberRestoredSubagentRunNotification as y };
