/** Error thrown when one plugin registry cache key attempts nested loading. */
export declare class PluginLoadReentryError extends Error {
    readonly cacheKey: string;
    constructor(cacheKey: string);
}
/** Small registry cache with reentry detection and per-key warning memory. */
export declare class PluginLoaderCacheState<T> {
    #private;
    constructor(defaultMaxEntries: number);
    get maxEntries(): number;
    setMaxEntriesForTest(value?: number): void;
    clear(): void;
    clearCachedRegistries(): void;
    get(cacheKey: string): T | undefined;
    set(cacheKey: string, state: T): void;
    isLoadInFlight(cacheKey: string): boolean;
    beginLoad(cacheKey: string): void;
    finishLoad(cacheKey: string): void;
    hasOpenAllowlistWarning(cacheKey: string): boolean;
    recordOpenAllowlistWarning(cacheKey: string): void;
}
