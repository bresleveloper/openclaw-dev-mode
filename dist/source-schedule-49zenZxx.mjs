import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as cronStreamScheduleKey } from "./stream-schedule-C4dQJNrH.mjs";
import { randomUUID } from "node:crypto";
//#region src/cron/source-schedule.ts
function isCronEventSchedule(value) {
	return isRecord(value) && value.kind === "event" && typeof value.source === "string" && /^[a-z0-9][a-z0-9._-]*$/.test(value.source) && isRecord(value.options);
}
function createCronSourceIdentity() {
	return randomUUID();
}
function cronSourceScheduleKey(schedule) {
	if (schedule.kind === "stream") return cronStreamScheduleKey(schedule);
	if (schedule.kind === "event") return stableStringify({
		kind: schedule.kind,
		source: schedule.source,
		options: schedule.options
	});
}
/** Stream's shipped field remains canonical for stream jobs; event jobs use the generic field. */
function cronSourceIdentity(job) {
	return job.schedule.kind === "stream" ? job.state.streamSourceIdentity : job.schedule.kind === "event" ? job.state.sourceIdentity : void 0;
}
function setCronSourceIdentity(job, identity) {
	job.state.streamSourceIdentity = job.schedule.kind === "stream" ? identity : void 0;
	job.state.sourceIdentity = job.schedule.kind === "event" ? identity : void 0;
}
/** Shared admission fence for every externally driven source, including stream batches. */
function ownsCronSource(job, scheduleKey, identity) {
	return cronSourceScheduleKey(job.schedule) === scheduleKey && cronSourceIdentity(job) === identity;
}
/** Configuration commits, not adapters, own source generation changes (including A→B→A). */
function reconcileCronSourceIdentity(previous, next) {
	const key = cronSourceScheduleKey(next.schedule);
	if (key === void 0) {
		setCronSourceIdentity(next, void 0);
		return;
	}
	const identity = cronSourceIdentity(previous);
	setCronSourceIdentity(next, cronSourceScheduleKey(previous.schedule) !== key || (previous.enabled ?? true) !== (next.enabled ?? true) || Boolean(previous.state.autoDisabled) !== Boolean(next.state.autoDisabled) || !identity ? createCronSourceIdentity() : identity);
}
//#endregion
export { ownsCronSource as a, isCronEventSchedule as i, cronSourceIdentity as n, reconcileCronSourceIdentity as o, cronSourceScheduleKey as r, setCronSourceIdentity as s, createCronSourceIdentity as t };
