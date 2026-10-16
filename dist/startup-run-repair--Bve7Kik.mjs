import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { at as resolveCronCompletionStatus } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BEO0zOri.mjs";
import { f as isCronActiveJobMarkerCurrent, g as markCronJobActive, m as isCronSelfRemovalCurrent, v as noteActiveCronJobMessageActionAuthorityMutation, x as noteActiveCronJobScheduleMutation, y as noteActiveCronJobMessageSourceAuthorityMutation } from "./active-jobs-BS2UT6i2.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { o as assertCronRunReceiptCurrentFacts, r as CronRunReceiptRevisionError, w as trackCronRunReceiptSettlement, x as readCronRunReceiptCurrentJob, y as prepareCronRunReceiptAdjudication } from "./run-receipt-store-BI8RC7qi.mjs";
import { O as maybeAutoDisableCronJobAfterRunFailure, l as isJobEnabled } from "./jobs-scheduling-CBskypsm.mjs";
import { a as applyTriggerNoFireResult, b as runsDetachedFromMainSession, d as applyTriggerRunResult, i as applyScriptRunResult, t as applyJobResult } from "./timer-outcomes-BqDgA2oM.mjs";
import { i as resolveFailureAlert, n as finalizeCronFailureNotifications } from "./failure-alerts-DGUv78dt.mjs";
import { c as resolveCronJobMessageToolAuthorityInputs, s as resolveCronJobMessageActionAuthorityInputs } from "./jobs-tool-policy-8ixPr7vE.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/service/run-receipts.ts
function resolveCronRunReceiptAgentId(state, job) {
	return resolveCronJobEffectiveAgentId(job, state.deps.resolveDefaultAgentId ? state.deps.resolveDefaultAgentId() : state.deps.defaultAgentId);
}
/** Only receipt facts cross the reader boundary; liveness and claims stay with their owners. */
async function observeServiceCronRunReceipts(state, jobIds) {
	const context = captureOpenClawStateReadWorkerContext();
	const storeKey = cronStoreKey(state.deps.storePath);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		if (resolveOpenClawStateSqlitePath() !== context.admission.databasePath || cronStoreKey(state.deps.storePath) !== storeKey) throw new Error("Cron receipt source changed during observation");
	};
	const command = {
		type: "cron.observeRunRecovery",
		storeKey,
		proposals: jobIds.map((jobId) => ({ jobId }))
	};
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, command, {
		context,
		current: true
	});
	assertCurrent();
	if (result && (!result.ok || result.type !== command.type)) throw new Error("Cron receipt observation did not return its admitted snapshot");
	const receipts = /* @__PURE__ */ new Map();
	if (result?.ok && result.type === command.type && result.observation.kind === "observed") {
		for (const proposal of result.observation.proposals) if (proposal.receipt) receipts.set(proposal.jobId, proposal.receipt);
	}
	return {
		receipts,
		assertCurrent
	};
}
/** Both admission paths bind message permissions from the same canonical occurrence. */
function markServiceCronJobActive(state, job, runReceipt) {
	return markCronJobActive(job.id, {
		agentId: runReceipt.agentId,
		stateIdentityKey: captureOpenClawStateWorkerContext().admission.identity.key,
		declarationKey: job.declarationKey,
		preserveAcrossGenerationAdvance: !runsDetachedFromMainSession(job),
		isMessageActionAuthorityCurrent: createServiceCronRunMessageAuthorityChecker({
			state,
			job,
			handle: runReceipt,
			resolveInputs: resolveCronJobMessageToolAuthorityInputs
		}),
		isMessageSourceAuthorityCurrent: createServiceCronRunMessageAuthorityChecker({
			state,
			job,
			handle: runReceipt,
			resolveInputs: resolveCronJobMessageActionAuthorityInputs
		})
	});
}
/** Retains admission's permission facts while consulting the existing canonical receipt owner. */
function createServiceCronRunMessageAuthorityChecker(params) {
	const expected = params.resolveInputs(params.job);
	if (!expected) return;
	const { state, handle } = params;
	const admittedEnabled = isJobEnabled(params.job);
	return () => {
		let current;
		try {
			current = readCronRunReceiptCurrentJob({
				handle,
				resolveAgentId: (job) => resolveCronRunReceiptAgentId(state, job),
				isAgentAvailable: state.deps.isAgentAvailable
			});
		} catch (error) {
			if (error instanceof CronRunReceiptRevisionError) return false;
			throw error;
		}
		return current !== void 0 && (!admittedEnabled || isJobEnabled(current)) && isDeepStrictEqual(expected, params.resolveInputs(current));
	};
}
function prepareCronRunReceiptOwnerMutation(params) {
	const { state, previousJob, nextJob } = params;
	const previousAgentId = resolveCronRunReceiptAgentId(state, previousJob);
	const nextAgentId = resolveCronRunReceiptAgentId(state, nextJob);
	if (previousAgentId === nextAgentId) return;
	const generation = state.lifecycleGeneration;
	return observeServiceCronRunReceipts(state, [nextJob.id]).then((observation) => {
		const assertCurrent = () => {
			observation.assertCurrent();
			if (state.lifecycleGeneration !== generation || resolveCronRunReceiptAgentId(state, previousJob) !== previousAgentId || resolveCronRunReceiptAgentId(state, nextJob) !== nextAgentId) throw new Error("Cron service or owner changed during receipt observation");
		};
		assertCurrent();
		return {
			prepared: prepareCronRunReceiptAdjudication({
				storePath: state.deps.storePath,
				observed: observation.receipts.get(nextJob.id),
				nowMs: state.deps.nowMs()
			}),
			assertCurrent
		};
	});
}
function publishCronRunReceiptMutation(params) {
	if (params.messageActionAuthorityChanged) noteActiveCronJobMessageActionAuthorityMutation(params.jobId);
	if (params.messageSourceAuthorityChanged) noteActiveCronJobMessageSourceAuthorityMutation(params.jobId);
	if (params.scheduleChanged) noteActiveCronJobScheduleMutation(params.jobId);
}
async function assertServiceCronRunReceiptCurrent(state, originalHandle, activeJobMarker, context, signal) {
	const handle = { ...originalHandle };
	const isAgentAvailable = state.deps.isAgentAvailable;
	const allowMissingJob = () => activeJobMarker?.jobId === handle.jobId && isCronSelfRemovalCurrent(activeJobMarker);
	const command = {
		type: "cron.currentReceipt",
		handle,
		includeJob: !allowMissingJob(),
		includeAvailability: isAgentAvailable !== void 0
	};
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, command, {
		context,
		current: true,
		signal
	});
	context.admission.assertCurrent();
	signal?.throwIfAborted();
	if (activeJobMarker?.cancellation?.kind === "requested") throw new CronRunReceiptRevisionError(handle.receiptId, activeJobMarker.cancellation.reason);
	if (!isCronActiveJobMarkerCurrent(activeJobMarker)) throw new CronRunReceiptRevisionError(handle.receiptId, "cron run fence is no longer current");
	if (result && (!result.ok || result.type !== command.type)) throw new Error("Cron current receipt read did not return its admitted snapshot");
	assertCronRunReceiptCurrentFacts({
		handle,
		facts: result?.ok && result.type === command.type ? result.facts : void 0,
		resolveAgentId: (job) => resolveCronRunReceiptAgentId(state, job),
		isAgentAvailable,
		allowMissingJob: allowMissingJob(),
		env: context.environment
	});
}
function resolveCronRunReceiptTerminalStatus(status, triggerFired) {
	if (status === "ok") return triggerFired === false ? "skipped" : "ok";
	return status === "skipped" ? "skipped" : "error";
}
function logReceiptFinishError(state, handle, error) {
	state.deps.log.warn({
		jobId: handle.jobId,
		err: String(error)
	}, "cron: failed to finalize run receipt after execution settlement");
}
function trackServiceCronRunReceiptSettlement(params) {
	trackCronRunReceiptSettlement({
		handle: params.handle,
		settlement: params.settlement,
		onFinishError: (error) => logReceiptFinishError(params.state, params.handle, error)
	});
}
//#endregion
//#region src/cron/service/startup-run-repair.ts
/** Repairs interrupted and finalized cron runs while the service starts. */
const STARTUP_INTERRUPTED_ERROR = "cron: job interrupted by gateway restart";
function resolveOneShotReplacementAtMs(job, runningAtMs) {
	if (job.schedule.kind !== "at" || !job.enabled) return;
	const nextRunAtMs = job.state.nextRunAtMs;
	if (typeof nextRunAtMs !== "number" || nextRunAtMs <= runningAtMs) return;
	return parseAbsoluteTimeMs(job.schedule.at) === nextRunAtMs ? nextRunAtMs : void 0;
}
function markInterruptedStartupRun(params) {
	const { job, runningAtMs, nowMs } = params;
	const replacementAtMs = resolveOneShotReplacementAtMs(job, runningAtMs);
	const previousErrors = typeof job.state.consecutiveErrors === "number" && Number.isFinite(job.state.consecutiveErrors) ? Math.max(0, Math.floor(job.state.consecutiveErrors)) : 0;
	params.state.deps.log.warn({
		jobId: job.id,
		runningAtMs
	}, "cron: marking interrupted running job failed on startup");
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.state.lastRunAtMs = runningAtMs;
	job.state.lastRunStatus = "error";
	job.state.lastStatus = "error";
	job.state.lastError = STARTUP_INTERRUPTED_ERROR;
	job.state.lastErrorReason = void 0;
	job.state.lastDurationMs = Math.max(0, nowMs - runningAtMs);
	job.state.consecutiveErrors = previousErrors + 1;
	job.state.lastDelivered = false;
	job.state.lastDeliveryStatus = "unknown";
	job.state.lastDeliveryError = STARTUP_INTERRUPTED_ERROR;
	job.state.deliverySuppressionReason = void 0;
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = "not-requested";
	job.state.lastFailureNotificationDeliveryError = void 0;
	job.state.nextRunAtMs = replacementAtMs;
	job.state.startupCatchupAtMs = void 0;
	job.updatedAtMs = nowMs;
	const alertConfig = resolveFailureAlert(params.state, job);
	const autoDisableNotificationOwnsFailure = maybeAutoDisableCronJobAfterRunFailure({
		job,
		atMs: nowMs,
		deferredNotifications: params.deferredNotifications
	});
	if (autoDisableNotificationOwnsFailure) params.state.deps.log.error({
		jobId: job.id,
		name: job.name,
		consecutiveErrors: job.state.consecutiveErrors
	}, "cron: auto-disabled interrupted job after consecutive run failures");
	if (job.schedule.kind === "at" && replacementAtMs === void 0 && !params.recoverInterruptedOneShot) job.enabled = false;
	finalizeCronFailureNotifications(params.state, {
		job,
		alertConfig,
		result: {
			status: "error",
			error: STARTUP_INTERRUPTED_ERROR,
			startedAt: runningAtMs
		},
		completionStatus: "failed",
		autoDisableNotificationOwnsFailure,
		deferredNotifications: params.deferredNotifications
	});
	return {
		jobId: job.id,
		...params.taskRunId ? { taskRunId: params.taskRunId } : {},
		...replacementAtMs === void 0 ? {} : { replacementAtMs },
		runAtMs: runningAtMs,
		durationMs: job.state.lastDurationMs
	};
}
function restoreFinalizedStartupRun(params) {
	const { state, job, runningAtMs, entry } = params;
	const triggerOwnership = params.triggerStateRetired ? "stale" : "current";
	const startedAt = asDateTimestampMs(entry.runAtMs ?? runningAtMs);
	const endedAt = asDateTimestampMs(entry.ts);
	if (startedAt === void 0 || startedAt < 0 || endedAt === void 0 || endedAt < 0) {
		state.deps.log.warn({ jobId: job.id }, "cron: ignoring finalized startup run with an invalid timestamp envelope");
		return;
	}
	const replacementAtMs = resolveOneShotReplacementAtMs(job, startedAt);
	const persistedNextRunAtMs = asDateTimestampMs(job.state.nextRunAtMs);
	const scheduleOwnership = typeof job.state.runningScheduleChangeId === "string" || job.schedule.kind === "at" && (!job.enabled || persistedNextRunAtMs !== void 0 && persistedNextRunAtMs > startedAt) ? "stale" : "current";
	const retiredTriggerStoppedSchedule = params.triggerStateRetired && params.triggerEval?.fired === true && entry.status === "ok" && entry.nextRunAtMs === void 0;
	job.state.startupCatchupAtMs = void 0;
	if (params.triggerEval?.fired === false) {
		applyTriggerNoFireResult(state, job, {
			startedAt,
			endedAt,
			triggerEval: params.triggerEval
		}, {
			scheduleMode: scheduleOwnership === "stale" ? "stale-preserve" : "advance",
			triggerOwnership,
			replay: true,
			deferredNotifications: params.deferredNotifications
		});
		return {
			shouldDelete: false,
			...replacementAtMs === void 0 ? {} : { replacementAtMs }
		};
	}
	const completionStatus = entry.completionStatus ?? resolveCronCompletionStatus({
		status: entry.status,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus
	});
	const shouldDelete = applyJobResult(state, job, {
		...entry,
		completionStatus,
		deliveryState: {
			delivered: entry.delivered,
			status: entry.deliveryStatus ?? "unknown",
			error: entry.deliveryError,
			deliverySuppressionReason: entry.deliverySuppressionReason,
			failureNotification: entry.failureNotificationDelivery ?? { status: "not-requested" }
		},
		startedAt,
		endedAt
	}, {
		replay: true,
		scheduleOwnership,
		...scheduleOwnership === "current" && !retiredTriggerStoppedSchedule ? { replaySchedule: { nextRunAtMs: entry.nextRunAtMs } } : {},
		deferredNotifications: params.deferredNotifications
	});
	job.state.lastDurationMs = entry.durationMs ?? Math.max(0, endedAt - startedAt);
	job.state.lastErrorReason = entry.errorReason;
	if (entry.failureNotificationDelivery) {
		job.state.lastFailureNotificationDelivered = entry.failureNotificationDelivery.delivered;
		job.state.lastFailureNotificationDeliveryStatus = entry.failureNotificationDelivery.status;
		job.state.lastFailureNotificationDeliveryError = entry.failureNotificationDelivery.error;
		const lastAlert = job.state.lastFailureAlertAtMs;
		if (entry.failureNotificationDelivery.status !== "not-requested" && completionStatus !== "succeeded" && (lastAlert === void 0 || lastAlert < endedAt || lastAlert > state.deps.nowMs())) job.state.lastFailureAlertAtMs = endedAt;
	}
	if (params.triggerEval) applyTriggerRunResult(job, {
		status: entry.status,
		endedAt,
		triggerEval: params.triggerEval
	}, {
		scheduleOwnership,
		triggerOwnership
	});
	if (params.scriptResult) applyScriptRunResult(job, {
		status: entry.status,
		...params.scriptResult
	}, { triggerOwnership });
	state.deps.log.info({
		jobId: job.id,
		runningAtMs,
		status: entry.status
	}, "cron: restored finalized run history on startup");
	return {
		shouldDelete,
		...replacementAtMs === void 0 ? {} : { replacementAtMs }
	};
}
//#endregion
export { markServiceCronJobActive as a, resolveCronRunReceiptTerminalStatus as c, assertServiceCronRunReceiptCurrent as i, trackServiceCronRunReceiptSettlement as l, markInterruptedStartupRun as n, prepareCronRunReceiptOwnerMutation as o, restoreFinalizedStartupRun as r, publishCronRunReceiptMutation as s, STARTUP_INTERRUPTED_ERROR as t };
