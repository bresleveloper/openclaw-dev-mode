import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { S as hasPendingCronTriggerInterval, b as resolveJobLastRunStatus, c as hasScheduledNextRunAtMs, i as computeJobPreviousRunAtOrBeforeMs, l as isJobEnabled, s as hasActiveCronRun, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, u as isTimeScheduledJob, v as resolveJobErrorBackoffUntilMs, y as resolveJobLastRunEndedAtMs } from "./jobs-scheduling-sefIqbJ3.mjs";
import { i as resolveForcePreservedOneShotAtMs, r as isCronOneShotContinuationJob } from "./one-shot-schedule-DiK2ivJ0.mjs";
//#region src/cron/service/timer-runnable.ts
/**
* Reports whether a cron job's last completed occurrence is older than its previous
* effective slot, which is how restart catch-up detects a missed run once
* nextRunAtMs has already advanced past it.
*/
function hasMissedCronSlotSinceLastRun(job, nowMs) {
	const lastTriggerEvalAtMs = job.trigger ? job.state.lastTriggerEvalAtMs : void 0;
	const lastRunStatus = resolveJobLastRunStatus(job);
	const coveredThroughMs = lastRunStatus === "ok" || lastRunStatus === "skipped" ? resolveJobLastRunEndedAtMs(job) : job.state.lastRunAtMs;
	const lastRunAtMs = lastTriggerEvalAtMs === void 0 ? coveredThroughMs : Math.max(coveredThroughMs ?? lastTriggerEvalAtMs, lastTriggerEvalAtMs);
	const nextRunAtMs = job.state.nextRunAtMs;
	if (typeof lastRunAtMs !== "number" || !Number.isFinite(lastRunAtMs) || hasPendingCronTriggerInterval(job, nowMs) || hasScheduledNextRunAtMs(nextRunAtMs) && job.state.pacedNextRunAtMs === nextRunAtMs && nowMs < nextRunAtMs) return false;
	let previousRunAtMs;
	try {
		previousRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
	} catch {
		return false;
	}
	if (typeof previousRunAtMs !== "number" || !Number.isFinite(previousRunAtMs) || previousRunAtMs <= lastRunAtMs) return false;
	const activatedAtMs = job.state.scheduleActivatedAtMs;
	if (typeof activatedAtMs !== "number" || !Number.isFinite(activatedAtMs)) return true;
	return previousRunAtMs > activatedAtMs;
}
function isRunnableJob(params) {
	const { job, nowMs } = params;
	if (!job.state) job.state = {};
	if (!hasCanonicalCronDeliveryMode(job.delivery) || hasActiveCronRun(job, params.activeInProcess)) return false;
	if (params.forced) return true;
	if (!isJobEnabled(job) || !isTimeScheduledJob(job)) return false;
	const next = job.state.nextRunAtMs;
	if (hasScheduledNextRunAtMs(next) && nowMs < next && (!params.allowCronMissedRunByLastRun || job.state.startupCatchupAtMs === next)) return false;
	const lastRunStatus = resolveJobLastRunStatus(job);
	if (params.skipAtIfAlreadyRan && job.schedule.kind === "at" && lastRunStatus) {
		if (hasScheduledNextRunAtMs(next) && (job.state.startupCatchupAtMs === next || resolveForcePreservedOneShotAtMs(job) === next)) return nowMs >= next;
		const lastRun = job.state.lastRunAtMs;
		const nextRun = job.state.nextRunAtMs;
		if (typeof lastRun === "number" && typeof nextRun === "number" && nextRun > lastRun && (parseAbsoluteTimeMs(job.schedule.at) === nextRun || isCronOneShotContinuationJob(job) && job.state.pacedNextRunAtMs === nextRun)) return nowMs >= nextRun;
		if (isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun)) return typeof nextRun === "number" && nowMs >= nextRun;
		return false;
	}
	if (isErrorBackoffPending(job, nowMs, lastRunStatus)) return false;
	if (hasScheduledNextRunAtMs(next) && nowMs >= next) {
		const lastRunAtMs = job.state.lastRunAtMs;
		if (!(params.allowCronMissedRunByLastRun && job.schedule.kind === "cron" && job.state.forcePreservedNextRunAtMs !== next && (lastRunStatus === "ok" || lastRunStatus === "skipped") && typeof lastRunAtMs === "number" && Number.isFinite(lastRunAtMs) && lastRunAtMs >= next)) return true;
		let latestRunAtMs;
		try {
			latestRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
		} catch {
			return false;
		}
		const lastEndedAtMs = resolveJobLastRunEndedAtMs(job) ?? lastRunAtMs;
		return typeof latestRunAtMs === "number" && latestRunAtMs > lastEndedAtMs;
	}
	if (!params.allowCronMissedRunByLastRun || job.schedule.kind !== "cron") return false;
	return hasMissedCronSlotSinceLastRun(job, nowMs);
}
function isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun) {
	if (!isJobEnabled(job) || typeof nextRun !== "number" || typeof lastRun !== "number" || nextRun <= lastRun) return false;
	if (lastRunStatus === "error") return true;
	return lastRunStatus === "skipped" && job.sessionTarget === "main" && job.wakeMode === "now" && job.state.lastError === "disabled";
}
function isErrorBackoffPending(job, nowMs, lastRunStatus) {
	if (job.schedule.kind === "at" || lastRunStatus !== "error") return false;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return backoffUntilMs !== void 0 && nowMs < backoffUntilMs;
}
//#endregion
export { isRunnableJob as n, hasMissedCronSlotSinceLastRun as t };
