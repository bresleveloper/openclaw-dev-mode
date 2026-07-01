import type { InstalledPluginIndex } from "./installed-plugin-index.js";
import type { PluginManifestRegistry } from "./manifest-registry.js";
/** Inputs used to resolve aliases for installed plugin ids. */
export type PluginRegistryIdNormalizerOptions = {
    manifestRegistry?: PluginManifestRegistry;
    lookUpTable?: Pick<{
        manifestRegistry: PluginManifestRegistry;
    }, "manifestRegistry">;
};
/** Creates a normalizer that maps provider/channel/catalog aliases back to plugin ids. */
export declare function createPluginRegistryIdNormalizer(index: InstalledPluginIndex, options?: PluginRegistryIdNormalizerOptions): (pluginId: string) => string;
