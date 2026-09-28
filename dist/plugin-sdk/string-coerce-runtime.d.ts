import { a as normalizeBoundedOptionalString, c as normalizeNullableString, d as normalizeOptionalStringifiedId, f as normalizeStringifiedEntries, g as readStringValue, h as readNonEmptyStringPreservingWhitespace, i as lowercasePreservingWhitespace, l as normalizeOptionalLowercaseString, m as readNonBlankString, n as hasNonEmptyString, o as normalizeFastMode, p as normalizeStringifiedOptionalString, r as localeLowercasePreservingWhitespace, s as normalizeLowercaseStringOrEmpty, u as normalizeOptionalString } from "../string-coerce-DjUc69CC.js";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord, l as readStringField, n as asNullableObjectRecord, o as asRecord, r as asNullableRecord, s as filterStringRecord, t as asNonArrayRecord } from "../record-coerce-Ckpz2G3R.js";
import { n as truncateUtf16Safe } from "../utf16-slice-C5Uh1nl-.js";
import { D as parseStrictInteger, E as parseStrictFiniteNumber, O as parseStrictNonNegativeInteger, T as parseFiniteNumber, _ as asDateTimestampMs, a as normalizeSingleOrTrimmedStringList, b as asPositiveSafeInteger, c as normalizeStringEntriesLower, d as normalizeUniqueTrimmedStringList, f as sortUniqueStrings, i as normalizeOptionalTrimmedStringList, k as parseStrictPositiveInteger, l as normalizeTrimmedStringList, m as uniqueValues, n as normalizeAtHashSlug, o as normalizeSortedUniqueTrimmedStringList, p as uniqueStrings, r as normalizeHyphenSlug, s as normalizeStringEntries, t as filterStringEntries, u as normalizeUniqueStringEntries, v as asFiniteNumber, x as asSafeIntegerInRange, y as asFiniteNumberInRange } from "../string-normalization-DRTeWkJT.js";
//#region src/utils/boolean.d.ts
/**
 * Shared boolean coercion helpers for config, env, and plugin SDK runtime inputs.
 *
 * `asBoolean` is intentionally strict; string parsing is opt-in through
 * `parseBooleanValue` so schema callers do not silently accept ambiguous text.
 */
/** Accepted string literals for boolean parsing beyond actual booleans. */
type BooleanParseOptions = {
  /** Lowercase string values that should parse as true. */
  truthy?: string[];
  /** Lowercase string values that should parse as false. */
  falsy?: string[];
};
/** Returns only real boolean values and leaves boolean-like strings for explicit parsing. */
export declare function asBoolean(value: unknown): boolean | undefined;
/** Parses booleans and configured string literals, returning undefined for ambiguous input. */
export declare function parseBooleanValue(value: unknown, options?: BooleanParseOptions): boolean | undefined;
//#endregion
//#region src/shared/string-sample.d.ts
/**
 * Shared string sampling for operator logs and SDK helpers that need bounded readable lists.
 * This intentionally formats for humans, not for machine parsing.
 */
/** Formats a bounded comma-separated sample of string entries with a hidden-count suffix. */
export declare function summarizeStringEntries(params: {
  /** Entries to summarize; nullish values are treated as an empty list. */
  entries?: ReadonlyArray<string> | null;
  /** Maximum visible entries; non-finite values use the default and values below one clamp to one. */
  limit?: number;
  /** Text returned when no entries are available. */
  emptyText?: string;
}): string;
//#endregion
export { asDateTimestampMs, asFiniteNumber, asFiniteNumberInRange, asNonArrayRecord, asNullableObjectRecord, asNullableRecord, asOptionalObjectRecord, asOptionalRecord, asPositiveSafeInteger, asRecord, asSafeIntegerInRange, filterStringEntries, filterStringRecord, hasNonEmptyString, isRecord, localeLowercasePreservingWhitespace, lowercasePreservingWhitespace, normalizeAtHashSlug, normalizeBoundedOptionalString, normalizeFastMode, normalizeHyphenSlug, normalizeLowercaseStringOrEmpty, normalizeNullableString, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalStringifiedId, normalizeOptionalTrimmedStringList, normalizeSingleOrTrimmedStringList, normalizeSortedUniqueTrimmedStringList, normalizeStringEntries, normalizeStringEntriesLower, normalizeStringifiedEntries, normalizeStringifiedOptionalString, normalizeTrimmedStringList, normalizeUniqueStringEntries, normalizeUniqueTrimmedStringList, parseFiniteNumber, parseStrictFiniteNumber, parseStrictInteger, parseStrictNonNegativeInteger, parseStrictPositiveInteger, readNonBlankString, readNonEmptyStringPreservingWhitespace, readStringField, readStringValue, sortUniqueStrings, truncateUtf16Safe, uniqueStrings, uniqueValues };