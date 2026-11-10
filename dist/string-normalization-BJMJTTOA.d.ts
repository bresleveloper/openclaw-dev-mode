//#region packages/normalization-core/src/string-coerce.d.ts
/** Reads a value only when it is already a string, preserving whitespace. */
declare function readStringValue(value: unknown): string | undefined;
/** Trims string input and returns null for non-strings or empty strings. */
declare function normalizeNullableString(value: unknown): string | null;
/** Trims string input and returns undefined for non-strings or empty strings. */
declare function normalizeOptionalString(value: unknown): string | undefined;
/** Trims bounded string input and rejects blank, non-string, or overlong values. */
declare function normalizeBoundedOptionalString(value: unknown, maxLength: number): string | undefined;
/** Requires non-blank string input while preserving its original whitespace. */
declare function readNonBlankString(value: unknown): string | undefined;
/** Rejects only empty or non-string values while preserving whitespace. */
declare function readNonEmptyStringPreservingWhitespace(value: unknown): string | undefined;
/** Stringifies primitive ids/flags before applying optional string normalization. */
declare function normalizeStringifiedOptionalString(value: unknown): string | undefined;
/** Normalizes an optional array of primitive-ish values into non-empty strings. */
declare function normalizeStringifiedEntries(values?: ReadonlyArray<unknown>): string[];
/** Lowercases a normalized optional string. */
declare function normalizeOptionalLowercaseString(value: unknown): string | undefined;
/** Lowercases a normalized string or returns an empty string when absent. */
declare function normalizeLowercaseStringOrEmpty(value: unknown): string;
type FastMode = boolean | "auto" | "ultrafast";
/** Parses loose boolean/fast-mode flags from strings or booleans. */
declare function normalizeFastMode(raw?: unknown): FastMode | undefined;
/** Lowercases text while intentionally preserving surrounding whitespace. */
declare function lowercasePreservingWhitespace(value: string): string;
/** Locale-aware lowercase helper that still preserves surrounding whitespace. */
declare function localeLowercasePreservingWhitespace(value: string): string;
/** Normalizes a thread/id value and stringifies finite numeric ids. */
declare function normalizeOptionalStringifiedId(value: unknown): string | undefined;
/** Type guard for strings that remain non-empty after trimming. */
declare function hasNonEmptyString(value: unknown): value is string;
//#endregion
//#region packages/normalization-core/src/number-coercion.d.ts
declare function asFiniteNumber(value: unknown): number | undefined;
/** Returns a finite number only when it satisfies the supplied inclusive/exclusive bounds. */
declare function asFiniteNumberInRange(value: unknown, range: {
  min?: number;
  max?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
}): number | undefined;
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
declare function asSafeIntegerInRange(value: unknown, range: {
  min?: number;
  max?: number;
}): number | undefined;
/** Parses finite numbers from number values or strict numeric string tokens. */
declare function parseFiniteNumber(value: unknown): number | undefined;
/** Parses only safe integer numbers or base-10 integer strings. */
declare function parseStrictInteger(value: unknown): number | undefined;
/** Parses only finite decimal/scientific string tokens, rejecting partial numbers. */
declare function parseStrictFiniteNumber(value: unknown): number | undefined;
declare function asPositiveSafeInteger(value: unknown): number | undefined;
declare function asDateTimestampMs(value: unknown): number | undefined;
declare function parseStrictPositiveInteger(value: unknown): number | undefined;
declare function parseStrictNonNegativeInteger(value: unknown): number | undefined;
//#endregion
//#region packages/normalization-core/src/string-normalization.d.ts
/** Retains runtime string entries from arrays without normalizing their contents. */
declare function filterStringEntries(value: unknown): string[];
/** Coerces entries to strings, trims them, and drops empty results. */
declare function normalizeStringEntries(list?: ReadonlyArray<unknown>): string[];
/** Normalizes string entries and lowercases each retained value. */
declare function normalizeStringEntriesLower(list?: ReadonlyArray<unknown>): string[];
/** Returns first-seen unique values while preserving insertion order. */
declare function uniqueValues<T>(values: Iterable<T>): T[];
/** Returns first-seen unique strings while preserving insertion order. */
declare function uniqueStrings(values: Iterable<string>): string[];
/** Returns a fresh array of unique strings in UTF-16 code-unit order. */
declare function sortUniqueStrings(values: Iterable<string>): string[];
/** Normalizes entries, removes duplicates, and preserves first-seen order. */
declare function normalizeUniqueStringEntries(values?: Iterable<unknown>): string[];
/** Normalizes array-backed string lists and rejects non-array input as empty. */
declare function normalizeTrimmedStringList(value: unknown): string[];
/** Normalizes an array-backed string list and removes duplicates. */
declare function normalizeUniqueTrimmedStringList(value: unknown): string[];
/** Normalizes an array-backed string list, removes duplicates, and sorts it. */
declare function normalizeSortedUniqueTrimmedStringList(value: unknown): string[];
/** Returns undefined instead of an empty normalized array-backed string list. */
declare function normalizeOptionalTrimmedStringList(value: unknown): string[] | undefined;
/** Normalizes either a single string-like value or an array-backed string list. */
declare function normalizeSingleOrTrimmedStringList(value: unknown): string[];
/** Normalizes user-facing names into permissive lowercase slugs that may keep #/@/._+. */
declare function normalizeHyphenSlug(raw?: string | null): string;
/** Normalizes @/#-prefixed channel names into strict lowercase hyphen slugs without the prefix. */
declare function normalizeAtHashSlug(raw?: string | null): string;
//#endregion
export { normalizeFastMode as A, readStringValue as B, parseStrictNonNegativeInteger as C, localeLowercasePreservingWhitespace as D, hasNonEmptyString as E, normalizeOptionalStringifiedId as F, normalizeStringifiedEntries as I, normalizeStringifiedOptionalString as L, normalizeNullableString as M, normalizeOptionalLowercaseString as N, lowercasePreservingWhitespace as O, normalizeOptionalString as P, readNonBlankString as R, parseStrictInteger as S, FastMode as T, asFiniteNumberInRange as _, normalizeSingleOrTrimmedStringList as a, parseFiniteNumber as b, normalizeStringEntriesLower as c, normalizeUniqueTrimmedStringList as d, sortUniqueStrings as f, asFiniteNumber as g, asDateTimestampMs as h, normalizeOptionalTrimmedStringList as i, normalizeLowercaseStringOrEmpty as j, normalizeBoundedOptionalString as k, normalizeTrimmedStringList as l, uniqueValues as m, normalizeAtHashSlug as n, normalizeSortedUniqueTrimmedStringList as o, uniqueStrings as p, normalizeHyphenSlug as r, normalizeStringEntries as s, filterStringEntries as t, normalizeUniqueStringEntries as u, asPositiveSafeInteger as v, parseStrictPositiveInteger as w, parseStrictFiniteNumber as x, asSafeIntegerInRange as y, readNonEmptyStringPreservingWhitespace as z };