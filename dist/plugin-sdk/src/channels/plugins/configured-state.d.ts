/**
 * Bundled channel configured-state probes.
 *
 * Lists and checks bundled channels that can report configured account state.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
/**
 * Lists bundled channel ids that expose configured-state detectors.
 */
export declare function listBundledChannelIdsWithConfiguredState(discovery?: PluginDiscoveryResult): string[];
/**
 * Checks whether a bundled channel reports configured state for the current config.
 */
export declare function hasBundledChannelConfiguredState(params: {
    channelId: string;
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    discovery?: PluginDiscoveryResult;
}): boolean;
