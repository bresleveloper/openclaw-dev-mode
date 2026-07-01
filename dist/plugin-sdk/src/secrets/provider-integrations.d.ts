import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ManualExecSecretProviderConfig, PluginIntegrationSecretProviderConfig } from "../config/types.secrets.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
/** Secret provider preset exposed by an active trusted plugin integration. */
export type SecretProviderIntegrationPreset = {
    id: string;
    pluginId: string;
    providerAlias: string;
    displayName: string;
    description?: string;
    providerConfig: PluginIntegrationSecretProviderConfig;
};
/** Result of materializing a plugin integration into a manual exec provider config. */
export type SecretProviderIntegrationResolution = {
    ok: true;
    providerConfig: ManualExecSecretProviderConfig;
} | {
    ok: false;
    reason: string;
};
/** Narrows a secret provider config to the plugin-integration exec shape. */
export declare function isPluginIntegrationSecretProviderConfig(value: unknown): value is PluginIntegrationSecretProviderConfig;
/** Materializes an active trusted plugin secret-provider integration into an exec provider. */
/** Resolves a trusted plugin secret-provider integration into executable provider config. */
export declare function resolveSecretProviderIntegrationConfig(params: {
    manifestRegistry: Pick<PluginManifestRegistry, "plugins">;
    providerAlias: string;
    providerConfig: PluginIntegrationSecretProviderConfig;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): SecretProviderIntegrationResolution;
/** Lists plugin secret-provider presets available to interactive configure flows. */
export declare function listSecretProviderIntegrationPresets(params: {
    manifestRegistry: Pick<PluginManifestRegistry, "plugins">;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): SecretProviderIntegrationPreset[];
