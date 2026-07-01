/**
 * Builds session tool allowlists from registered and core tool names.
 */
import type { AgentTool } from "../runtime/index.js";
import type { ClientToolDefinition } from "./run/params.js";
/**
 * OpenClaw built-in tools that remain present in the embedded runtime even when
 * OpenClaw routes execution through custom tool definitions.
 */
export declare const AGENT_RESERVED_TOOL_NAMES: string[];
export declare function collectAllowedToolNames(params: {
    tools: AgentTool[];
    clientTools?: ClientToolDefinition[];
}): Set<string>;
/**
 * Collect the exact tool names registered with the embedded agent for this session.
 */
export declare function collectRegisteredToolNames(tools: Array<{
    name?: string;
}>): Set<string>;
export declare function collectCoreBuiltinToolNames(tools: Array<{
    name?: string;
}>, options?: {
    isPluginTool?: (tool: {
        name?: string;
    }) => boolean;
}): Set<string>;
export declare function toSessionToolAllowlist(allowedToolNames: Iterable<string>): string[];
