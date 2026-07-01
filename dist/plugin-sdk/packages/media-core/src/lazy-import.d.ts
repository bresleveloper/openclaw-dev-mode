/** Cached async loader used by runtime boundaries that should import on first use. */
export type LazyPromiseLoader<T> = {
    load(): Promise<T>;
    clear(): void;
};
/** Controls whether a failed first import stays cached or is retried later. */
export type LazyPromiseLoaderOptions = {
    cacheRejections?: boolean;
};
/** Creates a single-flight promise cache around a lazy import or other async loader. */
export declare function createLazyImportLoader<T>(load: () => Promise<T>, options?: LazyPromiseLoaderOptions): LazyPromiseLoader<T>;
