import { Et as TtsAutoMode, d as AssistantMessage, r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { G as SessionDeliveryState, N as ExecutionIdentityAdmissionToken, T as OutboundPayloadPlan, h as GetReplyOptions, q as SessionOrigin, r as FinalizedMsgContext, xt as PluginHookChannelContext, yt as InputProvenance } from "./templating-OpWn1DzT.js";
import "./fs-safe-advanced-CgWxxJBc.js";
import "./openclaw-state-db-CMVCVfJm.js";
import { s as AgentMessage } from "./types-BRvdDyOm.js";
import { D as ProgressContinuationCapability, E as SourceReplyDeliveryMode, T as ChannelRouteRef, h as ReplyPayload, w as DeliveryContext } from "./reply-payload-Dv0rYqXd.js";
import { T as ApprovalScope } from "./approval-types-DIxuby8L.js";
import { n as MediaFact } from "./media-facts-BUTxYH1x.js";
import { t as ChatType } from "./chat-type-B6XXSSnm.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-DIVmGNEt.js";
import { t as PluginConversationBinding } from "./conversation-binding.types-DddMb3XF.js";
import "minimatch";
//#region src/plugins/host-hook-json.d.ts
/** JSON primitive values accepted across plugin host-hook boundaries. */
type PluginJsonPrimitive = string | number | boolean | null;
/** Bounded JSON value shape accepted from plugin hooks. */
type PluginJsonValue = PluginJsonPrimitive | PluginJsonValue[] | {
  [key: string]: PluginJsonValue;
};
//#endregion
//#region src/utils/delivery-context.shared.d.ts
type SessionDeliveryProjection = {
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  origin?: SessionOrigin;
  channel?: string;
  lastChannel?: string;
  lastTo?: string;
  lastAccountId?: string;
  lastThreadId?: string | number;
};
/** Builds one canonical delivery state from current turn routing facts. */
declare function normalizeSessionDeliveryState(params?: {
  route?: ChannelRouteRef;
  context?: DeliveryContext;
  origin?: SessionOrigin;
}): SessionDeliveryState;
/** Projects compatibility fields without persisting duplicate delivery state. */
declare function projectSessionDeliveryFields(delivery?: SessionDeliveryState): SessionDeliveryProjection;
//#endregion
//#region src/auto-reply/reply/normalize-reply-skip-reason.d.ts
type NormalizeReplySkipReason = "empty" | "silent" | "heartbeat" | "channel_transform";
type NormalizeReplyOutcome<T> = {
  kind: "deliver";
  payload: T;
} | {
  kind: "suppress";
  reason: NormalizeReplySkipReason;
};
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.types.d.ts
type ReplyDispatchKind = "tool" | "block" | "final";
type ReplyDispatchSettledCounts = {
  delivered: number;
  deliveredNotVisible: number;
  cancelled: number;
  failedBeforeSend: number;
  failedAfterSend: number;
};
type ReplyDispatchReceipt = {
  counts: Record<ReplyDispatchKind, ReplyDispatchSettledCounts>;
  anyVisibleDelivered: boolean;
  /** Delivery is queued or ambiguous; another send could duplicate it. */
  hasPendingDelivery?: true;
};
type ReplyFollowupAdmissionBarrierTimeoutPolicy = {
  /** Absolute failsafe for owner activity that never settles. */
  maxTimeoutMs: number;
  /** Extend by another default settle interval while bounded owner work remains active. */
  shouldExtend: () => boolean;
};
type ReplyDispatchRuntimeInfo = {
  kind: ReplyDispatchKind;
  assistantMessageIndex?: number;
  /** Display identity for replies in a configured multi-agent group. */
  participant?: {
    agentId: string;
    name: string;
  };
  /** @internal Claim direct-send custody immediately before recipient-visible platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** @internal Synchronously fence custody after claiming it and before provider I/O. */
  assertPlatformSendAuthorized?: () => void;
  /** @internal Bind this delivery's host-owned completion to a transformed payload. */
  bindPendingFinalDelivery?: <T extends ReplyPayload>(payload: T) => T;
  /** @internal Transfer this waiting reply's existing progress card to its current task owner. */
  adoptProgressContinuation?: ProgressContinuationCapability["adopt"];
};
type ReplyDispatchBeforeDeliver = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo) => Promise<ReplyPayload | null> | ReplyPayload | null;
/** An owner-declared settlement budget for one before-delivery callback. */
type ReplyDispatchBeforeDeliverOptions = {
  /** Positive finite per-callback deadline in milliseconds; omit for the dispatcher default. */
  timeoutMs?: number;
};
type ReplyDispatcher = {
  /** @internal Preserve the delivery owner's preparation through dispatcher wrappers. */
  prepareReplyPayload?: (kind: ReplyDispatchKind, payload: ReplyPayload) => NormalizeReplyOutcome<ReplyPayload>;
  sendToolResult: (payload: ReplyPayload) => boolean;
  sendBlockReply: (payload: ReplyPayload) => boolean;
  sendFinalReply: (payload: ReplyPayload) => boolean;
  /** Preserve prepared text and fields through dispatch without raw directive parsing. */
  sendPreparedReply?: (kind: ReplyDispatchKind, plan: OutboundPayloadPlan) => boolean;
  appendBeforeDeliver?: (hook: ReplyDispatchBeforeDeliver, options?: ReplyDispatchBeforeDeliverOptions) => void;
  supportsSettledReceipt?: true;
  waitForIdle: () => Promise<void | ReplyDispatchReceipt>;
  /** @deprecated Remove in the next Plugin SDK major; retains admission-time counts. */
  getQueuedCounts: () => Record<ReplyDispatchKind, number>;
  /** @deprecated Remove in the next Plugin SDK major; derived from settled receipts. */
  getCancelledCounts?: () => Record<ReplyDispatchKind, number>;
  /** @deprecated Remove in the next Plugin SDK major; derived from settled receipts. */
  getFailedCounts: () => Record<ReplyDispatchKind, number>;
  markComplete: () => void;
  /** Owner-declared deadline for holding queued follow-ups behind all queued deliveries. */
  resolveFollowupAdmissionBarrierTimeoutPolicy?: () => ReplyFollowupAdmissionBarrierTimeoutPolicy | undefined;
};
//#endregion
//#region src/config/sessions/transcript-assistant-delivery.d.ts
/** Turn-owned display preparation; source text precedes transcript-only hook rewrites. */
type PrepareAssistantTranscriptMessage = (message: AssistantMessage, sourceText: string | undefined) => AssistantMessage;
//#endregion
//#region src/plugins/hook-before-agent-start.types.d.ts
type PluginHookBeforeModelResolveAttachment = {
  kind: "image" | "video" | "audio" | "document" | "other";
  mimeType?: string;
};
type PluginHookBeforeModelResolveEvent = {
  /** User prompt for this run. No session messages are available yet in this phase. */
  prompt: string;
  /** Attachment metadata for file-aware model routing. */
  attachments?: PluginHookBeforeModelResolveAttachment[];
};
type PluginHookBeforeModelResolveResult = {
  /** Override the model for this agent run. E.g. "llama3.3:8b" */
  modelOverride?: string;
  /** Override the provider for this agent run. E.g. "local-provider" */
  providerOverride?: string;
};
type PluginHookBeforePromptBuildEvent = {
  prompt: string;
  /** Current request before projection. Empty means no textual request; omission is legacy. */
  currentUserMessage?: string;
  /** Stable native admission identity across rebuilds; differs between admitted requests. */
  currentUserMessageId?: string;
  /** Session messages prepared for this run. */
  messages: unknown[];
};
type PluginHookBeforePromptBuildResult = {
  systemPrompt?: string;
  prependContext?: string;
  appendContext?: string;
  /**
   * Narrows the tools submitted to the model for this turn.
   * An empty array disables optional tools; omitted leaves the existing tool policy unchanged.
   */
  toolsAllow?: string[];
  /**
   * Prepended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  prependSystemContext?: string;
  /**
   * Appended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  appendSystemContext?: string;
};
//#endregion
//#region src/plugins/hook-before-tool-call-result.d.ts
declare const PluginApprovalResolutions: {
  readonly ALLOW_ONCE: "allow-once";
  readonly ALLOW_ALWAYS: "allow-always";
  readonly DENY: "deny";
  readonly TIMEOUT: "timeout";
  readonly CANCELLED: "cancelled";
};
type PluginApprovalResolution = (typeof PluginApprovalResolutions)[keyof typeof PluginApprovalResolutions];
type PluginHookBeforeToolCallResult = {
  params?: Record<string, unknown>;
  block?: boolean;
  blockReason?: string;
  requireApproval?: {
    title: string;
    description: string;
    scope?: ApprovalScope;
    severity?: "info" | "warning" | "critical";
    timeoutMs?: number;
    /**
     * @deprecated Unresolved approvals always deny; retained for plugin API
     * compatibility. The field will be removed after one deprecation release train.
     */
    timeoutBehavior?: "allow" | "deny";
    /** Override timeout text and return the timeout as a blocked tool result. */
    timeoutReason?: string;
    allowedDecisions?: Array<"allow-once" | "allow-always" | "deny">;
    pluginId?: string;
    onResolution?: (decision: PluginApprovalResolution) => Promise<void> | void;
  };
};
//#endregion
//#region src/plugins/hook-decision-types.d.ts
/**
 * Structured decision returned by gate/policy hooks.
 * Core is outcome-agnostic — it handles the mechanics of each outcome
 * without knowing *why* the decision was made.
 */
