import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginWebSearchProviderEntry } from "../plugins/types.js";
import type { RunWebSearchParams, RunWebSearchResult, RuntimeWebSearchConfig as WebSearchConfig } from "./runtime-types.js";
/** Reports whether a web_search provider has usable configured credentials. */
export declare function isWebSearchProviderConfigured(params: {
    provider: Pick<PluginWebSearchProviderEntry, "credentialPath" | "id" | "authProviderId" | "envVars" | "getConfiguredCredentialValue" | "getConfiguredCredentialFallback" | "getCredentialValue" | "requiresCredential">;
    config?: OpenClawConfig;
}): boolean;
/** Lists runtime web_search providers after applying runtime config snapshots. */
export declare function listWebSearchProviders(params?: {
    config?: OpenClawConfig;
}): PluginWebSearchProviderEntry[];
/** Lists plugin-configured web_search providers without runtime-only providers. */
export declare function listConfiguredWebSearchProviders(params?: {
    config?: OpenClawConfig;
}): PluginWebSearchProviderEntry[];
/** Resolves configured or auto-detected web_search provider id. */
export declare function resolveWebSearchProviderId(params: {
    search?: WebSearchConfig;
    config?: OpenClawConfig;
    agentDir?: string;
    providers?: PluginWebSearchProviderEntry[];
}): string;
/** Executes web_search with fallback when selection was not explicit. */
export declare function runWebSearch(params: RunWebSearchParams): Promise<RunWebSearchResult>;
