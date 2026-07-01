import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext } from "../templating.js";
import type { ReplyPayload } from "../types.js";
/** Parses, authorizes, starts, polls, or stops chat-driven bash commands. */
export declare function handleBashChatCommand(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
    agentId?: string;
    sessionKey: string;
    isGroup: boolean;
    elevated: {
        enabled: boolean;
        allowed: boolean;
        failures: Array<{
            gate: string;
            key: string;
        }>;
    };
}): Promise<ReplyPayload>;
