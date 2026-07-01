import { T as ChannelMeta } from "./types.core-BBGk7pBn.js";
import { t as ChatChannelId } from "./ids-BUiVO67E.js";
//#region src/channels/chat-meta-shared.d.ts
/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
type ChatChannelMeta = ChannelMeta;
//#endregion
//#region src/channels/chat-meta.d.ts
/**
 * Returns metadata for one built-in chat channel id.
 */
declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
//#endregion
export { getChatChannelMeta as t };