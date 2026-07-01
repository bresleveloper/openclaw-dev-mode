import { resolveNonNegativeIntegerOption } from "./numeric-options.js";
/** Small in-memory TTL/LRU-style cache for replay and duplicate suppression. */
export type DedupeCache = {
    /** Returns true for a recent duplicate; records the key when it was not present. */
    check: (key: string | undefined | null, now?: number) => boolean;
    /** Returns true for a recent duplicate without refreshing or recording the key. */
    peek: (key: string | undefined | null, now?: number) => boolean;
    delete: (key: string | undefined | null) => void;
    clear: () => void;
    size: () => number;
};
/** Dedupe cache bounds; ttlMs <= 0 disables expiry, maxSize <= 0 disables storage. */
export type DedupeCacheOptions = {
    ttlMs: number;
    maxSize: number;
};
/** @deprecated Use resolveNonNegativeIntegerOption for new internal numeric option normalization. */
export { resolveNonNegativeIntegerOption as resolveDedupeNonNegativeInteger };
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
export declare function createDedupeCache(options: DedupeCacheOptions): DedupeCache;
/** Resolves a process-global dedupe cache for hot paths that can load this module twice. */
export declare function resolveGlobalDedupeCache(key: symbol, options: DedupeCacheOptions): DedupeCache;
