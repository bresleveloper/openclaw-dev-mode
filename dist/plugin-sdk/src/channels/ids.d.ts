/**
 * Canonical chat channel id used by core routing, plugin config, and channel catalogs.
 */
export type ChatChannelId = string;
/**
 * Stable built-in channel order derived from generated bundled channel metadata.
 */
export declare const CHAT_CHANNEL_ORDER: readonly string[];
/**
 * Alias retained for callers that still refer to chat channel ordering as channel ids.
 */
export declare const CHANNEL_IDS: readonly string[];
/**
 * Maps configured built-in channel aliases to canonical chat channel ids.
 */
export declare const CHAT_CHANNEL_ALIASES: Record<string, ChatChannelId>;
/**
 * Normalizes a raw chat channel id or alias to a known canonical built-in channel id.
 */
export declare function normalizeChatChannelId(raw?: string | null): ChatChannelId | null;
