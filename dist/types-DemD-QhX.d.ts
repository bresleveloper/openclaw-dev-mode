import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { x as ReplyToMode } from "./types.base-D8MIFbSh.js";
import { pn as ReplyPayload } from "./reply-payload-DazZPys5.js";
import "./types-C-BtfS0H.js";
import { t as OutboundMediaAccess } from "./load-options-v9K2x1AC.js";
import { t as PollInput } from "./polls-sXqxREW1.js";
//#region src/infra/outbound/send-deps.d.ts
/**
 * Dynamic bag of per-channel send functions, keyed by channel ID.
 * Each outbound adapter resolves its own function from this record and
 * falls back to a direct import when the key is absent.
 */
type OutboundSendDeps = {
  [channelId: string]: unknown;
};
/**
 * Extra historical keys to try after the normalized channel-derived keys.
 */
type ResolveOutboundSendDepOptions = {
  legacyKeys?: readonly string[];
};
/**
 * Resolves a channel send dependency from modern channel IDs or legacy helper keys.
 */
declare function resolveOutboundSendDep<T>(deps: OutboundSendDeps | null | undefined, channelId: string, options?: ResolveOutboundSendDepOptions): T | undefined;
//#endregion
//#region src/channels/message/types.d.ts
/** Delivery durability requested by core when a channel sends agent output. */
type MessageDurabilityPolicy = "required" | "best_effort" | "disabled";
type OutboundReplyFacts = Readonly<{
  source: "explicit";
  replyToId: string;
}> | Readonly<{
  source: "implicit";
  replyToId: string;
  mode: "first" | "all";
}>;
/** Capability names a channel must advertise before core can rely on durable final delivery. */
declare const durableFinalDeliveryCapabilities: readonly ["text", "media", "poll", "payload", "silent", "replyTo", "thread", "nativeQuote", "messageSendingHooks", "batch", "reconcileUnknownSend", "afterSendSuccess", "afterCommit"];
type DurableFinalDeliveryCapability = (typeof durableFinalDeliveryCapabilities)[number];
type DurableFinalDeliveryRequirementMap = Partial<Record<DurableFinalDeliveryCapability, boolean>>;
type DurableFinalDeliveryPayloadShape = {
  text?: string | null;
  replyToId?: string | null;
  mediaUrl?: string | null;
  mediaUrls?: readonly (string | null | undefined)[] | null;
};
/** Raw platform result shape normalized into a message receipt. */
type MessageReceiptSourceResult = {
  /** Provider-confirmed intentional omission before dispatch, never an ambiguous send. */
  outcome?: "not_sent";
  channel?: string;
  messageId?: string;
  target?: {
    kind: "chat" | "channel" | "room" | "conversation";
    id: string;
  };
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  toJid?: string;
  pollId?: string;
  timestamp?: number;
  meta?: Record<string, unknown>;
};
type MessageReceiptPartKind = "text" | "media" | "voice" | "poll" | "card" | "preview" | "unknown";
/** One platform message produced by a logical outbound send. */
type MessageReceiptPart = {
  platformMessageId: string;
  kind: MessageReceiptPartKind;
  index: number;
  threadId?: string;
  replyToId?: string;
  raw?: MessageReceiptSourceResult;
};
/** Normalized receipt for all platform messages that make up a logical send. */
type MessageReceipt = {
  primaryPlatformMessageId?: string;
  platformMessageIds: string[];
  parts: MessageReceiptPart[];
  threadId?: string;
  replyToId?: string;
  editToken?: string;
  deleteToken?: string;
  sentAt: number;
  raw?: readonly MessageReceiptSourceResult[];
};
type RenderedMessageBatchPlanKind = "text" | "media" | "voice" | "presentation" | "interactive" | "channelData" | "empty";
/** Render plan for a single reply payload after text/media/presentation splitting. */
type RenderedMessageBatchPlanItem = {
  index: number;
  kinds: readonly RenderedMessageBatchPlanKind[];
  text?: string;
  mediaUrls: readonly string[];
  audioAsVoice?: boolean;
  presentationBlockCount?: number;
  hasInteractive?: boolean;
  hasChannelData?: boolean;
};
type RenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};
/** Rendered payload batch paired with the plan core uses for send routing and recovery. */
type RenderedMessageBatch<TPayload = unknown> = {
  payloads: TPayload[];
  plan: RenderedMessageBatchPlan;
};
type LiveMessagePhase = "idle" | "previewing" | "finalizing" | "finalized" | "cancelled";
type LiveMessageState<TPayload = unknown> = {
  phase: LiveMessagePhase;
  canFinalizeInPlace: boolean;
  receipt?: MessageReceipt;
  lastRendered?: RenderedMessageBatch<TPayload>;
};
/** Durable send context passed through render, preview, send, edit, commit, and failure steps. */
type MessageSendContext<TPayload = unknown, TSendResult = unknown> = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  durability: Exclude<MessageDurabilityPolicy, "disabled">;
  attempt: number;
  signal: AbortSignal;
  intent?: DurableMessageSendIntent;
  previousReceipt?: MessageReceipt;
  preview?: LiveMessageState<TPayload>;
  render(): Promise<RenderedMessageBatch<TPayload>>;
  previewUpdate(rendered: RenderedMessageBatch<TPayload>): Promise<LiveMessageState<TPayload>>;
  send(rendered: RenderedMessageBatch<TPayload>): Promise<TSendResult>;
  edit(receipt: MessageReceipt, rendered: RenderedMessageBatch<TPayload>): Promise<MessageReceipt>;
  delete(receipt: MessageReceipt): Promise<void>;
  commit(receipt: MessageReceipt): Promise<void>;
  fail(error: unknown): Promise<void>;
};
type ChannelMessageSendTextContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  to: string;
  text: string;
  accountId?: string | null;
  deps?: OutboundSendDeps;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
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
  /** @internal Report each completed platform sub-send before another fallible step. */
  onDeliveryResult?: (result: ChannelMessageSendResult) => Promise<void> | void;
};
type ChannelMessageSendMediaContext<TConfig = OpenClawConfig> = ChannelMessageSendTextContext<TConfig> & {
  mediaUrl: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  audioAsVoice?: boolean;
  gifPlayback?: boolean;
  /** Send image, GIF, or video as document to avoid channel compression. */
  forceDocument?: boolean;
};
type ChannelMessageSendPayloadContext<TConfig = OpenClawConfig> = Omit<ChannelMessageSendMediaContext<TConfig>, "mediaUrl"> & {
  payload: ReplyPayload;
  mediaUrl?: string;
};
/** Poll send context; thread ids stay string-like because poll APIs do not accept numeric ids. */
type ChannelMessageSendPollContext<TConfig = OpenClawConfig> = Omit<ChannelMessageSendTextContext<TConfig>, "text" | "threadId"> & {
  poll: PollInput;
  threadId?: string | null;
  isAnonymous?: boolean;
};
/** Adapter send result normalized to a receipt plus optional legacy message id. */
type ChannelMessageSendResult = {
  outcome?: MessageReceiptSourceResult["outcome"];
  receipt: MessageReceipt;
  messageId?: string;
  target?: MessageReceiptSourceResult["target"];
};
/** Concrete send shapes an adapter can reconcile after an unknown platform outcome. */
declare const unknownSendReconciliationKinds: readonly ["text", "media", "payload", "poll", "batch"];
type UnknownSendReconciliationKind = (typeof unknownSendReconciliationKinds)[number];
type ChannelMessageSendAttemptContext<TConfig = OpenClawConfig> = (ChannelMessageSendTextContext<TConfig> & {
  kind: "text";
}) | (ChannelMessageSendMediaContext<TConfig> & {
  kind: "media";
}) | (ChannelMessageSendPayloadContext<TConfig> & {
  kind: "payload";
}) | (ChannelMessageSendPollContext<TConfig> & {
  kind: "poll";
});
/** Successful adapter send shared by the success and durable-commit hooks. */
type ChannelMessageSendCommitContext<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = ChannelMessageSendAttemptContext<TConfig> & {
  result: TSendResult;
  attemptToken?: unknown;
};
type ChannelMessageSendFailureContext<TConfig = OpenClawConfig> = ChannelMessageSendAttemptContext<TConfig> & {
  error: unknown;
  attemptToken?: unknown;
};
/** Durable queue context used to reconcile a send whose platform state is unknown. */
type ChannelMessageUnknownSendContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  queueId: string;
  channel: string;
  to: string;
  accountId?: string | null;
  enqueuedAt: number;
  retryCount: number;
  platformSendStartedAt?: number;
  /** Canonical reply target persisted after hooks and before platform I/O. */
  effectiveReplyToId?: string | null;
  payloads: readonly ReplyPayload[];
  renderedBatchPlan?: RenderedMessageBatchPlan;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
};
type ChannelMessageUnknownSendReconciliationResult = {
  status: "sent";
  receipt: MessageReceipt;
  messageId?: string;
} | {
  status: "not_sent";
} | {
  status: "unresolved";
  error?: string;
  retryable?: boolean;
};
/** Provider decision made before core persists or replays a deferred delivery. */
type ChannelMessageDeferredDeliveryAdmissionResult = {
  status: "allowed";
} | {
  status: "permanent_rejection";
  reason: string;
};
type ChannelMessageDeferredDeliveryAdmissionContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  channel: string;
  to: string;
  accountId?: string | null;
  phase: "live" | "recovery";
};
type ChannelMessageSendLifecycleAdapter<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  beforeSendAttempt?: (ctx: ChannelMessageSendAttemptContext<TConfig>) => unknown;
  afterSendSuccess?: (ctx: ChannelMessageSendCommitContext<TConfig, TSendResult>) => Promise<void> | void;
  afterSendFailure?: (ctx: ChannelMessageSendFailureContext<TConfig>) => Promise<void> | void;
  afterCommit?: (ctx: ChannelMessageSendCommitContext<TConfig, TSendResult>) => Promise<void> | void;
};
type ChannelMessageSendAdapter<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  text?: (ctx: ChannelMessageSendTextContext<TConfig>) => Promise<TSendResult>;
  media?: (ctx: ChannelMessageSendMediaContext<TConfig>) => Promise<TSendResult>;
  payload?: (ctx: ChannelMessageSendPayloadContext<TConfig>) => Promise<TSendResult>;
  poll?: (ctx: ChannelMessageSendPollContext<TConfig>) => Promise<TSendResult>;
  lifecycle?: ChannelMessageSendLifecycleAdapter<TConfig, TSendResult>;
};
/** Durable final-delivery extension for queue reconciliation and capability declaration. */
type ChannelMessageDurableFinalAdapter = {
  capabilities?: DurableFinalDeliveryRequirementMap;
  /** Opt into provider reconciliation for ordinary single-payload queued sends. */
  automaticUnknownSendReconciliation?: boolean;
  /**
   * Synchronous provider admission before a durable intent is created or replayed.
   * Providers must not perform I/O from this hook.
   */
  admitDeferredDelivery?: (ctx: ChannelMessageDeferredDeliveryAdmissionContext) => ChannelMessageDeferredDeliveryAdmissionResult;
  /** Send shapes for which reconciliation can prove the complete durable intent. */
  reconcileUnknownSendKinds?: Partial<Record<UnknownSendReconciliationKind, boolean>>;
  reconcileUnknownSend?: (ctx: ChannelMessageUnknownSendContext) => Promise<ChannelMessageUnknownSendReconciliationResult | null> | ChannelMessageUnknownSendReconciliationResult | null;
  /** Cleanup after core authoritatively retires an ambiguous send as failed. */
  afterUnknownSendTerminal?: (ctx: ChannelMessageUnknownSendContext) => Promise<void> | void;
};
type ChannelMessageLiveCapability = (typeof channelMessageLiveCapabilities)[number];
/** Canonical ordered list of live-message feature keys. */
declare const channelMessageLiveCapabilities: readonly ["draftPreview", "previewFinalization", "progressUpdates", "nativeStreaming", "quietFinalization"];
/** Capability keys for turning a preview into a final platform message. */
declare const livePreviewFinalizerCapabilities: readonly ["finalEdit", "normalFallback", "discardPending", "previewReceipt", "retainOnAmbiguousFailure"];
type LivePreviewFinalizerCapability = (typeof livePreviewFinalizerCapabilities)[number];
type ChannelMessageLiveAdapterShape = {
  capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
  finalizer?: {
    capabilities?: Partial<Record<LivePreviewFinalizerCapability, boolean>>;
  };
};
type ChannelMessageReceiveAckPolicy = (typeof channelMessageReceiveAckPolicies)[number];
/** Canonical ordered list of receive acknowledgement policies. */
declare const channelMessageReceiveAckPolicies: readonly ["after_receive_record", "after_agent_dispatch", "after_durable_send", "manual"];
type ChannelMessageReceiveAdapterShape = {
  defaultAckPolicy?: ChannelMessageReceiveAckPolicy;
  supportedAckPolicies?: readonly ChannelMessageReceiveAckPolicy[];
};
type ChannelMessageAdapterShape<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  id?: string;
  durableFinal?: ChannelMessageDurableFinalAdapter;
  send?: ChannelMessageSendAdapter<TConfig, TSendResult>;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};
