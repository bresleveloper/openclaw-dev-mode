import { i as OpenClawConfig } from "../types.openclaw-DlpCUWMr.js";
import { t as PluginMetadataRegistryView } from "../plugin-metadata-snapshot.types-Ce8glgog.js";
import { cn as ProviderPlugin } from "../types-BVLQjFJF.js";

//#region src/plugins/provider-discovery.runtime.d.ts
declare function clearProviderDiscoveryModuleLoaders(): void;
declare function resolvePluginDiscoveryProvidersRuntime(params: {
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
}): ProviderPlugin[];
//#endregion
export { clearProviderDiscoveryModuleLoaders, resolvePluginDiscoveryProvidersRuntime };