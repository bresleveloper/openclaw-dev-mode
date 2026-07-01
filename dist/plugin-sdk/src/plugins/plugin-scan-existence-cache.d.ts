/** Runs `fn` with a scan-scoped existence cache active. Sync-only. */
export declare function withPluginScanExistenceCache<T>(fn: () => T): T;
/** `fs.existsSync` memoized for the active scan pass, if any.
 *
 * Outside `withPluginScanExistenceCache` this is plain `fs.existsSync`, so
 * callers that are not part of a scan pay no caching cost or staleness. */
export declare function pluginScanExistsSync(targetPath: string): boolean;
