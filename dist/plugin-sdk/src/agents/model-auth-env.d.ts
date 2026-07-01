import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderAuthEvidence } from "../secrets/provider-env-vars.js";
export type EnvApiKeyResult = {
    apiKey: string;
    source: string;
};
export type EnvApiKeyLookupOptions = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    aliasMap?: Readonly<Record<string, string>>;
    candidateMap?: Readonly<Record<string, readonly string[]>>;
    authEvidenceMap?: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
    skipSetupProviderFallback?: boolean;
};
/** Resolve an API key or auth-evidence marker for a provider from environment state. */
export declare function resolveEnvApiKey(provider: string, env?: NodeJS.ProcessEnv, options?: EnvApiKeyLookupOptions): EnvApiKeyResult | null;
