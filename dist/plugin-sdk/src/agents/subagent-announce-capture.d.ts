/**
 * Helpers for capturing the latest subagent completion reply after a run ends.
 *
 * Completion output can lag behind lifecycle state, so callers can retry briefly
 * before sending an empty or stale announcement.
 */
/** Reads subagent output repeatedly until non-empty text appears or the bounded wait expires. */
export declare function readLatestSubagentOutputWithRetryUsing<Outcome = unknown>(params: {
    sessionKey: string;
    maxWaitMs: number;
    retryIntervalMs: number;
    outcome?: Outcome;
    readSubagentOutput: (sessionKey: string, outcome?: Outcome) => Promise<string | undefined>;
}): Promise<string | undefined>;
/** Captures immediate output first, then optionally waits for a delayed completion reply. */
export declare function captureSubagentCompletionReplyUsing(params: {
    sessionKey: string;
    waitForReply?: boolean;
    maxWaitMs: number;
    retryIntervalMs: number;
    readSubagentOutput: (sessionKey: string) => Promise<string | undefined>;
}): Promise<string | undefined>;
