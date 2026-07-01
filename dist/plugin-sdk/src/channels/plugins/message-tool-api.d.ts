import type { ChannelMessageActionAdapter } from "./types.public.js";
/**
 * Narrow adapter surface used for message-tool schema discovery.
 */
export type ChannelMessageToolDiscoveryAdapter = Pick<ChannelMessageActionAdapter, "describeMessageTool">;
/**
 * Resolves a bundled channel's message-tool discovery adapter without loading the full plugin.
 */
export declare function resolveBundledChannelMessageToolDiscoveryAdapter(channelId: string): ChannelMessageToolDiscoveryAdapter | undefined;
