import type { EmbeddingProvider } from "./embeddings.js";
import type { MemoryChunk } from "./internal.js";
/**
 * Split text-only chunks to the provider's effective input limit.
 *
 * Structured multimodal chunks are preserved because only the provider can decide how to count
 * non-text parts.
 */
export declare function enforceEmbeddingMaxInputTokens(provider: EmbeddingProvider, chunks: MemoryChunk[], hardMaxInputTokens?: number): MemoryChunk[];
