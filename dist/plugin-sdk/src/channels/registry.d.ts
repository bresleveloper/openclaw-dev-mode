import { normalizeChatChannelId, type ChatChannelId } from "./ids.js";
import type { ChannelId } from "./plugins/channel-id.types.js";
import type { ChannelMeta } from "./plugins/types.core.js";
export { getChatChannelMeta } from "./chat-meta.js";
export { CHAT_CHANNEL_ORDER } from "./ids.js";
export type { ChatChannelId } from "./ids.js";
export { normalizeChatChannelId };
/**
 * Normalizes built-in chat channel ids without loading channel plugin implementations.
 */
export declare function normalizeChannelId(raw?: string | null): ChatChannelId | null;
/**
 * Normalizes any registered channel plugin id or alias after registry initialization.
 */
export declare function normalizeAnyChannelId(raw?: string | null): ChannelId | null;
/**
 * Lists registered channel plugin ids without importing their runtime implementations.
 */
export declare function listRegisteredChannelPluginIds(): ChannelId[];
/**
 * Returns lightweight channel metadata used by message formatting and capability checks.
 */
export declare function getRegisteredChannelPluginMeta(id: string): Pick<ChannelMeta, "aliases" | "markdownCapable"> | null;
/**
 * Formats a concise channel primer line for setup/status flows.
 */
export declare function formatChannelPrimerLine(meta: ChannelMeta): string;
/**
 * Formats a docs-aware channel selection line for interactive setup prompts.
 */
export declare function formatChannelSelectionLine(meta: ChannelMeta, docsLink: (path: string, label?: string) => string): string;
