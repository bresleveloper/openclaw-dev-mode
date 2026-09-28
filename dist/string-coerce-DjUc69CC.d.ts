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
type FastMode = boolean | "auto";
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
export { normalizeBoundedOptionalString as a, normalizeNullableString as c, normalizeOptionalStringifiedId as d, normalizeStringifiedEntries as f, readStringValue as g, readNonEmptyStringPreservingWhitespace as h, lowercasePreservingWhitespace as i, normalizeOptionalLowercaseString as l, readNonBlankString as m, hasNonEmptyString as n, normalizeFastMode as o, normalizeStringifiedOptionalString as p, localeLowercasePreservingWhitespace as r, normalizeLowercaseStringOrEmpty as s, FastMode as t, normalizeOptionalString as u };