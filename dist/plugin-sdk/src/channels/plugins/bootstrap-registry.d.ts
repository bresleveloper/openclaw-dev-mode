import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";
/**
 * Lists bundled channel ids visible to bootstrap for the current root scope.
 */
export declare function listBootstrapChannelPluginIds(): readonly string[];
/**
 * Loads a bundled channel plugin for bootstrap, merging runtime and setup artifacts.
 */
export declare function getBootstrapChannelPlugin(id: ChannelId): ChannelPlugin | undefined;
/**
 * Loads bootstrap secret metadata from bundled runtime and setup artifacts.
 */
export declare function getBootstrapChannelSecrets(id: ChannelId): ChannelPlugin["secrets"] | undefined;
