import type { InstalledPluginIndex } from "./installed-plugin-index.js";
export type InstalledPluginIndexScopeLookup = {
    addChannelContributionOwners: (target: Set<string>, ids: readonly string[]) => void;
    addDirectChannelOwners: (target: Set<string>, ids: readonly string[]) => void;
    addDirectProviderOwners: (target: Set<string>, ids: readonly string[]) => void;
    addProviderContributionOwners: (target: Set<string>, ids: readonly string[]) => void;
    addShorthandModelOwners: (target: Set<string>, modelIds: readonly string[]) => void;
    canResolveDirectProviderIds: (providerIds: readonly string[], scopePluginIds: ReadonlySet<string>) => boolean;
    hasChannelContributionOwners: (ids: readonly string[]) => boolean;
    hasCompleteConfigPathActivationMetadata: () => boolean;
    hasDirectChannelOwners: (ids: readonly string[]) => boolean;
    hasInstalledPluginIds: (ids: Iterable<string>) => boolean;
    hasProviderContributionOwners: (ids: readonly string[]) => boolean;
    hasShorthandModelOwners: (modelIds: readonly string[]) => boolean;
    normalizePluginId: (pluginId: string) => string;
};
export declare function createInstalledPluginIndexScopeLookup(index: InstalledPluginIndex): InstalledPluginIndexScopeLookup;
