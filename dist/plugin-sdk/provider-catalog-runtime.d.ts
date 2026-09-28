import { Ds as augmentModelCatalogWithProviderPlugins, au as PluginLoadOptions, lr as isPluginProvidersLoadInFlight, ol as ProviderPlugin, ur as resolvePluginProvidersCore } from "../agent-harness-runtime-CWL0fcg5.js";
import "../types.openclaw-LzSbb55e.js";
import { b as PluginMetadataSnapshot, v as PluginRegistrySnapshot } from "../io-VMpaZk90.js";
import { n as PluginManifestRegistry } from "../manifest-registry-CMnhqUB6.js";
import "../config-normalization-shared-ClBMaJ87.js";
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