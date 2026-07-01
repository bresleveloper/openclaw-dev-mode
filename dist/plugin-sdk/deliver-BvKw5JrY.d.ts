import { T as ReplyToMode } from "./types.base-DmKdGokm.js";
import { c as MessagePresentation, n as InteractiveReply, x as ReplyPayloadDelivery } from "./payload-BHJeg3MX.js";
import { d as ReplyPayload$1 } from "./types-DNy-f8Hr.js";
import { In as SilentReplyConversationType, i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { t as OutboundMediaAccess } from "./load-options-CQixiFLj.js";
import { t as OutboundSendDeps } from "./send-deps-Ds6JW9s7.js";
import { b as OutboundDeliveryResult, d as OutboundDeliveryFormattingOptions, t as ChannelDeliveryCapabilities, u as OutboundIdentity, x as OutboundPayloadDeliveryOutcome } from "./outbound.types-B8rjITVv.js";
import { a as OutboundChannel, c as DeliveryMirror, i as QueuedReplyPayloadSendingHook, o as OutboundSessionContext, r as QueuedRenderedMessageBatchPlan } from "./delivery-queue-fUfq0LUt.js";
import { resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";

//#region src/infra/outbound/payloads.d.ts
/** Runtime-ready outbound payload after text/media/rich-content normalization. */
type NormalizedOutboundPayload = {
  text: string;
  mediaUrls: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  delivery?: ReplyPayloadDelivery;
  interactive?: InteractiveReply;
  channelData?: Record<string, unknown>; /** Hook-only content for audio-only TTS payloads. Never used as channel text/caption. */
  hookContent?: string;
};
/** JSON-safe outbound payload projection used for envelopes and diagnostics. */
type OutboundPayloadJson = {
  text: string;
  mediaUrl: string | null;
  mediaUrls?: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  delivery?: ReplyPayloadDelivery;
  interactive?: InteractiveReply;
  channelData?: Record<string, unknown>;
};
/** Prepared payload entry that keeps source indexing plus reusable projections. */
type OutboundPayloadPlan = {
  sourceIndex: number;
  payload: ReplyPayload$1;
  parts: ReturnType<typeof resolveSendableOutboundReplyParts>;
  hasPresentation: boolean;
  hasInteractive: boolean;
  hasChannelData: boolean;
};
type OutboundPayloadPlanContext = {
  cfg?: OpenClawConfig;
  sessionKey?: string;
  surface?: string;
  conversationType?: SilentReplyConversationType;
  extractMarkdownImages?: boolean;
};
/** Text/media projection used to mirror outbound replies into session state. */
/** Builds the canonical outbound payload plan shared by delivery projections. */
declare function createOutboundPayloadPlan(payloads: readonly ReplyPayload$1[], context?: OutboundPayloadPlanContext): OutboundPayloadPlan[];
/** Projects a payload plan back to normalized reply payloads for delivery. */
declare function projectOutboundPayloadPlanForDelivery(plan: readonly OutboundPayloadPlan[]): ReplyPayload$1[];
/** Projects a payload plan into JSON-safe envelope/debug payloads. */
declare function projectOutboundPayloadPlanForJson(plan: readonly OutboundPayloadPlan[]): OutboundPayloadJson[];
//#endregion
//#region src/infra/outbound/deliver.d.ts
type OutboundDeliveryQueuePolicy = "required" | "best_effort";
type OutboundDeliveryIntent = {
  id: string;
  channel: Exclude<OutboundChannel, "none">;
  to: string;
  accountId?: string;
  queuePolicy: OutboundDeliveryQueuePolicy;
};
type DurableFinalDeliveryRequirement = keyof NonNullable<ChannelDeliveryCapabilities["durableFinal"]>;
type DurableFinalDeliveryRequirements = Partial<Record<DurableFinalDeliveryRequirement, boolean>>;
type DeliverOutboundPayloadsCoreParams = {
  cfg: OpenClawConfig;
  channel: Exclude<OutboundChannel, "none">;
  to: string;
  accountId?: string;
  payloads: ReplyPayload$1[];
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
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
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void; /** Session/agent context used for hooks and media local-root scoping. */
  session?: OutboundSessionContext;
  mirror?: DeliveryMirror;
  silent?: boolean;
  gatewayClientScopes?: readonly string[];
};
/**
 * @deprecated Direct outbound delivery is compatibility/runtime substrate.
 * New message lifecycle code should use `sendDurableMessageBatch` from
 * `src/channels/message/send.ts` or `deliverInboundReplyWithMessageSendContext`
 * from `src/channels/turn/durable-delivery.ts`. Keep direct use only for
 * outbound substrate, recovery, and compatibility paths.
 */
type DeliverOutboundPayloadsParams = DeliverOutboundPayloadsCoreParams & {
  /** @internal Skip write-ahead queue (used by crash-recovery to avoid re-enqueueing). */skipQueue?: boolean; /** @internal Let recovery run commit hooks after it has acked the recovered queue entry. */
  deferCommitHooks?: boolean;
  queuePolicy?: OutboundDeliveryQueuePolicy;
  renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
  onDeliveryIntent?: (intent: OutboundDeliveryIntent) => void;
};
/**
 * @deprecated Direct outbound delivery is compatibility/runtime substrate.
 * New message lifecycle code should use `sendDurableMessageBatch` from
 * `src/channels/message/send.ts` or `deliverInboundReplyWithMessageSendContext`
 * from `src/channels/turn/durable-delivery.ts`. Keep direct use only for
 * outbound substrate, recovery, and compatibility paths.
 */
declare function deliverOutboundPayloads(params: DeliverOutboundPayloadsParams): Promise<OutboundDeliveryResult[]>;
//#endregion
export { OutboundDeliveryQueuePolicy as a, projectOutboundPayloadPlanForDelivery as c, OutboundDeliveryIntent as i, projectOutboundPayloadPlanForJson as l, DurableFinalDeliveryRequirement as n, deliverOutboundPayloads as o, DurableFinalDeliveryRequirements as r, createOutboundPayloadPlan as s, DeliverOutboundPayloadsParams as t };