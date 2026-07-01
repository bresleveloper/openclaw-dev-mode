/** Resolves effective exec-tool overrides for reply runs. */
import type { ExecToolDefaults } from "../../agents/bash-tools.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { InlineDirectives } from "./directive-handling.parse.js";
/** Exec defaults that can be overridden by inline directives or session state. */
export type ReplyExecOverrides = Pick<ExecToolDefaults, "host" | "security" | "ask" | "node">;
/** Resolves effective exec defaults for a reply run. */
export declare function resolveReplyExecOverrides(params: {
    directives: InlineDirectives;
    sessionEntry?: SessionEntry;
    agentExecDefaults?: ReplyExecOverrides;
}): ReplyExecOverrides | undefined;
