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
/** Rejects only empty or non-string values while preserving whitespace. */
function readNonEmptyStringPreservingWhitespace(value) {
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
/** Stringifies primitive ids/flags before applying optional string normalization. */
function normalizeStringifiedOptionalString(value) {
	if (typeof value === "string") return normalizeOptionalString(value);
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return normalizeOptionalString(String(value));
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
/** Type guard for strings that remain non-empty after trimming. */
function hasNonEmptyString(value) {
	return normalizeOptionalString(value) !== void 0;
}
//#endregion
export { normalizeOptionalString as a, readStringValue as c, normalizeOptionalLowercaseString as i, normalizeLowercaseStringOrEmpty as n, normalizeStringifiedOptionalString as o, normalizeNullableString as r, readNonEmptyStringPreservingWhitespace as s, hasNonEmptyString as t };
