import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { b as runWithGatewayDetachedWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { l as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-MlBhwaKa.mjs";
import { a as registerSystemEventStoreOwner, i as recordSystemEventStoreReplaced, n as isSystemEventStoreCurrent, t as getSystemEventStorePath } from "./system-event-ownership-CHVGbaAW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/heartbeat-reason.ts
/** Normalize a heartbeat wake reason for logs and UI. */
function normalizeHeartbeatWakeReason(reason) {
	return reason?.trim() || "requested";
}
//#endregion
//#region src/infra/session-event-wake.ts
const SLOTS = [
	"task",
	"scheduled",
	"event"
];
const COALESCE_MS = 250;
const RETRY_MS = 1e3;
const SESSION_EVENT_IDLE_RETRY_MS = 6e4;
const MAX_ACTIVE_TARGETS = 4;
const GLOBAL_TARGET = "::";
const RETRY_REASONS = /* @__PURE__ */ new Set([
	"active-run",
	"requests-in-flight",
	"cron-in-progress",
	"preempted",
	"channel-not-ready"
]);
const GUARD_REASONS = /* @__PURE__ */ new Set([
	"not-due",
	"min-spacing",
	"flood"
]);
function isRetryableSessionEventWakeReason(reason) {
	return RETRY_REASONS.has(reason);
}
function priority(wake) {
	return wake.intent === "manual" || wake.intent === "immediate" ? 3 : wake.source === "retry" || wake.reason === "retry" ? 0 : wake.intent === "scheduled" || wake.source === "interval" || wake.reason === "interval" ? 1 : 2;
}
function merge(previous, next) {
	const preferred = previous.intent === "task" !== (next.intent === "task") ? previous.intent === "task" ? previous : next : priority(next) > priority(previous) || priority(next) === priority(previous) && next.requestedAt >= previous.requestedAt ? next : previous;
	const other = preferred === previous ? next : previous;
	const tasks = new Map([...previous.tasks ?? [], ...next.tasks ?? []].map((task) => [task.jobId, task]));
	const bypass = (preferred.intent === "manual" || preferred.intent === "immediate") && !preferred.retainedWork;
	return {
		...preferred,
		intent: preferred.intent === "scheduled" ? other.intent : preferred.intent,
		sequence: Math.min(previous.sequence, next.sequence),
		barrierSequence: previous.barrierSequence === void 0 ? next.barrierSequence : Math.min(previous.barrierSequence, next.barrierSequence ?? Infinity),
		requestedAt: !bypass && (previous.notBefore || next.notBefore) ? Math.min(previous.requestedAt, next.requestedAt) : preferred.requestedAt,
		readyAt: Math.min(previous.readyAt, next.readyAt),
		notBefore: bypass ? 0 : Math.max(previous.notBefore, next.notBefore),
		heartbeat: preferred.heartbeat ?? other.heartbeat,
		scheduledEveryMs: preferred.scheduledEveryMs ?? other.scheduledEveryMs,
		tasks: tasks.size ? [...tasks.values()].toSorted((left, right) => left.jobId.localeCompare(right.jobId)) : void 0,
		retainedWork: !bypass && (previous.retainedWork || next.retainedWork),
		settlements: [...previous.settlements, ...next.settlements].filter((entry) => entry.active),
		workStarted: previous.workStarted || next.workStarted,
		pureNativePoll: previous.pureNativePoll && next.pureNativePoll
	};
}
function targetKey(request) {
	if (!request.sessionKey || request.sessionKey === "global" && !request.agentId) return `${request.agentId ?? ""}::`;
	return parseAgentSessionKey(request.sessionKey) ? `::${request.sessionKey}` : `${request.agentId ?? ""}::${request.sessionKey}`;
}
function shouldRetain(wake, result) {
	return RETRY_REASONS.has(result.reason) || GUARD_REASONS.has(result.reason) && Boolean(wake.tasks?.length || wake.intent === "task" || wake.intent === "event" || wake.intent === "immediate");
}
function createSessionEventWakeRuntime() {
	const pending = /* @__PURE__ */ new Map();
	const active = /* @__PURE__ */ new Map();
	const waiters = /* @__PURE__ */ new Set();
	const attempts = new AsyncLocalStorage();
	let handler = null;
	let generation = 0;
	let sequence = 0;
	let timer;
	let timerDueAt = 0;
	let timerDefersReadyWork = false;
	let enabled = true;
	const isCurrent = (wake) => !wake.retired && isSystemEventStoreCurrent(wake.sessionKey, wake.sessionStorePath, wake.agentId);
	function retire(wake) {
		if (wake.retired) return;
		wake.retired = true;
		settle(wake, {
			status: "skipped",
			reason: "store-replaced"
		});
		recordSystemEventStoreReplaced();
	}
	registerSystemEventStoreOwner(Symbol.for("openclaw.sessionEventWake"), () => {
		for (const [key, group] of pending) {
			for (const slot of SLOTS) {
				const wake = group[slot];
				if (wake && !isCurrent(wake)) {
					delete group[slot];
					retire(wake);
				}
			}
			if (!SLOTS.some((slot) => group[slot])) pending.delete(key);
		}
		for (const owner of active.values()) for (const wake of owner.wakes) if (!isCurrent(wake)) {
			retire(wake);
			owner.controller.abort();
		}
	});
	function enqueue(wake, blockedUntil = 0) {
		const key = targetKey(wake);
		if (!isCurrent(wake)) {
			retire(wake);
			return key;
		}
		const group = pending.get(key) ?? { blockedUntil: 0 };
		const slot = wake.intent === "task" ? "task" : wake.intent === "scheduled" ? "scheduled" : "event";
		group[slot] = group[slot] ? merge(group[slot], wake) : wake;
		group.blockedUntil = Math.max(group.blockedUntil, blockedUntil);
		pending.set(key, group);
		for (const entry of wake.settlements) if (entry.active) entry.onQueued?.();
		return key;
	}
	function isReady(group, now) {
		return Boolean(group && group.blockedUntil <= now && SLOTS.some((slot) => {
			const wake = group[slot];
			return wake && Math.max(wake.readyAt, wake.notBefore) <= now;
		}));
	}
	function afterBarrier(key, wake, global) {
		const barrier = global?.event?.intent === "immediate" ? global.event.barrierSequence : void 0;
		return key !== GLOBAL_TARGET && barrier !== void 0 && wake.sequence >= barrier;
	}
	function takeReady() {
		if (active.has(GLOBAL_TARGET)) return [];
		const now = performance.now();
		const global = pending.get(GLOBAL_TARGET);
		const globalReady = isReady(global, now);
		if (globalReady && active.size) return [];
		const event = global?.event;
		const flush = globalReady && event?.intent === "immediate" && Math.max(event.readyAt, event.notBefore) <= now;
		const candidates = globalReady && global ? flush ? [...pending].filter(([key]) => key !== GLOBAL_TARGET).concat([[GLOBAL_TARGET, global]]) : [[GLOBAL_TARGET, global]] : pending;
		const ready = [];
		for (const [key, group] of candidates) {
			if (ready.length + active.size >= MAX_ACTIVE_TARGETS) break;
			if (active.has(key) || group.blockedUntil > now || key === GLOBAL_TARGET && (active.size || ready.length)) continue;
			const picked = {};
			for (const slot of SLOTS) {
				const wake = group[slot];
				if (wake && !afterBarrier(key, wake, global) && wake.notBefore <= now && (flush || wake.readyAt <= now)) {
					picked[slot] = wake;
					delete group[slot];
				}
			}
			if (!SLOTS.some((slot) => group[slot])) pending.delete(key);
			let wakes;
			if (picked.task) {
				const task = picked.scheduled ? merge(picked.scheduled, picked.task) : picked.task;
				wakes = picked.event ? [task, picked.event].toSorted((left, right) => Number(Boolean(right.retainedWork)) - Number(Boolean(left.retainedWork)) || left.requestedAt - right.requestedAt) : [task];
			} else if (picked.event) wakes = [picked.scheduled ? merge(picked.scheduled, picked.event) : picked.event];
			else wakes = picked.scheduled ? [picked.scheduled] : [];
			if (wakes.length) ready.push({
				key,
				wakes
			});
		}
		return ready;
	}
	function settle(wake, result) {
		for (const entry of wake.settlements) entry.settle(result);
	}
	function retry(wake, result) {
		const idleGrace = result && (result.reason === "preempted" || result.reason === "channel-not-ready" || (result.reason === "requests-in-flight" || result.reason === "active-run") && (wake.intent === "scheduled" || wake.intent === "task"));
		const guard = idleGrace || result && GUARD_REASONS.has(result.reason);
		const delay = result?.retryAtMs !== void 0 ? Math.max(0, result.retryAtMs - Date.now()) : idleGrace ? SESSION_EVENT_IDLE_RETRY_MS : RETRY_MS;
		const deadline = performance.now() + delay;
		if (result) {
			const retryAtMs = Date.now() + delay;
			for (const entry of wake.settlements) if (entry.active && entry.stopWaitingOnRetry?.(result, retryAtMs)) entry.settle(result);
		}
		enqueue({
			...wake,
			readyAt: performance.now(),
			notBefore: guard ? deadline : 0,
			retainedWork: guard ? true : wake.retainedWork
		}, guard ? 0 : deadline);
	}
	function handOff(wakes, start) {
		for (const wake of wakes.slice(start)) enqueue(wake);
	}
	async function dispatch(key, wakes, owner, run) {
		const signal = owner.controller.signal;
		try {
			for (const [index, wake] of wakes.entries()) {
				if (wake.retired) continue;
				const blockedUntil = pending.get(key)?.blockedUntil ?? 0;
				if (owner.generation !== generation || blockedUntil > performance.now()) {
					handOff(wakes, index);
					return;
				}
				const attempt = {
					signal,
					wake,
					terminalPollDisposition: false
				};
				let result;
				let onAbort;
				try {
					result = await runWithGatewayDetachedWorkAdmission(() => {
						signal.throwIfAborted();
						for (const entry of wake.settlements) if (entry.active) entry.onAttemptStarted?.();
						const aborted = new Promise((_resolve, reject) => {
							onAbort = () => reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Heartbeat handler was replaced"));
							signal.addEventListener("abort", onAbort, { once: true });
						});
						const request = {
							source: wake.source,
							intent: wake.intent,
							reason: wake.reason,
							...wake.agentId ? { agentId: wake.agentId } : {},
							...wake.sessionKey ? { sessionKey: wake.sessionKey } : {},
							...wake.sessionStorePath === void 0 ? {} : { sessionStorePath: wake.sessionStorePath },
							...wake.heartbeat ? { heartbeat: wake.heartbeat } : {},
							...wake.scheduledEveryMs !== void 0 ? { scheduledEveryMs: wake.scheduledEveryMs } : {},
							...wake.tasks ? { tasks: wake.tasks } : {},
							...wake.retainedWork ? { retainedWork: true } : {}
						};
						const running = attempts.run(attempt, async () => run(request, signal));
						return Promise.race([running, aborted]);
					}, "heartbeat:wake");
				} catch {
					if (wake.retired) continue;
					if (owner.generation === generation) retry(wake);
					else enqueue(wake);
					continue;
				} finally {
					if (onAbort) signal.removeEventListener("abort", onAbort);
				}
				if (wake.retired) continue;
				if (result.status === "skipped" && !isTerminalPollAttempt(attempt) && shouldRetain(wake, result)) {
					if (owner.generation === generation) retry(wake, result);
					else enqueue(wake);
				} else settle(wake, result);
			}
		} finally {
			if (active.get(key) === owner) active.delete(key);
			schedulePending();
		}
	}
	function scheduleAt(dueAt, defersReadyWork = false) {
		if (!handler || timer && timerDueAt <= dueAt) return;
		clearTimeout(timer);
		timerDueAt = dueAt;
		timerDefersReadyWork = defersReadyWork;
		timer = setTimeout(() => {
			timer = void 0;
			timerDefersReadyWork = false;
			const run = handler;
			if (!run) return;
			const ready = takeReady().map(({ key, wakes }) => {
				const owner = {
					generation,
					controller: new AbortController(),
					wakes
				};
				active.set(key, owner);
				return {
					key,
					wakes,
					owner
				};
			});
			for (const { key, wakes, owner } of ready) dispatch(key, wakes, owner, run);
			schedulePending();
		}, resolveTimerTimeoutMs(Math.max(0, dueAt - performance.now()), COALESCE_MS, 0));
		timer.unref?.();
	}
	function schedulePending(readyDelayMs = 0, changedKey) {
		if (active.size >= MAX_ACTIVE_TARGETS || active.has(GLOBAL_TARGET)) return;
		const now = performance.now();
		const global = pending.get(GLOBAL_TARGET);
		if (active.size && isReady(global, now)) return;
		let earliest = Infinity;
		const changedGroup = changedKey ? pending.get(changedKey) : void 0;
		const candidates = timer && !timerDefersReadyWork && changedKey && changedKey !== GLOBAL_TARGET && changedGroup ? [[changedKey, changedGroup]] : pending;
		for (const [key, group] of candidates) {
			if (active.has(key)) continue;
			for (const slot of SLOTS) {
				const wake = group[slot];
				if (wake && !afterBarrier(key, wake, global)) earliest = Math.min(earliest, Math.max(wake.readyAt, wake.notBefore, group.blockedUntil));
			}
		}
		if (Number.isFinite(earliest)) {
			const ready = earliest <= now;
			scheduleAt(ready ? now + readyDelayMs : earliest, ready && readyDelayMs > 0);
		}
	}
	function setSessionEventWakeHandler(next) {
		const previousGeneration = generation;
		generation += 1;
		const ownedGeneration = generation;
		handler = next;
		if (!next) for (const waiter of waiters) waiter.settle({
			status: "skipped",
			reason: "handler-unavailable"
		});
		clearTimeout(timer);
		timer = void 0;
		timerDefersReadyWork = false;
		if (next) for (const group of pending.values()) {
			group.blockedUntil = 0;
			for (const slot of SLOTS) {
				const wake = group[slot];
				if (wake) {
					wake.notBefore = 0;
					wake.retainedWork = false;
				}
			}
		}
		for (const owner of active.values()) if (owner.generation === previousGeneration) owner.controller.abort();
		schedulePending(COALESCE_MS);
		return () => {
			if (generation === ownedGeneration) setSessionEventWakeHandler(null);
		};
	}
	function enqueueRequest(options, settlement) {
		const now = performance.now();
		const { coalesceMs, ...wake } = options;
		const normalized = {
			...wake,
			agentId: normalizeOptionalString(wake.agentId),
			sessionKey: normalizeOptionalString(wake.sessionKey),
			reason: normalizeHeartbeatWakeReason(wake.reason)
		};
		const nextSequence = ++sequence;
		runWithoutOwnedSessionTranscriptWrites(() => {
			schedulePending(0, enqueue({
				...normalized,
				sessionStorePath: options.sessionStorePath === void 0 && normalized.sessionKey ? getSystemEventStorePath(normalized.sessionKey, normalized.agentId) : options.sessionStorePath,
				sequence: nextSequence,
				barrierSequence: targetKey(normalized) === GLOBAL_TARGET && wake.intent === "immediate" ? nextSequence : void 0,
				requestedAt: now,
				readyAt: now + resolveTimerTimeoutMs(coalesceMs, COALESCE_MS, 0),
				notBefore: 0,
				settlements: settlement ? [settlement] : [],
				workStarted: false,
				pureNativePoll: targetKey(normalized) !== GLOBAL_TARGET && wake.source === "interval" && wake.intent === "scheduled" && typeof wake.scheduledEveryMs === "number" && Number.isSafeInteger(wake.scheduledEveryMs) && wake.scheduledEveryMs > 0 && !wake.tasks?.length
			}));
		});
	}
	function requestSessionEventWake(options) {
		enqueueRequest(options);
	}
	function requestSessionEventWakeAndWait(options, lifecycle) {
		return new Promise((resolve) => {
			const signal = lifecycle?.abortSignal;
			const settlement = {
				active: true,
				onAttemptStarted: lifecycle?.onAttemptStarted,
				onQueued: lifecycle?.onQueued,
				stopWaitingOnRetry: lifecycle?.stopWaitingOnRetry,
				settle: (result) => {
					if (settlement.active) {
						settlement.active = false;
						waiters.delete(settlement);
						signal?.removeEventListener("abort", onAbort);
						resolve(result);
					}
				}
			};
			const onAbort = () => settlement.settle({
				status: "failed",
				reason: "heartbeat wake cancelled"
			});
			if (signal?.aborted) onAbort();
			else if (!handler) settlement.settle({
				status: "skipped",
				reason: "handler-unavailable"
			});
			else {
				waiters.add(settlement);
				signal?.addEventListener("abort", onAbort, { once: true });
				enqueueRequest(options, settlement);
			}
		});
	}
	function isTerminalPollAttempt(attempt) {
		return Boolean(attempt && !attempt.signal.aborted && attempt.terminalPollDisposition && attempt.wake.pureNativePoll && !attempt.wake.workStarted);
	}
	function markSessionEventWakeWorkStarted() {
		const attempt = attempts.getStore();
		if (attempt) {
			attempt.signal.throwIfAborted();
			attempt.wake.workStarted = true;
			attempt.terminalPollDisposition = false;
		}
	}
	function deferSessionEventWakePoll() {
		const attempt = attempts.getStore();
		if (!attempt || attempt.signal.aborted || !attempt.wake.pureNativePoll || attempt.wake.workStarted) return false;
		attempt.terminalPollDisposition = true;
		return true;
	}
	return {
		setSessionEventWakeHandler,
		requestSessionEventWake,
		requestSessionEventWakeAndWait,
		getSessionEventWakeAbortSignal: () => attempts.getStore()?.signal,
		markSessionEventWakeWorkStarted,
		deferSessionEventWakePoll,
		isSessionEventWakePollDeferred: () => isTerminalPollAttempt(attempts.getStore()),
		areSessionEventWakesEnabled: () => enabled,
		setSessionEventWakesEnabled: (value) => {
			enabled = value;
		}
	};
}
const { setSessionEventWakeHandler, requestSessionEventWake, requestSessionEventWakeAndWait, getSessionEventWakeAbortSignal, markSessionEventWakeWorkStarted, deferSessionEventWakePoll, isSessionEventWakePollDeferred, areSessionEventWakesEnabled, setSessionEventWakesEnabled } = resolveGlobalSingleton(Symbol.for("openclaw.sessionEventWake"), createSessionEventWakeRuntime);
//#endregion
//#region src/infra/heartbeat-wake.ts
const HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT = "requests-in-flight";
const HEARTBEAT_SKIP_CRON_IN_PROGRESS = "cron-in-progress";
const HEARTBEAT_SKIP_NO_PENDING_EVENT = "no-pending-event";
const HEARTBEAT_SKIP_CHANNEL_NOT_READY = "channel-not-ready";
function setHeartbeatWakeHandler(next) {
	return setSessionEventWakeHandler(next ? (wake) => next(wake) : null);
}
//#endregion
export { setHeartbeatWakeHandler as a, deferSessionEventWakePoll as c, isSessionEventWakePollDeferred as d, markSessionEventWakeWorkStarted as f, setSessionEventWakesEnabled as h, HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT as i, getSessionEventWakeAbortSignal as l, requestSessionEventWakeAndWait as m, HEARTBEAT_SKIP_CRON_IN_PROGRESS as n, SESSION_EVENT_IDLE_RETRY_MS as o, requestSessionEventWake as p, HEARTBEAT_SKIP_NO_PENDING_EVENT as r, areSessionEventWakesEnabled as s, HEARTBEAT_SKIP_CHANNEL_NOT_READY as t, isRetryableSessionEventWakeReason as u };
