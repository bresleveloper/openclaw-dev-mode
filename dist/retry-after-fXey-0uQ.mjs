import { C as parseStrictNonNegativeInteger, c as asFiniteNumberInRange } from "./number-coercion-CLj0HTDM.mjs";
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
const HTTP_DATE_LONG_WEEKDAY_INDEX = new Map([
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
].map((weekday, index) => [weekday, index]));
const IMF_FIXDATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
const OBSOLETE_RFC850_DATE_RE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/;
const OBSOLETE_ASCTIME_DATE_RE = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}| \d) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/;
/** Round leap seconds forward for Retry-After so an unrepresentable instant cannot retry early. */
function parseRetryAfterHttpDateMs(value, nowMs = Date.now()) {
	return parseHttpDateInstant(value, nowMs)?.timestampMs;
}
/** Parse all three HTTP-date forms while retaining leap-second ordering. */
function parseHttpDateInstant(value, nowMs = Date.now()) {
	const imfFixdate = IMF_FIXDATE_RE.exec(value);
	if (imfFixdate) return parseHttpDateComponents({
		weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get(imfFixdate[1] ?? ""),
		year: Number.parseInt(imfFixdate[4] ?? "", 10),
		month: HTTP_DATE_MONTH_INDEX.get(imfFixdate[3] ?? ""),
		day: Number.parseInt(imfFixdate[2] ?? "", 10),
		hours: Number.parseInt(imfFixdate[5] ?? "", 10),
		minutes: Number.parseInt(imfFixdate[6] ?? "", 10),
		seconds: Number.parseInt(imfFixdate[7] ?? "", 10)
	});
	const rfc850Date = OBSOLETE_RFC850_DATE_RE.exec(value);
	if (rfc850Date) {
		const now = new Date(nowMs);
		if (Number.isNaN(now.getTime())) return;
		const shortYear = Number.parseInt(rfc850Date[4] ?? "", 10);
		const candidateYear = Math.floor(now.getUTCFullYear() / 100) * 100 + shortYear;
		const components = {
			weekday: HTTP_DATE_LONG_WEEKDAY_INDEX.get(rfc850Date[1] ?? ""),
			month: HTTP_DATE_MONTH_INDEX.get(rfc850Date[3] ?? ""),
			day: Number.parseInt(rfc850Date[2] ?? "", 10),
			hours: Number.parseInt(rfc850Date[5] ?? "", 10),
			minutes: Number.parseInt(rfc850Date[6] ?? "", 10),
			seconds: Number.parseInt(rfc850Date[7] ?? "", 10)
		};
		const candidate = parseHttpDateCalendarMs({
			year: candidateYear,
			...components
		});
		if (candidate === void 0) return;
		return parseHttpDateComponents({
			year: candidate > Date.UTC(now.getUTCFullYear() + 50, now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()) ? candidateYear - 100 : candidateYear,
			...components
		});
	}
	const asctimeDate = OBSOLETE_ASCTIME_DATE_RE.exec(value);
	if (asctimeDate) return parseHttpDateComponents({
		weekday: HTTP_DATE_SHORT_WEEKDAY_INDEX.get(asctimeDate[1] ?? ""),
		year: Number.parseInt(asctimeDate[7] ?? "", 10),
		month: HTTP_DATE_MONTH_INDEX.get(asctimeDate[2] ?? ""),
		day: Number.parseInt((asctimeDate[3] ?? "").trim(), 10),
		hours: Number.parseInt(asctimeDate[4] ?? "", 10),
		minutes: Number.parseInt(asctimeDate[5] ?? "", 10),
		seconds: Number.parseInt(asctimeDate[6] ?? "", 10)
	});
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
