import type { OutboundDeliveryResult } from "./deliver.js";
/**
 * Machine-readable delivery result emitted by outbound send commands.
 */
export type OutboundDeliveryJson = {
    channel: string;
    via: "direct" | "gateway";
    to: string;
    messageId: string;
    mediaUrl: string | null;
    chatId?: string;
    channelId?: string;
    roomId?: string;
    conversationId?: string;
    timestamp?: number;
    toJid?: string;
    meta?: Record<string, unknown>;
};
/**
 * Formats the human-readable direct delivery summary for CLI output.
 */
export declare function formatOutboundDeliverySummary(channel: string, result?: OutboundDeliveryResult): string;
/**
 * Formats the human-readable gateway delivery summary for CLI output.
 */
export declare function formatGatewaySummary(params: {
    action?: string;
    channel?: string;
    messageId?: string | null;
}): string;
