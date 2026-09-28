import { f as asSafeIntegerInRange, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { Q as compileSafeRegex } from "./redact-B5EGyLvV.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { t as isSystemOwnedCronPayloadKind } from "./types--MeiGb_d.mjs";
//#region src/cron/persisted-shape.ts
/** Validates persisted cron job records before loading them from disk/state. */
const CRON_STATE_TIMESTAMP_FIELDS = [
	"nextRunAtMs",
	"scheduleActivatedAtMs",
	"startupCatchupAtMs",
	"pacedNextRunAtMs",
	"forcePreservedNextRunAtMs",
	"queuedAtMs",
	"runningAtMs",
	"lastRunAtMs",
	"lastFailureAlertAtMs",
	"lastTriggerEvalAtMs",
	"lastTriggerFireAtMs",
	"streamLastStartedAtMs",
	"streamLastExitAtMs"
];
function isValidStateTimestamp(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: MAX_DATE_TIMESTAMP_MS
	}) !== void 0;
}
function getInvalidCronJobStateTimestampField(state) {
	const record = asRecord(state);
	const field = CRON_STATE_TIMESTAMP_FIELDS.find((key) => record[key] !== void 0 && !isValidStateTimestamp(record[key]));
	if (field) return field;
	const atMs = asRecord(record.autoDisabled).atMs;
	return atMs !== void 0 && !isValidStateTimestamp(atMs) ? "autoDisabled.atMs" : void 0;
}
/** Rejects caller-authored state timestamps that cannot round-trip through Date and SQLite. */
function assertCronJobStateTimestamps(state) {
	const invalidField = getInvalidCronJobStateTimestampField(state);
	if (invalidField) throw new Error(`cron state.${invalidField} must be a non-negative Date-valid integer timestamp`);
}
/** Returns the first structural reason a persisted cron job cannot be loaded safely. */
function getInvalidPersistedCronJobReason(candidate) {
	const id = candidate.id;
	if (typeof id !== "string" || !id.trim()) return "missing-id";
	if (getInvalidCronJobStateTimestampField(candidate.state)) return "invalid-state";
	const schedule = candidate.schedule;
	if (!schedule || Array.isArray(schedule)) return "missing-schedule";
	const legacySchedule = typeof schedule === "string";
	if (!legacySchedule && typeof schedule !== "object") return "missing-schedule";
	const scheduleRecord = asRecord(schedule);
	const scheduleKind = scheduleRecord.kind;
	if (!legacySchedule && scheduleKind !== "at" && scheduleKind !== "every" && scheduleKind !== "cron" && scheduleKind !== "on-exit" && scheduleKind !== "stream") return "invalid-schedule";
	if (scheduleKind === "at") {
		const at = scheduleRecord.at;
		if (typeof at !== "string" || parseAbsoluteTimeMs(at) === null) return "invalid-schedule";
	}
	if (scheduleKind === "every") {
		const everyMs = scheduleRecord.everyMs;
		const anchorMs = scheduleRecord.anchorMs;
		if (asSafeIntegerInRange(everyMs, {
			min: 1,
			max: 864e13
		}) === void 0 || anchorMs !== void 0 && asSafeIntegerInRange(anchorMs, {
			min: 0,
			max: 864e13
		}) === void 0) return "invalid-schedule";
	}
	if (scheduleKind === "cron") {
		const expr = scheduleRecord.expr;
		const staggerMs = scheduleRecord.staggerMs;
		if (typeof expr !== "string" || expr.trim().length === 0 || staggerMs !== void 0 && asSafeIntegerInRange(staggerMs, {
			min: 0,
			max: 864e13
		}) === void 0) return "invalid-schedule";
	}
	if (scheduleKind === "on-exit") {
		const command = scheduleRecord.command;
		if (typeof command !== "string" || command.trim().length === 0) return "invalid-schedule";
	}
	if (scheduleKind === "stream") {
		const command = scheduleRecord.command;
		const mode = scheduleRecord.mode ?? "line";
		const batchFieldValid = (value) => value === void 0 || asSafeIntegerInRange(value, {}) !== void 0;
		if (!Array.isArray(command) || command.length === 0 || command.some((value) => typeof value !== "string" || value.length === 0) || mode !== "line" && mode !== "match" || mode === "match" && typeof scheduleRecord.match !== "string" || mode === "line" && scheduleRecord.match !== void 0 || !batchFieldValid(scheduleRecord.batchMs) || !batchFieldValid(scheduleRecord.maxBatchBytes)) return "invalid-schedule";
		if (mode === "match") {
			if (!compileSafeRegex(scheduleRecord.match)) return "invalid-schedule";
		}
	}
	if ("trigger" in candidate) {
		const trigger = candidate.trigger;
		if (!trigger || typeof trigger !== "object" || Array.isArray(trigger)) return "invalid-trigger";
		const script = trigger.script;
		if (typeof script !== "string" || script.trim().length === 0 || scheduleKind === "at" || scheduleKind === "on-exit") return "invalid-trigger";
	}
	const payload = candidate.payload;
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "missing-payload";
	const payloadRecord = payload;
	const payloadKind = payloadRecord.kind;
	if (payloadKind !== "systemEvent" && payloadKind !== "agentTurn" && payloadKind !== "command" && payloadKind !== "script" && !isSystemOwnedCronPayloadKind(payloadKind)) return "invalid-payload";
	const requiredText = payloadKind === "systemEvent" ? payloadRecord.text : payloadKind === "agentTurn" ? payloadRecord.message : payloadKind === "script" ? payloadRecord.script : void 0;
	if ((payloadKind === "systemEvent" || payloadKind === "agentTurn" || payloadKind === "script") && (typeof requiredText !== "string" || payloadKind !== "systemEvent" && !requiredText.trim())) return "invalid-payload";
	if (payloadKind === "command") {
		const argv = payloadRecord.argv;
		if (!Array.isArray(argv) || argv.length === 0 || argv.some((value) => typeof value !== "string" || value.length === 0)) return "invalid-payload";
		if (scheduleKind === "stream") return "invalid-payload";
	}
	return null;
}
//#endregion
export { getInvalidPersistedCronJobReason as n, assertCronJobStateTimestamps as t };
