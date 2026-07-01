import type { SessionEntry } from "../../config/sessions.js";
export type ReplySessionEntryHandle = {
    get(sessionKey: string): SessionEntry | undefined;
    getCurrent(): SessionEntry | undefined;
    patchCurrent(patch: Partial<SessionEntry>): SessionEntry | undefined;
    replaceCurrent(entry: SessionEntry): void;
    set(sessionKey: string, entry: SessionEntry): void;
    toCompatSessionStore(): Record<string, SessionEntry>;
};
export declare function createReplySessionEntryHandle(params: {
    sessionEntry: SessionEntry;
    sessionKey: string;
    sessionStore?: Record<string, SessionEntry>;
}): ReplySessionEntryHandle;
