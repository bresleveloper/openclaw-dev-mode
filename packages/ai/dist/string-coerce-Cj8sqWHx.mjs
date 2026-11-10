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
/** Parses loose boolean/fast-mode flags from strings or booleans. */
function normalizeFastMode(raw) {
	if (typeof raw === "boolean") return raw;
	const key = normalizeLowercaseStringOrEmpty(raw);
	if ([
		"off",
		"false",
		"no",
		"0",
		"disable",
		"disabled",
		"normal"
	].includes(key)) return false;
	if ([
		"on",
		"true",
		"yes",
		"1",
		"enable",
		"enabled",
		"fast"
	].includes(key)) return true;
	if (key === "ultrafast") return "ultrafast";
	if (["auto", "automatic"].includes(key)) return "auto";
}
/** Type guard for strings that remain non-empty after trimming. */
function hasNonEmptyString(value) {
	return normalizeOptionalString(value) !== void 0;
}
//#endregion
export { normalizeOptionalLowercaseString as a, readNonEmptyStringPreservingWhitespace as c, normalizeNullableString as i, readStringValue as l, normalizeFastMode as n, normalizeOptionalString as o, normalizeLowercaseStringOrEmpty as r, normalizeStringifiedOptionalString as s, hasNonEmptyString as t };
