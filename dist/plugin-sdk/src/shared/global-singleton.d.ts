/**
 * Process-local singleton helpers for registries, caches, and SDK-visible shared state.
 * Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
 */
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
export declare function resolveGlobalSingleton<T>(key: symbol, create: () => T): T;
/** Resolves a process-local Map singleton for keyed caches backed by globalThis. */
export declare function resolveGlobalMap<TKey, TValue>(key: symbol): Map<TKey, TValue>;
