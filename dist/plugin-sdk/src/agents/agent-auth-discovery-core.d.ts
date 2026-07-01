/** Env/config-backed credential discovery shared by agent auth discovery modes. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AgentCredentialMap } from "./agent-auth-credentials.js";
/** Options for discovering env-backed credentials during agent auth discovery. */
export type AgentDiscoveryAuthLookupOptions = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
};
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
export declare function addEnvBackedAgentCredentials(credentials: AgentCredentialMap, options?: AgentDiscoveryAuthLookupOptions): AgentCredentialMap;
