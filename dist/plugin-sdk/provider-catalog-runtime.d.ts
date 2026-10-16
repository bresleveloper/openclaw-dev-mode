import "../types.openclaw-DWWUw8hA.js";
import { _ as PluginMetadataRegistryView, b as DeclaredProviderOwnerIndex, g as PluginRegistrySnapshot, v as PluginMetadataSnapshot } from "../io-CwO8iq4h.js";
import { n as PluginManifestRegistry } from "../manifest-registry-Bj1Q7bnt.js";
import { $o as PluginLoadOptions, Es as ProviderPlugin, Ji as PluginRegistry, Ki as augmentModelCatalogWithProviderPlugins } from "../agent-harness-runtime-DZjstJNb.js";
import "../config-activation-shared-Dd5FrI8x.js";
import "../plugin-entry-D4JWmN6h.js";
//#region src/plugins/providers.runtime.d.ts
declare const { isPluginProvidersLoadInFlight, resolvePluginProviderRegistryCore, resolvePluginProvidersCore }: Readonly<{
  isPluginProvidersLoadInFlight: (params: Parameters<(params: Parameters<(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    applyAutoEnable?: boolean;
    pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
    mode?: "runtime" | "setup";
    includeUntrustedWorkspacePlugins?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
    skipIfLoadInFlight?: boolean;
    registryScope?: "exact" | "loaded";
  }) => ReturnType<(registry: PluginRegistry, base: ReturnType<(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    applyAutoEnable?: boolean;
    pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
    mode?: "runtime" | "setup";
    includeUntrustedWorkspacePlugins?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
    skipIfLoadInFlight?: boolean;
    registryScope?: "exact" | "loaded";
  } & {
    env: NodeJS.ProcessEnv;
  }, manifestRegistry?: PluginLoadOptions["manifestRegistry"], declaredProviderOwners?: DeclaredProviderOwnerIndex, retained?: boolean) => {
    pluginIds: string[] | undefined;
    workspaceDir: string | undefined;
    manifestRegistry: PluginManifestRegistry | undefined;
    onlyPluginIds: string[] | undefined;
    providerRefs: readonly string[] | undefined;
    projectedPluginIds: string[] | undefined;
    declaredProviderOwners: DeclaredProviderOwnerIndex;
    providerOwners: {
      provider: string;
      ownerPluginIds: string[];
      providerPluginIds: string[];
      runtimePluginIds: string[];
    }[];
    providerRegistrationPluginIds: Set<string> | undefined;
    runtimeRegistrationPluginIds: Set<string> | undefined;
    unownedProviderRefs: readonly string[];
    explicitOwnerPluginIds: string[];
  }>, onlyPluginIds?: readonly string[]) => {
    registry: PluginRegistry;
    workspaceDir: string | undefined;
    onlyPluginIds: readonly string[] | undefined;
    isProviderOwnerEligible: (pluginId: string, provider: string) => boolean;
  }> | undefined>[0], onSelectedRegistry?: (registry: PluginRegistry) => ((provider: ProviderPlugin, pluginId: string) => ProviderPlugin) | undefined) => ProviderPlugin[]>[0]) => boolean;
  resolvePluginProviderRegistryCore: (params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    applyAutoEnable?: boolean;
    pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
    mode?: "runtime" | "setup";
    includeUntrustedWorkspacePlugins?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
    skipIfLoadInFlight?: boolean;
    registryScope?: "exact" | "loaded";
  }) => ReturnType<(registry: PluginRegistry, base: ReturnType<(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    applyAutoEnable?: boolean;
    pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
    mode?: "runtime" | "setup";
    includeUntrustedWorkspacePlugins?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
    skipIfLoadInFlight?: boolean;
    registryScope?: "exact" | "loaded";
  } & {
    env: NodeJS.ProcessEnv;
  }, manifestRegistry?: PluginLoadOptions["manifestRegistry"], declaredProviderOwners?: DeclaredProviderOwnerIndex, retained?: boolean) => {
    pluginIds: string[] | undefined;
    workspaceDir: string | undefined;
    manifestRegistry: PluginManifestRegistry | undefined;
    onlyPluginIds: string[] | undefined;
    providerRefs: readonly string[] | undefined;
    projectedPluginIds: string[] | undefined;
    declaredProviderOwners: DeclaredProviderOwnerIndex;
    providerOwners: {
      provider: string;
      ownerPluginIds: string[];
      providerPluginIds: string[];
      runtimePluginIds: string[];
    }[];
    providerRegistrationPluginIds: Set<string> | undefined;
    runtimeRegistrationPluginIds: Set<string> | undefined;
    unownedProviderRefs: readonly string[];
    explicitOwnerPluginIds: string[];
  }>, onlyPluginIds?: readonly string[]) => {
    registry: PluginRegistry;
    workspaceDir: string | undefined;
    onlyPluginIds: readonly string[] | undefined;
    isProviderOwnerEligible: (pluginId: string, provider: string) => boolean;
  }> | undefined;
  resolvePluginProvidersCore: (params: Parameters<(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    applyAutoEnable?: boolean;
    pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
    mode?: "runtime" | "setup";
    includeUntrustedWorkspacePlugins?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
    skipIfLoadInFlight?: boolean;
    registryScope?: "exact" | "loaded";
  }) => ReturnType<(registry: PluginRegistry, base: ReturnType<(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    providerRefs?: readonly string[];
    modelRefs?: readonly string[];
    activate?: boolean;
    cache?: boolean;
    applyAutoEnable?: boolean;
    pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
    mode?: "runtime" | "setup";
    includeUntrustedWorkspacePlugins?: boolean;
    pluginMetadataSnapshot?: PluginMetadataRegistryView;
    skipIfLoadInFlight?: boolean;
    registryScope?: "exact" | "loaded";
  } & {
    env: NodeJS.ProcessEnv;
  }, manifestRegistry?: PluginLoadOptions["manifestRegistry"], declaredProviderOwners?: DeclaredProviderOwnerIndex, retained?: boolean) => {
    pluginIds: string[] | undefined;
    workspaceDir: string | undefined;
    manifestRegistry: PluginManifestRegistry | undefined;
    onlyPluginIds: string[] | undefined;
    providerRefs: readonly string[] | undefined;
    projectedPluginIds: string[] | undefined;
    declaredProviderOwners: DeclaredProviderOwnerIndex;
    providerOwners: {
      provider: string;
      ownerPluginIds: string[];
      providerPluginIds: string[];
      runtimePluginIds: string[];
    }[];
    providerRegistrationPluginIds: Set<string> | undefined;
    runtimeRegistrationPluginIds: Set<string> | undefined;
    unownedProviderRefs: readonly string[];
    explicitOwnerPluginIds: string[];
  }>, onlyPluginIds?: readonly string[]) => {
    registry: PluginRegistry;
    workspaceDir: string | undefined;
    onlyPluginIds: readonly string[] | undefined;
    isProviderOwnerEligible: (pluginId: string, provider: string) => boolean;
  }> | undefined>[0], onSelectedRegistry?: (registry: PluginRegistry) => ((provider: ProviderPlugin, pluginId: string) => ProviderPlugin) | undefined) => ProviderPlugin[];
}>;
//#endregion
//#region src/plugins/providers.d.ts
type ProviderManifestLoadParams = {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  registry?: PluginRegistrySnapshot;
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry"> & Partial<Pick<PluginMetadataSnapshot, "owners" | "byPluginId">>;
};
type ProviderOwnershipLookupParams = {
  provider: string;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "owners" | "manifestRegistry" | "byPluginId">;
};
export declare function resolveOwningPluginIdsForProvider(params: ProviderOwnershipLookupParams): string[] | undefined;
export declare function resolveCatalogHookProviderPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  metadataSnapshot?: ProviderManifestLoadParams["metadataSnapshot"];
}): string[];
//#endregion
//#region src/plugin-sdk/provider-catalog-runtime.d.ts
/** Bare provider callbacks retain borrowed resources until their SDK host closes. */
declare function resolvePluginProvidersForSdk(params: Parameters<typeof resolvePluginProvidersCore>[0]): ProviderPlugin[];
//#endregion
export { augmentModelCatalogWithProviderPlugins, isPluginProvidersLoadInFlight, resolvePluginProvidersForSdk as resolvePluginProviders };