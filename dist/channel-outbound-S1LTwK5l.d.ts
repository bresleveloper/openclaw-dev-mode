import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { Cn as ChannelProgressDraftCompositorLine, En as AgentPlanStep, Tn as ChannelProgressDraftCompositorSnapshot, fn as ReplyMediaAttachment, pn as ReplyPayload, wn as ChannelProgressDraftCompositorParams } from "./reply-payload-DazZPys5.js";
import { n as RuntimeEnv } from "./runtime-DlqUc5_p.js";
import "./deliver-08FDWQV8.js";
import { t as StreamingCompatEntry } from "./streaming-config-readers-DwDctXfx.js";
import { Ai as ChannelIngressQueuePruneOptions, Au as AgentItemEventData, Fi as DurableMessageSendContext, Ii as DurableMessageSendContextParams, Ja as ChannelDeliveryResult, Oi as ChannelIngressQueueCompletedRecord, Pi as DurableMessageBatchSendResult, Ti as ChannelIngressQueue, ji as ChannelIngressQueueRecord } from "./agent-harness-runtime-DZjstJNb.js";
import { r as ChannelAccountSnapshot } from "./types.core-Bra2QBA5.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult, _ as DurableFinalDeliveryRequirementMap, a as ChannelMessageLiveCapability, b as LivePreviewFinalizerCapability, c as ChannelMessageSendMediaContext, f as ChannelMessageSendTextContext, g as DurableFinalDeliveryCapability, h as DeriveDurableFinalDeliveryRequirementsParams, i as ChannelMessageLiveAdapterShape, l as ChannelMessageSendPayloadContext, n as ChannelMessageAdapterShape, o as ChannelMessageReceiveAckPolicy, s as ChannelMessageReceiveAdapterShape, t as ChannelMessageAdapter, u as ChannelMessageSendPollContext, y as LiveMessageState } from "./types-DemD-QhX.js";
import { t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
import "./outbound.types-B8D3jrzb.js";
import { i as ReplyPayload$1 } from "./reply-payload-OW17IyAQ.js";
import { o as durable_delivery_d_exports } from "./receipt-D19RX4vZ.js";
import "./ingress-monitor-BMJTOjfO.js";
import "./runtime-forwarders-CPhS-1j-.js";
//#region src/channels/message/outbound-echo.d.ts
type OutboundMessageIdentityScope = {
  channel: string;
  accountId?: string;
  conversationId: string;
};
type OutboundMessageIdentity = OutboundMessageIdentityScope & ({
  messageId: string;
  sourceId?: string;
} | {
  messageId?: string;
  sourceId: string;
});
/** Records a platform message id emitted by a channel's own outbound send path. */
declare function recordOutboundMessageIdentity(identity: OutboundMessageIdentity): void;
/** Returns whether an inbound platform message matches a recently emitted outbound id. */
declare function isRecentOutboundMessageIdentity(identity: OutboundMessageIdentity): boolean;
//#endregion
//#region src/channels/message/ingress-errors.d.ts
/** Named ingress error factory shared by channel payload and admission failures. */
type ChannelIngressErrorClass<TError extends Error, TArgs extends unknown[]> = {
  new (...args: TArgs): TError;
  readonly name: string;
  readonly prototype: TError;
};
declare function createChannelIngressError(name: string): ChannelIngressErrorClass<Error, [message: string, options?: ErrorOptions]>;
declare function createChannelIngressError<TReason extends string>(name: string, options: {
  withReason: true;
}): ChannelIngressErrorClass<Error & {
  readonly reason: TReason;
}, [reason: TReason, message: string, errorOptions?: ErrorOptions]>;
//#endregion
//#region src/channels/message/ingress-claim-owner.d.ts
declare const INGRESS_CLAIM_PROCESS_ID: string;
declare function processPidFromOwnerId(ownerId: string): number;
//#endregion
//#region src/channels/typing-lifecycle.d.ts
type AsyncTick = () => Promise<void> | void;
type TypingKeepaliveLoop = {
  tick: () => Promise<void>;
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
};
/** Creates a cancellable keepalive loop for channel typing indicators. */
declare function createTypingKeepaliveLoop(params: {
  intervalMs: number;
  onTick: AsyncTick;
}): TypingKeepaliveLoop;
//#endregion
//#region src/channels/draft-stream-loop.d.ts
/** Throttled draft-stream sender used by channels that edit in-progress replies. */
type DraftStreamLoop<T = string> = {
  update: (value: T) => void;
  flush: () => Promise<void>;
  stop: () => void;
  resetPending: () => void;
  resetThrottleWindow: () => void;
  waitForInFlight: () => Promise<void>;
  /** Removes queued (not in-flight) text atomically and cancels its scheduled flush. */
  takePending?: () => T;
};
type CreatedDraftStreamLoop<T> = DraftStreamLoop<T> & {
  takePending: () => T;
};
declare function createDraftStreamLoop<T = string>(params: {
  throttleMs: number;
  /** Keep background updates arriving during a send in the next throttle window. */
  coalesceInFlight?: boolean;
  isStopped: () => boolean;
  sendOrEditStreamMessage: (value: T) => Promise<void | boolean>;
  /** Empty sentinel and predicate for non-string payloads. */
  emptyValue?: T;
  isEmpty?: (value: T) => boolean;
  onBackgroundFlushError?: (err: unknown) => void;
}): CreatedDraftStreamLoop<T>;
//#endregion
//#region src/channels/draft-stream-controls.d.ts
type FinalizableDraftStreamState = {
  stopped: boolean;
  final: boolean;
};
type StopAndClearMessageIdParams<T> = {
  stopForClear: () => Promise<void>;
  readMessageId: () => T | undefined;
  clearMessageId: () => void;
};
type ClearFinalizableDraftMessageParams<T> = StopAndClearMessageIdParams<T> & {
  isValidMessageId: (value: unknown) => value is T;
  deleteMessage: (messageId: T) => Promise<boolean | void>;
  onDeleteFailure?: (messageId: T) => void;
  onDeleteSuccess?: (messageId: T) => void;
  warn?: (message: string) => void;
  warnPrefix: string;
};
type DraftStreamOptions<T> = Omit<Parameters<typeof createDraftStreamLoop<T>>[0], "isStopped" | "onBackgroundFlushError">;
type FinalizableDraftLifecycleParams<TMessageId, TUpdate = string> = Omit<ClearFinalizableDraftMessageParams<TMessageId>, "onDeleteFailure" | "stopForClear"> & DraftStreamOptions<TUpdate> & {
  state: FinalizableDraftStreamState;
};
/**
 * Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
 */
declare function createFinalizableDraftStreamControls<T = string>(params: DraftStreamOptions<T> & {
  isStopped: () => boolean;
  isFinal: () => boolean;
  markStopped: () => void;
  markFinal: () => void;
}): {
  loop: DraftStreamLoop<T> & {
    takePending: () => T;
  };
  update: (value: T) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
declare function createFinalizableDraftStreamControlsForState<T = string>(params: DraftStreamOptions<T> & {
  state: FinalizableDraftStreamState;
}): {
  loop: DraftStreamLoop<T> & {
    takePending: () => T;
  };
  update: (value: T) => void;
  stop: () => Promise<void>;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
};
declare function takeMessageIdAfterStop<T>(params: StopAndClearMessageIdParams<T>): Promise<T | undefined>;
/**
 * Stops a draft stream and deletes its preview message when the stored id is valid.
 * Claims the current id before deletion; stateful callers can retain failures through
 * onDeleteFailure without making overlapping clears delete the same message twice.
 */
declare function clearFinalizableDraftMessage<T>(params: ClearFinalizableDraftMessageParams<T>): Promise<void>;
declare function createFinalizableDraftLifecycle<TMessageId, TUpdate = string>(params: FinalizableDraftLifecycleParams<TMessageId, TUpdate>): {
  loop: DraftStreamLoop<TUpdate> & {
    takePending: () => TUpdate;
  };
  update: (value: TUpdate) => void;
  seal: () => Promise<void>;
  discardPending: () => Promise<void>;
  stopForClear: () => Promise<void>;
  generation: number;
  reset: (mode?: "preserve" | "discard", throttle?: "reset" | "keep") => void;
  resetMessage: (throttle?: "reset" | "keep") => void;
  createMessage: (send: () => Promise<TMessageId | undefined>, publish: (messageId: TMessageId | undefined) => boolean, retirementOptions?: {
    defer?: boolean;
  }) => Promise<boolean>;
  retireCurrent: (stopForClear: () => Promise<void>) => Promise<void>;
  stop: () => Promise<void>;
  clear: () => Promise<void>;
  clearWithStop: (stopForClear: () => Promise<void>, messageIdOwner?: Pick<StopAndClearMessageIdParams<TMessageId>, "readMessageId" | "clearMessageId">) => Promise<void>;
  retire: (messageId: TMessageId, options?: {
    defer?: boolean;
  }) => Promise<void>;
  cleanupPending: (prepareCleanup?: () => void) => Promise<void>;
};
//#endregion
//#region src/channels/run-state-machine.d.ts
type RunStateStatusPatch = {
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
};
/** Status sink used by channel run-state updates. */
type RunStateStatusSink = (patch: RunStateStatusPatch) => void;
type RunStateMachineParams = {
  setStatus?: RunStateStatusSink;
  abortSignal?: AbortSignal;
  heartbeatMs?: number;
  now?: () => number;
};
/** Creates a channel run-state tracker with heartbeat updates while runs are active. */
declare function createRunStateMachine(params: RunStateMachineParams): {
  isActive(): boolean;
  onRunStart(): void;
  onRunEnd(): void;
  deactivate: () => void;
};
//#endregion
//#region src/channels/transport/stall-watchdog.d.ts
type StallWatchdogTimeoutMeta = {
  idleMs: number;
  timeoutMs: number;
};
/** Public control surface for a transport stall watchdog instance. */
type ArmableStallWatchdog = {
  arm: (atMs?: number) => void;
  touch: (atMs?: number) => void;
  disarm: () => void;
  stop: () => void;
  isArmed: () => boolean;
};
/** Creates a watchdog that reports once when an armed transport goes idle. */
declare function createArmableStallWatchdog(params: {
  label: string;
  timeoutMs: number;
  checkIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime?: RuntimeEnv;
  onTimeout: (meta: StallWatchdogTimeoutMeta) => void;
}): ArmableStallWatchdog;
//#endregion
//#region src/channels/draft-streaming-chunking.d.ts
type ChannelDraftStreamingChunking = {
  minChars: number;
  maxChars: number;
  breakPreference: "paragraph" | "newline" | "sentence";
};
declare function resolveChannelDraftStreamingChunking(cfg: OpenClawConfig | undefined, channelId: ChannelId, accountId: string | null | undefined, opts: {
  fallbackLimit: number;
}): ChannelDraftStreamingChunking;
//#endregion
//#region src/plugin-sdk/channel-lifecycle.core.d.ts
type CloseAwareServer = {
  once: (event: "close", listener: () => void) => unknown;
};
type PassiveAccountLifecycleParams<Handle> = {
  abortSignal?: AbortSignal;
  start: () => Promise<Handle>;
  stop?: (handle: Handle) => void | Promise<void>;
  onStop?: () => void | Promise<void>;
};
/** Runtime context passed to queued channel work. */
type ChannelRunQueueTaskContext = {
  /** Signal tied to the channel/account lifecycle that owns the queued work. */
  lifecycleSignal?: AbortSignal;
};
/** Per-key async queue used by channel plugins to serialize account or thread work. */
type ChannelRunQueue = {
  /** Enqueue work under a serialization key such as account id, thread id, or chat id. */
  enqueue: (key: string, task: (context: ChannelRunQueueTaskContext) => Promise<void>) => void;
  /** Stop accepting meaningful work and mark the lifecycle as inactive. */
  deactivate: () => void;
};
/** Hooks used to wire channel queue state into runtime status and error reporting. */
type ChannelRunQueueParams = {
  /** Receives busy/idle lifecycle snapshots from the shared run-state machine. */
  setStatus?: RunStateStatusSink;
  /** Lifecycle signal propagated to queued tasks. */
  abortSignal?: AbortSignal;
  /** Best-effort sink for task failures after enqueueing. */
  onError?: (error: unknown) => void;
};
/** Bind a fixed account id into a status writer so lifecycle code can emit partial snapshots. */
declare function createAccountStatusSink(params: {
  accountId: string;
  setStatus: (next: ChannelAccountSnapshot) => void;
}): (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
/**
 * Serialize channel work per key while keeping lifecycle/busy accounting out of
 * channel-specific message handlers. The queue does not impose run timeouts;
 * callers should rely on session/tool/runtime lifecycle for long-running work.
 */
declare function createChannelRunQueue(params: ChannelRunQueueParams): ChannelRunQueue;
/**
 * Return a promise that resolves when the signal is aborted.
 *
 * If no signal is provided, the promise stays pending forever. When provided,
 * `onAbort` runs once before the promise resolves.
 */
declare function waitUntilAbort(signal?: AbortSignal, onAbort?: () => void | Promise<void>): Promise<void>;
/**
 * Keep a passive account task alive until abort, then run optional cleanup.
 */
declare function runPassiveAccountLifecycle<Handle>(params: PassiveAccountLifecycleParams<Handle>): Promise<void>;
/**
 * Keep a channel/provider task pending until the HTTP server closes.
 *
 * When an abort signal is provided, `onAbort` is invoked once and should
 * trigger server shutdown. The returned promise resolves only after `close`.
 */
declare function keepHttpServerTaskAlive(params: {
  server: CloseAwareServer;
  abortSignal?: AbortSignal;
  onAbort?: () => void | Promise<void>;
}): Promise<void>;
//#endregion
//#region src/infra/outbound/reply-media-entries.d.ts
/** Preserve attachment associations before media URLs are filtered or deduplicated. */
declare function collectReplyMediaEntries(payload: Pick<ReplyPayload, "mediaUrls" | "mediaUrl" | "attachments">, projectedMediaUrls?: readonly string[]): Array<{
  url: string;
  attachment: ReplyMediaAttachment | undefined;
  sourceUrls?: readonly string[];
}>;
//#endregion
//#region src/infra/outbound/sanitize-text.d.ts
/**
 * Convert common HTML tags to their plain-text/lightweight-markup equivalents
 * and strip anything that remains.
 *
 * The function is intentionally conservative — it only targets tags that models
 * are known to produce and avoids false positives on angle brackets in normal
 * prose (e.g. `a < b`), in fenced blocks, and in inline code spans.
 */
declare function sanitizeForPlainText(text: string, options?: {
  style?: "markdown";
}): string;
//#endregion
//#region src/channels/progress-work-counter.d.ts
/**
 * Per-turn work counters for live channel progress surfaces. These describe the
 * turn while it runs; nothing here survives into the finished transcript.
 */
declare function createChannelProgressWorkCounter(params?: {
  now?: () => number;
}): {
  noteItem(item: Partial<Pick<AgentItemEventData, "kind" | "hideFromChannelProgress" | "suppressChannelProgress">> & {
    phase?: string;
  }): void;
  noteToolCall(toolName?: string): void;
  reset(): void;
  readonly toolCalls: number;
  readonly elapsedSeconds: number;
};
//#endregion
//#region src/channels/progress-draft-compositor.d.ts
declare function createChannelProgressDraftCompositor(params: ChannelProgressDraftCompositorParams): {
  pushToolEvent: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
  } & {
    detailMode?: "explain" | "raw";
  }) => Promise<boolean>;
  pushCommandOutputEvent: (payload: {
    itemId?: string;
    toolCallId?: string;
    phase?: string;
    title?: string;
    name?: string;
    status?: string;
    exitCode?: number | null;
  }) => Promise<boolean>;
  pushPatchEvent: (payload: {
    itemId?: string;
    toolCallId?: string;
    phase?: string;
    title?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
  }) => Promise<boolean>;
  previewToolProgressEnabled: boolean;
  commentaryProgressEnabled: boolean;
  suppressDefaultToolProgressMessages: boolean;
  hasStarted: boolean;
  isVisible: boolean;
  hasStatusHeadline: boolean;
  hasPlanProgress: boolean;
  getSnapshot: () => ChannelProgressDraftCompositorSnapshot;
  getText: () => string;
  markFinalReplyStarted(): void;
  markFinalReplyDelivered(): void;
  beginNewTurn(options?: {
    force?: boolean;
  }): boolean;
  reset(): void;
  resetActivity(options?: {
    suppressed?: boolean;
  }): void;
  beginAssistantMessage(): void;
  resetReasoningProgress(this: void): void;
  mergeReasoningProgress: (this: void, text?: string, options?: {
    snapshot?: boolean;
  }) => string;
  suppress(): void;
  cancel(): void;
  start(): Promise<void>;
  noteActivity(options?: {
    startImmediately?: boolean;
  }): Promise<boolean>;
  pushToolProgress: (inputLine?: ChannelProgressDraftCompositorLine, options?: {
    toolName?: string;
    startImmediately?: boolean;
    flush?: boolean;
  }) => Promise<boolean>;
  pushItemEvent: (payload: Parameters<(payload: Omit<{
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
  }, "itemKind"> & {
    kind?: string;
  }) => Promise<boolean>>[0]) => Promise<boolean>;
  pushApprovalEvent(payload: Parameters<(payload: {
    approvalId?: string;
    phase?: string;
    title?: string;
    command?: string;
    reason?: string;
    message?: string;
  }) => Promise<boolean>>[0]): Promise<boolean>;
  pushPlanProgress(steps?: AgentPlanStep[], options?: {
    explanation?: string;
    explanationFormat?: "plain";
  }): Promise<boolean>;
  pushPreambleHeadline(text?: string, options?: {
    itemId?: string;
  }): Promise<boolean>;
  pushNarrationProgress(text?: string): Promise<boolean>;
  pushReasoningProgress(text?: string, options?: {
    snapshot?: boolean;
  }): Promise<boolean>;
  pushCommentaryProgress(text?: string, options?: {
    itemId?: string;
    complete?: boolean;
  }): Promise<boolean>;
};
//#endregion
//#region src/channels/message/capabilities.d.ts
/** Derives the adapter capabilities core needs before it can require durable final delivery. */
declare function deriveDurableFinalDeliveryRequirements(params: DeriveDurableFinalDeliveryRequirementsParams): DurableFinalDeliveryRequirementMap;
//#endregion
//#region src/channels/message/adapter.d.ts
declare const defaultManualReceiveAdapter: {
  readonly defaultAckPolicy: "manual";
  readonly supportedAckPolicies: readonly ["manual"];
};
type ChannelMessageAdapterWithDefaultReceive<TAdapter extends ChannelMessageAdapterShape> = TAdapter & {
  receive: TAdapter["receive"] extends undefined ? typeof defaultManualReceiveAdapter : NonNullable<TAdapter["receive"]>;
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
declare function defineChannelMessageAdapter<const TAdapter extends ChannelMessageAdapterShape>(adapter: TAdapter): ChannelMessageAdapter<ChannelMessageAdapterWithDefaultReceive<TAdapter>>;
//#endregion
//#region src/channels/message/outbound-bridge.d.ts
/** Send result accepted from legacy outbound bridge methods before receipt normalization. */
type ChannelMessageOutboundBridgeResult = MessageReceiptSourceResult & {
  receipt?: MessageReceipt;
  messageId?: string;
};
type ChannelMessageOutboundBridgeContext<TContext> = Omit<TContext, "onDeliveryResult"> & {
  onDeliveryResult?: (result: ChannelMessageOutboundBridgeResult) => Promise<void> | void;
};
/** Legacy outbound adapter shape bridged into the channel message adapter contract. */
type ChannelMessageOutboundBridgeAdapter<TConfig = unknown> = {
  deliveryCapabilities?: {
    durableFinal?: DurableFinalDeliveryRequirementMap;
  };
  sendText?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendTextContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendMedia?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendMediaContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPayload?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendPayloadContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPoll?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendPollContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
};
/** Options for building a message adapter from legacy outbound send functions. */
type CreateChannelMessageAdapterFromOutboundParams<TConfig = unknown> = {
  id?: string;
  outbound: ChannelMessageOutboundBridgeAdapter<TConfig>;
  capabilities?: DurableFinalDeliveryRequirementMap;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};
/** Converts legacy outbound send methods into a typed channel message adapter. */
declare function createChannelMessageAdapterFromOutbound<TConfig = unknown>(params: CreateChannelMessageAdapterFromOutboundParams<TConfig>): ChannelMessageAdapterShape<TConfig>;
//#endregion
//#region src/channels/message/durable-receive.d.ts
/** Pending inbound receive record kept until agent dispatch or durable send completes. */
type DurableInboundReceivePendingRecord<TPayload, TMetadata = unknown> = Omit<ChannelIngressQueueRecord<TPayload, TMetadata>, "channelId" | "accountId" | "queueName" | "laneKey">;
/** Accept result for a new or duplicate inbound platform event. */
type DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata> = {
  kind: "accepted";
  duplicate: false;
  record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
  kind: "pending";
  duplicate: true;
  record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
  kind: "completed";
  duplicate: true;
  record: Pick<ChannelIngressQueueCompletedRecord<TCompletedMetadata>, "id" | "completedAt" | "metadata">;
};
/** Durable receive journal facade used by channel receive pipelines. */
type DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata> = {
  accept(id: string, payload: TPayload, options?: {
    metadata?: TMetadata;
    receivedAt?: number;
  }): Promise<DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata>>;
  pending(): Promise<Array<DurableInboundReceivePendingRecord<TPayload, TMetadata>>>;
  complete(id: string, options?: {
    metadata?: TCompletedMetadata;
    completedAt?: number;
  }): Promise<void>;
  release(id: string, options?: {
    lastError?: string;
    releasedAt?: number;
  }): Promise<boolean>;
  deletePending(id: string): Promise<boolean>;
};
/** Adapts the shared channel ingress queue to the durable receive journal API. */
declare function createDurableInboundReceiveJournalFromQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: {
  queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  retention?: ChannelIngressQueuePruneOptions;
}): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
//#endregion
//#region src/channels/message/contracts.d.ts
type ContractProofs<TKey extends string> = Partial<Record<TKey, () => Promise<void> | void>>;
type ProofStatus = "verified" | "not_declared";
type CapabilityProofResult<TKey extends string> = {
  capability: TKey;
  status: ProofStatus;
};
declare function verifyDurableFinalCapabilityProofs(params: {
  adapterName: string;
  capabilities?: DurableFinalDeliveryRequirementMap;
  proofs: ContractProofs<DurableFinalDeliveryCapability>;
}): Promise<CapabilityProofResult<DurableFinalDeliveryCapability>[]>;
declare function verifyChannelMessageAdapterCapabilityProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "durableFinal">;
  proofs: ContractProofs<DurableFinalDeliveryCapability>;
}): Promise<CapabilityProofResult<DurableFinalDeliveryCapability>[]>;
declare function verifyChannelMessageReceiveAckPolicyAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "receive">;
  proofs: ContractProofs<ChannelMessageReceiveAckPolicy>;
}): Promise<{
  policy: ChannelMessageReceiveAckPolicy;
  status: ProofStatus;
}[]>;
declare function verifyChannelMessageLiveFinalizerProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: ContractProofs<LivePreviewFinalizerCapability>;
}): Promise<CapabilityProofResult<LivePreviewFinalizerCapability>[]>;
declare function verifyChannelMessageLiveCapabilityAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: ContractProofs<ChannelMessageLiveCapability>;
}): Promise<CapabilityProofResult<ChannelMessageLiveCapability>[]>;
//#endregion
//#region src/channels/message/live.d.ts
/** A transport-owned preview. discardPending must stop new work before awaiting in-flight work. */
type LivePreviewFinalizerDraft<TId> = {
  flush: () => Promise<void>;
  id: () => TId | undefined;
  seal?: () => Promise<void>;
  discardPending?: () => Promise<void>;
  clear: () => Promise<void>;
};
type LivePreviewDraft<TId> = Omit<LivePreviewFinalizerDraft<TId>, "clear"> & {
  clear: () => Promise<boolean | void>;
};
type LivePreviewDeliveryResult = ChannelDeliveryResult & {
  visibleReplySent: boolean;
};
type PreviewSendResult = LivePreviewDeliveryResult | boolean | void;
type LivePreviewFinalizerResultKind = "normal-delivered" | "normal-skipped" | "preview-finalized" | "preview-retained";
type LivePreviewFinalizerResult<TPayload> = {
  kind: LivePreviewFinalizerResultKind;
  liveState?: LiveMessageState<TPayload>;
  deliveryResult?: LivePreviewDeliveryResult;
};
type PublishedPreviewAdapter<TPayload, TId, TEdit> = {
  draft?: LivePreviewFinalizerDraft<TId>;
  buildFinalEdit: (payload: TPayload) => TEdit | undefined;
  editFinal: (id: TId, edit: TEdit) => Promise<void>;
  resolveFinalizedId?: (id: TId, edit: TEdit) => TId | undefined;
  createPreviewReceipt?: (id: TId, edit: TEdit) => MessageReceipt;
  onPreviewFinalized?: (id: TId, receipt: MessageReceipt, liveState: LiveMessageState<TPayload>) => Promise<void> | void;
  buildSupplementalPayload?: (payload: TPayload) => TPayload | undefined;
  deliverSupplemental?: (payload: TPayload) => Promise<boolean | void>;
  handlePreviewEditError?: (params: {
    error: unknown;
    id: TId;
    edit: TEdit;
    payload: TPayload;
    liveState: LiveMessageState<TPayload>;
  }) => "fallback" | "retain" | Promise<"fallback" | "retain">;
  logPreviewEditFailure?: (error: unknown) => void;
};
type FinalizableLivePreviewAdapter<TPayload, TId, TEdit> = Omit<PublishedPreviewAdapter<TPayload, TId, TEdit>, "draft" | "buildFinalEdit" | "editFinal" | "deliverSupplemental"> & {
  draft?: LivePreviewDraft<TId>;
  buildFinalEdit?: (payload: TPayload) => TEdit | undefined;
  editFinal?: (id: TId, edit: TEdit) => Promise<void | LivePreviewDeliveryResult>;
  deliverSupplemental?: (payload: TPayload) => Promise<PreviewSendResult>;
};
declare function defineFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(adapter: PublishedPreviewAdapter<TPayload, TId, TEdit>): PublishedPreviewAdapter<TPayload, TId, TEdit>;
declare function createPreviewMessageReceipt(params: {
  id: unknown;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
  raw?: unknown;
}): MessageReceipt;
/** Published adapter contract; shares the stateful owner's delivery implementation. */
declare function deliverWithFinalizableLivePreviewAdapter<TPayload, TId, TEdit>(params: {
  kind: "tool" | "block" | "final";
  payload: TPayload;
  liveState?: LiveMessageState<TPayload>;
  adapter?: PublishedPreviewAdapter<TPayload, TId, TEdit>;
  deliverNormally: (payload: TPayload) => Promise<boolean | void>;
  onNormalDelivered?: () => Promise<void> | void;
}): Promise<LivePreviewFinalizerResult<TPayload>>;
type LivePreviewLifecycle<TPayload, TId> = {
  readonly previewFinalized: boolean;
  readonly finalDelivered: boolean;
  readonly finalSucceeded: boolean;
  readonly finalFailed: boolean;
  readonly finalStarted: boolean;
  readonly finalSuppressed: boolean;
  beginFinalDelivery: () => void;
  deliver<TEdit = never>(params: {
    kind: "tool" | "block" | "final";
    payload: TPayload;
    isError?: boolean;
    adapter?: Omit<FinalizableLivePreviewAdapter<TPayload, TId, TEdit>, "draft">;
    deliverNormally: (payload: TPayload) => Promise<LivePreviewDeliveryResult>;
    onNormalDelivered?: () => Promise<void> | void;
  }): Promise<LivePreviewFinalizerResult<TPayload>>;
  observeDelivery: (result: LivePreviewDeliveryResult, options?: {
    isError?: boolean;
  }) => Promise<void>;
  observeFailure: (result?: LivePreviewDeliveryResult) => void;
  observeSuppression: () => void;
  cleanup: (options?: {
    failed?: boolean;
  }) => Promise<void>;
  retainPreview: () => void;
  reset: () => void;
};
/** Owns one admitted turn's final facts and preview custody, not provider wire semantics. */
declare function createLivePreviewLifecycle<TPayload, TId>(options?: {
  draft?: LivePreviewDraft<TId>;
  retainOnError?: boolean;
  cleanupUndelivered?: boolean;
  onFinalStarted?: () => void;
  onFinalDelivered?: () => void;
  onCleanupFailure?: (error: unknown) => void;
}): LivePreviewLifecycle<TPayload, TId>;
//#endregion
//#region src/channels/message/receive.d.ts
type MessageAckPolicy = ChannelMessageReceiveAckPolicy;
type MessageAckStage = "receive_record" | "agent_dispatch" | "durable_send" | "manual";
type MessageAckState = "pending" | "acked" | "nacked";
/** Mutable receive context passed through durable inbound message processing. */
type MessageReceiveContext<TMessage = unknown> = {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy: MessageAckPolicy;
  ackState: MessageAckState;
  ackedAt?: number;
  nackErrorMessage?: string;
  receivedAt: number;
  signal: AbortSignal;
  shouldAckAfter(stage: MessageAckStage): boolean;
  ack(): Promise<void>;
  nack(error: unknown): Promise<void>;
};
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
declare function createMessageReceiveContext<TMessage>(params: {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy?: MessageAckPolicy;
  receivedAt?: number;
  signal?: AbortSignal;
  onAck?: () => Promise<void> | void;
  onNack?: (error: unknown) => Promise<void> | void;
}): MessageReceiveContext<TMessage>;
//#endregion
//#region src/channels/streaming-final-text.d.ts
declare function isPotentialTruncatedFinal(finalText: string): boolean;
declare function selectLongerFinalText(params: {
  finalText: string;
  candidateTexts: readonly (string | undefined)[];
}): string | undefined;
declare function resolveTranscriptBackedChannelFinalText(params: {
  payload?: ReplyPayload;
  finalText: string;
  resolveCandidateText: () => Promise<string | undefined>;
}): Promise<string>;
//#endregion
//#region src/plugin-sdk/channel-outbound.d.ts
type ChannelDurableDeliveryModule = typeof durable_delivery_d_exports;
/** Keep the current operation media selection when recovering other reply fields. */
declare function preserveReplyPayloadMediaSelection(source: ReplyPayload$1, recovered: ReplyPayload$1): ReplyPayload$1;
/** @deprecated The streaming.progress.render key was retired (#122927). */
type ChannelProgressDraftRenderMode = "rich" | "text";
/**
 * @deprecated Load-only bridge: the published Slack channel package
 * (2026.7.2-beta.7 and earlier) imports this at module top level, so removing
 * it makes the installed plugin fail to load after a core upgrade. The config
 * key it read is retired and doctor strips it, so this resolves the same
 * "text"/"rich" answer pre-doctor configs produced and the default otherwise.
 * Remove once managed releases have replaced the old npm latest/extended-stable
 * packages and their upgrade window has closed.
 */
