/** Reads a value only when it is already a string, preserving whitespace. */
export declare function readStringValue(value: unknown): string | undefined;
/** Trims string input and returns null for non-strings or empty strings. */
export declare function normalizeNullableString(value: unknown): string | null;
/** Trims string input and returns undefined for non-strings or empty strings. */
export declare function normalizeOptionalString(value: unknown): string | undefined;
/** Stringifies primitive ids/flags before applying optional string normalization. */
export declare function normalizeStringifiedOptionalString(value: unknown): string | undefined;
/** Normalizes an optional array of primitive-ish values into non-empty strings. */
export declare function normalizeStringifiedEntries(values?: ReadonlyArray<unknown>): string[];
/** Lowercases a normalized optional string. */
export declare function normalizeOptionalLowercaseString(value: unknown): string | undefined;
/** Lowercases a normalized string or returns an empty string when absent. */
export declare function normalizeLowercaseStringOrEmpty(value: unknown): string;
export type FastMode = boolean | "auto";
/** Parses loose boolean/fast-mode flags from strings or booleans. */
export declare function normalizeFastMode(raw?: unknown): FastMode | undefined;
/** Lowercases text while intentionally preserving surrounding whitespace. */
export declare function lowercasePreservingWhitespace(value: string): string;
/** Locale-aware lowercase helper that still preserves surrounding whitespace. */
export declare function localeLowercasePreservingWhitespace(value: string): string;
/** Reads a string directly or from an object's `primary` field. */
export declare function resolvePrimaryStringValue(value: unknown): string | undefined;
/** Normalizes thread ids that may be numeric or string-backed. */
export declare function normalizeOptionalThreadValue(value: unknown): string | number | undefined;
/** Normalizes a thread/id value and stringifies finite numeric ids. */
export declare function normalizeOptionalStringifiedId(value: unknown): string | undefined;
/** Type guard for strings that remain non-empty after trimming. */
export declare function hasNonEmptyString(value: unknown): value is string;
