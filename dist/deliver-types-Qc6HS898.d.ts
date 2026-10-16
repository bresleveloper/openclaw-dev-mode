import "./reply-payload-DazZPys5.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult } from "./types-DemD-QhX.js";
import { t as ChannelId } from "./channel-id.types-CM2F8b5e.js";
//#region src/audit/audit-event-types.d.ts
type AuditMessageDeliveryKind = "text" | "media" | "other";
type AuditMessageFailureStage = "platform_send" | "queue" | "unknown";
declare const AUDIT_OUTBOUND_MESSAGE_SUPPRESSED_REASONS: readonly ["cancelled_by_message_sending_hook", "cancelled_by_reply_payload_sending_hook", "empty_after_message_sending_hook", "empty_after_reply_payload_sending_hook", "no_visible_payload"];
type AuditOutboundMessageSuppressedReasonCode = (typeof AUDIT_OUTBOUND_MESSAGE_SUPPRESSED_REASONS)[number];
//#endregion
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
  target?: NonNullable<MessageReceiptSourceResult["target"]>;
  timestamp?: number;
  toJid?: string;
  pollId?: string;
  receipt?: MessageReceipt;
  meta?: Record<string, unknown>;
};
type OutboundAuditTerminal = {
  outcome: "sent";
  results: readonly OutboundDeliveryResult[];
  deliveryKind?: AuditMessageDeliveryKind;
} | {
  outcome: "suppressed";
  reasonCode: AuditOutboundMessageSuppressedReasonCode;
  results?: readonly OutboundDeliveryResult[];
} | {
  outcome: "failed";
  failureStage: AuditMessageFailureStage;
  results?: readonly OutboundDeliveryResult[];
  sentBeforeError?: boolean;
  deliveryKind?: AuditMessageDeliveryKind;
} | {
  outcome: "unknown";
  failureStage: AuditMessageFailureStage;
  results?: readonly OutboundDeliveryResult[];
  sentBeforeError?: boolean;
};
type IndexedOutboundAuditTerminal = {
  payloadIndex: number;
  terminal: OutboundAuditTerminal;
};
/** Reason a payload was intentionally not sent after normalization or hooks. */
type OutboundPayloadDeliverySuppressionReason = "cancelled_by_message_sending_hook" | "cancelled_by_reply_payload_sending_hook" | "empty_after_message_sending_hook" | "empty_after_reply_payload_sending_hook" | "no_visible_payload" | "adapter_returned_no_send" | "adapter_returned_no_identity";
/** Delivery phase where a failure occurred. */
type OutboundDeliveryFailureStage = AuditMessageFailureStage;
type OutboundPayloadDeliveryKind = AuditMessageDeliveryKind;
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
export { OutboundPayloadDeliveryOutcome as a, PlatformSendRoute as c, OutboundDeliveryResult as i, OutboundDeliveryError as n, OutboundPayloadDeliverySuppressionReason as o, OutboundDeliveryQueuePolicy as r, PlatformMessageNotDispatchedError as s, IndexedOutboundAuditTerminal as t };