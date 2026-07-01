/** Manifest-defined normalization rules for one provider. */
export type ManifestModelIdNormalizationProvider = {
    aliases?: Record<string, string>;
    stripPrefixes?: string[];
    prefixWhenBare?: string;
    prefixWhenBareAfterAliasStartsWith?: {
        modelPrefix: string;
        prefix: string;
    }[];
};
/** Manifest fragment that can define provider model-id normalization policies. */
export type ManifestModelIdNormalizationRecord = {
    modelIdNormalization?: {
        providers?: Record<string, ManifestModelIdNormalizationProvider>;
    };
};
/** Collect provider model-id normalization policies from plugin manifests. */
export declare function collectManifestModelIdNormalizationPolicies(plugins: readonly ManifestModelIdNormalizationRecord[]): Map<string, ManifestModelIdNormalizationProvider>;
/** Replace the process-local manifest normalization policy snapshot. */
export declare function setCurrentManifestModelIdNormalizationRecords(plugins: readonly ManifestModelIdNormalizationRecord[] | undefined): void;
/** Return the current process-local manifest normalization policy snapshot. */
export declare function getCurrentManifestModelIdNormalizationPolicies(): ReadonlyMap<string, ManifestModelIdNormalizationProvider> | undefined;
/** Strip a duplicated self-provider prefix from a model id. */
export declare function stripSelfProviderModelPrefix(provider: string, model: string): string;
/** Apply manifest normalization policies for one provider/model id. */
export declare function normalizeProviderModelIdWithPolicies(params: {
    provider: string;
    policies: ReadonlyMap<string, ManifestModelIdNormalizationProvider>;
    context: {
        modelId: string;
    };
}): string | undefined;
/** Apply built-in provider-specific model id normalization rules. */
export declare function normalizeBuiltInProviderModelId(provider: string, model: string): string;
/** Apply manifest policies and built-in normalization to a static provider/model id. */
export declare function normalizeStaticProviderModelIdWithPolicies(provider: string, model: string, policies?: ReadonlyMap<string, ManifestModelIdNormalizationProvider>): string;
/** Normalize a configured provider/model catalog reference using current policies. */
export declare function normalizeConfiguredProviderCatalogModelId(provider: string, model: string, policies?: ReadonlyMap<string, ManifestModelIdNormalizationProvider> | undefined): string;
/** Normalize embedded Google model aliases inside provider/model catalog refs. */
export declare function normalizeConfiguredProviderCatalogModelRef(providerModel: string): string;
