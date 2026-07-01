/**
 * Channel message capabilities advertised through plugin discovery hooks.
 */
export declare const CHANNEL_MESSAGE_CAPABILITIES: readonly ["presentation", "delivery-pin"];
/**
 * Message capability union derived from the canonical capability list.
 */
export type ChannelMessageCapability = (typeof CHANNEL_MESSAGE_CAPABILITIES)[number];
