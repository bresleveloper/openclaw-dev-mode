import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
//#region src/cron/stream-schedule.ts
const CRON_STREAM_BATCHING_BOUNDS = {
	batchMs: [
		250,
		50,
		5e3
	],
	maxBatchBytes: [
		16384,
		1024,
		65536
	]
};
const CRON_STREAM_TRUNCATED_MARKER = "[truncated]";
/** A committed identity is a result fact; later writes still require the normal source checks. */
var CronStreamSourceRetirementError = class extends Error {
	constructor(retirement, cause) {
		super("Cron stream source retirement committed before the operation failed", { cause });
		this.retirement = retirement;
		this.name = "CronStreamSourceRetirementError";
	}
};
function clampInteger(value, [fallback, min, max]) {
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error("stream schedule batching values must be integers");
	return Math.max(min, Math.min(max, value));
}
/** Resolve stream batching defaults without rewriting omitted public fields. */
function resolveCronStreamBatching(schedule) {
	return {
		batchMs: clampInteger(schedule.batchMs, CRON_STREAM_BATCHING_BOUNDS.batchMs),
		maxBatchBytes: clampInteger(schedule.maxBatchBytes, CRON_STREAM_BATCHING_BOUNDS.maxBatchBytes)
	};
}
/** Stable key for the source definition, with omitted defaults resolved. */
function cronStreamScheduleKey(schedule) {
	const batching = resolveCronStreamBatching(schedule);
	return JSON.stringify({
		command: schedule.command,
		cwd: schedule.cwd,
		mode: schedule.mode ?? "line",
		match: schedule.match,
		batchMs: batching.batchMs,
		maxBatchBytes: batching.maxBatchBytes
	});
}
/** Clamp explicitly supplied stream batching fields during create/update normalization. */
function normalizeCronStreamBatching(schedule) {
	for (const field of ["batchMs", "maxBatchBytes"]) {
		const value = schedule[field];
		if (value === void 0) continue;
		if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(`stream schedule ${field} must be an integer`);
		schedule[field] = clampInteger(value, CRON_STREAM_BATCHING_BOUNDS[field]);
	}
}
/** Render known-truncated source text without exposing the marker to match filters. */
function markCronStreamBatchTruncated(text, maxBytes) {
	const markerBytes = Buffer.byteLength(CRON_STREAM_TRUNCATED_MARKER, "utf8");
	const contentBudget = Math.max(0, maxBytes - markerBytes);
	return `${truncateUtf8Prefix(text, contentBudget)}${CRON_STREAM_TRUNCATED_MARKER}`;
}
/** Keep a UTF-8 batch inside its byte budget and reserve room for the marker. */
function truncateCronStreamBatch(text, maxBytes) {
	return Buffer.byteLength(text, "utf8") <= maxBytes ? text : markCronStreamBatchTruncated(text, maxBytes);
}
/** Append event text through the same payload seam used by trigger messages. */
function appendCronPayloadText(payload, text) {
	if (payload.kind === "systemEvent") return {
		...payload,
		text: `${payload.text}\n\n${text}`
	};
	if (payload.kind === "agentTurn") return {
		...payload,
		message: `${payload.message}\n\n${text}`
	};
	return payload;
}
//#endregion
export { normalizeCronStreamBatching as a, markCronStreamBatchTruncated as i, appendCronPayloadText as n, resolveCronStreamBatching as o, cronStreamScheduleKey as r, truncateCronStreamBatch as s, CronStreamSourceRetirementError as t };
