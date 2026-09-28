import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
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
	return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
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
/** Normalizes entries, removes duplicates, and returns sorted output. */
function normalizeSortedUniqueStringEntries(values) {
	return sortUniqueStrings(normalizeStringEntries(values ? [...values] : void 0));
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
/** Parses either array entries or comma-separated string entries into trimmed values. */
function normalizeCsvOrLooseStringList(value) {
	if (Array.isArray(value)) return normalizeStringEntries(value);
	if (typeof value === "string") return value.split(",").map((entry) => entry.trim()).filter(Boolean);
	return [];
}
function normalizeSlugInput(raw) {
	return (normalizeOptionalLowercaseString(raw) ?? "").normalize("NFC");
}
/** Normalizes user-facing names into permissive lowercase slugs that may keep #/@/._+. */
function normalizeHyphenSlug(raw) {
	const trimmed = normalizeSlugInput(raw);
	if (!trimmed) return "";
	return trimmed.replace(/\s+/g, "-").replace(/[^\p{L}\p{M}\p{N}#@._+-]+/gu, "-").replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}
/** Normalizes @/#-prefixed channel names into strict lowercase hyphen slugs without the prefix. */
function normalizeAtHashSlug(raw) {
	const trimmed = normalizeSlugInput(raw);
	if (!trimmed) return "";
	return trimmed.replace(/^[@#]+/, "").replace(/[\s_]+/g, "-").replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
//#endregion
export { normalizeUniqueTrimmedStringList as _, normalizeCsvOrLooseStringList as a, uniqueValues as b, normalizeSingleOrTrimmedStringList as c, normalizeStringEntries as d, normalizeStringEntriesLower as f, normalizeUniqueStringEntriesLower as g, normalizeUniqueStringEntries as h, normalizeAtHashSlug as i, normalizeSortedUniqueStringEntries as l, normalizeUniqueSingleOrTrimmedStringList as m, filterStringEntries as n, normalizeHyphenSlug as o, normalizeTrimmedStringList as p, normalizeArrayBackedTrimmedStringList as r, normalizeOptionalTrimmedStringList as s, containsAsciiControlCharacter as t, normalizeSortedUniqueTrimmedStringList as u, sortUniqueStrings as v, uniqueStrings as y };
