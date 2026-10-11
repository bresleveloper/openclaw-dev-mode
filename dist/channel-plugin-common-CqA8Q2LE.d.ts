import "./agent-harness-runtime-wMciqZ6Z.js";
import { x as ChannelMeta } from "./types.core-BfkZpaZ6.js";
import { n as ChatChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./types.plugin-DWwKnMgs.js";
import "./types.public-DBD5_XgT.js";
import "./config-schema-edRW2Mnr.js";
import "./setup-helpers-CulguIXb.js";
import "./config-helpers-DGVsqE1f.js";
import "./helpers-BjSTA4Z3.js";
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