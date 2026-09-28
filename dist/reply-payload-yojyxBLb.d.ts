import "./templating-OpWn1DzT.js";
import { h as ReplyPayload$1 } from "./reply-payload-Dv0rYqXd.js";
import { i as MediaFactLegacyProjection, n as MediaFact } from "./media-facts-BUTxYH1x.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-HYq1MKG1.js";
//#region src/channels/plugins/media-payload.d.ts
/** Input media item used by channel outbound payload builders. */
type MediaPayloadInput = Required<Pick<MediaFact, "path">> & Pick<MediaFact, "contentType">;
/**
 * Legacy-compatible media payload shape consumed by plugin send helpers.
 * @deprecated Inbound contexts use `media`; outbound replies use lowercase
 * `ReplyPayload.mediaUrl`/`mediaUrls`.
 */
type MediaPayload = Omit<MediaFactLegacyProjection, "MediaTranscribedIndexes">;
/**
 * Builds single-item and list legacy media fields.
 * @deprecated Inbound contexts use `media`; outbound replies use lowercase
 * `ReplyPayload.mediaUrl`/`mediaUrls`.
 */
declare function buildMediaPayload(mediaList: MediaPayloadInput[], opts?: {
  preserveMediaTypeCardinality?: boolean;
}): MediaPayload;
//#endregion
//#region src/plugin-sdk/reply-payload.d.ts
/** Plugin-facing reply payload without core-only trusted local media internals. */
type ReplyPayload = Omit<ReplyPayload$1, "trustedLocalMedia">;
type AskUserQuestionOptionIndices = ReadonlyMap<string, ReadonlyMap<string, number>>;
/** Read bounded Gateway-owned option ordering for one native ask_user question. */
declare function resolveAskUserQuestionOptionIndices(payload: Pick<ReplyPayload, "channelData">): AskUserQuestionOptionIndices | undefined;
/** Match one presented choice to its Gateway-owned option index. */
declare function resolveAskUserQuestionOptionIndex(params: {
  questionOptionIndices?: AskUserQuestionOptionIndices;
  questionId: string;
  optionValue: string;
}): number | undefined;
/** Normalized outbound reply payload accepted by channel send helpers. */
type OutboundReplyPayload = {
  /** Plain text reply body. */
  text?: string;
  /** Visible body a channel adapter may use when native structured content requires text. */
  fallbackText?: {
    text: string;
    /** Batch payload replaced when the adapter adopts this fallback body. */
    replacesPayloadIndex?: number;
  };
  /** Ordered media attachments for channels that can send multiple media items. */
  mediaUrls?: string[];
  /** Legacy single media attachment. */
  mediaUrl?: string;
  /** Rich presentation payload for channels that support structured replies. */
  presentation?: ReplyPayload$1["presentation"];
  /**
   * @deprecated Use presentation. Runtime support remains for legacy producers.
   */
  interactive?: ReplyPayload$1["interactive"];
  /** Channel-specific opaque data forwarded to outbound adapters. */
  channelData?: ReplyPayload$1["channelData"];
  /** Marks media as sensitive for channel-specific spoiler/safety handling. */
  sensitiveMedia?: boolean;
  /** Platform message id that the outbound reply should target when supported. */
  replyToId?: string;
  /** Portable geographic location or named place. */
  location?: ReplyPayload$1["location"];
  /** Ask supporting channels to render video media as a round video note. */
  videoAsNote?: boolean;
};
/** Minimal payload shape used to identify reasoning/thinking replies. */
type ReasoningReplyPayload = {
  /** Reply text that may carry hidden reasoning markers. */
  text?: string;
  /** Explicit reasoning flag from upstream payload producers. */
  isReasoning?: boolean;
  /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
};
type SendPayloadContext = Parameters<NonNullable<ChannelOutboundAdapter["sendPayload"]>>[0];
type SendPayloadResult = Awaited<ReturnType<NonNullable<ChannelOutboundAdapter["sendPayload"]>>>;
type SendPayloadAdapter = Pick<ChannelOutboundAdapter, "sendMedia" | "sendText" | "chunker" | "textChunkLimit">;
/** Detect reasoning replies from explicit flags or common reasoning text prefixes. */
declare function isReasoningReplyPayload(payload: ReasoningReplyPayload): boolean;
/** Extract the supported outbound reply fields from loose tool or agent payload objects. */
declare function normalizeOutboundReplyPayload(payload: Record<string, unknown>): OutboundReplyPayload;
/** Wrap a deliverer so callers can hand it arbitrary payloads while channels receive normalized data. */
declare function createNormalizedOutboundDeliverer(handler: (payload: OutboundReplyPayload) => Promise<void>): (payload: unknown) => Promise<void>;
/** Resolve media URLs from a channel sendPayload context after legacy fallback normalization. */
declare function resolvePayloadMediaUrls(payload: SendPayloadContext["payload"]): string[];
/** Check whether an outbound payload includes any sendable text, media, or rich reply content. */
declare function hasOutboundReplyContent(payload: {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
  presentation?: unknown;
  interactive?: unknown;
  channelData?: unknown;
}, options?: {
  trimText?: boolean;
}): boolean;
/** Preserve caller-provided chunking, but fall back to the full text when chunkers return nothing. */
declare function resolveTextChunksWithFallback(text: string, chunks: readonly string[]): string[];
/** Send media-first payloads intact, or chunk text-only payloads through the caller's transport hooks. */
declare function sendPayloadWithChunkedTextAndMedia<TContext extends {
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
  /** Host callback that persists each completed sub-send before the next one starts. */
  onResult?: (result: TResult) => Promise<void> | void;
}): Promise<TResult>;
/**
 * Sends non-empty media URLs with caption text on the first actual send.
 * Returns the last send result, or undefined when every URL is empty.
 */
