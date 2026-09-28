import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DnjwnOju.mjs";
import { a as createCronStreamSourceIdentity, c as resolveCronStreamBatching } from "./normalize-_k1oAXPq.mjs";
import { n as normalizePayloadToSystemText } from "./normalize-tfeRpKhn.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { t as coerceFiniteScheduleNumber } from "./schedule-number-sXnjd9Sk.mjs";
import { n as resolveCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { f as isCronJobActive } from "./active-jobs-BdNx3YyC.mjs";
import { n as computePreviousRunAtMs, t as computeNextRunAtMs } from "./schedule-hP3FjCPW.mjs";
import "./run-receipt-store-DXbr_IpT.mjs";
import { i as isSystemMonitorDeclaration } from "./system-owned-declaration-CIFRO5mv.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import crypto from "node:crypto";
//#region src/cron/failure-notification-text.ts
const GENERIC_FAILURE_DETAIL = "Check automation history for details.";
const SCRIPT_FAILURE_COPY = {
	aborted: "was aborted",
	invalid_input: "received invalid input",
	runtime_unavailable: "runtime is unavailable",
	timeout: "timed out",
	output_limit_exceeded: "exceeded its output limit",
	snapshot_limit_exceeded: "exceeded its state limit",
	internal_error: "failed internally",
	tool_budget_exceeded: "exceeded its tool budget"
};
/** Renders only classified reasons or closed producer-authored failure facts. */
function cronFailureDetailLines(errorReason, failureNotificationDetail) {
	if (errorReason) return errorReason === "model_not_found" ? [
		`Cause: ${errorReason}`,
		"Run `openclaw doctor --fix` to repair provider-declared retired model references.",
		"Choose a supported model for this automation or remove its model override to use the agent default. If the agent default is unavailable, update it too."
	] : [`Cause: ${errorReason}`];
	if (!failureNotificationDetail) return [GENERIC_FAILURE_DETAIL];
	if (failureNotificationDetail.kind === "command-exit") return [`Cause: command exited with code ${failureNotificationDetail.exitCode}`];
	if (failureNotificationDetail.kind === "command-timeout") return [failureNotificationDetail.mode === "wall-clock" ? "Cause: command timed out" : "Cause: command stopped after producing no output"];
	const label = failureNotificationDetail.source === "payload" ? "automation script" : "trigger script";
	if (failureNotificationDetail.code === "plugin_reload_failed") return [
		"Cause: tools could not be refreshed after a plugin reload.",
		`The ${label} did not run. Automatic setup recovery failed.`,
		"Check automation history and plugin status, then retry the automation."
	];
	return [`Cause: ${label} ${SCRIPT_FAILURE_COPY[failureNotificationDetail.code]}`];
}
//#endregion
//#region src/cron/service/notification-intents.ts
function cronNotificationJob(job) {
	return {
		id: job.id,
		name: job.name,
		agentId: job.agentId,
		sessionTarget: job.sessionTarget,
		sessionKey: job.sessionKey,
		wakeMode: job.wakeMode,
		state: {
			lastRunAtMs: job.state.lastRunAtMs,
			lastFailureAlertAtMs: job.state.lastFailureAlertAtMs,
			lastFailureNotificationId: job.state.lastFailureNotificationId
		}
	};
}
//#endregion
//#region src/cron/service/auto-disable.ts
/** Shared state and owner-notification policy for cron auto-disable transitions. */
/**
* Run failures get more room than schedule errors (10 vs. 3) because provider
* and network errors are often transient, and restart-interrupted runs count too.
*/
const MAX_CONSECUTIVE_RUN_FAILURES = 10;
function autoDisableReasonLabel(reason) {
	return reason === "consecutive-failures" ? "run failures" : "schedule errors";
}
/** Records one canonical auto-disable fact and queues its owning-agent notification. */
function autoDisableCronJob(params) {
	const { job } = params;
	if (isSystemMonitorDeclaration(job.declarationKey)) return false;
	if (!job.enabled || job.state.autoDisabled) return false;
	job.enabled = false;
	job.state.nextRunAtMs = void 0;
	job.state.autoDisabled = {
		reason: params.reason,
		atMs: params.atMs,
		consecutiveErrors: params.consecutiveErrors
	};
	const name = truncateUtf16Safe((job.name || job.id).replace(/\s+/g, " ").trim(), 120);
	const errorReason = params.reason === "consecutive-failures" ? job.state.lastErrorReason : void 0;
	const text = [
		`⚠️ Automation "${name}" was auto-disabled after ${params.consecutiveErrors} consecutive ${autoDisableReasonLabel(params.reason)}.`,
		...cronFailureDetailLines(errorReason),
		`Fix the underlying cause, then run \`openclaw automations enable ${job.id}\` to re-enable it.`
	].join("\n");
	params.deferredNotifications.push({
		kind: "auto-disabled",
		job: cronNotificationJob(job),
		text
	});
	return true;
}
/** Auto-disables only time-based recurring jobs once their run-error streak reaches the limit. */
function maybeAutoDisableCronJobAfterRunFailure(params) {
	const consecutiveErrors = params.job.state.consecutiveErrors ?? 0;
	if (params.job.schedule.kind !== "cron" && params.job.schedule.kind !== "every" || consecutiveErrors < MAX_CONSECUTIVE_RUN_FAILURES) return false;
	return autoDisableCronJob({
		...params,
		reason: "consecutive-failures",
		consecutiveErrors
	});
}
//#endregion
//#region src/cron/service/one-shot-schedule.ts
/** Authored one-shot occurrence ownership across manual runs and scheduling. */
/** A manual run may retain the authored one-shot even while it has no runnable slot. */
function resolveForcePreservedOneShotAtMs(job) {
	const preserved = job.state.forcePreservedNextRunAtMs;
	return job.schedule.kind === "at" && asDateTimestampMs(preserved) !== void 0 && preserved === parseAbsoluteTimeMs(job.schedule.at) ? preserved : void 0;
}
/** Only future occurrences are borrowed; retry or pacing slots take precedence. */
function resolveManualOneShotOccurrenceAtMs(job, ownershipAtMs) {
	const occurrenceAtMs = job.schedule.kind === "at" ? job.state.nextRunAtMs ?? computeNextRunAtMs(job.schedule, ownershipAtMs) : void 0;
	return occurrenceAtMs !== void 0 && occurrenceAtMs > ownershipAtMs ? occurrenceAtMs : void 0;
}
/** Reservation owns this provenance before an enablement edit can make completion stale. */
function retainManualOneShotOccurrence(job, ownershipAtMs) {
	job.state.forcePreservedNextRunAtMs = resolveManualOneShotOccurrenceAtMs(job, ownershipAtMs) ?? job.state.forcePreservedNextRunAtMs;
}
/** Retained authored occurrences can recompute a missing runnable slot after enablement. */
function clearInvalidForcePreservedNextRun(job) {
	const preserved = job.state.forcePreservedNextRunAtMs;
	const retainsAuthoredOccurrence = job.state.nextRunAtMs === void 0 && resolveForcePreservedOneShotAtMs(job) !== void 0;
	if (preserved !== void 0 && !retainsAuthoredOccurrence && (asDateTimestampMs(preserved) === void 0 || preserved !== job.state.nextRunAtMs)) {
		job.state.forcePreservedNextRunAtMs = void 0;
		return true;
	}
	return false;
}
function computeOneShotNextRunAtMs(job, lastRunStatus) {
	const preserved = resolveForcePreservedOneShotAtMs(job);
	if (preserved !== void 0) return preserved;
	const atMs = job.schedule.kind === "at" ? parseAbsoluteTimeMs(job.schedule.at) : null;
	if (lastRunStatus === "ok" && job.state.lastRunAtMs) {
		if (atMs !== null && Number.isFinite(atMs) && atMs > job.state.lastRunAtMs) return atMs;
		return;
	}
	return atMs !== null && Number.isFinite(atMs) ? atMs : void 0;
}
//#endregion
//#region src/cron/service/trigger-interval.ts
function hasPendingCronTriggerInterval(job, nowMs) {
	const nextRunAtMs = asDateTimestampMs(job.state.nextRunAtMs);
	const lastActivityAtMs = Math.max(job.updatedAtMs, job.state.lastTriggerEvalAtMs ?? 0);
	return job.trigger !== void 0 && nextRunAtMs !== void 0 && nextRunAtMs > 0 && nowMs < nextRunAtMs && nextRunAtMs <= lastActivityAtMs + resolveCronTriggerMinIntervalMs();
}
//#endregion
//#region src/cron/service/jobs-scheduling.ts
/** Scheduling state and next-run computation for cron jobs. */
const staggerOffsetCache = /* @__PURE__ */ new Map();
const TIME_SCHEDULE_STATE_FIELDS = [
	"startupCatchupAtMs",
	"pacedNextRunAtMs",
	"forcePreservedNextRunAtMs",
	"nextRunAtMs"
];
function ownsCronRunMarker(ownership, jobId, markerAtMs, requireForce = false) {
	const reservation = ownership.reservations.get(jobId);
	return reservation?.markerAtMs === markerAtMs && (!requireForce || reservation.preserveWhenDisabled);
}
function normalizeStreamScheduleBounds(schedule) {
	if (schedule.kind !== "stream") return schedule;
	const resolved = resolveCronStreamBatching(schedule);
	return {
		...schedule,
		...schedule.batchMs !== void 0 ? { batchMs: resolved.batchMs } : {},
		...schedule.maxBatchBytes !== void 0 ? { maxBatchBytes: resolved.maxBatchBytes } : {}
	};
}
/** Default retry delays applied after consecutive cron execution errors. */
const DEFAULT_ERROR_BACKOFF_SCHEDULE_MS = [
	3e4,
	6e4,
	3e5,
	9e5,
	36e5
];
function isFiniteTimestamp(value) {
	return asDateTimestampMs(value) !== void 0;
}
/** Returns whether a stored next-run timestamp is finite and schedulable. */
function hasScheduledNextRunAtMs(value) {
	return isFiniteTimestamp(value) && value > 0;
}
/** Resolves the newest persisted cron run status while older state is still readable. */
function resolveJobLastRunStatus(job) {
	return job.state.lastRunStatus ?? job.state.lastStatus;
}
/** Resolves the retry backoff delay for a one-based consecutive error count. */
function errorBackoffMs(consecutiveErrors, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	const idx = Math.min(consecutiveErrors - 1, scheduleMs.length - 1);
	return expectDefined(scheduleMs[Math.max(0, idx)], "schedule ms entry at math.max(0, idx)") ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS[0];
}
/** Returns the earliest retry timestamp after a failed cron run and its runtime duration. */
function resolveJobErrorBackoffUntilMs(job, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	if (resolveJobLastRunStatus(job) !== "error" || !isFiniteTimestamp(job.state.lastRunAtMs)) return;
	const consecutiveErrorsRaw = job.state.consecutiveErrors;
	const consecutiveErrors = typeof consecutiveErrorsRaw === "number" && Number.isFinite(consecutiveErrorsRaw) ? Math.max(1, Math.floor(consecutiveErrorsRaw)) : 1;
	const lastDurationMs = typeof job.state.lastDurationMs === "number" && Number.isFinite(job.state.lastDurationMs) ? Math.max(0, Math.floor(job.state.lastDurationMs)) : 0;
	const lastEndedAtMs = job.state.lastRunAtMs + lastDurationMs;
	return asDateTimestampMs(lastEndedAtMs + errorBackoffMs(consecutiveErrors, scheduleMs));
}
function resolveStableCronOffsetMs(jobId, staggerMs) {
	if (staggerMs <= 1) return 0;
	const cacheKey = `${staggerMs}:${jobId}`;
	const cached = staggerOffsetCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const offset = crypto.createHash("sha256").update(jobId).digest().readUInt32BE(0) % staggerMs;
	pruneMapToMaxSize(staggerOffsetCache, 4095);
	staggerOffsetCache.set(cacheKey, offset);
	return offset;
}
function computeStaggeredCronNextRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return computeNextRunAtMs(job.schedule, nowMs);
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computeNextRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const baseNext = computeNextRunAtMs(job.schedule, cursorMs);
		if (baseNext === void 0) return;
		const shifted = baseNext + offsetMs;
		if (isFiniteTimestamp(shifted) && shifted > nowMs) return shifted;
		cursorMs = Math.max(cursorMs + 1, baseNext + 1e3);
	}
}
function computeStaggeredCronPreviousRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return;
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computePreviousRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const basePrevious = computePreviousRunAtMs(job.schedule, cursorMs);
		if (basePrevious === void 0) return;
		const shifted = basePrevious + offsetMs;
		if (isFiniteTimestamp(shifted) && shifted <= nowMs) return shifted;
		cursorMs = Math.max(0, basePrevious - 1e3);
	}
}
function computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs) {
	const previous = computeStaggeredCronPreviousRunAtMs(job, nowMs);
	const probeMs = nowMs + 1e3;
	if (!isFiniteTimestamp(probeMs)) return previous;
	const boundary = computeStaggeredCronPreviousRunAtMs(job, probeMs);
	if (isFiniteTimestamp(boundary) && boundary <= nowMs && (!isFiniteTimestamp(previous) || boundary > previous)) return boundary;
	return previous;
}
function isStaggeredCronRunAtMs(job, runAtMs) {
	if (job.schedule.kind !== "cron" || !isFiniteTimestamp(runAtMs)) return false;
	return computeStaggeredCronPreviousRunAtOrBeforeMs(job, runAtMs) === runAtMs;
}
function isStaleFutureCronSlot(job, nowMs) {
	const nextRun = job.state.nextRunAtMs;
	if (job.schedule.kind !== "cron" || !hasScheduledNextRunAtMs(nextRun) || nowMs >= nextRun || typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number") return false;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	if (backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRun <= backoffUntilMs || hasPendingCronTriggerInterval(job, nowMs)) return false;
	let naturalNext;
	try {
		naturalNext = computeStaggeredCronNextRunAtMs(job, nowMs);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(naturalNext) || nextRun === naturalNext) return false;
	let isScheduledSlot;
	try {
		isScheduledSlot = isStaggeredCronRunAtMs(job, nextRun);
	} catch {
		return false;
	}
	if (isScheduledSlot) return false;
	if (nextRun < naturalNext) return job.payload.kind !== "agentTurn";
	let followingNaturalNext;
	try {
		followingNaturalNext = computeStaggeredCronNextRunAtMs(job, naturalNext);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(followingNaturalNext)) return false;
	const naturalIntervalMs = followingNaturalNext - naturalNext;
	return naturalIntervalMs > 0 && nextRun >= followingNaturalNext + naturalIntervalMs;
}
function resolveEveryAnchorMs(params) {
	const coerced = coerceFiniteScheduleNumber(params.schedule.anchorMs);
	if (coerced !== void 0) return Math.max(0, Math.floor(coerced));
	if (isFiniteTimestamp(params.fallbackAnchorMs)) return Math.max(0, Math.floor(params.fallbackAnchorMs));
	return 0;
}
function hasInvalidExplicitEveryAnchor(schedule) {
	if (schedule.anchorMs === void 0) return false;
	const coerced = coerceFiniteScheduleNumber(schedule.anchorMs);
	return coerced === void 0 || coerced < 0;
}
/** Finds an in-memory cron job or throws the public unknown-id error. */
function findJobOrThrow(state, id) {
	const job = state.store?.jobs.find((j) => j.id === id);
	if (!job) throw new Error(`unknown cron job id: ${id}`);
	return job;
}
/** Returns the effective enabled flag, defaulting missing values to enabled. */
function isJobEnabled(job) {
	return job.enabled ?? true;
}
function isTimeScheduledJob(job) {
	return job.schedule.kind !== "on-exit" && job.schedule.kind !== "stream";
}
/** Computes the next run timestamp for enabled jobs across every/at/cron schedules. */
function computeJobNextRunAtMs(job, nowMs) {
	if (!isJobEnabled(job)) return;
	if (job.schedule.kind === "every") {
		if (hasInvalidExplicitEveryAnchor(job.schedule)) return;
		const everyMsRaw = coerceFiniteScheduleNumber(job.schedule.everyMs);
		if (everyMsRaw === void 0) return;
		const everyMs = Math.floor(everyMsRaw);
		if (everyMs < 1) return;
		const fallbackAnchorMs = isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs;
		const anchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs
		});
		const lastRunAtMs = job.state.lastRunAtMs;
		if (isFiniteTimestamp(lastRunAtMs) && lastRunAtMs >= anchorMs) {
			const nextFromLastRun = Math.floor(lastRunAtMs) + everyMs;
			if (!isFiniteTimestamp(nextFromLastRun)) return;
			if (nextFromLastRun > nowMs) return nextFromLastRun;
		}
		const next = computeNextRunAtMs({
			...job.schedule,
			everyMs,
			anchorMs
		}, nowMs);
		return isFiniteTimestamp(next) ? next : void 0;
	}
	if (job.schedule.kind === "at") return computeOneShotNextRunAtMs(job, resolveJobLastRunStatus(job));
	const next = computeStaggeredCronNextRunAtMs(job, nowMs);
	if (next === void 0 && job.schedule.kind === "cron") return computeStaggeredCronNextRunAtMs(job, Math.floor(nowMs / 1e3) * 1e3 + 1e3);
	return isFiniteTimestamp(next) ? next : void 0;
}
/** Computes the latest effective cron timestamp at or before the supplied time. */
function computeJobPreviousRunAtOrBeforeMs(job, nowMs) {
	if (!isJobEnabled(job) || job.schedule.kind !== "cron") return;
	return asDateTimestampMs(computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs));
}
/** Maximum consecutive schedule errors before auto-disabling a job. */
const MAX_SCHEDULE_ERRORS = 3;
/** Records a schedule-computation failure and auto-disables after repeated errors. */
function recordScheduleComputeError(params) {
	const { state, job, err } = params;
	const errorCount = (job.state.scheduleErrorCount ?? 0) + 1;
	const errText = formatErrorMessageWithCode(err);
	job.state.scheduleErrorCount = errorCount;
	job.state.nextRunAtMs = void 0;
	job.state.lastError = `schedule error: ${errText}`;
	if (errorCount >= MAX_SCHEDULE_ERRORS) {
		autoDisableCronJob({
			job,
			reason: "schedule-errors",
			atMs: state.deps.nowMs(),
			consecutiveErrors: errorCount,
			deferredNotifications: params.deferredNotifications
		});
		state.deps.log.error({
			jobId: job.id,
			name: job.name,
			errorCount,
			err: errText
		}, "cron: auto-disabled job after repeated schedule errors");
	} else state.deps.log.warn({
		jobId: job.id,
		name: job.name,
		errorCount,
		err: errText
	}, "cron: failed to compute next run for job (skipping)");
	return true;
}
function normalizeJobTickState(params) {
	const { state, job, nowMs, ownership } = params;
	const { log } = state.deps;
	let changed = false;
	if (!job.state) {
		job.state = {};
		changed = true;
	}
	if (job.schedule.kind === "stream" && !job.state.streamSourceIdentity?.trim()) {
		job.state.streamSourceIdentity = createCronStreamSourceIdentity();
		changed = true;
	}
	if (job.schedule.kind === "every" && !hasInvalidExplicitEveryAnchor(job.schedule)) {
		const normalizedAnchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs: isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs
		});
		if (job.schedule.anchorMs !== normalizedAnchorMs) {
			job.schedule = {
				...job.schedule,
				anchorMs: normalizedAnchorMs
			};
			job.state.pacedNextRunAtMs = void 0;
			job.state.forcePreservedNextRunAtMs = void 0;
			changed = true;
		}
	}
	if (!isJobEnabled(job) || !isTimeScheduledJob(job)) for (const key of TIME_SCHEDULE_STATE_FIELDS) {
		if (key === "forcePreservedNextRunAtMs" && resolveForcePreservedOneShotAtMs(job) !== void 0) continue;
		if (job.state[key] !== void 0) {
			job.state[key] = void 0;
			changed = true;
		}
	}
	if (!isJobEnabled(job)) {
		if (job.state.queuedAtMs !== void 0 && !ownsCronRunMarker(ownership, job.id, job.state.queuedAtMs, true)) {
			job.state.queuedAtMs = void 0;
			changed = true;
		}
		if (job.state.runningAtMs !== void 0 && !ownsCronRunMarker(ownership, job.id, job.state.runningAtMs, true) && !ownership.isJobActive(job.id)) {
			Object.assign(job.state, {
				runningAtMs: void 0,
				runningReceiptId: void 0
			});
			delete job.state.runningScheduleChangeId;
			changed = true;
		}
		return {
			changed,
			skip: true
		};
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs) && job.state.nextRunAtMs !== void 0) {
		job.state.nextRunAtMs = void 0;
		changed = true;
	}
	changed = clearInvalidForcePreservedNextRun(job) || changed;
	const queuedAt = job.state.queuedAtMs;
	if (typeof queuedAt === "number" && Math.abs(nowMs - queuedAt) > 72e5 && !ownsCronRunMarker(ownership, job.id, queuedAt)) {
		log.warn({
			jobId: job.id,
			queuedAtMs: queuedAt
		}, "cron: clearing stuck queued marker");
		job.state.queuedAtMs = void 0;
		changed = true;
	}
	const runningAt = job.state.runningAtMs;
	if (typeof runningAt === "number" && Math.abs(nowMs - runningAt) > 72e5 && !ownsCronRunMarker(ownership, job.id, runningAt)) {
		log.warn({
			jobId: job.id,
			runningAtMs: runningAt
		}, "cron: clearing stuck running marker");
		Object.assign(job.state, {
			runningAtMs: void 0,
			runningReceiptId: void 0
		});
		delete job.state.runningScheduleChangeId;
		changed = true;
		const nextRun = job.state.nextRunAtMs;
		const lastRun = job.state.lastRunAtMs;
		const alreadyExecutedSlot = hasScheduledNextRunAtMs(nextRun) && isFiniteTimestamp(lastRun) && lastRun >= nextRun;
		return {
			changed,
			skip: !alreadyExecutedSlot
		};
	}
	return {
		changed,
		skip: false
	};
}
function recomputeJobNextRunAtMs(params) {
	let changed = false;
	try {
		let newNext = computeJobNextRunAtMs(params.job, params.nowMs);
		if (params.job.schedule.kind !== "at" && resolveJobLastRunStatus(params.job) === "error" && isFiniteTimestamp(params.job.state.lastRunAtMs)) {
			const backoffFloor = resolveJobErrorBackoffUntilMs(params.job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			if (newNext !== void 0) newNext = backoffFloor !== void 0 ? Math.max(newNext, backoffFloor) : newNext;
		}
		if (params.job.state.nextRunAtMs !== newNext) {
			params.job.state.nextRunAtMs = newNext;
			changed = true;
		}
		if (params.job.state.scheduleErrorCount) {
			params.job.state.scheduleErrorCount = void 0;
			changed = true;
		}
	} catch (err) {
		if (params.skipScheduleErrorHandling) return false;
		if (recordScheduleComputeError({
			state: params.state,
			job: params.job,
			err,
			deferredNotifications: params.deferredNotifications
		})) changed = true;
	}
	return changed;
}
function isExpiredCronScheduleRepairCandidate(job, nowMs, active) {
	const nextRunAtMs = job.state.nextRunAtMs;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return hasScheduledNextRunAtMs(nextRunAtMs) && nowMs >= nextRunAtMs && typeof job.state.queuedAtMs !== "number" && typeof job.state.runningAtMs !== "number" && !active && job.state.startupCatchupAtMs !== nextRunAtMs && job.state.forcePreservedNextRunAtMs !== nextRunAtMs && (isFiniteTimestamp(job.state.lastRunAtMs) && job.state.lastRunAtMs >= nextRunAtMs || backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRunAtMs < backoffUntilMs);
}
function needsCronTimerMaintenance(job, nowMs) {
	if (!isTimeScheduledJob(job)) return TIME_SCHEDULE_STATE_FIELDS.some((key) => job.state[key] !== void 0);
	return isExpiredCronScheduleRepairCandidate(job, nowMs, isCronJobActive(job.id)) || isStaleFutureCronSlot(job, nowMs) || isJobEnabled(job) && !hasScheduledNextRunAtMs(job.state.nextRunAtMs) && !hasActiveCronRun(job);
}
function recomputeSingleJobForMaintenance(state, job, opts, ownership) {
	const now = opts.nowMs ?? state.deps.nowMs();
	const tick = normalizeJobTickState({
		state,
		job,
		nowMs: now,
		ownership
	});
	let changed = tick.changed;
	if (tick.skip) return changed;
	const recomputeExpired = opts.recomputeExpired ?? false;
	const repairFutureCronNextRunAtMs = opts.repairFutureCronNextRunAtMs ?? true;
	const recomputeJob = () => recomputeJobNextRunAtMs({
		state,
		job,
		nowMs: now,
		deferredNotifications: opts.deferredNotifications,
		skipScheduleErrorHandling: opts.skipScheduleErrorHandling
	});
	const startupCatchupAtMs = job.state.startupCatchupAtMs;
	const pacedNextRunAtMs = job.state.pacedNextRunAtMs;
	const nextRunAtMs = job.state.nextRunAtMs;
	const hasForcePreservedNextRun = isFiniteTimestamp(job.state.forcePreservedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && job.state.forcePreservedNextRunAtMs === nextRunAtMs;
	const hasPendingStartupCatchup = isFiniteTimestamp(startupCatchupAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && startupCatchupAtMs === nextRunAtMs;
	if (startupCatchupAtMs !== void 0 && !hasPendingStartupCatchup) {
		job.state.startupCatchupAtMs = void 0;
		changed = true;
	}
	const hasPendingPacedNextRun = isFiniteTimestamp(pacedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && pacedNextRunAtMs === nextRunAtMs && (now < pacedNextRunAtMs || opts.preserveExpiredPacedNextRunJobId === job.id);
	if (pacedNextRunAtMs !== void 0 && !hasPendingPacedNextRun) {
		job.state.pacedNextRunAtMs = void 0;
		changed = true;
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) changed = recomputeJob() || changed;
	else if (repairFutureCronNextRunAtMs && !hasPendingStartupCatchup && !hasPendingPacedNextRun && !hasForcePreservedNextRun && isStaleFutureCronSlot(job, now)) changed = recomputeJob() || changed;
	else if (recomputeExpired && isExpiredCronScheduleRepairCandidate(job, now, ownership.isJobActive(job.id))) changed = recomputeJob() || changed;
	return changed;
}
function recomputeNextRunsForMaintenance(state, opts) {
	if (!state.store) return false;
	let changed = false;
	for (const job of state.store.jobs) changed = recomputeSingleJobForMaintenance(state, job, opts, {
		reservations: state.queuedRunReservationsByJobId,
		isJobActive: isCronJobActive
	}) || changed;
	return changed;
}
/** Summarizes the resident job schedule in one pass for timer and status projections. */
function summarizeCronJobSchedule(state) {
	const jobs = state.store?.jobs ?? [];
	let nextWake;
	let jobCount = 0;
	let enabledCount = 0;
	for (const job of jobs) {
		jobCount += 1;
		const nextRun = job.state.nextRunAtMs;
		const hasNextRun = hasScheduledNextRunAtMs(nextRun);
		const rawEnabled = job.enabled;
		if (rawEnabled) enabledCount += 1;
		if ((rawEnabled ?? true) && isTimeScheduledJob(job) && hasNextRun) nextWake = nextWake === void 0 ? nextRun : Math.min(nextWake, nextRun);
	}
	return {
		jobCount,
		enabledCount,
		nextWakeAtMs: nextWake
	};
}
/** Returns the next enabled wake timestamp from the in-memory cron store. */
function nextWakeAtMs(state) {
	return summarizeCronJobSchedule(state).nextWakeAtMs;
}
/** Applies one canonical server-authored authority envelope to a tool-bearing job. */
function hasActiveCronRun(job) {
	return typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number" || isCronJobActive(job.id);
}
/** Returns whether a cron job should execute at `nowMs`, honoring force mode and active runs. */
function isJobDue(job, nowMs, opts) {
	if (!job.state) job.state = {};
	if (hasActiveCronRun(job)) return false;
	if (opts.forced) return true;
	return isJobEnabled(job) && isTimeScheduledJob(job) && hasScheduledNextRunAtMs(job.state.nextRunAtMs) && nowMs >= job.state.nextRunAtMs;
}
/** Returns main-session queue text for system-event jobs, or undefined when empty/unsupported. */
function resolveJobPayloadTextForMain(job) {
	if (job.payload.kind !== "systemEvent") return;
	const text = normalizePayloadToSystemText(job.payload);
	return text.trim() ? text : void 0;
}
//#endregion
export { cronNotificationJob as A, summarizeCronJobSchedule as C, retainManualOneShotOccurrence as D, resolveManualOneShotOccurrenceAtMs as E, autoDisableCronJob as O, resolveJobPayloadTextForMain as S, resolveForcePreservedOneShotAtMs as T, recomputeSingleJobForMaintenance as _, findJobOrThrow as a, resolveJobErrorBackoffUntilMs as b, isJobDue as c, isTimeScheduledJob as d, needsCronTimerMaintenance as f, recomputeNextRunsForMaintenance as g, recomputeJobNextRunAtMs as h, errorBackoffMs as i, cronFailureDetailLines as j, maybeAutoDisableCronJobAfterRunFailure as k, isJobEnabled as l, normalizeStreamScheduleBounds as m, computeJobNextRunAtMs as n, hasActiveCronRun as o, nextWakeAtMs as p, computeJobPreviousRunAtOrBeforeMs as r, hasScheduledNextRunAtMs as s, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS as t, isStaleFutureCronSlot as u, recordScheduleComputeError as v, hasPendingCronTriggerInterval as w, resolveJobLastRunStatus as x, resolveEveryAnchorMs as y };
