import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type ChannelSummaryOptions = {
    colorize?: boolean;
    includeAllowFrom?: boolean;
    plugins?: readonly ChannelPlugin[];
    sourceConfig?: OpenClawConfig;
};
export declare function buildChannelSummary(cfg?: OpenClawConfig, options?: ChannelSummaryOptions): Promise<string[]>;
export {};
