import { b as parseStrictPositiveInteger, y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
//#region src/cron/parse.ts
/** Parses cron schedule timestamps from user-facing absolute time strings. */
const ISO_TZ_RE = /(Z|[+-]\d{2}:?\d{2})$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T/;
const ISO_ABSOLUTE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?(?:[Zz]|[+-]\d{2}:?\d{2})?)?$/;
function normalizeUtcIso(raw) {
	if (ISO_TZ_RE.test(raw)) return raw;
	if (ISO_DATE_RE.test(raw)) return `${raw}T00:00:00Z`;
	if (ISO_DATE_TIME_RE.test(raw)) return `${raw}Z`;
	return raw;
}
function isValidIsoAbsolute(raw) {
	const match = ISO_ABSOLUTE_RE.exec(raw);
	if (!match) return false;
	const [, yearRaw, monthRaw, dayRaw, hourRaw = "0", minuteRaw = "0", secondRaw = "0", fractionRaw] = match;
	const year = Number(yearRaw);
	const month = Number(monthRaw);
	const day = Number(dayRaw);
	const hour = Number(hourRaw);
	const minute = Number(minuteRaw);
	const second = Number(secondRaw);
	const millisecond = fractionRaw ? Number(fractionRaw.slice(1, 4).padEnd(3, "0")) : 0;
	const isEndOfDay = hour === 24 && minute === 0 && second === 0 && millisecond === 0;
	const probe = /* @__PURE__ */ new Date(0);
	probe.setUTCFullYear(year, month - 1, day);
	probe.setUTCHours(isEndOfDay ? 0 : hour, minute, second, millisecond);
	return probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day && probe.getUTCHours() === (isEndOfDay ? 0 : hour) && probe.getUTCMinutes() === minute && probe.getUTCSeconds() === second && probe.getUTCMilliseconds() === millisecond;
}
/** Parses absolute cron timestamps from epoch milliseconds or ISO-like strings normalized to UTC. */
function parseAbsoluteTimeMs(input) {
	const raw = input.trim();
	if (!raw) return null;
	if (/^\d+$/.test(raw)) {
		const n = parseStrictPositiveInteger(raw);
		if (n !== void 0 && Number.isFinite(new Date(n).getTime())) return n;
		return null;
	}
	if (!isValidIsoAbsolute(raw)) return null;
	const parsed = Date.parse(normalizeUtcIso(raw));
	return Number.isFinite(parsed) ? parsed : null;
}
//#endregion
//#region src/cron/stagger.ts
/** Resolves deterministic cron stagger windows for recurring schedules. */
/** Default jitter window applied to recurring top-of-hour cron schedules. */
const DEFAULT_TOP_OF_HOUR_STAGGER_MS = 300 * 1e3;
function parseCronFields(expr) {
	return expr.trim().split(/\s+/).filter(Boolean);
}
const HOUR_LIST_PART = /^(?:\d+|\d+-\d+)(?:\/\d+)?$|^[*?](?:\/\d+)?$/;
function hasRecurringWildcardHour(field) {
	const parts = field.split(",");
	return parts.every((part) => HOUR_LIST_PART.test(part)) && parts.some((part) => part.startsWith("*") || part.startsWith("?"));
}
/** Returns whether a cron expression fires recurring jobs exactly at the top of an hour. */
function isRecurringTopOfHourCronExpr(expr) {
	const fields = parseCronFields(expr);
	if (fields.length === 5) {
		const [minuteField, hourField] = fields;
		return minuteField === "0" && hasRecurringWildcardHour(hourField);
	}
	if (fields.length === 6) {
		const [secondField, minuteField, hourField] = fields;
		return secondField === "0" && minuteField === "0" && hasRecurringWildcardHour(hourField);
	}
	return false;
}
/** Normalizes explicit stagger values from config, preserving zero as "run exactly on schedule". */
function normalizeCronStaggerMs(raw) {
	const numeric = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() ? parseStrictNonNegativeInteger(raw) ?? NaN : NaN;
	if (!Number.isFinite(numeric)) return;
	return Math.max(0, Math.floor(numeric));
}
/** Returns the default anti-thundering-herd stagger for top-of-hour recurring schedules. */
function resolveDefaultCronStaggerMs(expr) {
	return isRecurringTopOfHourCronExpr(expr) ? DEFAULT_TOP_OF_HOUR_STAGGER_MS : void 0;
}
/** Resolves the effective stagger for a cron schedule, preferring explicit values over defaults. */
function resolveCronStaggerMs(schedule) {
	const explicit = normalizeCronStaggerMs(schedule.staggerMs);
	if (explicit !== void 0) return explicit;
	const expr = schedule.expr;
	return resolveDefaultCronStaggerMs(typeof expr === "string" ? expr : "") ?? 0;
}
//#endregion
export { parseAbsoluteTimeMs as i, resolveCronStaggerMs as n, resolveDefaultCronStaggerMs as r, normalizeCronStaggerMs as t };
