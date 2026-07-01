import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolves runtime config with plugin auto-enable applied for gateway startup/reload paths. */
export declare function resolveGatewayPluginConfig(params: {
    config: OpenClawConfig;
}): OpenClawConfig;
