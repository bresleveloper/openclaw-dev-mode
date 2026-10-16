import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { x as ReplyToMode } from "./types.base-D8MIFbSh.js";
import { At as OutboundPayloadPlan, dn as ExecutionIdentityAdmissionToken, i as SessionWriterDeliveryAuthority, m as CommandOwnerAssertion, pn as ReplyPayload } from "./reply-payload-DazZPys5.js";
import "./types-C-BtfS0H.js";
import { n as OpenClawStateDatabase, t as OpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-Yba_0aSZ.js";
import { f as MessagePresentation, j as ReplyPayloadDelivery, o as LegacyInteractiveReply } from "./payload-DbVrIDaU.js";
import "./openclaw-state-db.generated-CriCmxNW.js";
import { t as OutboundMediaAccess } from "./load-options-v9K2x1AC.js";
import { A as OutboundSendDeps, D as OutboundReplyFacts, k as RenderedMessageBatchPlan, m as ChannelMessageUnknownSendReconciliationResult } from "./types-DemD-QhX.js";
import "./types.adapters-Bo2TMZGx.js";
import { a as OutboundPayloadDeliveryOutcome, c as PlatformSendRoute, i as OutboundDeliveryResult, n as OutboundDeliveryError, o as OutboundPayloadDeliverySuppressionReason, r as OutboundDeliveryQueuePolicy, t as IndexedOutboundAuditTerminal } from "./deliver-types-Qc6HS898.js";
import { o as OutboundIdentity, s as OutboundDeliveryFormattingOptions, t as ChannelDeliveryCapabilities } from "./outbound.types-B8D3jrzb.js";
import { C as PluginHookReplyPayloadSendingContext, ht as ReplyDispatchKind } from "./hook-runner-global-Jvv9WFUW.js";
import { DatabaseSync } from "node:sqlite";
import { Selectable } from "kysely";
//#region src/state/openclaw-state-maintenance-context.d.ts
type MaintenanceResource = {
  phase: "agent-resources" | "agent-handles" | "shared-leases" | "shared-resources" | "shared-references" | "shared-handles";
  close: () => void | Promise<void>;
};
type AgentSchemaMigration = {
  agentId: string;
  path: string;
  foundVersion: number;
  supportedVersion: number;
};
type OpenClawDatabaseMaintenanceScope = {
  readonly ownsSchemaMaintenance: boolean;
  assertOwnerCurrent(this: void, access?: "read"): void;
  assertDatabaseAccess(this: void, databasePath: string): void;
  assertAdmission(this: void): void;
  assertReadAdmission(this: void): void;
  addAgentSchemaMigrationCheck(check: (migration: AgentSchemaMigration) => void): void;
  assertAgentSchemaMigration(migration: AgentSchemaMigration): void;
  run<T>(operation: () => T): T;
  track<T>(operation: Promise<T>): Promise<T>;
  own(resource: object, phase: MaintenanceResource["phase"], close: MaintenanceResource["close"]): void;
  close(beforeResources?: () => void | Promise<void>): Promise<void>;
};
//#endregion
//#region src/infra/sqlite-worker-state-context.d.ts
/** Resolved host facts for the canonical shared-state owner, never authority. */
type SqliteWorkerStateContext = {
  environment: NodeJS.ProcessEnv & {
    OPENCLAW_STATE_DIR: string;
    OPENCLAW_SUPERVISOR_MODE?: "external";
  };
  /** Selected config inputs for native shared-state initialization, not command environment. */
  initializationEnvironment?: NodeJS.ProcessEnv;
  /** Known agent paths preserve deletion-history uncertainty during native initialization. */
  initializationAgentPaths?: readonly string[];
  existingSchemaPath?: string;
  /** Actor-owned exclusion for autonomous WAL work, never write authority. */
  scheduledMaintenanceSuspension?: SharedArrayBuffer;
};
//#endregion
//#region src/state/openclaw-state-worker-context.types.d.ts
type OpenClawStateWorkerContext = Omit<SqliteWorkerStateContext, "environment"> & {
  environment: {
    OPENCLAW_STATE_DIR: string;
    OPENCLAW_SUPERVISOR_MODE?: "external";
  };
  admission: OpenClawStateDatabaseReadAdmission;
  /** Committed facts outlive a caller's schema borrow, but never the captured database generation. */
  assertPublicationCurrent?: () => void;
  /** Host-only captured scope; reentry never extends the original admission lifetime. */
  runInCapturedSchemaScope?: <T>(operation: () => T) => T;
  /** Host-only ownership; workers request live schema grants through their job admission. */
  maintenanceScope?: OpenClawDatabaseMaintenanceScope;
};
//#endregion
//#region src/config/sessions/transcript-mirror.d.ts
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
} | {
  kind: "channel-final-suppressed";
  reason: "stale-foreground";
  sourceMessageId?: string;
};
//#endregion
//#region src/shared/silent-reply-policy.d.ts
type SilentReplyConversationType = "direct" | "group" | "internal";
//#endregion
//#region src/infra/outbound/payloads.d.ts
/** Runtime-ready outbound payload after text/media/rich-content normalization. */
type NormalizedOutboundPayload = {
  text: string;
  mediaUrls: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload["location"];
  /** Hook-only content for audio-only TTS payloads. Never used as channel text/caption. */
  hookContent?: string;
  /** Preserves the status/answer distinction through delivery hooks. */
  isStatusNotice?: boolean;
};
/** JSON-safe outbound payload projection used for envelopes and diagnostics. */
type OutboundPayloadJson = {
  text: string;
  isError?: boolean;
  mediaUrl: string | null;
  mediaUrls?: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload["location"];
};
type OutboundPayloadPlanContext = {
  cfg?: OpenClawConfig;
  sessionKey?: string;
  surface?: string;
  conversationType?: SilentReplyConversationType;
  extractMarkdownImages?: boolean;
};
/** Parses raw reply text before building the canonical outbound payload plan. */
declare function createOutboundPayloadPlan(payloads: readonly ReplyPayload[], context?: OutboundPayloadPlanContext): OutboundPayloadPlan[];
/** Plans admitted payload fields without reapplying lane policy or interpreting text directives. */
declare function createStructuredOutboundPayloadPlan(payloads: readonly ReplyPayload[]): OutboundPayloadPlan[];
/** Projects a payload plan back to normalized reply payloads for delivery. */
declare function projectOutboundPayloadPlanForDelivery(plan: readonly OutboundPayloadPlan[]): ReplyPayload[];
/** Projects a payload plan into JSON-safe envelope/debug payloads. */
declare function projectOutboundPayloadPlanForJson(plan: readonly OutboundPayloadPlan[]): OutboundPayloadJson[];
//#endregion
//#region src/config/sessions/session-delivery-generation.types.d.ts
type SessionDeliveryGeneration = Readonly<{
  agentId: string;
  storePath: string;
  sessionKey: string;
  sessionId: string;
  lifecycleRevision: string | null;
}>;
//#endregion
//#region src/infra/delivery-queue-sqlite.types.d.ts
type DeliveryQueueCompletionRetention = "permanent" | Readonly<{
  idPrefix: string;
  maxAgeMs: number;
  maxEntries: number;
}>;
//#endregion
//#region src/infra/delivery-queue-state-context.d.ts
type DeliveryQueueStateContext = {
  stateDir: string;
  workerContext: OpenClawStateWorkerContext;
  supervisorMode?: "external";
};
//#endregion
//#region src/infra/outbound/identity.d.ts
/** Resolves an agent's configured identity into channel-safe outbound metadata. */
declare function resolveAgentOutboundIdentity(cfg: OpenClawConfig, agentId: string): OutboundIdentity | undefined;
//#endregion
//#region src/infra/outbound/mirror.d.ts
/**
 * Transcript append data emitted after an outbound send completes.
 */
