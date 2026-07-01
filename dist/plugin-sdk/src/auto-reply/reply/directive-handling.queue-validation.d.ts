/** Validation and status handling for /queue directives. */
import type { SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ReplyPayload } from "../types.js";
import type { InlineDirectives } from "./directive-handling.parse.js";
/** Validates `/queue` directives and returns immediate status/error replies. */
export declare function maybeHandleQueueDirective(params: {
    directives: InlineDirectives;
    cfg: OpenClawConfig;
    channel: string;
    sessionEntry?: SessionEntry;
}): ReplyPayload | undefined;