type HookDecision = HookDecisionPass | HookDecisionBlock;
/** Content is fine. Proceed normally. */
type HookDecisionPass = {
  outcome: "pass";
};
/**
 * Content is blocked. `reason` is internal plugin-local detail; core must not log,
 * persist, broadcast, or expose it verbatim. `message` is user-facing detail.
 */
type HookDecisionBlock = {
  outcome: "block";
  /** Internal plugin-local reason. Do not log, persist, broadcast, or expose verbatim. */
  reason: string;
  /** Optional user-facing detail included in the block response envelope. */
  message?: string;
  /** Plugin-defined category for analytics (e.g. "violence", "pii", "cost_limit"). */
  category?: string;
  /** Opaque metadata for the plugin's own use. Core does not interpret it. */
  metadata?: Record<string, unknown>;
};
/** Outcomes valid for input gates (before_agent_run). */
type InputGateDecision = HookDecisionPass | HookDecisionBlock;
/**
 * A gate hook decision paired with the pluginId that produced it.
 * Returned by gate hook runners so callers can
 * attribute blocked entries and audit events to the originating plugin.
 */
type GateHookResult<TDecision extends HookDecision = HookDecision> = {
  decision: TDecision;
  pluginId: string;
};
//#endregion
//#region src/plugins/hook-gateway.types.d.ts
type PluginHookGatewayContext = {
  port?: number;
  config?: OpenClawConfig;
  workspaceDir?: string;
  getCron?: () => PluginHookGatewayCronService | undefined;
  /** In gateway_start, aborts at drain to stop producers; gateway_stop owns resource disposal. */
  abortSignal?: AbortSignal;
};
type PluginHookCronReconciledContext = PluginHookGatewayContext & {
  /** Aborts when this exact scheduler snapshot is superseded or the Gateway closes. */
  abortSignal: AbortSignal;
};
type PluginHookGatewayStartEvent = {
  port: number;
};
type PluginHookGatewayStopEvent = {
  reason?: string;
};
type PluginHookCronReconciledEvent = {
  reason: "startup" | "reload";
  enabled: boolean;
};
type PluginHookGatewayCronRunStatus = "ok" | "error" | "skipped";
type PluginHookGatewayCronDeliveryStatus = "not-requested" | "delivered" | "not-delivered" | "unknown";
type PluginHookGatewayCronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  lastRunStatus?: PluginHookGatewayCronRunStatus;
  lastError?: string;
  lastDurationMs?: number;
  lastDelivered?: boolean;
  lastDeliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  lastDeliveryError?: string;
  deliverySuppressionReason?: string;
  lastFailureNotificationDelivered?: boolean;
  lastFailureNotificationDeliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  lastFailureNotificationDeliveryError?: string;
  streamStatus?: "starting" | "running" | "restarting" | "stopped" | "disabled" | "error";
  streamError?: string;
  streamConsecutiveFailures?: number;
  streamRestartExhausted?: boolean;
  streamDroppedBatches?: number;
  streamCoalescedBatches?: number;
  streamLastStartedAtMs?: number;
  streamLastExitAtMs?: number;
};
type PluginHookGatewayCronJob = {
  id: string;
  declarationKey?: string;
  /** Agent id that owns this cron job. */
  agentId?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  schedule?: {
    kind: "cron";
    expr?: string;
    tz?: string;
    staggerMs?: number;
  } | {
    kind: "at";
    at?: string;
  } | {
    kind: "every";
    everyMs?: number;
    anchorMs?: number;
  } | {
    kind: "on-exit";
    command?: string;
    cwd?: string;
  } | {
    kind: "stream";
    command?: string[];
    cwd?: string;
    mode?: "line" | "match";
    match?: string;
    batchMs?: number;
    maxBatchBytes?: number;
  };
  sessionTarget?: string;
  wakeMode?: string;
  payload?: {
    kind?: string;
    text?: string;
  };
  state?: PluginHookGatewayCronJobState;
  createdAtMs?: number;
  updatedAtMs?: number;
};
type PluginHookCronChangedEvent = {
  action: "added" | "updated" | "removed" | "started" | "finished" | "scheduled";
  jobId: string;
  job?: PluginHookGatewayCronJob;
  /** Top-level session target for downstream routing (mirrors job.sessionTarget). */
  sessionTarget?: string;
  /** Agent id that owns this cron job (mirrors job.agentId). */
  agentId?: string;
  runAtMs?: number;
  durationMs?: number;
  status?: PluginHookGatewayCronRunStatus;
  completionStatus?: "succeeded" | "failed" | "unknown";
  error?: string;
  summary?: string;
  delivered?: boolean;
  deliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  deliveryError?: string;
  deliverySuppressionReason?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
  nextRunAtMs?: number;
  model?: string;
  provider?: string;
};
type PluginHookGatewayCronCreateInput = {
  declarationKey?: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr: string;
    tz?: string;
  };
  sessionTarget: string;
  wakeMode: string;
  payload: {
    kind: string;
    text?: string;
  };
};
type PluginHookGatewayCronUpdateInput = Partial<PluginHookGatewayCronCreateInput>;
type PluginHookGatewayCronRemoveResult = {
  removed?: boolean;
};
type PluginHookGatewayCronService = {
  /** Effective automatic scheduling state; older hosts may omit this observation. */
  isEnabled?: () => Promise<boolean>;
  list: (opts?: {
    includeDisabled?: boolean;
  }) => Promise<PluginHookGatewayCronJob[]>;
  add: (input: PluginHookGatewayCronCreateInput) => Promise<unknown>;
  update: (id: string, patch: PluginHookGatewayCronUpdateInput) => Promise<unknown>;
  remove: (id: string) => Promise<PluginHookGatewayCronRemoveResult>;
  removeStaleJobFamily: (family: {
    declarationKey: string;
    name: string;
    ownerPluginTag: string;
  }) => Promise<number>;
};
//#endregion
//#region src/hooks/message-hook-media.d.ts
/** Stable media fact exposed to message-hook consumers. */
type MessageHookMediaFact = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: MediaFact["kind"];
  transcribed?: boolean;
  messageId?: string;
  workspaceDir?: string;
};
//#endregion
//#region src/plugins/hook-message.types.d.ts
/** Ordered media fact exposed by inbound message hooks. */
type PluginHookMediaFact = MessageHookMediaFact;
/** Channel-neutral geographic fix carried by an inbound provider update. */
type PluginHookLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  source?: "pin" | "place" | "live";
  isLive?: boolean;
  livePeriodSeconds?: number;
  caption?: string;
};
/** Stable provider update identity for transport-level correlation and deduplication. */
type PluginHookProviderUpdate = {
  id: string;
  kind: string;
  messageId?: string;
  messageTimestamp?: number;
  editedTimestamp?: number;
};
/** Provider metadata plus deprecated media aliases retained during the SDK migration window. */
type PluginHookInboundMessageMetadata = Record<string, unknown> & {
  /** @deprecated Use the first `event.media` fact with a defined `path`. */
  mediaPath?: string;
  /** @deprecated Use the first `event.media` fact's `url ?? path`. */
  mediaUrl?: string;
  /** @deprecated Use the first `event.media` fact's `contentType ?? kind`. */
  mediaType?: string;
  /** @deprecated Collect defined `path` values from `event.media` in order. */
  mediaPaths?: string[];
  /** @deprecated Collect each defined `url ?? path` from `event.media` in order. */
  mediaUrls?: string[];
  /** @deprecated Collect each defined `contentType ?? kind` from `event.media` in order. */
  mediaTypes?: string[];
  /** @deprecated Use the first `event.originalMedia` fact with a defined `path`. */
  originalMediaPath?: string;
  /** @deprecated Use the first `event.originalMedia` fact's `url ?? path`. */
  originalMediaUrl?: string;
  /** @deprecated Use the first `event.originalMedia` fact's `contentType ?? kind`. */
  originalMediaType?: string;
  /** @deprecated Collect defined `path` values from `event.originalMedia` in order. */
  originalMediaPaths?: string[];
  /** @deprecated Collect each defined `url ?? path` from `event.originalMedia` in order. */
  originalMediaUrls?: string[];
  /** @deprecated Collect each defined `contentType ?? kind` from `event.originalMedia` in order. */
  originalMediaTypes?: string[];
  /** @deprecated Use `event.mediaStagingPending`. */
  mediaStagingPending?: boolean;
};
type PluginHookMessageContext = {
  channelId: string;
  accountId?: string;
  conversationId?: string;
  /**
   * Canonical session key for this conversation — the same value the agent
   * runtime sees as `params.sessionKey` for the run that produced the
   * outbound payload, and the same value `agent_end`/`llm_input`/`llm_output`
   * fire with. Plugins correlating per-turn state across `agent_end` and
   * `message_sending` rely on this equality.
   *
   * For inbound message hooks (`inbound_claim` etc.), this is the canonical
   * session for the inbound conversation as resolved by `resolveSessionKey`
   * / `deriveInboundMessageHookContext`.
   *
   * For outbound delivery hooks (`message_sending` and `message_sent`),
   * this mirrors `OutboundSessionContext.key` from the dispatch path when
   * delivery has a session attached. When the outbound path has no
   * resolvable session (e.g. internal smoke runs without
   * `OutboundSessionContext`), this field is omitted; plugins must treat
   * it as optional.
   */
  sessionKey?: string;
  /**
   * Per-turn run identifier (UUID), unique to one end-to-end agent turn:
   * stable across all LLM-call iterations, retry attempts (compaction,
   * empty-response, planning-only, etc.), and multi-payload reply chunks
   * within that turn; distinct for each new inbound user message and for
   * each cron/heartbeat/followup-triggered run.
   *
   * Generated once in `agent-runner-execution.ts`/`followup-runner.ts` via
   * `crypto.randomUUID()`. Currently populated for inbound message hooks
   * (`inbound_claim`, `message_received`) and for agent-runtime hooks that
   * already receive the run id (e.g. `agent_end`, `llm_input`, `llm_output`).
   * It is **not yet** plumbed through the outbound delivery path, so
   * plugins observing `message_sending` / `message_sent` should not rely
   * on `runId` to correlate against `agent_end`; use `sessionKey` for
   * outbound→inbound correlation today (with the caveat that it cannot
   * disambiguate concurrent turns in the same session).
   */
  runId?: string;
  messageId?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  callDepth?: number;
};
type PluginHookInboundClaimContext = PluginHookMessageContext & {
  /** Resolved owner for session scopes whose canonical key does not encode an agent id. */
  agentId?: string;
  parentConversationId?: string;
  senderId?: string;
  messageId?: string;
  pluginBinding?: PluginConversationBinding;
};
type PluginHookInboundClaimEvent = {
  content: string;
  body?: string;
  bodyForAgent?: string;
  transcript?: string;
  timestamp?: number;
  channel: string;
  accountId?: string;
  conversationId?: string;
  parentConversationId?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  threadId?: string | number;
  messageId?: string;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  isGroup: boolean;
  commandAuthorized?: boolean;
  senderIsOwner?: boolean;
  wasMentioned?: boolean;
  location?: PluginHookLocation;
  providerUpdate?: PluginHookProviderUpdate;
  /** Staged, locally usable attachments in stable source order. */
  media?: PluginHookMediaFact[];
  /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: PluginHookMediaFact[];
  /** True when `originalMedia` is present but `media` is intentionally withheld pending staging. */
  mediaStagingPending?: boolean;
  metadata?: PluginHookInboundMessageMetadata;
};
type PluginHookMessageReceivedEvent = {
  from: string;
  content: string;
  timestamp?: number;
  threadId?: string | number;
  messageId?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  location?: PluginHookLocation;
  providerUpdate?: PluginHookProviderUpdate;
  /** Staged, locally usable attachments in stable source order. */
  media?: PluginHookMediaFact[];
  /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: PluginHookMediaFact[];
  /** True when `originalMedia` is present but `media` is intentionally withheld pending staging. */
  mediaStagingPending?: boolean;
  metadata?: PluginHookInboundMessageMetadata;
};
type PluginHookMessageSendingEvent = {
  to: string;
  content: string;
  replyToId?: string | number;
  threadId?: string | number;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSendingResult = {
  content?: string;
  cancel?: boolean;
  cancelReason?: string;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSentEvent = {
  to: string;
  content: string;
  success: boolean;
  messageId?: string;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  error?: string;
};
//#endregion
//#region src/plugins/hook-skill.types.d.ts
type PluginHookSkillProposalKind = "create" | "update";
type PluginHookSkillBundleFile = {
  path: string;
  content: string;
  encoding: "utf8" | "base64";
  sha256: string;
  sizeBytes: number;
};
type PluginHookSkillBundleSnapshot = {
  skillMd: PluginHookSkillBundleFile;
  files: PluginHookSkillBundleFile[];
  treeSha256: string;
};
type PluginHookSkillProposalEvaluateEvent = {
  /** Caller-supplied correlation metadata; not authenticated identity or authorization proof. */
  correlationId?: string;
  proposal: {
    id: string;
    kind: PluginHookSkillProposalKind;
    revision: string;
    revisionSha256: string;
    targetCurrentSha256?: string;
  };
  skill: {
    name: string;
    skillKey: string;
    description: string;
    source?: string;
  };
  candidate: PluginHookSkillBundleSnapshot;
  baseline?: PluginHookSkillBundleSnapshot;
  reason: "created" | "revised" | "manual" | "apply";
};
type PluginHookSkillEvaluationFinding = {
  ruleId: string;
  severity: "info" | "warn" | "critical";
  message: string;
  file?: string;
  line?: number;
};
type PluginHookSkillProposalEvaluateResult = {
  summary?: string;
  findings?: PluginHookSkillEvaluationFinding[];
  metrics?: Record<string, string | number | boolean>;
  /** Version of the underlying evaluator or ruleset, separate from the plugin package. */
  evaluatorVersion?: string;
  /** Bounded evaluator mode label such as `static`, `llm`, or `baseline-comparison`. */
  mode?: string;
  decision?: "pass" | "revise" | "block";
  decisionReason?: string;
};
type PluginHookSkillProposalEvaluationAttribution = {
  evaluatorId: string;
  pluginId: string;
  pluginVersion?: string;
};
type PluginHookSkillProposalEvaluationOutcome = (PluginHookSkillProposalEvaluationAttribution & {
  status: "completed";
  result: PluginHookSkillProposalEvaluateResult;
}) | (PluginHookSkillProposalEvaluationAttribution & {
  status: "skipped";
}) | (PluginHookSkillProposalEvaluationAttribution & {
  status: "error";
  error: string;
});
type PluginHookSkillArtifact = {
  name: string;
  skillKey: string;
  description?: string;
  skillFile: string;
  skillDir: string;
  source: string;
  revision: {
    declaredVersion?: string;
    contentSha256: string;
    treeSha256: string;
    sourceVersion?: string;
  };
};
type PluginHookSkillChangedEvent = {
  action: "created" | "updated" | "removed";
  source: "workshop" | "clawhub" | "source-install" | "upload";
  occurredAt: string;
  before?: PluginHookSkillArtifact;
  after?: PluginHookSkillArtifact;
  proposal?: {
    id: string;
    revision: string;
    revisionSha256: string;
  };
};
type PluginHookSkillProposalChangedEvent = {
  eventId: string;
  sequence: number;
  action: "created" | "revised" | "evaluation_completed" | "applied" | "rejected" | "quarantined" | "stale";
  occurredAt: string;
  correlationId?: string;
  proposal: {
    id: string;
    kind: PluginHookSkillProposalKind;
    status: "pending" | "applied" | "rejected" | "quarantined" | "stale";
    revision: string;
    revisionSha256: string;
    skillName: string;
    skillKey: string;
    skillFile: string;
    source?: string;
  };
  evaluations?: readonly PluginHookSkillProposalEvaluationOutcome[];
};
type PluginHookSkillContext = {
  workspaceDir: string;
  agentId?: string;
};
//#endregion
//#region src/plugins/host-hook-turn-types.d.ts
/** Placement for context injected into the next agent turn. */
type PluginNextTurnInjectionPlacement = "prepend_context" | "append_context";
/** Plugin request to inject text into the next turn for a session. */
type PluginNextTurnInjection = {
  sessionKey: string;
  /** Selected owner when the session key is unscoped, such as global. */
  agentId?: string;
  text: string;
  idempotencyKey?: string;
  placement?: PluginNextTurnInjectionPlacement;
  ttlMs?: number;
  metadata?: PluginJsonValue;
};
/** Stored next-turn injection after session/plugin metadata is attached. */
type PluginNextTurnInjectionRecord = Omit<PluginNextTurnInjection, "sessionKey" | "agentId"> & {
  id: string;
  pluginId: string;
  pluginName?: string;
  createdAt: number;
  placement: PluginNextTurnInjectionPlacement;
};
/** Result returned after enqueueing a next-turn injection. */
type PluginNextTurnInjectionEnqueueResult = {
  enqueued: boolean;
  id: string;
  sessionKey: string;
};
/** Event passed to plugins before an agent turn is prepared. */
type PluginAgentTurnPrepareEvent = {
  prompt: string;
  messages: unknown[];
  queuedInjections: PluginNextTurnInjectionRecord[];
};
/** Plugin contribution to prepend or append context for a prepared agent turn. */
type PluginAgentTurnPrepareResult = {
  prependContext?: string;
  appendContext?: string;
};
/** Event passed to plugins that contribute heartbeat prompt context. */
type PluginHeartbeatPromptContributionEvent = {
  sessionKey?: string;
  agentId?: string;
  heartbeatName?: string;
};
/** Plugin contribution to heartbeat prompt context. */
type PluginHeartbeatPromptContributionResult = {
  prependContext?: string;
  appendContext?: string;
};
//#endregion
//#region src/plugins/hook-types.d.ts
type PluginHookName = "before_model_resolve" | "agent_turn_prepare" | "before_prompt_build" | "before_agent_reply" | "model_call_started" | "model_call_ended" | "llm_input" | "llm_output" | "before_agent_finalize" | "agent_end" | "before_compaction" | "after_compaction" | "before_reset" | "inbound_claim" | "channel_pairing_requested" | "message_received" | "message_sending" | "reply_payload_sending" | "message_sent" | "before_tool_call" | "after_tool_call" | "tool_result_persist" | "before_message_write" | "session_start" | "session_end" | "subagent_delivery_target" | "subagent_spawned" | "subagent_progress" | "subagent_ended" | "gateway_start" | "gateway_stop" | "heartbeat_prompt_contribution" | "cron_reconciled" | "cron_changed" | "skill_proposal_evaluate" | "skill_proposal_changed" | "skill_changed" | "before_dispatch" | "reply_dispatch" | "before_install" | "before_agent_run" | "resolve_exec_env";
type PluginHookChannelPairingRequestedEvent = {
  /** Channel that created the pending pairing request. */
  channel: string;
  /** Provider account ID for multi-account channel setups. */
  accountId?: string;
  /** Channel-scoped sender ID awaiting operator approval. */
  senderId: string;
  /** Short-lived code accepted by `openclaw pairing approve`. */
  code: string;
  /** Sender-supplied channel metadata for operator notification/audit. Treat as untrusted. */
  metadata?: Record<string, string | undefined>;
};
type PluginHookChannelPairingContext = {
  channelId: string;
  accountId?: string;
  senderId: string;
};
declare const PLUGIN_HOOK_AGENT_TRIGGERS: readonly ["cron", "heartbeat", "user"];
type PluginHookAgentTrigger = (typeof PLUGIN_HOOK_AGENT_TRIGGERS)[number];
type PluginHookReplyDispatchKind = "agent" | "acp";
type PluginToolMatcher = readonly [string, ...string[]];
type PluginHookRegistrationOptions<K extends PluginHookName> = {
  priority?: number;
  registrationId?: string;
  timeoutMs?: number;
} & (K extends "before_agent_reply" ? {
  /** Host-enforced turn triggers that may invoke this reply hook. */
  eligibleTriggers?: readonly [PluginHookAgentTrigger, ...PluginHookAgentTrigger[]];
} : {
  eligibleTriggers?: never;
}) & (K extends "reply_dispatch" ? {
  /** Host-enforced dispatch paths that may invoke this hook; unknown paths remain eligible. */
  eligibleDispatchKinds?: readonly [PluginHookReplyDispatchKind, ...PluginHookReplyDispatchKind[]];
} : {
  eligibleDispatchKinds?: never;
}) & (K extends "before_tool_call" | "after_tool_call" ? {
  matcher?: PluginToolMatcher;
} : {
  matcher?: never;
}) & (K extends "before_prompt_build" ? {
  /** Run only after the host has finalized the turn's policy-filtered tool surface. */
  requiresToolAuthority?: true;
} : {
  requiresToolAuthority?: never;
});
type PluginHookToolAuthority = {
  /** Opaque host fingerprint for the exact turn, route, policy, and active tool surface. */
  readonly fingerprint: string;
  /** Checks whether the finalized turn surface contains this exact tool. */
  allows(toolName: string): boolean;
  /** Rejects retained or timed-out capabilities after the host dispatch closes. */
  assertActive(): void;
};
type PluginHookAgentContext = {
  runId?: string;
  jobId?: string;
  trace?: DiagnosticTraceContext;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  /** Run-prepared repository identities; empty when the turn is outside a repository. */
  activeProjectKeys?: string[];
  modelProviderId?: string;
  modelId?: string;
  messageProvider?: string;
  /** Channel/plugin id for channel-originated runs, e.g. `discord`. */
  channel?: string;
  /** Channel account used by the agent when multiple accounts are configured. */
  accountId?: string;
  /** Conversation target id for channel-originated runs. Mirrors `channelId` for compatibility. */
  chatId?: string;
  /** Sender identity for channel-originated runs when available. */
  senderId?: string;
  trigger?: string;
  channelId?: string;
  /**
   * Typed origin of the turn's user-role input. Absent when the producer did not
   * supply a classification; absence does not establish human origin.
   */
  inputProvenance?: InputProvenance;
  /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource;
  /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
  /**
   * @deprecated Core does not populate cross-app sender ids. Channel plugins
   * should expose channel-specific identities by augmenting `channelContext.sender`.
   */
  senderExternalId?: string;
  /** Channel-owned sender/chat details. Plugins may augment the nested interfaces. */
  channelContext?: PluginHookChannelContext;
  /** Present only for post-policy prompt enrichment hooks that requested tool authority. */
  toolAuthority?: PluginHookToolAuthority;
  /**
   * Present for before_prompt_build only. Checks this handler's result-acceptance lifetime,
   * not tool authorization or eventual model consumption. Underlying work is not cancelled.
   */
  readonly hookInvocation?: Readonly<{
    assertActive(): void;
  }>;
};
type PluginHookContextWindowSource = "model" | "modelsConfig" | "agentContextTokens" | "default";
type PluginHookBeforeAgentReplyEvent = {
  cleanedBody: string;
};
type PluginHookBeforeAgentReplyResult = {
  handled: boolean;
  reply?: ReplyPayload;
  reason?: string;
};
type PluginHookLlmInputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  systemPrompt?: string;
  prompt: string;
  historyMessages: unknown[];
  imagesCount: number;
  tools?: unknown[];
};
type PluginHookModelCallBaseEvent = {
  runId: string;
  callId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  api?: string;
  transport?: string;
  /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource;
  /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
};
type PluginHookModelCallStartedEvent = PluginHookModelCallBaseEvent;
type PluginHookModelCallEndedEvent = PluginHookModelCallBaseEvent & {
  durationMs: number;
  outcome: "completed" | "error";
  errorCategory?: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  upstreamRequestIdHash?: string;
};
type PluginHookLlmOutputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource;
  /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
  /**
   * Fully resolved provider/model ref used for the call.
   *
   * This intentionally keeps the provider prefix so operator tooling can
   * distinguish e.g. openai/gpt-5.4 from codex/gpt-5.4 even when display
   * names collapse to just the model id.
   */
  resolvedRef?: string;
  /**
   * Harness/backend responsible for the model loop. Kept separate from
   * `resolvedRef` so provider/model consumers keep a stable parse contract.
   */
  harnessId?: string;
  /** The original user prompt that produced this output. */
  prompt?: string;
  assistantTexts: string[];
  lastAssistant?: unknown;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  /**
   * Requested reasoning/think effort for this call (provider think level, e.g.
   * "off" | "low" | "medium" | "high"). Lets a passive footer show the mode the
   * user is actually running without re-deriving it.
   */
  reasoningEffort?: string;
  /** Whether fast mode was active for this call. */
  fastMode?: boolean;
};
type PluginHookAgentEndEvent = {
  runId?: string;
  messages: unknown[];
  success: boolean;
  error?: string;
  durationMs?: number;
};
type PluginHookBeforeAgentFinalizeEvent = {
  runId?: string;
  sessionId: string;
  sessionKey?: string;
  turnId?: string;
  provider?: string;
  model?: string;
  cwd?: string;
  transcriptPath?: string;
  stopHookActive: boolean;
  lastAssistantMessage?: string;
  messages?: unknown[];
};
type PluginHookBeforeAgentFinalizeResult = {
  /**
   * continue: accept normal finalization.
   * revise: block finalization and ask the harness for another model pass.
   * finalize: force finalization even if another hook requested revision.
   */
  action?: "continue" | "revise" | "finalize";
  reason?: string;
  retry?: {
    instruction: string;
    idempotencyKey?: string;
    maxAttempts?: number;
  };
};
type PluginHookBeforeCompactionEvent = {
  messageCount: number;
  compactingCount?: number;
  tokenCount?: number;
  messages?: unknown[];
  sessionFile?: string;
};
type PluginHookBeforeResetEvent = {
  sessionFile?: string;
  messages?: unknown[];
  reason?: string;
};
type PluginHookAfterCompactionEvent = {
  messageCount: number;
  tokenCount?: number;
  compactedCount: number;
  sessionFile?: string;
  /** Physical session generation replaced by this compaction, when it rotated. */
  previousSessionId?: string;
};
type PluginHookInboundClaimResult = {
  handled: boolean;
  reply?: ReplyPayload;
};
type PluginHookBeforeDispatchEvent = {
  messageId?: string;
  content: string;
  body?: string;
  channel?: string;
  sessionKey?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  isGroup?: boolean;
  timestamp?: number;
};
type PluginHookBeforeDispatchContext = {
  messageId?: string;
  channelId?: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
};
type PluginHookBeforeDispatchResult = {
  handled: boolean;
  text?: string;
};
type PluginHookReplyDispatchEvent = {
  ctx: FinalizedMsgContext;
  runId?: string;
  sessionKey?: string;
  toolsAllow?: string[];
  images?: Array<{
    data: string;
    mimeType: string;
  }>;
  inboundAudio: boolean;
  sessionTtsAuto?: TtsAutoMode;
  ttsChannel?: string;
  suppressUserDelivery?: boolean;
  suppressReplyLifecycle?: boolean;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  shouldRouteToOriginating: boolean;
  originatingChannel?: string;
  originatingTo?: string;
  originatingAccountId?: string;
  originatingThreadId?: string | number;
  originatingChatType?: ChatType;
  shouldSendToolSummaries: boolean;
  shouldSendFullToolDetails: boolean;
  sendPolicy: "allow" | "deny";
  isTailDispatch?: boolean;
};
type PluginHookReplyDispatchContext = {
  /** Host-resolved dispatch path; omitted when the caller cannot establish it. */
  dispatchKind?: PluginHookReplyDispatchKind;
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  abortSignal?: AbortSignal;
  onReplyStart?: () => Promise<void> | void;
  onAgentRunStart?: GetReplyOptions["onAgentRunStart"];
  userTurnTranscriptRecorder?: GetReplyOptions["userTurnTranscriptRecorder"];
  /** Host-owned display facts applied before the assistant transcript is published. */
  prepareAssistantTranscriptMessage?: PrepareAssistantTranscriptMessage;
  recordProcessed: (outcome: "completed" | "skipped" | "error", opts?: {
    reason?: string;
    error?: string;
  }) => void;
  markIdle: (reason: string) => void;
};
type PluginHookReplyDispatchResult = {
  handled: boolean;
  queuedFinal: boolean;
  counts: Record<ReplyDispatchKind, number>;
};
/**
 * Per-turn execution state for the outbound reply, available to every harness
 * (embedded, CLI, Codex app-server) — sourced from the unified `runResult.meta`
 * at dispatch, not from the harness-specific `llm_output` hook. Lets a plugin
 * render a passive per-response footer without re-deriving run state.
 */
