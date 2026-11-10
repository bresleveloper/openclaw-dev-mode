//#region src/infra/map-size.d.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
export declare function pruneMapToMaxSize<K, V>(map: Map<K, V>, maxSize: number): void;
//#endregion
//#region src/infra/stale-while-revalidate-cache.d.ts
export declare function createStaleWhileRevalidateCache<T>(options: {
  maxEntries: number;
  maxPending?: number;
  ttlMs: number;
  cacheable?: (value: T) => boolean;
  errorTtlMs?: (error: unknown) => number;
  onBackgroundError?: (error: unknown) => void;
}): {
  read(key: string, load: (previous: T | undefined) => Promise<T>, readOptions?: {
    allowStale?: boolean;
    refresh?: boolean;
  }): Promise<{
    value: T;
    stale: boolean;
  }>;
  deleteValue(value: T): void;
  clear(): void;
};
//#endregion