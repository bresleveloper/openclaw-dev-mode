import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
/**
 * Metadata keys that can declare a lightweight package-state checker.
 */
type ChannelPackageStateMetadataKey = "configuredState" | "persistedAuthState";
/**
 * Lists bundled channel ids that declare the requested package-state metadata.
 */
export declare function listBundledChannelIdsForPackageState(metadataKey: ChannelPackageStateMetadataKey, discovery?: PluginDiscoveryResult): string[];
/**
 * Returns whether a bundled channel reports configured/auth package state.
 */
export declare function hasBundledChannelPackageState(params: {
    metadataKey: ChannelPackageStateMetadataKey;
    channelId: string;
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    discovery?: PluginDiscoveryResult;
}): boolean;
export {};
