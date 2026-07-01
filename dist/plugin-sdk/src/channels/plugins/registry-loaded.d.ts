import type { ActiveChannelPluginRuntimeShape, ActivePluginChannelRegistration } from "../../plugins/channel-registry-state.types.js";
/**
 * Loaded channel plugin shape after id/meta normalization.
 */
export type LoadedChannelPlugin = ActiveChannelPluginRuntimeShape & {
    id: string;
    meta: NonNullable<ActiveChannelPluginRuntimeShape["meta"]>;
};
/**
 * Loaded channel registry entry with a normalized plugin payload.
 */
export type LoadedChannelPluginEntry = ActivePluginChannelRegistration & {
    plugin: LoadedChannelPlugin;
};
/**
 * Lists loaded channel plugins in deterministic display/runtime order.
 */
export declare function listLoadedChannelPlugins(): LoadedChannelPlugin[];
/**
 * Returns a loaded channel plugin by normalized id.
 */
export declare function getLoadedChannelPluginById(id: string): LoadedChannelPlugin | undefined;
/**
 * Returns the loaded channel registry entry by normalized plugin id.
 */
export declare function getLoadedChannelPluginEntryById(id: string): LoadedChannelPluginEntry | undefined;
