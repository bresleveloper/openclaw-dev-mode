import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { _ as resolveActiveEmbeddedRunRecoveryBlocker } from "./run-state-BmDkKYBf.mjs";
import { b as resolveRunStaleThresholdMs, o as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-BlCpLag4.mjs";
//#region src/auto-reply/reply/reply-run-registry.contracts.ts
const replyMessageInjectionTargetOwner = Symbol("replyMessageInjectionTargetOwner");
const replyRunInterruptTargetOperation = Symbol("replyRunInterruptTargetOperation");
const REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS = 15e3;
const REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS = 6e4;
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
var ReplyRunSuccessorAdmissionBlockedError = class extends Error {
	constructor(sessionKey) {
		super(`Reply successor admission is blocked for ${sessionKey}`);
		this.name = "ReplyRunSuccessorAdmissionBlockedError";
	}
};
//#endregion
//#region src/agents/embedded-agent-runner/runs.probes.ts
const reportedCompactingProbeFailures = /* @__PURE__ */ new WeakSet();
function isEmbeddedRunHandleAbortable(sessionId, handle, mode = "all") {
	if (mode === "compacting" && isEmbeddedRunHandleCompacting(sessionId, handle) !== true) return false;
	try {
		return handle.isAbortable?.() !== false;
	} catch (err) {
		diagnosticLogger.warn(`abort failed: sessionId=${sessionId} reason=abortable_check_failed err=${String(err)}`);
		return false;
	}
}
function isEmbeddedRunHandleCompacting(sessionId, handle) {
	try {
		return handle.isCompacting?.() ?? false;
	} catch (err) {
		if (!reportedCompactingProbeFailures.has(handle)) {
			reportedCompactingProbeFailures.add(handle);
			diagnosticLogger.warn(`embedded run state check failed: sessionId=${sessionId} reason=compacting_check_failed err=${String(err)}`);
		}
		return;
	}
}
function isEmbeddedRunHandleSupersedable(runId, handle) {
	if (!isEmbeddedRunHandleAbortable(runId, handle)) return false;
	try {
		return handle.isStopped?.() !== true && handle.isAborted?.() !== true;
	} catch (err) {
		diagnosticLogger.warn(`supersede failed: runId=${runId} reason=lifecycle_check_failed err=${String(err)}`);
		return false;
	}
}
function canSteerEmbeddedRunDuringCompaction(sessionId, handle) {
	const compacting = isEmbeddedRunHandleCompacting(sessionId, handle);
	return compacting !== void 0 && (!compacting || handle.messageInjectionV2?.version === 2);
}
const replyRunState = resolveGlobalSingleton(Symbol.for("openclaw.replyRunRegistry"), () => ({
	activeRunsByKey: /* @__PURE__ */ new Map(),
	activeSessionIdsByKey: /* @__PURE__ */ new Map(),
	activeKeysBySessionId: /* @__PURE__ */ new Map(),
	waitKeysBySessionId: /* @__PURE__ */ new Map(),
	waitersByKey: /* @__PURE__ */ new Map(),
	followupAdmissionBarriersByKey: /* @__PURE__ */ new Map(),
	successorAdmissionBarriersByKey: /* @__PURE__ */ new Map(),
	sourceTurnByKey: /* @__PURE__ */ new Map(),
	completionObservationsByKey: /* @__PURE__ */ new Map(),
	evictOperationByOperation: /* @__PURE__ */ new WeakMap(),
	executionStartedOperations: /* @__PURE__ */ new WeakSet(),
	lifecycleAdmissionByOperation: /* @__PURE__ */ new WeakMap()
}));
const lifecycleAdmissionByOperation = replyRunState.lifecycleAdmissionByOperation ??= /* @__PURE__ */ new WeakMap();
replyRunState.followupAdmissionBarriersByKey ??= /* @__PURE__ */ new Map();
replyRunState.successorAdmissionBarriersByKey ??= /* @__PURE__ */ new Map();
replyRunState.sourceTurnByKey ??= /* @__PURE__ */ new Map();
const replyRunCompletionObservations = replyRunState.completionObservationsByKey ??= /* @__PURE__ */ new Map();
/** Observe owner departures only for the lifetime of one awaited admission attempt. */
function observeReplyRunCompletions(sessionKey) {
	const observations = replyRunCompletionObservations;
	const observation = {
		changed: false,
		sources: /* @__PURE__ */ new Map()
	};
	const pending = observations.get(sessionKey) ?? /* @__PURE__ */ new Set();
	pending.add(observation);
	observations.set(sessionKey, pending);
	return {
		read: () => observation.changed ? [...observation.sources.values()] : void 0,
		dispose: () => {
			pending.delete(observation);
			observation.sources.clear();
			if (pending.size === 0 && observations.get(sessionKey) === pending) observations.delete(sessionKey);
		}
	};
}
function resolveReplyOperationAgentId(sessionKey, agentId) {
	const owner = normalizeOptionalString(agentId) ?? parseAgentSessionKey(sessionKey)?.agentId;
	return owner ? normalizeAgentId(owner) : void 0;
}
function prepareReplyRunKeyUpdate(operation, nextSessionKey, agentId, stateCleared) {
	const nextKey = normalizeOptionalString(nextSessionKey);
	if (!nextKey) throw new Error("Reply operations require a canonical sessionKey");
	const nextAgentId = resolveReplyOperationAgentId(nextKey, agentId) ?? operation.agentId;
	if (nextKey === operation.key && nextAgentId === operation.agentId) return;
	if (operation.result || stateCleared || operation.phase !== "queued") throw new Error(`Cannot rekey reply operation ${operation.key} in phase ${operation.phase}`);
	const targetOwner = replyRunState.activeRunsByKey.get(nextKey);
	if (targetOwner && targetOwner !== operation) throw new ReplyRunAlreadyActiveError(nextKey);
	if (replyRunState.successorAdmissionBarriersByKey.has(nextKey)) throw new ReplyRunSuccessorAdmissionBlockedError(nextKey);
	return {
		sessionKey: nextKey,
		agentId: nextAgentId
	};
}
const clearReplyOperationByOperation = replyRunState.clearOperationByOperation ??= /* @__PURE__ */ new WeakMap();
const evictReplyOperationByOperation = replyRunState.evictOperationByOperation ?? (replyRunState.evictOperationByOperation = /* @__PURE__ */ new WeakMap());
function clearWaitSessionIds(sessionKey) {
	for (const [sessionId, mappedKey] of replyRunState.waitKeysBySessionId) if (mappedKey === sessionKey) replyRunState.waitKeysBySessionId.delete(sessionId);
}
function notifyReplyRunEnded(sessionKey) {
	for (const observation of replyRunCompletionObservations.get(sessionKey) ?? []) observation.changed = true;
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
	const backend = operation.phase === "running" ? getAttachedBackend(operation) : void 0;
	return backend ? isEmbeddedRunHandleCompacting(operation.sessionId, backend) === true : false;
}
function isReplyOperationPreBackendPhase(phase) {
	return phase === "queued" || phase === "waiting_for_deferred_maintenance" || phase === "waiting_for_global_lane";
}
const attachedBackendByOperation = /* @__PURE__ */ new WeakMap();
const executionStartedOperations = replyRunState.executionStartedOperations ?? (replyRunState.executionStartedOperations = /* @__PURE__ */ new WeakSet());
function markReplyOperationExecutionStarted(operation) {
	executionStartedOperations.add(operation);
}
function hasReplyOperationExecutionStarted(operation) {
	return executionStartedOperations.has(operation);
}
const abortFrozenOperations = /* @__PURE__ */ new WeakSet();
const operationsByUpstreamAbortSignal = /* @__PURE__ */ new WeakMap();
const producerCompletionByOperation = /* @__PURE__ */ new WeakMap();
const retainStateUntilCompleteOperations = /* @__PURE__ */ new WeakSet();
const afterClearByOperation = /* @__PURE__ */ new WeakMap();
const successorBarrierGroupsByOperation = /* @__PURE__ */ new WeakMap();
const expireReplyOperationByOperation = /* @__PURE__ */ new WeakMap();
function getAttachedBackend(operation) {
	return attachedBackendByOperation.get(operation);
}
function expireStaleReplyOperation(operation, reason, options) {
	return expireReplyOperationByOperation.get(operation)?.(reason, options) ?? false;
}
function forceClearReplyOperation(operation, cause) {
	if (replyRunState.activeRunsByKey.get(operation.key) !== operation) return false;
	const clearState = clearReplyOperationByOperation.get(operation);
	if (!clearState) return false;
	operation.fail("run_failed", cause);
	clearState();
	return true;
}
function hasCommittedReplyOperationOutcome(operation) {
	return !operation.result && abortFrozenOperations.has(operation);
}
function isReplyOperationAbortable(operation) {
	if (operation.result || abortFrozenOperations.has(operation)) return false;
	const backend = getAttachedBackend(operation);
	if (!backend?.isAbortable) return true;
	try {
		return backend.isAbortable();
	} catch {
		return false;
	}
}
function isReplyRunAbortableForSignal(signal) {
	const operation = operationsByUpstreamAbortSignal.get(signal);
	return operation ? isReplyOperationAbortable(operation) : true;
}
/** Resolve only the live operation admitted with this exact upstream signal. */
function resolveActiveReplyRunOwnerForSignal(signal) {
	const operation = operationsByUpstreamAbortSignal.get(signal);
	if (!operation) return;
	const { key: sessionKey, sessionId } = operation;
	const isCurrent = () => !signal.aborted && !operation.result && operation.key === sessionKey && operation.sessionId === sessionId && replyRunState.activeRunsByKey.get(sessionKey) === operation;
	if (!isCurrent()) return;
	return {
		sessionId,
		sessionKey,
		abort: () => isCurrent() && operation.abortByUser(),
		handoff: (settle) => {
			const producerCompleted = producerCompletionByOperation.get(operation);
			if (!isCurrent() || !producerCompleted) return false;
			const settlement = settle(producerCompleted);
			registerReplyOperationSuccessorBarrier({
				operation,
				sessionId,
				sessionKeys: [sessionKey],
				start: () => settlement
			});
			return true;
		}
	};
}
/** Keep terminal state registered until the operation owner exits via complete(). */
function retainReplyOperationUntilComplete(operation) {
	retainStateUntilCompleteOperations.add(operation);
}
function runAfterReplyOperationClear(operation, afterClear) {
	const afterClearState = afterClearByOperation.get(operation);
	if (!afterClearState?.barrier && replyRunState.activeRunsByKey.get(operation.key) !== operation) {
		const barrier = replyRunState.followupAdmissionBarriersByKey.get(operation.key);
		const source = barrier?.sources.get(lifecycleAdmissionByOperation.get(operation)?.databaseIdentity);
		if (barrier && source) {
			barrier.settled.then(() => afterClear(source.sessionId));
			return;
		}
		afterClear(operation.sessionId);
		return;
	}
	const state = afterClearState ?? { callbacks: /* @__PURE__ */ new Set() };
	state.callbacks.add(afterClear);
	afterClearByOperation.set(operation, state);
}
function isReplyOperationAbortedForRestart(operation) {
	return operation.result?.kind === "aborted" && operation.result.code === "aborted_for_restart";
}
function mergeReplyRunAdmissionSource(source, previous) {
	if (previous && !isReplyOperationAbortedForRestart(previous.operation) && previous.databaseIdentity === source.databaseIdentity && source.sessionIds.has(previous.sessionId)) {
		for (const id of source.sessionIds) previous.sessionIds.add(id);
		return Object.assign(previous, source, { sessionIds: previous.sessionIds });
	}
	return source;
}
function resolveReplyRunAdmissionSource(operation, sessionId, previous) {
	return mergeReplyRunAdmissionSource({
		sessionId,
		sessionIds: operation.captureOwnedSessionIds(),
		operation,
		databaseIdentity: lifecycleAdmissionByOperation.get(operation)?.databaseIdentity
	}, previous);
}
function registerReplyRunAdmissionBarrier(barriersByKey, sessionKey, initialSource, barrier) {
	const previous = barriersByKey.get(sessionKey);
	const source = mergeReplyRunAdmissionSource(initialSource, previous?.sources.get(initialSource.databaseIdentity));
	const sources = new Map(previous?.sources);
	sources.set(source.databaseIdentity, source);
	const settled = previous ? Promise.all([previous.settled, barrier]).then(() => void 0) : barrier;
	const entry = {
		settled,
		source,
		sources
	};
	barriersByKey.set(sessionKey, entry);
	settled.then(() => {
		if (barriersByKey.get(sessionKey) === entry) barriersByKey.delete(sessionKey);
	});
	return entry;
}
/** Fence successor admission until owner handoff started at slot clear settles. */
function registerReplyOperationSuccessorBarrier(params) {
	const settlement = createDeferredCore();
	const sources = /* @__PURE__ */ new Map();
	for (const sessionKey of new Set(params.sessionKeys.map(normalizeOptionalString))) if (sessionKey) sources.set(sessionKey, resolveReplyRunAdmissionSource(params.operation, params.sessionId));
	const publish = () => {
		for (const [sessionKey, source] of sources) sources.set(sessionKey, registerReplyRunAdmissionBarrier(replyRunState.successorAdmissionBarriersByKey, sessionKey, source, settlement.promise).source);
	};
	if (!params.deferUntilClear) publish();
	let started = false;
	const start = () => {
		if (started) return;
		started = true;
		try {
			if (params.deferUntilClear) publish();
			Promise.resolve(params.start()).then(() => settlement.resolve(void 0), () => {});
		} catch {}
	};
	if (replyRunState.activeRunsByKey.get(params.operation.key) !== params.operation) {
		start();
		return;
	}
	const groups = successorBarrierGroupsByOperation.get(params.operation) ?? /* @__PURE__ */ new Set();
	groups.add({
		registrationKey: params.operation.key,
		sources,
		start
	});
	successorBarrierGroupsByOperation.set(params.operation, groups);
}
function startReplyOperationSuccessorBarriers(operation) {
	const groups = successorBarrierGroupsByOperation.get(operation);
	successorBarrierGroupsByOperation.delete(operation);
	for (const { start } of groups ?? []) start();
}
function updateSuccessorAdmissionSessionId(operation, sessionId) {
	for (const group of successorBarrierGroupsByOperation.get(operation) ?? []) {
		if (group.registrationKey !== operation.key) continue;
		for (const source of group.sources.values()) resolveReplyRunAdmissionSource(operation, sessionId, source);
	}
}
function isReplyRunSuccessorAdmissionBlocked(sessionKey) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	return Boolean(normalizedSessionKey && !replyRunState.activeRunsByKey.has(normalizedSessionKey) && replyRunState.successorAdmissionBarriersByKey.has(normalizedSessionKey));
}
function flushReplyOperationAfterClear(operation, sessionId) {
	const state = afterClearByOperation.get(operation);
	if (!state) return;
	afterClearByOperation.delete(operation);
	for (const callback of state.callbacks) callback(sessionId);
}
function waitForReplyBarrierSettlement(barrier, timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	return new Promise((resolve) => {
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
				try {
					if (remainingMs > 0 && timeout.shouldExtend()) {
						schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, remainingMs), checkOwnerActivity);
						return;
					}
				} catch {}
				finish();
			};
			schedule(Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, maxTimeoutMs), checkOwnerActivity);
		}
		Promise.resolve(barrier).then(finish, finish);
	});
}
function registerFollowupAdmissionBarrier(operation, barrier, timeout = REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS) {
	const entry = registerReplyRunAdmissionBarrier(replyRunState.followupAdmissionBarriersByKey, operation.key, resolveReplyRunAdmissionSource(operation, operation.sessionId), waitForReplyBarrierSettlement(barrier, timeout));
	const afterClear = afterClearByOperation.get(operation) ?? { callbacks: /* @__PURE__ */ new Set() };
	afterClear.barrier = entry;
	afterClearByOperation.set(operation, afterClear);
	return entry;
}
function updateFollowupAdmissionSessionId(operation) {
	const sources = replyRunState.followupAdmissionBarriersByKey.get(operation.key)?.sources;
	const databaseIdentity = lifecycleAdmissionByOperation.get(operation)?.databaseIdentity;
	const source = sources?.get(databaseIdentity);
	if (sources && source) sources.set(databaseIdentity, resolveReplyRunAdmissionSource(operation, operation.sessionId, source));
}
function clearReplyRunState(params) {
	if (replyRunState.activeRunsByKey.get(params.sessionKey) !== params.operation) {
		if (replyRunState.activeKeysBySessionId.get(params.sessionId) === params.sessionKey && replyRunState.activeSessionIdsByKey.get(params.sessionKey) !== params.sessionId) replyRunState.activeKeysBySessionId.delete(params.sessionId);
		return;
	}
	for (const observation of replyRunState.completionObservationsByKey?.get(params.sessionKey) ?? []) {
		if (!params.operation.result || params.operation.key !== params.sessionKey || isReplyOperationAbortedForRestart(params.operation)) {
			observation.sources.clear();
			continue;
		}
		const source = resolveReplyRunAdmissionSource(params.operation, params.sessionId);
		observation.sources.set(source.databaseIdentity, mergeReplyRunAdmissionSource(source, observation.sources.get(source.databaseIdentity)));
	}
	replyRunState.activeRunsByKey.delete(params.sessionKey);
	replyRunState.activeSessionIdsByKey.delete(params.sessionKey);
	replyRunState.sourceTurnByKey.delete(params.sessionKey);
	if (replyRunState.activeKeysBySessionId.get(params.sessionId) === params.sessionKey) replyRunState.activeKeysBySessionId.delete(params.sessionId);
	clearWaitSessionIds(params.sessionKey);
	notifyReplyRunEnded(params.sessionKey);
}
function isReplyRunRecoveryBlocked(operation) {
	const backend = getAttachedBackend(operation);
	const blocker = !operation.result && backend ? resolveActiveEmbeddedRunRecoveryBlocker(operation.sessionId, backend) : void 0;
	return blocker === "human_input_wait" || blocker === "runtime_owned_wait";
}
function isReplyRunEvidenceStale(operation) {
	const recoveryBlocked = isReplyRunRecoveryBlocked(operation);
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: operation.sessionId,
		sessionKey: operation.key
	});
	return !operation.result && operation.phase !== "waiting_for_global_lane" && Date.now() - operation.lastActivityAtMs > resolveRunStaleThresholdMs(activity, Date.now() - operation.lastActivityAtMs) && !recoveryBlocked;
}
function expireVisibleStaleOperation(operation) {
	if (!operation) return false;
	const idleMs = Date.now() - operation.lastActivityAtMs;
	if (operation.result) return idleMs >= 6e4 && expireStaleReplyOperation(operation, "terminal_unreleased");
	return isReplyRunEvidenceStale(operation) && expireStaleReplyOperation(operation, "no_activity");
}
function resolveVisibleActiveWaitMs(operation) {
	if (!operation || isReplyRunRecoveryBlocked(operation)) return REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS;
	const ageMs = Date.now() - operation.lastActivityAtMs;
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: operation.sessionId,
		sessionKey: operation.key
	});
	const remainingMs = operation.result ? REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS - ageMs : resolveRunStaleThresholdMs(activity, ageMs) - ageMs;
	return Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, Math.max(1, remainingMs));
}
//#endregion
export { replyRunInterruptTargetOperation as $, registerReplyOperationSuccessorBarrier as A, startReplyOperationSuccessorBarriers as B, mergeReplyRunAdmissionSource as C, prepareReplyRunKeyUpdate as D, operationsByUpstreamAbortSignal as E, resolveReplyRunWaitKey as F, isEmbeddedRunHandleAbortable as G, updateSuccessorAdmissionSessionId as H, resolveVisibleActiveWaitMs as I, REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS as J, isEmbeddedRunHandleSupersedable as K, retainReplyOperationUntilComplete as L, resolveActiveReplyRunOwnerForSignal as M, resolveReplyOperationAgentId as N, producerCompletionByOperation as O, resolveReplyRunForCurrentSessionId as P, replyMessageInjectionTargetOwner as Q, retainStateUntilCompleteOperations as R, markReplyOperationExecutionStarted as S, observeReplyRunCompletions as T, waitForReplyBarrierSettlement as U, updateFollowupAdmissionSessionId as V, canSteerEmbeddedRunDuringCompaction as W, ReplyRunFollowupAdmissionBlockedError as X, ReplyRunAlreadyActiveError as Y, ReplyRunSuccessorAdmissionBlockedError as Z, isReplyRunAbortableForSignal as _, evictReplyOperationByOperation as a, isReplyRunSuccessorAdmissionBlocked as b, expireVisibleStaleOperation as c, getAttachedBackend as d, hasCommittedReplyOperationOutcome as f, isReplyOperationPreBackendPhase as g, isReplyOperationAbortedForRestart as h, clearReplyRunState as i, replyRunState as j, registerFollowupAdmissionBarrier as k, flushReplyOperationAfterClear as l, isReplyOperationAbortable as m, attachedBackendByOperation as n, expireReplyOperationByOperation as o, hasReplyOperationExecutionStarted as p, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS as q, clearReplyOperationByOperation as r, expireStaleReplyOperation as s, abortFrozenOperations as t, forceClearReplyOperation as u, isReplyRunCompacting as v, notifyReplyRunEnded as w, lifecycleAdmissionByOperation as x, isReplyRunEvidenceStale as y, runAfterReplyOperationClear as z };
