/** Detects directive-only turns that should skip the model. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext } from "../templating.js";
import type { InlineDirectives } from "./directive-handling.parse.js";
/** True when a message only changes directive state and has no agent body. */
export declare function isDirectiveOnly(params: {
    directives: InlineDirectives;
    cleanedBody: string;
    ctx: MsgContext;
    cfg: OpenClawConfig;
    agentId?: string;
    isGroup: boolean;
}): boolean;
