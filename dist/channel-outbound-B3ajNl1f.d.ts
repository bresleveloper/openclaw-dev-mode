import { Mo as ChannelIngressQueuePruneOptions, Oo as ChannelIngressQueue, Qo as DurableMessageSendContextParams, Xo as DurableMessageBatchSendResult, Zo as DurableMessageSendContext, ud as AgentItemEventData } from "./agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import "./templating-OpWn1DzT.js";
import { A as ChannelProgressDraftCompositorSnapshot, O as ChannelProgressDraftCompositorLine, h as ReplyPayload, j as AgentPlanStep, k as ChannelProgressDraftCompositorParams, m as ReplyMediaAttachment } from "./reply-payload-Dv0rYqXd.js";
import { t as StreamingCompatEntry } from "./streaming-config-readers-BxX8qwrU.js";
import "./types.core-D1MQo5ra.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult, _ as DurableFinalDeliveryRequirementMap, a as ChannelMessageLiveCapability, b as LivePreviewFinalizerCapability, c as ChannelMessageSendMediaContext, f as ChannelMessageSendTextContext, g as DurableFinalDeliveryCapability, h as DeriveDurableFinalDeliveryRequirementsParams, i as ChannelMessageLiveAdapterShape, l as ChannelMessageSendPayloadContext, n as ChannelMessageAdapterShape, o as ChannelMessageReceiveAckPolicy, s as ChannelMessageReceiveAdapterShape, t as ChannelMessageAdapter, u as ChannelMessageSendPollContext } from "./types-DOAIO5Ze.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./outbound.types-HYq1MKG1.js";
import { i as ReplyPayload$1 } from "./reply-payload-yojyxBLb.js";
import { o as durable_delivery_d_exports } from "./receipt-DCtO_bEh.js";
import "./ingress-monitor-CgL0N2mA.js";
import "./draft-stream-controls-Dx0I__Rw.js";
import "./runtime-forwarders-B1YzHLS2.js";
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
//#region src/infra/outbound/reply-media-entries.d.ts
/** Preserve attachment associations before media URLs are filtered or deduplicated. */
declare function collectReplyMediaEntries(payload: Pick<ReplyPayload, "mediaUrls" | "mediaUrl" | "attachments">, projectedMediaUrls?: readonly string[]): Array<{
  url: string;
  attachment: ReplyMediaAttachment | undefined;
  sourceUrls?: readonly string[];
}>;
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
    itemId?: string | undefined;
    toolCallId?: string | undefined;
    name?: string | undefined;
    phase?: string | undefined;
    args?: Record<string, unknown> | undefined;
  } & {
    detailMode?: "explain" | "raw";
  }) => Promise<boolean>;
  pushCommandOutputEvent: (payload: {
    itemId?: string | undefined;
    toolCallId?: string | undefined;
    phase?: string | undefined;
    title?: string | undefined;
    name?: string | undefined;
    status?: string | undefined;
    exitCode?: number | null | undefined;
  }) => Promise<boolean>;
  pushPatchEvent: (payload: {
    itemId?: string | undefined;
    toolCallId?: string | undefined;
    phase?: string | undefined;
    title?: string | undefined;
    name?: string | undefined;
    added?: string[] | undefined;
    modified?: string[] | undefined;
    deleted?: string[] | undefined;
    summary?: string | undefined;
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
    itemId?: string | undefined;
    toolCallId?: string | undefined;
    itemKind?: string | undefined;
    hideFromChannelProgress?: boolean | undefined;
    suppressChannelProgress?: boolean | undefined;
    title?: string | undefined;
    name?: string | undefined;
    phase?: string | undefined;
    status?: string | undefined;
    summary?: string | undefined;
    progressText?: string | undefined;
    meta?: string | undefined;
    commandBearing?: boolean | undefined;
  }, "itemKind"> & {
    kind?: string;
  }) => Promise<boolean>>[0]) => Promise<boolean>;
  pushApprovalEvent(payload: Parameters<(payload: {
    approvalId?: string | undefined;
    phase?: string | undefined;
    title?: string | undefined;
    command?: string | undefined;
    reason?: string | undefined;
    message?: string | undefined;
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
/** Adapts the shared channel ingress queue to the durable receive journal API. */
declare function createDurableInboundReceiveJournalFromQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
//#endregion
//#region src/channels/message/contracts.d.ts
type DurableFinalCapabilityProof = () => Promise<void> | void;
type DurableFinalCapabilityProofMap = Partial<Record<DurableFinalDeliveryCapability, DurableFinalCapabilityProof>>;
type DurableFinalCapabilityProofResult = {
  capability: DurableFinalDeliveryCapability;
  status: "verified" | "not_declared";
};
type LivePreviewFinalizerCapabilityProof = () => Promise<void> | void;
type ChannelMessageLiveCapabilityProof = () => Promise<void> | void;
type ChannelMessageReceiveAckPolicyProof = () => Promise<void> | void;
type LivePreviewFinalizerCapabilityProofMap = Partial<Record<LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityProof>>;
type ChannelMessageLiveCapabilityProofMap = Partial<Record<ChannelMessageLiveCapability, ChannelMessageLiveCapabilityProof>>;
type ChannelMessageReceiveAckPolicyProofMap = Partial<Record<ChannelMessageReceiveAckPolicy, ChannelMessageReceiveAckPolicyProof>>;
type LivePreviewFinalizerCapabilityProofResult = {
  capability: LivePreviewFinalizerCapability;
  status: "verified" | "not_declared";
};
type ChannelMessageLiveCapabilityProofResult = {
  capability: ChannelMessageLiveCapability;
  status: "verified" | "not_declared";
};
type ChannelMessageReceiveAckPolicyProofResult = {
  policy: ChannelMessageReceiveAckPolicy;
  status: "verified" | "not_declared";
};
/**
 * Verifies proof callbacks for every declared durable-final delivery capability.
 */
declare function verifyDurableFinalCapabilityProofs(params: {
  adapterName: string;
  capabilities?: DurableFinalDeliveryRequirementMap;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
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
export { processPidFromOwnerId as A, createChannelProgressDraftCompositor as C, resolveChannelDraftStreamingChunking as D, ChannelDraftStreamingChunking as E, OutboundMessageIdentity as M, isRecentOutboundMessageIdentity as N, createTypingKeepaliveLoop as O, recordOutboundMessageIdentity as P, deriveDurableFinalDeliveryRequirements as S, collectReplyMediaEntries as T, verifyChannelMessageReceiveAckPolicyAdapterProofs as _, resolveChannelProgressDraftRender as a, createChannelMessageAdapterFromOutbound as b, isPotentialTruncatedFinal as c, MessageAckPolicy as d, MessageReceiveContext as f, verifyChannelMessageLiveFinalizerProofs as g, verifyChannelMessageLiveCapabilityAdapterProofs as h, preserveReplyPayloadMediaSelection as i, createChannelIngressError as j, INGRESS_CLAIM_PROCESS_ID as k, resolveTranscriptBackedChannelFinalText as l, verifyChannelMessageAdapterCapabilityProofs as m, deliverInboundReplyWithMessageSendContext as n, sendDurableMessageBatch as o, createMessageReceiveContext as p, deliverStructuredInboundReplyWithMessageSendContext as r, withDurableMessageSendContext as s, ChannelProgressDraftRenderMode as t, selectLongerFinalText as u, verifyDurableFinalCapabilityProofs as v, createChannelProgressWorkCounter as w, defineChannelMessageAdapter as x, createDurableInboundReceiveJournalFromQueue as y };