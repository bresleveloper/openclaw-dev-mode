import { S as isSameSubagentRunOwner, h as compareSubagentRunGeneration, x as isSameSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/announce-idempotency.ts
/**
* Stable announce identifiers for child-run completion messages.
* Versioned keys let future formats coexist with persisted v1 delivery records.
*/
function buildAnnounceIdFromChildRun(params) {
	return `v1:${params.childSessionKey}:${params.childRunId}`;
}
function buildAnnounceIdempotencyKey(announceId) {
	return `announce:${announceId}`;
}
//#endregion
//#region src/agents/subagents/registry/subagent-requester-settle-identity.ts
function buildRequesterSettleWakeIdentity(params) {
	const batchKey = [
		`requester-settle:${params.requesterAgentId ?? "unknown"}:${params.requesterSessionKey}:${params.batchRunIds.toSorted().join(",")}`,
		params.rearmGeneration === void 0 ? void 0 : `yield-${params.rearmGeneration}`,
		params.pause ? "pause" : void 0
	].filter(Boolean).join(":");
	const attemptIndex = params.attemptIndex ?? 0;
	return {
		batchKey,
		runId: buildAnnounceIdempotencyKey(params.sharedAttemptKey && !params.pause || attemptIndex === 0 ? batchKey : `${batchKey}:retry-${attemptIndex}`)
	};
}
function isRequesterSettleWakeForRun(params) {
	const { entry, requesterSessionKey, requesterAgentId } = params;
	const wake = entry.requesterSettleWake;
	const pauseNotice = entry.pauseReason === "sessions_yield" && wake?.pauseNotice;
	const batchRunIds = pauseNotice ? [entry.runId] : wake?.batchRunIds;
	if (entry.requesterSessionKey !== requesterSessionKey || entry.requesterAgentId && entry.requesterAgentId !== requesterAgentId || !wake || wake.attemptCount < 1 || !isSameSubagentRun(params.runsById.get(entry.runId), entry) || !batchRunIds?.includes(entry.runId)) return false;
	const sharedAttemptKey = wake.yieldedFinalDeliverable !== true && batchRunIds.some((runId) => {
		const member = params.runsById.get(runId);
		return member?.requesterSessionKey === requesterSessionKey && (!member.requesterAgentId || member.requesterAgentId === requesterAgentId) && member.requesterSettleWake !== void 0 && member.requesterSettleWake.rearmGeneration === wake.rearmGeneration && member.completionTarget === "parent";
	});
	return params.runId === buildRequesterSettleWakeIdentity({
		requesterSessionKey,
		requesterAgentId,
		batchRunIds,
		rearmGeneration: wake.rearmGeneration,
		attemptIndex: wake.attemptCount - 1,
		sharedAttemptKey,
		pause: Boolean(pauseNotice)
	}).runId;
}
/** Run, requester, and frozen delivery-policy bindings, distinct from wake progress. */
function captureRequesterSettleRunIdentity(entry) {
	return {
		runId: entry.runId,
		createdAt: entry.createdAt,
		generation: entry.generation,
		taskRunId: entry.taskRunId,
		childSessionKey: entry.childSessionKey,
		childAgentId: entry.childAgentId,
		completionTarget: entry.completionTarget,
		requesterSessionKey: entry.requesterSessionKey,
		requesterAgentId: entry.requesterAgentId,
		requesterStorePath: entry.requesterStorePath,
		controllerSessionKey: entry.controllerSessionKey,
		controllerStorePath: entry.controllerStorePath,
		requesterTurnRunId: entry.requesterTurnRunId,
		completionRequesterSessionId: entry.completionRequesterSessionId,
		completionRequesterLifecycleRevision: entry.completionRequesterLifecycleRevision
	};
}
/** Wake decisions retain their observed progress; retirement/presentation metadata is carried forward. */
function captureRequesterSettleWakeProgress(entry) {
	const wake = entry.requesterSettleWake;
	return wake && {
		status: wake.status,
		attemptCount: wake.attemptCount,
		replayCount: wake.replayCount ?? 0,
		deferralCount: wake.deferralCount ?? 0,
		nextAttemptAt: wake.nextAttemptAt,
		lastError: wake.lastError,
		batchRunIds: wake.batchRunIds?.toSorted(),
		rearmGeneration: wake.rearmGeneration,
		requesterYieldBatch: wake.requesterYieldBatch === true,
		afterRequesterYield: wake.afterRequesterYield === true,
		yieldedFinalDeliverable: wake.yieldedFinalDeliverable === true,
		pauseNotice: wake.pauseNotice
	};
}
/** A retained delivery callback cannot adopt another requester claim or frozen reply policy. */
function isRequesterSettleRunBindingCurrent(current, expected) {
	return isSameSubagentRunOwner(current, expected) && isDeepStrictEqual(captureRequesterSettleRunIdentity(current), captureRequesterSettleRunIdentity(expected)) && current.requesterSettleWake?.yieldedFinalDeliverable === true === (expected.requesterSettleWake?.yieldedFinalDeliverable === true);
}
/** Completion custody can outlive a requester that finished without explicitly yielding. */
function hasRequesterCompletionCohort(entry) {
	const wake = entry.requesterSettleWake;
	return wake?.requesterYieldBatch === true || wake?.rearmGeneration !== void 0 && wake.batchRunIds?.includes(entry.runId) === true;
}
/**
* A newer task cannot revoke another task's exact completion custody. A
* yield-paused run holds no result, only its continuation: a newer execution of
* its session without its own completion audience continues it, so the pause
* notice no longer owes a wake. A sibling that owes its own delivery is
* independent and leaves the paused task resumable.
*/
function isRequesterCompletionCohortCurrent(entry, latestForSession) {
	const taskRunId = entry.taskRunId ?? entry.runId;
	const paused = entry.pauseReason === "sessions_yield";
	const owner = latestForSession(entry.childSessionKey, (candidate) => (candidate.taskRunId ?? candidate.runId) === taskRunId || paused && candidate.expectsCompletionMessage !== true, entry.childAgentId);
	return entry.killReconciliation?.supersededAt === void 0 && (!owner || compareSubagentRunGeneration(owner, entry) <= 0);
}
const requesterRetirementCustody = (current) => ({
	requester: captureRequesterSettleRunIdentity(current),
	expectsCompletionMessage: current.expectsCompletionMessage === true,
	suppressCompletionDelivery: current.suppressCompletionDelivery === true,
	retireAfterRequesterTurn: current.retireAfterRequesterTurn === true,
	hasRequesterSettleWake: current.requesterSettleWake !== void 0,
	killIntent: current.killIntent && {
		requestedAt: current.killIntent.requestedAt,
		reason: current.killIntent.reason,
		lifecycleGeneration: current.killIntent.lifecycleGeneration,
		sessionId: current.killIntent.sessionId,
		sessionLifecycleRevision: current.killIntent.sessionLifecycleRevision,
		suppressTaskDelivery: current.killIntent.suppressTaskDelivery === true
	},
	killReconciliation: current.killReconciliation && {
		killedAt: current.killReconciliation.killedAt,
		supersededAt: current.killReconciliation.supersededAt,
		taskCancellationAccepted: current.killReconciliation.taskCancellationAccepted === true,
		suppressTaskDelivery: current.killReconciliation.suppressTaskDelivery === true
	},
	batchRunIds: current.requesterSettleWake?.batchRunIds?.toSorted(),
	rearmGeneration: current.requesterSettleWake?.rearmGeneration,
	requesterYieldBatch: current.requesterSettleWake?.requesterYieldBatch === true,
	yieldedFinalDeliverable: current.requesterSettleWake?.yieldedFinalDeliverable === true
});
/** Async retirement cannot consume a newly rebound requester or cancellation obligation. */
function isRequesterRetirementCustodyCurrent(current, expected) {
	return isDeepStrictEqual(requesterRetirementCustody(current), requesterRetirementCustody(expected));
}
/** Runtime cohort custody survives only its own immutable row publications. */
function sameRequesterSettleBatch(left, right) {
	return left.length === right.length && left.every((entry) => right.some((candidate) => isSameSubagentRunOwner(candidate, entry)));
}
function resolveCurrentRequesterSettleBatch(observed, runs) {
	const batch = [];
	for (const entry of observed) {
		const current = runs.get(entry.runId);
		if (!current || !isSameSubagentRunOwner(current, entry)) return;
		batch.push(current);
	}
	return batch;
}
/** Retry preparation may refresh progress; retained delivery keeps its observed decision. */
function resolveCurrentRequesterSettleWakeBatch(params) {
	const batch = [];
	for (const observed of params.observed) {
		const entry = params.currentRuns.find((candidate) => isSameSubagentRunOwner(candidate, observed));
		const wake = entry?.requesterSettleWake;
		if (!entry || entry.expectsCompletionMessage === true && entry.requesterTurnRunId || !isRequesterSettleRunBindingCurrent(entry, observed) || !wake || wake.rearmGeneration !== params.rearmGeneration || (params.pause ? entry.pauseReason !== "sessions_yield" || !wake.pauseNotice : entry.pauseReason === "sessions_yield") || params.requireUnchangedProgress && !isDeepStrictEqual(captureRequesterSettleWakeProgress(entry), captureRequesterSettleWakeProgress(observed))) return;
		batch.push(entry);
	}
	return batch;
}
/** A yielded cohort owns exactly one rearm generation and its recorded membership. */
function isRequesterYieldCohortMember(entry, batchRunIds, rearmGeneration) {
	const wake = entry.requesterSettleWake;
	return wake?.requesterYieldBatch === true && wake.rearmGeneration === rearmGeneration && wake.batchRunIds?.length === batchRunIds.length && wake.batchRunIds.every((runId, index) => runId === batchRunIds[index]);
}
//#endregion
export { isRequesterCompletionCohortCurrent as a, isRequesterYieldCohortMember as c, sameRequesterSettleBatch as d, buildAnnounceIdFromChildRun as f, hasRequesterCompletionCohort as i, resolveCurrentRequesterSettleBatch as l, captureRequesterSettleRunIdentity as n, isRequesterRetirementCustodyCurrent as o, buildAnnounceIdempotencyKey as p, captureRequesterSettleWakeProgress as r, isRequesterSettleWakeForRun as s, buildRequesterSettleWakeIdentity as t, resolveCurrentRequesterSettleWakeBatch as u };
