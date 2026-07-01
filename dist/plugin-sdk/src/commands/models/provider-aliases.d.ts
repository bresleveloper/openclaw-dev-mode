import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../../plugins/plugin-metadata-snapshot.js";
type ProviderAliasSource = {
    cfg: OpenClawConfig;
    metadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry">;
};
/** Builds provider/ref canonicalizers from manifest model-catalog aliases. */
export declare function createModelCatalogProviderAliasCanonicalizer(params: ProviderAliasSource): {
    provider: (provider: string) => string;
    ref: <TRef extends {
        provider: string;
    }>(ref: TRef) => TRef;
};
/** Canonicalizes a provider id through manifest model-catalog aliases. */
export declare function canonicalizeModelCatalogProviderAlias(provider: string, params: ProviderAliasSource): string;
/** Canonicalizes the provider field on a model reference. */
export declare function canonicalizeModelCatalogProviderRef<TRef extends {
    provider: string;
}>(ref: TRef, params: ProviderAliasSource): TRef;
export {};
