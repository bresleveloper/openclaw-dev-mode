import { a as normalizeOptionalString } from "./string-coerce-CtgOVOSv.mjs";
//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Returns a finite number only when it is zero or greater. */
function asNonNegativeFiniteNumber(value) {
	const number = asFiniteNumber(value);
	return number && number < 0 ? void 0 : number;
}
/** Parses only safe integer numbers or base-10 integer strings. */
function parseStrictInteger(value) {
	if (typeof value === "number") return Number.isSafeInteger(value) ? value : void 0;
	const normalized = normalizeOptionalString(value);
	if (!normalized || !/^[+-]?\d+$/.test(normalized)) return;
	const parsed = Number(normalized);
	return Number.isSafeInteger(parsed) ? parsed : void 0;
}
/** Parses only finite decimal/scientific string tokens, rejecting partial numbers. */
function parseStrictFiniteNumber(value) {
	if (typeof value === "number") return asFiniteNumber(value);
	const normalized = normalizeOptionalString(value);
	if (!normalized || !/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(normalized)) return;
	return asFiniteNumber(Number(normalized));
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Clamps finite millisecond values into the Node-safe timer range. */
function clampTimerTimeoutMs(valueMs, minMs = 1) {
	const value = asFiniteNumber(valueMs);
	if (value === void 0) return;
	return Math.min(Math.max(Math.floor(value), Math.max(1, Math.floor(minMs))), MAX_TIMER_TIMEOUT_MS);
}
/** Clamps positive finite millisecond values into the Node-safe timer range. */
function clampPositiveTimerTimeoutMs(valueMs) {
	const value = asFiniteNumber(valueMs);
	if (value === void 0 || value <= 0) return;
	return clampTimerTimeoutMs(value);
}
/** Parses strict positive integer values from numbers or strings. */
function parseStrictPositiveInteger(value) {
	const parsed = parseStrictInteger(value);
	return parsed !== void 0 && parsed > 0 ? parsed : void 0;
}
//#endregion
export { parseStrictFiniteNumber as a, clampTimerTimeoutMs as i, asNonNegativeFiniteNumber as n, parseStrictPositiveInteger as o, clampPositiveTimerTimeoutMs as r, asFiniteNumber as t };
