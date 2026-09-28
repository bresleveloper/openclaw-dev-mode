import "./types.openclaw-LzSbb55e.js";
import { A as TextChunkMode, C as ReplyToMode, c as ChannelStreamingCommandTextMode, d as ChannelStreamingProgressConfig, i as BlockStreamingCoalesceConfig, k as StreamingMode } from "./types.base-CA0_JvyZ.js";
import { t as StreamingCompatEntry } from "./streaming-config-readers-BxX8qwrU.js";
import { f as MessagePresentation, j as ReplyPayloadDelivery, n as InteractiveReply } from "./payload-Co5fPRVS.js";
//#region src/channels/progress-draft-diffstat.d.ts
type ChannelProgressDraftDiffStat = Readonly<{
  files: number;
  added: number;
  removed: number;
}>;
declare function formatChannelProgressDraftDiffStat(diffStat: ChannelProgressDraftDiffStat | undefined): string | undefined;
//#endregion
//#region src/channels/progress-draft-lines.d.ts
type ChannelProgressDraftLine = {
  /** Stable line id used to update an existing progress line in place. */
  id?: string;
  /** Progress event family that produced this line. */
  kind: "tool" | "item" | "plan" | "approval" | "command-output" | "patch";
  /** Rendered line text before final draft truncation/prefix formatting. */
  text: string;
  /** Human-readable label for UI renderers. */
  label: string;
  /** Optional leading icon for rich or plain progress renderers. */
  icon?: string;
  /** Compact detail text separated from label/icon. */
  detail?: string;
  /** Optional lifecycle status, such as completed or exit code. */
  status?: string;
  /** Completion metadata for authored text; never rendered as a tool status. */
  complete?: boolean;
  /** Normalized tool name when the line represents tool work. */
  toolName?: string;
  /** Whether final formatting should add a bullet/line prefix. */
  prefix?: boolean;
};
/** Approvals and failures that can start a draft when their rows are visible. */
declare function isChannelProgressAttentionLine(line: string | ChannelProgressDraftLine): boolean;
//#endregion
//#region src/channels/streaming.d.ts
declare function isChannelProgressDraftWorkToolName(name: string | null | undefined): boolean;
type ChannelProgressLineOptions = {
  /** Whether generated tool details should use Markdown formatting. */
  markdown?: boolean;
  /** Detail shape for tool arguments shown in progress drafts. */
  detailMode?: "explain" | "raw";
  /** Whether command progress should show raw command text or status-only copy. */
  commandText?: ChannelStreamingCommandTextMode;
};
type AgentPlanStepStatus = "pending" | "in_progress" | "completed";
type AgentPlanStep = {
  step: string;
  status: AgentPlanStepStatus;
};
type AgentPlanStepInput = AgentPlanStep | string;
/**
 * TODO(remove): normalizes the pre-2026.7.2 string plan-step wire shape to
 * pending typed steps. Bundled producers all emit typed steps, and
 * @openclaw/codex is force-updated with core, so this only covers a plugin
 * pinned against an update. Delete once that cannot happen.
 */
