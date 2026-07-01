import type { OpenClawConfig } from "../config/types.js";
import type { PluginWebFetchProviderEntry, WebFetchProviderToolDefinition } from "../plugins/types.js";
import type { RuntimeWebFetchMetadata } from "../secrets/runtime-web-tools.types.js";
type ResolveWebFetchDefinitionParams = {
    config?: OpenClawConfig;
    sandboxed?: boolean;
    runtimeWebFetch?: RuntimeWebFetchMetadata;
    providerId?: string;
    preferRuntimeProviders?: boolean;
};
/** Reports whether a web_fetch provider has usable credentials. */
export declare function isWebFetchProviderConfigured(params: {
    provider: Pick<PluginWebFetchProviderEntry, "envVars" | "getConfiguredCredentialFallback" | "getConfiguredCredentialValue" | "getCredentialValue" | "requiresCredential">;
    config?: OpenClawConfig;
}): boolean;
/** Lists web_fetch providers available to runtime selection. */
export declare function listWebFetchProviders(params?: {
    config?: OpenClawConfig;
}): PluginWebFetchProviderEntry[];
/** Resolves the executable web_fetch provider tool definition. */
export declare function resolveWebFetchDefinition(options?: ResolveWebFetchDefinitionParams): {
    provider: PluginWebFetchProviderEntry;
    definition: WebFetchProviderToolDefinition;
} | null;
export {};
