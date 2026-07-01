import type { OpenClawConfig } from "../config/types.openclaw.js";
type PluginEnableOptions = {
    updateChannelConfig?: boolean;
};
/** Result of enabling a plugin in config. */
export type PluginEnableResult = {
    config: OpenClawConfig;
    enabled: boolean;
    pluginId: string;
    reason?: string;
};
/** Enables a plugin in config unless global, denylist, or allowlist policy blocks it. */
export declare function enablePluginInConfig(cfg: OpenClawConfig, pluginId: string, options?: PluginEnableOptions): PluginEnableResult;
/**
 * Enables a plugin selected through an explicit user action.
 *
 * ClickClack is bundled without a separate install trust record, so selecting
 * it is the trust gesture that materializes its id in a restrictive allowlist.
 */
export declare function enableExplicitlySelectedPluginInConfig(cfg: OpenClawConfig, pluginId: string, options?: PluginEnableOptions): PluginEnableResult;
export {};
