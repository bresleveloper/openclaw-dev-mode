import type { ChannelMessageAdapterShape, ChannelMessageLiveAdapterShape, ChannelMessageReceiveAdapterShape, ChannelMessageSendMediaContext, ChannelMessageSendPayloadContext, ChannelMessageSendPollContext, ChannelMessageSendTextContext, DurableFinalDeliveryRequirementMap, MessageReceipt, MessageReceiptSourceResult } from "./types.js";
/** Send result accepted from legacy outbound bridge methods before receipt normalization. */
export type ChannelMessageOutboundBridgeResult = MessageReceiptSourceResult & {
    receipt?: MessageReceipt;
    messageId?: string;
};
/** Legacy outbound adapter shape bridged into the channel message adapter contract. */
export type ChannelMessageOutboundBridgeAdapter<TConfig = unknown> = {
    deliveryCapabilities?: {
        durableFinal?: DurableFinalDeliveryRequirementMap;
    };
    sendText?: (ctx: ChannelMessageSendTextContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
    sendMedia?: (ctx: ChannelMessageSendMediaContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
    sendPayload?: (ctx: ChannelMessageSendPayloadContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
    sendPoll?: (ctx: ChannelMessageSendPollContext<TConfig>) => Promise<ChannelMessageOutboundBridgeResult>;
};
/** Options for building a message adapter from legacy outbound send functions. */
export type CreateChannelMessageAdapterFromOutboundParams<TConfig = unknown> = {
    id?: string;
    outbound: ChannelMessageOutboundBridgeAdapter<TConfig>;
    capabilities?: DurableFinalDeliveryRequirementMap;
    live?: ChannelMessageLiveAdapterShape;
    receive?: ChannelMessageReceiveAdapterShape;
};
/** Converts legacy outbound send methods into a typed channel message adapter. */
export declare function createChannelMessageAdapterFromOutbound<TConfig = unknown>(params: CreateChannelMessageAdapterFromOutboundParams<TConfig>): ChannelMessageAdapterShape<TConfig>;
