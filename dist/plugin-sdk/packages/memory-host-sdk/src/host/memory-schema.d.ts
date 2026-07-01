import type { DatabaseSync } from "node:sqlite";
export declare const MEMORY_INDEX_META_TABLE = "memory_index_meta";
export declare const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
export declare const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
export declare const MEMORY_EMBEDDING_CACHE_TABLE = "memory_embedding_cache";
export declare const MEMORY_INDEX_STATE_TABLE = "memory_index_state";
export declare const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
export declare const MEMORY_INDEX_VECTOR_TABLE = "memory_index_chunks_vec";
/** Ensure canonical memory index tables and the optional FTS table exist. */
export declare function ensureMemoryIndexSchema(params: {
    db: DatabaseSync;
    /** @deprecated Omit to use the canonical memory cache table. */
    embeddingCacheTable?: string;
    cacheEnabled: boolean;
    /** @deprecated Omit to use the canonical memory FTS table. */
    ftsTable?: string;
    ftsEnabled: boolean;
    ftsTokenizer?: "unicode61" | "trigram";
}): {
    ftsAvailable: boolean;
    ftsError?: string;
};
