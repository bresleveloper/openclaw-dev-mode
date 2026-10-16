//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Coerces object-like values to records, falling back to an empty record. */
function asRecord(value) {
	return asOptionalObjectRecord(value) ?? {};
}
/** Returns a non-array record or undefined. */
function asOptionalRecord(value) {
	return isRecord(value) ? value : void 0;
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord(value) ? value : null;
}
/** Returns any object-backed record, including arrays, or undefined. */
function asOptionalObjectRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
//#endregion
//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
/** Resolves a lifecycle-owned process-local Set singleton. */
function resolveGlobalSet(key, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Set(), (value) => value.clear(), lifecycle);
}
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Reads a value only when it is already a string, preserving whitespace. */
function readStringValue(value) {
	return typeof value === "string" ? value : void 0;
}
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Returns a finite number only when it is greater than zero. */
function asPositiveFiniteNumber(value) {
	const number = asFiniteNumber(value);
	return number && number > 0 ? number : void 0;
}
/** Returns a finite number only when it is zero or greater. */
function asNonNegativeFiniteNumber(value) {
	const number = asFiniteNumber(value);
	return number && number < 0 ? void 0 : number;
}
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
function asSafeIntegerInRange(value, range) {
	if (typeof value !== "number" || !Number.isSafeInteger(value)) return;
	if (range.min !== void 0 && value < range.min) return;
	if (range.max !== void 0 && value > range.max) return;
	return value;
}
/** Parses only safe integer numbers or base-10 integer strings. */
function parseStrictInteger(value) {
	if (typeof value === "number") return Number.isSafeInteger(value) ? value : void 0;
	const normalized = normalizeOptionalString(value);
	if (!normalized || !/^[+-]?\d+$/.test(normalized)) return;
	const parsed = Number(normalized);
	return Number.isSafeInteger(parsed) ? parsed : void 0;
}
/** Returns positive safe integers without string coercion. */
function asPositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Largest timestamp accepted by JavaScript Date. */
const MAX_DATE_TIMESTAMP_MS = 864e13;
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
/** Resolves a positive timer timeout or falls back through safe timer clamping. */
function resolvePositiveTimerTimeoutMs(valueMs, fallbackMs) {
	return clampPositiveTimerTimeoutMs(valueMs) ?? resolveTimerTimeoutMs(fallbackMs, 1);
}
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
function resolveIntegerOption(value, fallback, range = {}) {
	const candidate = asFiniteNumber(value) ?? fallback;
	const floored = Math.floor(candidate);
	const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
	return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
/** Resolves an optional integer option, returning undefined for non-finite input. */
function resolveOptionalIntegerOption(value, range = {}) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return resolveIntegerOption(value, value, range);
}
/** Resolves an integer option with a non-negative lower bound. */
function resolveNonNegativeIntegerOption(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 0 });
}
/** Parses strict positive integer values from numbers or strings. */
function parseStrictPositiveInteger(value) {
	const parsed = parseStrictInteger(value);
	return parsed !== void 0 && parsed > 0 ? parsed : void 0;
}
/** Parses strict non-negative integer values from numbers or strings. */
function parseStrictNonNegativeInteger(value) {
	const parsed = parseStrictInteger(value);
	return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
//#endregion
export { asNullableRecord as C, isRecord as D, asRecord as E, resolveGlobalSingleton as S, asOptionalRecord as T, normalizeNullableString as _, asPositiveFiniteNumber as a, readStringValue as b, clampPositiveTimerTimeoutMs as c, resolveIntegerOption as d, resolveNonNegativeIntegerOption as f, normalizeLowercaseStringOrEmpty as g, resolveTimerTimeoutMs as h, asNonNegativeFiniteNumber as i, parseStrictNonNegativeInteger as l, resolvePositiveTimerTimeoutMs as m, MAX_TIMER_TIMEOUT_MS as n, asPositiveSafeInteger as o, resolveOptionalIntegerOption as p, asFiniteNumber as r, asSafeIntegerInRange as s, MAX_DATE_TIMESTAMP_MS as t, parseStrictPositiveInteger as u, normalizeOptionalLowercaseString as v, asOptionalObjectRecord as w, resolveGlobalSet as x, normalizeOptionalString as y };
