import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { InstalledPluginIndex } from "./installed-plugin-index.js";
import type { PluginManifestRegistry } from "./manifest-registry.js";
import { type PluginMetadataSnapshot } from "./plugin-metadata-snapshot.js";
import type { PluginMetadataSnapshotPluginIdScope } from "./plugin-metadata-snapshot.types.js";
import type { PluginRegistrySnapshot } from "./plugin-registry-snapshot.js";
export type GatewayStartupPluginPlan = {
    channelPluginIds: readonly string[];
    configuredDeferredChannelPluginIds: readonly string[];
    pluginIds: readonly string[];
};
export type MemoryEmbeddingStartupProviderSource = "provider" | "fallback";
export type ConfiguredMemoryEmbeddingStartupProviderOwner = {
    /** Raw memory-search provider id as configured (normalized). */
    configuredId: string;
    /**
     * Adapter ids a plugin can own for this provider: the configured id plus its
     * `models.providers.<id>.api` owner when a custom provider maps to one.
     */
    ownerIds: ReadonlySet<string>;
    source: MemoryEmbeddingStartupProviderSource;
};
/**
 * Collect explicit memory embedding provider owners required by startup. The
 * resolver mirrors runtime memory-search inheritance for enablement, primary
 * provider, and fallback provider, then maps custom `models.providers` ids to
 * their API-owner adapter ids.
 */
export declare function collectConfiguredMemoryEmbeddingStartupProviderOwners(config: OpenClawConfig): ConfiguredMemoryEmbeddingStartupProviderOwner[];
/**
 * Collect configured memory embedding provider ids that map to a plugin-owned
 * memory embedding provider contract, including the resolved `api` owner for
 * custom `models.providers` ids so the owning plugin loads at startup.
 */
export declare function collectConfiguredMemoryEmbeddingProviderIds(config: OpenClawConfig): ReadonlySet<string>;
/**
 * Report configured memory embedding providers that no loaded plugin can serve.
 * A provider is unregistered only when none of its resolved adapter ids (the
 * configured id and its `models.providers.<id>.api` owner) was registered, so
 * custom providers warn when their API-owner plugin is missing but stay quiet
 * once that plugin loads.
 */
export declare function collectUnregisteredConfiguredMemoryEmbeddingProviders(params: {
    config: OpenClawConfig;
    registeredProviderIds: ReadonlySet<string>;
}): Array<{
    configuredId: string;
    source: MemoryEmbeddingStartupProviderSource;
}>;
export declare function resolveGatewayStartupMetadataPluginIds(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    index: InstalledPluginIndex;
    platform?: NodeJS.Platform;
}): string[] | undefined;
export declare function createGatewayStartupMetadataPluginIdScope(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
}): PluginMetadataSnapshotPluginIdScope;
export declare function resolveConfigValidationMetadataPluginIds(params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    index: InstalledPluginIndex;
    platform?: NodeJS.Platform;
}): string[] | undefined;
export declare function createConfigValidationMetadataPluginIdScope(params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
}): PluginMetadataSnapshotPluginIdScope;
export declare function isMetadataSnapshotScopedForGatewayStartup(params: {
    metadataSnapshot: Pick<PluginMetadataSnapshot, "index" | "pluginIds">;
    pluginIdScope: PluginMetadataSnapshotPluginIdScope;
}): boolean;
export declare function resolveChannelPluginIds(params: {
    config: OpenClawConfig;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
}): string[];
export declare function resolveChannelPluginIdsFromRegistry(params: {
    manifestRegistry: PluginManifestRegistry;
}): string[];
export declare function resolveConfiguredDeferredChannelPluginIdsFromRegistry(params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    index: PluginRegistrySnapshot;
    manifestRegistry: PluginManifestRegistry;
}): string[];
export declare function resolveConfiguredDeferredChannelPluginIds(params: {
    config: OpenClawConfig;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
}): string[];
export declare function resolveGatewayStartupPluginPlanFromRegistry(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    index: PluginRegistrySnapshot;
    manifestRegistry: PluginManifestRegistry;
    platform?: NodeJS.Platform;
}): GatewayStartupPluginPlan;
export declare function resolveGatewayStartupPluginIdsFromRegistry(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    index: PluginRegistrySnapshot;
    manifestRegistry: PluginManifestRegistry;
    platform?: NodeJS.Platform;
}): string[];
export declare function loadGatewayStartupPluginPlan(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
    index?: PluginRegistrySnapshot;
    metadataSnapshot?: PluginMetadataSnapshot;
    platform?: NodeJS.Platform;
}): GatewayStartupPluginPlan;
export declare function resolveGatewayStartupPluginIds(params: {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
}): string[];
