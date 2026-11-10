import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { f as getAgentRunLifecycleGeneration } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, v as registerAgentEventLifecycleRotationHandler } from "./agent-events-Bf3Js0D3.mjs";
import { O as isSameSubagentRun, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { S as getFollowupCohortOwner, x as bindFollowupCohortOwner } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/subagents/announce/subagent-announce.requester-settle-state.ts
/** Delivered findings stay consumed unless restart reconciliation still owns them. */
function needsRequesterSettleFindings(entry) {
	return entry.delivery?.status !== "delivered" || entry.execution.interruptionReason === "gateway-restart";
}
const activeRequesterSettleWakeBatches = /* @__PURE__ */ new Map();
const REQUESTER_SETTLE_WAKE_MAX_DEFERRALS = 10;
/** Reads stay independent; the first prepared decision owns mutation and delivery. */
function createRequesterSettleBatchClaim(key, isGatewayCurrent) {
	const hadGatewayContext = isGatewayCurrent?.() === true;
	if (isGatewayCurrent && !hadGatewayContext) return;
	const isGatewayClosed = () => {
		try {
			return hadGatewayContext && !isGatewayCurrent?.();
		} catch {
			return hadGatewayContext;
		}
	};
	return {
		isGatewayClosed,
		claim: () => {
			const owner = activeRequesterSettleWakeBatches.get(key);
			if (owner === isGatewayClosed) return true;
			if (owner?.() === false) return false;
			activeRequesterSettleWakeBatches.set(key, isGatewayClosed);
			return true;
		},
		release() {
			if (activeRequesterSettleWakeBatches.get(key) === isGatewayClosed) activeRequesterSettleWakeBatches.delete(key);
		}
	};
}
function retainedYieldIdentity(state) {
	return {
		...state.pauseNotice ? { pauseNotice: state.pauseNotice } : {},
		...state.requesterYieldBatch === true ? { requesterYieldBatch: true } : {},
		...state.afterRequesterYield === true ? { afterRequesterYield: true } : {},
		...state.yieldedFinalDeliverable === true ? { yieldedFinalDeliverable: true } : {},
		...state.rearmGeneration !== void 0 ? { rearmGeneration: state.rearmGeneration } : {}
	};
}
function startRequesterSettleWakeAttempt(state, batchRunIds, admissionMarker) {
	return {
		status: "dispatching",
		attemptCount: state.attemptCount + 1,
		batchRunIds,
		deferralCount: state.deferralCount,
		...retainedYieldIdentity(state),
		...admissionMarker
	};
}
function deferRequesterSettleWakePreparation(state) {
	return {
		...state,
		nextAttemptAt: Date.now() + 3e4
	};
}
/** Returns true when the stale-descendant wait is spent and this batch may dispatch. */
function createRequesterSettleBatchDeferral(params) {
	return async (overrides = {}, countTowardsLimitOverride) => {
		let countTowardsLimit = countTowardsLimitOverride;
		if (countTowardsLimit === void 0) {
			const descendants = await params.readDescendants();
			if (!descendants) return false;
			countTowardsLimit = descendants.active === 0;
		}
		if (!params.claimCurrentBatch()) return false;
		const state = {
			...params.readState(),
			...overrides
		};
		const now = Date.now();
		if ((state.nextAttemptAt ?? 0) > now) return false;
		const deferralCount = (state.deferralCount ?? 0) >= REQUESTER_SETTLE_WAKE_MAX_DEFERRALS ? REQUESTER_SETTLE_WAKE_MAX_DEFERRALS : countTowardsLimit ? (state.deferralCount ?? 0) + 1 : 0;
		if (countTowardsLimit && deferralCount >= REQUESTER_SETTLE_WAKE_MAX_DEFERRALS) {
			if (state.deferralCount !== deferralCount) await params.transitionBatch({
				...state,
				deferralCount
			});
			logWarn(`requester settle wake stopped waiting for unsettled descendants after ${deferralCount} deferrals; delivering the drained batch`);
			return true;
		}
		await params.transitionBatch({
			status: state.status,
			attemptCount: state.attemptCount,
			...state.replayCount !== void 0 ? { replayCount: state.replayCount } : {},
			nextAttemptAt: Math.max(state.nextAttemptAt ?? 0, now + params.retryDelayMs),
			batchRunIds: params.batchRunIds,
			...retainedYieldIdentity(state),
			...state.lastError !== void 0 ? { lastError: state.lastError } : {},
			deferralCount
		});
		return false;
	};
}
function readSharedBatchState(batch) {
	const states = batch.map((entry) => entry.requesterSettleWake).filter((state) => Boolean(state));
	const source = states.find((state) => state.status === "dispatching") ?? states[0];
	return {
		status: source?.status ?? "pending",
		...source?.pauseNotice ? { pauseNotice: source.pauseNotice } : {},
		attemptCount: Math.max(0, ...states.map((state) => state.attemptCount)),
		...source?.replayCount !== void 0 ? { replayCount: source.replayCount } : {},
		...source?.nextAttemptAt !== void 0 ? { nextAttemptAt: source.nextAttemptAt } : {},
		...source?.batchRunIds ? { batchRunIds: [...source.batchRunIds] } : {},
		...states.some((state) => state.requesterYieldBatch === true) ? { requesterYieldBatch: true } : {},
		...states.some((state) => state.afterRequesterYield === true) ? { afterRequesterYield: true } : {},
		...source?.yieldedFinalDeliverable === true ? { yieldedFinalDeliverable: true } : {},
		...source?.rearmGeneration !== void 0 ? { rearmGeneration: source.rearmGeneration } : {},
		...source?.lastError !== void 0 ? { lastError: source.lastError } : {},
		deferralCount: Math.max(0, ...states.map((state) => state.deferralCount ?? 0))
	};
}
function captureRequesterRunOwner(requesterRun) {
	const requesterTaskRunId = requesterRun?.taskRunId ?? requesterRun?.runId;
	return (currentRequester, continuationRunId) => {
		if (!currentRequester || !requesterRun) return !currentRequester && !requesterRun;
		if (isSameSubagentRun(currentRequester, requesterRun)) return isSameSubagentRunOwner(currentRequester, requesterRun);
		return currentRequester.runId === continuationRunId && currentRequester.taskRunId === requesterTaskRunId && currentRequester.requesterSessionKey === requesterRun.requesterSessionKey && currentRequester.requesterAgentId === requesterRun.requesterAgentId;
	};
}
/**
* A yield hands continuation back to the requester, so its own final may reach the
* conversation under its normal reply rules; private findings stay wake input. The
* policy is fixed when the yield writes the batch: a batch without the marker came
* from an earlier build and stays private, so an upgrade cannot republish its input.
*/
function resolveRequesterSettlePolicy(completionRows, requesterYielded, state, requester, completionRowsMatchRequester) {
	const privateRows = completionRows.filter((entry) => entry.completionTarget === "parent");
	const hasPrivateRows = privateRows.length > 0;
	const yieldedFinalDeliverable = hasPrivateRows && requesterYielded && state.yieldedFinalDeliverable === true;
	const parentOnly = hasPrivateRows && !yieldedFinalDeliverable;
	const bindRequester = hasPrivateRows || completionRows.length > 0 && completionRowsMatchRequester;
	const requesterBinding = {
		...parentOnly ? { completionTarget: "parent" } : {},
		...bindRequester ? {
			completionRequesterSessionId: requester.sessionId,
			completionRequesterLifecycleRevision: requester.lifecycleRevision
		} : {}
	};
	const admissionMarker = yieldedFinalDeliverable ? { yieldedFinalDeliverable: true } : {};
	return {
		privateRows,
		requireVisibleReply: requesterYielded && !hasPrivateRows && completionRows.some(needsRequesterSettleFindings),
		parentOnly,
		requesterBinding,
		admissionMarker
	};
}
//#endregion
//#region src/agents/subagents/requester-final-attachment.ts
const REQUESTER_FINAL_ATTACHMENT_KEY = Symbol.for("openclaw.subagents.requesterFinalAttachment");
const REQUESTER_FINAL_ATTACHMENT_MAX_TTL_MS = 72e5;
const state$1 = resolveGlobalSingleton(REQUESTER_FINAL_ATTACHMENT_KEY, () => ({ byOwner: /* @__PURE__ */ new Map() }), (value) => value.byOwner.clear());
function ownerKey(requesterAgentId, requesterSessionKey) {
	return `${requesterAgentId}\u0000${requesterSessionKey}`;
}
function sameRunIds(left, right) {
	return left.length === right.length && left.every((runId, index) => runId === right[index]);
}
function getCurrentAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = state$1.byOwner.get(key);
	if (!attachment) return;
	if (attachment.expiresAt <= Date.now() || attachment.lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
		state$1.byOwner.delete(key);
		return;
	}
	if (params.requesterSessionId !== void 0 && attachment.requesterSessionId !== params.requesterSessionId || params.batchRunIds !== void 0 && (!attachment.batch || !sameRunIds(attachment.batch.batchRunIds, params.batchRunIds.toSorted())) || params.rearmGeneration !== void 0 && attachment.batch?.rearmGeneration !== params.rearmGeneration) return;
	return attachment;
}
function registerRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	const attachment = {
		requesterSessionId: params.requesterSessionId,
		requesterTurnRunId: params.requesterTurnRunId,
		lifecycleGeneration: params.lifecycleGeneration,
		expiresAt: Date.now() + Math.min(params.timeoutMs, REQUESTER_FINAL_ATTACHMENT_MAX_TTL_MS),
		append: params.append
	};
	state$1.byOwner.set(key, attachment);
	const deleteIfCurrent = (requireProvisional) => {
		const current = state$1.byOwner.get(key);
		if (current === attachment && (!requireProvisional || !current.batch)) state$1.byOwner.delete(key);
	};
	return {
		releaseProvisional: () => deleteIfCurrent(true),
		revoke: () => deleteIfCurrent(false)
	};
}
function promoteRequesterFinalAttachment(params) {
	const attachment = getCurrentAttachment({
		requesterAgentId: params.requesterAgentId,
		requesterSessionKey: params.requesterSessionKey
	});
	if (!attachment || attachment.requesterTurnRunId !== params.requesterTurnRunId) return false;
	attachment.batch = {
		batchRunIds: params.batchRunIds.toSorted(),
		rearmGeneration: params.rearmGeneration
	};
	return true;
}
function transferRequesterFinalAttachment(params) {
	const attachment = getCurrentAttachment(params);
	if (!attachment) return false;
	attachment.requesterTurnRunId = params.requesterTurnRunId;
	return true;
}
function revokeRequesterFinalAttachment(params) {
	const key = ownerKey(params.requesterAgentId, params.requesterSessionKey);
	if (!getCurrentAttachment(params)) return false;
	state$1.byOwner.delete(key);
	return true;
}
/** A settled yield batch either attaches its visible final or releases the attachment. */
function finalizeRequesterFinalAttachment(params) {
	const { requesterAgentId, rearmGeneration } = params;
	if (params.pause || !requesterAgentId || params.requesterYieldBatch !== true || rearmGeneration === void 0) return;
	const owner = {
		requesterAgentId,
		requesterSessionKey: params.requesterSessionKey,
		batchRunIds: params.batchRunIds,
		rearmGeneration
	};
	const text = params.finalAssistantVisibleText?.trim();
	if (!params.delivered || !params.requesterSessionId || !text) {
		revokeRequesterFinalAttachment(owner);
		return;
	}
	const attachment = getCurrentAttachment({
		...owner,
		requesterSessionId: params.requesterSessionId
	});
	if (!attachment) return;
	state$1.byOwner.delete(ownerKey(requesterAgentId, params.requesterSessionKey));
	try {
		attachment.append(text);
	} catch {}
}
registerAgentEventLifecycleRotationHandler("requester-final-attachments", () => {
	state$1.byOwner.clear();
});
//#endregion
//#region src/agents/subagents/completion/session-followup-completion.ts
/** Same-process custody for a followup's result across committed yield cohorts. */
const state = resolveGlobalSingleton(Symbol.for("openclaw.sessions.followupCompletion"), () => ({
	requests: new AsyncLocalStorage(),
	successors: new AsyncLocalStorage(),
	executions: /* @__PURE__ */ new Map()
}));
function withFollowupRequest(request, run) {
	return state.requests.run(request, run);
}
function readFollowupRequest(runId, targetSessionKey) {
	const request = state.requests.getStore();
	return request?.runId === runId && request.targetSessionKey === targetSessionKey ? request : void 0;
}
function readFollowupSuccessor(runId, targetSessionKey) {
	const successor = state.successors.getStore();
	return successor?.runId === runId && successor.owner.request.targetSessionKey === targetSessionKey ? successor : void 0;
}
/** A weak cohort tombstone must survive revocation: missing authority is not System authority. */
function getFollowupForCohort(entries) {
	const owner = entries.length ? getFollowupCohortOwner(entries[0]) : void 0;
	return owner && entries.every((entry) => getFollowupCohortOwner(entry) === owner) ? owner : void 0;
}
function promoteFollowupYield(params) {
	if (params.rearmGeneration === void 0) return;
	state.executions.get(params.requesterTurnRunId)?.promoteYield(params.requesterTurnRunId, params.entries, params.rearmGeneration);
}
function withFollowupSuccessor(successor, run) {
	successor.assertCurrent();
	return successor.owner.request.custody.run(() => state.successors.run(successor, run));
}
var SessionFollowupCompletion = class SessionFollowupCompletion {
	constructor(request) {
		this.request = request;
		this.lifetime = new AbortController();
		this.signal = this.lifetime.signal;
		this.lifecycleGeneration = getAgentRunLifecycleGeneration();
		this.result = createDeferredCore();
		this.acceptedExecution = false;
		this.taking = false;
		this.consumed = false;
		this.execution = {
			runId: request.runId,
			settled: createDeferredCore(),
			yielded: false
		};
		this.revoked = () => this.close(/* @__PURE__ */ new Error("Followup completion authority was revoked."));
		this.result.promise.catch(() => {});
	}
	static bind(request, assertAdmissionCurrent) {
		request.custody.assertCurrent();
		assertAdmissionCurrent?.();
		const owner = new SessionFollowupCompletion(request);
		state.executions.set(request.runId, owner);
		request.custody.signal.addEventListener("abort", owner.revoked, { once: true });
		if (request.custody.signal.aborted) owner.revoked();
		try {
			owner.assertCurrent();
			assertAdmissionCurrent?.();
			return owner;
		} catch (error) {
			owner.close(error);
			throw error;
		}
	}
	assertCurrent() {
		this.signal.throwIfAborted();
		assertAgentRunLifecycleGenerationCurrent(this.lifecycleGeneration);
		if (state.executions.get(this.execution.runId) !== this) throw new Error("Followup completion owner was replaced.");
		this.request.custody.assertCurrent();
	}
	get accepted() {
		return this.acceptedExecution;
	}
	markAccepted(runId) {
		this.assertCurrent();
		if (!this.ownsExecution(runId)) throw new Error("Followup acceptance belongs to another execution.");
		this.acceptedExecution = true;
	}
	finishExecution(runId) {
		if (!this.ownsExecution(runId)) return;
		this.execution.settled.resolve();
		if (this.terminal) this.result.resolve(this.terminal);
	}
	ownsExecution(runId) {
		return !this.signal.aborted && this.execution.runId === runId;
	}
	assertExecutionCurrent(runId) {
		this.assertCurrent();
		if (this.execution.runId !== runId || this.execution.yielded || this.terminal || !this.acceptedExecution) throw new Error("Followup no longer owns this accepted execution.");
	}
	promoteYield(runId, entries, generation) {
		this.assertCurrent();
		if (this.execution.runId !== runId || this.terminal || entries.length === 0 || entries.some((entry) => entry.requesterSessionKey !== this.request.targetSessionKey || entry.requesterSettleWake?.rearmGeneration !== generation || entry.requesterSettleWake.requesterYieldBatch !== true)) throw new Error("Followup yield does not own the committed completion cohort.");
		this.cohort = {
			entries: [...entries],
			generation
		};
		for (const entry of entries) bindFollowupCohortOwner(entry, this);
	}
	successor(entries, runId, assertBatchCurrent) {
		const cohort = this.cohort ?? (this.execution.runId === runId ? this.execution.admittedCohort : void 0);
		if (!cohort || cohort.entries.length !== entries.length || !entries.every((entry) => cohort.entries.some((current) => isSameSubagentRunOwner(current, entry)))) throw new Error("Followup completion cohort was replaced.");
		const assertCurrent = () => {
			this.assertCurrent();
			assertBatchCurrent();
			if (this.cohort !== cohort && !(this.execution.runId === runId && this.execution.admittedCohort === cohort) || entries.some((observed) => {
				const entry = cohort.entries.find((current) => isSameSubagentRunOwner(current, observed));
				return !entry || getFollowupCohortOwner(entry) !== this || entry.requesterSettleWake?.rearmGeneration !== cohort.generation || entry.killIntent || entry.killReconciliation || entry.suppressCompletionDelivery;
			})) throw new Error("Followup successor no longer owns its completion cohort.");
		};
		assertCurrent();
		return {
			owner: this,
			cohort,
			runId,
			assertCurrent
		};
	}
	async prepareSuccessor(successor) {
		successor.assertCurrent();
		await this.execution.settled.promise;
		successor.assertCurrent();
		if (!this.execution.yielded || this.terminal) throw new Error("Followup predecessor did not yield.");
	}
	adopt(successor) {
		successor.assertCurrent();
		if (!this.execution.yielded || this.terminal) throw new Error("Followup predecessor is not paused.");
		if (this.cohort !== successor.cohort) throw new Error("Followup handoff no longer permits a new execution.");
		state.executions.delete(this.execution.runId);
		this.execution = {
			runId: successor.runId,
			settled: createDeferredCore(),
			yielded: false,
			admittedCohort: successor.cohort
		};
		this.cohort = void 0;
		this.acceptedExecution = false;
		state.executions.set(successor.runId, this);
	}
	async settle(runId, reply, assertExecutionCurrent) {
		this.assertCurrent();
		assertExecutionCurrent?.();
		if (this.execution.runId !== runId) throw new Error("Followup terminal execution was replaced.");
		if (reply.status === "ok" && reply.yielded && this.cohort) {
			this.execution.yielded = true;
			return { kind: "yielded" };
		}
		const result = reply.status === "ok" && reply.yielded ? {
			status: "error",
			error: "Followup yielded without a committed completion handoff."
		} : reply;
		if (!buildAgentRunTerminalOutcomeFromWaitResult(result)) throw new Error("Followup execution has no terminal outcome.");
		this.terminal ??= result;
		return {
			kind: "terminal",
			reply: this.terminal
		};
	}
	/** A timeout transfers observation, not result consumption. No second observer is launched. */
	async take(timeoutMs) {
		this.assertCurrent();
		if (this.consumed || this.taking) throw new Error("Followup result already has a consumer.");
		this.taking = true;
		try {
			const reply = timeoutMs === void 0 ? await this.result.promise : await raceWithTimeout(this.result.promise, timeoutMs, () => void 0);
			this.assertCurrent();
			if (reply) this.consumed = true;
			return reply;
		} finally {
			this.taking = false;
		}
	}
	replaceCohortEntry(previous, next) {
		const cohorts = [this.cohort, this.execution.admittedCohort].filter((cohort) => Boolean(cohort?.entries.some((entry) => isSameSubagentRunOwner(entry, previous))));
		if (!isSameSubagentRunOwner(previous, next) && ((previous.taskRunId ?? previous.runId) !== (next.taskRunId ?? next.runId) || previous.childSessionKey !== next.childSessionKey || previous.requesterSessionKey !== next.requesterSessionKey || previous.requesterAgentId !== next.requesterAgentId || !next.requesterSettleWake)) return;
		for (const cohort of cohorts) cohort.entries = cohort.entries.map((entry) => isSameSubagentRunOwner(entry, previous) ? next : entry);
	}
	close(error) {
		if (this.signal.aborted) return;
		this.lifetime.abort(error ?? /* @__PURE__ */ new Error("Followup completion custody ended."));
		if (state.executions.get(this.execution.runId) === this) state.executions.delete(this.execution.runId);
		this.execution.settled.resolve();
		this.result.reject(error ?? /* @__PURE__ */ new Error("Followup completion custody ended."));
		this.request.custody.signal.removeEventListener("abort", this.revoked);
		this.request.custody.release();
	}
};
registerAgentEventLifecycleRotationHandler("session-followup-completions", () => {
	const failures = [];
	const retainedOwners = [...state.executions.values()];
	for (const owner of retainedOwners) try {
		owner.assertCurrent();
	} catch (reason) {
		try {
			owner.close(reason);
		} catch (error) {
			failures.push(error);
		}
	}
	if (failures.length > 0) throw new AggregateError(failures, "Failed to release retired followup custody");
});
//#endregion
export { needsRequesterSettleFindings as _, readFollowupSuccessor as a, retainedYieldIdentity as b, finalizeRequesterFinalAttachment as c, revokeRequesterFinalAttachment as d, transferRequesterFinalAttachment as f, deferRequesterSettleWakePreparation as g, createRequesterSettleBatchDeferral as h, readFollowupRequest as i, promoteRequesterFinalAttachment as l, createRequesterSettleBatchClaim as m, getFollowupForCohort as n, withFollowupRequest as o, captureRequesterRunOwner as p, promoteFollowupYield as r, withFollowupSuccessor as s, SessionFollowupCompletion as t, registerRequesterFinalAttachment as u, readSharedBatchState as v, startRequesterSettleWakeAttempt as x, resolveRequesterSettlePolicy as y };
