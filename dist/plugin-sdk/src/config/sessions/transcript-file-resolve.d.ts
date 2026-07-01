import type { SessionEntry } from "./types.js";
/**
 * Resolves the transcript file for a session and persists the resolved target
 * when the caller supplies the owning session store.
 */
export declare function resolveSessionTranscriptFile(params: {
    sessionId: string;
    sessionKey: string;
    sessionEntry: SessionEntry | undefined;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    agentId: string;
    threadId?: string | number;
}): Promise<{
    sessionFile: string;
    sessionEntry: SessionEntry | undefined;
}>;
