import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginDiscoveryResult } from "./discovery.js";
import type { PluginManifestConfigContracts } from "./manifest.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
export { collectPluginConfigContractMatches, type PluginConfigContractMatch, } from "./config-contract-matches.js";
export type PluginConfigContractMetadata = {
    /** Runtime origin that supplied the contract metadata. */
    origin: PluginOrigin;
    /** Manifest-declared config contract paths used by secret/security/config scanners. */
    configContracts: PluginManifestConfigContracts;
};
/** Resolve config contract metadata for plugin ids through the runtime registry and bundled fallback. */
export declare function resolvePluginConfigContractsById(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    fallbackToBundledMetadata?: boolean;
    fallbackToBundledMetadataForResolvedBundled?: boolean;
    fallbackBundledPluginIds?: readonly string[];
    pluginIds: readonly string[];
    discovery?: PluginDiscoveryResult;
}): ReadonlyMap<string, PluginConfigContractMetadata>;
