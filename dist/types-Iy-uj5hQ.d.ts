import { t as FastMode } from "./string-coerce-DJnd-JG-.js";
import { T as ReplyToMode } from "./types.base-iHeWRS8q.js";
import { l as ImageContent } from "./types-Boa_mcGH.js";
import { s as AgentMessage } from "./types-BoFHdU9q.js";
import { c as MessagePresentation, n as InteractiveReply, x as ReplyPayloadDelivery } from "./payload-BHJeg3MX.js";

//#region src/auto-reply/reply-payload.d.ts
/** Channel-agnostic assistant reply payload. */
type ReplyPayload = {
  text?: string;
  mediaUrl?: string;
  mediaUrls?: string[]; /** Internal-only trust signal for gateway webchat local media embedding. */
  trustedLocalMedia?: boolean; /** Treat media as live-only content and avoid persisting the underlying media reference. */
  sensitiveMedia?: boolean; /** Channel-agnostic rich presentation. Core degrades or asks the channel renderer to map it. */
  presentation?: MessagePresentation; /** Channel-agnostic delivery preferences, e.g. pin the sent message when supported. */
  delivery?: ReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   *
   * Internal legacy representation used by existing approval/reply helpers during migration.
   */
  interactive?: InteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean; /** True when [[reply_to_current]] was present but not yet mapped to a message id. */
  replyToCurrent?: boolean; /** Send audio as voice message (bubble) instead of audio file. Defaults to false. */
  audioAsVoice?: boolean;
  /**
   * Text synthesized into an audio-only TTS payload. Exposed to hooks for
   * archival/search use when no visible channel text is sent.
   */
  spokenText?: string;
  /**
   * Marks a TTS media payload as supplemental audio for assistant text that is
   * already visible through streaming or transcript projection.
   */
  ttsSupplement?: ReplyPayloadTtsSupplement;
  isError?: boolean;
  /** Marks this payload as a reasoning/thinking block. Channels that do not
   *  have a dedicated reasoning lane (e.g. WhatsApp, web) should suppress it. */
  isReasoning?: boolean; /** Reasoning stream text is a complete replacement snapshot, not a delta. */
  isReasoningSnapshot?: boolean;
  /** Marks this payload as a compaction status notice (start/end).
   *  Should be excluded from TTS transcript accumulation so compaction
   *  status lines are not synthesised into the spoken assistant reply. */
  isCompactionNotice?: boolean; /** Marks this payload as a model-fallback transition/recovery notice. */
  isFallbackNotice?: boolean; /** Marks this payload as transient status, not assistant answer content. */
  isStatusNotice?: boolean; /** Channel-specific payload data (per-channel envelope). */
  channelData?: Record<string, unknown>;
};
/** Metadata for fast-auto progress notices. */
declare const FAST_MODE_AUTO_PROGRESS_KIND = "fast-mode-auto";
declare function isFastModeAutoProgressPayload(payload: Pick<ReplyPayload, "channelData">): boolean;
/** Metadata for audio-only media that supplements already-visible assistant text. */
type ReplyPayloadTtsSupplement = {
  spokenText: string;
  visibleTextAlreadyDelivered?: boolean;
};
/** Reply policy facts that provider adapters use to resolve the final transport route. */
type ReplyDeliveryContext = {
  chatType?: "direct" | "group" | "channel" | null;
  replyToMode: ReplyToMode;
};
/** Returns normalized TTS supplement metadata only when the payload has media to carry it. */
declare function getReplyPayloadTtsSupplement(payload: Pick<ReplyPayload, "mediaUrl" | "mediaUrls" | "ttsSupplement">): ReplyPayloadTtsSupplement | undefined;
/** Returns true when the payload is a valid TTS supplement media payload. */
declare function isReplyPayloadTtsSupplement(payload: Pick<ReplyPayload, "mediaUrl" | "mediaUrls" | "ttsSupplement">): boolean;
/** Marks a reply payload as supplemental TTS media while preserving the original shape. */
declare function markReplyPayloadAsTtsSupplement<T extends ReplyPayload>(payload: T, spokenText?: string, options?: {
  visibleTextAlreadyDelivered?: boolean;
}): T;
/** Removes visible-only fields from a payload that should be delivered as TTS supplement media. */
declare function buildTtsSupplementMediaPayload(payload: ReplyPayload): ReplyPayload;
/** Returns true when a payload is the synthesized warning for a non-terminal tool error. */
declare function isReplyPayloadNonTerminalToolErrorWarning(payload: object): boolean;
//#endregion
//#region src/sessions/input-provenance.d.ts
declare const INPUT_PROVENANCE_KIND_VALUES: readonly ["external_user", "inter_session", "internal_system"];
type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];
type InputProvenance = {
  kind: InputProvenanceKind;
  originSessionId?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
};
//#endregion
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = {
  sessionId: string;
  updatedAt: number;
  sessionFile?: string;
  threadId?: string | number;
} & Record<string, unknown>;
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}>;
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptPersistenceTarget = {
  sessionId: string;
  sessionKey: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  sessionStore?: Record<string, UserTurnSessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptFileTarget = {
  transcriptPath: string;
  sessionId?: string;
  agentId?: string;
  sessionKey?: string;
  cwd?: string;
  config?: unknown;
};
type UserTurnTranscriptTarget = UserTurnTranscriptPersistenceTarget | UserTurnTranscriptFileTarget;
type UserTurnTranscriptPersistResult = {
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
//#region src/auto-reply/reply/typing.d.ts
/** Controller for channel typing indicator lifecycle during a reply run. */
type TypingController = {
  onReplyStart: () => Promise<void>;
  startTypingLoop: () => Promise<void>;
  startTypingOnText: (text?: string) => Promise<void>;
  refreshTypingTtl: () => void;
  isActive: () => boolean;
  markRunComplete: () => void;
  markDispatchIdle: () => void;
  cleanup: () => void;
};
//#endregion
//#region src/auto-reply/get-reply-options.types.d.ts
type BlockReplyContext = {
  abortSignal?: AbortSignal;
  timeoutMs?: number; /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
};
/** Context passed to onModelSelected callback with actual model used. */
type ModelSelectedContext = {
  provider: string;
  model: string;
  thinkLevel: string | undefined;
};
/** Typing indicator class for channel-owned UX policy. */
type TypingPolicy = "auto" | "user_message" | "system_event" | "internal_webchat" | "heartbeat";
/** Per-turn policy for source-message reply threading. */
type ReplyThreadingPolicy = {
  /** Override implicit reply-to-current behavior for the current turn. */implicitCurrentMessage?: "default" | "allow" | "deny";
};
type SourceReplyDeliveryMode = "automatic" | "message_tool_only";
/** Correlates queued reply ownership transfer with later delivery drains. */
type QueuedReplyDeliveryCorrelation = {
  begin: () => (() => void) | void;
};
/** Lifecycle hooks for queued follow-up replies. */
type QueuedReplyLifecycle = {
  onEnqueued?: () => void;
  onComplete?: () => void;
};
/** Partial assistant payload emitted during streaming or replacement updates. */
type PartialReplyPayload = Pick<ReplyPayload, "text" | "mediaUrls"> & {
  delta?: string;
  replace?: true;
};
/** Reply generation options shared by auto-reply, webchat, channels, and tests. */
type GetReplyOptions = {
  /** Override run id for agent events (defaults to random UUID). */runId?: string; /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string; /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal; /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[]; /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[]; /** Notifies when an agent run actually starts (useful for webchat command handling). */
  onAgentRunStart?: (runId: string) => void; /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  onReplyStart?: () => Promise<void> | void; /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void;
  isHeartbeat?: boolean; /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy; /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean; /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string; /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string; /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode; /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number; /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight"; /** If true, suppress tool error warning payloads for this run. */
  suppressToolErrorWarnings?: boolean; /** Dynamic form used when verbose progress visibility can change mid-run. */
  shouldSuppressToolErrorWarnings?: () => boolean | undefined; /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean; /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[]; /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean; /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean; /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<void> | void;
  onReasoningStream?: (payload: ReplyPayload) => Promise<void> | void; /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<void> | void; /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<void> | void;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<void> | void; /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<void> | void; /** Called when a concrete work item starts, updates, or completes. */
  onItemEvent?: (payload: {
    itemId?: string;
    toolCallId?: string;
    kind?: string;
    title?: string;
    name?: string;
    phase?: string;
    status?: string;
    summary?: string;
    progressText?: string;
    meta?: string;
    approvalId?: string;
    approvalSlug?: string;
  }) => Promise<void> | void; /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean; /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    steps?: string[];
    source?: string;
  }) => Promise<void> | void; /** Called when an approval becomes pending or resolves. */
  onApprovalEvent?: (payload: {
    phase?: string;
    kind?: string;
    status?: string;
    title?: string;
    itemId?: string;
    toolCallId?: string;
    approvalId?: string;
    approvalSlug?: string;
    command?: string;
    host?: string;
    reason?: string;
    scope?: "turn" | "session";
    message?: string;
  }) => Promise<void> | void; /** Called when command output streams or completes. */
  onCommandOutput?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    output?: string;
    status?: string;
    exitCode?: number | null;
    durationMs?: number;
    cwd?: string;
  }) => Promise<void> | void; /** Called when a patch completes with a file summary. */
  onPatchSummary?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
  }) => Promise<void> | void; /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<void> | void; /** Called when context auto-compaction completes. */
  onCompactionEnd?: () => Promise<void> | void;
  /** Called when the actual model is selected (including after fallback).
   * Use this to get model/provider/thinkLevel for responsePrefix template interpolation. */
  onModelSelected?: (ctx: ModelSelectedContext) => void;
  /**
   * Controls whether normal assistant replies are automatically delivered to
   * the source conversation. `message_tool_only` prefers message-tool visible
   * delivery and keeps normal final text, block output, and preview output
   * private unless dispatch explicitly marks a source reply as deliverable.
   */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode; /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[]; /** Tracks ownership transfer when this turn later drains as a queued followup. */
  queuedFollowupLifecycle?: QueuedReplyLifecycle; /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean; /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void; /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean; /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number; /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[]; /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  }; /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
};
//#endregion
export { isReplyPayloadNonTerminalToolErrorWarning as _, SourceReplyDeliveryMode as a, PromptImageOrderEntry as c, ReplyDeliveryContext as d, ReplyPayload as f, isFastModeAutoProgressPayload as g, getReplyPayloadTtsSupplement as h, ReplyThreadingPolicy as i, InputProvenance as l, buildTtsSupplementMediaPayload as m, GetReplyOptions as n, TypingController as o, ReplyPayloadTtsSupplement as p, PartialReplyPayload as r, UserTurnTranscriptRecorder as s, BlockReplyContext as t, FAST_MODE_AUTO_PROGRESS_KIND as u, isReplyPayloadTtsSupplement as v, markReplyPayloadAsTtsSupplement as y };