declare function normalizeAgentPlanSteps(value: unknown): AgentPlanStep[] | undefined;
type ChannelProgressDraftLineInput = {
  event: "tool";
  itemId?: string;
  toolCallId?: string;
  name?: string;
  phase?: string;
  args?: Record<string, unknown>;
} | {
  event: "item";
  itemId?: string;
  toolCallId?: string;
  itemKind?: string;
  hideFromChannelProgress?: boolean;
  suppressChannelProgress?: boolean;
  title?: string;
  name?: string;
  phase?: string;
  status?: string;
  summary?: string;
  progressText?: string;
  meta?: string;
  commandBearing?: boolean;
} | {
  event: "plan";
  phase?: string;
  title?: string;
  explanation?: string;
  steps?: readonly AgentPlanStepInput[];
} | {
  event: "approval";
  approvalId?: string;
  phase?: string;
  title?: string;
  command?: string;
  reason?: string;
  message?: string;
} | {
  event: "command-output";
  itemId?: string;
  toolCallId?: string;
  phase?: string;
  title?: string;
  name?: string;
  status?: string;
  exitCode?: number | null;
} | {
  event: "patch";
  itemId?: string;
  toolCallId?: string;
  phase?: string;
  title?: string;
  name?: string;
  added?: string[];
  modified?: string[];
  deleted?: string[];
  summary?: string;
};
declare function formatChannelProgressDraftLine(
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): string | undefined;
declare function buildChannelProgressDraftLineForEntry(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined,
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
declare function formatChannelProgressDraftLineForEntry(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined,
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): string | undefined;
declare function buildChannelProgressDraftLine(
/** Structured progress event to normalize into draft-line metadata. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
declare function createChannelProgressDraftGate(params: {
  /** Callback that starts the channel progress draft. */
  onStart: () => void | Promise<void>;
  /** Delay after the first work event before a draft starts. */
  initialDelayMs?: number;
  /** Reports timer-fired startup failures, which have no awaiting caller. */
  onStartError?: (error: unknown) => void;
  /** Timer implementation, injectable for tests. */
  setTimeoutFn?: typeof setTimeout;
  /** Timer clearer, injectable for tests. */
  clearTimeoutFn?: typeof clearTimeout;
}): {
  readonly hasStarted: boolean;
  readonly workEvents: number;
  noteWork(): Promise<boolean>;
  startNow(): Promise<void>;
  cancel(): void;
  reset(): void;
};
declare function resolveChannelStreamingChunkMode(entry: StreamingCompatEntry | null | undefined): TextChunkMode | undefined;
declare function resolveChannelStreamingBlockEnabled(entry: StreamingCompatEntry | null | undefined): boolean | undefined;
declare function resolveChannelStreamingBlockEnabled(entry: StreamingCompatEntry | null | undefined, previewPolicy: {
  previewAvailable: boolean;
  blockStreamingDefault?: "off" | "on";
}): boolean;
declare function resolveChannelStreamingBlockCoalesce(entry: StreamingCompatEntry | null | undefined): BlockStreamingCoalesceConfig | undefined;
/**
 * The shipped SDK default keeps tool rows visible. Bundled callers pass their
 * mode-specific default so progress drafts can stay quiet.
 */
