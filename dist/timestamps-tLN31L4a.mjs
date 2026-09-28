//#region src/logging/timestamps.ts
const validTimeZoneCache = /* @__PURE__ */ new Map();
const timestampFormatterCache = /* @__PURE__ */ new Map();
let hostTimeZone;
let lastTimestampParts;
function isValidTimeZone(tz) {
	const cached = validTimeZoneCache.get(tz);
	if (cached !== void 0) return cached;
	let valid;
	try {
		new Intl.DateTimeFormat("en", { timeZone: tz }).format();
		valid = true;
	} catch {
		valid = false;
	}
	validTimeZoneCache.set(tz, valid);
	return valid;
}
function resolveEffectiveTimeZone(timeZone) {
	const explicit = timeZone ?? process.env.TZ;
	return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
	return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function formatDiagnosticFilenameTimestamp(date) {
	return date.toISOString().replace(/[:.]/g, "-");
}
function getTimestampParts(date, timeZone) {
	const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
	const second = Math.floor(date.getTime() / 1e3);
	if (lastTimestampParts?.second === second && lastTimestampParts.timeZone === effectiveTimeZone) return lastTimestampParts.parts;
	let fmt = timestampFormatterCache.get(effectiveTimeZone);
	if (!fmt) {
		fmt = new Intl.DateTimeFormat("en", {
			timeZone: effectiveTimeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			fractionalSecondDigits: 3,
			timeZoneName: "longOffset"
		});
		timestampFormatterCache.set(effectiveTimeZone, fmt);
	}
	const parts = {};
	for (const part of fmt.formatToParts(date)) parts[part.type] = part.value;
	lastTimestampParts = {
		second,
		timeZone: effectiveTimeZone,
		parts
	};
	return parts;
}
function formatTimestamp(date, options) {
	const style = options?.style ?? "medium";
	const parts = getTimestampParts(date, options?.timeZone);
	const offset = formatOffset(parts.timeZoneName ?? "GMT");
	const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
	switch (style) {
		case "short": return `${parts.hour}:${parts.minute}:${parts.second}${offset}`;
		case "medium": return `${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
		case "long": return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
	}
	throw new Error("Unsupported timestamp style");
}
//#endregion
export { formatTimestamp as n, formatDiagnosticFilenameTimestamp as t };
