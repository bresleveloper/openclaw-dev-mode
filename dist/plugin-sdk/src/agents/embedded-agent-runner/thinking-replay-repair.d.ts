import { rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite.js";
type RewritableSessionManager = Parameters<typeof rewriteTranscriptEntriesInSessionManager>[0]["sessionManager"];
export declare function repairRejectedThinkingReplayInSessionManager(params: {
    sessionManager: RewritableSessionManager;
    sessionFile?: string;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
}): {
    repaired: boolean;
    repairedCount: number;
    reason?: string;
};
export {};
