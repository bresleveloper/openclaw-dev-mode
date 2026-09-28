import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as parseIsoCalendarTimeMs, n as getUtcCalendarTimeMs, r as isOffsetlessIsoDateTime } from "./parse-BCmwDHWH.mjs";
//#region src/infra/format-time/parse-offsetless-zoned-datetime.ts
function parseOffsetlessIsoDateTimeInTimeZone(raw, timeZone) {
	const naiveMs = isOffsetlessIsoDateTime(raw) ? parseIsoCalendarTimeMs(raw) : void 0;
	if (naiveMs === void 0) return null;
	try {
		const formatter = new Intl.DateTimeFormat("en-US", {
			timeZone,
			era: "short",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hourCycle: "h23"
		});
		const matchingInstants = [
			-864e5,
			0,
			864e5
		].map((shiftMs) => asDateTimestampMs(naiveMs + shiftMs)).filter((probeMs) => probeMs !== void 0).map((probeMs) => naiveMs - (getZonedWallTimeMs(probeMs, formatter) - probeMs)).filter((candidateMs) => asDateTimestampMs(candidateMs) !== void 0 && getZonedWallTimeMs(candidateMs, formatter) === naiveMs);
		return matchingInstants.length > 0 ? new Date(Math.min(...matchingInstants)).toISOString() : null;
	} catch {
		return null;
	}
}
function getZonedWallTimeMs(utcMs, formatter) {
	const utcDate = new Date(utcMs);
	const parts = formatter.formatToParts(utcDate);
	const getNumericPart = (type) => {
		const part = parts.find((candidate) => candidate.type === type);
		return Number.parseInt(part?.value ?? "0", 10);
	};
	const eraYear = getNumericPart("year");
	const year = parts.find((part) => part.type === "era")?.value === "BC" ? 1 - eraYear : eraYear;
	return getUtcCalendarTimeMs(year, getNumericPart("month") - 1, getNumericPart("day"), getNumericPart("hour"), getNumericPart("minute"), getNumericPart("second"), utcDate.getUTCMilliseconds());
}
//#endregion
export { parseOffsetlessIsoDateTimeInTimeZone as t };
