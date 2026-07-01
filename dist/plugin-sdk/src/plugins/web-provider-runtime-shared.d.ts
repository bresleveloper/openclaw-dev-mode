import type { PluginLoadOptions } from "./loader.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
import type { PluginRegistry } from "./registry.js";
/** Shared options for resolving plugin-backed web providers. */
export type ResolvePluginWebProvidersParams = {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    mode?: "runtime" | "setup";
    origin?: PluginManifestRecord["origin"];
    sandboxed?: boolean;
};
type ResolveWebProviderRuntimeDeps<TEntry> = {
    resolveBundledResolutionConfig: (params: {
        config?: PluginLoadOptions["config"];
        workspaceDir?: string;
        env?: PluginLoadOptions["env"];
    }) => {
        config: PluginLoadOptions["config"];
        activationSourceConfig?: PluginLoadOptions["config"];
        autoEnabledReasons: Record<string, string[]>;
    };
    resolveCandidatePluginIds: (params: {
        config?: PluginLoadOptions["config"];
        workspaceDir?: string;
        env?: PluginLoadOptions["env"];
        onlyPluginIds?: readonly string[];
        origin?: PluginManifestRecord["origin"];
        sandboxed?: boolean;
    }) => string[] | undefined;
    mapRegistryProviders: (params: {
        registry: PluginRegistry;
        onlyPluginIds?: readonly string[];
    }) => TEntry[];
    resolveBundledPublicArtifactProviders?: (params: {
        config?: PluginLoadOptions["config"];
        workspaceDir?: string;
        env?: PluginLoadOptions["env"];
        onlyPluginIds?: readonly string[];
    }) => TEntry[] | null;
};
/** Resolves plugin web providers from setup, active runtime, or a scoped load. */
export declare function resolvePluginWebProviders<TEntry>(params: ResolvePluginWebProvidersParams, deps: ResolveWebProviderRuntimeDeps<TEntry>): TEntry[];
/** Resolves web providers from the active runtime registry before falling back to plugin loading. */
export declare function resolveRuntimeWebProviders<TEntry>(params: Omit<ResolvePluginWebProvidersParams, "activate" | "cache" | "mode">, deps: ResolveWebProviderRuntimeDeps<TEntry>): TEntry[];
export {};
