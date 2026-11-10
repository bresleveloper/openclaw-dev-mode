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
function ownDataValue(value, key) {
	return value && typeof value === "object" ? Object.getOwnPropertyDescriptor(value, key)?.value : void 0;
}
/** Reads only retry timing metadata, without invoking provider getters or serialization hooks. */
function parseRetryAfterHeadersSeconds(headers, nowMs = Date.now(), status) {
	if (!headers || typeof headers !== "object") return;
	try {
		let entries;
		try {
			entries = [
				"retry-after",
				"retry-after-ms",
				"x-ratelimit-remaining-tokens",
				"x-ratelimit-reset-tokens",
				"x-ratelimit-remaining-requests",
				"x-ratelimit-reset-requests",
				"x-ratelimit-remaining-project-tokens",
				"x-ratelimit-reset-project-tokens"
			].map((key) => [key, Headers.prototype.get.call(headers, key)]);
		} catch {
			entries = Object.getOwnPropertyNames(headers).flatMap((key) => {
				const name = key.toLowerCase();
				return name === "retry-after" || name === "retry-after-ms" || /^x-ratelimit-(?:remaining|reset)-(?:tokens|requests|project-tokens)$/.test(name) ? [[name, ownDataValue(headers, key)]] : [];
			});
		}
		let floor;
		for (const [key, value] of entries) {
			if (key.startsWith("x-ratelimit-")) continue;
			const text = typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
			const milliseconds = key === "retry-after-ms";
			const numeric = typeof value === "number" ? value >= 0 && (milliseconds || Number.isInteger(value) || value === Infinity) : (milliseconds ? /^\d+(?:\.\d+)?$/ : /^\d+$/).test(text);
			const number = typeof value === "number" ? value : Number(text);
			const retryAt = !numeric && !milliseconds ? parseRetryAfterHttpDateMs(text, nowMs) : void 0;
			const seconds = numeric ? Number.isFinite(number) && number <= Number.MAX_SAFE_INTEGER ? number / (milliseconds ? 1e3 : 1) : Infinity : retryAt === void 0 ? void 0 : Math.max(0, (retryAt - nowMs) / 1e3);
			if (seconds !== void 0) floor = Math.max(floor ?? 0, seconds);
		}
		if (status === 429) {
			const values = new Map(entries);
			for (const dimension of [
				"tokens",
				"requests",
				"project-tokens"
			]) {
				const remaining = values.get(`x-ratelimit-remaining-${dimension}`);
				const numericRemaining = typeof remaining === "number" ? remaining : typeof remaining === "string" && /^-?\d+(?:\.\d+)?$/.test(remaining.trim()) ? Number(remaining) : NaN;
				if (!Number.isFinite(numericRemaining) || numericRemaining > 0) continue;
				const reset = values.get(`x-ratelimit-reset-${dimension}`);
				const seconds = typeof reset === "string" ? parseQuotaResetSeconds(reset) : void 0;
				if (seconds !== void 0) floor = Math.max(floor ?? 0, seconds);
			}
		}
		return floor;
	} catch {
		return;
	}
}
function parseQuotaResetSeconds(value) {
	if (!/^(?:\d+(?:\.\d+)?(?:ms|s|m|h))+$/.test(value)) return;
	const scales = {
		ms: .001,
		s: 1,
		m: 60,
		h: 3600
	};
	let seconds = 0;
	for (const match of value.matchAll(/(\d+(?:\.\d+)?)(ms|s|m|h)/g)) {
		const scale = scales[match[2] ?? ""];
		if (scale === void 0) return;
		seconds += Number(match[1]) * scale;
	}
	return Number.isFinite(seconds) && seconds <= Number.MAX_SAFE_INTEGER ? seconds : Infinity;
}
/** SDK errors carry native response headers separately from their error body. */
function parseRetryAfterErrorSeconds(error, nowMs = Date.now()) {
	try {
		const status = ownDataValue(error, "status") ?? ownDataValue(error, "statusCode");
		const response = ownDataValue(error, "response");
		const responseStatus = ownDataValue(response, "status") ?? ownDataValue(response, "statusCode");
		const direct = parseRetryAfterHeadersSeconds(ownDataValue(error, "headers"), nowMs, typeof status === "number" ? status : void 0);
		const responseSeconds = parseRetryAfterHeadersSeconds(ownDataValue(response, "headers"), nowMs, typeof responseStatus === "number" ? responseStatus : typeof status === "number" ? status : void 0);
		return direct === void 0 && responseSeconds === void 0 ? void 0 : Math.max(direct ?? 0, responseSeconds ?? 0);
	} catch {
		return;
	}
}
function maxDefined(...values) {
	let floor;
	for (const value of values) if (value !== void 0) floor = Math.max(floor ?? 0, value);
	return floor;
}
/** Provider prose such as "Please try again in 6s", "retry in 32s" or "Retry-After: 7". */
const RETRY_AFTER_TEXT_RE = /\b(?:retry[- ]after\b\s*:?\s*(?:in\b\s*)?|(?:please\s+)?(?:try again|retry) in\s+)([^\r\n;]+)/i;
const RETRY_TEXT_NUMBER_RE = /^(\d+(?:\.\d+)?|Infinity)\s*([a-z]+)?\b/i;
const MS_PER_SECOND = 1e3;
const RETRY_TEXT_UNIT_MS = new Map([
	["milliseconds millisecond msecs msec ms", 1],
	["seconds second secs sec s", MS_PER_SECOND],
	["minutes minute mins min m", 60 * MS_PER_SECOND],
	["hours hour hrs hr h", 3600 * MS_PER_SECOND],
	["days day d", 86400 * MS_PER_SECOND]
].flatMap(([aliases, milliseconds]) => aliases.split(" ").map((alias) => [alias, milliseconds])));
/** Seconds named by a captured retry-text value: a number with an optional time unit, or an HTTP-date. */
function parseRetryAfterTextSeconds(valueText, nowMs = Date.now()) {
	const secondsMatch = RETRY_TEXT_NUMBER_RE.exec(valueText);
	if (secondsMatch?.[1]) {
		const value = /^infinity$/i.test(secondsMatch[1]) ? Infinity : Number(secondsMatch[1]);
		if (Number.isNaN(value) || value < 0) return;
		const unitMilliseconds = RETRY_TEXT_UNIT_MS.get(secondsMatch[2]?.toLowerCase() ?? "s");
		if (unitMilliseconds === void 0) return;
		return unitMilliseconds === 1 ? value / MS_PER_SECOND : value * (unitMilliseconds / MS_PER_SECOND);
	}
	const retryAtMs = parseRetryAfterHttpDateMs(valueText, nowMs);
	return retryAtMs === void 0 ? void 0 : Math.max(0, (retryAtMs - nowMs) / MS_PER_SECOND);
}
const GOOGLE_RETRY_DELAY_TEXT_RE = /"retryDelay"\s*:\s*"(\d+(?:\.\d{1,9})?)s"/g;
const GOOGLE_RETRY_DELAY_VALUE_RE = /^(\d+(?:\.\d{1,9})?)s$/;
const GOOGLE_RETRY_INFO_TYPE = "type.googleapis.com/google.rpc.RetryInfo";
const MAX_GOOGLE_ERROR_DETAILS = 16;
function googleRetryDelayTextSeconds(text) {
	let floor;
	for (const match of text.matchAll(GOOGLE_RETRY_DELAY_TEXT_RE)) floor = maxDefined(floor, Number(match[1]));
	return floor;
}
function googleStatusRetryDelaySeconds(status) {
	if (typeof status === "string") return googleRetryDelayTextSeconds(status);
	const details = ownDataValue(status, "details");
	if (!Array.isArray(details)) return;
	let floor;
	for (let index = 0; index < Math.min(details.length, MAX_GOOGLE_ERROR_DETAILS); index += 1) {
		const detail = ownDataValue(details, String(index));
		if (ownDataValue(detail, "@type") !== GOOGLE_RETRY_INFO_TYPE) continue;
		const delay = ownDataValue(detail, "retryDelay");
		const match = typeof delay === "string" ? GOOGLE_RETRY_DELAY_VALUE_RE.exec(delay) : null;
		floor = maxDefined(floor, match?.[1] ? Number(match[1]) : void 0);
	}
	return floor;
}
/**
* Reads google.rpc.RetryInfo delays from raw error text or a google.rpc.Status-shaped body
* in any key order, with a fixed number of descriptor reads and no getters. Pass the
* untruncated body: Gemini puts RetryInfo after its QuotaFailure details.
*/
function parseGoogleRetryDelaySeconds(value) {
	try {
		if (typeof value === "string") return googleRetryDelayTextSeconds(value);
		const response = ownDataValue(value, "response");
		return maxDefined(...[
			value,
			ownDataValue(value, "error"),
			ownDataValue(value, "message"),
			ownDataValue(value, "errorBody"),
			ownDataValue(value, "body"),
			ownDataValue(response, "body"),
			ownDataValue(response, "data")
		].flatMap((candidate) => [googleStatusRetryDelaySeconds(candidate), typeof candidate === "string" ? void 0 : googleStatusRetryDelaySeconds(ownDataValue(candidate, "error"))]));
	} catch {
		return;
	}
}
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
export { RETRY_AFTER_TEXT_RE, parseGoogleRetryDelaySeconds, parseHttpDateInstant, parseRetryAfterErrorSeconds, parseRetryAfterHeadersSeconds, parseRetryAfterHttpDateMs, parseRetryAfterTextSeconds };
