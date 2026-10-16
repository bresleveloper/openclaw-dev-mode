import { o as asDateTimestampMs, x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
//#region src/cron/schedule-number.ts
/** Coerces cron schedule time fields with strict Date-range parsing. */
/** Coerces temporal schedule fields without accepting partial, non-finite, or invalid-Date values. */
function coerceFiniteScheduleNumber(value) {
	const parsed = parseStrictFiniteNumber(value);
	return asDateTimestampMs(parsed);
}
//#endregion
export { coerceFiniteScheduleNumber as t };
