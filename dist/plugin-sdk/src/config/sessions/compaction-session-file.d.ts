import type { SessionEntry } from "./types.js";
export declare function resolveCompactionSessionFile(params: {
    entry: SessionEntry;
    sessionKey: string;
    storePath?: string;
    newSessionId: string;
}): string;
