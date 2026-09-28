import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { _ as getLaneGroup, p as publishLaneConfiguration, r as enqueueCommandInLane, v as getQueueState } from "./command-queue-CaY517ob.mjs";
//#region src/process/background-work.ts
const BACKGROUND_WORK_GROUP = "background-work";
const BACKGROUND_WORK_MAX_CONCURRENT = 3;
/** Register a stable core/plugin owner key, never a session or run identifier.
* Only leaf work belongs here: a coordinator holding capacity must not await
* another background task, which could need the same occupied capacity. */
function createBackgroundWorkOwner(params) {
	const owner = params.owner.trim();
	if (!owner) throw new Error("Background work requires a stable owner key");
	if (!Number.isInteger(params.maxConcurrent) || params.maxConcurrent < 1 || params.maxConcurrent > BACKGROUND_WORK_MAX_CONCURRENT) throw new Error(`Background owner concurrency must be between 1 and ${BACKGROUND_WORK_MAX_CONCURRENT}`);
	const lane = `background:${owner}`;
	const register = () => {
		if (getLaneGroup(lane)) {
			if ((getQueueState().lanes.get(lane)?.maxConcurrent ?? 1) !== params.maxConcurrent) throw new Error(`Background owner ${owner} is already registered with different concurrency`);
		} else {
			const group = getQueueState().laneGroups.get(BACKGROUND_WORK_GROUP);
			publishLaneConfiguration({
				lanes: { [lane]: params.maxConcurrent },
				groups: { [BACKGROUND_WORK_GROUP]: {
					budget: BACKGROUND_WORK_MAX_CONCURRENT,
					members: [...group?.members ?? [], lane]
				} }
			});
		}
		return lane;
	};
	return {
		get lane() {
			return register();
		},
		enqueue(task, options) {
			const restartSignal = getGatewayRestartDrainSignal();
			const signal = options?.abortSignal ? AbortSignal.any([restartSignal, options.abortSignal]) : restartSignal;
			return enqueueCommandInLane(register(), () => {
				signal.throwIfAborted();
				return task(signal);
			}, {
				...options,
				priority: "background",
				abortSignal: signal
			});
		}
	};
}
function isBackgroundWorkLane(lane) {
	return getLaneGroup(lane)?.group === BACKGROUND_WORK_GROUP;
}
function getBackgroundWorkSnapshot() {
	const { lanes, laneGroups } = getQueueState();
	const group = laneGroups.get(BACKGROUND_WORK_GROUP);
	const snapshot = {
		lane: "background",
		activeCount: 0,
		queuedCount: 0,
		maxConcurrent: BACKGROUND_WORK_MAX_CONCURRENT,
		draining: false,
		generation: 0,
		blockedBy: null
	};
	for (const lane of group?.members ?? []) {
		const state = lanes.get(lane);
		if (!state) continue;
		const activeCount = state.activeTaskIds.size;
		snapshot.activeCount += activeCount;
		snapshot.queuedCount += state.queue.length;
		snapshot.draining ||= state.draining;
		snapshot.generation = Math.max(snapshot.generation, state.generation);
		if (state.queue.length > 0 && activeCount >= state.maxConcurrent) snapshot.blockedBy = "lane";
	}
	if (snapshot.activeCount >= BACKGROUND_WORK_MAX_CONCURRENT) snapshot.blockedBy = "group-budget";
	return snapshot;
}
//#endregion
export { getBackgroundWorkSnapshot as n, isBackgroundWorkLane as r, createBackgroundWorkOwner as t };
