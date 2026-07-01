/** Normalizes unknown system-run metadata to a trimmed non-empty string. */
export declare function normalizeNonEmptyString(value: unknown): string | null;
/** Coerces array entries to allow-list strings while rejecting non-array inputs. */
export declare function normalizeStringArray(value: unknown): string[];
