import { Ht as PluginRegistry, Yb as PluginLoadOptions, Zb as ProviderPlugin, dk as PluginRegistrySnapshot, fk as PluginMetadataRegistryView, mk as DeclaredProviderOwnerIndex, pk as PluginMetadataSnapshot, tx as ProviderAugmentModelCatalogContext } from "../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { n as PluginManifestRegistry } from "../manifest-registry-CNNq5Vj2.js";
import { C as ModelCatalogEntry } from "../provider-context-BvC7EnIY.js";
import { i as NormalizePluginId } from "../config-activation-shared-DnlSzxwJ.js";
declare const { isPluginProvidersLoadInFlight, resolvePluginProviderRegistryCore, resolvePluginProvidersCore, withPluginProviders }: Readonly<{
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
  withPluginProviderRegistry: <T>(params: Parameters<(params: {
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
  }> | undefined>[0] & {
    mode: "setup" | "runtime";
  }, run: (selection: ReturnType<(registry: PluginRegistry, base: ReturnType<(params: {
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
  }> | undefined) => Promise<T>) => Promise<T>;
  withPluginProviders: <T>(params: Parameters< <T_1>(params: Parameters<(params: {
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
  }> | undefined>[0] & {
    mode: "setup" | "runtime";
  }, run: (selection: ReturnType<(registry: PluginRegistry, base: ReturnType<(params: {
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
  }> | undefined) => Promise<T_1>) => Promise<T_1>>[0], run: (providers: ProviderPlugin[]) => Promise<T>) => Promise<T>;
}>;
type CatalogHookParams = {
  providerIds?: readonly string[];
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  metadataSnapshot?: PluginMetadataSnapshot;
};
export declare function augmentModelCatalogWithProviderPlugins(params: CatalogHookParams & {
  context: ProviderAugmentModelCatalogContext;
}): Promise<ModelCatalogEntry[]>;
type ProviderManifestLoadParams = {
  /** Prepared resolver for this exact installed index and manifest view. */
  normalizePluginId?: NormalizePluginId;
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
export declare function resolveCatalogHookProviderPluginIds(params: Pick<ProviderManifestLoadParams, "config" | "workspaceDir" | "env" | "metadataSnapshot">): string[];
/** Bare provider callbacks retain borrowed resources until their SDK host closes. */
declare function resolvePluginProvidersForSdk(params: Parameters<typeof resolvePluginProvidersCore>[0]): ProviderPlugin[];
export { isPluginProvidersLoadInFlight, resolvePluginProvidersForSdk as resolvePluginProviders };