import type { ModelProviderConfig } from "../config/types.js";
import type { ProviderCatalogContext, ProviderCatalogResult } from "./types.js";
/** Finds a provider catalog template entry by normalized provider and template id. */
export declare function findCatalogTemplate(params: {
    entries: ReadonlyArray<{
        provider: string;
        id: string;
    }>;
    providerId: string;
    templateIds: readonly string[];
}): {
    provider: string;
    id: string;
} | undefined;
/** Builds a provider catalog result for providers that share one API key. */
export declare function buildSingleProviderApiKeyCatalog(params: {
    ctx: ProviderCatalogContext;
    providerId: string;
    buildProvider: () => ModelProviderConfig | Promise<ModelProviderConfig>;
    allowExplicitBaseUrl?: boolean;
}): Promise<ProviderCatalogResult>;
/** Builds a multi-provider catalog result backed by one provider API key. */
export declare function buildPairedProviderApiKeyCatalog(params: {
    ctx: ProviderCatalogContext;
    providerId: string;
    buildProviders: () => Record<string, ModelProviderConfig> | Promise<Record<string, ModelProviderConfig>>;
}): Promise<ProviderCatalogResult>;
