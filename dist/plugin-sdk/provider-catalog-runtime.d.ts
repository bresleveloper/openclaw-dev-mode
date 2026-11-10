import "../types-D7I_F5Ux.js";
import { Am as PluginRegistry, Km as ProviderPlugin, bo as PluginLoadOptions, yo as augmentModelCatalogWithProviderPlugins } from "../config-contracts-CY87ANNp.js";
import { n as PluginManifestRegistry } from "../manifest-registry-DcAsDGQ5.js";
import { a as DeclaredProviderOwnerIndex, n as PluginMetadataRegistryView, r as PluginMetadataSnapshot, t as PluginRegistrySnapshot } from "../plugin-metadata-snapshot-C_ou8VB5.js";
import "../config-state-DeFJNtp3.js";
//#region src/plugins/providers.runtime.d.ts
declare const { isPluginProvidersLoadInFlight, resolvePluginProviderRegistryCore, resolvePluginProvidersCore }: Readonly<{
  isPluginProvidersLoadInFlight: (params: Parameters<(params: Parameters<(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: readonly string[];
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
    onlyPluginIds?: readonly string[];
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
    pluginIds: readonly string[] | undefined;
    workspaceDir: string | undefined;
    manifestRegistry: PluginManifestRegistry | undefined;
    onlyPluginIds: readonly string[] | undefined;
    providerRefs: readonly string[] | undefined;
    projectedPluginIds: string[] | undefined;
    declaredProviderOwners: DeclaredProviderOwnerIndex;
    providerOwners: {
      provider: string;
      ownerPluginIds: readonly string[];
      providerPluginIds: readonly string[];
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
    onlyPluginIds?: readonly string[];
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
    onlyPluginIds?: readonly string[];
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
    pluginIds: readonly string[] | undefined;
    workspaceDir: string | undefined;
    manifestRegistry: PluginManifestRegistry | undefined;
    onlyPluginIds: readonly string[] | undefined;
    providerRefs: readonly string[] | undefined;
    projectedPluginIds: string[] | undefined;
    declaredProviderOwners: DeclaredProviderOwnerIndex;
    providerOwners: {
      provider: string;
      ownerPluginIds: readonly string[];
      providerPluginIds: readonly string[];
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
    onlyPluginIds?: readonly string[];
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
    onlyPluginIds?: readonly string[];
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
    pluginIds: readonly string[] | undefined;
    workspaceDir: string | undefined;
    manifestRegistry: PluginManifestRegistry | undefined;
    onlyPluginIds: readonly string[] | undefined;
    providerRefs: readonly string[] | undefined;
    projectedPluginIds: string[] | undefined;
    declaredProviderOwners: DeclaredProviderOwnerIndex;
    providerOwners: {
      provider: string;
      ownerPluginIds: readonly string[];
      providerPluginIds: readonly string[];
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
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry">;
};
export declare function resolveOwningPluginIdsForProvider(params: ProviderOwnershipLookupParams): readonly string[] | undefined;
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