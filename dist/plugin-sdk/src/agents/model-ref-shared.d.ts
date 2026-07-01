export { modelKey } from "../shared/model-key.js";
export type ProviderModelIdNormalizationOptions = {
    allowManifestNormalization?: boolean;
    manifestPlugins?: readonly ManifestModelIdNormalizationRecord[];
};
type ManifestModelIdNormalizationProvider = {
    aliases?: Record<string, string>;
    stripPrefixes?: string[];
    prefixWhenBare?: string;
    prefixWhenBareAfterAliasStartsWith?: {
        modelPrefix: string;
        prefix: string;
    }[];
};
type ManifestModelIdNormalizationRecord = {
    modelIdNormalization?: {
        providers?: Record<string, ManifestModelIdNormalizationProvider>;
    };
};
/** Normalize a static provider model ID with built-in and optional manifest policy. */
export declare function normalizeStaticProviderModelId(provider: string, model: string, options?: ProviderModelIdNormalizationOptions): string;
/** Normalize a configured catalog model ID for comparisons against provider catalogs. */
export declare function normalizeConfiguredProviderCatalogModelId(provider: string, model: string, options?: ProviderModelIdNormalizationOptions): string;
/** Resolve an allowlist entry to a canonical provider/model key. */
export declare function resolveStaticAllowlistModelKey(raw: string, defaultProvider: string): string | null;
/** Preserve literal provider/model refs that already include a provider prefix twice. */
export declare function formatLiteralProviderPrefixedModelRef(provider: string, modelRef: string): string;
