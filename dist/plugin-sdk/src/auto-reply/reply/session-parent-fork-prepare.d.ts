import type { SessionEntry } from "../../config/sessions.js";
export declare function prepareReplySessionParentFork(params: {
    agentId: string;
    alreadyForked: boolean;
    parentSessionKey?: string;
    readEntry: (sessionKey: string) => SessionEntry | undefined;
    sessionEntry: SessionEntry;
    sessionKey: string;
    storePath: string;
    warn: (message: string) => void;
}): Promise<SessionEntry>;
