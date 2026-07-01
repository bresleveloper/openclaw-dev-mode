import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type AnyAgentTool } from "./common.js";
/** @internal Exposed for regression tests only; do not import from runtime code. */
export declare function assertGatewayConfigMutationAllowedForTest(params: {
    action: "config.apply" | "config.patch";
    currentConfig: Record<string, unknown>;
    raw: string;
    replacePaths?: string[];
}): void;
export declare function createGatewayTool(opts?: {
    agentSessionKey?: string;
    config?: OpenClawConfig;
}): AnyAgentTool;
