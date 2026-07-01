import type { EmbeddingProviderOptions } from "./embeddings.types.js";
import type { SsrFPolicy } from "./ssrf-policy.js";
/** Provider id used for remote embedding auth and config lookup. */
export type RemoteEmbeddingProviderId = string;
/** Resolve base URL, bearer headers, header overrides, and SSRF policy for remote embeddings. */
export declare function resolveRemoteEmbeddingBearerClient(params: {
    provider: RemoteEmbeddingProviderId;
    options: EmbeddingProviderOptions;
    defaultBaseUrl: string;
}): Promise<{
    baseUrl: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
}>;
