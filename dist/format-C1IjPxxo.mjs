import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
//#region packages/normalization-core/src/format.ts
const BYTE_SIZE_UNITS = [
	"byte",
	"kilo",
	"mega",
	"giga",
	"tera"
];
const BYTE_SIZE_STYLES = {
	iec: {
		base: 1024,
		labels: [
			"B",
			"KiB",
			"MiB",
			"GiB",
			"TiB"
		]
	},
	"legacy-binary": {
		base: 1024,
		labels: [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		]
	}
};
/** Buckets an absolute duration while preserving nested display rounding at unit boundaries. */
function bucketRelativeTimeMs(durationMs) {
	const seconds = Math.round(durationMs / 1e3);
	if (seconds < 60) return {
		value: seconds,
		unit: "second"
	};
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return {
		value: minutes,
		unit: "minute"
	};
	const hours = Math.round(minutes / 60);
	return hours < 48 ? {
		value: hours,
		unit: "hour"
	} : {
		value: Math.round(hours / 24),
		unit: "day"
	};
}
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
function formatByteSize(bytes, options) {
	const { base, labels } = BYTE_SIZE_STYLES[options.style];
	const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
	let unitIndex = 0;
	let value = bytes;
	while (value >= base && unitIndex < maxUnitIndex) {
		value /= base;
		unitIndex += 1;
	}
	const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
	const label = expectDefined(labels[unitIndex], "byte-size label");
	const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
	if (fractionDigits === null) return `${value}${options.separator}${label}`;
	if (options.floorUnits?.includes(unit)) value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
	return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
/** Formats token units while callers retain input validation and whole-token rounding. */
function formatCompactTokenCount(tokens, options = {}) {
	if (tokens < 1e3) return String(Math.round(tokens));
	const trim = (value) => options.trimTrailingZero ? value.replace(/\.0$/, "") : value;
	if (options.maxUnit === "billion" && tokens >= 1e9) return `${trim((tokens / 1e9).toFixed(1))}B`;
	if (tokens < 1e6) {
		const thousands = (tokens / 1e3).toFixed(options.thousandsPrecision ?? 1);
		if (Number(thousands) < 1e3) return `${trim(thousands)}${options.thousandsSuffix ?? "k"}`;
	}
	return `${trim((tokens / 1e6).toFixed(1))}${options.millionsSuffix ?? "m"}`;
}
//#endregion
export { formatByteSize as n, formatCompactTokenCount as r, bucketRelativeTimeMs as t };
