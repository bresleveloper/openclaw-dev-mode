/**
 * Parse an optional byte-size value from config.
 * Accepts non-negative numbers or strings like "2mb".
 */
export declare function parseNonNegativeByteSize(value: unknown): number | null;
/** Validates byte-size strings accepted by agent default byte-threshold config. */
export declare function isValidNonNegativeByteSizeString(value: string): boolean;