type PluginHookReplyUsageState = {
  provider?: string;
  model?: string;
  /** Resolved provider/model ref actually used (keeps the provider prefix). */
  resolvedRef?: string;
  /** Requested reasoning/think effort (e.g. "off" | "low" | "medium" | "high"). */
  reasoningEffort?: string;
  fastMode?: boolean;
  /** True when a model fallback was used for this turn. */
  fallbackUsed?: boolean;
  /** Owning agent + session for this reply. */
  agentId?: string;
  sessionId?: string;
  /** Chat surface kind (e.g. "direct" | "group"). */
  chatType?: string;
  /** Credential mode the turn ran under (e.g. "oauth" | "api_key"). */
  authMode?: string;
  /** Session model-override source, when a non-default model was pinned. */
  overrideSource?: string;
  /** Provider/model ref requested for the turn (vs resolvedRef actually used). */
  requested?: string;
  /** Estimated cost of this turn in USD, when a cost table is configured. */
  turnUsd?: number;
  /** Wall-clock duration of the turn in milliseconds. */
  durationMs?: number;
  /** Owning agent's configured identity (name/emoji/avatar), when set. */
  identity?: {
    name?: string;
    emoji?: string;
    avatar?: string;
  };
  compactionCount?: number;
  /** Effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /**
   * Actual context-window occupancy at the END of the turn — the final model
   * call's prompt tokens, NOT the per-turn aggregate. This is the value
   * `context.used_tokens` / `context.pct_used` must use: the aggregate prompt
   * total over a multi-call tool loop overstates occupancy (often beyond the
   * window). Absent on harnesses that don't report it (the contract then falls
   * back to the aggregate prompt total, which is correct for single-call turns).
   */
  contextUsedTokens?: number;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  /**
   * Usage from the FINAL model call of the turn only — vs `usage`, which is the
   * turn aggregate summed across every tool-loop call. Lets a footer render the
   * last exchange's i/o + cache instead of the whole turn. Absent on harnesses
   * that don't report per-call usage.
   */
  lastUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
};
type PluginHookReplyPayloadSendingEvent = {
  payload: PluginHookReplyPayload;
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  /**
   * Per-turn usage snapshot for live dispatcher delivery. Absent on durable
   * delivery/replay paths, and whenever no exact run correlation is available.
   */
  usageState?: PluginHookReplyUsageState;
};
type PluginHookReplyPayload = Omit<ReplyPayload, "trustedLocalMedia">;
type PluginHookReplyPayloadSendingContext = PluginHookMessageContext;
type PluginHookReplyPayloadSendingResult = {
  payload?: PluginHookReplyPayload;
  cancel?: boolean;
  reason?: string;
};
type PluginHookToolKind = "code_mode_exec";
type PluginHookToolInputKind = "javascript" | "typescript";
/** Host-derived identity for the message requester that initiated a tool call. */
type PluginHookToolRequesterContext = {
  /** Channel/plugin id, for example `discord` or `telegram`. */
  readonly channel?: string;
  /** Channel account used by the agent when multiple accounts are configured. */
  readonly accountId?: string;
  /** Channel-scoped sender id when the host received one. */
  readonly senderId?: string;
  /** True only when the host resolved the sender as an owner. */
  readonly senderIsOwner?: boolean;
  /** Provider-native role ids when the channel supplies them. */
  readonly roleIds?: readonly string[];
};
type PluginHookToolContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  /** Aborts when the owning tool call is cancelled. Hook timeout expiry does not abort this signal. */
  abortSignal?: AbortSignal;
  trace?: DiagnosticTraceContext;
  toolName: string;
  /** Host-authoritative discriminator for tools that intentionally share names. */
  toolKind?: PluginHookToolKind;
  /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */
  toolInputKind?: PluginHookToolInputKind;
  toolCallId?: string;
  getSessionExtension?: (namespace: string) => PluginJsonValue | undefined;
  channelId?: string;
  /**
   * Message requester for this turn. Absent for non-message runs and harnesses
   * that cannot prove requester identity. Authorization hooks should fail
   * closed when a required field is absent.
   */
  requester?: PluginHookToolRequesterContext;
};
type PluginHookBeforeToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  /** Host-authoritative discriminator for tools that intentionally share names. */
  toolKind?: PluginHookToolKind;
  /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */
  toolInputKind?: PluginHookToolInputKind;
  runId?: string;
  toolCallId?: string;
  /**
   * Optional best-effort destination path hints the host derived from `params`
   * for well-known tool envelopes (e.g. `apply_patch`).
   *
   * This is a convenience hint, not an authoritative parse result: the host's
   * extractor may be intentionally lenient and can return paths for malformed
   * or partial envelopes. Plugins may use `derivedPaths` as a fast path, but
   * should parse and validate `params` themselves when correctness or policy
   * decisions depend on the exact set of affected paths. Absent for tools the
   * host does not know how to derive paths for.
   */
  derivedPaths?: readonly string[];
};
type PluginHookAfterToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  runId?: string;
  toolCallId?: string;
  result?: unknown;
  error?: string;
  durationMs?: number;
};
type PluginHookToolResultPersistContext = {
  agentId?: string;
  sessionKey?: string;
  toolName?: string;
  toolCallId?: string;
};
type PluginHookToolResultPersistEvent = {
  toolName?: string;
  toolCallId?: string;
  message: AgentMessage;
  isSynthetic?: boolean;
};
type PluginHookToolResultPersistResult = {
  message?: AgentMessage;
};
type PluginHookBeforeMessageWriteEvent = {
  message: AgentMessage;
  sessionKey?: string;
  agentId?: string;
};
type PluginHookBeforeMessageWriteResult = {
  block?: boolean;
  message?: AgentMessage;
};
type PluginHookSessionContext = {
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
};
type PluginHookSessionStartEvent = {
  sessionId: string;
  sessionKey?: string;
  resumedFrom?: string;
};
type PluginHookSessionEndReason = "new" | "reset" | "idle" | "daily" | "compaction" | "deleted" | "shutdown" | "restart" | "unknown";
type PluginHookSessionEndEvent = {
  sessionId: string;
  sessionKey?: string;
  messageCount: number;
  durationMs?: number;
  reason?: PluginHookSessionEndReason;
  sessionFile?: string;
  transcriptArchived?: boolean;
  nextSessionId?: string;
  nextSessionKey?: string;
};
type PluginHookSubagentContext = {
  runId?: string;
  childSessionKey?: string;
  requesterSessionKey?: string;
};
type PluginHookSubagentTargetKind = "subagent" | "acp";
type PluginHookSubagentRequester = {
  channel?: string;
  accountId?: string;
  to?: string;
  threadId?: string | number;
  /** Native source channel/conversation id, when distinct from the routable target. */
  channelId?: string | number;
  /** Native source message that initiated the parent run, when available. */
  messageId?: string | number;
};
type PluginHookSubagentSpawnBase = {
  childSessionKey: string;
  agentId: string;
  label?: string;
  mode: "run" | "session";
  requester?: PluginHookSubagentRequester;
  threadRequested: boolean;
};
type PluginHookSubagentDeliveryTargetEvent = {
  childSessionKey: string;
  requesterSessionKey: string;
  requesterOrigin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childRunId?: string;
  spawnMode?: "run" | "session";
  expectsCompletionMessage: boolean;
};
/**
 * @deprecated Core route projection resolves subagent delivery targets from
 * `SessionBindingRecord` and channel `resolveDeliveryTarget`. This hook result
 * remains for plugin compatibility during the transition.
 */
