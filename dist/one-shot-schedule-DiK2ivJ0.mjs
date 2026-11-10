import { o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { s as resolveCronSessionTargetSessionKey } from "./session-target-d98pYOqN.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { t as computeNextRunAtMs } from "./schedule-BBT1kAm1.mjs";
//#region src/cron/service/one-shot-schedule.ts
/** Authored one-shot occurrence ownership across manual runs and scheduling. */
/** Only explicit conversation continuations can rearm a one-shot through next_check. */
function isCronOneShotContinuationJob(job) {
	return job.schedule.kind === "at" && job.payload.kind === "agentTurn" && resolveCronSessionTargetSessionKey(job.sessionTarget) !== void 0;
}
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
	job.state.forcePreservedNextRunAtMs = resolveManualOneShotOccurrenceAtMs(job, ownershipAtMs);
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
export { resolveManualOneShotOccurrenceAtMs as a, resolveForcePreservedOneShotAtMs as i, computeOneShotNextRunAtMs as n, retainManualOneShotOccurrence as o, isCronOneShotContinuationJob as r, clearInvalidForcePreservedNextRun as t };
