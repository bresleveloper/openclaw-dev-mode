import { resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import type { ReplyPayload } from "../../auto-reply/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type InteractiveReply, type MessagePresentation, type ReplyPayloadDelivery } from "../../interactive/payload.js";
import type { SilentReplyConversationType } from "../../shared/silent-reply-policy.js";
/** Runtime-ready outbound payload after text/media/rich-content normalization. */
export type NormalizedOutboundPayload = {
    text: string;
    mediaUrls: string[];
    audioAsVoice?: boolean;
    presentation?: MessagePresentation;
    delivery?: ReplyPayloadDelivery;
    interactive?: InteractiveReply;
    channelData?: Record<string, unknown>;
    /** Hook-only content for audio-only TTS payloads. Never used as channel text/caption. */
    hookContent?: string;
};
/** JSON-safe outbound payload projection used for envelopes and diagnostics. */
export type OutboundPayloadJson = {
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
export type OutboundPayloadPlan = {
    sourceIndex: number;
    payload: ReplyPayload;
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
export type OutboundPayloadMirror = {
    text: string;
    mediaUrls: string[];
};
/** Builds the canonical outbound payload plan shared by delivery projections. */
export declare function createOutboundPayloadPlan(payloads: readonly ReplyPayload[], context?: OutboundPayloadPlanContext): OutboundPayloadPlan[];
/** Projects a payload plan back to normalized reply payloads for delivery. */
export declare function projectOutboundPayloadPlanForDelivery(plan: readonly OutboundPayloadPlan[]): ReplyPayload[];
/** Projects a payload plan into runtime transport payload summaries. */
export declare function projectOutboundPayloadPlanForOutbound(plan: readonly OutboundPayloadPlan[]): NormalizedOutboundPayload[];
/** Projects a payload plan into JSON-safe envelope/debug payloads. */
export declare function projectOutboundPayloadPlanForJson(plan: readonly OutboundPayloadPlan[]): OutboundPayloadJson[];
/** Projects a payload plan into text/media content for session mirroring. */
export declare function projectOutboundPayloadPlanForMirror(plan: readonly OutboundPayloadPlan[]): OutboundPayloadMirror;
/** Summarizes one reply payload for channel transport and hook processing. */
export declare function summarizeOutboundPayloadForTransport(payload: ReplyPayload): NormalizedOutboundPayload;
/** Normalizes reply payloads for direct delivery using the shared plan. */
export declare function normalizeReplyPayloadsForDelivery(payloads: readonly ReplyPayload[]): ReplyPayload[];
/** Normalizes reply payloads into runtime outbound transport payloads. */
export declare function normalizeOutboundPayloads(payloads: readonly ReplyPayload[]): NormalizedOutboundPayload[];
/** Normalizes reply payloads into JSON-safe outbound envelope payloads. */
export declare function normalizeOutboundPayloadsForJson(payloads: readonly ReplyPayload[]): OutboundPayloadJson[];
/** Formats normalized outbound payload text and attachments for logs. */
export declare function formatOutboundPayloadLog(payload: Pick<NormalizedOutboundPayload, "text" | "channelData"> & {
    mediaUrls: readonly string[];
}): string;
export {};