type PluginHookSubagentDeliveryTargetResult = {
  origin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
};
type PluginHookSubagentSpawnedEvent = PluginHookSubagentSpawnBase & {
  runId: string;
  /** Fully resolved provider/model ref applied to the spawned child session. */
  resolvedModel?: string;
  /** Provider prefix parsed from resolvedModel when the ref includes one. */
  resolvedProvider?: string;
};
/** Portable channel presentation signal for one background child run. */
type PluginHookSubagentProgressEvent = {
  phase: "started";
  runId: string;
  childSessionKey: string;
  requester?: PluginHookSubagentRequester;
} | {
  phase: "ended";
  runId: string;
  childSessionKey: string;
  outcome: "ok" | "error" | "timeout" | "killed" | "unknown";
  requester?: PluginHookSubagentRequester;
};
type PluginHookSubagentEndedEvent = {
  targetSessionKey: string;
  targetKind: PluginHookSubagentTargetKind;
  reason: string;
  sendFarewell?: boolean;
  accountId?: string;
  runId?: string;
  endedAt?: number;
  outcome?: "ok" | "error" | "timeout" | "killed" | "reset" | "deleted";
  error?: string;
};
type PluginInstallTargetType = "skill" | "plugin";
type PluginInstallRequestKind = "skill-install" | "plugin-dir" | "plugin-archive" | "plugin-file" | "plugin-npm" | "plugin-git";
type PluginInstallSourcePathKind = "file" | "directory";
type PluginInstallFinding = {
  ruleId: string;
  severity: "info" | "warn" | "critical";
  file: string;
  line: number;
  message: string;
};
type PluginHookBeforeInstallRequest = {
  kind: PluginInstallRequestKind;
  mode: "install" | "update";
  requestedSpecifier?: string;
};
type PluginHookBeforeInstallBuiltinScan = {
  status: "ok" | "error";
  scannedFiles: number;
  critical: number;
  warn: number;
  info: number;
  findings: PluginInstallFinding[];
  error?: string;
};
type PluginHookBeforeInstallSkillInstallSpec = {
  id?: string;
  kind: "brew" | "node" | "go" | "uv" | "download";
  label?: string;
  bins?: string[];
  os?: string[];
  formula?: string;
  package?: string;
  module?: string;
  url?: string;
  sha256?: string;
  archive?: string;
  extract?: boolean;
  stripComponents?: number;
  targetDir?: string;
};
type PluginHookBeforeInstallSkill = {
  installId: string;
  installSpec?: PluginHookBeforeInstallSkillInstallSpec;
};
type PluginHookBeforeInstallPlugin = {
  pluginId: string;
  contentType: "bundle" | "package" | "file";
  packageName?: string;
  manifestId?: string;
  version?: string;
  extensions?: string[];
};
type PluginHookBeforeInstallContext = {
  targetType: PluginInstallTargetType;
  requestKind: PluginInstallRequestKind;
  origin?: string;
};
type PluginHookBeforeInstallEvent = {
  targetType: PluginInstallTargetType;
  targetName: string;
  sourcePath: string;
  sourcePathKind: PluginInstallSourcePathKind;
  origin?: string;
  request: PluginHookBeforeInstallRequest;
  builtinScan: PluginHookBeforeInstallBuiltinScan;
  skill?: PluginHookBeforeInstallSkill;
  plugin?: PluginHookBeforeInstallPlugin;
};
type PluginHookBeforeInstallResult = {
  findings?: PluginInstallFinding[];
  block?: boolean;
  blockReason?: string;
};
/** Event payload for the before_agent_run gate hook. */
type PluginHookBeforeAgentRunEvent = {
  /** The user's message that triggered this run. */
  prompt: string;
  /** Loaded session history before the current prompt is submitted. */
  messages: unknown[];
  /** Active system prompt prepared for this run. */
  systemPrompt?: string;
  /** Account identity when available. */
  accountId?: string;
  /** Channel the message came from. */
  channelId?: string;
  /** Sender identity when available. */
  senderId?: string;
  /** Trusted sender identity bit when available. */
  senderIsOwner?: boolean;
};
/** Result type for before_agent_run. Returns pass/block or void (= pass). */
type PluginHookBeforeAgentRunResult = InputGateDecision | void;
type PluginHookResolveExecEnvEvent = {
  sessionKey?: string;
  toolName: "exec";
  host: "gateway" | "sandbox" | "node";
};
type PluginHookResolveExecEnvContext = PluginHookAgentContext;
type PluginHookHandlerMap = {
  agent_turn_prepare: (event: PluginAgentTurnPrepareEvent, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | void> | PluginAgentTurnPrepareResult | void;
  before_model_resolve: (event: PluginHookBeforeModelResolveEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeModelResolveResult | void> | PluginHookBeforeModelResolveResult | void;
  before_prompt_build: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | void> | PluginHookBeforePromptBuildResult | void;
  before_agent_reply: (event: PluginHookBeforeAgentReplyEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentReplyResult | void> | PluginHookBeforeAgentReplyResult | void;
  model_call_started: (event: PluginHookModelCallStartedEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  model_call_ended: (event: PluginHookModelCallEndedEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  llm_input: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  llm_output: (event: PluginHookLlmOutputEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_agent_finalize: (event: PluginHookBeforeAgentFinalizeEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentFinalizeResult | void> | PluginHookBeforeAgentFinalizeResult | void;
  agent_end: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_compaction: (event: PluginHookBeforeCompactionEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  after_compaction: (event: PluginHookAfterCompactionEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_reset: (event: PluginHookBeforeResetEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  inbound_claim: (event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | void> | PluginHookInboundClaimResult | void;
  channel_pairing_requested: (event: PluginHookChannelPairingRequestedEvent, ctx: PluginHookChannelPairingContext) => Promise<void> | void;
  before_dispatch: (event: PluginHookBeforeDispatchEvent, ctx: PluginHookBeforeDispatchContext) => Promise<PluginHookBeforeDispatchResult | void> | PluginHookBeforeDispatchResult | void;
  reply_dispatch: (event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext) => Promise<PluginHookReplyDispatchResult | void> | PluginHookReplyDispatchResult | void;
  reply_payload_sending: (event: PluginHookReplyPayloadSendingEvent, ctx: PluginHookReplyPayloadSendingContext) => Promise<PluginHookReplyPayloadSendingResult | void> | PluginHookReplyPayloadSendingResult | void;
  message_received: (event: PluginHookMessageReceivedEvent, ctx: PluginHookMessageContext) => Promise<void> | void;
  message_sending: (event: PluginHookMessageSendingEvent, ctx: PluginHookMessageContext) => Promise<PluginHookMessageSendingResult | void> | PluginHookMessageSendingResult | void;
  message_sent: (event: PluginHookMessageSentEvent, ctx: PluginHookMessageContext) => Promise<void> | void;
  before_tool_call: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => Promise<PluginHookBeforeToolCallResult | void> | PluginHookBeforeToolCallResult | void;
  after_tool_call: (event: PluginHookAfterToolCallEvent, ctx: PluginHookToolContext) => Promise<void> | void;
  tool_result_persist: (event: PluginHookToolResultPersistEvent, ctx: PluginHookToolResultPersistContext) => PluginHookToolResultPersistResult | void;
  before_message_write: (event: PluginHookBeforeMessageWriteEvent, ctx: {
    agentId?: string;
    sessionKey?: string;
  }) => PluginHookBeforeMessageWriteResult | void;
  session_start: (event: PluginHookSessionStartEvent, ctx: PluginHookSessionContext) => Promise<void> | void;
  session_end: (event: PluginHookSessionEndEvent, ctx: PluginHookSessionContext) => Promise<void> | void;
  subagent_delivery_target: (event: PluginHookSubagentDeliveryTargetEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentDeliveryTargetResult | void> | PluginHookSubagentDeliveryTargetResult | void;
  subagent_spawned: (event: PluginHookSubagentSpawnedEvent, ctx: PluginHookSubagentContext) => Promise<void> | void;
  subagent_progress: (event: PluginHookSubagentProgressEvent, ctx: PluginHookSubagentContext) => Promise<void> | void;
  subagent_ended: (event: PluginHookSubagentEndedEvent, ctx: PluginHookSubagentContext) => Promise<void> | void;
  gateway_start: (event: PluginHookGatewayStartEvent, ctx: PluginHookGatewayContext) => Promise<void> | void;
  gateway_stop: (event: PluginHookGatewayStopEvent, ctx: PluginHookGatewayContext) => Promise<void> | void;
  heartbeat_prompt_contribution: (event: PluginHeartbeatPromptContributionEvent, ctx: PluginHookAgentContext) => Promise<PluginHeartbeatPromptContributionResult | void> | PluginHeartbeatPromptContributionResult | void;
  cron_reconciled: (event: PluginHookCronReconciledEvent, ctx: PluginHookCronReconciledContext) => Promise<void> | void;
  cron_changed: (event: PluginHookCronChangedEvent, ctx: PluginHookGatewayContext) => Promise<void> | void;
  skill_proposal_evaluate: (event: PluginHookSkillProposalEvaluateEvent, ctx: PluginHookSkillContext) => Promise<PluginHookSkillProposalEvaluateResult | void> | PluginHookSkillProposalEvaluateResult | void;
  skill_proposal_changed: (event: PluginHookSkillProposalChangedEvent, ctx: PluginHookSkillContext) => Promise<void> | void;
  skill_changed: (event: PluginHookSkillChangedEvent, ctx: PluginHookSkillContext) => Promise<void> | void;
  before_install: (event: PluginHookBeforeInstallEvent, ctx: PluginHookBeforeInstallContext) => Promise<PluginHookBeforeInstallResult | void> | PluginHookBeforeInstallResult | void;
  before_agent_run: (event: PluginHookBeforeAgentRunEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentRunResult> | PluginHookBeforeAgentRunResult;
  resolve_exec_env: (event: PluginHookResolveExecEnvEvent, ctx: PluginHookResolveExecEnvContext) => Promise<Record<string, string> | void> | Record<string, string> | void;
};
type PluginHookRegistration<K extends PluginHookName = PluginHookName> = {
  pluginId: string;
  registrationId?: string;
  hookName: K;
  handler: PluginHookHandlerMap[K];
  matcher?: PluginToolMatcher;
  priority?: number;
  timeoutMs?: number;
  eligibleTriggers?: readonly PluginHookAgentTrigger[];
  eligibleDispatchKinds?: readonly PluginHookReplyDispatchKind[];
  requiresToolAuthority?: true;
  source: string;
};
//#endregion
//#region src/plugins/runtime/subagent-requester-context.d.ts
type PluginSubagentRequesterContext = Readonly<{
  sessionKey: string;
  origin: Readonly<DeliveryContext>;
}>;
//#endregion
//#region src/agents/workspace-bootstrap-policy.d.ts
/**
 * Canonical bootstrap filenames in prompt order. Single source for the runtime
 * validation set, the name union, and the Control UI core-files list; a private
 * copy anywhere else silently drifts when a file is retired.
 */
declare const WORKSPACE_BOOTSTRAP_FILENAMES: readonly ["AGENTS.md", "SOUL.md", "IDENTITY.md", "USER.md", "BOOTSTRAP.md", "MEMORY.md"];
type WorkspaceBootstrapFileName = (typeof WORKSPACE_BOOTSTRAP_FILENAMES)[number];
type WorkspaceBootstrapFile = {
  name: WorkspaceBootstrapFileName;
  path: string;
  content?: string;
  missing: boolean;
  /** Set only by the authenticated personal USER loader, never inferred from a path. */
  personalUser?: true;
};
/** Restrict a workspace adapter to native bootstrap reads and owner-document writes. */
declare function createWorkspaceBootstrapFilePolicy(params: {
  workspaceDir: string;
  config?: OpenClawConfig;
}): {
  canRead: (relativePath: string) => boolean;
  canList: (relativePath: string) => boolean;
  canWrite: (relativePath: string) => boolean;
};
//#endregion
//#region src/agents/workspace.d.ts
declare function ensureAgentWorkspace(params?: {
  dir?: string;
  ensureBootstrapFiles?: boolean;
  /** Approved custom-agent instructions; never replaces an existing AGENTS.md. */
  purpose?: string;
  /** Creation-time role content; existing workspace files are still preserved. */
  templates?: Partial<Record<"AGENTS.md" | "SOUL.md" | "IDENTITY.md", string>>;
  /** Guard each new mutation after async preparation; admitted effects may settle. */
  beforePersistentApply?: () => void;
  /**
   * List of optional bootstrap filenames to skip writing.
   * Applies only to SOUL.md, USER.md, IDENTITY.md.
   * Required workspace setup such as AGENTS.md still runs.
   */
  skipOptionalBootstrapFiles?: string[];
  /**
   * Workspace provisioning mode. "runtime-managed-implicit" marks a workspace
   * owned by a runtime-managed (ACP) agent without an explicit workspace and
   * with a distinct authoritative cwd: only the directory is provisioned, and
   * bootstrap files, workspace setup state, and `git init` are skipped (#92015).
   */
  provisioning?: "standard" | "runtime-managed-implicit";
}): Promise<{
  dir: string;
  agentsPath?: string;
  soulPath?: string;
  identityPath?: string;
  userPath?: string;
  bootstrapPath?: string;
  bootstrapPending?: boolean;
  identityPathCreated?: boolean;
}>;
//#endregion
//#region src/hooks/internal-hook-types.d.ts
type InternalHookEventType = "command" | "session" | "agent" | "gateway" | "message";
interface InternalHookEvent {
  /** The type of event (command, session, agent, gateway, etc.) */
  type: InternalHookEventType;
  /** The specific action within the type (e.g., 'new', 'reset', 'stop') */
  action: string;
  /** The session key this event relates to */
  sessionKey: string;
  /** Additional context specific to the event */
  context: Record<string, unknown>;
  /** Timestamp when the event occurred */
  timestamp: Date;
  /** Messages to send back to the user (hooks can push to this array) */
  messages: string[];
}
type InternalHookHandler = (event: InternalHookEvent) => Promise<void> | void;
//#endregion
//#region src/hooks/types.d.ts
type HookInstallSpec = {
  id?: string;
  kind: "bundled" | "npm" | "git";
  label?: string;
  package?: string;
  repository?: string;
  bins?: string[];
};
type OpenClawHookMetadata = {
  always?: boolean;
  hookKey?: string;
  emoji?: string;
  homepage?: string;
  /** Events this hook handles (e.g., ["command:new", "session:start"]) */
  events: string[];
  /** Optional export name (default: "default") */
  export?: string;
  os?: string[];
  requires?: {
    bins?: string[];
    anyBins?: string[];
    env?: string[];
    config?: string[];
  };
  install?: HookInstallSpec[];
};
type HookInvocationPolicy = {
  enabled: boolean;
};
type ParsedHookFrontmatter = Record<string, string>;
type Hook = {
  name: string;
  description: string;
  source: "openclaw-bundled" | "openclaw-managed" | "openclaw-workspace" | "openclaw-plugin";
  pluginId?: string;
  filePath: string;
  baseDir: string;
  handlerPath: string;
};
type HookEntry = {
  hook: Hook;
  frontmatter: ParsedHookFrontmatter;
  metadata?: OpenClawHookMetadata;
  invocation?: HookInvocationPolicy;
};
//#endregion
//#region src/plugins/hook-registry.types.d.ts
/** Legacy hook registration stored by the global hook runner registry. */
type PluginLegacyHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};
/** Hook runner registry state for legacy and typed plugin hooks. */
type HookRunnerRegistry = {
  hooks: PluginLegacyHookRegistration[];
  typedHooks: PluginHookRegistration[];
};
/** Global hook runner registry snapshot with plugin load status. */
type GlobalHookRunnerRegistry = HookRunnerRegistry & {
  plugins: Array<{
    id: string;
    packageVersion?: string;
    status: "loaded" | "disabled" | "error";
  }>;
};
//#endregion
//#region src/plugins/hooks.d.ts
type HookRunnerLogger = {
  debug?: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
type HookFailurePolicy = "fail-open" | "fail-closed";
type VoidHookRunOptions = {
  unrefTimeout?: boolean;
};
type HookRunnerOptions = {
  logger?: HookRunnerLogger;
  /** If true, errors in hooks will be caught and logged instead of thrown */
  catchErrors?: boolean;
  /**
   * Optional per-hook failure policy.
   * Defaults to fail-open unless explicitly overridden for a hook name.
   */
  failurePolicyByHook?: Partial<Record<PluginHookName, HookFailurePolicy>>;
  /**
   * Optional timeout for void/observation hooks. A timed-out hook is logged and
   * the runner continues, but the plugin's underlying work is not cancelled.
   */
  voidHookTimeoutMsByHook?: Partial<Record<PluginHookName, number>>;
  /**
   * Optional timeout for modifying hooks. A timed-out hook is logged and skipped,
   * but the plugin's underlying work is not cancelled.
   */
  modifyingHookTimeoutMsByHook?: Partial<Record<PluginHookName, number>>;
};
type HookEvent<K extends PluginHookName> = Parameters<PluginHookHandlerMap[K]>[0];
type HookContext<K extends PluginHookName> = Parameters<PluginHookHandlerMap[K]>[1];
type PluginTargetedInboundClaimOutcome = {
  status: "handled";
  result: PluginHookInboundClaimResult;
} | {
  status: "missing_plugin";
} | {
  status: "no_handler";
} | {
  status: "declined";
} | {
  status: "error";
  error: string;
};
/**
 * Create a hook runner for a specific registry.
 */
declare function createHookRunner(registry: GlobalHookRunnerRegistry, options?: HookRunnerOptions): {
  runBeforeModelResolve: (event: PluginHookBeforeModelResolveEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeModelResolveResult | undefined>;
  runAgentTurnPrepare: (event: PluginAgentTurnPrepareEvent, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | undefined>;
  runBeforePromptBuild: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | undefined>;
  runAuthorizedPromptBuild: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext, params: {
    toolAuthorityFingerprint: string;
    activeToolNames: readonly string[];
    assertHostActive: () => void;
  }) => Promise<PluginHookBeforePromptBuildResult | undefined>;
  runBeforeAgentReply: (event: PluginHookBeforeAgentReplyEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentReplyResult | undefined>;
  runModelCallStarted: (event: {
    runId: string;
    callId: string;
    sessionKey?: string;
    sessionId?: string;
    provider: string;
    model: string;
    api?: string;
    transport?: string;
    contextTokenBudget?: number;
    contextWindowSource?: PluginHookContextWindowSource;
    contextWindowReferenceTokens?: number;
  }, ctx: PluginHookAgentContext) => Promise<void>;
  runModelCallEnded: (event: PluginHookModelCallEndedEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runLlmInput: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runLlmOutput: (event: PluginHookLlmOutputEvent, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeAgentFinalize: (event: PluginHookBeforeAgentFinalizeEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentFinalizeResult | undefined>;
  runAgentEnd: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext, optionsLocal?: VoidHookRunOptions) => Promise<void>;
  /**
   * Run before_compaction hook.
   */
  runBeforeCompaction: (event: {
    messageCount: number;
    compactingCount?: number;
    tokenCount?: number;
    messages?: unknown[];
    sessionFile?: string;
  }, ctx: PluginHookAgentContext) => Promise<void>;
  /**
   * Run after_compaction hook.
   */
  runAfterCompaction: (event: {
    messageCount: number;
    tokenCount?: number;
    compactedCount: number;
    sessionFile?: string;
    previousSessionId?: string;
  }, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeReset: (event: {
    sessionFile?: string;
    messages?: unknown[];
    reason?: string;
  }, ctx: PluginHookAgentContext) => Promise<void>;
  runBeforeAgentRun: (event: PluginHookBeforeAgentRunEvent, ctx: PluginHookAgentContext) => Promise<GateHookResult<InputGateDecision> | undefined>;
  runInboundClaim: (event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
  runInboundClaimForPlugin: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | undefined>;
  runInboundClaimForPluginOutcome: (pluginId: string, event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginTargetedInboundClaimOutcome>;
  runChannelPairingRequested: (event: {
    channel: string;
    accountId?: string;
    senderId: string;
    code: string;
    metadata?: Record<string, string | undefined>;
  }, ctx: {
    channelId: string;
    accountId?: string;
    senderId: string;
  }) => Promise<void>;
  runMessageReceived: (event: PluginHookMessageReceivedEvent, ctx: PluginHookMessageContext) => Promise<void>;
  runBeforeDispatch: (event: PluginHookBeforeDispatchEvent, ctx: PluginHookBeforeDispatchContext, requester?: PluginSubagentRequesterContext) => Promise<PluginHookBeforeDispatchResult | undefined>;
  runReplyDispatch: (event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext) => Promise<PluginHookReplyDispatchResult | undefined>;
  runReplyPayloadSending: (event: PluginHookReplyPayloadSendingEvent, ctx: PluginHookMessageContext) => Promise<PluginHookReplyPayloadSendingResult | undefined>;
  runMessageSending: (event: HookEvent<"message_sending">, ctx: HookContext<"message_sending">) => Promise<PluginHookMessageSendingResult | undefined>;
  runMessageSent: (event: PluginHookMessageSentEvent, ctx: PluginHookMessageContext) => Promise<void>;
  runBeforeToolCall: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext, receipt?: Readonly<{
    token: ExecutionIdentityAdmissionToken;
    assertAuthority: () => boolean | void;
    markOwnerDecision?: () => void;
  }>) => Promise<PluginHookBeforeToolCallResult | undefined>;
  runAfterToolCall: (event: PluginHookAfterToolCallEvent, ctx: PluginHookToolContext) => Promise<void>;
  runToolResultPersist: (event: PluginHookToolResultPersistEvent, ctx: PluginHookToolResultPersistContext) => PluginHookToolResultPersistResult | undefined;
  runBeforeMessageWrite: (event: PluginHookBeforeMessageWriteEvent, ctx: {
    agentId?: string;
    sessionKey?: string;
  }) => PluginHookBeforeMessageWriteResult | undefined;
  runSessionStart: (event: PluginHookSessionStartEvent, ctx: {
    agentId?: string;
    sessionId: string;
    sessionKey?: string;
  }) => Promise<void>;
  runSessionEnd: (event: PluginHookSessionEndEvent, ctx: {
    agentId?: string;
    sessionId: string;
    sessionKey?: string;
  }) => Promise<void>;
  runSubagentDeliveryTarget: (event: {
    childSessionKey: string;
    requesterSessionKey: string;
    requesterOrigin?: {
      channel?: string;
      accountId?: string;
      to?: string;
      threadId?: string | number;
    };
    childRunId?: string;
    spawnMode?: "run" | "session";
    expectsCompletionMessage: boolean;
  }, ctx: {
    runId?: string;
    childSessionKey?: string;
    requesterSessionKey?: string;
  }) => Promise<PluginHookSubagentDeliveryTargetResult | undefined>;
  runSubagentSpawned: (event: {
    childSessionKey: string;
    agentId: string;
    label?: string;
    mode: "run" | "session";
    requester?: {
      channel?: string;
      accountId?: string;
      to?: string;
      threadId?: string | number;
      channelId?: string | number;
      messageId?: string | number;
    };
    threadRequested: boolean;
  } & {
    runId: string;
    resolvedModel?: string;
    resolvedProvider?: string;
  }, ctx: {
    runId?: string;
    childSessionKey?: string;
    requesterSessionKey?: string;
  }) => Promise<void>;
  runSubagentProgress: (event: {
    phase: "started";
    runId: string;
    childSessionKey: string;
    requester?: {
      channel?: string;
      accountId?: string;
      to?: string;
      threadId?: string | number;
      channelId?: string | number;
      messageId?: string | number;
    };
  } | {
    phase: "ended";
    runId: string;
    childSessionKey: string;
    outcome: "ok" | "error" | "timeout" | "killed" | "unknown";
    requester?: {
      channel?: string;
      accountId?: string;
      to?: string;
      threadId?: string | number;
      channelId?: string | number;
      messageId?: string | number;
    };
  }, ctx: {
    runId?: string;
    childSessionKey?: string;
    requesterSessionKey?: string;
  }) => Promise<void>;
  runSubagentEnded: (event: {
    targetSessionKey: string;
    targetKind: "acp" | "subagent";
    reason: string;
    sendFarewell?: boolean;
    accountId?: string;
    runId?: string;
    endedAt?: number;
    outcome?: "ok" | "error" | "timeout" | "killed" | "reset" | "deleted";
    error?: string;
  }, ctx: {
    runId?: string;
    childSessionKey?: string;
    requesterSessionKey?: string;
  }) => Promise<void>;
  runGatewayStart: (event: PluginHookGatewayStartEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runGatewayStop: (event: PluginHookGatewayStopEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runHeartbeatPromptContribution: (event: PluginHeartbeatPromptContributionEvent, ctx: PluginHookAgentContext) => Promise<PluginHeartbeatPromptContributionResult | undefined>;
  runCronReconciled: (event: PluginHookCronReconciledEvent, ctx: PluginHookCronReconciledContext) => Promise<void>;
  runCronChanged: (event: PluginHookCronChangedEvent, ctx: PluginHookGatewayContext) => Promise<void>;
  runSkillProposalEvaluate: (event: PluginHookSkillProposalEvaluateEvent, ctx: PluginHookSkillContext) => Promise<PluginHookSkillProposalEvaluationOutcome[]>;
  runSkillProposalChanged: (event: PluginHookSkillProposalChangedEvent, ctx: PluginHookSkillContext) => Promise<void>;
  runSkillChanged: (event: PluginHookSkillChangedEvent, ctx: PluginHookSkillContext) => Promise<void>;
  runBeforeInstall: (event: PluginHookBeforeInstallEvent, ctx: PluginHookBeforeInstallContext) => Promise<{
    findings?: {
      ruleId: string;
      severity: "info" | "warn" | "critical";
      file: string;
      line: number;
      message: string;
    }[];
    block?: boolean;
    blockReason?: string;
  } | undefined>;
  runResolveExecEnv: (event: PluginHookResolveExecEnvEvent, ctx: PluginHookResolveExecEnvContext) => Promise<Record<string, string>>;
  hasHooks: <K extends PluginHookName>(hookName: K, ctx?: Partial<Parameters<PluginHookHandlerMap[K]>[1]>) => boolean;
  getHookCount: (hookName: PluginHookName) => number;
};
type HookRunner = ReturnType<typeof createHookRunner>;
//#endregion
//#region src/plugins/hook-runner-global.d.ts
/**
 * Initialize the global hook runner with a plugin registry.
 * Called on every plugin registry activation and by SDK consumers. The runner
 * instance stays stable so references captured mid-run keep seeing current hooks.
 */
declare function initializeGlobalHookRunner(registry: GlobalHookRunnerRegistry): void;
/**
 * Get the global hook runner.
 * Returns null if plugins haven't been loaded yet.
 */
declare function getGlobalHookRunner(): HookRunner | null;
/**
 * Reset the global hook runner (for testing).
 */
declare function resetGlobalHookRunner(): void;
//#endregion
export { PluginHookSkillProposalKind as $, PluginHookReplyPayloadSendingResult as A, PluginNextTurnInjection as B, PluginHookRegistrationOptions as C, projectSessionDeliveryFields as Ct, PluginHookReplyPayload as D, PluginHookReplyDispatchResult as E, PluginToolMatcher as F, PluginHookSkillBundleSnapshot as G, PluginNextTurnInjectionRecord as H, PluginAgentTurnPrepareEvent as I, PluginHookSkillEvaluationFinding as J, PluginHookSkillChangedEvent as K, PluginAgentTurnPrepareResult as L, PluginHookToolInputKind as M, PluginHookToolKind as N, PluginHookReplyPayloadSendingContext as O, PluginHookToolRequesterContext as P, PluginHookSkillProposalEvaluationOutcome as Q, PluginHeartbeatPromptContributionEvent as R, PluginHookRegistration as S, normalizeSessionDeliveryState as St, PluginHookReplyDispatchEvent as T, PluginHookSkillArtifact as U, PluginNextTurnInjectionEnqueueResult as V, PluginHookSkillBundleFile as W, PluginHookSkillProposalEvaluateEvent as X, PluginHookSkillProposalChangedEvent as Y, PluginHookSkillProposalEvaluateResult as Z, PluginHookHandlerMap as _, ReplyDispatchReceipt as _t, HookEntry as a, PluginHookMessageContext as at, PluginHookLlmOutputEvent as b, ReplyFollowupAdmissionBarrierTimeoutPolicy as bt, InternalHookHandler as c, PluginHookProviderUpdate as ct, createWorkspaceBootstrapFilePolicy as d, PluginApprovalResolution as dt, PluginHookInboundClaimContext as et, PluginSubagentRequesterContext as f, PluginHookBeforeToolCallResult as ft, PluginHookBeforeToolCallEvent as g, ReplyDispatchKind as gt, PluginHookBeforeAgentFinalizeEvent as h, ReplyDispatchBeforeDeliverOptions as ht, HookRunner as i, PluginHookMediaFact as it, PluginHookToolContext as j, PluginHookReplyPayloadSendingEvent as k, ensureAgentWorkspace as l, MessageHookMediaFact as lt, PluginHookAgentEndEvent as m, ReplyDispatchBeforeDeliver as mt, initializeGlobalHookRunner as n, PluginHookInboundMessageMetadata as nt, InternalHookEvent as o, PluginHookMessageReceivedEvent as ot, PluginHookAgentContext as p, PrepareAssistantTranscriptMessage as pt, PluginHookSkillContext as q, resetGlobalHookRunner as r, PluginHookLocation as rt, InternalHookEventType as s, PluginHookMessageSentEvent as st, getGlobalHookRunner as t, PluginHookInboundClaimEvent as tt, WorkspaceBootstrapFile as u, PluginHookGatewayCronService as ut, PluginHookInboundClaimResult as v, ReplyDispatchRuntimeInfo as vt, PluginHookReplyDispatchContext as w, PluginJsonValue as wt, PluginHookName as x, NormalizeReplySkipReason as xt, PluginHookLlmInputEvent as y, ReplyDispatcher as yt, PluginHeartbeatPromptContributionResult as z };