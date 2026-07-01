type ChannelId = string & {
    readonly __openclawChannelIdBrand?: never;
};
/** Channel id that can receive outbound messages from the Gateway. */
export type DeliverableMessageChannel = ChannelId;
/** Channel id accepted by Gateway protocol routing, including internal webchat. */
export type GatewayMessageChannel = DeliverableMessageChannel;
/** Normalizes built-in, plugin, and alias channel names to their canonical id. */
export declare function normalizeMessageChannel(raw?: string | null): string | undefined;
/** Lists built-in and registered plugin channel ids that can receive delivery. */
export declare const listDeliverableMessageChannels: () => ChannelId[];
/** Returns whether a normalized id is valid for Gateway routing. */
export declare function isGatewayMessageChannel(value: string): value is GatewayMessageChannel;
/** Returns whether a normalized id is a deliverable non-internal channel. */
export declare function isDeliverableMessageChannel(value: string): value is DeliverableMessageChannel;
/** Normalizes and validates a raw channel value for Gateway routing. */
export declare function resolveGatewayMessageChannel(raw?: string | null): GatewayMessageChannel | undefined;
/** Normalizes the primary channel or falls back to a secondary channel value. */
export declare function resolveMessageChannel(primary?: string | null, fallback?: string | null): string | undefined;
export {};
