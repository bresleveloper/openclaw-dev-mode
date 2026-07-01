import type { SessionPreviewItem } from "./session-utils.types.js";
type SessionTitleFields = {
    firstUserMessage: string | null;
    lastMessagePreview: string | null;
};
/** Attach OpenClaw metadata to a transcript message without dropping existing metadata. */
export declare function attachOpenClawTranscriptMeta(message: unknown, meta: Record<string, unknown>): unknown;
/** Read all visible transcript messages for a session from the first existing candidate file. */
export declare function readSessionMessages(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): unknown[];
export type ReadRecentSessionMessagesOptions = {
    maxMessages: number;
    maxBytes?: number;
    maxLines?: number;
    allowResetArchiveFallback?: boolean;
};
export type ReadSessionMessagesAsyncOptions = {
    mode: "full";
    reason: string;
    allowResetArchiveFallback?: boolean;
} | ({
    mode: "recent";
} & ReadRecentSessionMessagesOptions);
type ReadRecentSessionMessagesResult = {
    messages: unknown[];
    totalMessages: number;
    transcriptPath?: string;
};
type ReadSessionMessagesResult = {
    messages: unknown[];
    transcriptPath?: string;
};
export declare function readRecentSessionMessages(sessionId: string, storePath: string | undefined, sessionFile?: string, opts?: ReadRecentSessionMessagesOptions, agentId?: string): unknown[];
export declare function visitSessionMessages(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, visit: (message: unknown, seq: number) => void, agentId?: string): number;
export declare function readSessionMessageCount(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): number;
export declare function readSessionMessagesAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, opts: ReadSessionMessagesAsyncOptions, agentId?: string): Promise<unknown[]>;
export declare function readSessionMessagesWithSourceAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, opts: ReadSessionMessagesAsyncOptions, agentId?: string): Promise<ReadSessionMessagesResult>;
export declare function readSessionMessageByIdAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, messageId: string, opts?: {
    allowResetArchiveFallback?: boolean;
    agentId?: string;
}): Promise<{
    message?: unknown;
    seq?: number;
    oversized: boolean;
    found: boolean;
}>;
export declare function visitSessionMessagesAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, visit: (message: unknown, seq: number) => void, opts: {
    mode: "full";
    reason: string;
    cache?: "reuse" | "skip";
}, agentId?: string): Promise<number>;
export declare function readSessionMessageCountAsync(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): Promise<number>;
export declare function readRecentSessionMessagesWithStats(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, opts: ReadRecentSessionMessagesOptions, agentId?: string): ReadRecentSessionMessagesResult;
export declare function readRecentSessionMessagesAsync(sessionId: string, storePath: string | undefined, sessionFile?: string, opts?: ReadRecentSessionMessagesOptions, agentId?: string): Promise<unknown[]>;
export declare function readRecentSessionMessagesWithStatsAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, opts: ReadRecentSessionMessagesOptions, agentId?: string): Promise<ReadRecentSessionMessagesResult>;
export declare function readRecentSessionTranscriptLines(params: {
    sessionId: string;
    storePath: string | undefined;
    sessionFile?: string;
    agentId?: string;
    maxLines: number;
}): {
    lines: string[];
    totalLines: number;
} | null;
export { archiveFileOnDisk, archiveSessionTranscripts, cleanupArchivedSessionTranscripts, resolveSessionTranscriptCandidates, resolveSessionTranscriptResetArchiveCandidatesAsync, } from "./session-transcript-files.fs.js";
export declare function capArrayByJsonBytes<T>(items: T[], maxBytes: number): {
    items: T[];
    bytes: number;
};
export declare function readSessionTitleFieldsFromTranscript(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string, opts?: {
    includeInterSession?: boolean;
}): SessionTitleFields;
export declare function readSessionTitleFieldsFromTranscriptAsync(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string, opts?: {
    includeInterSession?: boolean;
}): Promise<SessionTitleFields>;
export declare function resolveSessionHistoryTranscriptPathAsync(sessionId: string, storePath: string | undefined, sessionFile?: string, opts?: {
    agentId?: string;
    allowResetArchiveFallback?: boolean;
}): Promise<string | null>;
export declare function readFirstUserMessageFromTranscript(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string, opts?: {
    includeInterSession?: boolean;
}): string | null;
type SessionTranscriptUsageSnapshot = {
    modelProvider?: string;
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    cacheRead?: number;
    cacheWrite?: number;
    totalTokens?: number;
    totalTokensFresh?: boolean;
    costUsd?: number;
};
export declare function readLatestSessionUsageFromTranscript(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): SessionTranscriptUsageSnapshot | null;
export declare function readLatestSessionUsageFromTranscriptAsync(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): Promise<SessionTranscriptUsageSnapshot | null>;
export declare function readRecentSessionUsageFromTranscriptAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, agentId: string | undefined, maxBytes: number): Promise<SessionTranscriptUsageSnapshot | null>;
export declare function readLatestRecentSessionUsageFromTranscriptAsync(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, agentId: string | undefined, maxBytes: number): Promise<SessionTranscriptUsageSnapshot | null>;
export declare function readRecentSessionUsageFromTranscript(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, agentId: string | undefined, maxBytes: number): SessionTranscriptUsageSnapshot | null;
export declare function readSessionPreviewItemsFromTranscript(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, agentId: string | undefined, maxItems: number, maxChars: number): SessionPreviewItem[];
