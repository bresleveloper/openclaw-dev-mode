import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { ModelProviderConfig, OpenClawConfig } from "./types.js";
/** Applies bundled provider-owned normalization to one provider config during config defaults. */
export declare function normalizeProviderConfigForConfigDefaults(params: {
    provider: string;
    providerConfig: ModelProviderConfig;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): ModelProviderConfig;
/** Applies bundled provider-owned defaults to the full config when that provider has policy. */
export declare function applyProviderConfigDefaultsForConfig(params: {
    provider: string;
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): OpenClawConfig;
