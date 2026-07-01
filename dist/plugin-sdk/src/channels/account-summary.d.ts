import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ChannelAccountSnapshot } from "./plugins/types.core.js";
import type { ChannelPlugin } from "./plugins/types.plugin.js";
/**
 * Builds the safe account snapshot shown by CLI, gateway, and status summaries.
 */
export declare function buildChannelAccountSnapshot(params: {
    plugin: ChannelPlugin;
    account: unknown;
    cfg: OpenClawConfig;
    accountId: string;
    enabled: boolean;
    configured: boolean;
}): ChannelAccountSnapshot;
/**
 * Formats allowFrom entries with a plugin formatter when one exists.
 */
export declare function formatChannelAllowFrom(params: {
    plugin: ChannelPlugin;
    cfg: OpenClawConfig;
    accountId?: string | null;
    allowFrom: Array<string | number>;
}): string[];
/**
 * Resolves whether a channel account should be treated as enabled.
 */
export declare function resolveChannelAccountEnabled(params: {
    plugin: ChannelPlugin;
    account: unknown;
    cfg: OpenClawConfig;
}): boolean;
/**
 * Resolves whether a channel account has enough configuration to run.
 */
export declare function resolveChannelAccountConfigured(params: {
    plugin: ChannelPlugin;
    account: unknown;
    cfg: OpenClawConfig;
    readAccountConfiguredField?: boolean;
}): Promise<boolean>;
