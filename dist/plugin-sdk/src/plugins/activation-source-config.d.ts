import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves the source config used for plugin activation policy decisions. */
export declare function resolvePluginActivationSourceConfig(params: {
    config?: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
}): OpenClawConfig;