declare function resolveChannelStreamingPreviewToolProgress(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean,
/**
 * The channel's resolved stream mode. Only the caller knows it: channels pick
 * their own default when `streaming.mode` is unset (Telegram uses "progress",
 * Discord uses "off", and Slack uses "progress"), and this helper has no
 * channel identity to guess with. Omitting it reads the configured mode and
 * treats unset as "partial".
 */
mode?: StreamingMode): boolean;
declare function resolveChannelStreamingProgressCommentary(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean,
/**
 * The channel's resolved stream mode, for the same reason
 * resolveChannelStreamingPreviewToolProgress takes one: only the caller knows
 * which default applies when `streaming.mode` is unset. Guessing "partial"
 * here made `progress.commentary: true` a silent no-op on the progress-draft
 * channels, such as Telegram, whose own default is "progress".
 */
mode?: StreamingMode): boolean;
declare function resolveChannelStreamingProgressNarration(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean): boolean;
declare function resolveChannelStreamingPreviewCommandText(entry: StreamingCompatEntry | null | undefined, defaultValue?: ChannelStreamingCommandTextMode): ChannelStreamingCommandTextMode;
declare function resolveChannelStreamingSuppressDefaultToolProgressMessages(entry: StreamingCompatEntry | null | undefined, options?: {
  draftStreamActive?: boolean;
  mode?: StreamingMode;
  previewToolProgressEnabled?: boolean;
  previewStreamingEnabled?: boolean;
}): boolean;
declare function resolveChannelPreviewStreamMode(entry: StreamingCompatEntry | null | undefined, defaultMode: StreamingMode): StreamingMode;
declare function resolveChannelProgressDraftConfig(entry: StreamingCompatEntry | null | undefined): ChannelStreamingProgressConfig;
declare function resolveChannelProgressDraftMaxLines(entry: StreamingCompatEntry | null | undefined, defaultValue?: number): number;
declare function resolveChannelProgressDraftMaxLineChars(entry: StreamingCompatEntry | null | undefined, defaultValue?: number): number;
declare function compactChannelProgressDraftLine(line: string, maxChars: number): string;
declare function selectPlanChecklistSteps(steps: readonly AgentPlanStep[], options: {
  maxLines: number;
}): {
  steps: AgentPlanStep[];
  summary?: string;
};
declare function formatPlanChecklistLines(steps: readonly AgentPlanStep[], options: {
  maxLines: number;
  maxLineChars: number;
  /** @deprecated v2026.9.1 SDK option; retain until a breaking SDK release. */
  plain?: boolean;
}): string[];
declare function normalizeChannelProgressDraftLineIdentity(
/** Progress line whose duplicate/update identity should be normalized. */
line: string | ChannelProgressDraftLine | undefined): string;
declare function mergeChannelProgressDraftLine<TLine extends string | ChannelProgressDraftLine>(
/** Existing progress draft lines in display order. */
lines: TLine[],
/** New or updated progress line. */
line: TLine,
/** Merge limits for rolling progress drafts. */
params: {
  maxLines: number;
}): TLine[];
type ChannelProgressDraftTextParams = {
  /** @deprecated v2026.9.1 SDK presentation; retain until a breaking SDK release. */
  presentation?: "summary";
  /** Channel streaming config source for progress label and bounds. */
  entry?: StreamingCompatEntry | null;
  /** Ordered progress lines to render. */
  lines: Array<string | ChannelProgressDraftLine>;
  /** Stable seed used when choosing automatic progress labels. */
  seed?: string;
  /** Random source used when choosing automatic progress labels. */
  random?: () => number;
  /** Optional formatter applied after line compaction. */
  formatLine?: (line: string) => string;
  /** Literal transport encoding, applied after compaction to prepared plain text. */
  formatPlainText?: (text: string) => string;
  /** Exposes the same ordered blocks to native renderers without parsing composed text. */
  onPreparedBlocks?: (blocks: Array<{
    text: string;
    format: "plain" | "markdown";
  }>) => void;
  /** Prefix used for plain progress lines that lack their own icon. */
  bullet?: string;
  /** Status headline rendered above the plan and activity rows. */
  narration?: string;
  narrationFormat?: "plain";
  /** Latest full plan snapshot, rendered independently from rolling tool lines. */
  plan?: readonly AgentPlanStep[];
  diffStat?: ChannelProgressDraftDiffStat;
};
declare function formatChannelProgressDraftText(params: ChannelProgressDraftTextParams): string;
//#endregion
//#region src/channels/progress-draft-events.d.ts
type ChannelProgressDraftEventLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftEventLineBuilder = (input: ChannelProgressDraftLineInput, options?: ChannelProgressLineOptions) => ChannelProgressDraftEventLine | undefined;
//#endregion
//#region src/channels/progress-draft-compositor.types.d.ts
type ChannelProgressDraftCompositorLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftCompositorSnapshot = Readonly<{
  lines: readonly ChannelProgressDraftCompositorLine[];
  label?: string;
  statusHeadline?: string;
  statusHeadlineFormat?: "plain";
  plan?: readonly AgentPlanStep[];
  planExplanation?: string;
  planExplanationFormat?: "plain";
  preparedBlocks?: readonly {
    text: string;
    format: "plain" | "markdown";
  }[];
  diffStat?: ChannelProgressDraftDiffStat;
}>;
type ChannelProgressDraftUpdateOptions = {
  flush?: boolean;
  lines: readonly ChannelProgressDraftCompositorLine[];
  snapshot: ChannelProgressDraftCompositorSnapshot;
};
type ChannelProgressDraftCompositorParams = {
  /** @deprecated v2026.9.1 SDK presentation; retain until a breaking SDK release. */
  presentation?: "summary";
  entry: StreamingCompatEntry | null | undefined;
  /** Prepared items own display; raw callbacks retain diagnostic bookkeeping only. */
  preparedItems?: boolean;
  mode: StreamingMode;
  active: boolean;
  seed: string;
  /** Display data only; hydration neither starts publishing nor proves visibility. */
  initialSnapshot?: ChannelProgressDraftCompositorSnapshot;
  /** Omit to prepare display data without publication or timers. */
  update?: (text: string, options: ChannelProgressDraftUpdateOptions) => Promise<boolean | void> | boolean | void;
  deleteCurrent?: () => Promise<void> | void;
  tryNativeUpdate?: (text: string) => Promise<boolean> | boolean;
  /** Publish when structured lines change even if the rendered text does not. */
  updateOnLineChange?: boolean;
  /**
   * Set when the channel renders `update`'s structured `lines` itself, so the
   * composed text carries only the status block (label, headline, checklist).
   */
  rendersRollingLinesNatively?: boolean;
  formatLine?: (line: string) => string;
  formatPlainText?: (text: string) => string;
  isEmptyLine?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  shouldStartNow?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  reasoningLinePrefix?: string;
  commentaryLinePrefix?: string;
  reasoningGate?: boolean;
  commentaryItalics?: boolean;
  now?: () => number;
  setTimeoutFn?: typeof setTimeout;
  clearTimeoutFn?: typeof clearTimeout;
  /** Channel-specific formatter policy; event/lifecycle ownership remains in the compositor. */
  buildProgressEventLine?: ChannelProgressDraftEventLineBuilder;
};
//#endregion
//#region src/channels/progress-continuation.d.ts
/** Positive platform evidence plus data-only presentation state, never a transport callback. */
type ProgressContinuationReceipt = {
  channel: string;
  accountId?: string;
  to: string;
  threadId?: string | number;
  messageId: string;
  text: string;
  snapshot: ChannelProgressDraftCompositorSnapshot;
};
type ProgressContinuationCapability = {
  adopt: (this: void, receipt: ProgressContinuationReceipt) => Promise<boolean>;
  close: () => void;
};
//#endregion
//#region src/auto-reply/source-reply-delivery-mode.types.d.ts
/** Per-turn authority for automatic replies versus explicit message-tool sends. */
type SourceReplyDeliveryMode = "automatic" | "message_tool_only";
//#endregion
//#region src/plugin-sdk/channel-route.d.ts
/** Coarse chat shape used when a channel can distinguish direct, group, and broadcast targets. */
type ChannelRouteChatType = "direct" | "group" | "channel";
/** Provider-specific thread kind carried with normalized channel routes. */
type ChannelRouteThreadKind = "topic" | "thread" | "reply";
/** Describes which runtime surface supplied a channel route thread id. */
type ChannelRouteThreadSource = "explicit" | "target" | "session" | "turn";
/** Normalized channel route used for comparison, binding, and dedupe helpers. */
type ChannelRouteRef = {
  /** Lowercase channel id such as `slack`, `telegram`, or `discord`. */
  channel?: string;
  /** Normalized account/profile id when a channel supports multiple accounts. */
  accountId?: string;
  target?: {
    /** Canonical destination id used for route equality and delivery. */
    to: string;
    /** Original destination text when provider target grammar differs from the canonical id. */
    rawTo?: string;
    /** Coarse destination shape used by channels with different direct/group/broadcast rules. */
    chatType?: ChannelRouteChatType;
  };
  thread?: {
    /** Provider thread/topic/root id; strings are preserved when providers use opaque ids. */
    id: string | number;
    /** Provider-specific thread family for channels that distinguish topics, replies, and threads. */
    kind?: ChannelRouteThreadKind;
    /** Runtime source that supplied the thread id, used when callers need route provenance. */
    source?: ChannelRouteThreadSource;
  };
};
/** Loose route input accepted at SDK boundaries before normalization. */
type ChannelRouteRefInput = {
  /** Raw channel id; normalized to lowercase. */
  channel?: unknown;
  /** Raw account/profile id; normalized with account-id rules when string. */
  accountId?: unknown;
  /** Raw destination id before trimming and route-key normalization. */
  to?: unknown;
  /** Provider-specific target text retained when different from `to`. */
  rawTo?: unknown;
  /** Coarse destination shape supplied by channels that distinguish target kinds. */
  chatType?: ChannelRouteChatType;
  /** Raw provider thread/topic/root id before route-key normalization. */
  threadId?: unknown;
  /** Provider-specific thread family carried with the normalized thread id. */
  threadKind?: ChannelRouteThreadKind;
  /** Runtime surface that supplied the thread id. */
  threadSource?: ChannelRouteThreadSource;
};
/** Raw outbound target input shape used by helpers that do not need thread metadata source. */
type ChannelRouteTargetInput = Pick<ChannelRouteRefInput, "channel" | "accountId" | "to" | "rawTo" | "chatType" | "threadId">;
//#endregion
//#region src/utils/delivery-context.types.d.ts
/** Deferred outbound delivery intent attached to a session or task. */
type DeliveryIntentRef = {
  /** Stable queue/work item id. */
  id: string;
  /** Intent family; currently scoped to outbound queue delivery. */
  kind: "outbound_queue";
  /** Whether queueing is mandatory or best-effort for this delivery. */
  queuePolicy?: "required" | "best_effort";
};
/** Canonical channel delivery target shared by sessions, cron, tasks, and plugins. */
type DeliveryContext = Pick<ChannelRouteTargetInput, "accountId" | "channel" | "threadId" | "to"> & {
  /** Channel/plugin id that owns the delivery target. */
  channel?: string;
  /** Channel-local destination id, preserved with channel-specific casing. */
  to?: string;
  /** Optional channel account/workspace id. */
  accountId?: string;
  /** Optional thread/topic id nested under `to`. */
  threadId?: string | number;
  /** Optional queued-delivery intent associated with this context. */
  deliveryIntent?: DeliveryIntentRef;
};
//#endregion
//#region src/config/sessions/restart-recovery-types.d.ts
/** Exact task and requester generation captured by the admitted host completion turn. */
type HarnessCompletionRecovery = {
  taskId: string;
  /** Terminal outcome captured when this completion input was admitted. */
  taskStatus: "succeeded" | "failed";
  taskRunId: string;
  sourceRunId: string;
  requesterSessionKey: string;
  requesterAgentId: string;
  sessionId: string;
  /** Absence is an expected absent revision, not a wildcard. */
  lifecycleRevision?: string;
};
type RestartRecoveryBeforeAgentReplyState = "admitted" | "pending" | "continue" | "handled-silent" | "handled-reply" | "handled-unrecoverable";
type RestartRecoveryTerminalDeliveryEvidenceResult = {
  /** The terminal result was captured even when it contained no visible or delivery evidence. */
  captured?: true;
  payloads?: Array<{
    mediaUrls?: string[];
    visible?: boolean;
  }>;
  payloadsTruncated?: true;
  deliveryStatus?: {
    status: "failed" | "partial_failed" | "sent" | "suppressed";
    resultCount?: number;
    errorMessage?: string;
    payloadOutcomes?: Array<{
      index: number;
      status: "failed" | "sent" | "suppressed";
      sentBeforeError?: boolean;
    }>;
  };
  messagingToolSentTargets?: Array<{
    provider?: string;
    accountId?: string;
    to?: string;
    threadId?: string;
    threadImplicit?: boolean;
    threadSuppressed?: boolean;
    mediaUrls?: string[];
    visible?: boolean;
    /** Explicit false remains progress-only after a restart. */
    sourceReplyFinal?: boolean;
  }>;
  messagingToolSentTargetsTruncated?: true;
  /** Aggregate committed sends were not all represented by route-checkable target records. */
  messagingToolAggregateEvidenceUnaccounted?: true;
  /** The terminal run reported a committed effect that makes fresh replay unsafe. */
  restartUnsafeSideEffectsDetected?: true;
};
type RestartRecoveryTerminalDeliveryEvidence = RestartRecoveryTerminalDeliveryEvidenceResult & {
  runId: string;
  harnessCompletion?: HarnessCompletionRecovery;
  deliveryContext?: DeliveryContext;
  /** Identified queue completion retained before its exact harness task settles. */
  durableFinalReceipt?: {
    intentId: string;
    deliveryId: string;
    platformMessageId: string;
  };
  /** Actual completion run; a resumed run can differ from its queued source. */
  transcriptRunId?: string;
};
/** Durable ownership and idempotency state for gateway restart recovery. */
type SessionRestartRecoveryState = {
  restartRecoveryBeforeAgentReplyState?: RestartRecoveryBeforeAgentReplyState;
  /** Durable pre/post boundary around the terminal external send. */
  restartRecoveryDeliveryReceiptState?: "terminal-pending" | "delivered-terminal";
  /** Exact agent tool call whose terminal external send owns the receipt. */
  restartRecoveryDeliveryToolCallId?: string;
  restartRecoveryDeliveryContext?: DeliveryContext;
  /** Exact host-owned media allowlist for a generated-media recovery run. */
  restartRecoveryDeliveryMediaUrls?: string[];
  /** Keeps the message tool absent while a generated-media recovery run is resumed. */
  restartRecoveryDisableMessageTool?: true;
  /** Suppresses visible text when a recovery attempt repairs only missing media. */
  restartRecoverySuppressTextDelivery?: true;
  restartRecoveryDeliveryRequestFingerprint?: string;
  restartRecoveryDeliveryRunId?: string;
  restartRecoveryDeliverySourceRunId?: string;
  restartRecoveryHarnessCompletion?: HarnessCompletionRecovery;
  restartRecoveryRequesterAccountId?: string;
  restartRecoveryRequesterSenderId?: string;
  restartRecoverySameChannelThreadRequired?: true;
  restartRecoverySourceIngress?: "channel" | "control-ui" | "internal";
  restartRecoverySourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  restartRecoveryTerminalDeliveryEvidence?: RestartRecoveryTerminalDeliveryEvidence[];
  restartRecoveryTerminalRunIds?: string[];
};
//#endregion
//#region src/channels/location.d.ts
/** Normalized source kind for channel-provided geographic locations. */
type LocationSource = "pin" | "place" | "live";
/** Channel-neutral location payload passed from plugins into shared prompt rendering. */
type NormalizedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  isLive?: boolean;
  source?: LocationSource;
  caption?: string;
};
/** Portable outbound location fields supported by channel send adapters. */
type OutboundLocation = Pick<NormalizedLocation, "latitude" | "longitude" | "accuracy" | "name" | "address">;
/** Normalize a portable location payload at an outbound/plugin boundary. */
declare function normalizeOutboundLocation(value: unknown, label?: string): OutboundLocation | undefined;
/**
 * Formats the safe inline location body shown to the model.
 *
 * Channel-provided labels, addresses, and captions are intentionally excluded
 * here; `toLocationContext` carries them into the untrusted metadata block.
 */
