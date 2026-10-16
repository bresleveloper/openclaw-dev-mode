import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as trackAsyncWork, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DPmgR5gM.mjs";
import { r as SWARM_LANE_PREFIX } from "./lanes-D7a4ntDu.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
const heldReservations = /* @__PURE__ */ new Map();
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
	if (reason === "shutdown") item.removalReason = reason;
	if ((item.launch || item.preparation) && !item.removal) {
		item.removalReason = reason;
		pendingRemovals.add(item);
		const cleanup = async () => {
			const [preparation, launch] = await Promise.allSettled([item.preparation?.onRemoved, item.pendingLaunch]);
			const onRemoved = item.launch?.onRemoved ?? (preparation.status === "fulfilled" ? preparation.value : void 0);
			await onRemoved?.(item.removalReason ?? reason);
			if (preparation.status === "rejected") throw preparation.reason;
			if (launch.status === "rejected") throw launch.reason;
			return onRemoved !== void 0;
		};
		item.removal = getAsyncWorkSignal()?.aborted ? cleanup() : trackAsyncWork(cleanup);
		item.callbackWork?.beginClose();
		item.removal.then(() => pendingRemovals.delete(item), (error) => {
			console.warn(`[swarm] Failed queued launch cleanup: ${sanitizeForLog(String(error))}`);
		});
	}
	return item.removal ?? Promise.resolve(false);
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
		} catch (cleanupError) {
			if (hasRetainedPluginRuntimeCloseError(cleanupError)) {
				finalizeRemovedRun(item);
				return;
			}
		}
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
		heldReservations.delete(runId);
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
	heldReservations.delete(params.runId);
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
	for (const location of runLocations.values()) if (location.item?.launch || location.item?.preparation) items.add(location.item);
	const owned = [...items].filter((item) => (item.launch ?? item.preparation)?.lifecycleOwner === lifecycleOwner);
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
/** Carry the admitted group's identity and live capacity through execution preparation. */
function getSwarmRunExecutionLane(runId) {
	const location = runLocations.get(runId);
	if (!location || location.state !== "active") return;
	const { lane } = location;
	return {
		lane: `${SWARM_LANE_PREFIX}${lane.groupId}`,
		get maxConcurrent() {
			return lane.limit;
		}
	};
}
/** Holds this exact reservation, including preparation that has not activated yet. */
function holdQueuedSwarmRun(runId) {
	const location = runLocations.get(runId);
	if (location?.state !== "queued") return;
	const { lane, item } = location;
	item.holds += 1;
	heldReservations.set(runId, item);
	publishCapacityChange(item);
	let released = false;
	const isCurrent = () => !released && runLocations.get(runId) === location;
	return {
		isCurrent,
		bindPreparation(preparation) {
			if (!isCurrent()) return false;
			if (item.preparation) throw new Error("Swarm reservation already owns preparation");
			item.preparation = {
				...preparation,
				onRemoved: preparation.onRemoved.then((onRemoved) => onRemoved ? bindSwarmLaunchWork(onRemoved) : void 0)
			};
			item.preparation.onRemoved.catch(() => {});
			return true;
		},
		async release() {
			if (!released) {
				released = true;
				item.holds -= 1;
				if (item.holds === 0 && heldReservations.get(runId) === item) heldReservations.delete(runId);
				if (runLocations.get(runId) === location) publishCapacityChange(item);
				pumpLane(lane);
			}
			await item.removal?.catch(() => {});
		},
		withdraw() {
			return isCurrent() && removeQueuedSwarmRun(runId);
		},
		async settleCancellation() {
			const removal = item.removal;
			if (released || !removal || item.pendingLaunch || item.removalReason !== "cancelled") return false;
			return await removal && !released && !item.pendingLaunch && item.removalReason === "cancelled" && heldReservations.get(runId) === item && !runLocations.has(runId);
		}
	};
}
const testing = { reset() {
	for (const location of runLocations.values()) location.item?.removeAbortListener?.();
	lanes.clear();
	heldReservations.clear();
	runLocations.clear();
	pendingRemovals.clear();
	pendingLaunches.clear();
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.swarmSchedulerTestApi")] = { testing };
//#endregion
export { getSwarmRunExecutionLane as a, isSwarmRunWaitingForCapacity as c, reserveSwarmRun as d, enqueueSwarmRun as i, ownsSwarmRunReservation as l, bindSwarmRunReservation as n, holdQueuedSwarmRun as o, closeSwarmScheduler as r, isSwarmRunActive as s, activateSwarmRun as t, releaseSwarmRun as u };
