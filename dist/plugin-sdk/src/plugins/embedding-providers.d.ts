/** Registry for plugin-contributed embedding providers. */
import type { EmbeddingProviderAdapter, RegisteredEmbeddingProvider } from "./embedding-provider-types.js";
export type { EmbeddingInput, EmbeddingProvider, EmbeddingProviderAdapter, EmbeddingProviderCallOptions, EmbeddingProviderCreateOptions, EmbeddingProviderCreateResult, EmbeddingProviderIndexIdentity, EmbeddingProviderRuntime, RegisteredEmbeddingProvider, } from "./embedding-provider-types.js";
/** Registers an embedding provider adapter for plugin and built-in memory callers. */
export declare function registerEmbeddingProvider(adapter: EmbeddingProviderAdapter, options?: {
    ownerPluginId?: string;
}): void;
/** Looks up the registered embedding provider entry, including owner metadata. */
export declare function getRegisteredEmbeddingProvider(id: string): RegisteredEmbeddingProvider | undefined;
/** Returns only the embedding provider adapter for callers that do not need ownership metadata. */
export declare function getEmbeddingProvider(id: string): EmbeddingProviderAdapter | undefined;
/** Lists registered embedding providers with core defaults merged first. */
export declare function listRegisteredEmbeddingProviders(): RegisteredEmbeddingProvider[];
/** Lists embedding provider adapters without registration metadata. */
export declare function listEmbeddingProviders(): EmbeddingProviderAdapter[];
/** Replaces non-core embedding providers with adapter-only test/runtime state. */
export declare function restoreEmbeddingProviders(adapters: EmbeddingProviderAdapter[]): void;
/** Replaces non-core embedding providers while preserving registration metadata. */
export declare function restoreRegisteredEmbeddingProviders(entries: RegisteredEmbeddingProvider[]): void;
/** Clears non-core embedding providers from the process registry. */
export declare function clearEmbeddingProviders(): void;
