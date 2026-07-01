/** Lists manifest contribution ids from installed plugin registry snapshots. */
import { type LoadPluginRegistryParams, type PluginRegistryContributionKey, type PluginRegistrySnapshot } from "./plugin-registry.js";
/** Parameters for listing manifest contribution ids from a registry snapshot. */
export type ListManifestContributionIdsParams = LoadPluginRegistryParams & {
    contribution: PluginRegistryContributionKey;
    index?: PluginRegistrySnapshot;
    includeDisabled?: boolean;
};
/** Lists ids contributed by plugin manifests for one contribution kind. */
export declare function listManifestContributionIds(params: ListManifestContributionIdsParams): readonly string[];
/** Lists channel ids contributed by plugin manifests. */
export declare function listManifestChannelContributionIds(params?: Omit<ListManifestContributionIdsParams, "contribution">): readonly string[];
/** Lists provider ids contributed by plugin manifests. */
export declare function listManifestProviderContributionIds(params?: Omit<ListManifestContributionIdsParams, "contribution">): readonly string[];
