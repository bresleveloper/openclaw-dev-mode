import type { ModelProviderConfig } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginMetadataRegistryView } from "./plugin-metadata-snapshot.types.js";
import type { LoadPluginRegistryParams, PluginRegistrySnapshot } from "./plugin-registry.js";
import type { ProviderDiscoveryOrder, ProviderPlugin } from "./types.js";
/** Options for resolving plugin providers that can contribute model catalog entries. */
export type ResolveRuntimePluginDiscoveryProvidersParams = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    includeUntrustedWorkspacePlugins?: boolean;
    requireCompleteDiscoveryEntryCoverage?: boolean;
    discoveryEntriesOnly?: boolean;
    includeManifestModelCatalogProviders?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
};
export type ResolveInstalledPluginProviderContributionIdsParams = LoadPluginRegistryParams & {
    index?: PluginRegistrySnapshot;
    includeDisabled?: boolean;
};
/** Lists provider ids advertised by installed manifests, including disabled entries when requested. */
export declare function resolveInstalledPluginProviderContributionIds(params?: ResolveInstalledPluginProviderContributionIdsParams): string[];
/** Loads provider runtime discovery and filters to providers that can produce catalog order entries. */
export declare function resolveRuntimePluginDiscoveryProviders(params: ResolveRuntimePluginDiscoveryProvidersParams): Promise<ProviderPlugin[]>;
/** Groups plugin providers into stable discovery phases for catalog probing. */
export declare function groupPluginDiscoveryProvidersByOrder(providers: ProviderPlugin[]): Record<ProviderDiscoveryOrder, ProviderPlugin[]>;
/** Matches a normalized provider filter against all provider-owned identifiers. */
export declare function providerMatchesFilter(params: {
    provider: Pick<ProviderPlugin, "id" | "aliases" | "hookAliases">;
    providerFilter: string;
}): boolean;
/** Normalizes a plugin discovery response into safe provider-config keys. */
export declare function normalizePluginDiscoveryResult(params: {
    provider: ProviderPlugin;
    result: {
        provider: ModelProviderConfig;
    } | {
        providers: Record<string, ModelProviderConfig>;
    } | null | undefined;
}): Record<string, ModelProviderConfig>;
export declare function runProviderCatalog(params: {
    provider: ProviderPlugin;
    config: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
    resolveProviderApiKey: (providerId?: string) => {
        apiKey: string | undefined;
        discoveryApiKey?: string;
    };
    resolveProviderAuth: (providerId?: string, options?: {
        oauthMarker?: string;
    }) => {
        apiKey: string | undefined;
        discoveryApiKey?: string;
        mode: "api_key" | "aws-sdk" | "oauth" | "token" | "none";
        source: "env" | "profile" | "none";
        profileId?: string;
    };
}): Promise<import("./types.js").ProviderCatalogResult> | undefined;
export declare function runProviderStaticCatalog(params: {
    provider: ProviderPlugin;
    config: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
}): Promise<import("./types.js").ProviderCatalogResult> | undefined;
