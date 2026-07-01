import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type LinkChannelContext = {
    linked: boolean;
    authAgeMs: number | null;
    account?: unknown;
    accountId?: string;
    plugin: ChannelPlugin;
};
/** Returns link status for the first configured read-only channel that exposes linked state. */
export declare function resolveLinkChannelContext(cfg: OpenClawConfig, options?: {
    sourceConfig?: OpenClawConfig;
}): Promise<LinkChannelContext | null>;
export {};
