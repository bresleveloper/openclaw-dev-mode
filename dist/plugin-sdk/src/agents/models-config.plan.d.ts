/**
 * Plans root and plugin-owned model catalog writes. Setup and doctor flows use
 * this module to merge implicit provider discovery, explicit config, and
 * preserved secrets before touching models.json.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import { type ProviderConfig } from "./models-config.providers.js";
/** Dependency hook for resolving implicit model providers while planning models.json. */
export type ResolveImplicitProvidersForModelsJson = (params: {
    agentDir: string;
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    workspaceDir?: string;
    explicitProviders: Record<string, ProviderConfig>;
    pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners">;
    providerDiscoveryProviderIds?: readonly string[];
    providerDiscoveryTimeoutMs?: number;
    providerDiscoveryEntriesOnly?: boolean;
}) => Promise<Record<string, ProviderConfig>>;
/** Planned models.json write/noop/skip result plus plugin catalog sidecar writes. */
type ModelsJsonPlan = {
    action: "skip";
    pluginCatalogWrites?: Record<string, string>;
} | {
    action: "noop";
    pluginCatalogWrites?: Record<string, string>;
} | {
    action: "write";
    contents: string;
    pluginCatalogWrites?: Record<string, string>;
};
/** Resolves providers for models.json with injectable implicit-provider discovery. */
export declare function resolveProvidersForModelsJsonWithDeps(params: {
    cfg: OpenClawConfig;
    agentDir: string;
    env: NodeJS.ProcessEnv;
    workspaceDir?: string;
    pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners">;
    providerDiscoveryProviderIds?: readonly string[];
    providerDiscoveryTimeoutMs?: number;
    providerDiscoveryEntriesOnly?: boolean;
}, deps?: {
    resolveImplicitProviders?: ResolveImplicitProvidersForModelsJson;
}): Promise<Record<string, ProviderConfig>>;
/** Plans root and plugin-owned model catalog writes with injectable provider discovery. */
export declare function planOpenClawModelsJsonWithDeps(params: {
    cfg: OpenClawConfig;
    sourceConfigForSecrets?: OpenClawConfig;
    agentDir: string;
    env: NodeJS.ProcessEnv;
    workspaceDir?: string;
    existingRaw: string;
    existingParsed: unknown;
    pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners">;
    providerDiscoveryProviderIds?: readonly string[];
    providerDiscoveryTimeoutMs?: number;
    providerDiscoveryEntriesOnly?: boolean;
}, deps?: {
    resolveImplicitProviders?: ResolveImplicitProvidersForModelsJson;
}): Promise<ModelsJsonPlan>;
/** Plans root and plugin-owned model catalog writes for the current runtime. */
export declare function planOpenClawModelsJson(params: Parameters<typeof planOpenClawModelsJsonWithDeps>[0]): Promise<ModelsJsonPlan>;
export {};
