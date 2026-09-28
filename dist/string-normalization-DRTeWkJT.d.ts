//#region packages/normalization-core/src/number-coercion.d.ts
/** Returns a number only when the input is already finite. */
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
/** Returns positive safe integers without string coercion. */
declare function asPositiveSafeInteger(value: unknown): number | undefined;
/** Conservative upper bound for Node timer delays. */
declare const MAX_TIMER_TIMEOUT_MS = 2147000000;
/** Timer bound expressed in whole seconds for env/config inputs. */
declare const MAX_TIMER_TIMEOUT_SECONDS: number;
/** Returns a Date-valid millisecond timestamp. */
declare function asDateTimestampMs(value: unknown): number | undefined;
/** Clamps finite millisecond values into the Node-safe timer range. */
declare function clampTimerTimeoutMs(valueMs: unknown, minMs?: number): number | undefined;
/** Converts finite positive seconds to Node-safe milliseconds. */
declare function finiteSecondsToTimerSafeMilliseconds(value: unknown, opts?: {
  floorSeconds?: boolean;
}): number | undefined;
/** Resolves an integer option with a non-negative lower bound. */
declare function resolveNonNegativeIntegerOption(value: unknown, fallback: number): number;
/** Parses strict positive integer values from numbers or strings. */
declare function parseStrictPositiveInteger(value: unknown): number | undefined;
/** Parses strict non-negative integer values from numbers or strings. */
declare function parseStrictNonNegativeInteger(value: unknown): number | undefined;
/** Converts strict positive seconds to safe millisecond counts. */
declare function positiveSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Converts strict non-negative seconds to safe millisecond counts. */
declare function nonNegativeSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Resolves an absolute expiration timestamp from a positive duration in seconds. */
declare function resolveExpiresAtMsFromDurationSeconds(value: unknown, opts?: {
  nowMs?: number;
  bufferMs?: number;
  minRemainingMs?: number;
}): number | undefined;
/** Resolves an absolute expiration timestamp from Unix epoch seconds. */
declare function resolveExpiresAtMsFromEpochSeconds(value: unknown, opts?: {
  bufferMs?: number;
  maxMs?: number;
}): number | undefined;
/** Resolves expiration input that may be relative seconds, epoch seconds, or epoch milliseconds. */
declare function resolveExpiresAtMsFromDurationOrEpoch(value: unknown, opts?: {
  nowMs?: number;
  relativeSecondsThreshold?: number;
  absoluteMillisecondsThreshold?: number;
}): number | undefined;
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
export { positiveSecondsToSafeMilliseconds as A, finiteSecondsToTimerSafeMilliseconds as C, parseStrictInteger as D, parseStrictFiniteNumber as E, resolveExpiresAtMsFromDurationSeconds as M, resolveExpiresAtMsFromEpochSeconds as N, parseStrictNonNegativeInteger as O, resolveNonNegativeIntegerOption as P, clampTimerTimeoutMs as S, parseFiniteNumber as T, asDateTimestampMs as _, normalizeSingleOrTrimmedStringList as a, asPositiveSafeInteger as b, normalizeStringEntriesLower as c, normalizeUniqueTrimmedStringList as d, sortUniqueStrings as f, MAX_TIMER_TIMEOUT_SECONDS as g, MAX_TIMER_TIMEOUT_MS as h, normalizeOptionalTrimmedStringList as i, resolveExpiresAtMsFromDurationOrEpoch as j, parseStrictPositiveInteger as k, normalizeTrimmedStringList as l, uniqueValues as m, normalizeAtHashSlug as n, normalizeSortedUniqueTrimmedStringList as o, uniqueStrings as p, normalizeHyphenSlug as r, normalizeStringEntries as s, filterStringEntries as t, normalizeUniqueStringEntries as u, asFiniteNumber as v, nonNegativeSecondsToSafeMilliseconds as w, asSafeIntegerInRange as x, asFiniteNumberInRange as y };