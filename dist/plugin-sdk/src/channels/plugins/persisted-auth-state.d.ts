/**
 * Bundled channel persisted-auth state probes.
 *
 * Lists and checks channel package metadata that can report persisted auth state.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
/**
 * Lists bundled channels that declare persisted-auth state metadata.
 */
export declare function listBundledChannelIdsWithPersistedAuthState(discovery?: PluginDiscoveryResult): string[];
/**
 * Returns whether a bundled channel reports persisted auth state.
 */
export declare function hasBundledChannelPersistedAuthState(params: {
    channelId: string;
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    discovery?: PluginDiscoveryResult;
}): boolean;
