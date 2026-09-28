import { h as finiteSecondsToTimerSafeMilliseconds, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as trackAsyncWork, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { n as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-CYO2S35x.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { p as hasLiveAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import "./subagent-lifecycle-events-CDQCTuLB.mjs";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/subagents/registry/subagent-registry-publication.ts
let revision = 0;
/** Read projections reuse registry facts until an owner publishes a mutation. */
function getSubagentRegistryPublicationRevision() {
	return revision;
}
function publishSubagentRunChanges(keys) {
	revision++;
	if (!keys?.length) sessionChanges.emit({
		all: true,
		scope: "subagent-runs"
	});
	for (const sessionKey of new Set(keys)) if (sessionKey) sessionChanges.emit({
		sessionKey,
		scope: "runtime"
	});
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-memory.ts
/**
* Process-local live subagent run map.
*
* Shared by registry read/write helpers for active in-memory run state.
*/
const collectorRunIdByChildSessionKey = /* @__PURE__ */ new Map();
const runsByChildSessionKey = /* @__PURE__ */ new Map();
const runsByRequesterSessionKey = /* @__PURE__ */ new Map();
const runsByCollectorGroupKey = /* @__PURE__ */ new Map();
function collectorGroupKey(entry) {
	if (entry.collect !== true || !entry.groupId) return;
	return JSON.stringify([entry.swarmRequesterSessionKey ?? entry.requesterSessionKey, entry.groupId]);
}
function removeIndexedSubagentRun(index, key, runId, entry) {
	if (!key) return;
	const indexedRuns = index.get(key);
	if (indexedRuns?.get(runId) !== entry) return;
	indexedRuns.delete(runId);
	if (indexedRuns.size === 0) index.delete(key);
}
function indexSubagentRun(index, key, runId, entry) {
	if (!key) return;
	const indexedRuns = index.get(key);
	if (indexedRuns) indexedRuns.set(runId, entry);
	else index.set(key, /* @__PURE__ */ new Map([[runId, entry]]));
}
var SubagentRunMap = class extends Map {
	constructor(..._args) {
		super(..._args);
		this.retirementScopes = /* @__PURE__ */ new Set();
		this.completionAuthorities = /* @__PURE__ */ new Map();
		this.operatorCompletionEntries = /* @__PURE__ */ new WeakSet();
	}
	bindCompletionAuthority(entry, authority) {
		this.releaseCompletionAuthority(entry);
		const custody = {
			authority,
			entry,
			stop: () => authority.signal.removeEventListener("abort", revoked)
		};
		const revoked = () => this.releaseCompletionAuthority(custody.entry);
		this.completionAuthorities.set(entry, custody);
		this.operatorCompletionEntries.add(entry);
		authority.signal.addEventListener("abort", revoked, { once: true });
		if (authority.signal.aborted) revoked();
	}
	releaseCompletionAuthority(entry) {
		const custody = this.completionAuthorities.get(entry);
		this.completionAuthorities.delete(entry);
		custody?.stop();
		custody?.authority.release();
	}
	runWithCompletionAuthority(entry, run) {
		const custody = this.completionAuthorities.get(entry);
		if (this.operatorCompletionEntries.has(entry) && this.get(entry.runId) !== entry) throw new Error("Subagent completion authority is no longer active");
		if (entry.endedReason === "subagent-killed" && entry.execution.outcome?.status === "error") return run();
		if (this.operatorCompletionEntries.has(entry) && !custody) throw new Error("Subagent completion authority is no longer active");
		return custody ? custody.authority.run(run) : run();
	}
	runWithCompletionBatchAuthority(batch, run) {
		for (const entry of batch) if (this.operatorCompletionEntries.has(entry) && this.get(entry.runId) !== entry) throw new Error("Subagent completion authority is no longer active");
		const resultEntry = batch.find((entry) => !(entry.endedReason === "subagent-killed" && entry.execution.outcome?.status === "error"));
		if (!resultEntry) return run();
		const first = this.completionAuthorities.get(resultEntry)?.authority.operatorAuthority;
		for (const entry of batch) {
			const source = this.completionAuthorities.get(entry)?.authority.operatorAuthority;
			if (this.operatorCompletionEntries.has(entry) && !source) throw new Error("Subagent completion authority is no longer active");
			source?.assertCurrent();
			if (source?.source !== first?.source || !isDeepStrictEqual(source?.scopes, first?.scopes)) throw new Error("Subagent completion batch has incompatible operator authority");
		}
		return this.runWithCompletionAuthority(resultEntry, run);
	}
	/** Same-task replacement stages custody before publication and can restore it on rollback. */
	transferCompletionAuthority(previous, next) {
		if (this.operatorCompletionEntries.has(previous)) this.operatorCompletionEntries.add(next);
		const custody = this.completionAuthorities.get(previous);
		if (!custody) return () => {};
		this.completionAuthorities.delete(previous);
		custody.entry = next;
		this.completionAuthorities.set(next, custody);
		this.operatorCompletionEntries.add(next);
		return () => {
			if (this.completionAuthorities.get(next) === custody) {
				this.completionAuthorities.delete(next);
				custody.entry = previous;
				this.completionAuthorities.set(previous, custody);
			}
		};
	}
	/** Only acknowledged registry state retires custody; tentative map writes can roll back. */
	settleCompletionAuthorities(committed, changedRunIds) {
		const changed = changedRunIds && new Set(changedRunIds);
		for (const entry of this.completionAuthorities.keys()) {
			if (changed && !changed.has(entry.runId)) continue;
			const record = committed.get(entry.runId);
			if (!record || this.get(entry.runId) !== entry || record.generation !== entry.generation || record.execution.suppressSessionEffects === true || !record.requesterTurnRunId && !record.requesterSettleWake && record.pauseReason !== "sessions_yield" && (record.cleanupCompletedAt !== void 0 || record.delivery?.status === "suspended" || record.delivery?.status === "discarded" || record.suppressCompletionDelivery === true)) this.releaseCompletionAuthority(entry);
		}
	}
	/** A cancellation borrows retirement evidence only for its own lexical lifetime. */
	captureRetirement(entry, isSuccessor) {
		const scope = {
			observation: {
				entry,
				generation: entry.generation,
				createdAt: entry.createdAt,
				state: "selected"
			},
			isSuccessor
		};
		this.retirementScopes.add(scope);
		return {
			get observation() {
				return scope.observation;
			},
			release: () => {
				scope.observation = { state: "superseded" };
				this.retirementScopes.delete(scope);
			}
		};
	}
	/** Publish only accepted ownership, after synchronous registration/replacement rollback decisions. */
	commitOwnership(entry) {
		if (this.get(entry.runId) !== entry) return;
		for (const scope of this.retirementScopes) {
			const previous = scope.observation.entry;
			if (previous && previous !== entry && previous.childSessionKey === entry.childSessionKey && scope.isSuccessor(entry)) scope.observation = { state: "superseded" };
		}
		publishSubagentRunChanges([entry.childSessionKey]);
	}
	/** Normal cleanup calls this only after its deletion commits; raw map deletion is not evidence. */
	confirmRetirement(entry) {
		for (const scope of this.retirementScopes) {
			const observed = scope.observation;
			if (observed.entry === entry && observed.state === "selected" && this.get(entry.runId) !== entry) observed.state = "retired";
		}
		publishSubagentRunChanges([entry.childSessionKey]);
	}
	set(runId, entry) {
		const prev = this.get(runId);
		if (prev) {
			removeIndexedSubagentRun(runsByChildSessionKey, prev.childSessionKey, runId, prev);
			removeIndexedSubagentRun(runsByRequesterSessionKey, prev.requesterSessionKey, runId, prev);
			removeIndexedSubagentRun(runsByCollectorGroupKey, collectorGroupKey(prev), runId, prev);
			if (prev.collect === true && prev.childSessionKey) collectorRunIdByChildSessionKey.delete(prev.childSessionKey);
		}
		super.set(runId, entry);
		indexSubagentRun(runsByChildSessionKey, entry.childSessionKey, runId, entry);
		indexSubagentRun(runsByRequesterSessionKey, entry.requesterSessionKey, runId, entry);
		indexSubagentRun(runsByCollectorGroupKey, collectorGroupKey(entry), runId, entry);
		if (entry.collect === true && entry.childSessionKey) collectorRunIdByChildSessionKey.set(entry.childSessionKey, runId);
		return this;
	}
	delete(runId) {
		const prev = this.get(runId);
		if (prev) {
			removeIndexedSubagentRun(runsByChildSessionKey, prev.childSessionKey, runId, prev);
			removeIndexedSubagentRun(runsByRequesterSessionKey, prev.requesterSessionKey, runId, prev);
			removeIndexedSubagentRun(runsByCollectorGroupKey, collectorGroupKey(prev), runId, prev);
		}
		if (prev?.collect === true && prev.childSessionKey && collectorRunIdByChildSessionKey.get(prev.childSessionKey) === runId) collectorRunIdByChildSessionKey.delete(prev.childSessionKey);
		return super.delete(runId);
	}
	clear() {
		for (const entry of this.completionAuthorities.keys()) this.releaseCompletionAuthority(entry);
		for (const scope of this.retirementScopes) scope.observation = { state: "superseded" };
		this.retirementScopes.clear();
		super.clear();
		collectorRunIdByChildSessionKey.clear();
		runsByChildSessionKey.clear();
		runsByRequesterSessionKey.clear();
		runsByCollectorGroupKey.clear();
		publishSubagentRunChanges();
	}
};
const subagentRuns = new SubagentRunMap();
/** Iterate live generations for one child session without scanning the registry. */
function getSubagentRunsForChildSession(childSessionKey) {
	return runsByChildSessionKey.get(childSessionKey)?.values() ?? [];
}
/** Current requester-owned generations, without restoring or scanning retained rows. */
function getSubagentRunsForRequesterSession(requesterSessionKey) {
	return runsByRequesterSessionKey.get(requesterSessionKey)?.values() ?? [];
}
/** Iterate live collector members for one requester/group archive decision. */
function getSubagentRunsForCollectorGroup(requesterSessionKey, groupId, requesterAgentId) {
	const key = JSON.stringify([requesterSessionKey, groupId]);
	return [...runsByCollectorGroupKey.get(key)?.entries() ?? []].filter(([, entry]) => entry.requesterAgentId === requesterAgentId);
}
/** Resolve a collector tombstone that reserves its child session from ordinary turns. */
function findSwarmCollectorSession(childSessionKey) {
	const key = childSessionKey?.trim();
	if (!key) return;
	const runId = collectorRunIdByChildSessionKey.get(key);
	return runId ? subagentRuns.get(runId) : void 0;
}
/** Resolve the host-registered collector that authorizes a Gateway request. */
function findAuthorizedSwarmCollectorRequest(params) {
	const idempotencyKey = params.idempotencyKey?.trim();
	if (!idempotencyKey) return;
	const entry = findSwarmCollectorSession(params.childSessionKey);
	if (!entry) return;
	return entry.swarmLaunchIdempotencyKey === idempotencyKey && isDeepStrictEqual(entry.outputSchema, params.outputSchema) ? entry : void 0;
}
//#endregion
//#region src/agents/subagents/swarm/swarm-scheduler.ts
function bindSwarmLaunchWork(run, owner) {
	return AsyncLocalStorage.bind(async (...args) => {
		const work = new AsyncWorkScope();
		if (owner) {
			owner.callbackWork = work;
			if (owner.removal) work.beginClose();
		}
		try {
			return await work.track(() => run(...args));
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => work.run(() => work.drain()));
			} finally {
				if (owner?.callbackWork === work) owner.callbackWork = void 0;
			}
		}
	});
}
const lanes = /* @__PURE__ */ new Map();
const pendingRemovals = /* @__PURE__ */ new Set();
const pendingLaunches = /* @__PURE__ */ new Set();
const runLocations = /* @__PURE__ */ new Map();
function publishCapacityChange(item) {
	if (!item.owner || !item.onCapacityChange) return;
	const waiting = isSwarmRunWaitingForCapacity(item.runId, item.owner);
	if (waiting !== (item.reportedCapacityWait === true)) {
		item.reportedCapacityWait = waiting;
		item.onCapacityChange();
	}
}
function publishLaneCapacityChange(lane, previouslyFull) {
	if (previouslyFull !== lane.active.size >= lane.limit) for (const item of lane.queue) publishCapacityChange(item);
}
function finalizeRemovedRun(item, reason = "cancelled") {
	item.removeAbortListener?.();
	item.removeAbortListener = void 0;
	const onRemoved = item.launch?.onRemoved;
	if (item.launch && !item.removal) {
		pendingRemovals.add(item);
		const cleanup = async () => {
			const [launch] = await Promise.allSettled([item.pendingLaunch]);
			await onRemoved?.(reason);
			if (launch.status === "rejected") throw launch.reason;
		};
		item.removal = getAsyncWorkSignal()?.aborted ? cleanup() : trackAsyncWork(cleanup);
		item.callbackWork?.beginClose();
		item.removal.then(() => pendingRemovals.delete(item), (error) => {
			console.warn(`[swarm] Failed queued launch cleanup: ${sanitizeForLog(String(error))}`);
		});
	}
	return item.removal ?? Promise.resolve();
}
async function startQueuedRun(lane, item, launch) {
	item.removeAbortListener?.();
	item.removeAbortListener = void 0;
	lane.active.add(item.runId);
	runLocations.set(item.runId, {
		lane,
		state: "active",
		item
	});
	publishCapacityChange(item);
	publishLaneCapacityChange(lane, false);
	try {
		await launch.start();
	} catch (error) {
		let failurePersisted = false;
		try {
			failurePersisted = await launch.onStartFailure(error);
		} catch {}
		const location = runLocations.get(item.runId);
		if (location?.state !== "active" || location.lane !== lane || location.item !== item) {
			finalizeRemovedRun(item);
			return;
		}
		if (failurePersisted) {
			releaseSwarmRun(item.runId);
			return;
		}
		const previouslyFull = lane.active.size >= lane.limit;
		lane.active.delete(item.runId);
		item.retryReady = false;
		lane.queue.unshift(item);
		runLocations.set(item.runId, {
			lane,
			state: "queued",
			item
		});
		publishLaneCapacityChange(lane, previouslyFull);
		bindSwarmLaunchSignal(item, launch.signal);
		if (runLocations.get(item.runId)?.item !== item) return;
		setTimeout(() => {
			item.retryReady = true;
			if (runLocations.get(item.runId)?.item === item) publishCapacityChange(item);
			pumpLane(lane);
		}, isFastTestRuntimeEnv() ? 1 : 1e3).unref?.();
	}
}
function bindSwarmLaunchSignal(item, signal) {
	item.removeAbortListener?.();
	item.removeAbortListener = void 0;
	if (!signal) return;
	const abort = () => {
		const location = runLocations.get(item.runId);
		if (location?.state === "queued" && location.item === item) removeQueuedSwarmRun(item.runId);
	};
	item.removeAbortListener = () => signal.removeEventListener("abort", abort);
	signal.addEventListener("abort", abort, { once: true });
	if (signal.aborted) abort();
}
function pumpLane(lane) {
	if (lane.pumpScheduled) return;
	lane.pumpScheduled = true;
	queueMicrotask(() => {
		lane.pumpScheduled = false;
		while (lanes.get(lane.groupId) === lane && lane.active.size < lane.limit) {
			const next = lane.queue[0];
			if (!next?.launch || !next.retryReady || next.holds > 0) return;
			lane.queue.shift();
			const completion = createDeferredCore();
			next.pendingLaunch = completion.promise;
			pendingLaunches.add(next);
			startQueuedRun(lane, next, next.launch).finally(() => pendingLaunches.delete(next)).then(completion.resolve, completion.reject);
		}
	});
}
function ensureLane(params) {
	const lane = lanes.get(params.groupId) ?? {
		groupId: params.groupId,
		limit: params.maxConcurrent,
		active: /* @__PURE__ */ new Set(),
		queue: [],
		pumpScheduled: false
	};
	const previouslyFull = lane.active.size >= lane.limit;
	lanes.set(params.groupId, lane);
	lane.limit = params.maxConcurrent;
	for (const runId of params.activeRunIds) {
		if (runLocations.has(runId)) continue;
		lane.active.add(runId);
		runLocations.set(runId, {
			lane,
			state: "active"
		});
	}
	publishLaneCapacityChange(lane, previouslyFull);
	return lane;
}
function deleteLaneIfIdle(lane) {
	if (lanes.get(lane.groupId) === lane && lane.active.size === 0 && lane.queue.length === 0) lanes.delete(lane.groupId);
}
/** Reserve FIFO position before asynchronous spawn preparation begins. */
function reserveSwarmRun(params) {
	const lane = ensureLane(params);
	if (runLocations.has(params.runId)) {
		deleteLaneIfIdle(lane);
		return false;
	}
	const item = {
		runId: params.runId,
		holds: 0,
		retryReady: true
	};
	lane.queue.push(item);
	runLocations.set(params.runId, {
		lane,
		state: "queued",
		item
	});
	return true;
}
/** Bind a committed registration without transferring a retained reservation to a replacement. */
function bindSwarmRunReservation(runId, owner, onCapacityChange) {
	const item = runLocations.get(runId)?.item;
	if (item && item.owner === void 0) {
		item.owner = owner;
		item.onCapacityChange = onCapacityChange;
		publishCapacityChange(item);
	}
}
/** Includes held/preactivation work and the launch awaiting Gateway acceptance. */
function ownsSwarmRunReservation(runId, owner) {
	return runLocations.get(runId)?.item?.owner === owner;
}
/** Preparation, cancellation holds, and already-admitted launches are not slot waits. */
function isSwarmRunWaitingForCapacity(runId, owner) {
	const location = runLocations.get(runId);
	return Boolean(location?.state === "queued" && location.item.owner === owner && location.item.launch && location.item.retryReady && location.item.holds === 0 && location.lane.active.size >= location.lane.limit);
}
/** Attach launch work to an existing FIFO reservation. */
function activateSwarmRun(params) {
	const location = runLocations.get(params.runId);
	if (!location || location.state !== "queued" || location.lane.groupId !== params.groupId) throw new Error(`swarm scheduler reservation missing for run ${params.runId}`);
	const { lane, item } = location;
	const onRemoved = params.onRemoved;
	item.launch = {
		start: bindSwarmLaunchWork(params.start, item),
		onStartFailure: bindSwarmLaunchWork(params.onStartFailure, item),
		onRemoved: onRemoved && bindSwarmLaunchWork(onRemoved),
		lifecycleOwner: params.lifecycleOwner,
		signal: params.signal
	};
	bindSwarmLaunchSignal(item, params.signal);
	publishCapacityChange(item);
	pumpLane(lane);
}
function enqueueSwarmRun(params) {
	if (!reserveSwarmRun(params)) throw new Error(`swarm scheduler run already exists: ${params.runId}`);
	activateSwarmRun(params);
}
function releaseSwarmRun(runId) {
	const location = runLocations.get(runId);
	if (!location || location.state !== "active") return false;
	const previouslyFull = location.lane.active.size >= location.lane.limit;
	location.lane.active.delete(runId);
	runLocations.delete(runId);
	publishLaneCapacityChange(location.lane, previouslyFull);
	pumpLane(location.lane);
	deleteLaneIfIdle(location.lane);
	return true;
}
function removeQueuedSwarmRun(runId) {
	const location = runLocations.get(runId);
	if (!location || location.state !== "queued") return false;
	const index = location.lane.queue.indexOf(location.item);
	location.lane.queue.splice(index, 1);
	runLocations.delete(runId);
	finalizeRemovedRun(location.item);
	publishCapacityChange(location.item);
	pumpLane(location.lane);
	deleteLaneIfIdle(location.lane);
	return true;
}
/** Retire this Gateway's launch resources while leaving durable queued rows available for restart. */
async function closeSwarmScheduler(lifecycleOwner) {
	const items = /* @__PURE__ */ new Set([...pendingRemovals, ...pendingLaunches]);
	for (const location of runLocations.values()) if (location.item?.launch) items.add(location.item);
	const owned = [...items].filter((item) => item.launch?.lifecycleOwner === lifecycleOwner);
	const removal = owned.map((item) => finalizeRemovedRun(item, "shutdown"));
	for (const item of owned) if (runLocations.get(item.runId)?.item === item && !removeQueuedSwarmRun(item.runId)) releaseSwarmRun(item.runId);
	const settled = await Promise.allSettled(removal);
	for (const [index, item] of owned.entries()) {
		const result = settled[index];
		if (result.status !== "rejected" || !hasRetainedPluginRuntimeCloseError(result.reason)) pendingRemovals.delete(item);
	}
	const errors = settled.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Swarm launch cleanup failed");
}
/** True only after launch was invoked (or an already-running slot was restored). */
function isSwarmRunActive(runId) {
	return runLocations.get(runId)?.state === "active";
}
/** Holds this exact reservation, including preparation that has not activated yet. */
function holdQueuedSwarmRun(runId) {
	const location = runLocations.get(runId);
	if (location?.state !== "queued") return;
	const { lane, item } = location;
	item.holds += 1;
	publishCapacityChange(item);
	let released = false;
	return {
		isCurrent: () => !released && runLocations.get(runId) === location,
		async release() {
			if (!released) {
				released = true;
				item.holds -= 1;
				if (runLocations.get(runId) === location) publishCapacityChange(item);
				pumpLane(lane);
			}
			await item.removal?.catch(() => {});
		},
		withdraw() {
			return !released && runLocations.get(runId) === location && removeQueuedSwarmRun(runId);
		}
	};
}
const testing = { reset() {
	for (const location of runLocations.values()) location.item?.removeAbortListener?.();
	lanes.clear();
	runLocations.clear();
	pendingRemovals.clear();
	pendingLaunches.clear();
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.swarmSchedulerTestApi")] = { testing };
//#endregion
//#region src/agents/subagents/registry/subagent-run-timeout.ts
/**
* Subagent run timeout math.
*
* Separates timer-safe delays from duration/deadline values because setTimeout has stricter bounds.
*/
/** Convert subagent timeout seconds to a timer-safe delay. */
function resolveSubagentRunTimerDelayMs(timeoutSeconds) {
	return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds, { floorSeconds: true });
}
/** Convert subagent timeout seconds to a finite millisecond duration. */
function resolveSubagentRunDurationMs(timeoutSeconds) {
	if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) return;
	const durationMs = Math.floor(timeoutSeconds) * 1e3;
	return Number.isSafeInteger(durationMs) && durationMs > 0 ? durationMs : void 0;
}
/** Resolve the absolute timeout deadline for a subagent run. */
function resolveSubagentRunDeadlineMs(entry, observedStartedAt) {
	const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
	if (durationMs === void 0) return;
	const startedAt = typeof observedStartedAt === "number" && Number.isFinite(observedStartedAt) ? observedStartedAt : typeof entry.execution.startedAt === "number" && Number.isFinite(entry.execution.startedAt) ? entry.execution.startedAt : entry.collect ? void 0 : entry.createdAt;
	const safeStartedAt = asDateTimestampMs(startedAt);
	if (safeStartedAt === void 0) return;
	const deadlineMs = safeStartedAt + durationMs;
	return Number.isSafeInteger(deadlineMs) && asDateTimestampMs(deadlineMs) !== void 0 ? deadlineMs : void 0;
}
/** Clamp a reported terminal time to the run's explicit timeout deadline. */
function resolveSubagentRunEffectiveEndedAt(entry, endedAt, observedStartedAt) {
	const deadlineMs = resolveSubagentRunDeadlineMs(entry, observedStartedAt);
	return deadlineMs !== void 0 && endedAt > deadlineMs ? deadlineMs : endedAt;
}
//#endregion
//#region src/agents/subagents/registry/subagent-session-metrics.ts
/**
* Subagent session metric helpers.
*
* Derives display/runtime status from partial live, archived, or recovered registry records.
*/
/** Returns a recorded execution start, never the earlier admission time. */
function getSubagentSessionStartedAt(entry) {
	if (!entry) return;
	if (typeof entry.sessionStartedAt === "number" && Number.isFinite(entry.sessionStartedAt)) return entry.sessionStartedAt;
	if (typeof entry.execution.startedAt === "number" && Number.isFinite(entry.execution.startedAt)) return entry.execution.startedAt;
}
/** Computes accumulated runtime including the current live run when still active. */
function getSubagentSessionRuntimeMs(entry, now = Date.now()) {
	if (!entry) return;
	const accumulatedRuntimeMs = typeof entry.accumulatedRuntimeMs === "number" && Number.isFinite(entry.accumulatedRuntimeMs) ? Math.max(0, entry.accumulatedRuntimeMs) : 0;
	const startedAt = entry.execution.startedAt;
	if (typeof startedAt !== "number" || !Number.isFinite(startedAt)) return accumulatedRuntimeMs > 0 ? accumulatedRuntimeMs : void 0;
	const endedAt = entry.execution.endedAt;
	return Math.max(0, accumulatedRuntimeMs + Math.max(0, (typeof endedAt === "number" && Number.isFinite(endedAt) ? endedAt : now) - startedAt));
}
/** Maps persisted run outcome fields to the compact session status shown in tools/UI. */
function resolveSubagentSessionStatus(entry) {
	if (!entry) return;
	if (!entry.execution.endedAt) return entry.execution.status === "queued" ? "queued" : "running";
	if (entry.endedReason === "subagent-killed") return "killed";
	const status = entry.execution.outcome?.status;
	if (status === "error") return "failed";
	if (status === "timeout") return "timeout";
	return "done";
}
/** Formats the authoritative run status while preserving unfinished descendants. */
function resolveSubagentDisplayStatus(entry, pendingDescendants = 0) {
	const status = resolveSubagentSessionStatus(entry) ?? "done";
	const pending = Math.max(0, pendingDescendants);
	if (entry.pauseReason === "sessions_yield" && status !== "killed" && status !== "failed" && status !== "timeout") return pending > 0 ? `waiting on ${pending} ${pending === 1 ? "child" : "children"}` : "waiting for external continuation";
	if (pending > 0) {
		const waiting = `waiting on ${pending} ${pending === 1 ? "child" : "children"}`;
		return status === "running" || status === "done" ? `active (${waiting})` : `${status} (${waiting})`;
	}
	return status;
}
//#endregion
//#region src/agents/subagents/registry/subagent-run-liveness.ts
/**
* Subagent run liveness policy.
*
* Ages out stale unended runs while keeping recent/composed child links visible.
*/
/** Routing metadata alone does not own an execution. */
function isSubagentRunLive(entry) {
	if (!entry || typeof entry.execution.endedAt === "number") return false;
	return hasLiveAgentRunContext(entry.runId);
}
/** Queued admission belongs to the exact current registration and scheduler reservation. */
function isSubagentRunQueued(entry) {
	const current = entry ? subagentRuns.get(entry.runId) : void 0;
	return Boolean(current && current === entry && current.collect && current.execution.status === "queued" && ownsSwarmRunReservation(current.schedulerSlotId ?? current.runId, current));
}
const STALE_UNENDED_SUBAGENT_RUN_MS = 72e5;
const RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS = 18e5;
const EXPLICIT_TIMEOUT_STALE_GRACE_MS = 6e4;
const MIN_REALISTIC_RUN_TIMESTAMP_MS = Date.UTC(2020, 0, 1);
/** Return whether a subagent run has a finite execution end timestamp. */
function hasSubagentRunEnded(entry) {
	return typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt);
}
function resolveStaleCutoffMs(entry) {
	const durationMs = resolveSubagentRunDurationMs(entry.runTimeoutSeconds);
	if (durationMs !== void 0) return Math.max(STALE_UNENDED_SUBAGENT_RUN_MS, durationMs + EXPLICIT_TIMEOUT_STALE_GRACE_MS);
	return STALE_UNENDED_SUBAGENT_RUN_MS;
}
/** Return whether an unended subagent run is stale enough to hide as inactive. */
function isStaleUnendedSubagentRun(entry, now = Date.now()) {
	if (hasSubagentRunEnded(entry)) return false;
	const startedAt = getSubagentSessionStartedAt(entry) ?? entry.createdAt;
	if (typeof startedAt !== "number" || !Number.isFinite(startedAt) || startedAt < MIN_REALISTIC_RUN_TIMESTAMP_MS) return false;
	return now - startedAt > resolveStaleCutoffMs(entry);
}
/** Admission/display retention includes current owners and a bounded registration grace.
* This is not an executor-liveness assertion; use isSubagentRunLive for that.
*/
function isRetainedUnendedSubagentRun(entry, now = Date.now()) {
	return !hasSubagentRunEnded(entry) && (isSubagentRunLive(entry) || isSubagentRunQueued(entry) || !isStaleUnendedSubagentRun(entry, now));
}
function isRecentlyEndedSubagentRun(entry, now = Date.now(), recentMs = RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS) {
	if (!hasSubagentRunEnded(entry)) return false;
	return now - entry.execution.endedAt <= recentMs;
}
/** Return whether a child-session link should still appear in subagent listings. */
function shouldKeepSubagentRunChildLink(entry, options) {
	const now = options?.now ?? Date.now();
	return isRetainedUnendedSubagentRun(entry, now) || (options?.activeDescendants ?? 0) > 0 || isRecentlyEndedSubagentRun(entry, now);
}
//#endregion
export { getSubagentRunsForRequesterSession as A, releaseSwarmRun as C, findSwarmCollectorSession as D, findAuthorizedSwarmCollectorRequest as E, getSubagentRegistryPublicationRevision as M, publishSubagentRunChanges as N, getSubagentRunsForChildSession as O, ownsSwarmRunReservation as S, reserveSwarmRun as T, closeSwarmScheduler as _, isSubagentRunLive as a, isSwarmRunActive as b, getSubagentSessionRuntimeMs as c, resolveSubagentSessionStatus as d, resolveSubagentRunDeadlineMs as f, bindSwarmRunReservation as g, activateSwarmRun as h, isStaleUnendedSubagentRun as i, subagentRuns as j, getSubagentRunsForCollectorGroup as k, getSubagentSessionStartedAt as l, resolveSubagentRunTimerDelayMs as m, hasSubagentRunEnded as n, isSubagentRunQueued as o, resolveSubagentRunEffectiveEndedAt as p, isRetainedUnendedSubagentRun as r, shouldKeepSubagentRunChildLink as s, RECENT_ENDED_SUBAGENT_CHILD_SESSION_MS as t, resolveSubagentDisplayStatus as u, enqueueSwarmRun as v, removeQueuedSwarmRun as w, isSwarmRunWaitingForCapacity as x, holdQueuedSwarmRun as y };
