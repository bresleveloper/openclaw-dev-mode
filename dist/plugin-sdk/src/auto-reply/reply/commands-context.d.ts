import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext } from "../templating.js";
import type { CommandContext } from "./commands-types.js";
/** Builds command routing/auth metadata consumed by command handlers. */
export declare function buildCommandContext(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    isGroup: boolean;
    triggerBodyNormalized: string;
    commandAuthorized: boolean;
}): CommandContext;
