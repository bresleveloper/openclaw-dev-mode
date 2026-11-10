import { F as normalizeOptionalString } from "./utils-c2rFzEZe.mjs";
//#region packages/normalization-core/src/string-normalization.ts
/** Detects C0 and DEL without rejecting C1 or other Unicode text. */
function containsAsciiControlCharacter(value) {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 31 || code === 127) return true;
	}
	return false;
}
/** Retains runtime string entries from arrays without normalizing their contents. */
function filterStringEntries(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
}
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}
/** Normalizes string entries and lowercases each retained value. */
function normalizeStringEntriesLower(list) {
	return normalizeStringEntries(list).map((entry) => entry.toLowerCase());
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
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntriesLower(values) {
	return uniqueStrings(normalizeStringEntriesLower(values ? [...values] : void 0));
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
export { normalizeSortedUniqueTrimmedStringList as a, normalizeUniqueSingleOrTrimmedStringList as c, normalizeUniqueTrimmedStringList as d, sortUniqueStrings as f, normalizeOptionalTrimmedStringList as i, normalizeUniqueStringEntries as l, filterStringEntries as n, normalizeStringEntries as o, uniqueStrings as p, normalizeArrayBackedTrimmedStringList as r, normalizeTrimmedStringList as s, containsAsciiControlCharacter as t, normalizeUniqueStringEntriesLower as u };
