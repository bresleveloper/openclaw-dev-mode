import prettyMilliseconds from "pretty-ms";
//#region src/infra/format-time/format-duration-internal.ts
const durationUnitMs = {
	year: 31536e6,
	week: 6048e5,
	day: 864e5,
	hour: 36e5,
	minute: 6e4,
	second: 1e3,
	millisecond: 1
};
function resolveDurationParts(ms, unitCount, showYears = false) {
	const days = BigInt(Math.trunc(ms / durationUnitMs.day));
	const selected = [
		{
			value: showYears ? days / 365n : 0n,
			unit: "year"
		},
		{
			value: showYears ? days % 365n : days,
			unit: "day"
		},
		{
			value: Math.trunc(ms / durationUnitMs.hour % 24),
			unit: "hour"
		},
		{
			value: Math.trunc(ms / durationUnitMs.minute % 60),
			unit: "minute"
		},
		{
			value: Math.trunc(ms / durationUnitMs.second % 60),
			unit: "second"
		},
		{
			value: ms < 1e3 ? Math.trunc(ms) : 0,
			unit: "millisecond"
		}
	].filter(({ value }) => value !== 0 && value !== 0n).slice(0, unitCount);
	return selected.length ? selected : [{
		value: 0,
		unit: "millisecond"
	}];
}
function formatDurationParts(parts, verbose = false) {
	return parts.map(({ value, unit }) => prettyMilliseconds(BigInt(value) * BigInt(durationUnitMs[unit]), {
		hideYear: unit !== "year",
		unitCount: 1,
		verbose
	})).join(" ");
}
function resolveCompactDurationParts(ms, showYears = false) {
	if (ms == null || !Number.isFinite(ms) || ms <= 0) return;
	const roundedMs = Math.round(ms);
	return resolveDurationParts(roundedMs < 1e3 ? roundedMs : Math.round(ms / 1e3) * 1e3, 2, showYears);
}
function resolveSingleUnitDurationParts(ms) {
	let scale = durationUnitMs.millisecond;
	for (const unit of [
		"second",
		"minute",
		"hour",
		"day"
	]) {
		const nextScale = durationUnitMs[unit];
		if (Math.round(ms / scale) * scale < nextScale) break;
		scale = nextScale;
	}
	return resolveDurationParts(Math.round(ms / scale) * scale, 1);
}
/** Keep single-unit rounding identical for compact and verbose core displays. */
function formatSingleUnitDuration(ms, verbose = false) {
	return formatDurationParts(resolveSingleUnitDurationParts(ms), verbose);
}
//#endregion
//#region src/infra/format-time/format-duration.ts
function formatDurationSeconds(ms, options = {}) {
	if (!Number.isFinite(ms)) return "unknown";
	const decimals = options.decimals ?? 1;
	const unit = options.unit ?? "s";
	const trimmed = (Math.max(0, ms) / 1e3).toFixed(Math.max(0, decimals)).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
	return unit === "seconds" ? `${trimmed} seconds` : `${trimmed}s`;
}
/** Precise decimal-seconds output: "500ms" or "1.23s". Input is milliseconds. */
function formatDurationPrecise(ms, options = {}) {
	if (!Number.isFinite(ms)) return "unknown";
	const roundedMs = Math.max(0, Math.round(ms));
	if (roundedMs < 1e3) return prettyMilliseconds(roundedMs);
	return formatDurationSeconds(ms, {
		decimals: options.decimals ?? 2,
		unit: options.unit ?? "s"
	});
}
/**
* Compact compound duration: "500ms", "45s", "2m5s", "1h30m".
* With `spaced`: "45s", "2m 5s", "1h 30m".
* Omits trailing zero components: "1m" not "1m 0s", "2h" not "2h 0m".
* Returns undefined for null/undefined/non-finite/non-positive input.
*/
function formatDurationCompact(ms, options) {
	const parts = resolveCompactDurationParts(ms, options?.showYears);
	const formatted = parts && formatDurationParts(parts);
	return options?.spaced ? formatted : formatted?.replaceAll(" ", "");
}
/**
* Rounded single-unit duration for display: "500ms", "5s", "3m", "2h", "5d".
* Returns fallback string for null/undefined/non-finite input.
*/
function formatDurationHuman(ms, fallback = "n/a") {
	if (ms == null || !Number.isFinite(ms) || ms < 0) return fallback;
	return formatSingleUnitDuration(ms);
}
//#endregion
export { durationUnitMs as a, formatDurationSeconds as i, formatDurationHuman as n, formatSingleUnitDuration as o, formatDurationPrecise as r, formatDurationCompact as t };