declare function resolveChannelProgressDraftRender(entry: StreamingCompatEntry | null | undefined, defaultValue?: ChannelProgressDraftRenderMode): ChannelProgressDraftRenderMode;
/** Lazily forwards inbound reply delivery through the channel turn durable-delivery module. */
declare const deliverInboundReplyWithMessageSendContext: ChannelDurableDeliveryModule["deliverInboundReplyWithMessageSendContextCore"];
/** Delivers a producer's prepared plan without reparsing literal text. */
declare const deliverStructuredInboundReplyWithMessageSendContext: ChannelDurableDeliveryModule["deliverStructuredInboundReplyWithMessageSendContextCore"];
/** Sends a durable message batch without eager-loading channel message runtime internals. */
declare function sendDurableMessageBatch(
/**
 * Durable send context and outbound batch data forwarded to the channel runtime.
 */
params: DurableMessageSendContextParams): Promise<DurableMessageBatchSendResult>;
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
declare function withDurableMessageSendContext<T>(
/**
 * Durable send context used to bind sends, receipts, and lifecycle callbacks.
 */
params: DurableMessageSendContextParams,
/**
 * Callback executed with the loaded durable-send runtime context.
 */
run: (ctx: DurableMessageSendContext) => Promise<T>): Promise<T>;
//#endregion
export { DraftStreamLoop as $, createChannelProgressWorkCounter as A, waitUntilAbort as B, verifyChannelMessageReceiveAckPolicyAdapterProofs as C, defineChannelMessageAdapter as D, createChannelMessageAdapterFromOutbound as E, ChannelRunQueueTaskContext as F, createArmableStallWatchdog as G, resolveChannelDraftStreamingChunking as H, createAccountStatusSink as I, clearFinalizableDraftMessage as J, createRunStateMachine as K, createChannelRunQueue as L, collectReplyMediaEntries as M, ChannelRunQueue as N, deriveDurableFinalDeliveryRequirements as O, ChannelRunQueueParams as P, takeMessageIdAfterStop as Q, keepHttpServerTaskAlive as R, verifyChannelMessageLiveFinalizerProofs as S, createDurableInboundReceiveJournalFromQueue as T, ArmableStallWatchdog as U, ChannelDraftStreamingChunking as V, StallWatchdogTimeoutMeta as W, createFinalizableDraftStreamControls as X, createFinalizableDraftLifecycle as Y, createFinalizableDraftStreamControlsForState as Z, createPreviewMessageReceipt as _, resolveChannelProgressDraftRender as a, OutboundMessageIdentity as at, verifyChannelMessageAdapterCapabilityProofs as b, isPotentialTruncatedFinal as c, MessageAckPolicy as d, createDraftStreamLoop as et, MessageReceiveContext as f, createLivePreviewLifecycle as g, LivePreviewLifecycle as h, preserveReplyPayloadMediaSelection as i, createChannelIngressError as it, sanitizeForPlainText as j, createChannelProgressDraftCompositor as k, resolveTranscriptBackedChannelFinalText as l, LivePreviewDeliveryResult as m, deliverInboundReplyWithMessageSendContext as n, INGRESS_CLAIM_PROCESS_ID as nt, sendDurableMessageBatch as o, isRecentOutboundMessageIdentity as ot, createMessageReceiveContext as p, FinalizableDraftStreamState as q, deliverStructuredInboundReplyWithMessageSendContext as r, processPidFromOwnerId as rt, withDurableMessageSendContext as s, recordOutboundMessageIdentity as st, ChannelProgressDraftRenderMode as t, createTypingKeepaliveLoop as tt, selectLongerFinalText as u, defineFinalizableLivePreviewAdapter as v, verifyDurableFinalCapabilityProofs as w, verifyChannelMessageLiveCapabilityAdapterProofs as x, deliverWithFinalizableLivePreviewAdapter as y, runPassiveAccountLifecycle as z };