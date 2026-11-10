import { C as parseStrictNonNegativeInteger, c as asFiniteNumberInRange } from "./number-coercion-CkhMiRw8.mjs";
//#region packages/ai/src/internal/retry-after.ts
const HTTP_DATE_MONTH_INDEX = new Map([
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
].map((month, index) => [month, index]));
const HTTP_DATE_SHORT_WEEKDAY_INDEX = new Map([
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
].map((weekday, index) => [weekday, index]));
const IMF_FIXDATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
const OBSOLETE_RFC850_DATE_RE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
const OBSOLETE_ASCTIME_DATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}| \d) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/;
const MS_PER_SECOND = 1e3;
new Map([
	["milliseconds millisecond msecs msec ms", 1],
	["seconds second secs sec s", MS_PER_SECOND],
	["minutes minute mins min m", 60 * MS_PER_SECOND],
	["hours hour hrs hr h", 3600 * MS_PER_SECOND],
	["days day d", 86400 * MS_PER_SECOND]
].flatMap(([aliases, milliseconds]) => aliases.split(" ").map((alias) => [alias, milliseconds])));
/** Round leap seconds forward for Retry-After so an unrepresentable instant cannot retry early. */
function parseRetryAfterHttpDateMs(value, nowMs = Date.now()) {
	return parseHttpDateInstant(value, nowMs)?.timestampMs;
}
/** Parse all three HTTP-date forms while retaining leap-second ordering. */
function parseHttpDateInstant(value, nowMs = Date.now()) {
	let fields = (IMF_FIXDATE_RE.exec(value) ?? OBSOLETE_RFC850_DATE_RE.exec(value))?.slice(1);
	if (!fields) {
		const asctimeDate = OBSOLETE_ASCTIME_DATE_RE.exec(value);
		if (!asctimeDate) return;
		const [, weekday, month, day, hours, minutes, seconds, year] = asctimeDate;
		fields = [
			weekday,
			day,
			month,
			year,
			hours,
			minutes,
			seconds
		];
	}
	const [weekday, day, month, year, hours, minutes, seconds] = fields;
	const components = {
		weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get((weekday ?? "").slice(0, 3)),
		year: Number.parseInt(year ?? "", 10),
		month: HTTP_DATE_MONTH_INDEX.get(month ?? ""),
		day: Number.parseInt(day ?? "", 10),
		hours: Number.parseInt(hours ?? "", 10),
		minutes: Number.parseInt(minutes ?? "", 10),
		seconds: Number.parseInt(seconds ?? "", 10)
	};
	if (year?.length === 2) {
		const now = new Date(nowMs);
		if (Number.isNaN(now.getTime())) return;
		components.year += Math.floor(now.getUTCFullYear() / 100) * 100;
		const candidate = parseHttpDateCalendarMs(components);
		if (candidate === void 0) return;
		if (candidate > Date.UTC(now.getUTCFullYear() + 50, now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())) components.year -= 100;
	}
	return parseHttpDateComponents(components);
}
function parseHttpDateComponents(components) {
	const timestamp = parseHttpDateCalendarMs(components);
	if (timestamp === void 0) return;
	const leapSecond = components.seconds === 60;
	const weekdayTimestamp = leapSecond ? timestamp - 1e3 : timestamp;
	if (new Date(weekdayTimestamp).getUTCDay() !== components.weekday) return;
	return {
		timestampMs: timestamp,
		leapSecond
	};
}
function parseHttpDateCalendarMs(components) {
	const { year, month, day, hours, minutes, seconds } = components;
	if (month === void 0 || !Number.isInteger(year) || year < 1900 || !Number.isInteger(day) || day < 1 || day > 31 || !Number.isInteger(hours) || hours < 0 || hours > 23 || !Number.isInteger(minutes) || minutes < 0 || minutes > 59 || !Number.isInteger(seconds) || seconds < 0 || seconds > 60) return;
	const calendarSecond = Math.min(seconds, 59);
	const timestamp = Date.UTC(year, month, day, hours, minutes, calendarSecond);
	const parsedDate = new Date(timestamp);
	if (parsedDate.getUTCFullYear() !== year || parsedDate.getUTCMonth() !== month || parsedDate.getUTCDate() !== day || parsedDate.getUTCHours() !== hours || parsedDate.getUTCMinutes() !== minutes || parsedDate.getUTCSeconds() !== calendarSecond) return;
	return seconds === 60 ? timestamp + 1e3 : timestamp;
}
//#endregion
//#region src/infra/retry-after.ts
const RETRY_AFTER_HEADER_DELAY_RE = /^\d+$/;
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
/** Parses an RFC Retry-After header as delay seconds or any valid HTTP-date form. */
function parseRetryAfterHeaderSeconds(value, now = Date.now()) {
	if (!value) return;
	const trimmed = value.trim();
	if (RETRY_AFTER_HEADER_DELAY_RE.test(trimmed)) return asFiniteNumberInRange(parseStrictNonNegativeInteger(trimmed), {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
	if (!Number.isFinite(now)) return;
	const retryAt = parseRetryAfterHttpDateMs(trimmed, now);
	return retryAt === void 0 ? void 0 : Math.max(0, (retryAt - now) / 1e3);
}
//#endregion
export { parseRetryAfterHeaderSeconds as t };
