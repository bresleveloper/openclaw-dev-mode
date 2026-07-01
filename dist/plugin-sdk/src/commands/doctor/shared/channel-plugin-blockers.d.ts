import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type ChannelPluginBlockerHit = {
    /** Normalized configured channel id whose backing plugin is unavailable. */
    channelId: string;
    /** Plugin id that would provide the configured channel. */
    pluginId: string;
    /** Another owner can still serve this channel despite this owner-specific blocker. */
    channelAvailable?: boolean;
    /** Effective activation reason preventing the plugin from loading. */
    reason: "disabled in config" | "blocked by denylist" | "plugins disabled" | "missing explicit enablement" | "not enabled" | "not enabled and not in allowlist" | "not in allowlist";
};
/** Find configured channel ids whose backing plugins cannot activate. */
export declare function scanConfiguredChannelPluginBlockers(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv, activationSourceConfig?: OpenClawConfig): ChannelPluginBlockerHit[];
/** Format doctor warnings for configured channels blocked by plugin activation state. */
export declare function collectConfiguredChannelPluginBlockerWarnings(hits: ChannelPluginBlockerHit[]): string[];
/** Return true when a setup warning targets a channel already explained by plugin blockers. */
export declare function isWarningBlockedByChannelPlugin(warning: string, hits: ChannelPluginBlockerHit[]): boolean;
export {};
