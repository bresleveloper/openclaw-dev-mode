/** Runtime resolver for plugin-contributed embedding providers. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { listRegisteredEmbeddingProviders, type EmbeddingProviderAdapter } from "./embedding-providers.js";
export { listRegisteredEmbeddingProviders };
/** Lists embedding provider adapters registered directly with the process registry. */
export declare function listRegisteredEmbeddingProviderAdapters(): EmbeddingProviderAdapter[];
/** Lists embedding providers from registered adapters and plugin capabilities. */
export declare function listEmbeddingProviders(cfg?: OpenClawConfig): EmbeddingProviderAdapter[];
export declare function resolveConfiguredEmbeddingProviderId(providerId: string, cfg?: OpenClawConfig): string | undefined;
/** Resolves one embedding provider adapter by id, including configured API aliases. */
export declare function getEmbeddingProvider(id: string, cfg?: OpenClawConfig): EmbeddingProviderAdapter | undefined;
export type { EmbeddingInput, EmbeddingProvider, EmbeddingProviderAdapter, EmbeddingProviderCallOptions, EmbeddingProviderCreateOptions, EmbeddingProviderCreateResult, EmbeddingProviderRuntime, RegisteredEmbeddingProvider, } from "./embedding-providers.js";
