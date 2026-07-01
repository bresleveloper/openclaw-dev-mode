import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AgentToolResultMiddleware, AgentToolResultMiddlewareRuntime } from "./agent-tool-result-middleware-types.js";
import { type NormalizedPluginsConfig, type PluginActivationConfigSource } from "./config-state.js";
import { type PluginManifestRegistry } from "./manifest-registry.js";
declare function listMiddlewareOwnerPluginIds(params: {
    manifestRegistry: PluginManifestRegistry;
    runtime: AgentToolResultMiddlewareRuntime;
    config: OpenClawConfig;
    pluginsConfig: NormalizedPluginsConfig;
    activationSource: PluginActivationConfigSource;
}): string[];
export declare function loadAgentToolResultMiddlewaresForRuntime(params: {
    runtime: AgentToolResultMiddlewareRuntime;
    config?: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    manifestRegistry?: PluginManifestRegistry;
}): Promise<AgentToolResultMiddleware[]>;
export declare const testing: {
    listMiddlewareOwnerPluginIds: typeof listMiddlewareOwnerPluginIds;
};
export { testing as __testing };
