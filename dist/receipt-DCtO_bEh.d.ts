import { $o as DeliverOutboundPayloadsParams, Mi as ChannelDeliveryInfo, es as DurableFinalDeliveryRequirement, ts as DurableFinalDeliveryRequirements } from "./agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { N as ExecutionIdentityAdmissionToken, T as OutboundPayloadPlan, r as FinalizedMsgContext } from "./templating-OpWn1DzT.js";
import { h as ReplyPayload } from "./reply-payload-Dv0rYqXd.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult, w as MessageReceiptPartKind } from "./types-DOAIO5Ze.js";
import { n as ChannelDeliveryResult } from "./delivery-outcome-Dvdp8_SV.js";
declare namespace durable_delivery_d_exports {
  export { DurableInboundReplyDeliveryOptions, DurableInboundReplyDeliveryParams, StructuredDurableInboundReplyDeliveryParams, deliverInboundReplyWithMessageSendContextCore, deliverStructuredInboundReplyWithMessageSendContextCore, isDurableInboundReplyDeliveryHandled, throwIfDurableInboundReplyDeliveryFailed };
}
/** Options controlling durable final delivery for inbound channel replies. */
type DurableInboundReplyDeliveryOptions = Pick<DeliverOutboundPayloadsParams, "deps" | "formatting" | "identity" | "mediaAccess" | "replyToMode" | "silent" | "threadId"> & {
  to?: string | null;
  replyToId?: string | null;
  requiredCapabilities?: DurableFinalDeliveryRequirements;
};
/** Full context required to deliver one inbound final reply through durable message sending. */
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
/** Outcome of attempting durable final delivery for an inbound reply payload. */
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
  sentBeforeError?: true;
};
/** Narrows durable delivery results that handled the payload without caller fallback. */
declare function isDurableInboundReplyDeliveryHandled(result: DurableInboundReplyDeliveryResult): result is Extract<DurableInboundReplyDeliveryResult, {
  status: "handled_visible" | "handled_no_send";
}>;
/** Throws failed durable delivery results, preserving visible-send metadata when applicable. */
declare function throwIfDurableInboundReplyDeliveryFailed(result: DurableInboundReplyDeliveryResult): void;
/** Delivers final inbound replies through the durable message-send context when supported. */
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