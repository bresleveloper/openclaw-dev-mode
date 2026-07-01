import type { ReplyPayload as InternalReplyPayload } from "../auto-reply/reply-payload.js";
import type { ChannelOutboundAdapter } from "../channels/plugins/outbound.types.js";
export type { MediaPayload, MediaPayloadInput } from "../channels/plugins/media-payload.js";
export { buildMediaPayload } from "../channels/plugins/media-payload.js";
/** Plugin-facing reply payload without core-only trusted local media internals. */
export type ReplyPayload = Omit<InternalReplyPayload, "trustedLocalMedia">;
export type { ReplyPayloadTtsSupplement } from "../auto-reply/reply-payload.js";
export { buildTtsSupplementMediaPayload, FAST_MODE_AUTO_PROGRESS_KIND, getReplyPayloadTtsSupplement, isFastModeAutoProgressPayload, isReplyPayloadNonTerminalToolErrorWarning, isReplyPayloadTtsSupplement, markReplyPayloadAsTtsSupplement, } from "../auto-reply/reply-payload.js";
/** Normalized outbound reply payload accepted by channel send helpers. */
export type OutboundReplyPayload = {
    /** Plain text reply body. */
    text?: string;
    /** Ordered media attachments for channels that can send multiple media items. */
    mediaUrls?: string[];
    /** Legacy single media attachment. */
    mediaUrl?: string;
    /** Rich presentation payload for channels that support structured replies. */
    presentation?: InternalReplyPayload["presentation"];
    /**
     * @deprecated Use presentation. Runtime support remains for legacy producers.
     */
    interactive?: InternalReplyPayload["interactive"];
    /** Channel-specific opaque data forwarded to outbound adapters. */
    channelData?: InternalReplyPayload["channelData"];
    /** Marks media as sensitive for channel-specific spoiler/safety handling. */
    sensitiveMedia?: boolean;
    /** Platform message id that the outbound reply should target when supported. */
    replyToId?: string;
};
/** Minimal payload shape used to identify reasoning/thinking replies. */
export type ReasoningReplyPayload = {
    /** Reply text that may carry hidden reasoning markers. */
    text?: string;
    /** Explicit reasoning flag from upstream payload producers. */
    isReasoning?: boolean;
};
/** Derived sendability facts for text/media outbound payload delivery. */
export type SendableOutboundReplyParts = {
    /** Raw text selected for delivery before trimming. */
    text: string;
    /** Text after trimming whitespace for sendability checks. */
    trimmedText: string;
    /** Normalized non-empty media URLs. */
    mediaUrls: string[];
    /** Number of normalized media URLs. */
    mediaCount: number;
    /** Whether trimmed text is sendable. */
    hasText: boolean;
    /** Whether at least one media URL is sendable. */
    hasMedia: boolean;
    /** Whether the payload has any sendable text or media. */
    hasContent: boolean;
};
type SendPayloadContext = Parameters<NonNullable<ChannelOutboundAdapter["sendPayload"]>>[0];
type SendPayloadResult = Awaited<ReturnType<NonNullable<ChannelOutboundAdapter["sendPayload"]>>>;
type SendPayloadAdapter = Pick<ChannelOutboundAdapter, "sendMedia" | "sendText" | "chunker" | "textChunkLimit">;
/** Detect reasoning replies from explicit flags or common reasoning text prefixes. */
export declare function isReasoningReplyPayload(payload: ReasoningReplyPayload): boolean;
/** Extract the supported outbound reply fields from loose tool or agent payload objects. */
export declare function normalizeOutboundReplyPayload(payload: Record<string, unknown>): OutboundReplyPayload;
/** Wrap a deliverer so callers can hand it arbitrary payloads while channels receive normalized data. */
export declare function createNormalizedOutboundDeliverer(handler: (payload: OutboundReplyPayload) => Promise<void>): (payload: unknown) => Promise<void>;
/** Prefer multi-attachment payloads, then fall back to the legacy single-media field. */
export declare function resolveOutboundMediaUrls(payload: {
    mediaUrls?: string[];
    mediaUrl?: string;
}): string[];
/** Resolve media URLs from a channel sendPayload context after legacy fallback normalization. */
export declare function resolvePayloadMediaUrls(payload: SendPayloadContext["payload"]): string[];
/** Count outbound media items after legacy single-media fallback normalization. */
export declare function countOutboundMedia(payload: {
    mediaUrls?: string[];
    mediaUrl?: string;
}): number;
/** Check whether an outbound payload includes any media after normalization. */
export declare function hasOutboundMedia(payload: {
    mediaUrls?: string[];
    mediaUrl?: string;
}): boolean;
/** Check whether an outbound payload includes text, optionally trimming whitespace first. */
export declare function hasOutboundText(payload: {
    text?: string;
}, options?: {
    trim?: boolean;
}): boolean;
/** Check whether an outbound payload includes any sendable text, media, or rich reply content. */
export declare function hasOutboundReplyContent(payload: {
    text?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    presentation?: unknown;
    interactive?: unknown;
    channelData?: unknown;
}, options?: {
    trimText?: boolean;
}): boolean;
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
export declare function resolveSendableOutboundReplyParts(payload: {
    text?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
}, options?: {
    text?: string;
}): SendableOutboundReplyParts;
/** Preserve caller-provided chunking, but fall back to the full text when chunkers return nothing. */
export declare function resolveTextChunksWithFallback(text: string, chunks: readonly string[]): string[];
/** Send media-first payloads intact, or chunk text-only payloads through the caller's transport hooks. */
export declare function sendPayloadWithChunkedTextAndMedia<TContext extends {
    payload: object;
}, TResult>(params: {
    /** Caller context containing the loose outbound payload. */
    ctx: TContext;
    /** Text length limit passed to the chunker for text-only payloads. */
    textChunkLimit?: number;
    /** Optional text chunker used only when no media URLs are present. */
    chunker?: ((text: string, limit: number) => string[]) | null;
    /** Transport hook for text-only chunks. */
    sendText: (ctx: TContext & {
        text: string;
    }) => Promise<TResult>;
    /** Transport hook for media sends; first media receives the caption text. */
    sendMedia: (ctx: TContext & {
        text: string;
        mediaUrl: string;
    }) => Promise<TResult>;
    /** Result returned when payload has neither text nor media. */
    emptyResult: TResult;
}): Promise<TResult>;
/** Sends a media sequence with caption text on the first item and returns the last send result. */
export declare function sendPayloadMediaSequence<TResult>(params: {
    /** Caption text attached to the first non-empty media URL only. */
    text: string;
    /** Ordered media URLs to send, with empty entries skipped. */
    mediaUrls: readonly string[];
    send: (input: {
        /** Caption text for the first media send, otherwise empty. */
        text: string;
        /** Media URL for this send. */
        mediaUrl: string;
        /** Original index in `mediaUrls`. */
        index: number;
        /** Whether this is the first media entry in the original sequence. */
        isFirst: boolean;
    }) => Promise<TResult>;
}): Promise<TResult | undefined>;
/** Sends a media sequence or returns a fallback when no media send produces a result. */
export declare function sendPayloadMediaSequenceOrFallback<TResult>(params: {
    /** Caption text attached to the first non-empty media URL only. */
    text: string;
    /** Ordered media URLs to send, with empty entries skipped. */
    mediaUrls: readonly string[];
    send: (input: {
        text: string;
        mediaUrl: string;
        index: number;
        isFirst: boolean;
    }) => Promise<TResult>;
    /** Result returned when no media result is available. */
    fallbackResult: TResult;
    /** Optional callback used instead of `fallbackResult` when there are no media URLs. */
    sendNoMedia?: () => Promise<TResult>;
}): Promise<TResult>;
/** Sends media when present, then always runs finalization and returns its result. */
export declare function sendPayloadMediaSequenceAndFinalize<TMediaResult, TResult>(params: {
    /** Caption text attached to the first non-empty media URL only. */
    text: string;
    /** Ordered media URLs to send before finalization. */
    mediaUrls: readonly string[];
    send: (input: {
        text: string;
        mediaUrl: string;
        index: number;
        isFirst: boolean;
    }) => Promise<TMediaResult>;
    /** Final callback whose result is returned after optional media sends. */
    finalize: () => Promise<TResult>;
}): Promise<TResult>;
/** Sends normalized text/media payloads through a channel outbound adapter. */
export declare function sendTextMediaPayload(params: {
    /** Channel id used in the empty fallback result. */
    channel: string;
    /** Channel send payload context. */
    ctx: SendPayloadContext;
    /** Adapter transport hooks for text, media, and optional chunking. */
    adapter: SendPayloadAdapter;
}): Promise<SendPayloadResult>;
/** Detect numeric-looking target ids for channels that distinguish ids from handles. */
export declare function isNumericTargetId(raw: string): boolean;
/** Append attachment links to plain text when the channel cannot send media inline. */
export declare function formatTextWithAttachmentLinks(text: string | undefined, mediaUrls: string[]): string;
/** Send a caption with only the first media item, mirroring caption-limited channel transports. */
export declare function sendMediaWithLeadingCaption(params: {
    mediaUrls: string[];
    caption: string;
    send: (payload: {
        mediaUrl: string;
        caption?: string;
    }) => Promise<void>;
    onError?: (params: {
        error: unknown;
        mediaUrl: string;
        caption?: string;
        index: number;
        isFirst: boolean;
    }) => Promise<void> | void;
}): Promise<boolean>;
/** Deliver media with leading caption when possible, otherwise fall back to chunked text. */
export declare function deliverTextOrMediaReply(params: {
    payload: OutboundReplyPayload;
    text: string;
    chunkText?: (text: string) => readonly string[];
    sendText: (text: string) => Promise<void>;
    sendMedia: (payload: {
        mediaUrl: string;
        caption?: string;
    }) => Promise<void>;
    onMediaError?: (params: {
        error: unknown;
        mediaUrl: string;
        caption?: string;
        index: number;
        isFirst: boolean;
    }) => Promise<void> | void;
}): Promise<"empty" | "text" | "media">;
/** Send text with attachment links appended for channels without native media upload. */
export declare function deliverFormattedTextWithAttachments(params: {
    payload: OutboundReplyPayload;
    send: (params: {
        text: string;
        replyToId?: string;
    }) => Promise<void>;
}): Promise<boolean>;
