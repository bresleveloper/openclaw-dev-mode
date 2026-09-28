import { a as durationUnitMs } from "./format-duration-CeDWULoS.mjs";
//#region src/infra/format-time/format-duration-exact.ts
function resolveExactDurationParts(ms, showWeeks = false) {
	if (ms == null || !Number.isFinite(ms) || ms < 0) return;
	let remaining = BigInt(Math.round(ms));
	const parts = [];
	for (const unit of [
		"week",
		"day",
		"hour",
		"minute",
		"second",
		"millisecond"
	]) {
		const value = remaining / BigInt(durationUnitMs[unit]);
		if (value > 0n && (unit !== "week" || showWeeks)) {
			parts.push({
				value,
				unit
			});
			remaining %= BigInt(durationUnitMs[unit]);
		}
	}
	return parts.length ? parts : [{
		value: 0,
		unit: "millisecond"
	}];
}
function formatExactDuration(ms, fallback = "n/a", showWeeks = false) {
	return resolveExactDurationParts(ms, showWeeks)?.map(({ value, unit }) => `${value}${unit === "millisecond" ? "ms" : unit[0]}`).join(" ") ?? fallback;
}
//#endregion
export { formatExactDuration as t };
