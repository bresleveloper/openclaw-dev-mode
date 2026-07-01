import { type RemoteEmbeddingProviderId } from "./embeddings-remote-client.js";
import type { EmbeddingProvider, EmbeddingProviderOptions } from "./embeddings.types.js";
import type { SsrFPolicy } from "./ssrf-policy.js";
/** HTTP client details required by a remote embedding provider. */
export type RemoteEmbeddingClient = {
    baseUrl: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    fetchImpl?: typeof fetch;
    model: string;
};
/** Create an EmbeddingProvider backed by a remote embeddings endpoint. */
export declare function createRemoteEmbeddingProvider(params: {
    id: string;
    client: RemoteEmbeddingClient;
    errorPrefix: string;
    maxInputTokens?: number;
}): EmbeddingProvider;
/** Resolve a normalized remote embedding client from provider config and model options. */
export declare function resolveRemoteEmbeddingClient(params: {
    provider: RemoteEmbeddingProviderId;
    options: EmbeddingProviderOptions;
    defaultBaseUrl: string;
    normalizeModel: (model: string) => string;
}): Promise<RemoteEmbeddingClient>;
