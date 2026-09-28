import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
//#region src/cron/pacing.ts
function parsePositivePacingDuration(value, field) {
	try {
		const durationMs = parseDurationMs(value);
		if (durationMs > 0) return durationMs;
	} catch {}
	throw new Error(`cron pacing ${field} must be a positive duration`);
}
/** Validates pacing strings and returns their millisecond bounds. */
function parseCronPacingBounds(pacing) {
	if (pacing.min === void 0 && pacing.max === void 0) throw new Error("cron pacing requires at least one of min or max");
	const minMs = pacing.min === void 0 ? void 0 : parsePositivePacingDuration(pacing.min, "min");
	const maxMs = pacing.max === void 0 ? void 0 : parsePositivePacingDuration(pacing.max, "max");
	if (minMs !== void 0 && maxMs !== void 0 && minMs > maxMs) throw new Error("cron pacing min must not exceed max");
	return {
		minMs,
		maxMs
	};
}
/** Clamps one successful run's proposal against its job-local pacing bounds. */
function resolvePacedNextRunAtMs(params) {
	const { minMs, maxMs } = parseCronPacingBounds(params.pacing);
	const proposedAtMs = params.nowMs + params.delayMs;
	return asDateTimestampMs(Math.min(params.nowMs + (maxMs ?? Number.POSITIVE_INFINITY), Math.max(params.nowMs + (minMs ?? 0), proposedAtMs)));
}
//#endregion
export { resolvePacedNextRunAtMs as n, parseCronPacingBounds as t };
