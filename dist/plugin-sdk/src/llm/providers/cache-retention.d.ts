import type { CacheRetention } from "../types.js";
/**
 * Resolve cache retention preference.
 * Defaults to "short" and uses OPENCLAW_CACHE_RETENTION for backward compatibility.
 */
export declare function resolveCacheRetention(cacheRetention?: CacheRetention): CacheRetention;
