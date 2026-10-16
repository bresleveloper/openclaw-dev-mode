import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as readErrorName, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { d as isGatewaySubordinateWorkAdmissionClosed, h as resetGatewayWorkAdmission, t as GatewayDrainingError, w as runWithGatewayRootWorkReadmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { i as logLaneEnqueue, r as logLaneDequeue, t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { n as SUBAGENT_LANE_PREFIX, r as SWARM_LANE_PREFIX } from "./lanes-D7a4ntDu.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/command-queue.state.ts
function createQueueFifo() {
	return {
		head: void 0,
		tail: void 0,
		length: 0
	};
}
function createLaneQueue() {
	return {
		background: createQueueFifo(),
		normal: createQueueFifo(),
		foreground: createQueueFifo(),
		length: 0
	};
}
function getPriorityFifo(queue, priority) {
	switch (priority) {
		case 1: return queue.foreground;
		case -1: return queue.background;
		default: return queue.normal;
	}
}
/** Append to one of three fixed priority FIFOs and return the queued work ahead. */
function enqueueLaneQueue(queue, entry) {
	const fifo = getPriorityFifo(queue, entry.priority);
	const queuedAhead = fifo.length + (entry.priority <= 0 ? queue.foreground.length : 0) + (entry.priority < 0 ? queue.normal.length : 0);
	entry.queued = true;
	entry.previous = fifo.tail;
	entry.next = void 0;
	if (fifo.tail) fifo.tail.next = entry;
	else fifo.head = entry;
	fifo.tail = entry;
	fifo.length += 1;
	queue.length += 1;
	return queuedAhead;
}
function peekLaneQueue(queue) {
	return queue.foreground.head ?? queue.normal.head ?? queue.background.head;
}
function dequeueLaneQueue(queue) {
	const entry = peekLaneQueue(queue);
	if (entry) removeLaneQueueEntry(queue, entry);
	return entry;
}
/** Unlink without scanning successors, including when one abort cancels an entire backlog. */
function removeLaneQueueEntry(queue, entry) {
	if (!entry.queued) return false;
	const fifo = getPriorityFifo(queue, entry.priority);
	if (entry.previous) entry.previous.next = entry.next;
	else fifo.head = entry.next;
	if (entry.next) entry.next.previous = entry.previous;
	else fifo.tail = entry.previous;
	entry.queued = void 0;
	fifo.length -= 1;
	queue.length -= 1;
	const releaseQueuedAbort = entry.releaseQueuedAbort;
	entry.previous = void 0;
	entry.next = void 0;
	entry.releaseQueuedAbort = void 0;
	releaseQueuedAbort?.();
	return true;
}
/**
* Keep queue runtime state on globalThis so every bundled entry/chunk shares
* the same lanes, counters, and draining flag in production builds.
*/
const COMMAND_QUEUE_STATE_KEY = Symbol.for("openclaw.commandQueueState");
function getQueueState() {
	return resolveGlobalSingleton(COMMAND_QUEUE_STATE_KEY, () => ({
		lanes: /* @__PURE__ */ new Map(),
		nextTaskId: 1,
		nextQueueSequence: 1,
		laneGroups: /* @__PURE__ */ new Map(),
		laneGroupByLane: /* @__PURE__ */ new Map()
	}));
}
function normalizeLane(lane) {
	return lane.trim() || "main";
}
//#endregion
//#region src/process/command-queue.capacity-groups.ts
/** Shared across fresh module instances so one group cannot re-enter its arbiter. */
const DRAINING_GROUPS = resolveGlobalSingleton(Symbol.for("openclaw.commandQueueDrainingGroups"), () => /* @__PURE__ */ new WeakSet());
/**
* Lanes that must never join a group, because a group member can be made to
* wait for a sibling and these lanes can be synchronously awaited by other
* lanes — which would turn a wait into a deadlock.
*
* Known wait edges at this base: outer `cron` -> `cron-nested`
* (`server-cron.ts` passes lane "cron"; `agents/lanes.ts` remaps inner work),
* `main` -> `system-agent` -> `session:<key>` -> `system-agent-inference`
* (delegated expert inference), and `session:<key>` -> global lane
* (embedded-agent-runner run + compaction).
*/
const GROUP_INELIGIBLE_LANES = /* @__PURE__ */ new Set([
	"cron",
	"main",
	"system-agent",
	"subagent",
	"nested"
]);
const GROUP_INELIGIBLE_PREFIXES = [
	"session:",
	"nested:",
	SUBAGENT_LANE_PREFIX,
	"context-engine-turn-maintenance:"
];
function assertGroupEligibleLane(lane) {
	if (GROUP_INELIGIBLE_LANES.has(lane)) throw new Error(`command lane "${lane}" cannot join a capacity group: it can be synchronously awaited by another lane`);
	for (const prefix of GROUP_INELIGIBLE_PREFIXES) if (lane.startsWith(prefix)) throw new Error(`command lane "${lane}" cannot join a capacity group: "${prefix}*" lanes can be synchronously awaited`);
}
function getLaneGroup(lane) {
	const { laneGroups: groups, laneGroupByLane: groupByLane } = getQueueState();
	const groupId = groupByLane.get(lane);
	return groupId ? groups.get(groupId) : void 0;
}
/**
* Active task count for a group member WITHOUT creating the lane. Creating it
* here would resurrect lanes that `retireIdleScopedCommandLane` just removed.
*/
function getMemberActiveCount(lane) {
	return getQueueState().lanes.get(lane)?.activeTaskIds.size ?? 0;
}
function readGroupCapacity(group) {
	let active = 0;
	let reserved = 0;
	for (const member of group.members) {
		const memberActive = getMemberActiveCount(member);
		active += memberActive;
		reserved += Math.max(0, (group.reservations.get(member) ?? 0) - memberActive);
	}
	return {
		active,
		reserved
	};
}
function resolveGroupBlockReason(group, lane, capacity) {
	if (capacity.active >= group.budget) return "group-budget";
	if (getMemberActiveCount(lane) < (group.reservations.get(lane) ?? 0)) return null;
	return capacity.active + capacity.reserved < group.budget ? null : "sibling-reservation";
}
/** Fill a fresh snapshot from one synchronous group-capacity observation. */
function applyCommandLaneCapacity(snapshot) {
	const group = getLaneGroup(snapshot.lane);
	const capacity = group ? readGroupCapacity(group) : void 0;
	snapshot.blockedBy = snapshot.activeCount >= snapshot.maxConcurrent ? "lane" : group && capacity ? resolveGroupBlockReason(group, snapshot.lane, capacity) : null;
	if (group && capacity) {
		snapshot.group = group.group;
		snapshot.groupActive = capacity.active;
		snapshot.groupBudget = group.budget;
		snapshot.reservedForLane = group.reservations.get(snapshot.lane) ?? 0;
	}
}
function canAdmitInGroup(lane) {
	const group = getLaneGroup(lane);
	return !group || resolveGroupBlockReason(group, lane, readGroupCapacity(group)) === null;
}
/**
* Define or replace a capacity group.
*
* Membership is held here, keyed by lane name, and deliberately NOT inside
* `LaneState`: `setCommandLaneConcurrency` must not be able to detach a lane
* from its group, or session suspend/resume would silently restore a member to
* ungoverned concurrency.
*/
function validateCommandLaneGroupSpec(group, spec) {
	const members = new Set(spec.members.map((member) => normalizeLane(member)));
	for (const member of members) assertGroupEligibleLane(member);
	const reservations = /* @__PURE__ */ new Map();
	let reservedTotal = 0;
	for (const [rawLane, count] of Object.entries(spec.reservations ?? {})) {
		const member = normalizeLane(rawLane);
		if (!members.has(member)) throw new Error(`command lane group "${group}" reserves for non-member lane "${member}"`);
		const reserved = Math.max(0, Math.floor(count));
		reservations.set(member, reserved);
		reservedTotal += reserved;
	}
	const budget = Math.max(0, Math.floor(spec.budget));
	if (reservedTotal > budget) throw new Error(`command lane group "${group}" reserves ${reservedTotal} slots but its budget is ${budget}`);
	return {
		group,
		budget,
		members,
		reservations
	};
}
/** Install a validated group, detaching its members from any previous owner. */
function installCommandLaneGroup(next) {
	const { laneGroups: groups, laneGroupByLane: groupByLane } = getQueueState();
	const previous = groups.get(next.group);
	if (previous) for (const member of previous.members) groupByLane.delete(member);
	for (const member of next.members) {
		const owner = groupByLane.get(member);
		if (owner && owner !== next.group) groups.get(owner)?.members.delete(member);
	}
	groups.set(next.group, next);
	for (const member of next.members) groupByLane.set(member, next.group);
}
/**
* Select the highest-priority, oldest currently admissible member head.
*/
function resolveNextGroupLane(group) {
	let selected;
	let capacity;
	for (const lane of group.members) {
		const state = getQueueState().lanes.get(lane);
		const head = state ? peekLaneQueue(state.queue) : void 0;
		if (!state || !head || state.draining || state.activeTaskIds.size >= state.maxConcurrent) continue;
		capacity ??= readGroupCapacity(group);
		if (resolveGroupBlockReason(group, lane, capacity) !== null) continue;
		if (!selected || head.priority > selected.priority || head.priority === selected.priority && (head.sequence < selected.sequence || head.sequence === selected.sequence && lane < selected.lane)) selected = {
			lane,
			priority: head.priority,
			sequence: head.sequence
		};
	}
	return selected?.lane;
}
/**
* Drain a capacity group one admission at a time.
*
* Per-lane queues already order entries by priority and global sequence. The
* group applies the same order across member queue heads so a completing lane
* cannot synchronously reclaim shared capacity ahead of an older sibling.
*/
function drainCommandLaneGroup(lane, drainLane) {
	const group = getLaneGroup(lane);
	if (!group || DRAINING_GROUPS.has(group)) return;
	DRAINING_GROUPS.add(group);
	try {
		while (getQueueState().laneGroups.get(group.group) === group) {
			const selectedLane = resolveNextGroupLane(group);
			if (!selectedLane || drainLane(selectedLane, 1) === 0) return;
		}
	} finally {
		DRAINING_GROUPS.delete(group);
	}
}
//#endregion
//#region src/process/command-queue.ts
var CommandLaneClearedError = class extends Error {
	constructor(lane) {
		super(lane ? `Command lane "${lane}" cleared` : "Command lane cleared");
		this.name = "CommandLaneClearedError";
	}
};
/**
* Dedicated error type thrown when an active command exceeds its caller-owned
* lane timeout. The underlying task may still be unwinding, but the lane is
* released so queued work is not blocked forever.
*/
var CommandLaneTaskTimeoutError = class extends Error {
	constructor(lane, details) {
		const message = (() => {
			switch (details.cause) {
				case "task-budget": return `elapsed ${details.elapsedMs}ms reached task budget ${details.taskBudgetMs}ms`;
				case "owner-deadline": return `owner deadline reached after ${details.elapsedMs}ms`;
				case "progress-idle": return `no progress for ${details.idleMs}ms (task budget ${details.taskBudgetMs}ms, elapsed ${details.elapsedMs}ms)`;
				case "abort-grace": return `abort grace ${details.graceMs}ms elapsed (task budget ${details.taskBudgetMs}ms, elapsed ${details.elapsedMs}ms)`;
				case "release-signal": return `lane release requested after ${details.elapsedMs}ms (task budget ${details.taskBudgetMs}ms)`;
				default: throw new TypeError("Unsupported command lane timeout cause");
			}
		})();
		super(`Command lane "${lane}" task timed out: ${message}`);
		this.name = "CommandLaneTaskTimeoutError";
	}
};
function isCommandLaneTaskTimeoutError(err, lane) {
	if (!(err instanceof Error)) return false;
	if (!(err instanceof CommandLaneTaskTimeoutError || err.name === "CommandLaneTaskTimeoutError")) return false;
	return lane === void 0 || err.message.includes(`Command lane "${lane}" task timed out`);
}
function isExpectedNonErrorLaneFailure(err) {
	return err instanceof Error && err.name === "LiveSessionModelSwitchError";
}
function isQuietProbeLane(lane) {
	return lane.startsWith("auth-probe:") || lane.startsWith("session:probe-") || lane.startsWith("session:temp:setup-inference:probe-setup-inference-");
}
function getLaneDepth(state) {
	return state.queue.length + state.activeTaskIds.size;
}
function getDefaultLaneConcurrency(lane) {
	return lane.startsWith(SUBAGENT_LANE_PREFIX) && !lane.startsWith(SWARM_LANE_PREFIX) ? getQueueState().lanes.get("subagent")?.maxConcurrent ?? 1 : 1;
}
function getLaneState(lane) {
	const queueState = getQueueState();
	const existing = queueState.lanes.get(lane);
	if (existing) return existing;
	const created = {
		lane,
		queue: createLaneQueue(),
		activeTaskIds: /* @__PURE__ */ new Set(),
		maxConcurrent: getDefaultLaneConcurrency(lane),
		draining: false,
		generation: 0
	};
	queueState.lanes.set(lane, created);
	return created;
}
function completeTask(state, taskId, taskGeneration) {
	if (taskGeneration !== state.generation) return false;
	state.activeTaskIds.delete(taskId);
	return true;
}
function retireIdleScopedCommandLane(state) {
	if (state.draining || state.activeTaskIds.size > 0 || state.queue.length > 0 || !state.lane.startsWith(SUBAGENT_LANE_PREFIX) && (state.maxConcurrent !== 1 || !state.lane.startsWith("session:") && !state.lane.startsWith("nested:") && !state.lane.startsWith("context-engine-turn-maintenance:"))) return;
	const lanes = getQueueState().lanes;
	if (lanes.get(state.lane) === state) lanes.delete(state.lane);
}
function resolveQueuePriority(priority) {
	switch (priority) {
		case "foreground": return 1;
		case "background": return -1;
		default: return 0;
	}
}
async function runQueueEntryTask(lane, entry, marker) {
	const taskPromise = Promise.resolve().then(() => entry.task(marker));
	const taskTimeoutMs = entry.taskTimeoutMs;
	if (taskTimeoutMs === void 0) return await taskPromise;
	const taskTimeoutAbortGraceMs = entry.taskTimeoutAbortGraceMs ?? taskTimeoutMs;
	const startedAtMs = Date.now();
	const readLastProgressAtMs = () => {
		let value;
		try {
			value = entry.taskTimeoutProgressAtMs?.();
		} catch (err) {
			diagnosticLogger.warn(`lane task timeout progress callback failed: lane=${lane} error="${String(err)}"`);
		}
		return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.max(startedAtMs, Math.floor(value)) : startedAtMs;
	};
	let timeoutHandle;
	let removeAbortListener;
	let removeReleaseListener;
	let removeDeadlineListener;
	let ownerDeadline;
	let closed = false;
	let timedOut = false;
	const timeoutPromise = new Promise((_, reject) => {
		const elapsedSinceStartMs = () => Math.max(0, Date.now() - startedAtMs);
		const rejectForTimeout = (details) => {
			timedOut = true;
			reject(new CommandLaneTaskTimeoutError(lane, {
				...details,
				elapsedMs: elapsedSinceStartMs(),
				taskBudgetMs: taskTimeoutMs
			}));
		};
		const armTimer = (delayMs, onTimeout) => {
			if (timeoutHandle) clearTimeout(timeoutHandle);
			if (delayMs <= 0) {
				onTimeout();
				return;
			}
			timeoutHandle = setTimeout(onTimeout, clampPositiveTimerTimeoutMs(delayMs));
			timeoutHandle.unref?.();
		};
		const armProgressTimeout = () => {
			if (ownerDeadline?.kind === "unlimited") return;
			const elapsedMs = Math.max(0, Date.now() - readLastProgressAtMs());
			const remainingMs = ownerDeadline ? ownerDeadline.deadlineAtMs - Date.now() : taskTimeoutMs - elapsedMs;
			if (remainingMs <= 0) {
				rejectForTimeout(ownerDeadline ? { cause: "owner-deadline" } : entry.taskTimeoutProgressAtMs ? {
					cause: "progress-idle",
					idleMs: elapsedMs
				} : { cause: "task-budget" });
				return;
			}
			armTimer(remainingMs, armProgressTimeout);
		};
		const armAbortTimeout = () => {
			const abortStartedAtMs = Date.now();
			armTimer(taskTimeoutAbortGraceMs, () => rejectForTimeout({
				cause: "abort-grace",
				graceMs: Math.max(0, Date.now() - abortStartedAtMs)
			}));
		};
		const abortSignal = entry.taskTimeoutAbortSignal;
		const releaseSignal = entry.taskTimeoutReleaseSignal;
		const onRelease = () => {
			removeReleaseListener?.();
			rejectForTimeout({ cause: "release-signal" });
		};
		if (releaseSignal?.aborted) {
			onRelease();
			return;
		}
		if (releaseSignal) {
			releaseSignal.addEventListener("abort", onRelease, { once: true });
			removeReleaseListener = () => releaseSignal.removeEventListener("abort", onRelease);
		}
		if (abortSignal?.aborted) {
			armAbortTimeout();
			return;
		}
		armProgressTimeout();
		if (abortSignal) {
			const onAbort = () => {
				removeAbortListener?.();
				armAbortTimeout();
			};
			abortSignal.addEventListener("abort", onAbort, { once: true });
			removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
		}
		removeDeadlineListener = entry.taskTimeoutSubscribe?.((deadline) => {
			if (closed || timedOut || abortSignal?.aborted || releaseSignal?.aborted) return;
			if (timeoutHandle) clearTimeout(timeoutHandle);
			ownerDeadline = deadline;
			armProgressTimeout();
		});
	});
	try {
		return await Promise.race([taskPromise, timeoutPromise]);
	} catch (err) {
		if (timedOut) taskPromise.catch((lateErr) => {
			diagnosticLogger.warn(`lane task rejected after timeout: lane=${lane} timeoutMs=${taskTimeoutMs} error="${String(lateErr)}"`);
		});
		throw err;
	} finally {
		closed = true;
		if (timeoutHandle) clearTimeout(timeoutHandle);
		removeAbortListener?.();
		removeReleaseListener?.();
		removeDeadlineListener?.();
	}
}
function drainLane(lane, maxStarts = Number.POSITIVE_INFINITY, state = getLaneState(lane)) {
	if (state.draining) {
		if (state.activeTaskIds.size === 0 && state.queue.length > 0) diagnosticLogger.warn(`drainLane blocked: lane=${lane} draining=true active=0 queue=${state.queue.length}`);
		return 0;
	}
	state.draining = true;
	let started = 0;
	try {
		while (started < maxStarts && state.activeTaskIds.size < state.maxConcurrent && state.queue.length > 0 && canAdmitInGroup(lane)) {
			const entry = dequeueLaneQueue(state.queue);
			const waitedMs = Date.now() - entry.enqueuedAt;
			const activeBeforeStart = state.activeTaskIds.size;
			const taskId = getQueueState().nextTaskId++;
			const taskGeneration = state.generation;
			state.activeTaskIds.add(taskId);
			started += 1;
			if (waitedMs >= entry.warnAfterMs) {
				try {
					entry.onWait?.(waitedMs, entry.queuedAheadAtEnqueue);
				} catch (err) {
					diagnosticLogger.error(`lane onWait callback failed: lane=${lane} error="${String(err)}"`);
				}
				diagnosticLogger.warn(`lane wait exceeded: lane=${lane} waitedMs=${waitedMs} queueAhead=${entry.queuedAheadAtEnqueue} activeAhead=${entry.activeAheadAtEnqueue} activeNow=${activeBeforeStart} queueBehind=${state.queue.length}`, entry.taskIdentity);
			}
			logLaneDequeue(lane, waitedMs, state.queue.length);
			(async () => {
				const startTime = Date.now();
				try {
					const result = await runQueueEntryTask(lane, entry, {
						lane,
						taskId,
						generation: taskGeneration
					});
					if (completeTask(state, taskId, taskGeneration)) {
						diagnosticLogger.debug(`lane task done: lane=${lane} durationMs=${Date.now() - startTime} active=${state.activeTaskIds.size} queued=${state.queue.length}`);
						drainReadyCommandLane(lane, state);
					}
					entry.resolve(result);
				} catch (err) {
					const completedCurrentGeneration = completeTask(state, taskId, taskGeneration);
					const isProbeLane = isQuietProbeLane(lane);
					if (!isProbeLane && !isExpectedNonErrorLaneFailure(err)) diagnosticLogger.error(`lane task error: lane=${lane} durationMs=${Date.now() - startTime} error=${JSON.stringify(formatErrorMessage(err))}`, {
						errorName: readErrorName(err) || void 0,
						...entry.taskIdentity
					});
					else if (!isProbeLane) diagnosticLogger.debug(`lane task interrupted: lane=${lane} durationMs=${Date.now() - startTime} reason="${String(err)}"`);
					if (completedCurrentGeneration) drainReadyCommandLane(lane, state);
					entry.reject(err);
				}
			})();
		}
	} finally {
		state.draining = false;
		retireIdleScopedCommandLane(state);
	}
	return started;
}
function drainReadyCommandLane(lane, completedState) {
	if (getLaneGroup(lane)) {
		drainCommandLaneGroup(lane, drainLane);
		return;
	}
	drainLane(lane, Number.POSITIVE_INFINITY, completedState);
}
function updateLaneConcurrency(lane, maxConcurrent) {
	const state = getLaneState(lane);
	const minConcurrent = isQuietProbeLane(lane) ? 1 : 0;
	state.maxConcurrent = Math.max(minConcurrent, Math.floor(maxConcurrent));
	const updated = [state];
	if (lane === "subagent") {
		for (const scoped of getQueueState().lanes.values()) if (scoped.lane.startsWith(SUBAGENT_LANE_PREFIX) && !scoped.lane.startsWith(SWARM_LANE_PREFIX)) {
			scoped.maxConcurrent = state.maxConcurrent;
			updated.push(scoped);
		}
	}
	return updated;
}
/**
* Publish lane widths and groups before draining: per-lane setters could admit
* work before its group budget exists. Grouped callers must use this transaction.
*/
function publishLaneConfiguration(config) {
	const validated = Object.entries(config.groups ?? {}).map(([group, spec]) => validateCommandLaneGroupSpec(group, spec));
	const touched = /* @__PURE__ */ new Set();
	for (const [rawLane, maxConcurrent] of Object.entries(config.lanes ?? {})) {
		const lane = normalizeLane(rawLane);
		for (const state of updateLaneConcurrency(lane, maxConcurrent)) touched.add(state.lane);
	}
	for (const group of config.clearGroups ?? []) {
		const { laneGroups: groups, laneGroupByLane: groupByLane } = getQueueState();
		const existing = groups.get(group);
		if (existing) {
			for (const member of existing.members) {
				groupByLane.delete(member);
				touched.add(member);
			}
			groups.delete(group);
		}
	}
	for (const next of validated) {
		const { laneGroups: groups, laneGroupByLane: groupByLane } = getQueueState();
		const previous = groups.get(next.group);
		for (const member of previous?.members ?? []) touched.add(member);
		for (const member of next.members) {
			const previousOwner = groupByLane.get(member);
			for (const previousSibling of groups.get(previousOwner ?? "")?.members ?? []) touched.add(previousSibling);
		}
		installCommandLaneGroup(next);
		for (const member of next.members) touched.add(member);
	}
	for (const lane of touched) {
		const state = getQueueState().lanes.get(lane);
		if (state && state.maxConcurrent > 0 && state.queue.length > 0 && !state.draining) drainReadyCommandLane(lane);
	}
}
function setCommandLaneConcurrency(lane, maxConcurrent) {
	const cleaned = normalizeLane(lane);
	for (const state of updateLaneConcurrency(cleaned, maxConcurrent)) if (state.maxConcurrent > 0) drainReadyCommandLane(state.lane);
}
function enqueueCommandInLane(lane, task, opts) {
	if (opts?.abortSignal?.aborted) return Promise.reject(toErrorObject(opts.abortSignal.reason, "Queued command aborted"));
	const queueState = getQueueState();
	if (isGatewaySubordinateWorkAdmissionClosed()) return Promise.reject(new GatewayDrainingError());
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	const cleaned = normalizeLane(lane);
	const warnAfterMs = opts?.warnAfterMs ?? 2e3;
	const state = getLaneState(cleaned);
	if (opts?.maxConcurrent !== void 0) state.maxConcurrent = Math.max(0, Math.floor(opts.maxConcurrent));
	return new Promise((resolve, reject) => {
		const entry = {
			task: (marker) => runInAsyncContext(runWithGatewayRootWorkReadmission, () => task(marker)),
			resolve: (value) => resolve(value),
			reject,
			enqueuedAt: Date.now(),
			sequence: queueState.nextQueueSequence++,
			priority: resolveQueuePriority(opts?.priority),
			warnAfterMs,
			queuedAheadAtEnqueue: 0,
			activeAheadAtEnqueue: 0,
			taskIdentity: opts?.taskIdentity ? { ...opts.taskIdentity } : void 0,
			sessionTarget: opts?.sessionTarget ? { ...opts.sessionTarget } : void 0,
			taskTimeoutMs: clampPositiveTimerTimeoutMs(opts?.taskTimeoutMs),
			taskTimeoutProgressAtMs: opts?.taskTimeoutProgressAtMs,
			taskTimeoutSubscribe: opts?.taskTimeoutSubscribe,
			taskTimeoutAbortSignal: opts?.taskTimeoutAbortSignal,
			taskTimeoutAbortGraceMs: clampPositiveTimerTimeoutMs(opts?.taskTimeoutAbortGraceMs),
			taskTimeoutReleaseSignal: opts?.taskTimeoutReleaseSignal,
			onWait: opts?.onWait
		};
		entry.queuedAheadAtEnqueue = enqueueLaneQueue(state.queue, entry);
		entry.activeAheadAtEnqueue = state.activeTaskIds.size;
		const signal = opts?.abortSignal;
		if (signal) {
			const onAbort = () => {
				entry.releaseQueuedAbort = void 0;
				if (removeLaneQueueEntry(state.queue, entry)) {
					entry.reject(toErrorObject(signal.reason, "Queued command aborted"));
					retireIdleScopedCommandLane(state);
				}
			};
			signal.addEventListener("abort", onAbort, { once: true });
			entry.releaseQueuedAbort = () => signal.removeEventListener("abort", onAbort);
		}
		logLaneEnqueue(cleaned, getLaneDepth(state));
		drainReadyCommandLane(cleaned);
		if (entry.queued) try {
			opts?.onQueued?.();
		} catch (err) {
			diagnosticLogger.error(`lane onQueued callback failed: lane=${cleaned} error="${String(err)}"`);
		}
	});
}
function getQueueSize(lane = "main") {
	const resolved = normalizeLane(lane);
	const state = getQueueState().lanes.get(resolved);
	return state ? getLaneDepth(state) : 0;
}
function getCommandLaneSnapshot(lane = "main") {
	const resolved = normalizeLane(lane);
	const state = getQueueState().lanes.get(resolved);
	const snapshot = {
		lane: state?.lane ?? resolved,
		queuedCount: state?.queue.length ?? 0,
		activeCount: state?.activeTaskIds.size ?? 0,
		maxConcurrent: state?.maxConcurrent ?? getDefaultLaneConcurrency(resolved),
		draining: state?.draining ?? false,
		generation: state?.generation ?? 0,
		blockedBy: null,
		...resolved.startsWith(SWARM_LANE_PREFIX) ? {
			concurrencyScope: "swarm",
			swarmGroupKey: resolved.slice(SWARM_LANE_PREFIX.length)
		} : {}
	};
	applyCommandLaneCapacity(snapshot);
	return snapshot;
}
/** Per-lane work totals for every live lane; diagnostics composition lives in command-lane-diagnostics.ts. */
function listCommandLaneTotals() {
	return [...getQueueState().lanes.values()].map((state) => ({
		lane: state.lane,
		activeCount: state.activeTaskIds.size,
		queuedCount: state.queue.length
	}));
}
/**
* Active task ids for a lane. Ids are process-monotonic, so recovery can
* detect a turn that started after a point in time it captured earlier.
*/
function getCommandLaneActiveTaskIds(lane = "main") {
	const state = getQueueState().lanes.get(normalizeLane(lane));
	return state ? [...state.activeTaskIds] : [];
}
/** Return whether this exact lane task still owns an active queue slot. */
function isCommandLaneTaskMarkerCurrent(marker) {
	if (!marker) return false;
	const state = getQueueState().lanes.get(normalizeLane(marker.lane));
	return state?.generation === marker.generation && state.activeTaskIds.has(marker.taskId);
}
function getTotalQueueSize() {
	let total = 0;
	for (const s of getQueueState().lanes.values()) total += getLaneDepth(s);
	return total;
}
function selectQueuedCommandEntries(state, matches) {
	const entries = [];
	for (const queue of [
		state.queue.foreground,
		state.queue.normal,
		state.queue.background
	]) for (let entry = queue.head; entry; entry = entry.next) if (matches(entry.sessionTarget)) entries.push(entry);
	return entries;
}
function countQueuedCommandsInLane(lane, matches) {
	const state = getQueueState().lanes.get(normalizeLane(lane));
	return state ? selectQueuedCommandEntries(state, matches).length : 0;
}
function clearCommandLane(lane = "main", matches) {
	const cleaned = normalizeLane(lane);
	const state = getQueueState().lanes.get(cleaned);
	if (!state) return 0;
	if (matches) {
		const entries = selectQueuedCommandEntries(state, matches);
		for (const entry of entries) {
			removeLaneQueueEntry(state.queue, entry);
			entry.reject(new CommandLaneClearedError(cleaned));
		}
		return entries.length;
	}
	const removed = state.queue.length;
	let entry;
	while (entry = dequeueLaneQueue(state.queue)) entry.reject(new CommandLaneClearedError(cleaned));
	return removed;
}
/**
* Force a single lane back to idle and immediately pump any queued entries.
* Used only by recovery paths after the owner has already attempted to abort
* the active work; stale completions from the previous generation are ignored.
*/
function resetCommandLane(lane = "main") {
	const cleaned = normalizeLane(lane);
	const state = getQueueState().lanes.get(cleaned);
	if (!state) return 0;
	const released = state.activeTaskIds.size;
	state.generation += 1;
	state.activeTaskIds.clear();
	state.draining = false;
	drainReadyCommandLane(cleaned);
	return released;
}
/**
* SIGUSR2 may abandon finally blocks. Retire old active generations while
* preserving and immediately draining queued user work under the reset state.
*/
function resetAllLanes() {
	const queueState = getQueueState();
	resetGatewayWorkAdmission();
	const lanesToDrain = [];
	for (const state of queueState.lanes.values()) {
		state.generation += 1;
		state.activeTaskIds.clear();
		state.draining = false;
		if (state.queue.length > 0) lanesToDrain.push(state.lane);
	}
	for (const lane of lanesToDrain) drainReadyCommandLane(lane);
}
//#endregion
export { getQueueState as _, getCommandLaneActiveTaskIds as a, getTotalQueueSize as c, listCommandLaneTotals as d, publishLaneConfiguration as f, getLaneGroup as g, setCommandLaneConcurrency as h, enqueueCommandInLane as i, isCommandLaneTaskMarkerCurrent as l, resetCommandLane as m, clearCommandLane as n, getCommandLaneSnapshot as o, resetAllLanes as p, countQueuedCommandsInLane as r, getQueueSize as s, CommandLaneClearedError as t, isCommandLaneTaskTimeoutError as u };
