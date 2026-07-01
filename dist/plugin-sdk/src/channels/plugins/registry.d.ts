import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";
/**
 * Lists currently loaded channel plugins in registry order.
 */
export declare function listChannelPlugins(): ChannelPlugin[];
/**
 * Returns a loaded channel plugin without falling back to bundled metadata.
 */
export declare function getLoadedChannelPlugin(id: ChannelId): ChannelPlugin | undefined;
/**
 * Returns the package/install origin for a loaded channel plugin.
 */
export declare function getLoadedChannelPluginOrigin(id: ChannelId): string | undefined;
/**
 * Returns the active channel plugin, with bundled fallback for built-in channels.
 */
export declare function getChannelPlugin(id: ChannelId): ChannelPlugin | undefined;
/**
 * Normalizes user-facing channel aliases to canonical channel ids.
 */
export declare function normalizeChannelId(raw?: string | null): ChannelId | null;
