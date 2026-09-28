import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { C as ReplyToMode, S as MarkdownTableMode } from "./types.base-CA0_JvyZ.js";
import "./types-BnfxNjkF.js";
import { h as ReplyPayload } from "./reply-payload-Dv0rYqXd.js";
import { n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
import { M as ReplyPayloadDeliveryPin, f as MessagePresentation } from "./payload-Co5fPRVS.js";
import { t as OutboundMediaAccess } from "./load-options-BwtyeSvQ.js";
import { C as ChannelOutboundTargetMode, T as ChannelPollResult, w as ChannelPollContext } from "./types.core-D1MQo5ra.js";
import { A as OutboundSendDeps } from "./types-DOAIO5Ze.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { r as OutboundDeliveryResult } from "./deliver-types-CDKM8xJ_.js";
//#region src/auto-reply/chunk.d.ts
type TextChunkProvider = ChannelId;
/**
 * Chunking mode for outbound messages:
 * - "length": Split only when exceeding textChunkLimit (default)
 * - "newline": Prefer breaking on "soft" boundaries. Historically this split on every
 *   newline; now it only breaks on paragraph boundaries (blank lines) unless the text
 *   exceeds the length limit.
 */
type ChunkMode = "length" | "newline";
declare function resolveTextChunkLimit(cfg: OpenClawConfig | undefined, provider?: TextChunkProvider, accountId?: string | null, opts?: {
  fallbackLimit?: number;
}): number;
declare function resolveChunkMode(cfg: OpenClawConfig | undefined, provider?: TextChunkProvider, accountId?: string | null): ChunkMode;
/**
 * Split text on newlines, trimming line whitespace.
 * Blank lines are folded into the next non-empty line as leading "\n" prefixes.
 * Leading and trailing blank lines are capped to the available UTF-16 space.
 * Long lines can be split by length (default) or kept intact via splitLongLines:false.
 */
declare function chunkByNewline(text: string, maxLineLength: number, opts?: {
  splitLongLines?: boolean;
  trimLines?: boolean;
  isSafeBreak?: (index: number) => boolean;
}): string[];
/**
 * Split text into chunks on paragraph boundaries (blank lines), preserving lists and
 * single-newline line wraps inside paragraphs.
 *
 * - Only breaks at paragraph separators ("\n\n" or more, allowing whitespace on blank lines)
 * - Packs multiple paragraphs into a single chunk up to `limit`
 * - Falls back to length-based splitting when a single paragraph exceeds `limit`
 *   (unless `splitLongParagraphs` is disabled)
 */
declare function chunkByParagraph(text: string, limit: number, opts?: {
  splitLongParagraphs?: boolean;
}): string[];
/**
 * Unified chunking function that dispatches based on mode.
 */
declare function chunkTextWithMode(text: string, limit: number, mode: ChunkMode): string[];
declare function chunkMarkdownTextWithMode(text: string, limit: number, mode: ChunkMode): string[];
declare function chunkText(text: string, limit: number): string[];
declare function chunkMarkdownText(text: string, limit: number): string[];
//#endregion
//#region src/infra/outbound/formatting.d.ts
/**
 * Formatting and chunking hints carried through outbound delivery planning.
 */
type OutboundDeliveryFormattingOptions = {
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  parseMode?: "HTML";
};
//#endregion
//#region src/infra/outbound/identity-types.d.ts
/** Agent identity metadata that outbound channels can render with a message. */
type OutboundIdentity = {
  name?: string;
  avatarUrl?: string;
  emoji?: string;
  theme?: string;
};
//#endregion
//#region src/channels/plugins/outbound.types.d.ts
type ChannelOutboundContext = {
  cfg: OpenClawConfig;
  to: string;
  text: string;
  mediaUrl?: string;
  audioAsVoice?: boolean;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  gifPlayback?: boolean;
  /** Send image, GIF, or video as document to avoid channel compression. */
  forceDocument?: boolean;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  threadId?: string | number | null;
  accountId?: string | null;
  identity?: OutboundIdentity;
  deps?: OutboundSendDeps;
  silent?: boolean;
  /** Live cancellation signal; check before each physical send and after awaited preparation. */
  signal?: AbortSignal;
  gatewayClientScopes?: readonly string[];
  /** @internal Opaque durable intent id for exact provider-side send reconciliation. */
  deliveryQueueId?: string;
  /** @internal Stable platform-send index within one durable payload. */
  deliveryPartIndex?: number;
  /** @internal Exact platform-send count within one durable payload. */
  deliveryPartCount?: number;
  /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string;
  /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** @internal Synchronously fence custody after refresh and immediately before provider I/O. */
  assertDirectAdapterHandoff?: () => void;
  /** @internal Report each completed platform sub-send before starting another fallible step. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
};
type ChannelOutboundPayloadContext = ChannelOutboundContext & {
  payload: ReplyPayload;
};
type ChannelPresentationCapabilities = {
  /** Whether the channel accepts structured presentation payloads at all. */
  supported?: boolean;
  /** Whether the channel can render button action blocks natively. */
  buttons?: boolean;
  /** Whether the channel can render select/menu blocks natively. */
  selects?: boolean;
  /** Whether the channel can render low-emphasis context blocks natively. */
  context?: boolean;
  /** Whether the channel can render divider blocks natively. */
  divider?: boolean;
  /** Whether the channel can render chart blocks natively. */
  charts?: boolean;
  /** Whether the channel can render table blocks natively. */
  tables?: boolean;
  /** Per-channel limits used to adapt portable presentation blocks before rendering. */
  limits?: {
    actions?: {
      /** Maximum total button/select actions in one message. */
      maxActions?: number;
      /** Maximum buttons per rendered action row. */
      maxActionsPerRow?: number;
      /** Maximum action rows in one message. */
      maxRows?: number;
      /** Maximum user-visible button label length. */
      maxLabelLength?: number;
      /** Maximum callback/action value size in UTF-8 bytes. */
      maxValueBytes?: number;
      /** Whether action styles such as primary or danger are preserved. */
      supportsStyles?: boolean;
      /** Whether disabled button state is preserved. */
      supportsDisabled?: boolean;
      /** Whether priority/layout hints affect native rendering. */
      supportsLayoutHints?: boolean;
    };
    selects?: {
      /** Maximum options in one select/menu block. */
      maxOptions?: number;
      /** Maximum user-visible option label length. */
      maxLabelLength?: number;
      /** Maximum option callback value size in UTF-8 bytes. */
      maxValueBytes?: number;
    };
    text?: {
      /** Maximum text length for title, text, and context blocks. */
      maxLength?: number;
      /** Unit used by maxLength. Defaults to Unicode code points. */
      encoding?: "characters" | "utf8-bytes" | "utf16-units";
      /** Markdown dialect understood by rendered text blocks. */
      markdownDialect?: "plain" | "markdown" | "html" | "slack-mrkdwn" | "discord-markdown";
      /** Whether the channel can edit presentation text in-place. */
      supportsEdit?: boolean;
    };
  };
};
type ChannelDeliveryCapabilities = {
  pin?: boolean;
  durableFinal?: {
    text?: boolean;
    media?: boolean;
    poll?: boolean;
    payload?: boolean;
    silent?: boolean;
    replyTo?: boolean;
    thread?: boolean;
    nativeQuote?: boolean;
    messageSendingHooks?: boolean;
    batch?: boolean;
    reconcileUnknownSend?: boolean;
    afterSendSuccess?: boolean;
    afterCommit?: boolean;
  };
};
type ChannelOutboundPayloadHint = {
  kind: "approval-pending";
  approvalKind: ChannelApprovalKind;
  nativeRouteActive?: boolean;
} | {
  kind: "approval-resolved";
  approvalKind: ChannelApprovalKind;
};
type ChannelOutboundTargetRef = {
  channel: string;
  to: string;
  accountId?: string | null;
  threadId?: string | number | null;
};
type ChannelOutboundFormattedContext = ChannelOutboundContext & {
  abortSignal?: AbortSignal;
};
type ChannelOutboundChunkContext = {
  formatting?: OutboundDeliveryFormattingOptions;
};
type ChannelOutboundNormalizePayloadParams = {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ChannelOutboundNormalizePayloadBatchParams = {
  payloads: readonly {
    index: number;
    payload: ReplyPayload;
  }[];
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ChannelOutboundAdapter = {
  deliveryMode: "direct" | "gateway" | "hybrid";
  chunker?: ((text: string, limit: number, ctx?: ChannelOutboundChunkContext) => string[]) | null;
  chunkerMode?: "text" | "markdown";
  chunkedTextFormatting?: OutboundDeliveryFormattingOptions;
  /** Lift remote Markdown image syntax in text into outbound media attachments. */
  extractMarkdownImages?: boolean;
  /** Preserve model-authored Markdown details blocks for a native channel renderer. */
  preserveMarkdownDetails?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean;
  textChunkLimit?: number;
  /**
   * Reserve the exact provider id used by the next single-message send.
   * Presence opts the channel into conversations_turn reply correlation.
   */
  prepareConversationTurnMessageId?: (params: {
    cfg: OpenClawConfig;
    to: string;
    text: string;
    accountId?: string | null;
    threadId?: string | number | null;
  }) => string;
  sanitizeText?: (params: {
    text: string;
    payload: ReplyPayload;
    cfg?: OpenClawConfig;
    accountId?: string;
  }) => string;
  pollMaxOptions?: number;
  supportsPollDurationSeconds?: boolean;
  supportsAnonymousPolls?: boolean;
  normalizePayload?: (params: ChannelOutboundNormalizePayloadParams) => ReplyPayload | null;
  /** Normalize an ordered batch in place. Return one entry per input; null suppresses that send. */
  normalizePayloadBatch?: (params: ChannelOutboundNormalizePayloadBatchParams) => ReadonlyArray<ReplyPayload | null>;
  sendTextOnlyErrorPayloads?: boolean;
  /**
   * Route ordinary multi-media payloads intact to sendPayload for native grouping.
   * The adapter must check cancellation and revalidate authority before every physical send.
   */
  sendPayloadGroupsMedia?: boolean;
  shouldSkipPlainTextSanitization?: (params: {
    payload: ReplyPayload;
  }) => boolean;
  resolveEffectiveTextChunkLimit?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    fallbackLimit?: number;
    formatting?: OutboundDeliveryFormattingOptions;
  }) => number | undefined;
  shouldSuppressLocalPayloadPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    payload: ReplyPayload;
    hint?: ChannelOutboundPayloadHint;
  }) => boolean;
  beforeDeliverPayload?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    payload: ReplyPayload;
    hint?: ChannelOutboundPayloadHint;
  }) => Promise<void> | void;
  afterDeliverPayload?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    payload: ReplyPayload;
    results: readonly OutboundDeliveryResult[];
  }) => Promise<void> | void;
  /** Adopt a provider-created thread for later payloads in the same durable batch. */
  adoptTargetFromDelivery?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    result: OutboundDeliveryResult;
  }) => {
    threadId: string | number;
  } | null | undefined;
  /** Channel-advertised presentation features and limits used by core adaptation. */
  presentationCapabilities?: ChannelPresentationCapabilities;
  /**
   * Account- and formatting-aware capability resolution; takes precedence over
   * the static declaration. Formatting is the delivery's outbound formatting
   * options, so capabilities that only apply to one text funnel (for example
   * rich tables on the markdown path) can turn off for HTML-mode sends.
   */
  resolvePresentationCapabilities?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    formatting?: OutboundDeliveryFormattingOptions;
  }) => ChannelPresentationCapabilities;
  deliveryCapabilities?: ChannelDeliveryCapabilities;
  /** Render an adapted portable presentation into channel-native payload data. */
  renderPresentation?: (params: {
    payload: ReplyPayload;
    presentation: MessagePresentation;
    /** Normalized original for readable fallbacks; native rendering uses presentation. */
    sourcePresentation?: MessagePresentation;
    ctx: ChannelOutboundPayloadContext;
  }) => Promise<ReplyPayload | null> | ReplyPayload | null;
  pinDeliveredMessage?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    messageId: string;
    pin: ReplyPayloadDeliveryPin;
    gatewayClientScopes?: readonly string[];
    /** @internal Revalidate the delivery owner after preparation and before each provider request. */
    assertDirectAdapterHandoff?: () => void;
  }) => Promise<void> | void;
  /**
   * @deprecated Use shouldTreatDeliveredTextAsVisible instead.
   */
  shouldTreatRoutedTextAsVisible?: (params: {
    kind: "tool" | "block" | "final";
    text?: string;
  }) => boolean;
  shouldTreatDeliveredTextAsVisible?: (params: {
    kind: "tool" | "block" | "final";
    text?: string;
  }) => boolean;
  preferFinalAssistantVisibleText?: boolean;
  targetsMatchForReplySuppression?: (params: {
    originTarget: string;
    targetKey: string;
    targetThreadId?: string;
  }) => boolean;
  resolveTarget?: (params: {
    cfg?: OpenClawConfig;
    to?: string;
    allowFrom?: string[];
    accountId?: string | null;
    mode?: ChannelOutboundTargetMode;
  }) => {
    ok: true;
    to: string;
  } | {
    ok: false;
    error: Error;
  };
  sendPayload?: (ctx: ChannelOutboundPayloadContext) => Promise<OutboundDeliveryResult>;
  sendFormattedText?: (ctx: ChannelOutboundFormattedContext) => Promise<OutboundDeliveryResult[]>;
  sendFormattedMedia?: (ctx: ChannelOutboundFormattedContext & {
    mediaUrl: string;
  }) => Promise<OutboundDeliveryResult>;
  sendText?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
  sendMedia?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
  sendPoll?: (ctx: ChannelPollContext) => Promise<ChannelPollResult>;
};
//#endregion
export { ChannelPresentationCapabilities as a, ChunkMode as c, chunkMarkdownText as d, chunkMarkdownTextWithMode as f, resolveTextChunkLimit as g, resolveChunkMode as h, ChannelOutboundPayloadHint as i, chunkByNewline as l, chunkTextWithMode as m, ChannelOutboundAdapter as n, OutboundIdentity as o, chunkText as p, ChannelOutboundContext as r, OutboundDeliveryFormattingOptions as s, ChannelDeliveryCapabilities as t, chunkByParagraph as u };