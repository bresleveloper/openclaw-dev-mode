import { type PluginCandidate, type PluginDiscoveryResult } from "./discovery.js";
import type { LoadInstalledPluginIndexParams } from "./installed-plugin-index-types.js";
import { type PluginManifestRegistry } from "./manifest-registry.js";
/** Resolves discovery candidates and manifest registry for installed plugin index loading. */
export declare function resolveInstalledPluginIndexRegistry(params: LoadInstalledPluginIndexParams): {
    registry: PluginManifestRegistry;
    candidates: readonly PluginCandidate[];
    discovery?: PluginDiscoveryResult;
};
