import "./agent-harness-runtime-CWL0fcg5.js";
import { x as ChannelMeta } from "./types.core-D1MQo5ra.js";
import { n as ChatChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./types.plugin-ItlfCSr2.js";
import "./types.public-B8oQ1D30.js";
import "./config-schema-edRW2Mnr.js";
import "./setup-helpers-CsmtHi6m.js";
import "./config-helpers-C_BjeZsy.js";
import "./helpers-_lVA7JdY.js";
//#region src/channels/chat-meta-shared.d.ts
/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
type ChatChannelMeta = ChannelMeta;
//#endregion
//#region src/channels/chat-meta.d.ts
/**
 * Returns metadata for one built-in chat channel id.
 * Shipped plugin-SDK contract: callers pass bundled ids, so absence is an invariant
 * violation; drift-tolerant core paths use findChatChannelMeta instead.
 */
declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
//#endregion
export { getChatChannelMeta as t };