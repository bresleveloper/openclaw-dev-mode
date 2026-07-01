/**
 * Durable channel message sender.
 *
 * Sends rendered reply payloads, records live preview state, and classifies delivery outcomes.
 */
import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import type { OutboundDeliveryResult } from "../../infra/outbound/deliver-types.js";
import { type OutboundPayloadDeliverySuppressionReason } from "../../infra/outbound/deliver-types.js";
import { type DeliverOutboundPayloadsParams, type OutboundDeliveryIntent } from "../../infra/outbound/deliver.js";
import type { DurableMessageSendIntent, LiveMessageState, MessageDurabilityPolicy, MessageReceipt, MessageSendContext, RenderedMessageBatch } from "./types.js";
export type DurableMessageBatchSendParams = Omit<DeliverOutboundPayloadsParams, "abortSignal" | "onDeliveryIntent" | "payloads" | "queuePolicy"> & {
    payloads: ReplyPayload[];
    attempt?: number;
    signal?: AbortSignal;
    /** @deprecated Use `signal`. */
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
export type DurableMessageBatchSendResult = {
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
export type DurableMessageSendContextParams = DurableMessageBatchSendParams & {
    durability?: Exclude<MessageDurabilityPolicy, "disabled">;
    /** Runs after the durable queue intent exists and before platform delivery starts. */
    onDeliveryIntent?: (intent: DurableMessageSendIntent) => void;
    preview?: LiveMessageState<ReplyPayload>;
    onPreviewUpdate?: (rendered: RenderedMessageBatch<ReplyPayload>, state: LiveMessageState<ReplyPayload>) => Promise<LiveMessageState<ReplyPayload>> | LiveMessageState<ReplyPayload>;
    onEditReceipt?: (receipt: MessageReceipt, rendered: RenderedMessageBatch<ReplyPayload>) => Promise<MessageReceipt> | MessageReceipt;
    onDeleteReceipt?: (receipt: MessageReceipt) => Promise<void> | void;
    onCommitReceipt?: (receipt: MessageReceipt) => Promise<void> | void;
    onSendFailure?: (error: unknown) => Promise<void> | void;
};
export type DurableMessageSendContext = MessageSendContext<ReplyPayload, DurableMessageBatchSendResult>;
export declare function withDurableMessageSendContext<T>(params: DurableMessageSendContextParams, run: (ctx: DurableMessageSendContext) => Promise<T>): Promise<T>;
export declare function sendDurableMessageBatch(params: DurableMessageSendContextParams): Promise<DurableMessageBatchSendResult>;
export {};
