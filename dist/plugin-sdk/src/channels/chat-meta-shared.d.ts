import { type ChatChannelId } from "./ids.js";
import type { ChannelMeta } from "./plugins/types.core.js";
/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
export type ChatChannelMeta = ChannelMeta;
export declare function buildChatChannelMetaById(): Record<ChatChannelId, ChatChannelMeta>;
