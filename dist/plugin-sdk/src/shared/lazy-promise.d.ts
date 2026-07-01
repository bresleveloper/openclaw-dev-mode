/** Manual-control promise cache for lazy runtime resources. */
export type LazyPromiseLoader<T> = {
    /** Resolves the cached value, creating one load promise when needed. */
    load(): Promise<T>;
    /** Drops the cached promise so the next load starts fresh. */
    clear(): void;
};
/** Options for controlling lazy promise cache behavior. */
type LazyPromiseLoaderOptions = {
    /** Keep rejected promises cached instead of allowing the next caller to retry. */
    cacheRejections?: boolean;
};
/**
 * Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
 *
 * Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
 */
export declare function createLazyPromiseLoader<T>(load: () => T | Promise<T>, options?: LazyPromiseLoaderOptions): LazyPromiseLoader<T>;
/** Convenience wrapper for dynamic-import-shaped loaders. */
export declare function createLazyImportLoader<T>(load: () => Promise<T>, options?: LazyPromiseLoaderOptions): LazyPromiseLoader<T>;
export {};
