import { o as normalizeOptionalString } from "./string-coerce-CpcyRbc6.mjs";
// packages/normalization-core/src/string-normalization.ts
/** Retains runtime string entries from arrays without normalizing their contents. */
function filterStringEntries(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
}
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
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
export { uniqueValues as i, normalizeStringEntries as n, normalizeUniqueTrimmedStringList as r, filterStringEntries as t };
