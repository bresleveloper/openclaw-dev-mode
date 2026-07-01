import type { CommandsListResult } from "../../../packages/gateway-protocol/src/index.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Builds the public commands.list payload for an agent/provider/scope view. */
export declare function buildCommandsListResult(params: {
    cfg: OpenClawConfig;
    agentId: string;
    provider?: string;
    scope?: "native" | "text" | "both";
    includeArgs?: boolean;
}): CommandsListResult;
