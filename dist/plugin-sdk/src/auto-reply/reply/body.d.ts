import type { SessionEntry } from "../../config/sessions/types.js";
import type { ReplySessionEntryHandle } from "./session-entry-handle.js";
/** Applies one-shot session hints to the agent-visible body and clears consumed flags. */
export declare function applySessionHints(params: {
    baseBody: string;
    abortedLastRun: boolean;
    sessionEntry?: SessionEntry;
    sessionEntryHandle?: ReplySessionEntryHandle;
    sessionStore?: Record<string, SessionEntry>;
    sessionKey?: string;
    storePath?: string;
    abortKey?: string;
}): Promise<string>;
