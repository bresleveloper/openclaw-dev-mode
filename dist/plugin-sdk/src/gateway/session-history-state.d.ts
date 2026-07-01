type SessionHistoryTranscriptMeta = {
    seq?: number;
};
type SessionHistoryMessage = Record<string, unknown> & {
    __openclaw?: SessionHistoryTranscriptMeta;
};
type PaginatedSessionHistory = {
    items: SessionHistoryMessage[];
    messages: SessionHistoryMessage[];
    nextCursor?: string;
    hasMore: boolean;
};
type SessionHistorySnapshot = {
    history: PaginatedSessionHistory;
    rawTranscriptSeq: number;
};
type InlineSessionHistoryAppend = {
    message?: unknown;
    messageSeq?: number;
    shouldRefresh?: boolean;
};
type SessionHistoryTranscriptTarget = {
    agentId?: string;
    sessionEntry?: {
        sessionFile?: string;
        sessionId?: string;
    };
    sessionId: string;
    sessionKey: string;
    storePath?: string;
};
/** Computes an oversized raw transcript tail window for projected chat history. */
export declare function resolveSessionHistoryTailReadOptions(limit: number): {
    maxMessages: number;
    maxLines: number;
};
/** Builds the display history snapshot and raw transcript sequence watermark. */
export declare function buildSessionHistorySnapshot(params: {
    rawMessages: unknown[];
    maxChars?: number;
    limit?: number;
    cursor?: string;
    rawTranscriptSeq?: number;
    totalRawMessages?: number;
}): SessionHistorySnapshot;
/** Tracks session-history SSE state and decides when inline appends are still valid. */
export declare class SessionHistorySseState {
    private readonly target;
    private readonly maxChars;
    private readonly limit;
    private readonly cursor;
    private sentHistory;
    private rawTranscriptSeq;
    private transcriptPath;
    static fromRawSnapshot(params: {
        target: SessionHistoryTranscriptTarget;
        rawMessages: unknown[];
        rawTranscriptSeq?: number;
        totalRawMessages?: number;
        transcriptPath?: string;
        maxChars?: number;
        limit?: number;
        cursor?: string;
    }): SessionHistorySseState;
    private constructor();
    snapshot(): PaginatedSessionHistory;
    appendInlineMessage(update: {
        message: unknown;
        messageId?: string;
        messageSeq?: number;
    }): InlineSessionHistoryAppend | null;
    shouldRefreshForTranscriptPath(updatePath: string | undefined): boolean;
    refreshAsync(): Promise<PaginatedSessionHistory>;
    private buildSnapshot;
    private readRawSnapshotAsync;
}
export {};
