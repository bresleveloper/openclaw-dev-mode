import type { OpenClawConfig } from "../config/types.openclaw.js";
import { listRegisteredMemoryEmbeddingProviders, type MemoryEmbeddingProviderAdapter } from "./memory-embedding-providers.js";
export { listRegisteredMemoryEmbeddingProviders };
/** Lists registered memory embedding provider adapters without registry metadata. */
export declare function listRegisteredMemoryEmbeddingProviderAdapters(): MemoryEmbeddingProviderAdapter[];
/** Lists memory embedding providers from runtime config and registered adapters. */
export declare function listMemoryEmbeddingProviders(cfg?: OpenClawConfig): MemoryEmbeddingProviderAdapter[];
/** Resolves one memory embedding provider by id, alias, or configured API owner. */
export declare function getMemoryEmbeddingProvider(id: string, cfg?: OpenClawConfig): MemoryEmbeddingProviderAdapter | undefined;
