import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
/**
 * Lists bundled channel plugin ids for a package root/cache scope.
 */
export declare function listBundledChannelPluginIdsForRoot(_packageRoot: string, env?: NodeJS.ProcessEnv, discovery?: PluginDiscoveryResult): string[];
/**
 * Lists bundled channel ids for a package root/cache scope.
 */
export declare function listBundledChannelIdsForRoot(_packageRoot: string, env?: NodeJS.ProcessEnv, discovery?: PluginDiscoveryResult): string[];
/**
 * Lists bundled channel plugin ids for the current runtime root scope.
 */
export declare function listBundledChannelPluginIds(env?: NodeJS.ProcessEnv, discovery?: PluginDiscoveryResult): string[];
/**
 * Lists bundled channel ids for the current runtime root scope.
 */
export declare function listBundledChannelIds(env?: NodeJS.ProcessEnv, discovery?: PluginDiscoveryResult): string[];
