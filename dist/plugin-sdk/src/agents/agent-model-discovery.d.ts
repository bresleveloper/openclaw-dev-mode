import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type DiscoverAuthStorageOptions } from "./agent-auth-discovery.js";
import type { PluginModelCatalogMetadataSnapshot } from "./plugin-model-catalog.js";
import { type AuthStorage as AgentAuthStorage, type ModelRegistry as AgentModelRegistry } from "./sessions/index.js";
type DiscoverModelsOptions = {
    config?: OpenClawConfig;
    providerFilter?: string;
    pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
    workspaceDir?: string;
    normalizeModels?: boolean;
};
/** Applies plugin model normalization and transport hooks to discovered agent models. */
export declare function normalizeDiscoveredAgentModel<T>(value: T, agentDir: string): T;
/** Creates auth storage for model discovery from stored and env-backed credentials. */
/** Builds auth storage for model discovery without prompting for secrets. */
export declare function discoverAuthStorage(agentDir: string, options?: DiscoverAuthStorageOptions): AgentAuthStorage;
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
export declare function discoverModels(authStorage: AgentAuthStorage, agentDir: string, options?: DiscoverModelsOptions): AgentModelRegistry;
export { addEnvBackedAgentCredentials, resolveAgentCredentialsForDiscovery, type DiscoverAuthStorageOptions, } from "./agent-auth-discovery.js";
