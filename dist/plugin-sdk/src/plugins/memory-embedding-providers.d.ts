import type { EmbeddingInput } from "../../packages/memory-host-sdk/src/engine-embeddings.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretInput } from "../config/types.secrets.js";
/** Chunk submitted to memory embedding batch processing. */
export type MemoryEmbeddingBatchChunk = {
    text: string;
    embeddingInput?: EmbeddingInput;
};
/** Options for batch memory embedding work. */
export type MemoryEmbeddingBatchOptions = {
    agentId: string;
    chunks: MemoryEmbeddingBatchChunk[];
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    debug: (message: string, data?: Record<string, unknown>) => void;
};
/** Per-call options for memory embedding providers. */
export type MemoryEmbeddingProviderCallOptions = {
    signal?: AbortSignal;
};
/** Runtime metadata returned with memory embedding providers. */
export type MemoryEmbeddingProviderRuntime = {
    id: string;
    cacheKeyData?: Record<string, unknown>;
    /** Prior persisted model/cache identities that are equivalent to the current identity. */
    indexIdentityAliases?: Array<{
        model: string;
        cacheKeyData: Record<string, unknown>;
    }>;
    inlineQueryTimeoutMs?: number;
    inlineBatchTimeoutMs?: number;
    sourceWideBatchEmbed?: boolean;
    batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};
/** Provider-owned canonical identity and exact aliases for persisted indexes. */
export type MemoryEmbeddingProviderIndexIdentity = {
    model: string;
    cacheKeyData: Record<string, unknown>;
    aliases?: Array<{
        model: string;
        cacheKeyData: Record<string, unknown>;
    }>;
};
/** Created memory embedding provider instance. */
export type MemoryEmbeddingProvider = {
    id: string;
    model: string;
    maxInputTokens?: number;
    embedQuery: (text: string, options?: MemoryEmbeddingProviderCallOptions) => Promise<number[]>;
    embedBatch: (texts: string[], options?: MemoryEmbeddingProviderCallOptions) => Promise<number[][]>;
    embedBatchInputs?: (inputs: EmbeddingInput[], options?: MemoryEmbeddingProviderCallOptions) => Promise<number[][]>;
    close?: () => Promise<void> | void;
};
/** Options passed to memory embedding provider adapters. */
export type MemoryEmbeddingProviderCreateOptions = {
    config: OpenClawConfig;
    agentDir?: string;
    provider?: string;
    fallback?: string;
    remote?: {
        baseUrl?: string;
        apiKey?: SecretInput;
        headers?: Record<string, string>;
    };
    model: string;
    inputType?: string;
    queryInputType?: string;
    documentInputType?: string;
    local?: {
        modelPath?: string;
        modelCacheDir?: string;
        contextSize?: number | "auto";
    };
    outputDimensionality?: number;
    taskType?: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" | "SEMANTIC_SIMILARITY" | "CLASSIFICATION" | "CLUSTERING" | "QUESTION_ANSWERING" | "FACT_VERIFICATION";
};
/** Result returned by a memory embedding provider adapter. */
export type MemoryEmbeddingProviderCreateResult = {
    provider: MemoryEmbeddingProvider | null;
    runtime?: MemoryEmbeddingProviderRuntime;
};
/** Adapter contract for registered memory embedding providers. */
export type MemoryEmbeddingProviderAdapter = {
    id: string;
    defaultModel?: string;
    transport?: "local" | "remote";
    authProviderId?: string;
    autoSelectPriority?: number;
    allowExplicitWhenConfiguredAuto?: boolean;
    supportsMultimodalEmbeddings?: (params: {
        model: string;
    }) => boolean;
    resolveIndexIdentity?: (options: MemoryEmbeddingProviderCreateOptions) => MemoryEmbeddingProviderIndexIdentity;
    create: (options: MemoryEmbeddingProviderCreateOptions) => Promise<MemoryEmbeddingProviderCreateResult>;
    formatSetupError?: (err: unknown) => string;
    shouldContinueAutoSelection?: (err: unknown) => boolean;
};
/** Registered memory embedding provider with optional owning plugin metadata. */
export type RegisteredMemoryEmbeddingProvider = {
    adapter: MemoryEmbeddingProviderAdapter;
    ownerPluginId?: string;
};
/** Registers a memory embedding provider adapter for the current process. */
export declare function registerMemoryEmbeddingProvider(adapter: MemoryEmbeddingProviderAdapter, options?: {
    ownerPluginId?: string;
}): void;
/** Returns a registered memory embedding provider entry. */
export declare function getRegisteredMemoryEmbeddingProvider(id: string): RegisteredMemoryEmbeddingProvider | undefined;
/** Returns only the memory embedding provider adapter. */
export declare function getMemoryEmbeddingProvider(id: string): MemoryEmbeddingProviderAdapter | undefined;
/** Lists registered memory embedding provider entries. */
export declare function listRegisteredMemoryEmbeddingProviders(): RegisteredMemoryEmbeddingProvider[];
/** Lists registered memory embedding provider adapters. */
export declare function listMemoryEmbeddingProviders(): MemoryEmbeddingProviderAdapter[];
/** Replaces registered memory embedding providers with adapter-only state. */
export declare function restoreMemoryEmbeddingProviders(adapters: MemoryEmbeddingProviderAdapter[]): void;
/** Replaces registered memory embedding providers while preserving metadata. */
export declare function restoreRegisteredMemoryEmbeddingProviders(entries: RegisteredMemoryEmbeddingProvider[]): void;
/** Clears registered memory embedding providers. */
export declare function clearMemoryEmbeddingProviders(): void;
