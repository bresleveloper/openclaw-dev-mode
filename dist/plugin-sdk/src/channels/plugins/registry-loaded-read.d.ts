import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";
/**
 * Reads one loaded channel plugin directly from active runtime state.
 */
export declare function getLoadedChannelPluginForRead(id: ChannelId): ChannelPlugin | undefined;
