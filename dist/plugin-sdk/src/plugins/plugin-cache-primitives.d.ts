import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Result shape for cache lookups that need to distinguish a miss from cached `undefined`. */
export type PluginLruCacheResult<T> = {
    hit: true;
    value: T;
} | {
    hit: false;
};
/** Small process-local LRU cache used for stable plugin metadata and loader artifacts. */
export declare class PluginLruCache<T> {
    #private;
    constructor(defaultMaxEntries: number);
    get maxEntries(): number;
    get size(): number;
    setMaxEntriesForTest(value?: number): void;
    clear(): void;
    /** Returns a cached value and refreshes its recency when present. */
    get(cacheKey: string): T | undefined;
    /** Returns a hit/miss result and promotes hits to the newest LRU position. */
    getResult(cacheKey: string): PluginLruCacheResult<T>;
    /** Stores a value as the newest entry and evicts oldest entries past capacity. */
    set(cacheKey: string, value: T): void;
}
/** Runtime cache partitioned by config object identity so request-scoped configs do not collide. */
export type ConfigScopedRuntimeCache<T> = WeakMap<OpenClawConfig, Map<string, T>>;
/** Promise loader that coalesces concurrent loads per config object and for the default scope. */
export type ConfigScopedPromiseLoader<T> = {
    load(config?: OpenClawConfig): Promise<T>;
    clear(): void;
};
/** Resolves a config-scoped cached value; calls without config intentionally bypass caching. */
export declare function resolveConfigScopedRuntimeCacheValue<T>(params: {
    cache: ConfigScopedRuntimeCache<T>;
    config?: OpenClawConfig;
    key: string;
    load: () => T;
}): T;
/** Encodes structured cache dimensions without separator ambiguity. */
export declare function createPluginCacheKey(parts: readonly unknown[]): string;
/** Creates a config-scoped promise cache that drops rejected loads so callers can retry. */
export declare function createConfigScopedPromiseLoader<T>(load: (config?: OpenClawConfig) => T | Promise<T>): ConfigScopedPromiseLoader<T>;
