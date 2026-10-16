import { y as normalizeOptionalString } from "./number-coercion-CmpLVzZ6.mjs";
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
/** Returns a fresh array of unique strings in UTF-16 code-unit order. */
function sortUniqueStrings(values) {
	return uniqueStrings(values).sort();
}
/** Normalizes entries, removes duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntries(values) {
	return uniqueStrings(normalizeStringEntries(values ? [...values] : void 0));
}
/** Normalizes array-backed string lists and rejects non-array input as empty. */
function normalizeTrimmedStringList(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const normalized = normalizeOptionalString(entry);
		return normalized ? [normalized] : [];
	});
}
/** Normalizes an array-backed string list and removes duplicates. */
function normalizeUniqueTrimmedStringList(value) {
	return uniqueStrings(normalizeTrimmedStringList(value));
}
/** Normalizes an array-backed string list, removes duplicates, and sorts it. */
function normalizeSortedUniqueTrimmedStringList(value) {
	return sortUniqueStrings(normalizeTrimmedStringList(value));
}
/** Returns undefined instead of an empty normalized array-backed string list. */
function normalizeOptionalTrimmedStringList(value) {
	const normalized = normalizeTrimmedStringList(value);
	return normalized.length > 0 ? normalized : void 0;
}
/** Returns undefined for non-arrays but preserves an empty array for explicit arrays. */
function normalizeArrayBackedTrimmedStringList(value) {
	if (!Array.isArray(value)) return;
	return normalizeTrimmedStringList(value);
}
/** Normalizes either a single string-like value or an array-backed string list. */
function normalizeSingleOrTrimmedStringList(value) {
	if (Array.isArray(value)) return normalizeTrimmedStringList(value);
	const normalized = normalizeOptionalString(value);
	return normalized ? [normalized] : [];
}
/** Normalizes single-or-array string input and removes duplicates. */
function normalizeUniqueSingleOrTrimmedStringList(value) {
	return uniqueStrings(normalizeSingleOrTrimmedStringList(value));
}
//#endregion
export { normalizeTrimmedStringList as a, normalizeUniqueTrimmedStringList as c, normalizeStringEntries as i, sortUniqueStrings as l, normalizeOptionalTrimmedStringList as n, normalizeUniqueSingleOrTrimmedStringList as o, normalizeSortedUniqueTrimmedStringList as r, normalizeUniqueStringEntries as s, normalizeArrayBackedTrimmedStringList as t, uniqueStrings as u };
