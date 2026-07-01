import { type SsrFPolicy } from "../infra/net/ssrf.js";
import type { EmbeddingProvider, EmbeddingProviderAdapter, EmbeddingProviderCreateOptions } from "./embedding-provider-types.js";
/** Provider id for OpenAI-compatible remote embedding servers. */
export declare const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
/** Normalized OpenAI-compatible embedding client configuration. */
export type OpenAICompatibleEmbeddingClient = {
    baseUrl: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    model: string;
    dimensions?: number;
    inputType?: string;
    queryInputType?: string;
    documentInputType?: string;
};
/** Creates a normalized OpenAI-compatible embedding client from runtime config. */
export declare function createOpenAICompatibleEmbeddingClient(options: EmbeddingProviderCreateOptions): Promise<OpenAICompatibleEmbeddingClient>;
/** Creates an OpenAI-compatible embedding provider and its backing client. */
export declare function createOpenAICompatibleEmbeddingProvider(options: EmbeddingProviderCreateOptions): Promise<{
    provider: EmbeddingProvider;
    client: OpenAICompatibleEmbeddingClient;
}>;
/** Embedding provider adapter for OpenAI-compatible remote embedding APIs. */
export declare const openAICompatibleEmbeddingProviderAdapter: EmbeddingProviderAdapter;
