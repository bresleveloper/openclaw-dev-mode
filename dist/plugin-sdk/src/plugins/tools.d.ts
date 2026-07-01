import type { AnyAgentTool } from "../agents/tools/common.js";
import type { PluginRegistry } from "./registry-types.js";
import type { OpenClawPluginToolContext } from "./types.js";
export { resetPluginToolDescriptorCache, resetPluginToolDescriptorCache as resetPluginToolFactoryCache, } from "./tool-descriptor-cache.js";
/** MCP bridge metadata attached to plugin tools surfaced through agent tool lists. */
export type PluginToolMcpMeta = {
    serverName: string;
    safeServerName: string;
    toolName: string;
    operation: "tool" | "resources_list" | "resources_read" | "prompts_list" | "prompts_get";
};
/** Runtime metadata used to trace an agent tool back to its owning plugin registration. */
export type PluginToolMeta = {
    pluginId: string;
    optional: boolean;
    replaySafe?: boolean;
    trustedLocalMedia?: boolean;
    mcp?: PluginToolMcpMeta;
};
/** Attaches plugin ownership metadata to a concrete agent tool instance. */
export declare function setPluginToolMeta(tool: AnyAgentTool, meta: PluginToolMeta): void;
/** Reads plugin ownership metadata for a concrete agent tool instance. */
export declare function getPluginToolMeta(tool: AnyAgentTool): PluginToolMeta | undefined;
/** Copies plugin ownership metadata when wrappers replace a tool object. */
export declare function copyPluginToolMeta(source: AnyAgentTool, target: AnyAgentTool): void;
/**
 * Builds a collision-proof key for plugin-owned tool metadata lookups.
 */
export declare function buildPluginToolMetadataKey(pluginId: string, toolName: string): string;
export declare function ensureStandalonePluginToolRegistryLoaded(params: {
    context: OpenClawPluginToolContext;
    toolAllowlist?: string[];
    toolDenylist?: string[];
    allowGatewaySubagentBinding?: boolean;
    hasAuthForProvider?: (providerId: string) => boolean;
    env?: NodeJS.ProcessEnv;
}): PluginRegistry | undefined;
export declare function resolvePluginTools(params: {
    context: OpenClawPluginToolContext;
    existingToolNames?: Set<string>;
    toolAllowlist?: string[];
    toolDenylist?: string[];
    suppressNameConflicts?: boolean;
    allowGatewaySubagentBinding?: boolean;
    hasAuthForProvider?: (providerId: string) => boolean;
    env?: NodeJS.ProcessEnv;
    runtimeRegistry?: PluginRegistry;
}): AnyAgentTool[];
