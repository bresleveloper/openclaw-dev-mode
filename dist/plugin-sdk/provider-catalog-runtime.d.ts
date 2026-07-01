import { n as PluginManifestRegistry } from "./manifest-registry-B03IrHXx.js";
import { n as PluginMetadataSnapshot, t as PluginMetadataRegistryView } from "./plugin-metadata-snapshot.types-DJKUP8I2.js";
import { Ud as augmentModelCatalogWithProviderPlugins, cn as ProviderPlugin } from "./types-CXLy55Xw.js";
import { t as PluginLoadOptions } from "./loader-CyI45paQ.js";

//#region src/plugins/providers.d.ts
declare function resolveOwningPluginIdsForProvider(params: {
  provider: string;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "owners" | "manifestRegistry" | "byPluginId">;
}): string[] | undefined;
declare function resolveCatalogHookProviderPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): string[];
//#endregion
//#region src/plugins/providers.runtime.d.ts
declare function isPluginProvidersLoadInFlight(params: Parameters<typeof resolvePluginProviders>[0]): boolean;
declare function resolvePluginProviders(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string; /** Use an explicit env when plugin roots should resolve independently from process.env. */
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
}): ProviderPlugin[];
//#endregion
export { augmentModelCatalogWithProviderPlugins, isPluginProvidersLoadInFlight, resolveCatalogHookProviderPluginIds, resolveOwningPluginIdsForProvider, resolvePluginProviders };