import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/**
 * Stable dimensions that partition channel-directory cache entries.
 */
export type DirectoryCacheKey = {
    channel: ChannelId;
    accountId?: string | null;
    kind: ChannelDirectoryEntryKind;
    source: "cache" | "live";
    signature?: string | null;
};
/**
 * Serializes channel-directory lookup dimensions into a cache key.
 */
export declare function buildDirectoryCacheKey(key: DirectoryCacheKey): string;
/**
 * Small TTL cache for channel directory lookups tied to a config object reference.
 */
export declare class DirectoryCache<T> {
    private readonly cache;
    private lastConfigRef;
    private readonly ttlMs;
    private readonly maxSize;
    constructor(ttlMs: number, maxSize?: number);
    /**
     * Returns a cached value after applying config, TTL, and capacity invalidation.
     */
    get(key: string, cfg: OpenClawConfig): T | undefined;
    /**
     * Stores a value and refreshes its recency for bounded-size eviction.
     */
    set(key: string, value: T, cfg: OpenClawConfig): void;
    /**
     * Clears matching entries without disturbing unrelated cached lookups.
     */
    clearMatching(match: (key: string) => boolean): void;
    /**
     * Drops all cached entries and optionally adopts the current config reference.
     */
    clear(cfg?: OpenClawConfig): void;
    private resetIfConfigChanged;
    private pruneExpired;
    private evictToMaxSize;
}
