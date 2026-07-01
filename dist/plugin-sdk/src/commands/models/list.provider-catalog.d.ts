import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { Model } from "../../llm/types.js";
import type { PluginMetadataSnapshot } from "../../plugins/plugin-metadata-snapshot.types.js";
import { type PluginRegistrySnapshot } from "../../plugins/plugin-registry.js";
/** Resolves plugin ids that can provide catalog rows for a provider filter. */
export declare function resolveProviderCatalogPluginIdsForFilter(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    providerFilter: string;
    registryIndex?: PluginRegistrySnapshot;
    metadataSnapshot?: PluginMetadataSnapshot;
}): Promise<string[] | undefined>;
/** Returns true when a provider filter can be satisfied by a static bundled catalog. */
export declare function hasProviderStaticCatalogForFilter(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    providerFilter: string;
    registryIndex?: PluginRegistrySnapshot;
    metadataSnapshot?: PluginMetadataSnapshot;
}): Promise<boolean>;
export declare function hasProviderRuntimeCatalogForFilter(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    providerFilter: string;
    registryIndex?: PluginRegistrySnapshot;
    metadataSnapshot?: PluginMetadataSnapshot;
}): Promise<boolean>;
/** Loads model rows from provider static/runtime catalog hooks for model-list output. */
export declare function loadProviderCatalogModelsForList(params: {
    cfg: OpenClawConfig;
    agentDir: string;
    env?: NodeJS.ProcessEnv;
    providerFilter?: string;
    staticOnly?: boolean;
    registryIndex?: PluginRegistrySnapshot;
    metadataSnapshot?: PluginMetadataSnapshot;
}): Promise<Model[]>;
