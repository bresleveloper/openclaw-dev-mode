import type { ProviderConfig } from "./models-config.providers.secrets.js";
/** Existing provider config shape that may carry persisted secret/base URL fields. */
export type ExistingProviderConfig = ProviderConfig & {
    apiKey?: string;
    baseUrl?: string;
    api?: string;
};
/** Merges implicit provider models with explicit config while preserving explicit fields. */
export declare function mergeProviderModels(implicit: ProviderConfig, explicit: ProviderConfig): ProviderConfig;
/** Merges implicit and explicit provider config maps by provider id. */
export declare function mergeProviders(params: {
    implicit?: Record<string, ProviderConfig> | null;
    explicit?: Record<string, ProviderConfig> | null;
}): Record<string, ProviderConfig>;
/** Merges generated provider config with existing secrets safe to preserve. */
export declare function mergeWithExistingProviderSecrets(params: {
    nextProviders: Record<string, ProviderConfig>;
    existingProviders: Record<string, ExistingProviderConfig>;
    secretRefManagedProviders: ReadonlySet<string>;
}): Record<string, ProviderConfig>;
