import type { SessionEntry } from "../../config/sessions.js";
import type { TypingMode } from "../../config/types.js";
import type { GetReplyOptions } from "../types.js";
import { type FollowupRun } from "./queue.js";
import type { TypingController } from "./typing.js";
/** Creates the function that drains one queued follow-up run. */
export declare function createFollowupRunner(params: {
    opts?: GetReplyOptions;
    typing: TypingController;
    typingMode: TypingMode;
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
    defaultModel: string;
    agentCfgContextTokens?: number;
    toolProgressDetail?: "explain" | "raw";
}): (queued: FollowupRun) => Promise<void>;
