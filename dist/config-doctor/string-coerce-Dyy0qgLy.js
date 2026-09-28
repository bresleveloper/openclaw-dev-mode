//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
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
//#region packages/normalization-core/src/string-coerce.ts
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
export { asNullableRecord as a, isRecord as c, normalizeOptionalString as i, normalizeNullableString as n, asOptionalObjectRecord as o, normalizeOptionalLowercaseString as r, asOptionalRecord as s, normalizeLowercaseStringOrEmpty as t };
