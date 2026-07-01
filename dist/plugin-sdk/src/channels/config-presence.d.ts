import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginDiscoveryResult } from "../plugins/discovery.js";
type ChannelPresenceOptions = {
    channelIds?: readonly string[];
    discovery?: PluginDiscoveryResult;
    includePersistedAuthState?: boolean;
    persistedAuthStateProbe?: {
        listChannelIds: () => readonly string[];
        hasState: (params: {
            channelId: string;
            cfg: OpenClawConfig;
            env: NodeJS.ProcessEnv;
        }) => boolean;
    };
};
/** Source that made a channel look potentially configured. */
export type ChannelPresenceSignalSource = "config" | "env" | "persisted-auth";
type ChannelPresenceSignal = {
    channelId: string;
    source: ChannelPresenceSignalSource;
};
/** Returns true when a channel config entry contains settings beyond enabled/disabled state. */
export declare function hasMeaningfulChannelConfig(value: unknown): boolean;
/** Lists channels explicitly disabled in config so activation logic can suppress auto-detection. */
export declare function listExplicitlyDisabledChannelIdsForConfig(cfg: OpenClawConfig): string[];
/** Lists channel ids detected from config, env vars, or persisted auth state. */
export declare function listPotentialConfiguredChannelIds(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv, options?: ChannelPresenceOptions): string[];
/** Lists deduplicated channel presence signals with their detection source. */
export declare function listPotentialConfiguredChannelPresenceSignals(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv, options?: ChannelPresenceOptions): ChannelPresenceSignal[];
export {};
