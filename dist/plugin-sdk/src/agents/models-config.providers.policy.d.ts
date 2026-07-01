import type { ProviderConfig } from "./models-config.providers.secrets.js";
/**
 * Provider-specific config policy adapters.
 *
 * Runtime policy rules live in the sibling runtime module; this file exposes the
 * small stable API used by models-config loading and tests.
 */
/** Applies native-streaming usage compatibility policy to the provider map. */
export declare function applyNativeStreamingUsageCompat(providers: Record<string, ProviderConfig>): Record<string, ProviderConfig>;
/** Normalizes a provider config according to provider-specific runtime policy. */
export declare function normalizeProviderSpecificConfig(providerKey: string, provider: ProviderConfig): ProviderConfig;
/** Resolves a provider-specific API key env lookup policy when one exists. */
export declare function resolveProviderConfigApiKeyResolver(providerKey: string, provider?: ProviderConfig): ((env: NodeJS.ProcessEnv) => string | undefined) | undefined;
