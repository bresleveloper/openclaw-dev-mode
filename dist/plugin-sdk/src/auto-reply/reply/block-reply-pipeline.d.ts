import type { ReplyPayload } from "../types.js";
import type { BlockStreamingCoalescing } from "./block-streaming.js";
/** Streaming block reply pipeline that tracks sent content and media. */
export type BlockReplyPipeline = {
    enqueue: (payload: ReplyPayload) => void;
    flush: (options?: {
        force?: boolean;
    }) => Promise<void>;
    stop: () => void;
    hasBuffered: () => boolean;
    didStream: () => boolean;
    isAborted: () => boolean;
    hasSentPayload: (payload: ReplyPayload) => boolean;
    hasSentExactPayload?: (payload: ReplyPayload) => boolean;
    getSentMediaUrls: () => readonly string[];
};
/** Optional buffering strategy used before payloads enter block delivery. */
type BlockReplyBuffer = {
    shouldBuffer: (payload: ReplyPayload) => boolean;
    onEnqueue?: (payload: ReplyPayload) => void;
    finalize?: (payload: ReplyPayload) => ReplyPayload;
};
/** Buffers audio payloads so final delivery can preserve voice presentation. */
export declare function createAudioAsVoiceBuffer(params: {
    isAudioPayload: (payload: ReplyPayload) => boolean;
}): BlockReplyBuffer;
/** Creates a stable duplicate key for a complete outbound payload. */
export declare function createBlockReplyPayloadKey(payload: ReplyPayload): string;
/** Creates a duplicate key that ignores reply target for final suppression. */
export declare function createBlockReplyContentKey(payload: ReplyPayload): string;
/** Creates the ordered block reply delivery pipeline for streamed payloads. */
export declare function createBlockReplyPipeline(params: {
    onBlockReply: (payload: ReplyPayload, options?: {
        abortSignal?: AbortSignal;
        timeoutMs?: number;
    }) => Promise<void> | void;
    timeoutMs: number;
    coalescing?: BlockStreamingCoalescing;
    buffer?: BlockReplyBuffer;
}): BlockReplyPipeline;
export {};
