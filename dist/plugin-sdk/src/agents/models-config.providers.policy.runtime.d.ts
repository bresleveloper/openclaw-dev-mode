import type { ProviderConfig } from "./models-config.providers.secrets.js";
/** Apply provider native-streaming usage compatibility policy. */
export declare function applyProviderNativeStreamingUsagePolicy(providerKey: string, provider: ProviderConfig): ProviderConfig;
/** Normalize provider config through any already-available plugin policy hook. */
export declare function normalizeProviderConfigPolicy(providerKey: string, provider: ProviderConfig): ProviderConfig;
/** Resolve a provider API-key policy function from already-available plugin hooks. */
export declare function resolveProviderConfigApiKeyPolicy(providerKey: string, provider?: ProviderConfig): ((env: NodeJS.ProcessEnv) => string | undefined) | undefined;
