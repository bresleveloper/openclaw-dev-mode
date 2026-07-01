import type { EmbeddingProvider } from "./embeddings.js";
/** Resolve the effective embedding input limit for a provider. */
export declare function resolveEmbeddingMaxInputTokens(provider: EmbeddingProvider): number;
