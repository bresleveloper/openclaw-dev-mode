import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Best-effort inbound session metadata recorder for channel plugin command handlers.
 */
export declare function recordInboundSessionMetaSafe(params: {
    cfg: OpenClawConfig;
    agentId: string;
    sessionKey: string;
    ctx: MsgContext;
    onError?: (error: unknown) => void;
}): Promise<void>;