declare function formatLocationText(location: NormalizedLocation): string;
/** Converts a normalized location into template context fields for prompt metadata. */
declare function toLocationContext(location: NormalizedLocation): {
  LocationLat: number;
  LocationLon: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource: LocationSource;
  LocationIsLive: boolean;
  LocationCaption?: string;
};
//#endregion
//#region src/shared/reply-payload.types.d.ts
type ReplyMediaAttachment = {
  type?: "image" | "audio" | "video" | "file";
  path?: string;
  url?: string;
  mediaUrl?: string;
  filePath?: string;
  mimeType?: string;
  name?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  /** Internal per-URL trust carried until mixed media is split for history projection. */
  trustedLocalMedia?: boolean;
};
/** Metadata for audio-only media that supplements already-visible assistant text. */
type ReplyPayloadTtsSupplement = {
  spokenText: string;
  visibleTextAlreadyDelivered?: boolean;
};
/** Channel-agnostic assistant reply payload. */
type ReplyPayload = {
  text?: string;
  /** Visible body a channel adapter may use when native structured content requires text. */
  fallbackText?: {
    text: string;
    /** Batch payload replaced when the adapter adopts this fallback body. */
    replacesPayloadIndex?: number;
  };
  mediaUrl?: string;
  mediaUrls?: string[];
  /** Prepared metadata aligned with mediaUrls for client-facing history projection. */
  attachments?: ReplyMediaAttachment[];
  /** Internal-only trust signal for gateway webchat local media embedding. */
  trustedLocalMedia?: boolean;
  /** Treat media as live-only content and avoid persisting the underlying media reference. */
  sensitiveMedia?: boolean;
  /** Channel-agnostic rich presentation. Core degrades or asks the channel renderer to map it. */
  presentation?: MessagePresentation;
  /** Runtime-authored text is the exact fallback, not additional native presentation content. */
  presentationTextMode?: "fallback";
  /** Channel-agnostic delivery preferences, e.g. pin the sent message when supported. */
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
  replyToTag?: boolean;
  /** True when [[reply_to_current]] was present but not yet mapped to a message id. */
  replyToCurrent?: boolean;
  /** Send audio as voice message (bubble) instead of audio file. Defaults to false. */
  audioAsVoice?: boolean;
  /** Send video media as a round video note when the channel supports it. */
  videoAsNote?: boolean;
  /** Channel-neutral geographic location or named place. */
  location?: OutboundLocation;
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
  isReasoning?: boolean;
  /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
  /** Reasoning stream text is a complete replacement snapshot, not a delta. */
  isReasoningSnapshot?: boolean;
  /** Marks this payload as a compaction status notice (start/end).
   *  Should be excluded from TTS transcript accumulation so compaction
   *  status lines are not synthesised into the spoken assistant reply. */
  isCompactionNotice?: boolean;
  /** Marks this payload as a model-fallback transition/recovery notice. */
  isFallbackNotice?: boolean;
  /** Marks this payload as transient status, not assistant answer content. */
  isStatusNotice?: boolean;
  /** Channel-specific payload data (per-channel envelope). */
  channelData?: Record<string, unknown>;
};
//#endregion
//#region src/auto-reply/reply-payload.d.ts
type ReplyMediaFailureCode = "file-not-found" | "unsupported-format" | "delivery-failed";
/** Producer-owned outcome for one attachment that could not be delivered. */
type ReplyMediaFailure = {
  code: ReplyMediaFailureCode;
  kind: "image" | "audio" | "video" | "document";
  label: string;
  mimeType?: string;
};
declare function readAskUserQuestionId(payload: Pick<ReplyPayload, "channelData">): string | undefined;
/** Metadata for fast-auto progress notices. */
declare const FAST_MODE_AUTO_PROGRESS_KIND = "fast-mode-auto";
declare function isFastModeAutoProgressPayload(payload: Pick<ReplyPayload, "channelData">): boolean;
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
/** WeakMap-backed metadata attached to payload objects without changing wire shape. */
type SessionWriterDeliveryAuthority = {
  agentId?: string;
  /** Captured admitted completion authority, retained by the durable queue. */
  harnessCompletion?: HarnessCompletionRecovery;
  expectedLifecycleRevision?: string;
  expectedSessionId: string;
  expectedWriterRunId?: string;
  sessionKey: string;
  storePath?: string;
};
/** Returns true when a payload is the synthesized warning for a non-terminal tool error. */
declare function isReplyPayloadNonTerminalToolErrorWarning(payload: object): boolean;
/** Copies internal payload metadata when cloning or transforming payload objects. */
declare function copyReplyPayloadMetadata<T extends object>(source: object, payload: T): T;
/** Classifies terminal vs. supplemental reply lanes, not content, sendability, or authority. */
declare const isReplyPayloadTerminalContent: (payload: ReplyPayload) => boolean;
//#endregion
export { resolveChannelStreamingPreviewToolProgress as $, ChannelProgressDraftCompositorSnapshot as A, formatPlanChecklistLines as B, SessionRestartRecoveryState as C, ProgressContinuationCapability as D, SourceReplyDeliveryMode as E, compactChannelProgressDraftLine as F, resolveChannelPreviewStreamMode as G, mergeChannelProgressDraftLine as H, createChannelProgressDraftGate as I, resolveChannelProgressDraftMaxLines as J, resolveChannelProgressDraftConfig as K, formatChannelProgressDraftLine as L, AgentPlanStepStatus as M, buildChannelProgressDraftLine as N, ChannelProgressDraftCompositorLine as O, buildChannelProgressDraftLineForEntry as P, resolveChannelStreamingPreviewCommandText as Q, formatChannelProgressDraftLineForEntry as R, toLocationContext as S, ChannelRouteRef as T, normalizeAgentPlanSteps as U, isChannelProgressDraftWorkToolName as V, normalizeChannelProgressDraftLineIdentity as W, resolveChannelStreamingBlockEnabled as X, resolveChannelStreamingBlockCoalesce as Y, resolveChannelStreamingChunkMode as Z, LocationSource as _, buildTtsSupplementMediaPayload as a, isChannelProgressAttentionLine as at, formatLocationText as b, isFastModeAutoProgressPayload as c, isReplyPayloadTtsSupplement as d, resolveChannelStreamingProgressCommentary as et, markReplyPayloadAsTtsSupplement as f, ReplyPayloadTtsSupplement as g, ReplyPayload as h, SessionWriterDeliveryAuthority as i, ChannelProgressDraftLine as it, AgentPlanStep as j, ChannelProgressDraftCompositorParams as k, isReplyPayloadNonTerminalToolErrorWarning as l, ReplyMediaAttachment as m, ReplyDeliveryContext as n, resolveChannelStreamingSuppressDefaultToolProgressMessages as nt, copyReplyPayloadMetadata as o, formatChannelProgressDraftDiffStat as ot, readAskUserQuestionId as p, resolveChannelProgressDraftMaxLineChars as q, ReplyMediaFailure as r, selectPlanChecklistSteps as rt, getReplyPayloadTtsSupplement as s, FAST_MODE_AUTO_PROGRESS_KIND as t, resolveChannelStreamingProgressNarration as tt, isReplyPayloadTerminalContent as u, NormalizedLocation as v, DeliveryContext as w, normalizeOutboundLocation as x, OutboundLocation as y, formatChannelProgressDraftText as z };