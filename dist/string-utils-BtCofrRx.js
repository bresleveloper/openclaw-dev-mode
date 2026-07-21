//#region packages/memory-host-sdk/src/host/string-utils.ts
/** Normalize a non-empty string or return null. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Normalize a non-empty string or return undefined. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Normalize a non-empty string to lowercase or return undefined. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Normalize a value to lowercase text, defaulting to an empty string. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
/** Normalize an array-like list of values into non-empty strings. */
function normalizeStringEntries(values) {
	return values.map((value) => normalizeOptionalString(String(value)) ?? "").filter(Boolean);
}
/** Return unique strings preserving first-seen order. */
function uniqueStrings(values) {
	return [...new Set(values)];
}
//#endregion
export { uniqueStrings as a, normalizeStringEntries as i, normalizeOptionalLowercaseString as n, normalizeOptionalString as r, normalizeLowercaseStringOrEmpty as t };
