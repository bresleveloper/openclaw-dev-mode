import { Ds as augmentModelCatalogWithProviderPlugins, au as PluginLoadOptions, lr as isPluginProvidersLoadInFlight, ol as ProviderPlugin, ur as resolvePluginProvidersCore } from "../agent-harness-runtime-wMciqZ6Z.js";
import "../types.openclaw-Ccmw-oTa.js";
import { b as PluginMetadataSnapshot, v as PluginRegistrySnapshot } from "../io-BuIvr25R.js";
import { n as PluginManifestRegistry } from "../manifest-registry-Dcw0apVk.js";
import "../config-normalization-shared-CpYK0hom.js";
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