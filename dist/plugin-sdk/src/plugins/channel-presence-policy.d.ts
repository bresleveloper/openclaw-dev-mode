import { type ChannelPresenceSignalSource } from "../channels/config-presence.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
/** Source classes that can make a channel appear configured for read-only scopes. */
export type ConfiguredChannelPresenceSource = "explicit-config" | Exclude<ChannelPresenceSignalSource, "config"> | "manifest-env";
/** Reasons a configured channel signal is not effective. */
export type ConfiguredChannelBlockedReason = "plugins-disabled" | "blocked-by-denylist" | "plugin-disabled" | "not-in-allowlist" | "workspace-disabled-by-default" | "bundled-disabled-by-default" | "untrusted-plugin" | "no-channel-owner" | "not-activated";
/** Policy evaluation row for one configured channel signal. */
export type ConfiguredChannelPresencePolicyEntry = {
    channelId: string;
    sources: ConfiguredChannelPresenceSource[];
    effective: boolean;
    pluginIds: string[];
    blockedReasons: ConfiguredChannelBlockedReason[];
};
/** True when config contains meaningful enabled channel settings. */
export declare function hasExplicitChannelConfig(params: {
    config: OpenClawConfig;
    channelId: string;
}): boolean;
/** Lists explicitly configured channel ids, excluding global channel config keys. */
export declare function listExplicitConfiguredChannelIdsForConfig(config: OpenClawConfig): string[];
/** Resolves effective configured-channel policy rows from config, auth state, env, and manifests. */
export declare function resolveConfiguredChannelPresencePolicy(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includePersistedAuthState?: boolean;
    manifestRecords?: readonly PluginManifestRecord[];
}): ConfiguredChannelPresencePolicyEntry[];
/** Lists effective channel ids available to read-only scoped discovery. */
export declare function listConfiguredChannelIdsForReadOnlyScope(params: Parameters<typeof resolveConfiguredChannelPresencePolicy>[0]): string[];
/** True when read-only scoped discovery has any effective configured channel. */
export declare function hasConfiguredChannelsForReadOnlyScope(params: Parameters<typeof resolveConfiguredChannelPresencePolicy>[0]): boolean;
/** Lists channel ids that should be announced as configured for operators. */
export declare function listConfiguredAnnounceChannelIdsForConfig(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    manifestRecords?: readonly PluginManifestRecord[];
}): string[];
/** Resolves plugin ids discoverable for scoped channel activation. */
export declare function resolveDiscoverableScopedChannelPluginIds(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    channelIds: readonly string[];
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
    manifestRecords?: readonly PluginManifestRecord[];
}): string[];
/** Resolves plugin ids that own currently configured channels. */
export declare function resolveConfiguredChannelPluginIds(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
}): string[];
