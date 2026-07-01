import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Returns config with a plugin enabled/disabled and optional built-in channel state synced. */
export declare function setPluginEnabledInConfig(config: OpenClawConfig, pluginId: string, enabled: boolean, options?: {
    updateChannelConfig?: boolean;
}): OpenClawConfig;
