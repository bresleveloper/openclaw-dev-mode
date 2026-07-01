import type { OpenClawConfig } from "../config/types.openclaw.js";
type EmbeddingProviderCapabilityKey = "embeddingProviders" | "memoryEmbeddingProviders";
type RegisteredAdapterEntry<TAdapter> = {
    adapter: TAdapter;
};
/** Builds lookup ids for embedding providers, including configured API aliases. */
export declare function resolveRuntimeEmbeddingProviderLookupIds(params: {
    id: string;
    cfg?: OpenClawConfig;
    resolveConfiguredProviderId: (id: string, cfg?: OpenClawConfig) => string | undefined;
}): string[];
/** Lists registered and plugin-contributed embedding provider adapters for a capability key. */
export declare function listRuntimeEmbeddingProviderAdapters<TAdapter extends {
    id: string;
}>(params: {
    key: EmbeddingProviderCapabilityKey;
    cfg?: OpenClawConfig;
    registered: TAdapter[];
}): TAdapter[];
/** Resolves one embedding provider adapter from registered providers before plugin capabilities. */
export declare function getRuntimeEmbeddingProviderAdapter<TAdapter extends {
    id: string;
}>(params: {
    key: EmbeddingProviderCapabilityKey;
    cfg?: OpenClawConfig;
    lookupIds: string[];
    getRegisteredProvider: (id: string) => RegisteredAdapterEntry<TAdapter> | undefined;
}): TAdapter | undefined;
export {};
