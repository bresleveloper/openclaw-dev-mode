import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ExplicitGatewayAuth } from "./credentials.js";
/** Returns true when url/auth flags are sufficient and loading OpenClaw config is unnecessary. */
export declare function canSkipGatewayConfigLoad(params: {
    config?: OpenClawConfig;
    urlOverride?: string;
    explicitAuth?: ExplicitGatewayAuth;
}): boolean;
/** Returns true for command families that intentionally bypass gateway config loading. */
export declare function isGatewayConfigBypassCommandPath(commandPath: readonly string[]): boolean;
