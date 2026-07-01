/** Resolves a cache TTL from an env override, falling back unless the override is exact. */
export declare function resolveCacheTtlMs(params: {
    envValue: string | undefined;
    defaultTtlMs: number;
}): number;
/** Returns whether a TTL keeps cache reads and writes active. */
export declare function isCacheEnabled(ttlMs: number): boolean;
type CacheTtlResolver = number | (() => number);
type CachePruneIntervalResolver = number | ((ttlMs: number) => number);
type ExpiringMapCache<TKey, TValue> = {
    get: (key: TKey) => TValue | undefined;
    set: (key: TKey, value: TValue) => void;
    delete: (key: TKey) => void;
    clear: () => void;
    keys: () => TKey[];
    size: () => number;
    pruneExpired: () => void;
};
/** Creates a small synchronous map cache with dynamic TTLs and explicit pruning hooks. */
export declare function createExpiringMapCache<TKey, TValue>(options: {
    ttlMs: CacheTtlResolver;
    pruneIntervalMs?: CachePruneIntervalResolver;
    clock?: () => number;
}): ExpiringMapCache<TKey, TValue>;
type FileStatSnapshot = {
    mtimeMs: number;
    sizeBytes: number;
};
/** Captures the file attributes used by cache invalidation without exposing fs.Stats. */
export declare function getFileStatSnapshot(filePath: string): FileStatSnapshot | undefined;
export {};
