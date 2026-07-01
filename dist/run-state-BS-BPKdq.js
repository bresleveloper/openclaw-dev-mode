import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import "./number-coercion-EqFmHmOw.js";
import { r as createAgentRunRestartAbortError } from "./run-termination-CgLu4sKB.js";
import { a as markDiagnosticEmbeddedRunStarted, i as markDiagnosticEmbeddedRunEnded } from "./diagnostic-run-activity-dlxgTFfd.js";
//#region src/auto-reply/reply/reply-run-registry.ts
const replyRunState = resolveGlobalSingleton(Symbol.for("openclaw.replyRunRegistry"), () => ({
	activeRunsByKey: /* @__PURE__ */ new Map(),
	activeSessionIdsByKey: /* @__PURE__ */ new Map(),
	activeKeysBySessionId: /* @__PURE__ */ new Map(),
	waitKeysBySessionId: /* @__PURE__ */ new Map(),
	waitersByKey: /* @__PURE__ */ new Map(),
	followupAdmissionBarriersByKey: /* @__PURE__ */ new Map()
}));
replyRunState.followupAdmissionBarriersByKey ??= /* @__PURE__ */ new Map();
const REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS = 15e3;
var ReplyRunAlreadyActiveError = class extends Error {
	constructor(sessionKey) {
		super(`Reply run already active for ${sessionKey}`);
		this.name = "ReplyRunAlreadyActiveError";
	}
};
var ReplyRunFollowupAdmissionBlockedError = class extends Error {
	constructor(sessionKey) {
		super(`Reply follow-up admission is blocked for ${sessionKey}`);
		this.name = "ReplyRunFollowupAdmissionBlockedError";
	}
};
function createUserAbortError() {
	const err = /* @__PURE__ */ new Error("Reply operation aborted by user");
	err.name = "AbortError";
	return err;
}
function registerWaitSessionId(sessionKey, sessionId) {
	replyRunState.waitKeysBySessionId.set(sessionId, sessionKey);
}
function clearWaitSessionIds(sessionKey) {
	for (const [sessionId, mappedKey] of replyRunState.waitKeysBySessionId) if (mappedKey === sessionKey) replyRunState.waitKeysBySessionId.delete(sessionId);
}
function notifyReplyRunEnded(sessionKey) {
	const waiters = replyRunState.waitersByKey.get(sessionKey);
	if (!waiters || waiters.size === 0) return;
	replyRunState.waitersByKey.delete(sessionKey);
	for (const waiter of waiters) waiter.finish(true);
}
function resolveReplyRunForCurrentSessionId(sessionId) {
	const normalizedSessionId = normalizeOptionalString(sessionId);
	if (!normalizedSessionId) return;
	const sessionKey = replyRunState.activeKeysBySessionId.get(normalizedSessionId);
	if (!sessionKey) return;
	return replyRunState.activeRunsByKey.get(sessionKey);
}
function resolveReplyRunWaitKey(sessionId) {
	const normalizedSessionId = normalizeOptionalString(sessionId);
	if (!normalizedSessionId) return;
	return replyRunState.activeKeysBySessionId.get(normalizedSessionId) ?? replyRunState.waitKeysBySessionId.get(normalizedSessionId);
}
function isReplyRunCompacting(operation) {
	if (operation.phase === "preflight_compacting" || operation.phase === "memory_flushing") return true;
	if (operation.phase !== "running") return false;
	return getAttachedBackend(operation)?.isCompacting?.() ?? false;
}
const attachedBackendByOperation = /* @__PURE__ */ new WeakMap();
const afterClearCallbacksByOperation = /* @__PURE__ */ new WeakMap();
function getAttachedBackend(operation) {
	return attachedBackendByOperation.get(operation);
}
/** Run work after an operation no longer owns its session lane. */
function runAfterReplyOperationClear(operation, afterClear) {
	if (replyRunState.activeRunsByKey.get(operation.key) !== operation) {
		afterClear(operation.sessionId);
		return;
	}
	const callbacks = afterClearCallbacksByOperation.get(operation) ?? /* @__PURE__ */ new Set();
	callbacks.add(afterClear);
	afterClearCallbacksByOperation.set(operation, callbacks);
}
function flushReplyOperationAfterClear(operation, sessionId) {
	const callbacks = afterClearCallbacksByOperation.get(operation);
	if (!callbacks) return;
	afterClearCallbacksByOperation.delete(operation);
	for (const callback of callbacks) callback(sessionId);
}
function registerFollowupAdmissionBarrier(sessionKey, sessionId, barrier, timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	const barriersByKey = replyRunState.followupAdmissionBarriersByKey;
	const previous = barriersByKey.get(sessionKey)?.settled;
	const current = new Promise((resolve) => {
		let settled = false;
		let timer;
		const finish = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve();
		};
		const schedule = (delayMs, callback) => {
			timer = setTimeout(callback, delayMs);
			timer.unref?.();
		};
		if (typeof timeout === "number") schedule(resolveTimerTimeoutMs(timeout, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS), finish);
		else {
			const startedAt = Date.now();
			const maxTimeoutMs = resolveTimerTimeoutMs(timeout.maxTimeoutMs, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS);
			const checkOwnerActivity = () => {
				const remainingMs = maxTimeoutMs - (Date.now() - startedAt);
				if (remainingMs <= 0) {
					finish();
					return;
				}
				let shouldExtend;
				try {
					shouldExtend = timeout.shouldExtend();
				} catch {
					finish();
					return;
				}
				if (!shouldExtend) {
					finish();
					return;
				}
				schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, remainingMs), checkOwnerActivity);
			};
			schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, maxTimeoutMs), checkOwnerActivity);
		}
		Promise.resolve(barrier).then(finish, finish);
	});
	const settled = previous ? Promise.all([previous, current]).then(() => void 0) : current;
	const entry = {
		settled,
		sessionId
	};
	barriersByKey.set(sessionKey, entry);
	settled.then(() => {
		if (barriersByKey.get(sessionKey) === entry) barriersByKey.delete(sessionKey);
	});
	return entry;
}
function updateFollowupAdmissionSessionId(sessionKey, sessionId) {
	const barrier = replyRunState.followupAdmissionBarriersByKey.get(sessionKey);
	if (barrier) barrier.sessionId = sessionId;
}
function clearReplyRunState(params) {
	replyRunState.activeRunsByKey.delete(params.sessionKey);
	replyRunState.activeSessionIdsByKey.delete(params.sessionKey);
	if (replyRunState.activeKeysBySessionId.get(params.sessionId) === params.sessionKey) replyRunState.activeKeysBySessionId.delete(params.sessionId);
	clearWaitSessionIds(params.sessionKey);
	notifyReplyRunEnded(params.sessionKey);
}
function replyRunDiagnosticWorkKey(sessionKey) {
	return `reply:${sessionKey}`;
}
function markReplyRunDiagnosticWorkStarted(params) {
	markDiagnosticEmbeddedRunStarted({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workKey: replyRunDiagnosticWorkKey(params.sessionKey)
	});
}
function markReplyRunDiagnosticWorkEnded(params) {
	markDiagnosticEmbeddedRunEnded({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workKey: replyRunDiagnosticWorkKey(params.sessionKey),
		clearRunActivity: false
	});
}
function createReplyOperation(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionKey) throw new Error("Reply operations require a canonical sessionKey");
	if (!sessionId) throw new Error("Reply operations require a sessionId");
	if (params.respectFollowupAdmissionBarrier && replyRunState.followupAdmissionBarriersByKey.has(sessionKey)) throw new ReplyRunFollowupAdmissionBlockedError(sessionKey);
	if (replyRunState.activeRunsByKey.has(sessionKey)) throw new ReplyRunAlreadyActiveError(sessionKey);
	const controller = new AbortController();
	let currentSessionId = sessionId;
	let phase = "queued";
	let result = null;
	let stateCleared = false;
	let retainFailureUntilComplete = false;
	const clearState = (afterClearBarrier, followupAdmissionBarrierTimeout) => {
		if (stateCleared) return;
		stateCleared = true;
		const registeredBarrier = afterClearBarrier ? registerFollowupAdmissionBarrier(sessionKey, currentSessionId, afterClearBarrier, followupAdmissionBarrierTimeout) : void 0;
		updateFollowupAdmissionSessionId(sessionKey, currentSessionId);
		markReplyRunDiagnosticWorkEnded({
			sessionKey,
			sessionId: currentSessionId
		});
		clearReplyRunState({
			sessionKey,
			sessionId: currentSessionId
		});
		if (!registeredBarrier) {
			flushReplyOperationAfterClear(operation, currentSessionId);
			return;
		}
		registeredBarrier.settled.then(() => flushReplyOperationAfterClear(operation, registeredBarrier.sessionId));
	};
	const abortInternally = (reason) => {
		if (!controller.signal.aborted) controller.abort(reason);
	};
	const abortWithReason = (reason, abortReason, opts) => {
		if (opts?.abortedCode && !result) result = {
			kind: "aborted",
			code: opts.abortedCode
		};
		phase = "aborted";
		abortInternally(abortReason);
		getAttachedBackend(operation)?.cancel(reason);
	};
	if (params.upstreamAbortSignal) if (params.upstreamAbortSignal.aborted) abortInternally(params.upstreamAbortSignal.reason);
	else params.upstreamAbortSignal.addEventListener("abort", () => {
		abortInternally(params.upstreamAbortSignal?.reason);
	}, { once: true });
	const operation = {
		get key() {
			return sessionKey;
		},
		get sessionId() {
			return currentSessionId;
		},
		get routeThreadId() {
			return params.routeThreadId;
		},
		get abortSignal() {
			return controller.signal;
		},
		get resetTriggered() {
			return params.resetTriggered;
		},
		get phase() {
			return phase;
		},
		get result() {
			return result;
		},
		setPhase(next) {
			if (result) return;
			phase = next;
		},
		updateSessionId(nextSessionId) {
			if (result) return;
			const normalizedNextSessionId = normalizeOptionalString(nextSessionId);
			if (!normalizedNextSessionId || normalizedNextSessionId === currentSessionId) return;
			if (replyRunState.activeKeysBySessionId.has(normalizedNextSessionId) && replyRunState.activeKeysBySessionId.get(normalizedNextSessionId) !== sessionKey) throw new Error(`Cannot rebind reply operation ${sessionKey} to active session ${normalizedNextSessionId}`);
			replyRunState.activeKeysBySessionId.delete(currentSessionId);
			registerWaitSessionId(sessionKey, currentSessionId);
			currentSessionId = normalizedNextSessionId;
			updateFollowupAdmissionSessionId(sessionKey, currentSessionId);
			replyRunState.activeSessionIdsByKey.set(sessionKey, currentSessionId);
			replyRunState.activeKeysBySessionId.set(currentSessionId, sessionKey);
			registerWaitSessionId(sessionKey, currentSessionId);
			markReplyRunDiagnosticWorkStarted({
				sessionKey,
				sessionId: currentSessionId
			});
		},
		attachBackend(handle) {
			if (result) {
				handle.cancel(result.kind === "aborted" ? result.code === "aborted_for_restart" ? "restart" : "user_abort" : "superseded");
				return;
			}
			attachedBackendByOperation.set(operation, handle);
			if (controller.signal.aborted) handle.cancel("superseded");
		},
		detachBackend(handle) {
			if (getAttachedBackend(operation) === handle) attachedBackendByOperation.delete(operation);
		},
		retainFailureUntilComplete() {
			retainFailureUntilComplete = true;
		},
		complete() {
			if (!result) {
				result = { kind: "completed" };
				phase = "completed";
			}
			clearState();
		},
		completeThen(afterClear) {
			runAfterReplyOperationClear(operation, afterClear);
			operation.complete();
		},
		completeWithAfterClearBarrier(barrier, timeoutMs) {
			if (!result) {
				result = { kind: "completed" };
				phase = "completed";
			}
			clearState(barrier, timeoutMs);
		},
		fail(code, cause) {
			if (!result) {
				result = {
					kind: "failed",
					code,
					cause
				};
				phase = "failed";
			}
			if (!retainFailureUntilComplete) clearState();
		},
		abortByUser() {
			const phaseBeforeAbort = phase;
			abortWithReason("user_abort", createUserAbortError(), { abortedCode: "aborted_by_user" });
			if (phaseBeforeAbort === "queued") clearState();
		},
		abortForRestart() {
			const phaseBeforeAbort = phase;
			abortWithReason("restart", createAgentRunRestartAbortError(), { abortedCode: "aborted_for_restart" });
			if (phaseBeforeAbort === "queued") clearState();
		}
	};
	replyRunState.activeRunsByKey.set(sessionKey, operation);
	replyRunState.activeSessionIdsByKey.set(sessionKey, currentSessionId);
	replyRunState.activeKeysBySessionId.set(currentSessionId, sessionKey);
	registerWaitSessionId(sessionKey, currentSessionId);
	markReplyRunDiagnosticWorkStarted({
		sessionKey,
		sessionId: currentSessionId
	});
	return operation;
}
const replyRunRegistry = {
	begin(params) {
		return createReplyOperation(params);
	},
	get(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.activeRunsByKey.get(normalizedSessionKey);
	},
	isActive(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return false;
		return replyRunState.activeRunsByKey.has(normalizedSessionKey);
	},
	isStreaming(sessionKey) {
		const operation = this.get(sessionKey);
		if (!operation || operation.phase !== "running") return false;
		return getAttachedBackend(operation)?.isStreaming() ?? false;
	},
	abort(sessionKey) {
		const operation = this.get(sessionKey);
		if (!operation) return false;
		operation.abortByUser();
		return true;
	},
	waitForIdle(sessionKey, timeoutMs, opts) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey || !replyRunState.activeRunsByKey.has(normalizedSessionKey)) return Promise.resolve(true);
		if (opts?.signal?.aborted) return Promise.resolve(false);
		return new Promise((resolve) => {
			const waiters = replyRunState.waitersByKey.get(normalizedSessionKey) ?? /* @__PURE__ */ new Set();
			let abortHandler;
			let settled = false;
			const waiter = { finish: (ended) => {
				if (settled) return;
				settled = true;
				waiters.delete(waiter);
				if (waiters.size === 0) replyRunState.waitersByKey.delete(normalizedSessionKey);
				if (waiter.timer) clearTimeout(waiter.timer);
				if (abortHandler) opts?.signal?.removeEventListener("abort", abortHandler);
				resolve(ended);
			} };
			if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs)) waiter.timer = setTimeout(() => waiter.finish(false), resolveTimerTimeoutMs(timeoutMs, 100, 100));
			if (opts?.signal) {
				abortHandler = () => waiter.finish(false);
				opts.signal.addEventListener("abort", abortHandler, { once: true });
			}
			waiters.add(waiter);
			replyRunState.waitersByKey.set(normalizedSessionKey, waiters);
			if (!replyRunState.activeRunsByKey.has(normalizedSessionKey)) waiter.finish(true);
		});
	},
	resolveSessionId(sessionKey) {
		const normalizedSessionKey = normalizeOptionalString(sessionKey);
		if (!normalizedSessionKey) return;
		return replyRunState.activeSessionIdsByKey.get(normalizedSessionKey);
	}
};
function resolveActiveReplyRunSessionId(sessionKey) {
	return replyRunRegistry.resolveSessionId(sessionKey);
}
function resolveActiveReplyRunThreadId(sessionKey) {
	return replyRunRegistry.get(sessionKey)?.routeThreadId;
}
function isReplyRunActiveForSessionId(sessionId) {
	return resolveReplyRunForCurrentSessionId(sessionId) !== void 0;
}
function isReplyRunAbortableForCompaction(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	return Boolean(operation && operation.phase !== "queued");
}
function isReplyRunStreamingForSessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!operation || operation.phase !== "running") return false;
	return getAttachedBackend(operation)?.isStreaming() ?? false;
}
function queueReplyRunMessage(sessionId, text) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	const backend = operation ? getAttachedBackend(operation) : void 0;
	if (!operation || operation.phase !== "running" || !backend?.queueMessage) return false;
	if (!backend.isStreaming()) return false;
	backend.queueMessage(text);
	return true;
}
function abortReplyRunBySessionId(sessionId) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!operation) return false;
	operation.abortByUser();
	return true;
}
function forceClearReplyRunBySessionId(sessionId, cause) {
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!operation) return false;
	operation.fail("run_failed", cause);
	operation.complete();
	return true;
}
function waitForReplyRunEndBySessionId(sessionId, timeoutMs) {
	const waitKey = resolveReplyRunWaitKey(sessionId);
	if (!waitKey) return Promise.resolve(true);
	return replyRunRegistry.waitForIdle(waitKey, timeoutMs);
}
async function waitForReplyRunFollowupAdmission(sessionKey, timeoutMs, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	if (!normalizedSessionKey) return { settled: true };
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 100, 100);
	const deadline = Date.now() + resolvedTimeoutMs;
	let sessionId;
	while (true) {
		if (opts?.signal?.aborted) return { settled: false };
		const barrier = replyRunState.followupAdmissionBarriersByKey.get(normalizedSessionKey);
		if (!barrier) return {
			settled: true,
			sessionId
		};
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) return { settled: false };
		let timer;
		let abortHandler;
		const outcome = await Promise.race([
			barrier.settled.then(() => true),
			new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), remainingMs);
				timer.unref?.();
			}),
			...opts?.signal ? [new Promise((resolve) => {
				abortHandler = () => resolve(false);
				opts.signal?.addEventListener("abort", abortHandler, { once: true });
			})] : []
		]);
		if (timer) clearTimeout(timer);
		if (abortHandler) opts?.signal?.removeEventListener("abort", abortHandler);
		if (!outcome) return { settled: false };
		sessionId = barrier.sessionId;
	}
}
function abortActiveReplyRuns(opts) {
	let aborted = false;
	for (const operation of replyRunState.activeRunsByKey.values()) {
		if (opts.mode === "compacting" && !isReplyRunCompacting(operation)) continue;
		operation.abortForRestart();
		aborted = true;
	}
	return aborted;
}
function getActiveReplyRunCount() {
	return replyRunState.activeRunsByKey.size;
}
function listActiveReplyRunSessionIds() {
	return [...replyRunState.activeSessionIdsByKey.values()];
}
function listActiveReplyRunSessionKeys() {
	return [...replyRunState.activeSessionIdsByKey.keys()];
}
//#endregion
//#region src/agents/embedded-agent-runner/run-state.ts
const embeddedRunState = resolveGlobalSingleton(Symbol.for("openclaw.embeddedRunState"), () => ({
	activeRuns: /* @__PURE__ */ new Map(),
	snapshots: /* @__PURE__ */ new Map(),
	sessionIdsByKey: /* @__PURE__ */ new Map(),
	sessionIdsByFile: /* @__PURE__ */ new Map(),
	abandonedRunsBySessionId: /* @__PURE__ */ new Map(),
	abandonedRunSessionIdsByKey: /* @__PURE__ */ new Map(),
	abandonedRunSessionIdsByFile: /* @__PURE__ */ new Map(),
	waiters: /* @__PURE__ */ new Map()
}));
const ACTIVE_EMBEDDED_RUNS = embeddedRunState.activeRuns ?? (embeddedRunState.activeRuns = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SNAPSHOTS = embeddedRunState.snapshots ?? (embeddedRunState.snapshots = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY = embeddedRunState.sessionIdsByKey ?? (embeddedRunState.sessionIdsByKey = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE = embeddedRunState.sessionIdsByFile ?? (embeddedRunState.sessionIdsByFile = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID = embeddedRunState.abandonedRunsBySessionId ?? (embeddedRunState.abandonedRunsBySessionId = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY = embeddedRunState.abandonedRunSessionIdsByKey ?? (embeddedRunState.abandonedRunSessionIdsByKey = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE = embeddedRunState.abandonedRunSessionIdsByFile ?? (embeddedRunState.abandonedRunSessionIdsByFile = /* @__PURE__ */ new Map());
const EMBEDDED_RUN_WAITERS = embeddedRunState.waiters ?? (embeddedRunState.waiters = /* @__PURE__ */ new Map());
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
function getActiveEmbeddedRunCount() {
	let activeCount = ACTIVE_EMBEDDED_RUNS.size;
	for (const sessionId of listActiveReplyRunSessionIds()) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) activeCount += 1;
	return Math.max(activeCount, getActiveReplyRunCount());
}
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
function listActiveEmbeddedRunSessionKeys() {
	return [...new Set([...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.keys(), ...listActiveReplyRunSessionKeys()])].toSorted((a, b) => a.localeCompare(b));
}
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
function listActiveEmbeddedRunSessionIds() {
	return [...new Set([
		...ACTIVE_EMBEDDED_RUNS.keys(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.values(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.values(),
		...listActiveReplyRunSessionIds()
	])].toSorted((a, b) => a.localeCompare(b));
}
/** Resolves the current session id for an active run after resets or compaction. */
function resolveActiveEmbeddedRunSessionId(sessionKey) {
	const normalizedSessionKey = sessionKey.trim();
	if (!normalizedSessionKey) return;
	return resolveActiveReplyRunSessionId(normalizedSessionKey) ?? ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
}
//#endregion
export { waitForReplyRunFollowupAdmission as A, listActiveReplyRunSessionKeys as C, resolveActiveReplyRunThreadId as D, resolveActiveReplyRunSessionId as E, runAfterReplyOperationClear as O, isReplyRunStreamingForSessionId as S, replyRunRegistry as T, abortReplyRunBySessionId as _, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE as a, isReplyRunAbortableForCompaction as b, EMBEDDED_RUN_WAITERS as c, listActiveEmbeddedRunSessionKeys as d, resolveActiveEmbeddedRunSessionId as f, abortActiveReplyRuns as g, ReplyRunFollowupAdmissionBlockedError as h, ACTIVE_EMBEDDED_RUNS as i, waitForReplyRunEndBySessionId as k, getActiveEmbeddedRunCount as l, ReplyRunAlreadyActiveError as m, ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE as n, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY as o, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS as p, ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY as r, ACTIVE_EMBEDDED_RUN_SNAPSHOTS as s, ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID as t, listActiveEmbeddedRunSessionIds as u, createReplyOperation as v, queueReplyRunMessage as w, isReplyRunActiveForSessionId as x, forceClearReplyRunBySessionId as y };
