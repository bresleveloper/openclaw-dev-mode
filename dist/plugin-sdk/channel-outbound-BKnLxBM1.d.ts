import { R as StreamingMode, T as ReplyToMode } from "./types.base-DmKdGokm.js";
import { d as ReplyPayload } from "./types-DNy-f8Hr.js";
import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { A as LiveMessageState, C as DeriveDurableFinalDeliveryRequirementsParams, E as DurableFinalDeliveryRequirementMap, I as MessageReceiptPartKind, L as MessageReceiptSourceResult, M as LivePreviewFinalizerCapabilityMap, N as MessageDurabilityPolicy, O as DurableMessageSendIntent, P as MessageReceipt, R as MessageSendContext, _ as ChannelMessageSendPollContext, a as ChannelMessageLiveCapability, b as ChannelMessageSendTextContext, c as ChannelMessageReceiveAdapterShape, g as ChannelMessageSendPayloadContext, h as ChannelMessageSendMediaContext, i as ChannelMessageLiveAdapterShape, j as LivePreviewFinalizerCapability, n as ChannelMessageAdapterShape, s as ChannelMessageReceiveAckPolicy, t as ChannelMessageAdapter, w as DurableFinalDeliveryCapability, z as RenderedMessageBatch } from "./types-DBaup9wG.js";
import { S as OutboundPayloadDeliverySuppressionReason, b as OutboundDeliveryResult } from "./outbound.types-B8rjITVv.js";
import { Cl as ChannelIngressQueuePruneOptions, _l as ChannelIngressQueue, nr as kernel_d_exports } from "./types-CXLy55Xw.js";
import { r as PluginStateKeyedStore } from "./plugin-state-store.types-Bm0_upwK.js";
import { i as OutboundDeliveryIntent, t as DeliverOutboundPayloadsParams } from "./deliver-BvKw5JrY.js";
import { c as StreamingCompatEntry, t as ChannelProgressDraftLine } from "./streaming-Ds8CY766.js";

