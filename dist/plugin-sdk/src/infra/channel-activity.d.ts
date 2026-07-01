import type { ChannelId } from "../channels/plugins/channel-id.types.js";
/** Direction of the last observed activity for a channel/account pair. */
export type ChannelDirection = "inbound" | "outbound";
type ActivityEntry = {
    inboundAt: number | null;
    outboundAt: number | null;
};
/** Records the latest inbound or outbound activity timestamp for a channel/account. */
export declare function recordChannelActivity(params: {
    channel: ChannelId;
    accountId?: string | null;
    direction: ChannelDirection;
    at?: number;
}): void;
/** Returns the latest known inbound/outbound activity timestamps for a channel/account. */
export declare function getChannelActivity(params: {
    channel: ChannelId;
    accountId?: string | null;
}): ActivityEntry;
/** Clears all tracked channel activity; test-only helper. */
export declare function resetChannelActivityForTest(): void;
export {};
