/** Bundled chat-channel ids from the official channel catalog. */
export declare const BUNDLED_CHAT_CHANNEL_IDS: readonly string[];
/**
 * Channel ids, labels, and aliases that can appear as inbound-envelope prefixes.
 * Consumers should use this for envelope cleanup instead of hardcoding channel names.
 */
export declare const BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES: readonly string[];
export type { ChatChannelId } from "../channels/ids.js";
