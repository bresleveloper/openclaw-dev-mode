import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { At as OutboundPayloadPlan, dn as ExecutionIdentityAdmissionToken, pn as ReplyPayload, st as FinalizedMsgContext } from "./reply-payload-DazZPys5.js";
import { n as DurableFinalDeliveryRequirement } from "./deliver-08FDWQV8.js";
import { Fa as ChannelDeliveryInfo, Ja as ChannelDeliveryResult, Ra as ChannelTurnDurableDeliveryOptions } from "./agent-harness-runtime-DZjstJNb.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult, w as MessageReceiptPartKind } from "./types-DemD-QhX.js";
declare namespace durable_delivery_d_exports {
  export { DurableInboundReplyDeliveryOptions, DurableInboundReplyDeliveryParams, StructuredDurableInboundReplyDeliveryParams, deliverInboundReplyWithMessageSendContextCore, deliverStructuredInboundReplyWithMessageSendContextCore, isDurableInboundReplyDeliveryHandled, throwIfDurableInboundReplyDeliveryFailed };
}
type DurableInboundReplyDeliveryOptions = ChannelTurnDurableDeliveryOptions & {
  /** Optional: validate the admitted sender and pin its resolved credential before a registry handoff. */
  prepareRuntimeHandoff?: (cfg: OpenClawConfig) => OpenClawConfig;
};
type DurableInboundReplyDeliveryParams = DurableInboundReplyDeliveryOptions & {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  ctxPayload: FinalizedMsgContext;
  payload: ReplyPayload;
  info: ChannelDeliveryInfo;
  runId?: string;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
};
type StructuredDurableInboundReplyDeliveryParams = Omit<DurableInboundReplyDeliveryParams, "payload"> & {
  plan: OutboundPayloadPlan;
};
type DurableInboundReplyDeliveryResult = {
  status: "not_applicable";
  reason: "non_final";
} | {
  status: "unsupported";
  reason: "missing_channel" | "missing_target" | "missing_outbound_handler" | "capability_mismatch";
  capability?: DurableFinalDeliveryRequirement;
} | {
  status: "handled_visible";
  delivery: ChannelDeliveryResult;
} | {
  status: "handled_no_send";
  reason: "no_visible_result";
  delivery: ChannelDeliveryResult;
} | {
  status: "failed";
  error: unknown;
  /** False requires affirmative no-dispatch proof; omission preserves ambiguity. */
  sentBeforeError?: boolean;
};
declare function isDurableInboundReplyDeliveryHandled(result: DurableInboundReplyDeliveryResult): result is Extract<DurableInboundReplyDeliveryResult, {
  status: "handled_visible" | "handled_no_send";
}>;
declare function throwIfDurableInboundReplyDeliveryFailed(result: DurableInboundReplyDeliveryResult): void;
declare function deliverInboundReplyWithMessageSendContextCore(params: DurableInboundReplyDeliveryParams): Promise<DurableInboundReplyDeliveryResult>;
/** Delivers a prepared final reply through the same durable owner without parsing its text. */
declare function deliverStructuredInboundReplyWithMessageSendContextCore(params: StructuredDurableInboundReplyDeliveryParams): Promise<DurableInboundReplyDeliveryResult>;
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
export { DurableInboundReplyDeliveryParams as a, DurableInboundReplyDeliveryOptions as i, listMessageReceiptPlatformIds as n, durable_delivery_d_exports as o, resolveMessageReceiptPrimaryId as r, createMessageReceiptFromOutboundResults as t };