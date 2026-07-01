import type { ModelProviderConfig } from "../config/types.js";
import type { ProviderCatalogResult } from "./types.js";
/** Projection of a provider catalog result into provider config entries. */
export type ProviderCatalogResultProjection = {
    kind: "provider";
    provider: ModelProviderConfig;
} | {
    kind: "providers";
    providers: Array<[string, ModelProviderConfig]>;
} | {
    kind: "empty";
};
/** Copies provider config data out of a provider catalog result. */
export declare function copyProviderCatalogResultProjection(result: ProviderCatalogResult): ProviderCatalogResultProjection;
/** Copies provider catalog result entries, using providerId for single-provider results. */
export declare function copyProviderCatalogResultEntries(params: {
    providerId: string;
    result: ProviderCatalogResult;
}): Array<[string, ModelProviderConfig]>;
/** Copies model definitions from provider catalog provider config. */
export declare function copyProviderCatalogModels(providerConfig: ModelProviderConfig): ModelProviderConfig["models"];
/** Copies the supported provider config fields from a provider catalog result. */
export declare function copyProviderCatalogProviderConfig(providerConfig: unknown): ModelProviderConfig | undefined;
