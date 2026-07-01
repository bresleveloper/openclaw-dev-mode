/**
 * Channel account inspection helpers.
 *
 * Combines plugin inspection hooks, read-only fallbacks, and configured credential status.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ChannelPlugin } from "./plugins/types.plugin.js";
/**
 * Inspects one channel account using the plugin hook or read-only fallback.
 */
export declare function inspectChannelAccount(params: {
    plugin: ChannelPlugin;
    cfg: OpenClawConfig;
    accountId: string;
}): Promise<unknown>;
/**
 * Resolves an inspected channel account plus enabled/configured state for status surfaces.
 */
export declare function resolveInspectedChannelAccount(params: {
    plugin: ChannelPlugin;
    cfg: OpenClawConfig;
    sourceConfig: OpenClawConfig;
    accountId: string;
}): Promise<{
    account: unknown;
    enabled: boolean;
    configured: boolean;
}>;
