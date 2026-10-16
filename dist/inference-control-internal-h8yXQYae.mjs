import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
//#region src/gateway/worker-environments/inference-control-internal.ts
var WorkerInferenceSessionDrainBusyError = class extends Error {
	constructor(sessionId) {
		super(`Worker inference drain already owns session ${sessionId}`);
	}
};
const sessionControlByService = /* @__PURE__ */ new WeakMap();
function registerWorkerInferenceSessionControl(service, control) {
	sessionControlByService.set(service, control);
}
function getWorkerInferenceSessionControl(service) {
	if (typeof service !== "object" || service === null) return;
	return sessionControlByService.get(service);
}
function safeRevalidate(revalidate, onFailure, assertSourceCurrent) {
	try {
		assertSourceCurrent?.();
		return revalidate?.() ?? null;
	} catch (error) {
		onFailure?.(error);
		return "provider-error";
	}
}
function matchesIdentity(identity, request) {
	const claim = identity.turnClaim;
	if (!claim || identity.sessionId !== request.sessionId || identity.runId !== request.runId || claim.sessionId !== request.sessionId || claim.runId !== request.runId) return "session-not-attached";
	if (identity.ownerEpoch !== request.runEpoch) return "epoch-mismatch";
	return null;
}
var WorkerInferenceAuthorityError = class extends Error {
	constructor(reason, cause) {
		super(`Worker inference authority changed: ${reason}`, { cause });
		this.reason = reason;
	}
};
function preserveInferenceAuthorityFailure(error, authorityFailure) {
	if (!authorityFailure || error === authorityFailure.error) return error;
	if (error instanceof WorkerInferenceAuthorityError && error.cause === authorityFailure.error && !hasSqliteWorkerOutcomeUnknown(error)) return authorityFailure.error;
	return new AggregateError([authorityFailure.error, error], "Worker inference authority and settlement failed", { cause: error });
}
async function joinInferenceOperations(operations, retainedFailures = [], aggregateMessage = "Worker inference settlement failed") {
	const results = await Promise.allSettled(operations);
	const errors = [.../* @__PURE__ */ new Set([...results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), ...retainedFailures])];
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, aggregateMessage);
}
function createWorkerInferenceSessionControls(params) {
	const { active, operations, unknownSettlements, recovered, settleAbort } = params;
	const drainingSessions = /* @__PURE__ */ new Map();
	let stoppingPromise;
	let stopping = false;
	const captureCancellationEntries = (predicate) => [...active.values()].filter(predicate).map((entry) => ({
		entry,
		claimKey: entry.claimKey,
		sessionId: entry.request.sessionId,
		runId: entry.request.runId,
		turnId: entry.request.turnId
	}));
	const cancelCaptured = (captured, reason, control) => {
		const settling = [];
		let failure;
		try {
			for (const { entry, claimKey, sessionId, runId, turnId } of captured) {
				control?.assertCurrent?.();
				if (active.get(claimKey) !== entry || entry.claimKey !== claimKey || entry.request.sessionId !== sessionId || entry.request.runId !== runId || entry.request.turnId !== turnId) continue;
				settling.push(settleAbort(entry, reason));
				control?.onCancelled?.(runId);
			}
		} catch (error) {
			failure = { error };
		}
		return joinInferenceOperations(settling, failure ? [failure.error] : []);
	};
	const cancelWhere = (predicate, reason) => cancelCaptured(captureCancellationEntries(predicate), reason);
	const cancelEnvironment = (environmentId, reason = "session-not-attached") => cancelWhere((entry) => entry.identity.environmentId === environmentId, reason);
	const cancelClaim = (claimKey) => cancelWhere((entry) => entry.claimKey === claimKey, "session-not-attached");
	const captureSessionCancellation = (sessionId, runId) => {
		const captured = captureCancellationEntries((entry) => entry.request.sessionId === sessionId && (runId === void 0 || entry.request.runId === runId));
		return {
			runIds: [...new Set(captured.map((entry) => entry.runId))].toSorted(),
			cancel(control) {
				const cancelled = /* @__PURE__ */ new Set();
				return cancelCaptured(captured, "cancelled", {
					assertCurrent: control?.assertCurrent,
					onCancelled(cancelledRunId) {
						cancelled.add(cancelledRunId);
						control?.onCancelled?.(cancelledRunId);
					}
				}).then(() => [...cancelled].toSorted());
			}
		};
	};
	const cancelSession = (sessionId, runId) => captureSessionCancellation(sessionId, runId).cancel();
	const hasSession = (sessionId, runId) => [...active.values()].some((entry) => entry.request.sessionId === sessionId && (runId === void 0 || entry.request.runId === runId));
	const hasSessionOperation = (sessionId) => [...operations.values()].some((owner) => owner.sessionId === sessionId);
	const reserveSessionDrain = (sessionId) => {
		const captured = captureCancellationEntries((entry) => entry.request.sessionId === sessionId);
		const entries = new Set(captured.map(({ entry }) => entry));
		const capturedOperations = new Set([...operations].flatMap(([operation, owner]) => owner.sessionId === sessionId ? [operation] : []));
		const capturedStoreKeys = /* @__PURE__ */ new Set([...captured.map(({ entry }) => entry.storeKey), ...[...operations.values()].filter((owner) => owner.sessionId === sessionId).map((owner) => owner.storeKey)]);
		let reserved = true;
		let accepted;
		const assertReserved = () => {
			if (!reserved) throw new Error("Worker inference drain reservation is no longer pending");
			if (drainingSessions.has(sessionId)) throw new WorkerInferenceSessionDrainBusyError(sessionId);
			if ([...active.values()].some((entry) => entry.request.sessionId === sessionId && !entries.has(entry)) || [...operations].some(([operation, owner]) => owner.sessionId === sessionId && !capturedOperations.has(operation))) throw new Error("Worker inference registrations changed before drain acceptance");
		};
		return {
			assertReserved,
			accept() {
				assertReserved();
				reserved = false;
				let started = false;
				let settled = false;
				let releaseRequested = false;
				let released = false;
				const release = () => {
					releaseRequested = true;
					if (settled && !released) {
						released = true;
						if (drainingSessions.get(sessionId) === drained) drainingSessions.delete(sessionId);
					}
				};
				const startedSignal = createDeferredCore();
				let cancelling;
				const drained = startedSignal.promise.then(() => joinInferenceOperations([...capturedOperations, cancelling], [...capturedStoreKeys].flatMap((storeKey) => Array.from(unknownSettlements.get(storeKey) ?? []))));
				drainingSessions.set(sessionId, drained);
				const settle = () => {
					settled = true;
					if (releaseRequested) release();
				};
				drained.then(settle, settle);
				accepted = {
					drained,
					hasWork: () => hasSession(sessionId) || hasSessionOperation(sessionId),
					start() {
						if (!started) {
							started = true;
							cancelling = cancelCaptured(captured, "cancelled");
							startedSignal.resolve();
						}
					},
					release
				};
				return accepted;
			},
			release() {
				reserved = false;
				accepted?.release();
			}
		};
	};
	const resolveSessionTargetForRunId = (runId) => {
		let target;
		for (const entry of active.values()) {
			if (entry.request.runId !== runId) continue;
			const source = entry.sessionTarget;
			if (target && (source.agentId !== target.agentId || source.sessionId !== target.sessionId || source.sessionKey !== target.sessionKey || source.storePath !== target.storePath || source.expectedLifecycleRevision !== target.expectedLifecycleRevision || source.expectedWriterRunId !== target.expectedWriterRunId)) return;
			target = source;
		}
		return target;
	};
	const stop = () => {
		if (stoppingPromise) return stoppingPromise;
		stopping = true;
		const stopped = createDeferredCore();
		stoppingPromise = stopped.promise;
		const acceptedDrains = new Map(drainingSessions);
		const cancelling = cancelWhere((entry) => !acceptedDrains.has(entry.request.sessionId), "provider-error");
		joinInferenceOperations([
			recovered,
			...operations.keys(),
			...acceptedDrains.values(),
			cancelling
		], [...unknownSettlements.values()].flatMap((errors) => Array.from(errors))).then(stopped.resolve, stopped.reject);
		return stoppingPromise;
	};
	return {
		isStopping: () => stopping,
		isDraining: (sessionId) => drainingSessions.has(sessionId),
		getClosing: (sessionId) => drainingSessions.get(sessionId) ?? stoppingPromise,
		cancelEnvironment,
		cancelClaim,
		cancelSession,
		captureSessionCancellation,
		reserveSessionDrain,
		hasSession,
		resolveSessionTargetForRunId,
		stop
	};
}
//#endregion
export { joinInferenceOperations as a, registerWorkerInferenceSessionControl as c, getWorkerInferenceSessionControl as i, safeRevalidate as l, WorkerInferenceSessionDrainBusyError as n, matchesIdentity as o, createWorkerInferenceSessionControls as r, preserveInferenceAuthorityFailure as s, WorkerInferenceAuthorityError as t };
