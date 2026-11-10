import { ct as resolveAdmittedCronCompletionStatus } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { a as normalizeCronRunDiagnostics, o as summarizeCronRunDiagnostics } from "./run-diagnostics-DHdTDo8H.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import { y as cronSchedulingInputsEqual } from "./row-codec-Cnnqjh5r.mjs";
import { n as resolvePacedNextRunAtMs } from "./pacing-DhLKxAJH.mjs";
import { t as computeNextRunAtMs } from "./schedule-BBT1kAm1.mjs";
import { C as autoDisableCronJob, a as errorBackoffMs, g as recordScheduleComputeError, l as isJobEnabled, r as computeJobNextRunAtMs, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, w as maybeAutoDisableCronJobAfterRunFailure, x as resolveNextRunAtMsOrDisable } from "./jobs-scheduling-sefIqbJ3.mjs";
import { a as resolveManualOneShotOccurrenceAtMs, r as isCronOneShotContinuationJob } from "./one-shot-schedule-DiK2ivJ0.mjs";
import { c as resolveDisabledHeartbeatOneShotRetryDecision, l as resolveTransientCronRetryDecision, m as MIN_REFIRE_GAP_MS, n as applyTriggerRunResult, o as resolveCronNextRunWithLowerBound, r as holdsFailureNotificationForRetry, s as resolveDeliveryState, t as applyTriggerEvaluationState, u as shouldRetryDisabledHeartbeatOneShot } from "./timer-trigger-DkbJC_Jg.mjs";
import { i as resolveFailureIncident, n as finalizeCronFailureNotifications, r as resolveFailureAlert } from "./failure-alerts-Cgi3Ds94.mjs";
import { t as resolveCronRunErrorReason } from "./run-error-reason-D_A9m8Ck.mjs";
//#region src/cron/service/timer-outcomes.ts
/** Checks both the admitted schedule and edits that may have returned to its original value. */
function resolveCronRunScheduleOwnership(params) {
	return typeof params.currentJob.state.runningScheduleChangeId === "string" || params.activeJobMarker?.scheduleMutated === true || !cronSchedulingInputsEqual(params.admittedJob, params.currentJob) ? "stale" : "current";
}
/** Keeps trigger state owned by the exact script/once definition that evaluated it. */
function resolveCronRunTriggerOwnership(params) {
	return params.activeJobMarker?.triggerMutated === true || params.admittedJob.trigger?.script !== params.currentJob.trigger?.script || params.admittedJob.trigger?.once !== params.currentJob.trigger?.once ? "stale" : "current";
}
function assignNextRunAtMs(params) {
	const nextRunAtMs = resolveNextRunAtMsOrDisable(params);
	params.job.state.nextRunAtMs = nextRunAtMs;
	return nextRunAtMs;
}
/** Applies run outcome state, delivery state, backoff/next-run scheduling, and delete-after-run policy. */
function applyJobResult(state, job, result, opts) {
	const scheduleNextRun = (candidate) => assignNextRunAtMs({
		state,
		job,
		candidate,
		deferredNotifications: opts.deferredNotifications
	});
	const previousScheduleState = {
		enabled: job.enabled,
		nextRunAtMs: job.state.nextRunAtMs,
		pacedNextRunAtMs: job.state.pacedNextRunAtMs,
		forcePreservedNextRunAtMs: job.state.forcePreservedNextRunAtMs
	};
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	job.state.lastRunAtMs = result.startedAt;
	job.state.lastRunStatus = result.status;
	job.state.lastStatus = result.status;
	job.state.lastDurationMs = Math.max(0, result.endedAt - result.startedAt);
	job.state.lastError = result.error;
	job.state.lastDiagnostics = normalizeCronRunDiagnostics(result.diagnostics);
	job.state.lastDiagnosticSummary = summarizeCronRunDiagnostics(job.state.lastDiagnostics);
	job.state.lastErrorReason = result.status === "error" && typeof result.error === "string" ? resolveCronRunErrorReason(result.error, result.provider, result.errorClassification) : void 0;
	if (result.status === "error") state.deps.log.warn({
		jobId: job.id,
		jobName: job.name,
		error: result.error,
		diagnosticsSummary: job.state.lastDiagnosticSummary
	}, "cron: job run returned error status");
	const deliveryState = result.deliveryState ?? resolveDeliveryState({
		job,
		runStatus: result.status,
		delivery: result.delivery,
		delivered: result.delivered,
		deliveryAttempted: result.deliveryAttempted,
		error: result.deliveryError ?? result.error,
		deliverySuppressionReason: result.deliverySuppressionReason
	});
	job.state.lastDelivered = deliveryState.delivered;
	job.state.lastDeliveryStatus = deliveryState.status;
	job.state.deliverySuppressionReason = deliveryState.deliverySuppressionReason;
	job.state.lastDeliveryError = deliveryState.error;
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = "not-requested";
	job.state.lastFailureNotificationDeliveryError = void 0;
	job.updatedAtMs = result.endedAt;
	const completionStatus = result.completionStatus ?? resolveAdmittedCronCompletionStatus(job, result.status, deliveryState.status, deliveryState.deliverySuppressionReason);
	const previousConsecutiveErrors = job.state.consecutiveErrors ?? 0;
	const computeNaturalNext = (restartInterval) => {
		try {
			return restartInterval && job.schedule.kind === "every" ? computeNextRunAtMs(job.schedule, result.endedAt) : computeJobNextRunAtMs(job, result.endedAt);
		} catch (err) {
			recordScheduleComputeError({
				state,
				job,
				err,
				deferredNotifications: opts.deferredNotifications
			});
			return;
		}
	};
	const alertConfig = resolveFailureAlert(state, job);
	if (result.status === "error") {
		job.state.consecutiveErrors = (job.state.consecutiveErrors ?? 0) + 1;
		job.state.consecutiveSkipped = 0;
	} else if (result.status === "skipped") {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = (job.state.consecutiveSkipped ?? 0) + 1;
	} else {
		job.state.consecutiveErrors = 0;
		job.state.consecutiveSkipped = 0;
		if (completionStatus === "succeeded") job.state.lastFailureAlertAtMs = void 0;
	}
	const scheduleOwnershipAtMs = opts.scheduleOwnershipAtMs ?? result.startedAt;
	const oneShotOccurrenceAtMs = resolveManualOneShotOccurrenceAtMs(job, scheduleOwnershipAtMs);
	const preserveOneShotSchedule = opts.scheduleMode === "preserve" && oneShotOccurrenceAtMs !== void 0;
	const ownsSchedule = opts.scheduleOwnership !== "stale";
	const isOneShotSchedule = job.schedule.kind === "at" || job.schedule.kind === "on-exit";
	const oneShotNextCheck = ownsSchedule && !preserveOneShotSchedule && !opts.replaySchedule && isJobEnabled(job) && isCronOneShotContinuationJob(job) && result.status === "ok" ? result.nextCheck : void 0;
	const shouldDelete = ownsSchedule && isOneShotSchedule && !preserveOneShotSchedule && !oneShotNextCheck && job.deleteAfterRun === true && completionStatus === "succeeded";
	let autoDisableNotificationOwnsFailure = false;
	let terminalOneShot = false;
	let pendingTransientRetry = false;
	const applyReplaySchedule = () => {
		const nextRunAtMs = job.state.autoDisabled ? void 0 : opts.replaySchedule?.nextRunAtMs;
		job.state.nextRunAtMs = nextRunAtMs === void 0 ? void 0 : scheduleNextRun(nextRunAtMs);
	};
	const finish = () => {
		if (opts.replaySchedule && job.schedule.kind !== "at") applyReplaySchedule();
		if (shouldDelete || job.schedule.kind === "event") job.state.nextRunAtMs = void 0;
		const failureNotification = finalizeCronFailureNotifications(state, {
			job,
			alertConfig,
			result,
			completionStatus,
			autoDisableNotificationOwnsFailure,
			terminalOneShot,
			pendingTransientRetry,
			replay: opts.replay,
			deferredNotifications: opts.deferredNotifications
		});
		if (terminalOneShot) autoDisableCronJob({
			job,
			reason: "consecutive-failures",
			atMs: result.endedAt,
			consecutiveErrors: job.state.consecutiveErrors ?? 0,
			terminalOneShot: true,
			notify: failureNotification === "unavailable" && !opts.replay,
			deferredNotifications: opts.deferredNotifications
		});
		return shouldDelete;
	};
	if (!ownsSchedule) {
		job.enabled = previousScheduleState.enabled;
		job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
		job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = previousScheduleState.forcePreservedNextRunAtMs;
	} else if (!shouldDelete) {
		if (job.schedule.kind === "event") job.state.nextRunAtMs = void 0;
		else if (preserveOneShotSchedule) {
			job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
			job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
			job.state.forcePreservedNextRunAtMs = oneShotOccurrenceAtMs;
		} else if (opts.replaySchedule && job.schedule.kind === "at") {
			applyReplaySchedule();
			job.enabled = job.state.nextRunAtMs !== void 0;
		} else if (oneShotNextCheck) job.state.pacedNextRunAtMs = scheduleNextRun(result.endedAt + Math.max(MIN_REFIRE_GAP_MS, oneShotNextCheck.delayMs));
		else if (job.schedule.kind === "at" && isJobEnabled(job)) {
			if (shouldRetryDisabledHeartbeatOneShot(job, result)) {
				const retryDecision = resolveDisabledHeartbeatOneShotRetryDecision({ consecutiveSkipped: job.state.consecutiveSkipped });
				if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
					if (scheduleNextRun(result.endedAt + retryDecision.backoffMs) !== void 0) state.deps.log.info({
						jobId: job.id,
						jobName: job.name,
						consecutiveSkipped: retryDecision.consecutiveSkipped,
						backoffMs: retryDecision.backoffMs,
						nextRunAtMs: job.state.nextRunAtMs
					}, "cron: scheduling one-shot retry after disabled heartbeat");
				} else {
					job.enabled = false;
					job.state.nextRunAtMs = void 0;
					state.deps.log.warn({
						jobId: job.id,
						jobName: job.name,
						consecutiveSkipped: retryDecision.consecutiveSkipped,
						reason: retryDecision.reason
					}, "cron: disabling one-shot job after disabled heartbeat retries");
				}
			} else if (result.status === "ok" || result.status === "skipped") {
				job.enabled = false;
				job.state.nextRunAtMs = void 0;
			} else if (result.status === "error") {
				const retryDecision = resolveTransientCronRetryDecision({
					error: result.error,
					errorClassification: result.errorClassification,
					lastErrorReason: job.state.lastErrorReason,
					executionStarted: result.executionStarted,
					consecutiveErrors: job.state.consecutiveErrors
				});
				if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
					if (scheduleNextRun(result.endedAt + retryDecision.backoffMs) !== void 0) {
						pendingTransientRetry = holdsFailureNotificationForRetry(job, result, retryDecision.retryCategory);
						state.deps.log.info({
							jobId: job.id,
							jobName: job.name,
							consecutiveErrors: retryDecision.consecutiveErrors,
							backoffMs: retryDecision.backoffMs,
							nextRunAtMs: job.state.nextRunAtMs,
							retryCategory: retryDecision.retryCategory
						}, "cron: scheduling one-shot retry after transient error");
					}
				} else {
					job.enabled = false;
					job.state.nextRunAtMs = void 0;
					terminalOneShot = retryDecision.reason !== "aborted";
					state.deps.log.warn({
						jobId: job.id,
						jobName: job.name,
						consecutiveErrors: retryDecision.consecutiveErrors,
						error: result.error,
						reason: retryDecision.reason,
						retryCategory: retryDecision.retryCategory
					}, "cron: disabling one-shot job after error");
				}
			}
		} else if (job.schedule.kind === "on-exit" && opts.onExitWatcherCompletion && result.status === "error") {
			job.enabled = false;
			job.state.nextRunAtMs = void 0;
			terminalOneShot = result.errorClassification?.kind !== "aborted";
		} else if (opts.scheduleMode === "preserve") {
			job.state.nextRunAtMs = previousScheduleState.nextRunAtMs;
			job.state.pacedNextRunAtMs = previousScheduleState.pacedNextRunAtMs;
			job.state.forcePreservedNextRunAtMs = previousScheduleState.nextRunAtMs;
		} else if (result.status === "error" && isJobEnabled(job) && maybeAutoDisableCronJobAfterRunFailure({
			job,
			atMs: result.endedAt,
			deferredNotifications: opts.deferredNotifications
		})) {
			autoDisableNotificationOwnsFailure = true;
			state.deps.log.error({
				jobId: job.id,
				name: job.name,
				consecutiveErrors: job.state.consecutiveErrors,
				error: result.error
			}, "cron: auto-disabled job after consecutive run failures");
		} else if (result.status === "error" && isJobEnabled(job)) {
			const retryDecision = resolveTransientCronRetryDecision({
				error: result.error,
				errorClassification: result.errorClassification,
				lastErrorReason: job.state.lastErrorReason,
				executionStarted: result.executionStarted,
				consecutiveErrors: job.state.consecutiveErrors
			});
			const holdsForRetry = retryDecision.retryable && retryDecision.backoffMs !== void 0 && holdsFailureNotificationForRetry(job, result, retryDecision.retryCategory);
			let normalNext;
			let normalNextComputed = false;
			const computeNormalNext = () => {
				if (!normalNextComputed) {
					normalNext = computeNaturalNext(retryDecision.retryable || previousConsecutiveErrors > 0);
					normalNextComputed = true;
				}
				return normalNext;
			};
			if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
				normalNext = computeNormalNext();
				if (normalNext === void 0) {} else {
					const retryNextRunAtMs = scheduleNextRun(result.endedAt + retryDecision.backoffMs);
					if (retryNextRunAtMs === void 0) return finish();
					if (retryNextRunAtMs < normalNext) {
						pendingTransientRetry = holdsForRetry;
						state.deps.log.info({
							jobId: job.id,
							jobName: job.name,
							consecutiveErrors: retryDecision.consecutiveErrors,
							backoffMs: retryDecision.backoffMs,
							nextRunAtMs: job.state.nextRunAtMs,
							normalNextRunAtMs: normalNext,
							retryCategory: retryDecision.retryCategory
						}, "cron: scheduling recurring retry after transient error");
						return finish();
					}
				}
			}
			const backoff = errorBackoffMs(job.state.consecutiveErrors ?? 1, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			normalNext = computeNormalNext();
			if (normalNext === void 0 && job.schedule.kind === "every") {
				scheduleNextRun(void 0);
				return finish();
			}
			const backoffNext = scheduleNextRun(result.endedAt + backoff);
			if (backoffNext === void 0) return finish();
			job.state.nextRunAtMs = job.schedule.kind === "cron" ? resolveCronNextRunWithLowerBound({
				state,
				job,
				naturalNext: normalNext,
				lowerBoundMs: backoffNext,
				deferredNotifications: opts.deferredNotifications
			}) : normalNext !== void 0 ? Math.max(normalNext, backoffNext) : backoffNext;
			pendingTransientRetry = holdsForRetry && job.state.nextRunAtMs !== void 0;
			state.deps.log.info({
				jobId: job.id,
				consecutiveErrors: job.state.consecutiveErrors,
				backoffMs: backoff,
				nextRunAtMs: job.state.nextRunAtMs
			}, "cron: applying error backoff");
		} else if (isJobEnabled(job) && result.status === "ok" && job.pacing !== void 0 && result.nextCheck !== void 0) {
			const pacedNextRunAtMs = resolvePacedNextRunAtMs({
				nowMs: result.endedAt,
				delayMs: result.nextCheck.delayMs,
				pacing: job.pacing
			});
			const nextRunAtMs = scheduleNextRun(job.trigger ? Math.max(pacedNextRunAtMs ?? NaN, result.endedAt + Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs())) : pacedNextRunAtMs);
			job.state.pacedNextRunAtMs = nextRunAtMs;
		} else if (isJobEnabled(job)) {
			const naturalNext = computeNaturalNext(previousConsecutiveErrors > 0);
			if (job.schedule.kind === "cron") {
				const minNext = result.endedAt + Math.max(MIN_REFIRE_GAP_MS, job.trigger ? resolveCronTriggerMinIntervalMs() : 0);
				job.state.nextRunAtMs = resolveCronNextRunWithLowerBound({
					state,
					job,
					naturalNext,
					lowerBoundMs: minNext,
					deferredNotifications: opts.deferredNotifications
				});
			} else {
				const triggerNext = naturalNext !== void 0 && job.trigger ? Math.max(naturalNext, result.endedAt + resolveCronTriggerMinIntervalMs()) : naturalNext;
				job.state.nextRunAtMs = triggerNext;
				if (triggerNext !== void 0 || job.schedule.kind === "every") scheduleNextRun(triggerNext);
			}
		} else job.state.nextRunAtMs = void 0;
	}
	return finish();
}
/** Commits payload-script state only after the complete cron run succeeds. */
function applyScriptRunResult(job, result, opts) {
	if (opts?.triggerOwnership !== "stale" && result.status === "ok" && result.scriptStateChanged === true) job.state.triggerState = result.scriptState;
}
/** Applies a quiet trigger tick without mutating normal run-history state. */
function applyTriggerNoFireResult(state, job, result, opts) {
	const previousNextRunAtMs = job.state.nextRunAtMs;
	const previousPacedNextRunAtMs = job.state.pacedNextRunAtMs;
	const previousForcePreservedNextRunAtMs = job.state.forcePreservedNextRunAtMs;
	job.state.queuedAtMs = void 0;
	job.state.runningAtMs = void 0;
	job.state.runningReceiptId = void 0;
	delete job.state.runningScheduleChangeId;
	job.updatedAtMs = result.endedAt;
	if (!result.triggerEval.busy && opts.triggerOwnership !== "stale") {
		job.state.consecutiveErrors = 0;
		job.state.scheduleErrorCount = 0;
		applyTriggerEvaluationState(job, result.triggerEval, result.endedAt);
		resolveFailureIncident(job, { triggerOnly: true });
	}
	if (opts.scheduleMode === "immediate-preserve" || opts.scheduleMode === "stale-preserve") {
		job.state.nextRunAtMs = previousNextRunAtMs;
		job.state.pacedNextRunAtMs = previousPacedNextRunAtMs;
		job.state.forcePreservedNextRunAtMs = opts.scheduleMode === "immediate-preserve" ? previousNextRunAtMs : previousForcePreservedNextRunAtMs;
		return;
	}
	job.state.pacedNextRunAtMs = void 0;
	job.state.forcePreservedNextRunAtMs = void 0;
	try {
		const naturalNext = computeJobNextRunAtMs(job, result.endedAt);
		const floorMs = Math.max(MIN_REFIRE_GAP_MS, resolveCronTriggerMinIntervalMs());
		job.state.nextRunAtMs = naturalNext;
		if (naturalNext !== void 0 || job.schedule.kind === "every") assignNextRunAtMs({
			state,
			job,
			candidate: naturalNext === void 0 ? void 0 : Math.max(naturalNext, result.endedAt + floorMs),
			deferredNotifications: opts.deferredNotifications
		});
	} catch (err) {
		recordScheduleComputeError({
			state,
			job,
			err,
			deferredNotifications: opts.deferredNotifications
		});
	}
}
/** Applies one outcome to a row already re-read under the runtime write transaction. */
function applyOutcomeToAuthoritativeJob(state, job, result, opts) {
	const scheduleOwnership = resolveCronRunScheduleOwnership({
		admittedJob: result.job,
		currentJob: job,
		activeJobMarker: result.activeJobMarker
	});
	const triggerOwnership = opts.triggerStateRetired ? "stale" : resolveCronRunTriggerOwnership({
		admittedJob: result.job,
		currentJob: job,
		activeJobMarker: result.activeJobMarker
	});
	if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) {
		applyTriggerNoFireResult(state, job, {
			startedAt: result.startedAt,
			endedAt: result.endedAt,
			triggerEval: result.triggerEval
		}, {
			scheduleMode: scheduleOwnership === "stale" ? "stale-preserve" : opts.request?.preserveCadence ? "immediate-preserve" : "advance",
			triggerOwnership,
			deferredNotifications: opts.deferredNotifications
		});
		if (!opts.request) job.state.startupCatchupAtMs = void 0;
		if (!opts.request && scheduleOwnership === "current") job.state.pacedNextRunAtMs = void 0;
		return false;
	}
	const shouldDelete = applyJobResult(state, job, result, {
		scheduleMode: opts.request?.preserveCadence && scheduleOwnership === "current" ? "preserve" : "advance",
		scheduleOwnership,
		scheduleOwnershipAtMs: opts.request?.scheduleOwnershipAtMs,
		onExitWatcherCompletion: opts.request?.onExitWatcherCompletion,
		deferredNotifications: opts.deferredNotifications
	});
	applyTriggerRunResult(job, result, {
		scheduleOwnership,
		triggerOwnership
	});
	applyScriptRunResult(job, result, { triggerOwnership });
	if (opts.request) {
		if (job.schedule.kind === "stream") job.state.nextRunAtMs = void 0;
	} else job.state.startupCatchupAtMs = void 0;
	return shouldDelete;
}
//#endregion
export { applyTriggerNoFireResult as i, applyOutcomeToAuthoritativeJob as n, applyScriptRunResult as r, applyJobResult as t };
