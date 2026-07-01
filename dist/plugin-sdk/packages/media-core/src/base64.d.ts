/** Estimates decoded bytes without allocating a cleaned copy of the base64 payload. */
export declare function estimateBase64DecodedBytes(base64: string): number;
/**
 * Normalizes and validates a base64 string, returning canonical no-whitespace
 * base64 only when the input has valid alphabet, padding, and length.
 */
export declare function canonicalizeBase64(base64: string): string | undefined;