/** Concrete message adapter type, preserving channel-specific adapter refinements. */
type ChannelMessageAdapter<TAdapter extends ChannelMessageAdapterShape = ChannelMessageAdapterShape> = TAdapter;
type DeriveDurableFinalDeliveryRequirementsParams = {
  payload: DurableFinalDeliveryPayloadShape;
  replyToId?: string | null;
  threadId?: string | number | null;
  silent?: boolean;
  messageSendingHooks?: boolean;
  payloadTransport?: boolean;
  batch?: boolean;
  reconcileUnknownSend?: boolean;
  afterSendSuccess?: boolean;
  afterCommit?: boolean;
  extraCapabilities?: DurableFinalDeliveryRequirementMap;
};
/** Stable intent record for a durable outbound message send. */
type DurableMessageSendIntent<TPayload = unknown> = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  durability: Exclude<MessageDurabilityPolicy, "disabled">;
  renderedBatch?: RenderedMessageBatch<TPayload>;
};
//#endregion
export { OutboundSendDeps as A, MessageReceiptPart as C, OutboundReplyFacts as D, MessageSendContext as E, RenderedMessageBatch as O, MessageReceipt as S, MessageReceiptSourceResult as T, DurableFinalDeliveryRequirementMap as _, ChannelMessageLiveCapability as a, LivePreviewFinalizerCapability as b, ChannelMessageSendMediaContext as c, ChannelMessageSendResult as d, ChannelMessageSendTextContext as f, DurableFinalDeliveryCapability as g, DeriveDurableFinalDeliveryRequirementsParams as h, ChannelMessageLiveAdapterShape as i, resolveOutboundSendDep as j, RenderedMessageBatchPlan as k, ChannelMessageSendPayloadContext as l, ChannelMessageUnknownSendReconciliationResult as m, ChannelMessageAdapterShape as n, ChannelMessageReceiveAckPolicy as o, ChannelMessageUnknownSendContext as p, ChannelMessageDurableFinalAdapter as r, ChannelMessageReceiveAdapterShape as s, ChannelMessageAdapter as t, ChannelMessageSendPollContext as u, DurableMessageSendIntent as v, MessageReceiptPartKind as w, MessageDurabilityPolicy as x, LiveMessageState as y };