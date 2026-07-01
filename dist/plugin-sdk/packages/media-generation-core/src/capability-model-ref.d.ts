/** Provider catalog entry shape used when resolving capability-scoped model references. */
export type CapabilityModelProviderCandidate = {
    id: string;
    aliases?: readonly string[];
    defaultModel?: string | null;
    models?: readonly string[];
};
/** Normalized provider/model reference selected for a media capability. */
export type CapabilityModelRef = {
    provider: string;
    model: string;
};
type ProviderIdNormalizer = (value: string) => string | undefined;
/** Finds a provider by id or alias using the caller's provider-id normalization rules. */
export declare function findCapabilityProviderById<T extends CapabilityModelProviderCandidate>(params: {
    providers: readonly T[];
    providerId?: string;
    normalizeProviderId?: ProviderIdNormalizer;
}): T | undefined;
/** Resolves a bare model name to the provider that advertises it for this capability. */
export declare function resolveCapabilityProviderModelOnlyRef(params: {
    providers: readonly CapabilityModelProviderCandidate[];
    raw?: string;
}): CapabilityModelRef | null;
/** Resolves provider/model refs first, then falls back to model-only catalog matching. */
export declare function resolveCapabilityModelRefForProviders(params: {
    providers: readonly CapabilityModelProviderCandidate[];
    raw?: string;
    parseModelRef: (raw: string | undefined) => CapabilityModelRef | null;
    normalizeProviderId?: ProviderIdNormalizer;
}): CapabilityModelRef | null;
export {};
