/**
 * Public SDK helper for caching a lazily computed value behind a getter.
 */
type LazyValue<T> = T | (() => T);
/** Returns a getter that resolves the supplied value at most once. */
export declare function createCachedLazyValueGetter<T>(value: LazyValue<T>): () => T;
/** Returns a getter that resolves once and substitutes a fallback for nullish values. */
export declare function createCachedLazyValueGetter<T>(value: LazyValue<T | null | undefined>, fallback: T): () => T;
export {};
