import type { ReplyToMode } from "../../config/types.js";
import type { OriginatingChannelType } from "../templating.js";
import type { ReplyPayload, ReplyThreadingPolicy } from "../types.js";
/** Adds the BTW question banner for channels that only accept plain text bodies. */
export declare function formatBtwTextForExternalDelivery(payload: ReplyPayload): string | undefined;
/** Applies inline reply tags to a single payload. */
export declare function applyReplyTagsToPayload(payload: ReplyPayload, currentMessageId?: string): ReplyPayload;
/** True when a payload has visible or playable content for delivery. */
export declare function isRenderablePayload(payload: ReplyPayload): boolean;
/** True when a payload should stay internal as reasoning-only output. */
export declare function shouldSuppressReasoningPayload(payload: ReplyPayload): boolean;
/** Applies threading policy and filters empty payloads before channel delivery. */
export declare function applyReplyThreading(params: {
    payloads: ReplyPayload[];
    replyToMode: ReplyToMode;
    replyToChannel?: OriginatingChannelType;
    currentMessageId?: string;
    replyThreading?: ReplyThreadingPolicy;
}): ReplyPayload[];