declare function sendPayloadMediaSequence<TResult>(params: {
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
    /** Whether this is the first non-empty media entry sent. */
    isFirst: boolean;
  }) => Promise<TResult>;
  /** Called after each successful media send and before the next send starts. */
  onResult?: (result: TResult) => Promise<void> | void;
}): Promise<TResult | undefined>;
/** Sends text chunks sequentially and returns the last send result. */
declare function sendPayloadTextChunkSequence<TResult>(params: {
  /** Ordered text chunks to send. */
  chunks: readonly string[];
  send: (input: {
    text: string;
    index: number;
    isFirst: boolean;
  }) => Promise<TResult>;
  /** Called after each successful chunk send and before the next send starts. */
  onResult?: (result: TResult) => Promise<void> | void;
}): Promise<TResult | undefined>;
/** Sends a media sequence or returns a fallback when no media item is sent. */
declare function sendPayloadMediaSequenceOrFallback<TResult>(params: {
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
  onResult?: (result: TResult) => Promise<void> | void;
  /** Result returned when no media item is sent. */
  fallbackResult: TResult;
  /** Optional callback used instead of `fallbackResult` when no media item is sent. */
  sendNoMedia?: () => Promise<TResult>;
}): Promise<TResult>;
/** Sends media when present, then always runs finalization and returns its result. */
declare function sendPayloadMediaSequenceAndFinalize<TMediaResult, TResult>(params: {
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
  onResult?: (result: TMediaResult) => Promise<void> | void;
  /** Final callback whose result is returned after optional media sends. */
  finalize: () => Promise<TResult>;
}): Promise<TResult>;
/** Sends normalized text/media payloads through a channel outbound adapter. */
declare function sendTextMediaPayload(params: {
  /** Channel id used in the empty fallback result. */
  channel: string;
  /** Channel send payload context. */
  ctx: SendPayloadContext;
  /** Adapter transport hooks for text, media, and optional chunking. */
  adapter: SendPayloadAdapter;
}): Promise<SendPayloadResult>;
/** Detect numeric-looking target ids for channels that distinguish ids from handles. */
declare function isNumericTargetId(raw: string): boolean;
/** Append attachment links to plain text when the channel cannot send media inline. */
declare function formatTextWithAttachmentLinks(text: string | undefined, mediaUrls: string[]): string;
/** Send a caption with only the first media item, mirroring caption-limited channel transports. */
declare function sendMediaWithLeadingCaption(params: {
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
declare function deliverTextOrMediaReply(params: {
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
declare function deliverFormattedTextWithAttachments(params: {
  payload: OutboundReplyPayload;
  send: (params: {
    text: string;
    replyToId?: string;
  }) => Promise<void>;
}): Promise<boolean>;
//#endregion
export { sendTextMediaPayload as C, buildMediaPayload as E, sendPayloadWithChunkedTextAndMedia as S, MediaPayloadInput as T, sendMediaWithLeadingCaption as _, createNormalizedOutboundDeliverer as a, sendPayloadMediaSequenceOrFallback as b, formatTextWithAttachmentLinks as c, isReasoningReplyPayload as d, normalizeOutboundReplyPayload as f, resolveTextChunksWithFallback as g, resolvePayloadMediaUrls as h, ReplyPayload as i, hasOutboundReplyContent as l, resolveAskUserQuestionOptionIndices as m, OutboundReplyPayload as n, deliverFormattedTextWithAttachments as o, resolveAskUserQuestionOptionIndex as p, ReasoningReplyPayload as r, deliverTextOrMediaReply as s, AskUserQuestionOptionIndices as t, isNumericTargetId as u, sendPayloadMediaSequence as v, MediaPayload as w, sendPayloadTextChunkSequence as x, sendPayloadMediaSequenceAndFinalize as y };