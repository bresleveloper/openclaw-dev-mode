import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
//#region src/shared/iso-time.ts
const ISO_ABSOLUTE_RE = /^(?!-000000)([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:[Tt](?<hour>\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(?<offset>[Zz]|[+-]\d{2}:?\d{2})?)?$/;
const GREGORIAN_CYCLE_MS = 146097 * 864e5;
/** Recognizes offsetless date and datetime forms from the shared ISO grammar. */
function isOffsetlessIsoDateTime(raw) {
	const match = ISO_ABSOLUTE_RE.exec(raw);
	return match !== null && match.groups?.offset === void 0;
}
/** Makes offsetless ISO dates and datetimes explicit UTC, preserving explicit offsets. */
function normalizeUtcIso(raw) {
	const match = ISO_ABSOLUTE_RE.exec(raw);
	return match && match.groups?.offset === void 0 ? `${raw}${match.groups?.hour === void 0 ? "T00:00:00" : ""}Z` : raw;
}
/** Checks the calendar components of the ISO-like forms accepted by existing callers. */
function hasValidIsoCalendarComponents(raw) {
	return parseIsoCalendarTimeMs(raw) !== void 0;
}
/** Projects Gregorian fields without clipping wall time before its offset is applied. */
function getUtcCalendarTimeMs(year, monthIndex, day, hour, minute, second, millisecond) {
	const yearInCycle = year % 400;
	const date = /* @__PURE__ */ new Date(0);
	date.setUTCFullYear(yearInCycle, monthIndex, day);
	return date.setUTCHours(hour, minute, second, millisecond) + (year - yearInCycle) / 400 * GREGORIAN_CYCLE_MS;
}
/** Parses valid ISO calendar fields without applying an offset or clipping wall time. */
function parseIsoCalendarTimeMs(raw) {
	const match = ISO_ABSOLUTE_RE.exec(raw);
	if (!match) return;
	const [, yearRaw, monthRaw, dayRaw, hourRaw = "0", minuteRaw = "0", secondRaw = "0", fractionRaw] = match;
	const year = Number(yearRaw);
	const month = Number(monthRaw);
	const day = Number(dayRaw);
	const hour = Number(hourRaw);
	const minute = Number(minuteRaw);
	const second = Number(secondRaw);
	const millisecond = fractionRaw ? Number(fractionRaw.slice(1, 4).padEnd(3, "0")) : 0;
	const hasZeroFraction = !fractionRaw || !/[1-9]/.test(fractionRaw);
	const isEndOfDay = hour === 24 && minute === 0 && second === 0 && hasZeroFraction;
	const yearInCycle = year % 400;
	const probe = new Date(getUtcCalendarTimeMs(yearInCycle, month - 1, day, isEndOfDay ? 0 : hour, minute, second, millisecond));
	if (probe.getUTCFullYear() !== yearInCycle || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day || probe.getUTCHours() !== (isEndOfDay ? 0 : hour) || probe.getUTCMinutes() !== minute || probe.getUTCSeconds() !== second || probe.getUTCMilliseconds() !== millisecond) return;
	return getUtcCalendarTimeMs(year, month - 1, day, hour, minute, second, millisecond);
}
//#endregion
//#region src/cron/parse.ts
/** Parses cron schedule timestamps from user-facing absolute time strings. */
/** Parses absolute cron timestamps from epoch milliseconds or ISO-like strings normalized to UTC. */
function parseAbsoluteTimeMs(input) {
	const raw = input.trim();
	if (!raw) return null;
	if (/^\d+$/.test(raw)) {
		const n = parseStrictPositiveInteger(raw);
		if (n !== void 0 && Number.isFinite(new Date(n).getTime())) return n;
		return null;
	}
	if (!hasValidIsoCalendarComponents(raw)) return null;
	const parsed = Date.parse(normalizeUtcIso(raw));
	return Number.isFinite(parsed) ? parsed : null;
}
//#endregion
export { parseIsoCalendarTimeMs as i, getUtcCalendarTimeMs as n, isOffsetlessIsoDateTime as r, parseAbsoluteTimeMs as t };
