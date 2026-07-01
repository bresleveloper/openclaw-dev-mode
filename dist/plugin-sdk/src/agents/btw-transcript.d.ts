import { type SessionEntry as StoredSessionEntry } from "../config/sessions.js";
/** Resolves the persisted transcript file for a BTW session handoff. */
export declare function resolveBtwSessionTranscriptPath(params: {
    sessionId: string;
    sessionEntry?: StoredSessionEntry;
    sessionKey?: string;
    storePath?: string;
}): string | undefined;
/**
 * Reads prior messages for BTW continuation.
 *
 * When a transcript has fork links, this returns the selected snapshot branch
 * instead of the full file so a resumed agent does not inherit sibling-branch
 * messages.
 */
export declare function readBtwTranscriptMessages(params: {
    sessionFile: string;
    sessionId: string;
    snapshotLeafId?: string | null;
}): Promise<unknown[]>;