type OutboundMirror = {
  sessionKey: string;
  agentId?: string;
  text?: string;
  mediaUrls?: string[];
  idempotencyKey?: string;
  expectedSessionId?: string;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
};
/**
 * Delivery-layer mirror data with optional group/channel correlation metadata.
 */
type DeliveryMirror = OutboundMirror & {
  /** Whether this message is being sent in a group/channel context */
  isGroup?: boolean;
  /** Group or channel identifier for correlation with received events */
  groupId?: string;
};
//#endregion
//#region src/infra/outbound/prepared-batch.d.ts
declare const PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION: 1;
type PreparedOutboundAcceptedEntry = {
  sourceIndex: number;
  status: "accepted";
  payload: ReplyPayload;
  replyHookChanged: boolean;
  messageHookChanged: boolean;
  preparedMediaCount: number;
};
type PreparedOutboundSuppressedEntry = {
  sourceIndex: number;
  status: "suppressed";
  reason: OutboundPayloadDeliverySuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
};
type PreparedOutboundBatchEntry = PreparedOutboundAcceptedEntry | PreparedOutboundSuppressedEntry;
/** Canonical post-policy payload custody persisted by the durable outbound queue. */
type PreparedOutboundBatch = {
  schemaVersion: typeof PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION;
  sourcePayloadCount: number;
  /** True only when accepted payloads already passed post-policy channel normalization. */
  channelNormalized?: true;
  runId?: string;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
  entries: PreparedOutboundBatchEntry[];
};
//#endregion
//#region src/infra/outbound/session-context.d.ts
type OutboundSessionContext = {
  /**
   * Canonical session key used for internal hook dispatch.
   *
   * MUST equal the agent runtime's `params.sessionKey` for the run that
   * produced the payload being delivered. Plugins observing both
   * `agent_end`/`llm_input`/`llm_output`/`before_tool_call`/`after_tool_call`
   * and `message_sending`/`message_sent` rely on this equality to correlate
   * per-turn state across the agent-loop and delivery boundaries.
   *
   * Callers populating this field should use the same value the agent runner
   * received as its sessionKey — in the chat path that is
   * `targetSessionKey || ctx.SessionKey` (see
   * `auto-reply/reply/get-reply.ts`). Followup, ACP, command, and cron
   * delivery paths each have their own canonical value to forward; consult
   * the relevant runner.
   */
  key?: string;
  /**
   * Session key used for policy resolution when delivery differs from the
   * control session. Used to look up silent-reply policy, send rate limits,
   * agent-scoped channel preferences, etc., for the chat the reply is being
   * delivered into. May equal `key` when there is no redirect; otherwise
   * `policyKey` describes the *delivery target*'s session while `key`
   * describes the *control session* whose hooks fire.
   */
  policyKey?: string;
  /** Explicit conversation type for policy resolution when a session key is generic. */
  conversationType?: SilentReplyConversationType;
  /**
   * Caller-declared destination conversation kind for metadata-only audit
   * projection. Never derived from session-key parsing: policy keys can name
   * an acted-on session that is not the delivery destination, and a wrong
   * "direct" here over-collects under audit.messages="direct".
   */
  conversationKind?: "direct" | "group" | "channel";
  /** Active agent id used for workspace-scoped media roots. */
  agentId?: string;
  /** Originating account id used for requester-scoped group policy resolution. */
  requesterAccountId?: string;
  /** Originating sender id used for sender-scoped outbound media policy. */
  requesterSenderId?: string;
  /** Originating sender display name for name-keyed sender policy matching. */
  requesterSenderName?: string;
  /** Originating sender username for username-keyed sender policy matching. */
  requesterSenderUsername?: string;
  /** Originating sender E.164 phone number for e164-keyed sender policy matching. */
  requesterSenderE164?: string;
};
/** Builds the outbound delivery session context, omitting empty policy fields. */
declare function buildOutboundSessionContext(params: {
  cfg: OpenClawConfig;
  sessionKey?: string | null;
  policySessionKey?: string | null;
  conversationType?: string | null;
  isGroup?: boolean | null;
  agentId?: string | null;
  requesterAccountId?: string | null;
  requesterSenderId?: string | null;
  requesterSenderName?: string | null;
  requesterSenderUsername?: string | null;
  requesterSenderE164?: string | null;
}): OutboundSessionContext | undefined;
//#endregion
//#region src/infra/outbound/delivery-queue-types.d.ts
/** Serializable owner callback for a durable queue entry. */
type DurableDeliveryCompletion = {
  kind: "conversation";
  agentId: string;
  operationId: string;
  storePath?: string;
  /** Present on Gateway-owned conversation intents created with route authorization. */
  routeFingerprint?: string;
} | {
  kind: "pending-final";
  /** Null means an owner was admitted without recoverable authority; fail closed. */
  commandOwnerReference?: CommandOwnerAssertion["recoveryReference"];
  /** Older queue records retain the canonical locator's original owner selection. */
  agentId?: string;
  deliveryId: string;
  intentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  sessionWriterDeliveryAuthority?: SessionWriterDeliveryAuthority;
};
type QueuedReplyPayloadSendingHook = {
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  context: PluginHookReplyPayloadSendingContext;
};
type QueuedDeliveryPayload = {
  sessionGeneration?: SessionDeliveryGeneration;
  channel: string;
  to: string;
  accountId?: string;
  queuePolicy?: "required" | "best_effort";
  requireUnknownSendReconciliation?: boolean;
  requiresProducerClaim?: boolean;
  preparedBatch?: PreparedOutboundBatch;
  payloads?: ReplyPayload[];
  renderedBatchPlan?: RenderedMessageBatchPlan;
  threadId?: string | number | null;
  reply?: OutboundReplyFacts;
  formatting?: OutboundDeliveryFormattingOptions;
  identity?: OutboundIdentity;
  bestEffort?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean;
  silent?: boolean;
  mirror?: DeliveryMirror;
  session?: OutboundSessionContext;
  gatewayClientScopes?: readonly string[];
  preparedMessageId?: string;
  deliveryCompletion?: DurableDeliveryCompletion;
  completionRetention?: DeliveryQueueCompletionRetention;
  legacyUnknownSendReconciliation?: Exclude<ChannelMessageUnknownSendReconciliationResult, {
    status: "unresolved";
  }>;
  legacyPreparedContentUnavailable?: true;
  maxRetries?: number;
};
type DeliveryFailureSettlement = {
  error: string;
  unknownSendCleanup?: true;
  terminals?: readonly IndexedOutboundAuditTerminal[];
} & ({
  outcome: "unknown";
} | {
  outcome: "failed";
  rejectionError?: string;
});
type QueuedDelivery = Omit<QueuedDeliveryPayload, "preparedBatch" | "payloads"> & {
  preparedBatch: PreparedOutboundBatch;
  id: string;
  enqueuedAt: number;
  retryCount: number;
  attemptCount: number;
  availableAt?: number;
  producerClaimId?: string;
  lastAttemptAt?: number;
  lastError?: string;
  platformSendAttemptId?: string;
  platformSendStartedAt?: number;
  effectiveReplyToId?: string | null;
  recoveryState?: "producer_claimed" | "send_attempt_started" | "unknown_after_send" | "settlement_pending";
  settlement?: DeliveryFailureSettlement;
  retainOnFailure?: true;
};
//#endregion
//#region src/infra/outbound/delivery-queue-settlement.types.d.ts
type AckDeliveryOptions = {
  /** Caller holds a GC-visible recovery lease until its active adapter settles. */
  retainSpoolArtifacts?: boolean;
  /** An intentionally suppressed pre-send batch must not become a success receipt. */
  suppressCompletionReceipt?: boolean;
  /** Prevent an older provider attempt from settling a replacement owner. */
  expectedPlatformSendAttemptId?: string | null;
};
//#endregion
//#region src/infra/outbound/delivery-queue-ack.kernel.d.ts
/** Retires an unsent live claim while its adapter preparation still owns resources. */
declare function retireUnsentDeliveryInDatabase(database: OpenClawStateDatabase, params: {
  id: string;
  producerClaimId: string;
  stateDir?: string;
}, terminalOutcome?: "failed"): {
  spoolPaths: string[];
  retention?: string;
} | undefined;
//#endregion
//#region src/infra/outbound/delivery-queue-ack.d.ts
/** Retires an unsent live claim while its adapter preparation still owns resources. */
declare function retireUnsentDelivery(params: Parameters<typeof retireUnsentDeliveryInDatabase>[1], context?: DeliveryQueueStateContext, terminalOutcome?: "failed"): Promise<(() => Promise<void>) | undefined>;
/** Remove a successfully delivered entry, or retain its producer-owned receipt. */
declare function ackDelivery(id: string, requestedStateDir?: string, options?: AckDeliveryOptions, context?: DeliveryQueueStateContext): Promise<void>;
//#endregion
//#region src/infra/outbound/deliver-queue-state.d.ts
type QueuedDeliveryFailureRecorder = (id: string, error: string, stateDir?: string, expectedPlatformSendAttemptId?: string | null) => Promise<void>;
/** Keeps live and recovered queue transitions on the same producer claim. */
declare function createQueuedDeliveryOwner(params: {
  queueId: string;
  stateDir?: string;
  expectedPlatformSendAttemptId?: string | null;
  signal?: AbortSignal;
}, context?: DeliveryQueueStateContext): {
  queueId: string;
  stateDir: string | undefined;
  claimId: string | null | undefined;
  signal: AbortSignal | undefined;
  readonly custody: "held" | "released";
  project(error: unknown, evidence?: Omit<ConstructorParameters<typeof OutboundDeliveryError>[1], "cause">): OutboundDeliveryError;
  retireUnsent(terminalOutcome?: "failed"): ReturnType<typeof retireUnsentDelivery>;
  ack(options?: Parameters<typeof ackDelivery>[2]): Promise<void>;
  finalizeFailure(entry: QueuedDelivery): Promise<boolean>;
  fail(record: QueuedDeliveryFailureRecorder, error: string): Promise<void>;
  retire(): Promise<void>;
};
type QueuedDeliveryOwner = ReturnType<typeof createQueuedDeliveryOwner>;
//#endregion
//#region src/infra/outbound/reply-policy.d.ts
/** Resolved reply target plus whether it came from payload or ambient context. */
type ReplyToResolution = {
  replyToId?: string;
  source?: "explicit" | "implicit";
};
/** Creates a reply-to supplier that consumes implicit single-use reply ids once. */
declare function createReplyToFanout(params: {
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  replyToIdSource?: ReplyToResolution["source"];
}): () => string | undefined;
//#endregion
//#region src/infra/outbound/message-sent-hook.d.ts
type MessageSentEvent = {
  success: boolean;
  content: string;
  error?: string;
  messageId?: string;
};
//#endregion
//#region src/infra/outbound/deliver-contracts.d.ts
type ConversationDeliveryAttemptAuthority = Omit<Extract<DurableDeliveryCompletion, {
  kind: "conversation";
}>, "kind">;
type OutboundDeliveryIntent = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  queuePolicy: OutboundDeliveryQueuePolicy;
};
type DurableFinalDeliveryRequirement = keyof NonNullable<ChannelDeliveryCapabilities["durableFinal"]>;
type DurableFinalDeliveryRequirements = Partial<Record<DurableFinalDeliveryRequirement, boolean>>;
type DeliverOutboundPayloadsCoreParams = {
  cfg: OpenClawConfig;
  channel: string;
  to: string;
  accountId?: string;
  payloads: ReplyPayload[];
  /** Admitted run correlation copied into the prepared durable batch. */
  runId?: string;
  /** @internal Exact admitted execution provenance copied into durable custody. */
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
  /** @internal Canonical post-policy batch used by queue recovery and physical delivery. */
  preparedBatch?: PreparedOutboundBatch;
  reply?: OutboundReplyFacts;
  formatting?: OutboundDeliveryFormattingOptions;
  threadId?: string | number | null;
  identity?: OutboundIdentity;
  deps?: OutboundSendDeps;
  mediaAccess?: OutboundMediaAccess;
  gifPlayback?: boolean;
  forceDocument?: boolean;
  replyPayloadSendingHook?: QueuedReplyPayloadSendingHook;
  abortSignal?: AbortSignal;
  bestEffort?: boolean;
  onError?: (err: unknown, payload: NormalizedOutboundPayload) => void;
  onPayload?: (payload: NormalizedOutboundPayload) => void;
  /** @internal Reports the effective payload only after an identified platform send. */
  onDeliveredPayload?: (payload: NormalizedOutboundPayload) => void;
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void;
  /** @internal Runs after each identified platform result, before further fallible work. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
  /** @internal Reports a settled native payload for post-terminal message_sent observation. */
  onMessageSentEvent?: (event: MessageSentEvent, sourceIndex: number) => void;
  /** @internal Persists ambiguous-send state immediately before platform I/O. */
  onPlatformSendStart?: (route: PlatformSendRoute, sourceIndex?: number) => Promise<void>;
  /** @internal Opaque durable intent id forwarded to provider reconciliation hooks. */
  deliveryQueueId?: string;
  /** @internal Stable producer id used to make queue creation idempotent across crashes. */
  deliveryIntentId?: string;
  /** @internal Retain the completed receipt for a producer-owned replayable intent. */
  completionRetention?: DeliveryQueueCompletionRetention;
  /** @internal Producer-specific durable recovery attempt budget. */
  maxRetries?: number;
  /** @internal Retry this producer's pending intent only when no platform send began. */
  reusePendingDeliveryIntent?: boolean;
  /** @internal Serializable owner state finalized after live or recovered delivery. */
  deliveryCompletion?: DurableDeliveryCompletion;
  /** @internal The caller resends proven-not-sent payloads itself, so recovery must not. */
  deliveryRetryOwner?: "caller";
  /** @internal Ephemeral route authority for a recovered attempt; never owns completion. */
  conversationDeliveryAttemptAuthority?: ConversationDeliveryAttemptAuthority;
  /** @internal Revalidates authority once per durable queue execution, before adapter fanout. */
  onDeliveryAttempt?: () => Promise<void>;
  /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string;
  /** @internal Recheck the concrete post-hook send shape before platform I/O. */
  requiredUnknownSendReconciliation?: boolean;
  /** @internal Caller preflight explicitly required provider unknown-send reconciliation. */
  requireUnknownSendReconciliation?: boolean;
  /** @internal Revalidate caller authority before direct adapter code can run. */
  onDirectAdapterHandoff?: () => Promise<void>;
  /** @internal Synchronously fence authority at the final adapter invocation. */
  assertDirectAdapterHandoff?: () => void;
  /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** Session/agent context used for hooks and media local-root scoping. */
  session?: OutboundSessionContext;
  mirror?: DeliveryMirror;
  silent?: boolean;
  gatewayClientScopes?: readonly string[];
  conversationReadOrigin?: "delegated" | "direct-operator";
};
/**
 * @deprecated Direct outbound delivery is compatibility/runtime substrate.
 * New message lifecycle code should use `sendDurableMessageBatch` from
 * `src/channels/message/send.ts` or `deliverInboundReplyWithMessageSendContext`
 * from `src/channels/turn/durable-delivery.ts`. Keep direct use only for
 * outbound substrate, recovery, and compatibility paths.
 */
