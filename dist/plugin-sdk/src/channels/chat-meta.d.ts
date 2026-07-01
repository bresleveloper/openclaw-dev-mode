/**
 * Cached built-in chat channel metadata accessors.
 *
 * Provides ordered channel metadata for setup, status, and selection surfaces.
 */
import { type ChatChannelMeta } from "./chat-meta-shared.js";
import { type ChatChannelId } from "./ids.js";
/**
 * Lists built-in chat channel metadata in configured display order.
 */
export declare function listChatChannels(): ChatChannelMeta[];
/**
 * Returns metadata for one built-in chat channel id.
 */
export declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
