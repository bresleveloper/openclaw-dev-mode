import { n as ChannelRouteRef, t as DeliveryContext } from "./delivery-context.types-DgfLEW3H.js";
import { I as GatewayOperatorRoleDefinition, Jt as BroadcastStrategy, Mt as TtsAutoMode, Vt as GroupToolPolicyConfig, g as ImageContent, nn as SchemaContract, r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { C as SessionMaintenanceMode, D as StreamingMode, O as TextChunkMode, l as ChannelStreamingProgressConfig, p as DmScope, r as BlockStreamingCoalesceConfig, s as ChannelStreamingCommandTextMode, x as ReplyToMode } from "./types.base-D8MIFbSh.js";
import { t as SubsystemLogger } from "./subsystem-RmDRaRJV.js";
import { a as SqliteWalMaintenance, i as DatabaseFileIdentity, n as OpenClawStateDatabase, r as OpenClawStateDatabaseOptions } from "./openclaw-state-db-Yba_0aSZ.js";
import { i as AgentMessage } from "./types-DIrCJOzw.js";
import { t as StreamingCompatEntry } from "./streaming-config-readers-DwDctXfx.js";
import { f as MessagePresentation, j as ReplyPayloadDelivery, n as InteractiveReply } from "./payload-DbVrIDaU.js";
import { t as ProviderModelRef } from "./model-catalog-refs-Phyl1k6H.js";
import { n as SkillLibrarySelection } from "./skill-library-DVzEZ7Hi.js";
import { A as HumanMention, H as AgentSummary, Mt as ModelChoice, _n as SessionParticipantIdentity, dn as SessionEntryArchiveReason, gn as SessionParticipant, hn as SessionRunStatus, k as QueueMode, ln as SessionConversationLink, mn as SessionRow, on as SessionGoal, rn as SessionsAssignOwnerParams, sn as SessionsGoalMutationResult, tn as SessionObserverDigest, un as SessionCreatedActor$1 } from "./index-B4F-ENEv.js";
import { N as MediaUnderstandingOutput, c as MediaUnderstandingDecision } from "./types-BooLarQr.js";
import { n as MediaFact, r as MediaFactInput } from "./media-facts-BUTxYH1x.js";
import { n as CommandArgs } from "./commands-args.types-zglMcgeO.js";
import { t as HistoryEntry } from "./history.types-gAzBXfec.js";
import { t as FastMode } from "./string-coerce-CNF_kLkO.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { t as Skill } from "./skill-contract-B-d775sU.js";
import "./thinking.shared-BC6c30Ed.js";
import { n as GatewayAccessGrantRef } from "./user-profiles.types-ysUz1C8K.js";
import { Static, Type } from "typebox";
import { z } from "zod";
import { DatabaseSync } from "node:sqlite";
import { ColumnType, Selectable } from "kysely";
//#region packages/llm-core/src/utils/provider-refusal.d.ts
/** Provider-authored findings; continuation is offered only after explicit user review. */
type ProviderRefusalReview = {
  explanation: string;
  continuation?: {
    message: string;
  };
  errorType?: string;
};
//#endregion
//#region src/infra/sqlite-transaction.d.ts
type SqliteTransactionOptions = {
  /** Already-started BEGIN budget, carried between workers in the same process. */
  beginDeadlineNs?: bigint;
  busyTimeoutMs?: number;
  databaseLabel?: string;
  /** Prepared identifiers and counts only; never transcript or session payloads. */
  diagnosticContext?: Readonly<Record<string, string | number | boolean | null | undefined>>;
  logger?: Pick<SubsystemLogger, "warn">;
  operationLabel?: string;
  slowTransactionHoldMs?: number;
  /** Enclose the physical commit in an owner's synchronous authority guard. */
  withCommit?: (commit: () => void) => void;
};
//#endregion
//#region packages/gateway-protocol/src/client-info.d.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
declare const GATEWAY_CLIENT_IDS: {
  readonly WEBCHAT_UI: "webchat-ui";
  readonly CONTROL_UI: "openclaw-control-ui";
  readonly BROWSER_COPILOT: "openclaw-browser-copilot";
  readonly TUI: "openclaw-tui";
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly GATEWAY_CLIENT: "gateway-client";
  readonly MACOS_APP: "openclaw-macos";
  readonly LINUX_APP: "openclaw-linux";
  readonly IOS_APP: "openclaw-ios";
  readonly WATCHOS_APP: "openclaw-watchos";
  readonly ANDROID_APP: "openclaw-android";
  readonly NODE_HOST: "node-host";
  readonly WORKER: "openclaw-worker";
  readonly TEST: "test";
  readonly FINGERPRINT: "fingerprint";
  readonly PROBE: "openclaw-probe";
};
/** Stable gateway client ids used on the wire during hello/connect handshakes. */
type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
/** Compatibility alias for internal callers that still use "name" terminology. */
type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
declare const GATEWAY_CLIENT_MODES: {
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly UI: "ui";
  readonly BACKEND: "backend";
  readonly NODE: "node";
  readonly WORKER: "worker";
  readonly PROBE: "probe";
  readonly TEST: "test";
};
/** Coarse client category used for gateway policy and diagnostics. */
type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
/** Client metadata sent during gateway connection setup. */
type GatewayClientInfo = {
  /** Stable product/client identifier from `GATEWAY_CLIENT_IDS`. */
  id: GatewayClientId;
  /** Human-readable label for diagnostics; not used for policy decisions. */
  displayName?: string;
  /** Client app or package version reported by the connecting process. */
  version: string;
  /** Exact immutable artifact identity when the client can report one. */
  buildId?: string;
  /** Runtime platform string, such as `darwin`, `ios`, `android`, or `web`. */
  platform: string;
  /** Optional device family used by native clients for display and routing hints. */
  deviceFamily?: string;
  /** Native hardware/model identifier when available. */
  modelIdentifier?: string;
  /** Self-reported IANA time zone, such as `Europe/Vienna`, for presence display. */
  timeZone?: string;
  /** Coarse category from `GATEWAY_CLIENT_MODES` for policy and diagnostics. */
  mode: GatewayClientMode;
  /** Per-installation or per-process id used to distinguish same-product clients. */
  instanceId?: string;
};
/** Capability flags a client may advertise during the gateway handshake. */
declare const GATEWAY_CLIENT_CAPS: {
  readonly AGENT_KIND: "agent-kind";
  readonly APPROVALS: "approvals";
  readonly CHAT_ONLY_ASSISTANT_TEXT: "chat-only-assistant-text";
  readonly EXEC_APPROVALS: "exec-approvals";
  readonly INLINE_WIDGETS: "inline-widgets";
  readonly MODEL_CATALOG_SNAPSHOT: "model-catalog-snapshot";
  readonly MODEL_SELECTION_POLICY: "model-selection-policy";
  readonly RUN_TOOL_BINDINGS: "run-tool-bindings";
  readonly SESSION_SCOPED_EVENTS: "session-scoped-events";
  readonly SKILL_CURATOR_LIVE_INVENTORY: "skill-curator-live-inventory";
  readonly PLUGIN_APPROVALS: "plugin-approvals";
  readonly TASK_SUGGESTIONS: "task-suggestions";
  readonly TERMINAL_OFFSET_SEQ: "terminal-offset-seq";
  readonly TERMINAL_SESSION_METADATA: "terminal-session-metadata";
  readonly TERMINAL_UPLOAD_PATH_STYLE: "terminal-upload-path-style";
  readonly TOOL_EVENTS: "tool-events";
  readonly UI_COMMANDS: "ui-commands";
  readonly ULTRAFAST: "ultrafast";
  readonly USAGE_REFRESHING: "usage-refreshing";
};
/** Optional capability advertised by clients during gateway handshake. */
type GatewayClientCap = (typeof GATEWAY_CLIENT_CAPS)[keyof typeof GATEWAY_CLIENT_CAPS];
//#endregion
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
declare function formatChannelProgressDraftLine(input: ChannelProgressDraftLineInput, options?: ChannelProgressLineOptions): string | undefined;
declare function buildChannelProgressDraftLineForEntry(entry: StreamingCompatEntry | null | undefined, input: ChannelProgressDraftLineInput, options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
declare function formatChannelProgressDraftLineForEntry(entry: StreamingCompatEntry | null | undefined, input: ChannelProgressDraftLineInput, options?: ChannelProgressLineOptions): string | undefined;
declare function buildChannelProgressDraftLine(input: ChannelProgressDraftLineInput, options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
declare function createChannelProgressDraftGate(params: {
  onStart: () => void | Promise<void>;
  /** Delay after the first work event before a draft starts. */
  initialDelayMs?: number;
  /** Reports timer-fired startup failures, which have no awaiting caller. */
  onStartError?: (error: unknown) => void;
  setTimeoutFn?: typeof setTimeout;
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
declare function normalizeChannelProgressDraftLineIdentity(line: string | ChannelProgressDraftLine | undefined): string;
declare function mergeChannelProgressDraftLine<TLine extends string | ChannelProgressDraftLine>(lines: TLine[], line: TLine, params: {
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
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/infra/agent-run-authority.types.d.ts
/** Exact admitted-run claim shared by the registry and its subordinate approval leases. */
type AgentRunDelegatedAuthority = Readonly<{
  operationalRunInstance: Readonly<{
    instanceId: string;
    runId: string;
  }>;
  lifecycleGeneration: string;
  claimId: string;
}>;
//#endregion
//#region src/config/sessions/provider-review.types.d.ts
/** Runtime-authored precaution for one failed turn in this session generation. */
type SessionProviderReview = {
  id: string;
  sessionId: string;
  runId: string;
  provider: string;
  model: string;
  runtimeId: string;
  api?: string;
  review?: ProviderRefusalReview;
  nativeThreadId?: string;
  nativeTurnId?: string;
};
//#endregion
//#region src/config/sessions/activity-summary.d.ts
declare const ActivitySummarySchema: z.ZodObject<{
  version: z.ZodLiteral<1>;
  formatRevision: z.ZodOptional<z.ZodNumber>;
  text: z.ZodString;
  updatedAt: z.ZodNumber;
  sessionId: z.ZodString;
  lifecycleRevision: z.ZodOptional<z.ZodString>;
  generation: z.ZodNullable<z.ZodString>;
  maxSeq: z.ZodNullable<z.ZodNumber>;
  leafEntryId: z.ZodNullable<z.ZodString>;
  coveredMessages: z.ZodNumber;
  totalMessages: z.ZodNumber;
  omittedContent: z.ZodBoolean;
}, z.core.$strip>;
type SessionActivitySummary = z.infer<typeof ActivitySummarySchema>;
//#endregion
//#region src/security/external-content-source.d.ts
/** Hook session sources that carry untrusted external content into agent prompts. */
type HookExternalContentSource = "email" | "gmail" | "webhook";
//#endregion
//#region src/config/sessions/session-entry-provenance.d.ts
/** Persisted identity excludes display-only actor projections. */
type SessionActor = SchemaContract<Pick<SessionCreatedActor$1, "type" | "id" | "label">>;
/** Only trusted creation owners may stamp a Gateway profile namespace. */
type SessionCreatedActor = SessionActor & ({
  type: "human";
  source: "profile" | "channel" | "unknown";
} | {
  type: "agent" | "system";
});
type SessionOwnerAssignment = {
  actor: SessionActor;
  assignedBy?: SessionActor;
  assignedAt?: number;
};
type SessionCreatedVia = NonNullable<SessionRow["createdVia"]>;
type SessionEntryProvenance = {
  /** First channel-supplied launch destination, inherited by explicitly created children. */
  conversationLink?: SessionConversationLink;
  /** Human contributor candidates captured once by trusted delegation; not participant activity. */
  inheritedGitContributorProfileIds?: string[];
  /** Plugin id that owns this session through a trusted runtime creation seam. */
  pluginOwnerId?: string;
  /** External hook source that has contributed content to this transcript. */
  hookExternalContentSource?: HookExternalContentSource;
};
//#endregion
//#region src/config/sessions/goals-operations.types.d.ts
type SessionGoalOperationResult = Omit<SessionsGoalMutationResult, "replayed">;
declare const SESSION_GOAL_OPERATION_ERROR_CODES: readonly ["expired", "operation-conflict", "session-rebound", "goal-rebound", "capacity", "receipt-invalid", "invalid"];
type SessionGoalOperationErrorCode = (typeof SESSION_GOAL_OPERATION_ERROR_CODES)[number];
type SessionTranscriptTurnMutationResult = {
  result: SessionGoalOperationResult;
  replayed: boolean;
};
//#endregion
//#region src/channels/inbound-event/kind.d.ts
/**
 * High-level inbound event class used to separate actionable user requests from room activity.
 */
type InboundEventKind = "user_request" | "room_event";
//#endregion
//#region src/gateway/ui-command-target.types.d.ts
/** Presentation destination captured from the requesting Control UI, never model arguments. */
type GatewayUiCommandTarget = Readonly<{
  connId: string;
  profileId?: string;
}>;
//#endregion
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
//#endregion
//#region src/plugins/hook-channel-context.types.d.ts
interface PluginHookChannelSenderContext {
  /** Channel-scoped sender ID, matching `ctx.senderId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelChatContext {
  /** Transport-native conversation ID, matching `ctx.chatId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelContext {
  /** Sender metadata supplied by the originating channel. */
  sender?: PluginHookChannelSenderContext;
  /** Chat/conversation metadata supplied by the originating channel. */
  chat?: PluginHookChannelChatContext;
}
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
  sourceRole?: "subagent";
  sourcePromptPrefix?: string;
  jobId?: string;
  runId?: string;
};
//#endregion
//#region src/auto-reply/command-turn-context.d.ts
type CommandTurnKind = "native" | "text-slash" | "normal";
/** Transport-level source labels carried through auto-reply dispatch. */
type CommandTurnSource = "native" | "text" | "message";
type CommandTurnContext = {
  commandName?: string;
  body?: string;
} & ({
  kind: "native";
  source: "native";
  authorized: boolean;
} | {
  kind: "text-slash";
  source: "text";
  authorized: boolean;
} | {
  kind: "normal";
  source: "message";
  authorized: false;
});
/** Builds a normalized command-turn context and forces normal messages to unauthorized. */
declare function createCommandTurnContext(source: CommandTurnSource, input: {
  authorized: boolean;
  commandName?: string;
  body?: string;
}): CommandTurnContext;
/** Returns true for channel-native command turns. */
declare function isNativeCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true for text slash-command turns regardless of authorization. */
declare function isTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
declare function isAuthorizedTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true when a turn was explicitly invoked by a native or authorized text command. */
declare function isExplicitCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
//#endregion
//#region src/auto-reply/group-thread.types.d.ts
type ResolvedGroupThreadConfig = {
  agents: string[];
  unknownAgentIds: string[];
  qualified: boolean;
  configuredAgentCount: number;
  mentionGating: boolean;
  maxRounds: number;
  maxTurns: number;
  strategy: BroadcastStrategy;
};
type GroupThreadMentionFacts = {
  channel: string;
  peerId: string;
  group: ResolvedGroupThreadConfig;
  mentionedAgentIds: string[];
};
//#endregion
//#region packages/normalization-core/src/agent-run-terminal-outcome.d.ts
declare const AGENT_RUN_ABORTED_STOP_REASON: "aborted";
declare const AGENT_RUN_RESTART_ABORT_STOP_REASON: "restart";
declare const AGENT_RUN_SUPERSEDED_STOP_REASON: "superseded";
declare const AGENT_RUN_TIMEOUT_PHASES: readonly ["queue", "preflight", "provider", "post_turn", "gateway_draining"];
type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
type AgentRunWaitStatus = "ok" | "error" | "timeout";
type AgentRunTerminalReason = "completed" | "hard_timeout" | "timed_out" | "superseded" | "cancelled" | "aborted" | "blocked" | "abandoned" | "failed";
type AgentRunTerminalFacts = {
  reason: AgentRunTerminalReason;
  status: AgentRunWaitStatus;
  stopReason?: string;
  livenessState?: string;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
};
//#endregion
//#region src/agents/agent-run-terminal-outcome.types.d.ts
/** Normalized terminal outcome for an agent run. */
type AgentRunTerminalOutcome = AgentRunTerminalFacts & {
  error?: string;
  startedAt?: number;
  endedAt?: number;
};
//#endregion
//#region src/config/sessions/transcript-entry-anchor.d.ts
/** Immutable transcript identity issued by the SQLite append transaction. */
type TranscriptEntryAnchor = Readonly<{
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  generation: string;
  entryId: string;
  rawSeq: number;
  effectiveParentId: string | null;
  activeMessagePosition: number;
  idempotencyKey?: string;
}>;
/** Current user row bound to one recorder-owned logical turn. */
type TranscriptTurnAdmission = TranscriptEntryAnchor & Readonly<{
  logicalTurnId: string;
  role: "user";
}>;
/** Exact accepted transcript range, inclusive of admission and terminal. */
type TranscriptTurnBoundary = Readonly<{
  admission: TranscriptTurnAdmission;
  terminal: TranscriptEntryAnchor;
}>;
//#endregion
//#region src/infra/outbound/reply-payload-parts.d.ts
/** Derived sendability facts for text/media outbound payload delivery. */
type SendableOutboundReplyParts = {
  text: string;
  trimmedText: string;
  /** Normalized non-empty media URLs. */
  mediaUrls: string[];
  mediaCount: number;
  hasText: boolean;
  hasMedia: boolean;
  hasContent: boolean;
};
/** Prepared payload entry that keeps source indexing plus reusable projections. */
type OutboundPayloadPlan = {
  sourceIndex: number;
  payload: ReplyPayload;
  parts: SendableOutboundReplyParts;
  hasPresentation: boolean;
  hasInteractive: boolean;
  hasChannelData: boolean;
};
/** Prefer multi-attachment payloads, then fall back to the legacy single-media field. */
declare function resolveOutboundMediaUrls(payload: {
  mediaUrls?: string[];
  mediaUrl?: string;
}): string[];
declare function countOutboundMedia(payload: {
  mediaUrls?: string[];
  mediaUrl?: string;
}): number;
declare function hasOutboundMedia(payload: {
  mediaUrls?: string[];
  mediaUrl?: string;
}): boolean;
declare function hasOutboundText(payload: {
  text?: string;
}, options?: {
  trim?: boolean;
}): boolean;
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
declare function resolveSendableOutboundReplyParts(payload: {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
}, options?: {
  text?: string;
}): SendableOutboundReplyParts;
//#endregion
//#region packages/gateway-protocol/src/session-agent-status.d.ts
declare const SESSION_AGENT_ATTENTION_ICON_IDS: readonly ["hand", "key", "alert", "flag", "lock", "hourglass"];
type SessionAgentAttentionIconId = (typeof SESSION_AGENT_ATTENTION_ICON_IDS)[number];
type SessionAgentStatus = {
  note: string;
  expiresAt: number;
  attention?: SessionAgentAttentionIconId;
};
//#endregion
//#region src/chat/message-client-source.d.ts
/** Reported transport facts, separate from authenticated sender identity. */
type MessageClientSource = Pick<GatewayClientInfo, "id" | "mode" | "displayName">;
//#endregion
//#region src/chat/sender-identity.d.ts
type TranscriptSenderIdentity = Extract<SessionParticipantIdentity, {
  type: "profile" | "remote" | "observation";
}>;
//#endregion
//#region packages/gateway-protocol/src/chat-work-context.d.ts
/** Bounded, untrusted send-time reference data; never routing or authorization. */
declare const CHAT_WORK_CONTEXT_LIMITS: {
  readonly page: 64;
  readonly title: 96;
  readonly sessionKey: 192;
  readonly sessionId: 64;
  readonly agentId: 64;
  readonly workspace: 224;
  readonly file: 224;
  readonly selection: 640;
};
type ChatWorkContext = {
  page: string;
  detail?: Readonly<Record<string, string>>;
} & Partial<Record<Exclude<keyof typeof CHAT_WORK_CONTEXT_LIMITS, "page">, string>>;
//#endregion
//#region src/chat/work-context.d.ts
type AttachedChatWorkContext = {
  snapshot: ChatWorkContext;
  text: string;
};
//#endregion
//#region src/config/sessions/session-transcript-turn-lifecycle.types.d.ts
/** Authoritative lifecycle snapshot required for an atomic transcript admission. */
type SessionTranscriptTurnExpectedState = {
  /** Rejects a run-owned turn after another admitted run takes writer ownership. */
  expectedWriterRunId?: string;
  abortedLastRun: boolean | undefined;
  /** Fences recovery-only transcript writes against concurrent ownership changes. */
  mainRestartRecoveryCycleId: string | undefined;
  mainRestartRecoveryRevision: number | undefined;
  restartRecoveryBeforeAgentReplyState: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryRequestFingerprint: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryTerminalRunIds: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  status: PersistedSessionRunStatus | undefined;
};
/** Lifecycle fields committed with an accepted transcript turn. */
type SessionTranscriptTurnLifecyclePatch = {
  abortedLastRun?: boolean;
  endedAt?: number;
  lifecycleRunId?: InternalSessionEntry["lifecycleRunId"];
  lastRunId?: InternalSessionEntry["lastRunId"];
  lastRunError?: InternalSessionEntry["lastRunError"];
  pendingFinalDelivery?: InternalSessionEntry["pendingFinalDelivery"];
  mainRestartRecovery?: InternalSessionEntry["mainRestartRecovery"];
  restartRecoveryBeforeAgentReplyState?: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState?: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId?: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryContext?: SessionRestartRecoveryState["restartRecoveryDeliveryContext"];
  restartRecoveryDeliveryRequestFingerprint?: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId?: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId?: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId?: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId?: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired?: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress?: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode?: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryForceSafeTools?: InternalSessionEntry["restartRecoveryForceSafeTools"];
  restartRecoveryRuns?: InternalSessionEntry["restartRecoveryRuns"];
  /** Durable tombstones merged with the fresh row inside the SQLite write transaction. */
  restartRecoveryTerminalRunIds?: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  runtimeMs?: number;
  startedAt?: number;
  status?: PersistedSessionRunStatus;
  updatedAt?: number;
};
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type PersistedUserTurnMediaInput = Pick<MediaFactInput, "contentType" | "durationMs" | "fileName" | "origin" | "height" | "hydrationSuppressed" | "messageId" | "path" | "sizeBytes" | "transcribed" | "url" | "width"> & {
  kind?: string | null;
  workspaceDir?: string | null;
};
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}> & {
  display?: false;
  excludeFromContext?: true;
  /** Private transcript correlation; never authorizes an execution. */
  idempotencyKey?: string;
  provenance?: InputProvenance;
  __openclaw?: Record<string, unknown> & {
    humanMentions?: readonly HumanMention[];
  };
};
type UserTurnInput = Pick<PersistedUserTurnMessage, "display" | "excludeFromContext"> & {
  text?: string | null;
  /** Authored text and its captured reference; model content stays unchanged. */
  workContext?: AttachedChatWorkContext;
  /** Explicit human selections bound to UTF-16 offsets in text. */
  mentions?: readonly HumanMention[];
  media?: readonly PersistedUserTurnMediaInput[] | null;
  /** Restart-safe native image placement; model-visible prompt bytes remain separate. */
  mediaImageLayout?: {
    slots: readonly {
      kind: "inline" | "offloaded";
      factIndex?: number;
    }[];
    suppressedFactIndexes?: readonly number[];
  } | null;
  timestamp?: number;
  idempotencyKey?: string;
  /** Durable transcript message reference used to render and hydrate replies. */
  replyToId?: string;
  /** Bounded display fallback for replies whose target is outside loaded history. */
  replyToPreview?: {
    text: string;
    senderLabel?: string | null;
  } | null;
  senderIsOwner?: boolean;
  provenance?: InputProvenance;
  /** Identity is producer-owned attribution; labels remain editable display metadata. */
  sender?: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    identity?: TranscriptSenderIdentity;
  } | null;
  /** Durable transport correlation; stored privately and never rendered into model input. */
  transport?: {
    /** Reported client sources retained through collection; never sender authority. */
    clients?: readonly MessageClientSource[];
    channel?: string;
    conversationRef?: string;
    messageId?: string;
    replyToId?: string;
    threadId?: string;
  };
};
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptTarget = {
  sessionId: string;
  expectedSessionId?: string;
  initialSessionEntry?: SessionEntry;
  sessionKey: string;
  sessionEntry: SessionEntry | undefined;
  sessionStore?: Record<string, SessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptAdmissionReceipt = TranscriptTurnAdmission;
/** Native producer facts for the current host-admitted prompt; never a message replacement. */
type UserTurnTranscriptAnnotation = Readonly<{
  mirrorIdentity: string;
  upstreamUserText: string;
  mirrorOrigin: string;
  mirrorSourceFingerprint: string;
}>;
type UserTurnTranscriptPersistResult = {
  sessionTurnMutationResult?: SessionTranscriptTurnMutationResult;
  /** True only when this call inserted the transcript message. */
  appended?: boolean;
  sessionFile: string;
  sessionEntry: SessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnPersistenceOptions = {
  target?: UserTurnTranscriptTargetResolver;
  updateMode?: UserTurnTranscriptUpdateMode;
  cwd?: string;
};
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  /** Committed input, accepted pending custody, and blocked notices are exempt. */
  assertOriginalInputCommit?: () => void;
  /** Durable input custody leaves the active transcript unchanged until execution owns it. */
  stageApproved?: (options: {
    runId: string;
    assertCurrent: () => void;
    assertAdmittedCurrent?: () => void;
    assertCompletionCurrent?: () => void;
  }) => Promise<boolean>;
  getProcessingCompletion?: () => AgentRunTerminalOutcome | undefined;
  /** Released synchronous SDK contract; internal recorders use completeProcessingAsync. */
  completeProcessing?: (outcome: AgentRunTerminalOutcome) => AgentRunTerminalOutcome | undefined;
  completeProcessingAsync?: (outcome: AgentRunTerminalOutcome) => Promise<AgentRunTerminalOutcome | undefined>;
  getPendingInputMessage?: () => PersistedUserTurnMessage | undefined;
  isPendingInputConsumed?: () => boolean;
  withPendingInput?: <T>(run: () => T) => T;
  finishPendingInput?: (disposition: "cancelled" | "interrupted") => void;
  /** Join accepted completion and disposition writes before releasing the turn's admission. */
  waitForPendingInputSettlement?: () => Promise<void>;
  /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  /** Confirms exact-run steering provenance after transcript commitment is proven. */
  confirmSteerTargetRunIdForPersistence?: (targetRunId: string) => Promise<void>;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  /**
   * Freeze model-facing text on the canonical user record before its first provider dispatch.
   * `requestLocal` applies the same redaction but leaves the stored record unchanged.
   */
  captureModelPromptProjection?: (text: string, assertCurrent: () => void, options?: {
    requestLocal?: boolean;
  }) => Promise<PersistedUserTurnMessage>;
  getAdmissionReceipt: () => UserTurnTranscriptAdmissionReceipt | undefined;
  /** Persistence and `waitForRuntimePersistence` settle the handler's write and reject on its failure. */
  setAdmissionHandler?: (handler: (admission: UserTurnTranscriptAdmissionReceipt) => void | Promise<void>) => void;
  markSentToProvider?: () => void;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage, anchor?: TranscriptEntryAnchor | UserTurnTranscriptAdmissionReceipt, persistence?: {
    appended: boolean;
  }) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: UserTurnPersistenceOptions & {
    expectedSessionId?: string;
    expectedSessionState?: SessionTranscriptTurnExpectedState;
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch;
    /** Allow a later explicit persistence attempt when this attempt appends nothing. */
    retryIfUnpersisted?: boolean;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (message: PersistedUserTurnMessage, params?: UserTurnPersistenceOptions) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: UserTurnPersistenceOptions) => Promise<UserTurnTranscriptPersistResult | undefined>;
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
/** An accepted visible work session and its canonical Control UI link. */
type VisibleWorkSession = {
  sessionKey: string;
  url: string;
  label?: string;
};
/** A successful runtime append, independent of optional active-path projection anchors. */
type ReplyDispatchAssistantTranscript = Pick<TranscriptEntryAnchor, "agentId" | "sessionId" | "sessionKey" | "storePath"> & {
  messageId: string;
  anchor?: TranscriptEntryAnchor;
  idempotencyKey: string;
};
type ReplyDispatchRun = {
  completionSource: "reply-dispatch";
  getResult: () => {
    assistantTranscript?: ReplyDispatchAssistantTranscript;
    terminalOutcome?: AgentRunTerminalOutcome;
  };
};
type BlockReplyContext = {
  abortSignal?: AbortSignal;
  timeoutMs?: number;
  /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
  /** @internal Stable durable outbound intent owned by the producing runtime. */
  deliveryIntentId?: string;
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
  /** Override implicit reply-to-current behavior for the current turn. */
  implicitCurrentMessage?: "default" | "allow" | "deny";
};
/** Action sink available for model-proposed follow-up tasks during this turn. */
type TaskSuggestionDeliveryMode = "gateway";
/** Correlates queued reply ownership transfer with later delivery drains. */
type QueuedReplyDeliveryCorrelation = {
  begin: () => (() => void) | void;
};
/**
 * Exclusive: each lifecycle is its own collect-admission identity.
 * Cancel-only: share collect identity via ownerKey (gateway chat.send).
 */
type TurnAdoptionAdmission = "exclusive" | "cancel-only";
/**
 * Canonical turn-ownership lifecycle (adopt / defer / abandon / settle).
 * Single surface for durable ingress, gateway cancel identity, and reply-lane transfer.
 */
type TurnAdoptionLifecycle = {
  /**
   * Admission isolation mode (closed). Exclusive isolates collect identity per
   * lifecycle; cancel-only shares via ownerKey. Never inferred from onAbandoned.
   * Durable ingress sets exclusive; gateway cancel identity sets cancel-only.
   */
  admission?: TurnAdoptionAdmission;
  /** Transcript branch leaf from which this turn was admitted. */
  originatingLeafEntryId?: string | null;
  onAdopted: () => void | Promise<void>;
  /** Return false to reject followup enqueue. */
  onDeferred?: () => boolean | void;
  /** Pre-adoption liveness while waiting for reply-lane admission or preflight compaction. */
  onDeferredHeartbeat?: () => void;
  /** Requested cadence for pre-adoption heartbeats. */
  deferredHeartbeatIntervalMs?: number;
  /** Deferred turn finished without owning the reply lane. */
  onAbandoned?: () => void;
  /** Always fires when the followup ownership cycle ends (admitted or not). Gateway cleanup. */
  onSettled?: () => void;
  /** Retires cancellation ownership while retaining live identity. */
  onCancellationRetired?: () => void;
  /** Stable cancellation owner for collect-mode batches. */
  ownerKey?: string;
  abortSignal?: AbortSignal;
  /** Ephemeral fact: a direct local operator turn lost fresh cron authority when queued. */
  cronCreatorAuthorityUnavailable?: "queued-local-operator";
};
/** Partial assistant payload emitted during streaming or replacement updates. */
type PartialReplyPayload = {
  /**
   * Sanitized text, which may be an enumerable memoized getter. Content materializes on first
   * read: direct-delivery consumers pay per partial, while throttled consumers pay per flush.
   */
  text?: ReplyPayload["text"];
  mediaUrls?: ReplyPayload["mediaUrls"];
  delta?: string;
  replace?: true;
};
type ReasoningStreamPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"> & {
  requiresReasoningProgressOptIn?: boolean;
};
type ReasoningProgressPayload = {
  progressTokens: number;
};
/** Return false until the channel has accepted operator-visible progress. */
type ProgressCallbackResult = boolean | void;
/** Reply generation options shared by auto-reply, webchat, channels, and tests. */
type GetReplyOptions = {
  /** Host-issued capability for the exact findings acknowledged by the current operator. */
  providerReviewAcknowledgment?: ProviderReviewAcknowledgment;
  /** Channel-owned participant name encoding for source replies sent through message actions. */
  groupThreadReplyFormatter?: (text: string, participant: {
    agentId: string;
    name: string;
  }) => string;
  /** Override run id for agent events (defaults to random UUID). */
  runId?: string;
  /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string;
  /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal;
  /** Ephemeral channel owner check for a targeted Stop; never serialized as authority. */
  isCommandTargetCurrent?: () => boolean;
  /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[];
  /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered media facts whose model-facing text projection is already present in the prompt. */
  media?: MediaFact[];
  /**
   * Notifies when an agent run starts. Return "reply-dispatch" synchronously to accept
   * completion ownership offered in options; all other legacy callback results are ignored.
   */
  onAgentRunStart?: (runId: string, executionIdentityToken?: ExecutionIdentityAdmissionToken, options?: ReplyDispatchRun) => unknown;
  /** Reports the terminal agent-run classification to the shared dispatch owner. */
  onAgentRunTerminalOutcome?: (outcome: "completed" | "failed") => void;
  /** Reports visible work sessions this agent run spawned, in acceptance order. */
  onVisibleWorkSessions?: (sessions: readonly VisibleWorkSession[]) => void;
  /**
   * Canonical adoption lifecycle (adopted / deferred / abandoned / settled + pre-adoption abort).
   */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
  /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  /** Gateway-owned start-or-steer decision for this turn. */
  messageInjectionDisposition?: "none" | "accepted" | "rejected";
  /** Current user turn is already durable; replay it without appending another copy. */
  suppressNextUserMessagePersistence?: boolean;
  onReplyStart?: () => Promise<void> | void;
  /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void;
  /** If false, send only the initial typing signal without periodic keepalive refreshes. */
  typingKeepalive?: boolean;
  isHeartbeat?: boolean;
  /** Wording only; heartbeat visibility/suppression semantics stay on isHeartbeat. */
  useHeartbeatFailureCopy?: boolean;
  /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy;
  /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean;
  /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string;
  /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string;
  /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode;
  /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number;
  /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight";
  /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean;
  /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[];
  /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * @deprecated Ignored. The tool-failure warning is delivered whenever a run ends
   * without a reply and cannot be suppressed. Kept only so plugin-sdk callers that
   * still pass it keep compiling; removed in the first stable release after 2026.10.
   */
  suppressToolErrorWarnings?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean;
  /** Suppress standalone tool/progress text even when verbose progress is enabled. */
  suppressToolProgressMessages?: boolean;
  /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void;
  /** Preserve source-event callback start order for stateful channel progress renderers. */
  preserveProgressCallbackStartOrder?: boolean;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningStream?: (payload: ReasoningStreamPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningProgress?: (payload: ReasoningProgressPayload) => Promise<void> | void;
  streamReasoningInNonStreamModes?: boolean;
  /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  /** Receives a block whose producer has already resolved inline directives. */
  onPreparedBlockReply?: (plan: OutboundPayloadPlan, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a concrete work item starts, updates, or completes. */
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
    commandBearing?: boolean;
    approvalId?: string;
    approvalSlug?: string;
    suppressDurableProgress?: true;
    hideFromChannelProgress?: boolean;
    suppressChannelProgress?: boolean;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /**
   * Called when the utility-model narration of the in-progress turn changes.
   * Providing this callback opts the channel into progress narration; core
   * only generates narration when a utility model resolves (explicit
   * config or the provider-declared default; utilityModel: "" disables).
   * An empty text clears narration; a retained model preamble still wins before
   * the channel falls back to raw tool progress.
   */
  onNarrationUpdate?: (payload: {
    text: string;
  }) => Promise<void> | void;
  /** Channel-owned final and queued-turn boundaries for the current narrator. */
  onProgressNarratorLifecycle?: (lifecycle: {
    beginTurn: () => void;
    stopTurn: () => void;
  }) => void;
  /** False while utility-model narration has no visible progress draft. */
  isProgressDraftVisible?: () => boolean;
  /**
   * Omit exec/bash command text from narration model input, mirroring the
   * channel's `streaming.progress.commandText: "status"` display policy so
   * narration never receives more command detail than the draft shows.
   */
  narrationHideCommandText?: boolean;
  /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean;
  /** Bridge typed preambles to a channel-owned progress headline without commentary. */
  progressPreambleEnabled?: boolean;
  /** Deliver durable reasoning payloads to channels that own a separate reasoning lane. */
  reasoningPayloadsEnabled?: boolean;
  /** Deliver durable commentary (💬) payloads to channels that own a separate commentary lane. */
  commentaryPayloadsEnabled?: boolean;
  /** Optional turn-frozen commentary owner; visibility is live by default.
   * With the static opt-in and this callback, core freezes, evaluates once, and snapshots. */
  shouldDeliverCommentaryPayloads?: () => boolean;
  /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    /** Prepared literal text; unmarked explanations retain authored Markdown. */
    explanationFormat?: "plain";
    steps?: AgentPlanStep[];
    source?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when an approval becomes pending or resolves. */
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
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when command output streams or completes. */
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
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a patch completes with a file summary. */
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
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction ends; omitted outcome means completed for legacy callers. */
  onCompactionEnd?: (payload?: {
    completed: boolean;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when the actual model is selected (including after fallback).
   * Use this to get model/provider/thinkLevel for responsePrefix template interpolation. */
  onModelSelected?: (ctx: ModelSelectedContext) => void;
  /**
   * Controls whether normal assistant replies are automatically delivered to
   * the source conversation. `message_tool_only` prefers message-tool visible
   * delivery and keeps normal final text, block output, and preview output
   * private unless dispatch explicitly marks a source reply as deliverable.
   */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Enables task-suggestion tools only when the initiating surface can action Gateway events. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[];
  /** Called after a queued followup owns the reply lane, before its model run starts. */
  onQueuedFollowupAdmitted?: () => Promise<void> | void;
  /** Called after an admitted queued followup finishes, including failed attempts. */
  onQueuedFollowupSettled?: () => Promise<void> | void;
  /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean;
  /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void;
  /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean;
  /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number;
  /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[];
  /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
  /** Millisecond run timeout override; takes precedence over seconds (0 = no timeout). */
  timeoutOverrideMs?: number;
};
//#endregion
//#region src/auto-reply/templating.d.ts
/** Valid message channels for routing. */
type OriginatingChannelType = string & {
  readonly __originatingChannelBrand?: never;
};
type MentionSource = "explicit_bot" | "subteam" | "mention_pattern" | "implicit_thread" | "command_bypass" | "none";
type InboundSourceModality = "text" | "voice" | "audio" | "image" | "video" | "document";
type StickerContextMetadata = {
  cachedDescription?: string;
  emoji?: string;
  setName?: string;
  description?: string;
  fileId?: string;
  fileUniqueId?: string;
  uniqueFileId?: string;
  isAnimated?: boolean;
  isVideo?: boolean;
} & Record<string, unknown>;
type ChannelStructuredContextEntry = {
  label: string;
  source?: string;
  type?: string;
  payload: unknown;
  /** Keeps this provider-owned window independent of bounded canonical transcript enrichment. */
  sessionTranscriptMode?: "preserve";
  /** Internal exact-id hints for canonical transcript/live-cache deduplication. */
  sessionTranscriptDedupeMessageIds?: string[];
  /** Internal visible-text hints for legacy assistant rows without transcript ids. */
  sessionTranscriptAssistantTextDedupeKeys?: string[];
};
type SessionTranscriptContext = {
  chatWindow?: boolean;
  historyLimit: number;
  /** A platform-selected recent window keeps its configured bound and does not merge transcript rows. */
  historyKind?: "pending" | "recent";
  beforeTimestampMs?: number;
  minTimestampMs?: number;
  senderLabels?: {
    assistant: string;
    user: string;
  };
};
/** @deprecated Use ChannelStructuredContextEntry. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
type UntrustedStructuredContextEntry = ChannelStructuredContextEntry;
/** Structured supplemental facts projected into prompt context by inbound finalization. */
type SupplementalContextFacts = {
  quote?: {
    id?: string;
    fullId?: string;
    body?: string;
    sender?: string;
    senderAllowed?: boolean;
    isExternal?: boolean;
    isQuote?: boolean;
  };
  forwarded?: {
    from?: string;
    fromType?: string;
    fromId?: string;
    date?: number;
    senderAllowed?: boolean;
  };
  thread?: {
    id?: string;
    starterBody?: string;
    historyBody?: string;
    label?: string;
    parentSessionKey?: string;
    modelParentSessionKey?: string;
    senderAllowed?: boolean;
  };
  channelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use channelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  untrustedContext?: ChannelStructuredContextEntry[];
  groupSystemPrompt?: string;
  /** Prompt-like group metadata from user-controlled sources; never enters the system prompt. */
  untrustedGroupSystemPrompt?: string;
};
/** Canonical normalized inbound text populated once by `finalizeInboundContext`. */
type CanonicalInboundText = {
  /** Clean text used for command and directive parsing. */
  commandText: string;
  /** Prompt-facing text used for the agent turn. */
  agentText: string;
  /** Normalized visible/raw inbound text before command-specific projection. */
  rawText: string;
};
/** Raw inbound message context accepted from channels before finalization. */
type MsgContext = Partial<CanonicalInboundText> & {
  Body?: string;
  InboundEventKind?: InboundEventKind;
  /**
   * Agent prompt body (may include envelope/history/context). Prefer this for prompt shaping.
   * Should use real newlines (`\n`), not escaped `\\n`.
   */
  BodyForAgent?: string;
  /**
   * Recent chat history for context (untrusted user content). Prefer passing this
   * as structured context blocks in the user prompt rather than rendering plaintext envelopes.
   */
  InboundHistory?: HistoryEntry[];
  /** Internal facts used to merge canonical transcript turns before dispatch. */
  SessionTranscriptContext?: SessionTranscriptContext;
  /**
   * @deprecated Use CommandBody.
   *
   * Raw message body without structural context (history, sender labels).
   * Legacy alias for CommandBody. Falls back to Body if not set.
   */
  RawBody?: string;
  /**
   * Prefer for command detection; RawBody is treated as legacy alias.
   */
  CommandBody?: string;
  /**
   * Command parsing body. Prefer this over CommandBody/RawBody when set.
   * Should be the "clean" text (no history/sender context).
   */
  BodyForCommands?: string;
  CommandArgs?: CommandArgs;
  From?: string;
  To?: string;
  SessionKey?: string;
  /**
   * Resolved agent scope for canonical session keys that do not encode the agent
   * id, such as selected-agent global sessions.
   */
  AgentId?: string;
  /** Participant mention facts prepared once from the physical inbound message. */
  GroupThread?: GroupThreadMentionFacts;
  /** Effective routed DM scope, including binding overrides. */
  DmScope?: DmScope;
  /**
   * Session-like key used for runtime policy (sandbox/tool policy) when the
   * conversation key intentionally remains broader, such as a main-session DM.
   */
  RuntimePolicySessionKey?: string;
  /** Provider account id (multi-account). */
  AccountId?: string;
  ParentSessionKey?: string;
  /**
   * Session key used only for inheriting session-scoped model/provider
   * overrides. Unlike ParentSessionKey, this must not trigger transcript
   * forking or parent-session lifecycle behavior.
   */
  ModelParentSessionKey?: string;
  MessageSid?: string;
  /** Provider-specific full message id when MessageSid is a shortened alias. */
  MessageSidFull?: string;
  MessageSids?: string[];
  MessageSidFirst?: string;
  MessageSidLast?: string;
  AmbientTranscriptWatermarkKey?: string;
  AmbientTranscriptBody?: string;
  AmbientTranscriptMessageId?: string;
  AmbientTranscriptTimestampMs?: number;
  AmbientTranscriptPreviousMessageId?: string;
  AmbientTranscriptPreviousTimestampMs?: number;
  /** Per-turn reply-threading overrides. */
  ReplyThreading?: ReplyThreadingPolicy;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: ReplyToMode;
  ReplyToId?: string;
  /**
   * Root message id for thread reconstruction (used by Feishu for root_id).
   * When a message is part of a thread, this is the id of the first message.
   */
  RootMessageId?: string;
  /** Provider-specific full reply-to id when ReplyToId is a shortened alias. */
  ReplyToIdFull?: string;
  ReplyToBody?: string;
  ReplyToQuoteText?: string;
  ReplyToSender?: string;
  ReplyChain?: Array<{
    messageId?: string;
    threadId?: string;
    sender?: string;
    senderId?: string;
    senderUsername?: string;
    timestamp?: number;
    body?: string;
    isQuote?: boolean;
    mediaType?: string;
    mediaPath?: string;
    mediaRef?: string;
    replyToId?: string;
    forwardedFrom?: string;
    forwardedFromId?: string;
    forwardedFromUsername?: string;
    forwardedDate?: number;
  }>;
  ReplyToIsQuote?: boolean;
  /** Forward origin from the reply target (when reply_to_message is a forwarded message). */
  ReplyToForwardedFrom?: string;
  ReplyToForwardedFromType?: string;
  ReplyToForwardedFromId?: string;
  ReplyToForwardedFromUsername?: string;
  ReplyToForwardedFromTitle?: string;
  ReplyToForwardedDate?: number;
  ForwardedFrom?: string;
  ForwardedFromType?: string;
  ForwardedFromId?: string;
  ForwardedFromUsername?: string;
  ForwardedFromTitle?: string;
  ForwardedFromSignature?: string;
  ForwardedFromChatType?: string;
  ForwardedFromMessageId?: number;
  ForwardedDate?: number;
  ThreadStarterBody?: string;
  /** Full thread history when starting a new thread session. */
  ThreadHistoryBody?: string;
  IsFirstThreadTurn?: boolean;
  ThreadLabel?: string;
  /** @deprecated Use `media?.[0]?.path`. */
  MediaPath?: string;
  /** @deprecated Use `media?.[0]?.url`. */
  MediaUrl?: string;
  /** @deprecated Use `media?.[0]?.contentType` or `.kind`. */
  MediaType?: string;
  /** @deprecated Derive the directory from `media?.[0]?.path` at the consuming boundary. */
  MediaDir?: string;
  /** @deprecated Use `media?.map((entry) => entry.path)`. */
  MediaPaths?: string[];
  /** @deprecated Use `media?.map((entry) => entry.url)`. */
  MediaUrls?: string[];
  /** @deprecated Use `media?.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[];
  /** Ordered current-turn media facts; array position is attachment identity. */
  media?: MediaFact[];
  /** Original message modality before transcription or other media normalization. */
  SourceModality?: InboundSourceModality;
  /** @deprecated Use each media fact's `workspaceDir`. */
  MediaWorkspaceDir?: string;
  /** Attachment indexes whose audio was already transcribed before media understanding runs. */
  /** @deprecated Use each media fact's `transcribed` field. */
  MediaTranscribedIndexes?: number[];
  /**
   * Marker: skip downstream stageSandboxMedia. chat.send RPC sets this so
   * staging runs synchronously before respond() and surfaces 5xx to the
   * client; any later failure only reaches the broadcast channel.
   */
  /** @deprecated Use each media fact's `workspaceDir` or `staged` proof. */
  MediaStaged?: boolean;
  /** Telegram sticker metadata (emoji, set name, file IDs, cached description). */
  Sticker?: StickerContextMetadata;
  /** True when current-turn sticker media is present in structured facts. */
  StickerMediaIncluded?: boolean;
  /** Skip automatic understanding for the current sticker because its cached description is used. */
  SkipStickerMediaUnderstanding?: boolean;
  OutputDir?: string;
  OutputBase?: string;
  /** Remote host for SCP when media lives on a different machine (e.g., openclaw@192.168.64.3). */
  MediaRemoteHost?: string;
  Transcript?: string;
  MediaUnderstanding?: MediaUnderstandingOutput[];
  MediaUnderstandingDecisions?: MediaUnderstandingDecision[];
  LinkUnderstanding?: string[];
  Prompt?: string;
  MaxChars?: number;
  ChatType?: string;
  /** Trusted channel-configured policy for this admitted conversation turn. */
  ConversationToolPolicy?: GroupToolPolicyConfig;
  /** Human label for envelope headers (conversation label, not sender). */
  ConversationLabel?: string;
  GroupSubject?: string;
  /** Human label for channel-like group conversations (e.g. #general, #support). */
  GroupChannel?: string;
  GroupSpace?: string;
  /** Trusted provider role ids for the sender in this group turn. */
  MemberRoleIds?: string[];
  GroupMembers?: string;
  GroupSystemPrompt?: string;
  /**
   * Canonical inbound supplemental facts for new channel code. `finalizeInboundContext`
   * projects these to the existing flat reply/forward/thread/group prompt fields.
   */
  SupplementalContext?: SupplementalContextFacts;
  /** Channel-provided metadata that must not be treated as system instructions. */
  ChannelPromptContext?: string[];
  /** @deprecated Use ChannelPromptContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedContext?: string[];
  /** Structured channel metadata rendered by prompt assembly as fenced JSON. */
  ChannelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use ChannelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedStructuredContext?: UntrustedStructuredContextEntry[];
  /** System-attached provenance for the current inbound message. */
  InputProvenance?: InputProvenance;
  /** Internal wake cause, independent of transport, transcript provenance, and execution authority. */
  InternalTurnSource?: "heartbeat" | "cron" | "exec" | "event" | "progress-card-refresh";
  /** Explicit owner allowlist overrides (trusted, configuration-derived). */
  OwnerAllowFrom?: Array<string | number>;
  SenderName?: string;
  SenderId?: string;
  /** Trusted in-process creation provenance; never populated from channel payloads. */
  SessionCreation?: {
    skillLibrarySelections?: SkillLibrarySelection[];
    via: SessionCreatedVia;
    actor?: SessionCreatedActor;
    sandbox?: "required";
  };
  SenderUsername?: string;
  SenderTag?: string;
  SenderE164?: string;
  SenderIsBot?: boolean;
  /** Channel-ingress fact: sender is the operator's own account (from-me). */
  SenderIsSelf?: boolean;
  Timestamp?: number;
  LocationLat?: number;
  LocationLon?: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource?: string;
  LocationIsLive?: boolean;
  LocationLivePeriodSeconds?: number;
  LocationCaption?: string;
  /** Stable identity of the provider update that carried this message. */
  ProviderUpdateId?: string;
  /** Provider update kind, for example `message` or `edited_message`. */
  ProviderUpdateKind?: string;
  /** Provider-native timestamp for the original message. */
  ProviderMessageTimestamp?: number;
  /** Provider-native timestamp for an edited message update. */
  ProviderEditTimestamp?: number;
  /** Provider label. */
  Provider?: string;
  /** Provider surface label. Prefer this over `Provider` when available. */
  Surface?: string;
  /** Platform bot username when command mentions should be normalized. */
  BotUsername?: string;
  WasMentioned?: boolean;
  /** Effective channel-owned mention policy before any plugin-binding bypass. */
  GroupRequireMention?: boolean;
  /** True when this turn explicitly mentioned the current bot target. */
  ExplicitlyMentionedBot?: boolean;
  /** Provider-native explicit user mention ids present on this turn. */
  MentionedUserIds?: string[];
  /** Provider-native explicit user-group/subteam mention ids present on this turn. */
  MentionedSubteamIds?: string[];
  /** Provider-native implicit mention wake reasons present on this turn. */
  ImplicitMentionKinds?: string[];
  /** Provider-native source that caused the current mention decision. */
  MentionSource?: MentionSource;
  CommandAuthorized?: boolean;
  CommandTurn?: CommandTurnContext;
  CommandSource?: "text" | "native";
  CommandInterpretationSuppressed?: boolean;
  CommandTargetSessionKey?: string;
  /**
   * Internal flag: command handling prepared trailing prompt text for ACP dispatch.
   * Used for `/new <prompt>` and `/reset <prompt>` on ACP-bound sessions.
   */
  AcpDispatchTailAfterReset?: boolean;
  /** Gateway client scopes when the message originates from the gateway. */
  GatewayClientScopes?: string[];
  /** Gateway client capabilities when the message originates from the gateway. */
  GatewayClientCaps?: string[];
  /** Server-bound requesting browser; never sourced from message text or rendered into prompts. */
  GatewayUiCommandTarget?: GatewayUiCommandTarget;
  /** Run-scoped plugin tool bindings; never rendered into prompt text. */
  GatewayRunToolBindings?: Readonly<Record<string, unknown>>;
  /** Gateway device id allowed to review approvals initiated by this turn. */
  ApprovalReviewerDeviceId?: string;
  /** Thread identifier (Telegram topic id or Matrix thread event id). */
  MessageThreadId?: string | number;
  /** Provider-native thread target for reply delivery without making the session thread-scoped. */
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
  /** Channel-owned local conversation image reference; never rendered into prompt text. */
  ConversationAvatar?: string;
  /** Display-only launch destination; not delivery routing or prompt content. */
  ConversationLink?: SessionConversationLink;
  /** Channel-owned metadata exposed to plugin hook context, not prompt text. */
  ChannelContext?: PluginHookChannelContext;
  /** Provider-native chat/conversation id used by channel plugins that expose `chat_id`. */
  ChatId?: string;
  /** Stable provider-native direct-peer id when a DM room/user mapping must survive later writes. */
  NativeDirectUserId?: string;
  /** Telegram forum supergroup marker. */
  IsForum?: boolean;
  /** Human-readable Telegram forum topic name (cached from service messages). */
  TopicName?: string;
  /** Warning: DM has topics enabled but this message is not in a topic. */
  TopicRequiredButMissing?: boolean;
  /**
   * Originating channel for reply routing.
   * When set, replies should be routed back to this provider
   * instead of using lastChannel from the session.
   */
  OriginatingChannel?: OriginatingChannelType;
  /**
   * Originating destination for reply routing.
   * The chat/channel/user ID where the reply should be sent.
   */
  OriginatingTo?: string;
  /**
   * True when the current turn intentionally requested external delivery to
   * OriginatingChannel/OriginatingTo, rather than inheriting stale session route metadata.
   */
  ExplicitDeliverRoute?: boolean;
  /**
   * Internal proof that the channel ingress owner admitted this sender/event.
   * Correlation interceptors must fail closed when this proof is absent.
   */
  InboundAccessAuthorized?: boolean;
  /** Internal marker that channel ingress authoritatively observed route-context facts. */
  ConversationRouteContextObserved?: boolean;
  /** Canonical peer used by route selection; delivery targets may use a different namespace. */
  ConversationRoutePeerId?: string;
  /**
   * Internal flag for channels that emit message_received through a channel-specific
   * privacy gate before entering the shared reply dispatcher.
   */
  SuppressMessageReceivedHooks?: boolean;
  /**
   * Provider-specific parent conversation id for threaded contexts.
   * For Discord threads, this is the parent channel id.
   */
  ThreadParentId?: string;
  /**
   * Messages from hooks to be included in the response.
   * Used for hook confirmation messages like "Session context saved to memory".
   */
  HookMessages?: string[];
};
type FinalizedMsgContext = Omit<MsgContext, "CommandAuthorized"> & {
  /**
   * Always set by finalizeInboundContext().
   * Default-deny: missing/undefined becomes false.
   */
  CommandAuthorized: boolean;
  /**
   * Populated by finalizeInboundContext(); optional for public SDK
   * compatibility with existing plugin-constructed finalized contexts.
   */
  CommandTurn?: CommandTurnContext;
};
type RuntimeMediaContextKey = "MediaPath" | "MediaUrl" | "MediaType" | "MediaDir" | "MediaPaths" | "MediaUrls" | "MediaTypes" | "MediaWorkspaceDir" | "MediaTranscribedIndexes" | "MediaStaged";
/** Internal inbound context; legacy media fields exist only on the shipped SDK adapter. */
type RuntimeMsgContext = Omit<MsgContext, RuntimeMediaContextKey>;
type FinalizedRuntimeMsgContext = Omit<RuntimeMsgContext, "CommandAuthorized" | keyof CanonicalInboundText> & CanonicalInboundText & {
  CommandAuthorized: boolean;
  CommandTurn?: CommandTurnContext;
};
type NonTemplateContextKey = "ConversationAvatar" | "ConversationLink";
type TemplateContext = Omit<RuntimeMsgContext, NonTemplateContextKey> & {
  BodyStripped?: string;
  SessionId?: string;
  IsNewSession?: string;
  /** Local path for the attachment currently being processed. */
  AttachmentPath?: string;
  /** Original URL/reference for the attachment currently being processed. */
  AttachmentUrl?: string;
  /** MIME content type for the attachment currently being processed. */
  AttachmentContentType?: string;
  /** Directory containing AttachmentPath. */
  AttachmentDir?: string;
  /** Stable zero-based source fact index for the attachment currently being processed. */
  AttachmentIndex?: number;
  /** @deprecated Use AttachmentPath. */
  MediaPath?: string;
  /** @deprecated Use AttachmentUrl. */
  MediaUrl?: string;
  /** @deprecated Use AttachmentContentType. */
  MediaType?: string;
  /** @deprecated Use AttachmentDir. */
  MediaDir?: string;
};
//#endregion
//#region src/sessions/session-row-changes.d.ts
type SessionRowFacts = {
  kind: "unchanged";
} | {
  kind: "entry";
  previousSessionId: string | undefined;
  sessionId: string;
  category: string | null;
  clearMembers: boolean;
} | {
  kind: "member";
  sessionId: string;
  identityId: string;
  present: boolean;
} | {
  kind: "owner";
  sessionId: string;
  lifecycleRevision: string | null;
  owner: SessionEntry["owner"];
} | {
  kind: "participants";
  /** Participant history belongs to the logical key, across transcript replacements. */
  projection?: Pick<SessionEntry, "participants" | "participantCount">;
} | {
  kind: "category";
  sessionId: string;
  category: string | null;
} | {
  kind: "removed";
};
type SessionRowChange = {
  sessionKey: string;
  agentId?: string;
  storePath?: string;
  scope?: "automation" | "runtime" | "session-entry";
  /** Category uncertainty cannot change identity or lineage; other storage outcomes can. */
  factsInvalidated?: true | "category";
  /** Omission is a metadata notification; storage owners publish their changed facts. */
  facts?: SessionRowFacts;
} | {
  all: true;
  scope: string | {
    agentId?: string;
    storePath?: string;
    topology?: true;
  };
  factsInvalidated?: true;
};
//#endregion
//#region src/state/openclaw-agent-db-contract.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving and opening one agent database. */
type OpenClawAgentDatabaseOptions = OpenClawStateDatabaseOptions & {
  agentId: string;
};
/** Internal Doctor custody; never part of the plugin-facing database options. */
type OpenClawAgentDatabaseRepairAdmission = {
  /** Bind repair admission to the physical database inspected and backed up by its owner. */
  expectedIdentity?: DatabaseFileIdentity;
  /** Live caller authority for native open and schema/registry admission mutations. */
  assertCurrent?: () => void;
};
/** Shared-state registry row describing an agent database seen by this process. */
type OpenClawRegisteredAgentDatabase = {
  agentId: string;
  path: string;
  schemaVersion: number;
  lastSeenAt: number;
  sizeBytes: number | null;
};
type OpenClawAgentDatabaseRegistrationCommit = Readonly<{
  agentId: string;
  agentPath: string;
  stateDatabasePath: string;
  stateDatabaseIdentity: string;
}>;
type OpenClawAgentDatabaseRegistrationObserver = {
  starting?: () => void;
  committed?: (receipt: OpenClawAgentDatabaseRegistrationCommit) => void;
};
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.d.ts
type OpenClawAgentDatabaseValidation = {
  agentId: string;
  identity: string;
  /** Shared with admitted workers so owner invalidation revokes borrowed proof. */
  valid: SharedArrayBuffer;
  /** First full canonical proof; subsequent changes remain visible through the pending table. */
  canonicalReady: SharedArrayBuffer;
};
//#endregion
//#region src/state/openclaw-quarantine-store.d.ts
type OpenClawAgentIntegrityVerification = {
  path: string;
  dev: string;
  ino: string;
  app_version: string;
  verified_at: number;
  clean_close: number;
};
//#endregion
//#region src/state/openclaw-agent-db-lease.d.ts
type OpenClawAgentIntegrityVerificationReceiver = (record: OpenClawAgentIntegrityVerification | undefined, canReuseRuntimeIntegrity: boolean, invalidated: boolean) => void;
type OpenClawAgentDatabaseWorkerLeaseReceipt = {
  leaseId: string;
  agentId: string;
  path: string;
  ownerPid: number;
  ownerStartTime: number | null;
  sharedStatePath: string;
  sharedStateIdentity: string;
};
/** Preparation grants no access; claim repeats admission on the captured shared owner. */
declare function prepareOpenClawAgentDatabaseWorkerLease(params: {
  agentId: string;
  path: string;
  env?: NodeJS.ProcessEnv;
}, sharedDatabase: OpenClawStateDatabase, leaseId: string): {
  receipt: OpenClawAgentDatabaseWorkerLeaseReceipt;
  validation?: OpenClawAgentDatabaseValidation;
  claim(onVerification?: OpenClawAgentIntegrityVerificationReceiver): string;
};
//#endregion
//#region src/state/openclaw-agent-db-admission.d.ts
/** Denial still invokes run under admission, with a throwing authority check, to permit cleanup. */
type OpenClawAgentDatabaseWriteAdmission = <T>(run: (assertCurrent: () => void, validation?: OpenClawAgentDatabaseValidation) => T | Promise<T>) => Promise<T>;
//#endregion
//#region src/state/openclaw-agent-db.d.ts
declare const { openOpenClawAgentDatabase, runOpenClawAgentWriteTransaction, withOpenClawAgentDatabaseAsync, withOpenClawAgentDatabaseAdmission }: {
  openOpenClawAgentDatabase: (options: OpenClawAgentDatabaseOptions, preparedLease?: ReturnType<typeof prepareOpenClawAgentDatabaseWorkerLease>, registrationObserver?: OpenClawAgentDatabaseRegistrationObserver) => OpenClawAgentDatabase;
  runOpenClawAgentWriteTransaction: <T>(operation: (database: OpenClawAgentDatabase) => T, options: OpenClawAgentDatabaseOptions, transactionOptions?: Pick<SqliteTransactionOptions, "busyTimeoutMs" | "operationLabel" | "slowTransactionHoldMs" | "diagnosticContext"> & {
    repairAdmission?: OpenClawAgentDatabaseRepairAdmission;
  }) => T;
  withOpenClawAgentDatabaseAsync: <T>(inputOptions: OpenClawAgentDatabaseOptions, operation: (database: OpenClawAgentDatabase) => T | Promise<T>, assertCurrent?: () => void, signal?: AbortSignal) => Promise<T>;
  withOpenClawAgentDatabaseAdmission: <T>(inputOptions: OpenClawAgentDatabaseOptions, withAdmission: OpenClawAgentDatabaseWriteAdmission, operation: (database: OpenClawAgentDatabase) => T | Promise<T>) => Promise<T>;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  archiveDashboardAfterMs: number | null;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  preserveRecentMs?: number | null;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.types.d.ts
type SessionSharingEntry = Pick<InternalSessionEntry, "sessionId" | "previousSessionId" | "updatedAt" | "createdAt" | "initializationPending" | "providerReview" | "mainRestartRecovery" | "modelSelectionLocked" | "pendingProjectGitUrl" | "pendingWorktree" | "lifecycleRevision" | "lifecycleRunId" | "activeWriterRunId" | "subagentRecovery" | "archivedAt" | "repositoryWorkspaceId" | "visibility" | "incognito" | "createdActor" | "owner" | "sandbox" | "spawnedBy" | "spawnDepth" | "parentSessionKey" | "sessionStartedAt">;
type SessionEntryPublicationSource = {
  identity: string | symbol;
  birthtime: string | undefined;
  incarnation: string;
  filename: string;
  revision?: number;
};
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
/**
 * Session access API for callers that need entries or transcripts without
 * depending on the persisted store layout. Callers provide stable session
 * identity, and this module resolves the current entry/transcript target while
 * preserving canonical-key, transcript-linking, and update-notification rules.
 *
 * This accessor is the permanent storage-neutral domain boundary for
 * session/transcript runtime access. Legacy JSON import remains doctor-only.
 */
type SessionAccessScope = {
  /** Agent owner used when the session key does not already encode one. */
  agentId?: string;
  /**
   * Set false only for internal read-only hot paths that will not retain or
   * mutate the returned entry.
   */
  clone?: boolean;
  /** Configured default owner for fixed-store SQLite target derivation. */
  defaultAgentId?: string;
  /** Environment override used when resolving agent-scoped store paths in tests/tools. */
  env?: NodeJS.ProcessEnv;
  /** Set false for metadata-only reads that do not need hydrated prompt refs. */
  hydrateSkillPromptRefs?: boolean;
  /** Use latest when the caller must bypass any in-process metadata snapshot. */
  readConsistency?: "latest";
  /** Canonical or alias session key for the entry being read or written. */
  sessionKey: string;
  /** Explicit store path for callers that already resolved the owning store. */
  storePath?: string;
};
type SessionTranscriptAccessScope = Omit<SessionAccessScope, "sessionKey"> & {
  /** Deprecated transcript locator from older file-backed call sites. */
  sessionFile?: string;
  /** Runtime session id used to resolve the transcript identity. */
  sessionId: string;
  /** Required when resolving through session metadata; optional for legacy locators. */
  sessionKey?: string;
  /** Channel thread suffix used when deriving topic transcript paths. */
  threadId?: string | number;
};
type SessionTranscriptRuntimeScope = SessionTranscriptAccessScope & {
  sessionKey: string;
};
type SessionTranscriptReadScope = Omit<SessionTranscriptRuntimeScope, "sessionKey"> & {
  /** Canonical key when the caller has a session-store identity for this read. */
  sessionKey?: string;
  /** Entry already loaded by hot callers; avoids rereading the session store. */
  sessionEntry?: Partial<Pick<InternalSessionEntry, "sessionId">>;
  /** Byte budget enforced via SQL before parsing transcript event rows. */
  maxEventBytes?: number;
};
type SessionTranscriptWriteScope = Omit<SessionTranscriptAccessScope, "sessionId"> & {
  /** Optional for appenders that resolve it from the session entry. */
  sessionId?: string;
  /** Optional run-owned fence checked inside the transcript write transaction. */
  expectedWriterRunId?: string;
  /** Optional lifecycle fence paired with sessionId for run-owned writes. */
  expectedLifecycleRevision?: string;
  /** Exact owner facts, including absent fields, checked inside the write transaction. */
  expectedOwner?: Pick<InternalSessionEntry, "lifecycleRevision" | "activeWriterRunId">;
};
type SessionEntrySummary = {
  /** Persisted key for the entry. */
  sessionKey: string;
  /** Entry value cloned from the backing store unless the caller requested borrowed reads. */
  entry: InternalSessionEntry;
};
/** Raw transcript record for non-message events; message records use appendTranscriptMessage. */
type TranscriptEvent = unknown;
type TranscriptMessageAppendOptions<TMessage> = {
  /** Rebase a stale explicit parent when the current tail still descends from it. */
  appendIntent?: "active-branch";
  /** Runtime config used for message redaction and transcript header metadata. */
  config?: OpenClawConfig;
  /** Working directory recorded in a newly created transcript header. */
  cwd?: string;
  /** How duplicate message idempotency keys are detected before append. */
  idempotencyLookup?: "scan" | "scan-assistant" | "caller-checked";
  /** Reject the append when the transcript changed since the caller loaded it. */
  expectedMutationAt?: number | null;
  /** Provider/channel message payload to persist. */
  message: TMessage;
  /** Testable timestamp override for the generated transcript entry. */
  now?: number;
  /** Existing transcript event id owned by a caller with its own session tree. */
  eventId?: string;
  /** Existing parent id owned by a caller with its own session tree. */
  parentId?: string | null;
  /** Optional finalizer that runs after duplicate detection but before persistence. */
  prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined;
  /** Synchronous assertion after replay, custody, preparation, and redaction, before insertion. */
  beforeFreshMessageCommit?: () => void;
  /** Allow append without parent-link migration for large legacy linear transcripts. */
  useRawWhenLinear?: boolean;
};
type TranscriptMessageAppendResult<TMessage> = {
  /** False when idempotency lookup found an existing transcript message. */
  appended: boolean;
  /** Redacted message payload as persisted or replayed from the transcript. */
  message: TMessage;
  /** Existing or newly generated transcript message id. */
  messageId: string;
  /** Parent id actually used by the durable transcript append. */
  effectiveParentId?: string | null;
  /** Authoritative immutable identity issued by the append transaction. */
  anchor?: TranscriptEntryAnchor;
};
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
//#endregion
//#region src/config/sessions/cli-history-boundary.d.ts
/** Private proof of the account that owns every covered transcript event. */
type CliHistoryBoundary = {
  version: 1;
  sessionId: string;
  state: "unknown";
} | {
  version: 1;
  sessionId: string;
  state: "known";
  authFingerprint: string;
  generation: string | null;
  maxSeq: number | null;
  writerRunId: string;
};
//#endregion
//#region src/config/sessions/session-diff-baseline-capture.d.ts
type SessionDiffBaselineCapture = {
  version: 1;
  captureId: string;
  status: "pending" | "unavailable";
};
//#endregion
//#region packages/acp-core/src/types.d.ts
type SessionAcpIdentitySource = "ensure" | "status" | "event";
type SessionAcpIdentityState = "pending" | "resolved";
type SessionAcpIdentity = {
  /** Pending identities may expose provisional ids; resolved identities are safe for resume output. */
  state: SessionAcpIdentityState;
  acpxRecordId?: string;
  acpxSessionId?: string;
  agentSessionId?: string;
  /** Runtime lifecycle point that last supplied the identity fields. */
  source: SessionAcpIdentitySource;
  lastUpdatedAt: number;
};
type AcpSessionRuntimeOptions = {
  /**
   * ACP runtime mode set via session/set_mode (for example: "plan", "normal", "auto").
   */
  runtimeMode?: string;
  /** ACP runtime config option: model id. */
  model?: string;
  /** ACP runtime config option: thinking/reasoning effort. */
  thinking?: string;
  /** Working directory override for ACP session turns. */
  cwd?: string;
  /** ACP runtime config option: permission profile id. */
  permissionProfile?: string;
  /** ACP runtime config option: per-turn timeout in seconds. */
  timeoutSeconds?: number;
  /** Backend-specific option bag mapped through session/set_config_option. */
  backendExtras?: Record<string, string>;
};
type SessionAcpMeta = {
  backend: string;
  agent: string;
  runtimeSessionName: string;
  /** Canonical backend/agent ids used for resume hints and thread/status details. */
  identity?: SessionAcpIdentity;
  mode: "persistent" | "oneshot";
  runtimeOptions?: AcpSessionRuntimeOptions;
  cwd?: string;
  state: "idle" | "running" | "error";
  lastActivityAt: number;
  lastError?: string;
};
//#endregion
//#region src/cron/scheduled-tool-policy.d.ts
/** Closed, server-authored origin of an account-scoped scheduled tool cap. */
type CronScheduledToolCallerOrigin = {
  kind: "external";
  channel: string;
} | {
  kind: "local";
} | {
  kind: "unknown";
};
/**
 * Restrict-only execution target for a job's exec grant, captured from a
 * creator surface whose only exec capability was host-pinned. New pinned jobs
 * persist this as part of a grant-coupled envelope; unmarked legacy jobs keep
 * baseline exec behavior.
 */
type CronToolsAllowExecTarget = {
  version: 1;
  host: "gateway";
  /** Mandatory approval floor inherited from the captured creator surface. */
  ask?: "always";
};
/** Persisted proof that this job was created with an exact exec restriction. */
type CronToolsAllowExecTargetRequirement = {
  version: 1;
  target: CronToolsAllowExecTarget;
  grantIndex: number;
  recoveryRequired?: never;
} | {
  version: 1;
  target?: never;
  recoveryRequired: true;
};
/** Server-authored provenance for a persisted scheduled tool-cap authority envelope. */
type CronScheduledToolPolicy = {
  version: 1;
  mode: "trusted";
  ownerSessionKey?: never;
  ownerAccountId?: never;
} | {
  version: 1;
  mode: "account";
  ownerSessionKey: string;
  ownerAccountId: string;
};
//#endregion
//#region src/shared/session-types.d.ts
/** Runtime selection metadata for an agent row. */
type GatewayAgentRuntime = NonNullable<AgentSummary["agentRuntime"]>;
/** Thinking-level option exposed to UI clients. */
type GatewayThinkingLevelOption = NonNullable<AgentSummary["thinkingLevels"]>[number];
type GatewayContextWindowOption = NonNullable<ModelChoice["contextWindows"]>[number];
/** Assignable identity returned by the complete session-owner facet. */
type SessionOwnerFacetIdentity = SessionsAssignOwnerParams["owner"] & Pick<SessionCreatedActor$1, "label" | "avatarUrl" | "identity">;
/** Per-session Control UI face preference carried by session list rows. */
type SessionBoardFace = "chat" | "dashboard";
//#endregion
//#region src/config/sessions/main-session-recovery.types.d.ts
type MainRestartRecoveryState = {
  /** Stable identity for one interrupted episode; prevents clear-and-rewedge ABA matches. */
  cycleId: string;
  /** Monotonic identity for observations within the current recovery cycle. */
  revision: number;
  /** Attempts charged when their reservation is persisted, before dispatch. */
  chargedAttempts: number;
  /** Last attempt observed starting a backend turn; later startup failures get a fresh budget. */
  startedAttempt?: number;
  /** Private safe token for one recovered outer turn; raw identity refs never enter session state. */
  executionIdentity?: {
    tokenVersion: 1;
    contextId: string;
    executionId: string;
    runId: string;
    createdAt: number;
  };
  reservation?: {
    runId: string;
    attempt: number;
    lifecycleGeneration: string;
  };
  foregroundClaims?: {
    lifecycleGeneration: string;
    tokens: string[];
    /** Run identity for claims that have crossed the actual agent-run boundary. */
    runIdsByClaimId?: Record<string, string>;
  };
  tombstone?: {
    reason: string;
    /** Durable successor returned when an explicit rollover request is retried. */
    recoveredSessionId?: string;
    recoveredSessionKey?: string;
  };
};
//#endregion
//#region src/config/sessions/pending-final-delivery-types.d.ts
type PendingFinalDeliveryState = {
  createdAt: number;
  context?: DeliveryContext;
  intentId?: string;
  deliveries?: Array<{
    id: string;
    state: "prepared" | "queued" | "delivered" | "suppressed" | "unknown";
  }>;
} & ({
  kind: "replayable";
  text: string;
} | {
  kind: "transport-only";
});
/**
 * Owed user-visible notice that a final's delivery outcome stayed unknown.
 * Settled unknown custody records the debt here; the next same-route turn
 * sends it once, so an ambiguous loss never ends silently.
 */
type PendingDeliveryNoticeState = {
  createdAt: number;
  context: DeliveryContext;
  intentId: string;
  state: "owed" | "unresolved" | "acknowledged";
};
//#endregion
//#region src/config/sessions/session-model-fallback.d.ts
type AgentPatchedSessionModelFallback = {
  prevModel: string;
  prevProvider: string;
  prevModelOverride?: string;
  prevProviderOverride?: string;
  prevModelOverrideSource?: "auto" | "user" | "default";
  prevModelOverrideRouteResolution?: "resolved";
  prevModelOverrideFallbackOriginProvider?: string;
  prevModelOverrideFallbackOriginModel?: string;
  prevAuthProfileOverride?: string;
  prevAuthProfileOverrideSource?: "auto" | "user" | "user-link";
  prevAuthProfileOverrideCompactionCount?: number;
  prevContextWindow?: string;
  prevThinkingLevel?: string;
  lastValidatedPatchTs?: number;
  ts: number;
  source: "agent-patch";
};
//#endregion
//#region src/config/sessions/session-prompt-types.d.ts
type SessionSkillPromptRef = {
  version: 1;
  algorithm: "sha256";
  hash: string;
  bytes: number;
};
type SessionSkillSnapshot = {
  librarySelections?: SkillLibrarySelection[];
  prompt: string;
  /** Persisted stores may replace large duplicate prompts with a content-addressed blob ref. */
  promptRef?: SessionSkillPromptRef;
  skills: Array<{
    name: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: {
    canExec: boolean;
    node?: string;
  };
  /**
   * Runtime-only, never persisted. Carries the full parsed Skill[] (including
   * each SKILL.md body) so the embedded runner can skip a workspace skill
   * scan within a turn. Persistence projections strip it before committing
   * session state. On a cold session resume this is undefined and
   * src/skills/runtime/embedded-run-entries.ts rebuilds it from disk.
   */
  resolvedSkills?: Skill[];
  /** Runtime-only model-discoverable catalog before prompt budgeting; never persisted. */
  discoverySkills?: Skill[];
  version?: number;
};
//#endregion
//#region src/config/sessions/session-system-prompt-report.d.ts
/** Persisted size and provenance summary for one assembled system prompt. */
type SessionSystemPromptReport = {
  source: "run" | "estimate";
  generatedAt: number;
  sessionId?: string;
  sessionKey?: string;
  provider?: string;
  model?: string;
  workspaceDir?: string;
  bootstrapMaxChars?: number;
  bootstrapTotalMaxChars?: number;
  bootstrapTruncation?: {
    warningMode?: "off" | "once" | "always";
    warningShown?: boolean;
    promptWarningSignature?: string;
    warningSignaturesSeen?: string[];
    truncatedFiles?: number;
    nearLimitFiles?: number;
    totalNearLimit?: boolean;
  };
  sandbox?: {
    mode?: string;
    sandboxed?: boolean;
  };
  systemPrompt: {
    chars: number;
    projectContextChars: number;
    nonProjectContextChars: number;
    hash?: string;
  };
  currentTurn?: {
    kind?: "user_request" | "room_event";
    promptChars: number;
    runtimeContextChars: number;
    modelOnlyPromptChars?: number;
  };
  injectedWorkspaceFiles: Array<{
    name: string;
    path: string;
    missing: boolean;
    rawChars: number;
  } & ({
    injectionStatus?: "verified";
    injectedChars: number;
    truncated: boolean;
  } | {
    injectionStatus: "native_unverified";
    injectedChars: null;
    truncated: null;
  })>;
  skills: {
    promptChars: number;
    hash?: string;
    entries: Array<{
      name: string;
      blockChars: number;
    }>;
  };
  tools: {
    listChars: number;
    schemaChars: number;
    entries: Array<{
      name: string;
      summaryChars: number;
      summaryHash?: string;
      schemaChars: number;
      schemaHash?: string;
      propertiesCount?: number | null;
    }>;
  };
};
//#endregion
//#region src/config/sessions/session-tool-overrides.d.ts
type SessionToolOverrides = {
  mcpServers?: Record<string, boolean>;
  mcpToolsDeny?: Record<string, string[]>;
  skills?: Record<string, boolean>;
  webSearch?: boolean;
};
//#endregion
//#region src/config/sessions/session-worktree-intent.d.ts
/** Private source selection accepted under the session creation lifecycle lock. */
type PendingSessionWorktree = {
  workspace?: string;
  /** Source custody accepted by the locked creation owner, not public request input. */
  source?: {
    kind: "project" | "worktree";
    id: string;
  };
  name?: string;
  baseRef?: string;
  /** Verified commit used for checkout while baseRef remains user-facing metadata. */
  baseCommit?: string;
  titleSource: string;
};
//#endregion
//#region src/config/sessions/types.d.ts
type SessionChatType = ChatType;
type PersistedSessionRunStatus = SessionRunStatus;
declare const SESSION_TOTAL_TOKENS_VERSION: 1;
type SessionOrigin = {
  label?: string;
  provider?: string;
  surface?: string;
  chatType?: SessionChatType;
  from?: string;
  to?: string;
  nativeChannelId?: string;
  nativeDirectUserId?: string;
  avatar?: string;
  accountId?: string;
  threadId?: string | number;
};
/** Canonical persisted delivery ownership for one session. */
type SessionDeliveryState = {
  kind: "none";
} | {
  kind: "internal";
} | {
  kind: "external";
  route: ChannelRouteRef;
  context: DeliveryContext;
  origin: SessionOrigin;
};
/**
 * Durable transcript-repair record: an assistant final that was delivered to
 * the user but could not be appended to the canonical transcript. Kept
 * separate from `pendingFinalDelivery` so transport-replay cleanup never drops
 * the only copy of the missing assistant turn.
 */
type PendingTranscriptRepairState = {
  /** Stable identity for retry-safe transcript insertion. */
  id: string;
  text: string;
  provider?: string;
  model?: string;
  createdAt: number;
};
type FallbackNoticeState = {
  kind: "active";
  selectedModel: string;
  activeModel: string;
  reason?: string;
};
type MemoryFlushState = {
  kind: "succeeded";
  compactionCount: number;
} | {
  kind: "failed";
  compactionCount?: number;
  failureCount: number;
};
type CliSessionReseedReceipt = {
  version: 1;
  promptHash: string;
  localSessionId: string;
  userTurnDisposition: "persisted" | "omitted";
};
type SessionDiffBaseline = {
  version: 1;
  sessionId: string;
  root: string;
  files: Array<{
    path: string;
    fingerprint: string;
  }>;
  /** Some checkout entries could not be fingerprinted without exceeding diff safety caps. */
  truncated?: true;
};
type CliSessionBinding = {
  sessionId: string;
  /** Last successful assistant boundary accepted by the backend's resume contract. */
  resumeCheckpointId?: string;
  /** Resume with the backend's fork argument once, then clear before process start. */
  forkNextResume?: true;
  /** Trust an explicitly attached CLI session even when auth, prompt, or MCP fingerprints drift. */
  forceReuse?: boolean;
  authProfileId?: string;
  authEpoch?: string;
  authEpochVersion?: number;
  extraSystemPromptHash?: string;
  messageToolPolicyHash?: string;
  promptToolNamesHash?: string;
  cwdHash?: string;
  mcpConfigHash?: string;
  mcpResumeHash?: string;
  /** Identifies one synthetic history prompt and the trusted local handling of its user turn. */
  reseedReceipt?: CliSessionReseedReceipt;
};
type AcpSessionBinding = {
  acpBackendId: string;
  acpAgentId: string;
  agentSessionId: string;
};
type SessionContextBudgetStatusRoute = "fits" | "compact_only" | "truncate_tool_results_only" | "compact_then_truncate";
type SessionContextBudgetStatus = {
  schemaVersion: 1;
  source: "pre-prompt-estimate";
  updatedAt: number;
  provider: string;
  model: string;
  route: SessionContextBudgetStatusRoute;
  shouldCompact: boolean;
  estimatedPromptTokens: number;
  contextTokenBudget: number;
  promptBudgetBeforeReserve: number;
  reserveTokens: number;
  effectiveReserveTokens: number;
  remainingPromptBudgetTokens: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  messageCount: number;
  unwindowedMessageCount: number;
  sessionId?: string;
};
type AmbientTranscriptWatermark = {
  sessionId: string;
  messageId: string;
  timestampMs?: number;
  updatedAt: number;
};
type SessionPluginDebugEntry = {
  pluginId: string;
  lines: string[];
};
type SessionPluginJsonValue = string | number | boolean | null | SessionPluginJsonValue[] | {
  [key: string]: SessionPluginJsonValue;
};
type SessionPluginNextTurnInjection = {
  id: string;
  pluginId: string;
  pluginName?: string;
  text: string;
  idempotencyKey?: string;
  placement: "prepend_context" | "append_context";
  ttlMs?: number;
  createdAt: number;
  metadata?: SessionPluginJsonValue;
};
type SubagentRecoveryState = {
  /** Consecutive accepted automatic orphan-recovery resumes in the rapid re-wedge window. */
  automaticAttempts?: number;
  /** Timestamp (ms) of the latest accepted automatic orphan-recovery resume. */
  lastAttemptAt?: number;
  /** Registry run id that triggered the latest automatic orphan-recovery resume. */
  lastRunId?: string;
  /** Visible execution retained while the recovered run uses an internal transcript. */
  sessionLifecycleRunId?: string;
  /** Timestamp (ms) when automatic recovery was tombstoned for this session. */
  wedgedAt?: number;
  /** Human-readable reason automatic recovery was tombstoned. */
  wedgedReason?: string;
};
type LaneExecutionState = "active" | "draining" | "suspended" | "resuming" | "circuit_open" | "failed_handoff";
interface QuotaSuspension {
  schemaVersion: 1;
  suspendedAt: number;
  reason: "quota_exhausted" | "manual" | "circuit_open";
  failedProvider: string;
  failedModel: string;
  /** Recovery briefing text injected into the next attempt when state === "resuming". */
  summary?: string;
  /** Opaque pointer to an external snapshot blob (path/key); not the briefing text itself. */
  snapshotRef?: string;
  /**
   * @deprecated Lane suspension was removed; nothing writes this anymore. Kept only to
   * hold the shipped SDK surface stable; drop at the next surface window.
   */
  laneId?: string;
  expectedResumeBy?: number;
  state: LaneExecutionState;
}
type RestartRecoveryRun = {
  runId: string;
  lifecycleGeneration: string;
};
type SessionEntryCore = SessionRestartRecoveryState & SessionEntryProvenance & Pick<SessionRow, "permissionMode" | "sandboxMode" | "nativeRuntimeConsent" | "sessionRoot"> & {
  /** Collaboration mode. Missing legacy values are equivalent to "shared". */
  visibility?: NonNullable<SessionRow["visibility"]>;
  /**
   * Last delivered heartbeat payload (used to suppress duplicate heartbeat notifications).
   * Stored on the main session entry.
   */
  lastHeartbeatText?: string;
  /** Timestamp (ms) when lastHeartbeatText was delivered. */
  lastHeartbeatSentAt?: number;
  /**
   * Base session key for heartbeat-created isolated sessions.
   * When present, `<base>:heartbeat` is a synthetic isolated session rather than
   * a real user/session-scoped key that merely happens to end with `:heartbeat`.
   */
  heartbeatIsolatedBaseSessionKey?: string;
  /** Legacy heartbeat task timestamps consumed and cleared only by doctor migration. */
  heartbeatTaskState?: Record<string, number>;
  /** Plugin-owned session state, grouped by plugin id then extension namespace. */
  pluginExtensions?: Record<string, Record<string, SessionPluginJsonValue>>;
  /** Trusted session initialization is incomplete; all work admission stays blocked. */
  initializationPending?: true;
  /** Top-level SessionEntry mirror slots owned by plugin session extensions. */
  pluginExtensionSlotKeys?: Record<string, Record<string, string>>;
  /** Durable one-shot prompt additions drained before the next agent turn. */
  pluginNextTurnInjections?: Record<string, SessionPluginNextTurnInjection[]>;
  sessionId: string;
  updatedAt: number;
  /** Process-lifetime session whose entry and transcript stay in the in-memory agent database. */
  incognito?: true;
  /** Opaque owner revision used to reject stale lifecycle mutations. */
  lifecycleRevision?: string;
  /** Current provider precaution; only its acknowledged continuation may start work. */
  providerReview?: SessionProviderReview;
  /** Timestamp (ms) when the session was archived from active session lists. */
  archivedAt?: number;
  /** Actor that archived the session; cleared when the session is restored. */
  archivedBy?: SessionActor;
  /** Stable lifecycle cause; absent values are legacy archives and remain manually protected. */
  archiveReason?: SessionEntryArchiveReason;
  /** Timestamp (ms) when the session was pinned for quick access. */
  pinnedAt?: number;
  /** Epoch ms wake time; suppresses the active session in sidebar lists until then. */
  snoozedUntil?: number;
  /** Server-stamped epoch ms when the current snooze was set. */
  snoozedAt?: number;
  /** Timestamp (ms) when an operator client last marked the session read. */
  lastReadAt?: number;
  /** Agent-declared sidebar presence; projection drops it after expiresAt. */
  agentStatus?: SessionAgentStatus;
  /** Latest utility-model status judgment for idle session status surfaces. */
  observerDigest?: SessionObserverDigest;
  /** Versioned, reconstructible Activity recap; never authoritative task status. */
  activitySummary?: SessionActivitySummary;
  /** Timestamp (ms) when an operator explicitly marked the session unread; cleared on read. */
  markedUnreadAt?: number;
  /** Timestamp (ms) of the latest completed agent run; metadata patches do not update it. */
  lastActivityAt?: number;
  /** Parent session key that spawned this session (used for sandbox session-tool scoping). */
  spawnedBy?: string;
  /** Host-captured owner status of the spawning invocation; never inferred from child launch authority. */
  spawnedBySenderIsOwner?: boolean;
  /** Parent session id captured with the spawn authority receipt; navigation uses parentSessionId. */
  spawnedBySessionId?: string;
  /** Immutable session key authorized to receive this child's completion handoff. */
  completionOwnerSessionKey?: string;
  /** Workspace inherited by spawned sessions and reused on later turns for the same child session. */
  spawnedWorkspaceDir?: string;
  /** Task working directory inherited by spawned sessions and reused on later turns. */
  spawnedCwd?: string;
  /** Content-free fingerprints for checkout changes that predate this session generation. */
  sessionDiffBaseline?: SessionDiffBaseline;
  /**
   * Managed worktree bound to this session; set with spawnedCwd at worktree
   * creation and cleared together when a plain New Chat detaches the checkout.
   */
  worktree?: {
    id: string;
    branch: string;
    repoRoot: string;
    /** Durable skill workspace prepared when this session runs from a managed worktree. */
    canonicalWorkspaceDir?: string;
  };
  /** Project registry id selected when this logical session node was created. */
  projectId?: string;
  /** Durable cloud repository owner; never identifies a Gateway filesystem path. */
  repositoryWorkspaceId?: string;
  /** Explicit parent session linkage for dashboard-created child sessions. */
  parentSessionKey?: string;
  /** Exact parent incarnation captured when this child was created. */
  parentSessionId?: string;
  /** Exact parent lifecycle captured for native spawn authority, including same-id resets. */
  parentSessionLifecycleRevision?: string;
  /** How this session node came to exist; written once and retained across sessionId rotations. */
  createdVia?: SessionCreatedVia;
  /** Actor that caused node creation, with an optional profile, session, or sender id; written once. */
  createdActor?: SessionCreatedActor;
  /** Creation-only sandbox requirement; existing unstamped sessions always remain unstamped. */
  sandbox?: "required";
  /** Mutable responsibility, projected from SQLite; absent means createdActor owns the session. */
  owner?: SessionOwnerAssignment;
  /** Retained identities, projected from the participant table before display truncation. */
  participants?: SessionParticipant[];
  /** Raw retained identity count, including the owner, for admission-bound coverage. */
  participantCount?: number;
  /** Node creation time (ms); unlike sessionStartedAt, survives sessionId rotations. */
  createdAt?: number;
  /** Exact source generation and optional cut entry for an actual transcript-copy fork. */
  forkSource?: {
    sessionKey: string;
    sessionId: string;
    entryId?: string;
  };
  /** Session id of the prior transcript generation under this same session key. */
  previousSessionId?: string;
  /** Thread parent-seeding settled marker; also set when seeding is deliberately skipped. */
  forkedFromParent?: boolean;
  /** Subagent spawn depth (0 = main, 1 = sub-agent, 2 = sub-sub-agent). */
  spawnDepth?: number;
  /** Explicit role assigned at spawn time for subagent tool policy/control decisions. */
  subagentRole?: "orchestrator" | "leaf";
  /** Explicit control scope assigned at spawn time for subagent control decisions. */
  subagentControlScope?: "children" | "none";
  /** Version of the requester tool-policy snapshot captured when this child was spawned. */
  inheritedToolPolicyVersion?: 1;
  /** Session-scoped tool deny entries inherited from the caller that created this session. */
  inheritedToolDeny?: string[];
  /** Session-scoped tool allow entries inherited from the caller that created this session. */
  inheritedToolAllow?: string[];
  systemSent?: boolean;
  abortedLastRun?: boolean;
  /** Interrupted run generations whose late lifecycle events must be ignored. */
  restartRecoveryRuns?: RestartRecoveryRun[];
  /** Keeps automatic restart recovery limited to replay-safe tools until the run terminates. */
  restartRecoveryForceSafeTools?: true;
  /** Durable guard state for automatic subagent orphan recovery. */
  subagentRecovery?: SubagentRecoveryState;
  /** Quota cascade protection and state-aware failover status. */
  quotaSuspension?: QuotaSuspension;
  /** Core-owned durable goal state for this thread/session. */
  goal?: SessionGoal;
  /** Timestamp (ms) when the current sessionId first became active. */
  sessionStartedAt?: number;
  /** Stable usage lineage key for transcript-backed rollups across sessionId rotations. */
  usageFamilyKey?: string;
  /** Session ids known to belong to this usage lineage, including archived predecessors. */
  usageFamilySessionIds?: string[];
  /** Timestamp (ms) of the last user/channel interaction that should extend idle lifetime. */
  lastInteractionAt?: number;
  /** Stable first-run start time for subagent sessions, persisted after completion. */
  startedAt?: number;
  /** Latest completed run end time for subagent sessions, persisted after completion. */
  endedAt?: number;
  /** Accumulated runtime across subagent follow-up runs, persisted after completion. */
  runtimeMs?: number;
  /** Final persisted subagent run status, used after in-memory run archival. */
  status?: PersistedSessionRunStatus;
  /** Compact user-facing reason for the latest failed or timed-out run. */
  lastRunError?: string;
  /**
   * Session-level stop cutoff captured when /stop is received.
   * Messages at/before this boundary are skipped to avoid replaying
   * queued pre-stop backlog.
   */
  abortCutoffMessageSid?: string;
  /** Epoch ms cutoff paired with abortCutoffMessageSid when available. */
  abortCutoffTimestamp?: number;
  chatType?: SessionChatType;
  contextWindow?: string;
  thinkingLevel?: string;
  /**
   * Exact isolated-cron continuation policy. Only hidden `:run:` session rows
   * carry this while detached generated-media work may still wake the run.
   */
  cronRunContinuation?: {
    lifecycleRevision: string;
    phase: "running" | "ready" | "continuing";
    /** True only after this row's session changes were projected to the stable cron row. */
    basePersisted?: boolean;
    ownerRunId?: string;
    /** Gateway lifecycle generation that owns a continuing claim. */
    ownerLifecycleGeneration?: string;
    /** CLI backend whose native session must exist before media work detaches. */
    cliExecutionProvider?: string;
    toolsAllow?: string[];
    toolsAllowIsDefault?: boolean;
    /** Exact server-stamped authority provenance copied from the owning cron job. */
    scheduledToolPolicy?: CronScheduledToolPolicy;
    /** Restrict-only exec pin copied from the owning cron job's cap. */
    toolsAllowExecTarget?: CronToolsAllowExecTarget;
    /** Expected pin copied with the cap so detached continuation loss fails closed. */
    toolsAllowExecTargetRequirement?: CronToolsAllowExecTargetRequirement;
    /** Store-private origin paired with an account scheduled-tool policy. */
    scheduledToolCallerOrigin?: CronScheduledToolCallerOrigin;
    cliSessionBindingFacts?: {
      extraSystemPromptStatic?: string;
      sourceReplyDeliveryMode?: "automatic" | "message_tool_only";
      requireExplicitMessageTarget?: boolean;
    };
  };
  fastMode?: FastMode;
  toolOverrides?: SessionToolOverrides;
  /** Swarm group for collector-mode child sessions. */
  swarmGroupId?: string;
  /** Marks non-interactive collector-mode child sessions. */
  swarmCollector?: boolean;
  /** JSON Schema exposed through the synthetic structured_output tool. */
  swarmOutputSchema?: Record<string, unknown>;
  verboseLevel?: string;
  traceLevel?: string;
  reasoningLevel?: string;
  elevatedLevel?: string;
  ttsAuto?: TtsAutoMode;
  /** Hash of the latest assistant reply that was sent through `/tts latest`. */
  lastTtsReadLatestHash?: string;
  /** Timestamp (ms) when `/tts latest` last sent audio for this session. */
  lastTtsReadLatestAt?: number;
  execHost?: string;
  execNode?: string;
  /** Working directory interpreted only by the bound exec node. */
  execCwd?: string;
  responseUsage?: "on" | "off" | "tokens" | "full";
  providerOverride?: string;
  modelOverride?: string;
  /** Session-scoped agent runtime/harness override selected with the model picker. */
  agentRuntimeOverride?: string;
  /**
   * Tracks whether the persisted model selection came from an explicit user
   * action (`/model`, `sessions.patch`), a temporary runtime fallback, or an
   * explicit configured-default selection that blocks parent inheritance.
   */
  modelOverrideSource?: "auto" | "user" | "default";
  /** Present only when providerOverride/modelOverride are a canonical route pair. */
  modelOverrideRouteResolution?: "resolved";
  /** Selected model that produced the current auto fallback override. */
  modelOverrideFallbackOriginProvider?: string;
  modelOverrideFallbackOriginModel?: string;
  /** One-run rollback guard for a model selected by the agent sessions tool. */
  modelFallback?: AgentPatchedSessionModelFallback;
  authProfileOverride?: string;
  authProfileOverrideSource?: "auto" | "user" | "user-link";
  authProfileOverrideCompactionCount?: number;
  /**
   * Set on explicit user-driven session model changes (for example `/model`
   * and `sessions.patch`) during an active run. The embedded runner checks
   * this flag to decide whether to throw `LiveSessionModelSwitchError`.
   * System-initiated fallbacks (rate-limit retry rotation) never set this
   * flag, so they are never mistaken for user-initiated switches.
   */
  liveModelSwitchPending?: boolean;
  groupActivation?: "mention" | "always";
  groupActivationNeedsSystemIntro?: boolean;
  sendPolicy?: "allow" | "deny";
  queueMode?: QueueMode;
  queueDebounceMs?: number;
  queueCap?: number;
  queueDrop?: "old" | "new" | "summarize";
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  pendingFinalDelivery?: PendingFinalDeliveryState;
  pendingDeliveryNotice?: PendingDeliveryNoticeState;
  /**
   * Ordered durable backlog of delivered assistant finals that failed to
   * reach the canonical transcript. Session admission restores each item
   * before another turn can extend that transcript. Kept as a list so
   * independently admitted writers never overwrite an earlier reply.
   */
  pendingTranscriptRepair?: PendingTranscriptRepairState[];
  /**
   * Whether totalTokens reflects a fresh context snapshot for the latest run.
   * Undefined means legacy/unknown freshness; false forces consumers to treat
   * totalTokens as stale/unknown for context-utilization displays.
   */
  totalTokensFresh?: boolean;
  /** Version 1 records totalTokens as the current prompt/context snapshot only. */
  totalTokensVersion?: typeof SESSION_TOTAL_TOKENS_VERSION;
  estimatedCostUsd?: number;
  cacheRead?: number;
  cacheWrite?: number;
  modelProvider?: string;
  model?: string;
  /**
   * Prevents OpenClaw model changes and automatic maintenance eviction until
   * the owning harness explicitly retires the session.
   */
  modelSelectionLocked?: boolean;
  /**
   * Embedded agent harness selected for this session id.
   * Prevents config/env changes from moving an existing transcript between
   * incompatible runtime harnesses.
   */
  agentHarnessId?: string;
  fallbackNotice?: FallbackNoticeState;
  contextTokens?: number;
  /** Origin of the persisted context window; `resolved` is legacy/unverified. */
  contextTokensSource?: "runtime" | "runtime-configured" | "resolved" | "resolved-v1";
  contextBudgetStatus?: SessionContextBudgetStatus;
  compactionCount?: number;
  memoryFlush?: MemoryFlushState;
  cliSessionIds?: Record<string, string>;
  cliSessionBindings?: Record<string, CliSessionBinding>;
  /** Initialization fence for seeding canonical ACP metadata; cleared after creation. */
  acpSessionBinding?: AcpSessionBinding;
  claudeCliSessionId?: string;
  label?: string;
  /** Automatic device name; never claims a custom label or overrides a generated title. */
  autoLabel?: string;
  /** Persistent sidebar emoji, named glyph, or canonical SVG image data URL. */
  icon?: string;
  /** Named sidebar tint (SESSION_COLOR_IDS); palette mirrors Claude Code /color for import. */
  color?: string;
  /** User-defined organization bucket for session lists; unrelated to chat groupId/groupChannel. */
  category?: string;
  /** Preferred Control UI face when a caller opens this session without explicit face intent. */
  boardFace?: SessionBoardFace;
  /** Shared dashboard presentation default; absence uses the built-in split view. */
  boardPresentation?: NonNullable<SessionRow["boardPresentation"]>;
  displayName?: string;
  /** Canonical delivery state. Legacy delivery fields are migrated by `openclaw doctor --fix`. */
  delivery?: SessionDeliveryState;
  groupId?: string;
  subject?: string;
  /** Display-only topic name; subject remains the group name used for routing. */
  topicName?: string;
  groupChannel?: string;
  space?: string;
  /** Last ambient room message durably appended to this transcript, keyed by channel scope. */
  ambientTranscriptWatermarks?: Record<string, AmbientTranscriptWatermark>;
  skillsSnapshot?: SessionSkillSnapshot;
  /** Explicit authorized immutable library pins; current speakers never replace this selection. */
  skillLibrarySelections?: SkillLibrarySelection[];
  systemPromptReport?: SessionSystemPromptReport;
  /**
   * Generic plugin-owned runtime debug entries shown in verbose status surfaces.
   * Each plugin owns and may overwrite only its own entry between turns.
   */
  pluginDebugEntries?: SessionPluginDebugEntry[];
  acp?: SessionAcpMeta;
};
interface SessionEntry extends SessionEntryCore {}
/** Internal durable fields excluded from public/plugin session projections. */
type SessionProfileInvolvement = {
  hidden: boolean;
  updatedAt: number;
  /** Original committed source ordering, retained when the person hides the session. */
  lastMention?: {
    generation: string;
    sequence: number;
    timestamp: number;
  };
};
type InternalSessionEntryCore = SessionEntryCore & {
  /** Personal discovery state, never participation, attribution, or sharing authority. */
  profileInvolvement?: {
    key: string;
    profiles: Record<string, SessionProfileInvolvement>;
  };
  /** Transcript-wide account provenance; native binding replacement must not replace it. */
  cliHistoryBoundary?: CliHistoryBoundary;
  /** Explicit world-readable publication, bound to one transcript generation. */
  publicShare?: {
    id: string;
    sessionId: string;
    createdAt: number;
  };
  /** Run that owns the current non-terminal Gateway lifecycle projection. */
  lifecycleRunId?: string;
  /** Exact run that produced the latest terminal Gateway lifecycle projection. */
  lastRunId?: string;
  /** Run admitted by the session lane; overwritten at admission and checked by transcript writes. */
  activeWriterRunId?: string;
  /** Canonical remote repository awaiting preparation by this exact session generation. */
  pendingProjectGitUrl?: string;
  /** Authorized worktree intent awaiting preparation by an admitted turn. */
  pendingWorktree?: PendingSessionWorktree;
  /** Suppresses repeated byte-triggered compaction after an oversized successor was observed. */
  transcriptByteCompactionLatch?: {
    activeBytes: number;
    sessionId: string;
    maxBytes: number;
  };
  /** Private per-generation ownership for the pre-runtime checkout baseline capture. */
  sessionDiffBaselineCapture?: SessionDiffBaselineCapture;
  mainRestartRecovery?: MainRestartRecoveryState;
};
interface InternalSessionEntry extends InternalSessionEntryCore {}
type GroupKeyResolution = {
  key: string;
  channel?: string;
  id?: string;
  chatType?: SessionChatType;
};
//#endregion
//#region src/sessions/provider-review.d.ts
declare const acknowledgmentBrand: unique symbol;
/** Host-issued capability; serialized request metadata cannot create one. */
interface ProviderReviewAcknowledgment {
  readonly [acknowledgmentBrand]: true;
  readonly read: () => Readonly<{
    review: Readonly<SessionProviderReview>;
    phase: "pending" | "accepted";
  }>;
  readonly assertRuntime: (runtime: {
    provider: string;
    model: string;
    runtimeId: string;
    api?: string;
    assertCurrent: () => void;
  }) => Promise<void>;
  readonly acceptNativeTurn: (accepted: {
    nativeThreadId: string;
    nativeTurnId: string;
    assertCurrent: () => void;
  }) => Promise<void>;
}
//#endregion
//#region src/infra/agent-run-registry.types.d.ts
type AgentRunModel = {
  provider: string;
  model: string;
};
type ProjectedAgentRunState = "queued" | "running" | "capacity-wait";
type ProjectedAgentRunIndex = {
  modelsBySessionId: ReadonlyMap<string, AgentRunModel | null>;
  sessionKeys: ReadonlyMap<string, ProjectedAgentRunState>;
  sessionIds: ReadonlyMap<string, ProjectedAgentRunState>;
  ownerlessSessionKeys: ReadonlyMap<string, ProjectedAgentRunState>;
  ownerlessSessionIds: ReadonlyMap<string, ProjectedAgentRunState>;
};
//#endregion
//#region src/agents/operator-model-policy.types.d.ts
type PreparedOperatorModelPolicy = Readonly<{
  /** Ordered concrete choices for Default and automatic fallback; never a global catalog. */
  models: readonly ProviderModelRef[];
  /** Compares resolved logical identities, preserving provider/auth routing. */
  allows: (ref: ProviderModelRef) => boolean;
}>;
declare namespace admitted_run_context_d_exports {
  export { AdmittedRunContext, AdmittedRunOperatorAuthority, OperationalRunInstanceRef, PreparedAgentRunAdmission, assertAdmittedRunOperatorAuthority, assertOperatorModelAllowed, bindOperatorModelExecution, closeAdmittedRunDelegatedAuthority, createAdmittedRunOperatorAuthority, createExecutionIdentityRecoveryAdmission, createOperationalRunInstanceRef, getAdmittedRunDelegatedAuthority, getAdmittedRunSource, prepareAgentRunAdmission, prepareSystemAgentRunAdmission, readAdmittedRunOperatorAuthority, readPreparedRunOperatorAuthority, readRunOperatorAuthority, resolveAdmittedRunActiveAssertion, resolvePreparedRunAdmission, retainAdmittedRunBeforeToolCallRecovery };
}
/** Operational lifecycle correlation. This is never identity or authorization evidence. */
type OperationalRunInstanceRef = Readonly<{
  instanceId: string;
  runId: string;
}>;
/** Exact context carried by one admitted execution and every retry/fallback it owns. */
type AdmittedRunContext = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  /** Scheduler-authored ingress authority, independent of optional audit collection. */
  admissionSource?: "operator-schedule" | "requester-schedule";
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
}>;
type AdmittedRunOperatorAuthority = Readonly<{
  profileId: string;
  scopes: readonly string[];
  /** Original access dependency; null is proven independent, undefined is unclassified. */
  gatewayAccessGrant?: GatewayAccessGrantRef | null;
  assertCurrent: () => void;
  signal?: AbortSignal;
  /** Opaque original source identity used only to compare compatible queued input. */
  source?: object;
  /** Retains the original source independently of a foreground run or request. */
  retain?: () => () => void;
  /** Live assignment from the original prepared profile lease. */
  readCurrentRoleAssignment?: (this: void) => string | null;
  /** Verified primary login from the same live profile authority. */
  readCurrentGithubLogin?: (this: void) => string | null;
  /** Prepared role permissions; source-policy changes revoke the owning authority. */
  rolePolicy?: Readonly<{
    sessionAccessCap: GatewayOperatorRoleDefinition["sessions"]["others"];
    sandboxRequired: boolean;
    agents: "*" | readonly string[];
  }>;
  modelPolicy?: PreparedOperatorModelPolicy;
  /** Committed policy changes invalidate only executions using a removed model. */
  onModelPolicyChanged?: (listener: () => void) => () => void;
}>;
/** Host-only construction; public reply options cannot manufacture a source capability. */
declare function createAdmittedRunOperatorAuthority(source: AdmittedRunOperatorAuthority): AdmittedRunOperatorAuthority;
declare function assertAdmittedRunOperatorAuthority(authority: unknown): asserts authority is AdmittedRunOperatorAuthority;
/** Selection never grants authority; callers must pass the original host-issued source. */
declare function assertOperatorModelAllowed(authority: AdmittedRunOperatorAuthority | undefined, model: ProviderModelRef | undefined): void;
/** Keeps one selected model current without revoking other work from the same source. */
declare function bindOperatorModelExecution(authority: AdmittedRunOperatorAuthority | undefined, model: ProviderModelRef | undefined, mapAuthorizationError?: (error: unknown) => Error): Readonly<{
  signal: AbortSignal;
  assertCurrent: () => void;
  release: () => void;
}> | undefined;
/** Prepared and admitted paths share the same source throughout retries and detached work. */
declare function readRunOperatorAuthority(params: {
  preparedRunAdmission?: PreparedAgentRunAdmission;
  admittedRunContext?: AdmittedRunContext;
}): AdmittedRunOperatorAuthority | undefined;
type PreparedAgentRunAdmission = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>;
  /** Checks latched source revocation after normal close; never grants execution authority. */
  assertSourceCurrent: () => void;
  /** Host-only source restriction available before the runtime prepares its tools. */
  readOperatorAuthority?: () => AdmittedRunOperatorAuthority | undefined;
  /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
/** Reads the immutable outer-run authority without reviving a closed claim. */
declare function getAdmittedRunDelegatedAuthority(context: AdmittedRunContext): AgentRunDelegatedAuthority | undefined;
/** Captures the operator's source lifetime from a live run, including for detached children. */
declare function readAdmittedRunOperatorAuthority(context: AdmittedRunContext | undefined): AdmittedRunOperatorAuthority | undefined;
/** Reads the same source ceiling used by admission without minting run authority. */
declare function readPreparedRunOperatorAuthority(prepared: PreparedAgentRunAdmission | undefined): AdmittedRunOperatorAuthority | undefined;
/** Reads the original admission source only through its exact live authority. */
declare function getAdmittedRunSource(authority: AgentRunDelegatedAuthority | undefined): AdmittedRunContext["admissionSource"];
/** Captures an exact admitted-run assertion for work that may cross an await boundary. */
declare function resolveAdmittedRunActiveAssertion(context: AdmittedRunContext, signal?: AbortSignal): (() => void) | undefined;
/** Idempotently compare-releases the authority captured by this admission. */
declare function closeAdmittedRunDelegatedAuthority(context: AdmittedRunContext): boolean;
type AdmittedRunBeforeToolCallRecovery = Readonly<{
  assertActive: () => void;
  release: () => void;
}>;
/** Recovery-only lease for the already-created native pre-tool policy callback. */
declare function retainAdmittedRunBeforeToolCallRecovery(context: AdmittedRunContext): AdmittedRunBeforeToolCallRecovery | undefined;
type ExecutionIdentityRecoveryAdmission = Readonly<{
  /** Recovery retries never manufacture replacement identity when exact evidence is absent. */
  retryOnly: boolean;
  consume: (runId: string) => Readonly<{
    accepted: boolean;
    token?: ExecutionIdentityAdmissionToken;
  }>;
}>;
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
declare function createExecutionIdentityRecoveryAdmission(params: {
  retryOnly: boolean;
  token?: ExecutionIdentityAdmissionToken;
  expectedOperationalRunId?: string;
}): ExecutionIdentityRecoveryAdmission;
declare function createOperationalRunInstanceRef(runId: string): OperationalRunInstanceRef;
/** Prepares a system-owned run without selecting its eventual execution runtime early. */
declare function prepareSystemAgentRunAdmission(cfg: OpenClawConfig, runId: string, agentId: string, boundary: string, assertSourceCurrent?: () => void, operatorAuthority?: AdmittedRunOperatorAuthority): PreparedAgentRunAdmission;
/**
 * Freezes ingress facts before preparation while deferring allocation/capture until the
 * authoritative runtime owner is selected immediately before execution.
 */
declare function prepareAgentRunAdmission(params: {
  cfg: OpenClawConfig;
  admissionSource?: AdmittedRunContext["admissionSource"];
  facts: Omit<ExecutionIdentityAdmissionFacts, "runtime">;
  operationalRunInstance: OperationalRunInstanceRef;
  recovery?: ExecutionIdentityRecoveryAdmission;
  onAdmitted?: (context: AdmittedRunContext) => void | Promise<void>;
  assertSourceCurrent?: () => void;
  operatorAuthority?: AdmittedRunOperatorAuthority;
}): PreparedAgentRunAdmission;
/** Resolves a host-only continuation or validates an already-admitted internal caller. */
declare function resolvePreparedRunAdmission(params: {
  runId: string;
  runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"];
  runtimeInstanceId?: string;
  admittedRunContext?: AdmittedRunContext;
  preparedRunAdmission?: PreparedAgentRunAdmission;
}): Promise<AdmittedRunContext>;
//#endregion
//#region src/state/user-channel-identities.d.ts
declare const commandReferenceSchema: z.ZodUnion<readonly [z.ZodObject<{
  version: z.ZodLiteral<1>;
  id: z.ZodUUID;
}, z.core.$strict>, z.ZodObject<{
  id: z.ZodUUID;
  version: z.ZodLiteral<2>;
}, z.core.$strict>]>;
type CommandOwnerReference = Readonly<z.infer<typeof commandReferenceSchema>>;
//#endregion
//#region src/auto-reply/command-owner-authority.d.ts
type CommandOwnerAssertion = (() => void) & {
  readonly recoveryReference?: CommandOwnerReference | null;
};
//#endregion
//#region src/auto-reply/reply-payload.d.ts
type ReplyMediaFailureCode = "file-not-found" | "unsupported-format" | "delivery-failed" | "invalid-reference";
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
export { SessionSharingEntry as $, ChannelProgressDraftLine as $n, InputProvenance as $t, SessionOrigin as A, compactChannelProgressDraftLine as An, OutboundPayloadPlan as At, CronScheduledToolPolicy as B, resolveChannelPreviewStreamMode as Bn, AGENT_RUN_ABORTED_STOP_REASON as Bt, CliSessionBinding as C, ChannelProgressDraftCompositorLine as Cn, TurnAdoptionLifecycle as Ct, SessionContextBudgetStatus as D, AgentPlanStepStatus as Dn, UserTurnTranscriptAnnotation as Dt, SessionChatType as E, AgentPlanStep as En, UserTurnTranscriptAdmissionReceipt as Et, GatewayAgentRuntime as F, formatPlanChecklistLines as Fn, resolveOutboundMediaUrls as Ft, SessionTranscriptAccessScope as G, resolveChannelStreamingBlockEnabled as Gn, ResolvedGroupThreadConfig as Gt, CronToolsAllowExecTargetRequirement as H, resolveChannelProgressDraftMaxLineChars as Hn, AGENT_RUN_SUPERSEDED_STOP_REASON as Ht, GatewayContextWindowOption as I, isChannelProgressDraftWorkToolName as In, resolveSendableOutboundReplyParts as It, SessionTranscriptWriteScope as J, resolveChannelStreamingPreviewToolProgress as Jn, createCommandTurnContext as Jt, SessionTranscriptReadScope as K, resolveChannelStreamingChunkMode as Kn, CommandTurnContext as Kt, GatewayThinkingLevelOption as L, mergeChannelProgressDraftLine as Ln, TranscriptEntryAnchor as Lt, SessionProfileInvolvement as M, formatChannelProgressDraftLine as Mn, countOutboundMedia as Mt, SessionToolOverrides as N, formatChannelProgressDraftLineForEntry as Nn, hasOutboundMedia as Nt, SessionDeliveryState as O, buildChannelProgressDraftLine as On, UserTurnTranscriptRecorder as Ot, SessionSystemPromptReport as P, formatChannelProgressDraftText as Pn, hasOutboundText as Pt, SessionEntryPublicationSource as Q, selectPlanChecklistSteps as Qn, isTextSlashCommandTurn as Qt, SessionOwnerFacetIdentity as R, normalizeAgentPlanSteps as Rn, TranscriptTurnAdmission as Rt, AmbientTranscriptWatermark as S, ProgressContinuationCapability as Sn, TaskSuggestionDeliveryMode as St, InternalSessionEntry as T, ChannelProgressDraftCompositorSnapshot as Tn, UserTurnInput as Tt, SessionAcpMeta as U, resolveChannelProgressDraftMaxLines as Un, AgentRunTimeoutPhase as Ut, CronToolsAllowExecTarget as V, resolveChannelProgressDraftConfig as Vn, AGENT_RUN_RESTART_ABORT_STOP_REASON as Vt, SessionEntrySummary as W, resolveChannelStreamingBlockCoalesce as Wn, GroupThreadMentionFacts as Wt, TranscriptMessageAppendOptions as X, resolveChannelStreamingProgressNarration as Xn, isExplicitCommandTurn as Xt, TranscriptEvent as Y, resolveChannelStreamingProgressCommentary as Yn, isAuthorizedTextSlashCommandTurn as Yt, TranscriptMessageAppendResult as Z, resolveChannelStreamingSuppressDefaultToolProgressMessages as Zn, isNativeCommandTurn as Zt, OperationalRunInstanceRef as _, OutboundLocation as _n, UntrustedStructuredContextEntry as _t, buildTtsSupplementMediaPayload as a, InboundEventKind as an, GatewayClientName as ar, CanonicalInboundText as at, ProjectedAgentRunIndex as b, toLocationContext as bn, PartialReplyPayload as bt, isFastModeAutoProgressPayload as c, SessionCreatedVia as cn, FinalizedRuntimeMsgContext as ct, isReplyPayloadTtsSupplement as d, ExecutionIdentityAdmissionToken as dn, MsgContext as dt, PluginHookChannelChatContext as en, isChannelProgressAttentionLine as er, ResolvedSessionMaintenanceConfigInput as et, markReplyPayloadAsTtsSupplement as f, ReplyMediaAttachment as fn, OriginatingChannelType as ft, AdmittedRunOperatorAuthority as g, NormalizedLocation as gn, TemplateContext as gt, AdmittedRunContext as h, LocationSource as hn, SupplementalContextFacts as ht, SessionWriterDeliveryAuthority as i, GatewayUiCommandTarget as in, GatewayClientMode as ir, SessionRowChange as it, SessionPluginJsonValue as j, createChannelProgressDraftGate as jn, SendableOutboundReplyParts as jt, SessionEntry as k, buildChannelProgressDraftLineForEntry as kn, TranscriptSenderIdentity as kt, isReplyPayloadNonTerminalToolErrorWarning as l, HookExternalContentSource as ln, InboundSourceModality as lt, CommandOwnerAssertion as m, ReplyPayloadTtsSupplement as mn, SessionTranscriptContext as mt, ReplyDeliveryContext as n, PluginHookChannelSenderContext as nn, GATEWAY_CLIENT_IDS as nr, OpenClawAgentDatabaseOptions as nt, copyReplyPayloadMetadata as o, SessionGoalOperationErrorCode as on, ProviderRefusalReview as or, ChannelStructuredContextEntry as ot, readAskUserQuestionId as p, ReplyPayload as pn, RuntimeMsgContext as pt, SessionTranscriptRuntimeTarget as q, resolveChannelStreamingPreviewCommandText as qn, CommandTurnKind as qt, ReplyMediaFailure as r, PromptImageOrderEntry as rn, GatewayClientCap as rr, OpenClawRegisteredAgentDatabase as rt, getReplyPayloadTtsSupplement as s, SessionCreatedActor as sn, FinalizedMsgContext as st, FAST_MODE_AUTO_PROGRESS_KIND as t, PluginHookChannelContext as tn, formatChannelProgressDraftDiffStat as tr, OpenClawAgentDatabase as tt, isReplyPayloadTerminalContent as u, AgentRunDelegatedAuthority as un, MentionSource as ut, PreparedAgentRunAdmission as v, formatLocationText as vn, BlockReplyContext as vt, GroupKeyResolution as w, ChannelProgressDraftCompositorParams as wn, PersistedUserTurnMessage as wt, ProviderReviewAcknowledgment as x, SourceReplyDeliveryMode as xn, ReasoningStreamPayload as xt, admitted_run_context_d_exports as y, normalizeOutboundLocation as yn, GetReplyOptions as yt, CronScheduledToolCallerOrigin as z, normalizeChannelProgressDraftLineIdentity as zn, TranscriptTurnBoundary as zt };