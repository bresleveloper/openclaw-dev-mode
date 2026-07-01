import type { MessageReceipt } from "../message/types.js";
import type { ChannelDeliveryIntent, ChannelDeliveryResult } from "./types.js";
/** Converts a normalized message receipt into the delivery result shape used by channel turns. */
export declare function createChannelDeliveryResultFromReceipt(params: {
    receipt: MessageReceipt;
    threadId?: string;
    replyToId?: string;
    visibleReplySent?: boolean;
    deliveryIntent?: ChannelDeliveryIntent;
}): ChannelDeliveryResult;