type DeliverOutboundPayloadsParams = DeliverOutboundPayloadsCoreParams & {
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  /** @internal Skip write-ahead queue (used by crash-recovery to avoid re-enqueueing). */
  skipQueue?: boolean;
  /** @internal Fence recovery ownership at the same provider boundary as live sends. */
  deliveryProducerClaimId?: string;
  deliveryQueueOwner?: QueuedDeliveryOwner;
  /** @internal Keep the exact live producer claim alive during platform preparation. */
  deliveryProducerLeaseRequired?: boolean;
  /** @internal Recovery already ran provider admission after its pending-row re-read. */
  deferredDeliveryAdmissionPassed?: true;
  /** @internal State directory that owns the existing recovery queue entry. */
  deliveryQueueStateDir?: string;
  /** @internal Let recovery run commit hooks after it has acked the recovered queue entry. */
  deferCommitHooks?: boolean;
  queuePolicy?: OutboundDeliveryQueuePolicy;
  renderedBatchPlan?: RenderedMessageBatchPlan;
  onDeliveryIntent?: (intent: OutboundDeliveryIntent) => void;
};
//#endregion
export { ReplyToResolution as a, buildOutboundSessionContext as c, createStructuredOutboundPayloadPlan as d, projectOutboundPayloadPlanForDelivery as f, SqliteWorkerStateContext as g, OpenClawStateWorkerContext as h, OutboundDeliveryIntent as i, resolveAgentOutboundIdentity as l, SilentReplyConversationType as m, DurableFinalDeliveryRequirement as n, createReplyToFanout as o, projectOutboundPayloadPlanForJson as p, DurableFinalDeliveryRequirements as r, OutboundSessionContext as s, DeliverOutboundPayloadsParams as t, createOutboundPayloadPlan as u };