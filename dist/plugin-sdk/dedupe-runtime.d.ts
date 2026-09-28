import { Po as OpenKeyedStoreOptions, Qr as resolveGlobalDedupeCache, Zr as createDedupeCache } from "../agent-harness-runtime-CWL0fcg5.js";
import "../kysely-sync-j49J-6_6.js";
import { DatabaseSync } from "node:sqlite";
import { Selectable } from "kysely";
//#region src/plugin-sdk/dedupe-runtime.d.ts
type PersistentDedupeStore<TRecord> = {
  register(key: string, value: TRecord, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  lookup(key: string): Promise<TRecord | undefined>;
};
/** Dual-layer presence cache: process-memory dedupe plus best-effort persistent state. */
export type PersistentDedupeCache<TRecord> = {
  /** Memory-only presence check without refreshing recency. */
  peek(key: string): boolean;
  /** Memory-first presence check; falls back to persistence and re-primes memory on a hit. */
  lookup(key: string): Promise<boolean>;
  /** Records presence in memory and best-effort persistence. Never rejects. */
  register(key: string, record: TRecord, opts?: {
    at?: number;
  }): Promise<void>;
  /** Clears memory and re-enables a persistent layer disabled by an earlier failure. */
  clearForTest(): void;
};
/**
 * Creates a channel-family presence cache backed by a global in-memory dedupe layer
 * plus a lazily opened plugin keyed store. Persistence is best effort: the first
 * open/read/write failure disables the persistent layer for the process so message
 * handling never breaks on state errors, matching the shipped channel-cache contract.
 */
export declare function createPersistentDedupeCache<TRecord>(params: {
  /** Global symbol key so the memory layer stays shared across bundled chunks. */
  globalKey: symbol;
  ttlMs: number;
  maxSize: number;
  persistent: {
    namespace: string;
    maxEntries: number;
    /** Usually `() => runtime?.state.openKeyedStore(options)`; undefined skips persistence. */
    openStore: (options: OpenKeyedStoreOptions) => PersistentDedupeStore<TRecord> | undefined;
    logError?: (error: unknown) => void;
    /** Memory re-prime timestamp after a persistent hit; defaults to now. */
    readTimestamp?: (record: TRecord) => number | undefined;
  };
}): PersistentDedupeCache<TRecord>;
//#endregion
export { createDedupeCache, resolveGlobalDedupeCache };