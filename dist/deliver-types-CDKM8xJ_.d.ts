import { S as MessageReceipt, T as MessageReceiptSourceResult } from "./types-DOAIO5Ze.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
//#region src/infra/outbound/deliver-types.d.ts
type OutboundDeliveryQueuePolicy = "required" | "best_effort";
type PlatformSendRoute = {
  replyToId?: string | null;
  threadId?: string | number | null;
};
/** Channel send result or explicit non-outcome normalized for delivery accounting. */
type OutboundDeliveryResult = {
  outcome?: MessageReceiptSourceResult["outcome"];
  channel: ChannelId;
  messageId: string;
  target?: {
    kind: "chat" | "channel" | "room" | "conversation";
    id: string;
  };
  timestamp?: number;
  toJid?: string;
  pollId?: string;
  receipt?: MessageReceipt;
  meta?: Record<string, unknown>;
};
/** Reason a payload was intentionally not sent after normalization or hooks. */
type OutboundPayloadDeliverySuppressionReason = "cancelled_by_message_sending_hook" | "cancelled_by_reply_payload_sending_hook" | "empty_after_message_sending_hook" | "empty_after_reply_payload_sending_hook" | "no_visible_payload" | "adapter_returned_no_send" | "adapter_returned_no_identity";
/** Delivery phase where a failure occurred. */
type OutboundDeliveryFailureStage = "platform_send" | "queue" | "unknown";
type OutboundPayloadDeliveryKind = "text" | "media" | "other";
/**
 * Provider assertion that no recipient-visible send began. Set retryable=false
 * for permanent payload/policy rejection; never use after an ambiguous send.
 */
declare class PlatformMessageNotDispatchedError extends Error {
  readonly code = "OPENCLAW_PLATFORM_MESSAGE_NOT_DISPATCHED";
  readonly retryable: boolean;
  constructor(message: string, options: {
    cause: unknown;
    retryable?: boolean;
  });
}
/** Per-payload delivery status emitted to callers and channel send summaries. */
type OutboundPayloadDeliveryOutcome = {
  index: number;
  status: "sent";
  results: OutboundDeliveryResult[];
  /** Effective post-hook, post-render payload kind. */
  deliveryKind?: OutboundPayloadDeliveryKind;
} | {
  index: number;
  status: "suppressed";
  reason: OutboundPayloadDeliverySuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
} | {
  index: number;
  status: "failed";
  error: unknown;
  sentBeforeError: boolean;
  stage: OutboundDeliveryFailureStage;
  /** Identified platform sends from this payload before its terminal failure. */
  results?: OutboundDeliveryResult[];
  /** Effective post-hook, post-render payload kind when platform delivery began. */
  deliveryKind?: OutboundPayloadDeliveryKind;
};
/** Error carrying partial delivery results when an outbound send fails mid-batch. */
declare class OutboundDeliveryError extends Error {
  readonly results: OutboundDeliveryResult[];
  readonly payloadOutcomes: OutboundPayloadDeliveryOutcome[];
  readonly sentBeforeError: boolean;
  readonly stage: OutboundDeliveryFailureStage;
  queueCustody?: "held" | "released";
  constructor(message: string, options: {
    cause: unknown;
    results?: readonly OutboundDeliveryResult[];
    payloadOutcomes?: readonly OutboundPayloadDeliveryOutcome[];
    stage?: OutboundDeliveryFailureStage;
  });
}
//#endregion
export { OutboundPayloadDeliverySuppressionReason as a, OutboundPayloadDeliveryOutcome as i, OutboundDeliveryQueuePolicy as n, PlatformMessageNotDispatchedError as o, OutboundDeliveryResult as r, PlatformSendRoute as s, OutboundDeliveryError as t };