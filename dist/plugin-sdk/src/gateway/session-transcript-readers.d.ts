import type { SessionTranscriptReadScope } from "../config/sessions/session-accessor.js";
import type { ReadRecentSessionMessagesOptions, ReadSessionMessagesAsyncOptions } from "./session-utils.fs.js";
import { readSessionPreviewItemsFromTranscript as readSessionPreviewItemsFromTranscriptFile } from "./session-utils.fs.js";
export type { ReadRecentSessionMessagesOptions, ReadSessionMessagesAsyncOptions };
export { attachOpenClawTranscriptMeta, capArrayByJsonBytes } from "./session-utils.fs.js";
export type { SessionTranscriptReadScope };
type SessionTitleFields = {
    firstUserMessage: string | null;
    lastMessagePreview: string | null;
};
type ReadRecentSessionMessagesResult = {
    messages: unknown[];
    transcriptPath?: string;
    totalMessages: number;
};
type ReadSessionMessagesResult = {
    messages: unknown[];
    transcriptPath?: string;
};
type ReadSessionMessageByIdResult = {
    message?: unknown;
    seq?: number;
    oversized: boolean;
    found: boolean;
};
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
/** Reads display messages from a session transcript through the reader seam. */
export declare function readSessionMessages(scope: SessionTranscriptReadScope): unknown[];
/** Reads recent display messages from a session transcript through the reader seam. */
export declare function readRecentSessionMessages(scope: SessionTranscriptReadScope, opts?: ReadRecentSessionMessagesOptions): unknown[];
/** Visits display messages from a session transcript through the reader seam. */
export declare function visitSessionMessages(scope: SessionTranscriptReadScope, visit: (message: unknown, seq: number) => void): number;
/** Counts display messages in a session transcript through the reader seam. */
export declare function readSessionMessageCount(scope: SessionTranscriptReadScope): number;
/** Reads display messages asynchronously through the reader seam. */
export declare function readSessionMessagesAsync(scope: SessionTranscriptReadScope, opts: ReadSessionMessagesAsyncOptions): Promise<unknown[]>;
/** Reads display messages with source metadata through the reader seam. */
export declare function readSessionMessagesWithSourceAsync(scope: SessionTranscriptReadScope, opts: ReadSessionMessagesAsyncOptions): Promise<ReadSessionMessagesResult>;
/** Reads recent display messages asynchronously through the reader seam. */
export declare function readRecentSessionMessagesAsync(scope: SessionTranscriptReadScope, opts?: ReadRecentSessionMessagesOptions): Promise<unknown[]>;
/** Finds one display message by transcript id through the reader seam. */
export declare function readSessionMessageByIdAsync(scope: SessionTranscriptReadScope, messageId: string, opts?: {
    allowResetArchiveFallback?: boolean;
}): Promise<ReadSessionMessageByIdResult>;
/** Visits display messages asynchronously through the reader seam. */
export declare function visitSessionMessagesAsync(scope: SessionTranscriptReadScope, visit: (message: unknown, seq: number) => void, opts: {
    mode: "full";
    reason: string;
    cache?: "reuse" | "skip";
}): Promise<number>;
/** Counts display messages asynchronously through the reader seam. */
export declare function readSessionMessageCountAsync(scope: SessionTranscriptReadScope): Promise<number>;
/** Reads recent messages with total-count metadata through the reader seam. */
export declare function readRecentSessionMessagesWithStats(scope: SessionTranscriptReadScope, opts: ReadRecentSessionMessagesOptions): ReadRecentSessionMessagesResult;
/** Reads recent messages with total-count metadata asynchronously through the reader seam. */
export declare function readRecentSessionMessagesWithStatsAsync(scope: SessionTranscriptReadScope, opts: ReadRecentSessionMessagesOptions): Promise<ReadRecentSessionMessagesResult>;
/** Reads a bounded transcript tail for compaction and diagnostics through the reader seam. */
export declare function readRecentSessionTranscriptLines(params: SessionTranscriptReadScope & {
    maxLines: number;
}): {
    lines: string[];
    totalLines: number;
} | null;
/** Reads title and preview text from a transcript through the reader seam. */
export declare function readSessionTitleFieldsFromTranscript(scope: SessionTranscriptReadScope, opts?: {
    includeInterSession?: boolean;
}): SessionTitleFields;
/** Reads title and preview text asynchronously through the reader seam. */
export declare function readSessionTitleFieldsFromTranscriptAsync(scope: SessionTranscriptReadScope, opts?: {
    includeInterSession?: boolean;
}): Promise<SessionTitleFields>;
/** Reads the first user message from a transcript through the reader seam. */
export declare function readFirstUserMessageFromTranscript(scope: SessionTranscriptReadScope, opts?: {
    includeInterSession?: boolean;
}): string | null;
/** Reads aggregate usage from a full transcript through the reader seam. */
export declare function readLatestSessionUsageFromTranscript(scope: SessionTranscriptReadScope): SessionTranscriptUsageSnapshot | null;
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
export declare function readLatestSessionUsageFromTranscriptAsync(scope: SessionTranscriptReadScope): Promise<SessionTranscriptUsageSnapshot | null>;
/** Reads aggregate usage from a bounded transcript tail through the reader seam. */
export declare function readRecentSessionUsageFromTranscriptAsync(scope: SessionTranscriptReadScope, maxBytes: number): Promise<SessionTranscriptUsageSnapshot | null>;
/** Reads latest usage from a bounded transcript tail through the reader seam. */
export declare function readLatestRecentSessionUsageFromTranscriptAsync(scope: SessionTranscriptReadScope, maxBytes: number): Promise<SessionTranscriptUsageSnapshot | null>;
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
export declare function readRecentSessionUsageFromTranscript(scope: SessionTranscriptReadScope, maxBytes: number): SessionTranscriptUsageSnapshot | null;
/** Reads compact session preview items through the reader seam. */
export declare function readSessionPreviewItemsFromTranscript(scope: SessionTranscriptReadScope, maxItems: number, maxChars: number): ReturnType<typeof readSessionPreviewItemsFromTranscriptFile>;
