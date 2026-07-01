import type { OpenClawConfig } from "../../config/types.openclaw.js";
export declare function withSessionTranscriptAppendQueue<T>(transcriptPath: string, fn: () => Promise<T>): Promise<T>;
export type AppendSessionTranscriptMessageParams<TMessage = unknown> = {
    transcriptPath: string;
    message: TMessage;
    now?: number;
    sessionId?: string;
    cwd?: string;
    useRawWhenLinear?: boolean;
    /** Opt into transcript idempotency lookup; default append stays O(1) for fresh keyed messages. */
    idempotencyLookup?: "scan" | "caller-checked";
    /** Runs under the transcript write lock after idempotency replay checks and before append. */
    prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined;
    config?: OpenClawConfig;
    /** Internal owned-batch hook for publishing a newly created transcript header. */
    onHeaderCreated?: (serializedHeader: string) => void;
};
export type AppendSessionTranscriptMessageResult<TMessage> = {
    messageId: string;
    message: TMessage;
    appended: boolean;
};
export type SessionTranscriptAppendTransactionContext = {
    appendEvent: (event: unknown) => Promise<void>;
    appendMessage: <TMessage>(params: Omit<AppendSessionTranscriptMessageParams<TMessage>, "config" | "transcriptPath">) => Promise<AppendSessionTranscriptMessageResult<TMessage> | undefined>;
};
export declare function appendSessionTranscriptMessage<TMessage>(params: AppendSessionTranscriptMessageParams<TMessage> & {
    prepareMessageAfterIdempotencyCheck: (message: TMessage) => TMessage | undefined;
}): Promise<AppendSessionTranscriptMessageResult<TMessage> | undefined>;
export declare function appendSessionTranscriptMessage<TMessage>(params: AppendSessionTranscriptMessageParams<TMessage>): Promise<AppendSessionTranscriptMessageResult<TMessage>>;
/**
 * Appends a message while the caller already owns the transcript write lock and
 * append FIFO. Batch writers use this to keep queue-before-lock ordering while
 * reusing the same file lock for multiple transcript rows.
 */
export declare function appendSessionTranscriptMessageWithOwnedWriteLock<TMessage>(params: AppendSessionTranscriptMessageParams<TMessage> & {
    prepareMessageAfterIdempotencyCheck: (message: TMessage) => TMessage | undefined;
}): Promise<AppendSessionTranscriptMessageResult<TMessage> | undefined>;
export declare function appendSessionTranscriptMessageWithOwnedWriteLock<TMessage>(params: AppendSessionTranscriptMessageParams<TMessage>): Promise<AppendSessionTranscriptMessageResult<TMessage>>;
/**
 * Runs a group of transcript appends through one append queue and write lock.
 */
export declare function runSessionTranscriptAppendTransaction<T>(params: Pick<AppendSessionTranscriptMessageParams, "config" | "transcriptPath">, run: (context: SessionTranscriptAppendTransactionContext) => Promise<T> | T): Promise<T>;
type AppendSessionTranscriptEventParams = {
    config?: OpenClawConfig;
    event: unknown;
    transcriptPath: string;
};
/** Appends a raw transcript event using the same write lock and FIFO as message appends. */
export declare function appendSessionTranscriptEvent(params: AppendSessionTranscriptEventParams): Promise<void>;
export {};