//#region src/channels/message/send.d.ts
type DurableMessageBatchSendParams = Omit<DeliverOutboundPayloadsParams, "abortSignal" | "onDeliveryIntent" | "payloads" | "queuePolicy"> & {
  payloads: ReplyPayload[];
  attempt?: number;
  signal?: AbortSignal; /** @deprecated Use `signal`. */
  abortSignal?: AbortSignal;
  previousReceipt?: MessageReceipt;
};
type DurableMessageSuppressionReason = OutboundPayloadDeliverySuppressionReason | "no_visible_result";
type DurableMessageFailureStage = "platform_send" | "queue" | "unknown";
type DurableMessagePayloadDeliveryOutcome = {
  index: number;
  status: "sent";
  results: OutboundDeliveryResult[];
} | {
  index: number;
  status: "suppressed";
  reason: DurableMessageSuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
} | {
  index: number;
  status: "failed";
  error: unknown;
  sentBeforeError: boolean;
  stage: DurableMessageFailureStage;
};
type DurableMessageBatchSendResult = {
  status: "sent";
  results: OutboundDeliveryResult[];
  receipt: MessageReceipt;
  deliveryIntent?: OutboundDeliveryIntent;
  payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
} | {
  status: "suppressed";
  results: [];
  receipt: MessageReceipt;
  deliveryIntent?: OutboundDeliveryIntent;
  reason: DurableMessageSuppressionReason;
  payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
} | {
  status: "partial_failed";
  results: OutboundDeliveryResult[];
  receipt: MessageReceipt;
  error: unknown;
  sentBeforeError: true;
  deliveryIntent?: OutboundDeliveryIntent;
  payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
} | {
  status: "failed";
  error: unknown;
  stage?: DurableMessageFailureStage;
  payloadOutcomes?: DurableMessagePayloadDeliveryOutcome[];
};
type DurableMessageSendContextParams = DurableMessageBatchSendParams & {
  durability?: Exclude<MessageDurabilityPolicy, "disabled">; /** Runs after the durable queue intent exists and before platform delivery starts. */
  onDeliveryIntent?: (intent: DurableMessageSendIntent) => void;
  preview?: LiveMessageState<ReplyPayload>;
  onPreviewUpdate?: (rendered: RenderedMessageBatch<ReplyPayload>, state: LiveMessageState<ReplyPayload>) => Promise<LiveMessageState<ReplyPayload>> | LiveMessageState<ReplyPayload>;
  onEditReceipt?: (receipt: MessageReceipt, rendered: RenderedMessageBatch<ReplyPayload>) => Promise<MessageReceipt> | MessageReceipt;
  onDeleteReceipt?: (receipt: MessageReceipt) => Promise<void> | void;
  onCommitReceipt?: (receipt: MessageReceipt) => Promise<void> | void;
  onSendFailure?: (error: unknown) => Promise<void> | void;
};
type DurableMessageSendContext = MessageSendContext<ReplyPayload, DurableMessageBatchSendResult>;
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
/** Legacy outbound adapter shape bridged into the channel message adapter contract. */
type ChannelMessageOutboundBridgeAdapter<TConfig = unknown> = {
  deliveryCapabilities?: {
    durableFinal?: DurableFinalDeliveryRequirementMap;
  };
  sendText?: (ctx: ChannelMessageSendTextContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendMedia?: (ctx: ChannelMessageSendMediaContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPayload?: (ctx: ChannelMessageSendPayloadContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPoll?: (ctx: ChannelMessageSendPollContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
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
type DurableInboundReceivePendingRecord<TPayload, TMetadata = unknown> = {
  id: string;
  payload: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  attempts: number;
  lastAttemptAt?: number;
  lastError?: string;
};
/** Completed inbound receive tombstone used to detect duplicate platform events. */
type DurableInboundReceiveCompletedRecord<TMetadata = unknown> = {
  id: string;
  completedAt: number;
  metadata?: TMetadata;
};
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
  record: DurableInboundReceiveCompletedRecord<TCompletedMetadata>;
};
/** Store-backed durable receive journal options. */
type DurableInboundReceiveJournalOptions<TPayload, TMetadata, TCompletedMetadata> = {
  pendingStore: PluginStateKeyedStore<DurableInboundReceivePendingRecord<TPayload, TMetadata>>;
  completedStore: PluginStateKeyedStore<DurableInboundReceiveCompletedRecord<TCompletedMetadata>>;
  now?: () => number;
  pendingTtlMs?: number;
  completedTtlMs?: number;
};
/** Options recorded when accepting a pending inbound event. */
type DurableInboundReceiveAcceptOptions<TMetadata> = {
  metadata?: TMetadata;
  receivedAt?: number;
};
/** Options recorded when marking an inbound event complete. */
type DurableInboundReceiveCompleteOptions<TCompletedMetadata> = {
  metadata?: TCompletedMetadata;
  completedAt?: number;
};
/** Options recorded when releasing an inbound event for retry. */
type DurableInboundReceiveReleaseOptions = {
  lastError?: string;
  releasedAt?: number;
};
/** Durable receive journal facade used by channel receive pipelines. */
type DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata> = {
  accept(id: string, payload: TPayload, options?: DurableInboundReceiveAcceptOptions<TMetadata>): Promise<DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata>>;
  pending(): Promise<Array<DurableInboundReceivePendingRecord<TPayload, TMetadata>>>;
  complete(id: string, options?: DurableInboundReceiveCompleteOptions<TCompletedMetadata>): Promise<void>;
  release(id: string, options?: DurableInboundReceiveReleaseOptions): Promise<boolean>;
  deletePending(id: string): Promise<boolean>;
};
/** Queue-backed durable receive journal options with optional retention pruning. */
type DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata> = {
  queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  retention?: ChannelIngressQueuePruneOptions;
};
/** Creates a store-backed journal for accepting, completing, and retrying inbound events. */
declare function createDurableInboundReceiveJournal<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
/** Adapts the shared channel ingress queue to the durable receive journal API. */
declare function createDurableInboundReceiveJournalFromQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
//#endregion
//#region src/channels/message/contracts.d.ts
/**
 * Proof callback used to verify one declared durable-final delivery capability.
 */
type DurableFinalCapabilityProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by durable-final delivery capability.
 */
type DurableFinalCapabilityProofMap = Partial<Record<DurableFinalDeliveryCapability, DurableFinalCapabilityProof>>;
/**
 * Verification result for one durable-final delivery capability.
 */
type DurableFinalCapabilityProofResult = {
  capability: DurableFinalDeliveryCapability;
  status: "verified" | "not_declared";
};
/**
 * Proof callback used to verify one live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one live message capability.
 */
type ChannelMessageLiveCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProofMap = Partial<Record<LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityProof>>;
/**
 * Proof callbacks keyed by live message capability.
 */
type ChannelMessageLiveCapabilityProofMap = Partial<Record<ChannelMessageLiveCapability, ChannelMessageLiveCapabilityProof>>;
/**
 * Proof callbacks keyed by receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProofMap = Partial<Record<ChannelMessageReceiveAckPolicy, ChannelMessageReceiveAckPolicyProof>>;
/**
 * Verification result for one live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProofResult = {
  capability: LivePreviewFinalizerCapability;
  status: "verified" | "not_declared";
};
/**
 * Verification result for one live message capability.
 */
type ChannelMessageLiveCapabilityProofResult = {
  capability: ChannelMessageLiveCapability;
  status: "verified" | "not_declared";
};
/**
 * Verification result for one receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProofResult = {
  policy: ChannelMessageReceiveAckPolicy;
  status: "verified" | "not_declared";
};
/**
 * Lists declared durable-final delivery capabilities in stable contract order.
 */
declare function listDeclaredDurableFinalCapabilities(capabilities: DurableFinalDeliveryRequirementMap | undefined): DurableFinalDeliveryCapability[];
/**
 * Lists declared live-preview finalizer capabilities in stable contract order.
 */
declare function listDeclaredLivePreviewFinalizerCapabilities(capabilities: LivePreviewFinalizerCapabilityMap | undefined): LivePreviewFinalizerCapability[];
/**
 * Lists declared live message capabilities in stable contract order.
 */
declare function listDeclaredChannelMessageLiveCapabilities(capabilities: Partial<Record<ChannelMessageLiveCapability, boolean>> | undefined): ChannelMessageLiveCapability[];
/**
 * Lists declared receive acknowledgement policies, including the default policy fallback.
 */
declare function listDeclaredReceiveAckPolicies(receive: ChannelMessageAdapterShape["receive"] | undefined): ChannelMessageReceiveAckPolicy[];
/**
 * Verifies proof callbacks for every declared durable-final delivery capability.
 */
declare function verifyDurableFinalCapabilityProofs(params: {
  adapterName: string;
  capabilities?: DurableFinalDeliveryRequirementMap;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies proof callbacks for every declared live-preview finalizer capability.
 */
declare function verifyLivePreviewFinalizerCapabilityProofs(params: {
  adapterName: string;
  capabilities?: LivePreviewFinalizerCapabilityMap;
  proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]>;
/**
 * Verifies proof callbacks for every declared live message capability.
 */
declare function verifyChannelMessageLiveCapabilityProofs(params: {
  adapterName: string;
  capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
  proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]>;
/**
 * Verifies proof callbacks for every declared receive acknowledgement policy.
 */
declare function verifyChannelMessageReceiveAckPolicyProofs(params: {
  adapterName: string;
  receive?: ChannelMessageAdapterShape["receive"];
  proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]>;
/**
 * Verifies durable-final proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageAdapterCapabilityProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "durableFinal">;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies receive acknowledgement proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageReceiveAckPolicyAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "receive">;
  proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]>;
/**
 * Verifies live-preview finalizer proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageLiveFinalizerProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]>;
/**
 * Verifies live message capability proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageLiveCapabilityAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]>;
//#endregion
//#region src/channels/message/receipt.d.ts
type MessageReceiptInputResult = MessageReceiptSourceResult & {
  receipt?: MessageReceipt;
};
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
declare function createMessageReceiptFromOutboundResults(params: {
  results: readonly MessageReceiptInputResult[];
  kind?: MessageReceiptPartKind;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
}): MessageReceipt;
/** Lists unique platform message ids in receipt order. */
declare function listMessageReceiptPlatformIds(receipt: MessageReceipt): string[];
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
declare function resolveMessageReceiptPrimaryId(receipt: MessageReceipt): string | undefined;
//#endregion
//#region src/channels/message/receive.d.ts
/** Public alias for channel receive acknowledgement policy names. */
type MessageAckPolicy = ChannelMessageReceiveAckPolicy;
/** Processing stage where a durable inbound message may be acknowledged. */
type MessageAckStage = "receive_record" | "agent_dispatch" | "durable_send" | "manual";
/** Current acknowledgement state for one inbound message context. */
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
/** Returns whether an ack policy should acknowledge at the supplied processing stage. */
declare function shouldAckMessageAfterStage(policy: MessageAckPolicy, stage: MessageAckStage): boolean;
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
//#region src/channels/message/state.d.ts
/** Durable send state stored for recovery and operator-visible delivery status. */
type DurableMessageSendState = "pending" | "sent" | "suppressed" | "failed" | "unknown_after_send";
/** Recovery record for one durable outbound message intent. */
type DurableMessageStateRecord = {
  intent: DurableMessageSendIntent;
  state: DurableMessageSendState;
  receipt?: MessageReceipt;
  updatedAt: number;
  errorMessage?: string;
};
/** Creates a durable message recovery record from intent, receipt, and optional error state. */
declare function createDurableMessageStateRecord(params: {
  intent: DurableMessageSendIntent;
  state?: DurableMessageSendState;
  receipt?: MessageReceipt;
  updatedAt?: number;
  error?: unknown;
}): DurableMessageStateRecord;
/** Classifies recovery state from persisted intent/receipt facts after a send interruption. */
declare function classifyDurableSendRecoveryState(params: {
  hasIntent: boolean;
  hasReceipt: boolean;
  platformSendMayHaveStarted: boolean;
  failed?: boolean;
  suppressed?: boolean;
}): DurableMessageSendState;
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
//#region src/channels/progress-draft-compositor.d.ts
type ChannelProgressDraftMode = StreamingMode;
type ChannelProgressDraftCompositor = ReturnType<typeof createChannelProgressDraftCompositor>;
type ChannelProgressDraftCompositorLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftUpdateOptions = {
  flush?: boolean;
  lines?: readonly ChannelProgressDraftCompositorLine[];
};
/** Creates a stateful compositor for one streaming channel reply. */
declare function createChannelProgressDraftCompositor(params: {
  entry: StreamingCompatEntry | null | undefined;
  mode: ChannelProgressDraftMode;
  active: boolean;
  seed: string;
  update: (text: string, options?: ChannelProgressDraftUpdateOptions) => Promise<void> | void;
  deleteCurrent?: () => Promise<void> | void;
  tryNativeUpdate?: (text: string) => Promise<boolean> | boolean;
  formatLine?: (line: string) => string;
  isEmptyLine?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  shouldStartNow?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
}): {
  readonly previewToolProgressEnabled: boolean;
  readonly commentaryProgressEnabled: boolean;
  readonly suppressDefaultToolProgressMessages: boolean;
  readonly hasStarted: boolean;
  markFinalReplyStarted(): void;
  markFinalReplyDelivered(): void;
  reset(): void;
  resetReasoningProgress(): void;
  suppress(): void;
  cancel(): void;
  start(): Promise<void>;
  noteActivity(options?: {
    startImmediately?: boolean;
  }): Promise<boolean>;
  pushToolProgress: (line?: ChannelProgressDraftCompositorLine, options?: {
    toolName?: string;
    startImmediately?: boolean;
  }) => Promise<boolean>;
  pushReasoningProgress(text?: string, options?: {
    snapshot?: boolean;
  }): Promise<boolean>;
  pushCommentaryProgress(text?: string, options?: {
    itemId?: string;
  }): Promise<boolean>;
};
//#endregion
//#region src/plugin-sdk/channel-outbound.d.ts
type ChannelInboundKernelModule = typeof kernel_d_exports;
/** Lazily forwards inbound reply delivery through the channel turn kernel. */
declare const deliverInboundReplyWithMessageSendContext: ChannelInboundKernelModule["deliverInboundReplyWithMessageSendContext"];
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
export { DurableInboundReceiveCompletedRecord as $, ChannelMessageReceiveAckPolicyProofMap as A, listDeclaredLivePreviewFinalizerCapabilities as B, createMessageReceiptFromOutboundResults as C, ChannelMessageLiveCapabilityProofMap as D, ChannelMessageLiveCapabilityProof as E, LivePreviewFinalizerCapabilityProof as F, verifyChannelMessageLiveFinalizerProofs as G, verifyChannelMessageAdapterCapabilityProofs as H, LivePreviewFinalizerCapabilityProofMap as I, verifyDurableFinalCapabilityProofs as J, verifyChannelMessageReceiveAckPolicyAdapterProofs as K, LivePreviewFinalizerCapabilityProofResult as L, DurableFinalCapabilityProof as M, DurableFinalCapabilityProofMap as N, ChannelMessageLiveCapabilityProofResult as O, DurableFinalCapabilityProofResult as P, DurableInboundReceiveCompleteOptions as Q, listDeclaredChannelMessageLiveCapabilities as R, shouldAckMessageAfterStage as S, resolveMessageReceiptPrimaryId as T, verifyChannelMessageLiveCapabilityAdapterProofs as U, listDeclaredReceiveAckPolicies as V, verifyChannelMessageLiveCapabilityProofs as W, DurableInboundReceiveAcceptOptions as X, verifyLivePreviewFinalizerCapabilityProofs as Y, DurableInboundReceiveAcceptResult as Z, MessageAckPolicy as _, ChannelProgressDraftCompositorLine as a, createDurableInboundReceiveJournal as at, MessageReceiveContext as b, createChannelProgressDraftCompositor as c, ChannelMessageOutboundBridgeResult as ct, ChannelDraftStreamingChunking as d, defineChannelMessageAdapter as dt, DurableInboundReceiveJournal as et, resolveChannelDraftStreamingChunking as f, deriveDurableFinalDeliveryRequirements as ft, createDurableMessageStateRecord as g, DurableMessageSendContextParams as gt, classifyDurableSendRecoveryState as h, DurableMessageSendContext as ht, ChannelProgressDraftCompositor as i, DurableInboundReceiveReleaseOptions as it, ChannelMessageReceiveAckPolicyProofResult as j, ChannelMessageReceiveAckPolicyProof as k, ReplyToResolution as l, CreateChannelMessageAdapterFromOutboundParams as lt, DurableMessageStateRecord as m, DurableMessageBatchSendResult as mt, sendDurableMessageBatch as n, DurableInboundReceivePendingRecord as nt, ChannelProgressDraftMode as o, createDurableInboundReceiveJournalFromQueue as ot, DurableMessageSendState as p, DurableMessageBatchSendParams as pt, verifyChannelMessageReceiveAckPolicyProofs as q, withDurableMessageSendContext as r, DurableInboundReceiveQueueJournalOptions as rt, ChannelProgressDraftUpdateOptions as s, ChannelMessageOutboundBridgeAdapter as st, deliverInboundReplyWithMessageSendContext as t, DurableInboundReceiveJournalOptions as tt, createReplyToFanout as u, createChannelMessageAdapterFromOutbound as ut, MessageAckStage as v, listMessageReceiptPlatformIds as w, createMessageReceiveContext as x, MessageAckState as y, listDeclaredDurableFinalCapabilities as z };