import type { AnyAgentTool } from "../agents/tools/common.js";
import type { ToolDescriptor } from "../tools/types.js";
import type { PluginLoadOptions } from "./loader.js";
import type { OpenClawPluginToolContext } from "./types.js";
/** Cached display descriptor for one plugin-created tool. */
export type CachedPluginToolDescriptor = {
    descriptor: ToolDescriptor;
    displaySummary?: string;
    optional: boolean;
};
export type PluginToolDescriptorConfigCacheKeyMemo = WeakMap<object, string | number | null>;
/** Creates a memo table for config cache keys reused across descriptor cache calls. */
export declare function createPluginToolDescriptorConfigCacheKeyMemo(): PluginToolDescriptorConfigCacheKeyMemo;
export declare function resetPluginToolDescriptorCache(): void;
export declare function buildPluginToolDescriptorCacheKey(params: {
    pluginId: string;
    source: string;
    rootDir?: string;
    contractToolNames: readonly string[];
    ctx: OpenClawPluginToolContext;
    currentRuntimeConfig?: PluginLoadOptions["config"] | null;
    configCacheKeyMemo?: PluginToolDescriptorConfigCacheKeyMemo;
}): string;
export declare function capturePluginToolDescriptor(params: {
    pluginId: string;
    tool: AnyAgentTool;
    optional: boolean;
}): CachedPluginToolDescriptor;
export declare function readCachedPluginToolDescriptors(cacheKey: string): readonly CachedPluginToolDescriptor[] | undefined;
export declare function writeCachedPluginToolDescriptors(params: {
    cacheKey: string;
    descriptors: readonly CachedPluginToolDescriptor[];
}): void;
