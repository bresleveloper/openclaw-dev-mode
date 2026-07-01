import type { PluginLoadOptions } from "./loader.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
import type { PluginWebFetchProviderEntry } from "./types.js";
/** Resolves web fetch providers, activating plugin runtimes when requested. */
export declare function resolvePluginWebFetchProviders(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    mode?: "runtime" | "setup";
    origin?: PluginManifestRecord["origin"];
    sandboxed?: boolean;
}): PluginWebFetchProviderEntry[];
/** Resolves already-eligible runtime web fetch providers without setup-mode activation. */
export declare function resolveRuntimeWebFetchProviders(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: readonly string[];
    origin?: PluginManifestRecord["origin"];
}): PluginWebFetchProviderEntry[];
