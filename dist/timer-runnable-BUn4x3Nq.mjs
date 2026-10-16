import { t as parseAbsoluteTimeMs } from "./parse-BEO0zOri.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { b as resolveJobErrorBackoffUntilMs, c as hasScheduledNextRunAtMs, d as isTimeScheduledJob, i as computeJobPreviousRunAtOrBeforeMs, l as isJobEnabled, s as hasActiveCronRun, t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS, w as hasPendingCronTriggerInterval, x as resolveJobLastRunStatus } from "./jobs-scheduling-CBskypsm.mjs";
//#region src/cron/service/timer-runnable.ts
/**
* Reports whether a cron job's last completed occurrence is older than its previous
* effective slot, which is how restart catch-up detects a missed run once
* nextRunAtMs has already advanced past it.
*/
function hasMissedCronSlotSinceLastRun(job, nowMs) {
	const lastTriggerEvalAtMs = job.trigger ? job.state.lastTriggerEvalAtMs : void 0;
	const lastRunAtMs = lastTriggerEvalAtMs === void 0 ? job.state.lastRunAtMs : Math.max(job.state.lastRunAtMs ?? lastTriggerEvalAtMs, lastTriggerEvalAtMs);
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
		if (hasScheduledNextRunAtMs(next) && job.state.startupCatchupAtMs === next) return nowMs >= next;
		const lastRun = job.state.lastRunAtMs;
		const nextRun = job.state.nextRunAtMs;
		if (typeof lastRun === "number" && typeof nextRun === "number" && nextRun > lastRun && parseAbsoluteTimeMs(job.schedule.at) === nextRun) return nowMs >= nextRun;
		if (isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun)) return typeof nextRun === "number" && nowMs >= nextRun;
		return false;
	}
	if (isErrorBackoffPending(job, nowMs, lastRunStatus)) return false;
	if (hasScheduledNextRunAtMs(next) && nowMs >= next) {
		const lastRunAtMs = job.state.lastRunAtMs;
		if (!(params.allowCronMissedRunByLastRun && job.schedule.kind === "cron" && (lastRunStatus === "ok" || lastRunStatus === "skipped") && typeof lastRunAtMs === "number" && Number.isFinite(lastRunAtMs) && lastRunAtMs >= next)) return true;
		let latestRunAtMs;
		try {
			latestRunAtMs = computeJobPreviousRunAtOrBeforeMs(job, nowMs);
		} catch {
			return false;
		}
		return typeof latestRunAtMs === "number" && latestRunAtMs > lastRunAtMs;
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
function collectRunnableJobs(state, nowMs) {
	return state.store?.jobs.filter((job) => isRunnableJob({
		job,
		nowMs
	})) ?? [];
}
//#endregion
export { hasMissedCronSlotSinceLastRun as n, isRunnableJob as r, collectRunnableJobs as t };
