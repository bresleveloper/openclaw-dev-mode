//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return Number.isFinite(value) ? value : void 0;
}
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
function asSafeIntegerInRange(value, range) {
	if (typeof value !== "number" || !Number.isSafeInteger(value)) return;
	if (range.min !== void 0 && value < range.min) return;
	if (range.max !== void 0 && value > range.max) return;
	return value;
}
/** Returns positive safe integers without string coercion. */
function asPositiveSafeInteger(value) {
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Largest timestamp accepted by JavaScript Date. */
const MAX_DATE_TIMESTAMP_MS = 864e13;
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
function resolveIntegerOption(value, fallback, range = {}) {
	const floored = Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback);
	const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
	return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
/** Resolves an integer option with a non-negative lower bound. */
function resolveNonNegativeIntegerOption(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 0 });
}
//#endregion
export { asSafeIntegerInRange as a, asPositiveSafeInteger as i, MAX_TIMER_TIMEOUT_MS as n, resolveNonNegativeIntegerOption as o, asFiniteNumber as r, resolveTimerTimeoutMs as s, MAX_DATE_TIMESTAMP_MS as t };
