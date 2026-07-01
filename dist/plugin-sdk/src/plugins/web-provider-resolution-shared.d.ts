import type { PluginLoadOptions } from "./loader.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
export type WebProviderContract = "webSearchProviders" | "webFetchProviders";
export type WebProviderConfigKey = "webSearch" | "webFetch";
/** Manifest-backed plugin id candidates for a web provider family. */
export type WebProviderCandidateResolution = {
    pluginIds: string[] | undefined;
    manifestRecords?: readonly PluginManifestRecord[];
};
type WebProviderSortEntry = {
    id: string;
    pluginId: string;
    autoDetectOrder?: number;
};
export declare function sortPluginProviders<T extends Pick<WebProviderSortEntry, "id" | "pluginId">>(providers: T[]): T[];
/** Sorts provider candidates for auto-detect while keeping equal priorities deterministic. */
export declare function sortPluginProvidersForAutoDetect<T extends WebProviderSortEntry>(providers: T[]): T[];
/** Returns only plugin ids for manifest-declared web provider candidates. */
export declare function resolveManifestDeclaredWebProviderCandidatePluginIds(params: {
    contract: WebProviderContract;
    configKey: WebProviderConfigKey;
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: readonly string[];
    origin?: PluginManifestRecord["origin"];
    sandboxed?: boolean;
}): string[] | undefined;
/** Resolves manifest-declared web provider candidates without importing plugin runtime code. */
export declare function resolveManifestDeclaredWebProviderCandidates(params: {
    contract: WebProviderContract;
    configKey: WebProviderConfigKey;
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: readonly string[];
    origin?: PluginManifestRecord["origin"];
    sandboxed?: boolean;
    manifestRecords?: readonly PluginManifestRecord[];
}): WebProviderCandidateResolution;
/** Builds bundled-plugin activation config for provider families with legacy enablement defaults. */
export declare function resolveBundledWebProviderResolutionConfig(params: {
    contract: WebProviderContract;
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): {
    config: PluginLoadOptions["config"];
    activationSourceConfig?: PluginLoadOptions["config"];
    autoEnabledReasons: Record<string, string[]>;
};
/** Adds plugin ids to registry provider records, applies an optional plugin scope, then sorts. */
export declare function mapRegistryProviders<TProvider extends {
    id: string;
}>(params: {
    entries: readonly {
        pluginId: string;
        provider: TProvider;
    }[];
    onlyPluginIds?: readonly string[];
    sortProviders: (providers: Array<TProvider & {
        pluginId: string;
    }>) => Array<TProvider & {
        pluginId: string;
    }>;
}): Array<TProvider & {
    pluginId: string;
}>;
export {};
