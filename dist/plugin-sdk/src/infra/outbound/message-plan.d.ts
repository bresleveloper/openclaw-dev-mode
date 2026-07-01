import { type ChunkMode } from "../../auto-reply/chunk.js";
import type { OutboundDeliveryFormattingOptions } from "./formatting.js";
import type { ReplyToOverride } from "./reply-policy.js";
/**
 * Per-send overrides carried from outbound planning into channel delivery.
 */
export type OutboundMessageSendOverrides = ReplyToOverride & {
    threadId?: string | number | null;
    audioAsVoice?: boolean;
    forceDocument?: boolean;
    formatting?: OutboundDeliveryFormattingOptions;
};
/**
 * Planned outbound delivery unit after text chunking or media expansion.
 */
export type OutboundMessageUnit = {
    kind: "text";
    text: string;
    overrides: OutboundMessageSendOverrides;
} | {
    kind: "media";
    caption?: string;
    mediaUrl: string;
    overrides: OutboundMessageSendOverrides;
};
/**
 * Splits outbound text with optional formatting-aware context.
 */
export type OutboundMessageChunker = (text: string, limit: number, ctx?: {
    formatting?: OutboundDeliveryFormattingOptions;
}) => string[];
type PlanReplyToConsumption = <T extends OutboundMessageSendOverrides>(overrides: T) => T;
/**
 * Plans text sends, preserving reply-to policy across chunked delivery units.
 */
export declare function planOutboundTextMessageUnits(params: {
    text: string;
    overrides: OutboundMessageSendOverrides;
    chunker?: OutboundMessageChunker | null;
    chunkerMode?: "text" | "markdown";
    chunkedTextFormatting?: OutboundDeliveryFormattingOptions;
    textLimit?: number;
    chunkMode?: ChunkMode;
    formatting?: OutboundDeliveryFormattingOptions;
    consumeReplyTo?: PlanReplyToConsumption;
}): OutboundMessageUnit[];
/**
 * Plans media sends with a caption only on the leading media unit.
 */
export declare function planOutboundMediaMessageUnits(params: {
    caption: string;
    mediaUrls: readonly string[];
    overrides: OutboundMessageSendOverrides;
    consumeReplyTo?: PlanReplyToConsumption;
}): OutboundMessageUnit[];
export {};
