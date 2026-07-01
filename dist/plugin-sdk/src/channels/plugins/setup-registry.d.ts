import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";
/**
 * Lists setup-capable channel plugins, falling back to bundled setup metadata.
 */
export declare function listChannelSetupPlugins(): ChannelPlugin[];
/**
 * Lists setup plugins from the active channel registry only.
 */
export declare function listActiveChannelSetupPlugins(): ChannelPlugin[];
/**
 * Returns one setup-capable channel plugin by id.
 */
export declare function getChannelSetupPlugin(id: ChannelId): ChannelPlugin | undefined;
