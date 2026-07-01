/** Parse a positive millisecond timeout, returning undefined for absent or invalid input. */
export declare function parseTimeoutMs(raw: unknown): number | undefined;
/** Parse a positive timeout or return the supplied fallback for missing values. */
export declare function parseTimeoutMsWithFallback(raw: unknown, fallbackMs: number, options?: {
    invalidType?: "fallback" | "error";
}): number;
