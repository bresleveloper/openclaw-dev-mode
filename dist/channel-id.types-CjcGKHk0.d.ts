//#region src/channels/ids.d.ts
/**
 * Canonical chat channel id used by core routing, plugin config, and channel catalogs.
 */
type ChatChannelId = string;
//#endregion
//#region src/channels/plugins/channel-id.types.d.ts
/**
 * Channel id accepted by plugin helpers, covering built-in chat ids and external plugin ids.
 */
type ChannelId = ChatChannelId | (string & {});
//#endregion
export { ChatChannelId as n, ChannelId as t };