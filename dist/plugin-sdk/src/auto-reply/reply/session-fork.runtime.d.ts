import { type SessionEntry as StoreSessionEntry } from "../../config/sessions/types.js";
/** Resolves the best available token count for a parent session before forking. */
export declare function resolveParentForkTokenCountRuntime(params: {
    parentEntry: StoreSessionEntry;
    storePath: string;
}): Promise<number | undefined>;
/** Creates a child session transcript from a parent session branch. */
export declare function forkSessionFromParentRuntime(params: {
    parentEntry: StoreSessionEntry;
    agentId: string;
    sessionsDir: string;
}): Promise<{
    sessionId: string;
    sessionFile: string;
} | null>;
