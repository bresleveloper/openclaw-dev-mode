import { type AgentCredentialMap } from "./agent-auth-credentials.js";
import { type AgentDiscoveryAuthLookupOptions } from "./agent-auth-discovery-core.js";
import type { ExternalCliAuthDiscovery } from "./auth-profiles/external-cli-discovery.js";
/** Options for discovering credentials without prompting for secret material. */
export type DiscoverAuthStorageOptions = {
    externalCli?: ExternalCliAuthDiscovery;
    readOnly?: boolean;
    skipExternalAuthProfiles?: boolean;
    skipCredentials?: boolean;
    syntheticAuthProviderRefs?: Iterable<string>;
} & AgentDiscoveryAuthLookupOptions;
/** Resolves agent credentials from auth profiles, env, and synthetic auth hooks. */
export declare function resolveAgentCredentialsForDiscovery(agentDir: string, options?: DiscoverAuthStorageOptions): AgentCredentialMap;
export { addEnvBackedAgentCredentials } from "./agent-auth-discovery-core.js";
