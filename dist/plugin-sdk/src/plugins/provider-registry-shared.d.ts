/** Normalizes provider ids used by capability-provider registries. */
export declare function normalizeCapabilityProviderId(providerId: string | undefined): string | undefined;
/** Builds canonical and alias lookup maps for capability providers. */
export declare function buildCapabilityProviderMaps<T extends {
    id: string;
    aliases?: readonly string[];
}>(providers: readonly T[], normalizeId?: (providerId: string | undefined) => string | undefined): {
    canonical: Map<string, T>;
    aliases: Map<string, T>;
};
