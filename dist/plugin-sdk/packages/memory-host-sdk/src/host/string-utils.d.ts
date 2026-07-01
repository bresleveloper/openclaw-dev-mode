/** Normalize a non-empty string or return null. */
export declare function normalizeNullableString(value: unknown): string | null;
/** Normalize a non-empty string or return undefined. */
export declare function normalizeOptionalString(value: unknown): string | undefined;
/** Normalize a non-empty string to lowercase or return undefined. */
export declare function normalizeOptionalLowercaseString(value: unknown): string | undefined;
/** Normalize a value to lowercase text, defaulting to an empty string. */
export declare function normalizeLowercaseStringOrEmpty(value: unknown): string;
/** Normalize an array-like list of values into non-empty strings. */
export declare function normalizeStringEntries(values: ReadonlyArray<unknown>): string[];
/** Return unique strings preserving first-seen order. */
export declare function uniqueStrings(values: Iterable<string>): string[];
