/** Normalize optional strings, returning undefined for non-strings or empty values. */
export declare function normalizeOptionalString(value: unknown): string | undefined;
/** Return unique trimmed strings while preserving first-seen order. */
export declare function uniqueTrimmedStrings(values: readonly unknown[]): string[];
