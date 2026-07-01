type CacheTtlContext = {
    provider?: string;
    modelId?: string;
};
/** Returns whether this provider/model pair supports cache-TTL session markers. */
export declare function isCacheTtlEligibleProvider(provider: string, modelId: string, modelApi?: string): boolean;
/** Reads the most recent cache-TTL marker that matches the optional provider/model context. */
export declare function readLastCacheTtlTimestamp(sessionManager: unknown, context?: CacheTtlContext): number | null;
export {};
