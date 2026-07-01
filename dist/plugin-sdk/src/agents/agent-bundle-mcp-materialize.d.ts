import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { BundleMcpToolRuntime, McpCatalogTool, McpToolCatalog, SessionMcpRuntime } from "./agent-bundle-mcp-types.js";
import type { AnyAgentTool } from "./tools/common.js";
/**
 * Projects an already-listed MCP catalog into agent tools. Without `createExecute`,
 * the projected tools are inventory-only and throw if execution is attempted.
 */
export declare function buildBundleMcpToolsFromCatalog(params: {
    catalog: McpToolCatalog;
    reservedToolNames?: Iterable<string>;
    createExecute?: (tool: McpCatalogTool) => AnyAgentTool["execute"];
    createResourceListExecute?: (serverName: string) => AnyAgentTool["execute"];
    createResourceReadExecute?: (serverName: string) => AnyAgentTool["execute"];
    createPromptListExecute?: (serverName: string) => AnyAgentTool["execute"];
    createPromptGetExecute?: (serverName: string) => AnyAgentTool["execute"];
}): AnyAgentTool[];
export declare function materializeBundleMcpToolsForRun(params: {
    runtime: SessionMcpRuntime;
    reservedToolNames?: Iterable<string>;
    disposeRuntime?: () => Promise<void>;
}): Promise<BundleMcpToolRuntime>;
export declare function createBundleMcpToolRuntime(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
    reservedToolNames?: Iterable<string>;
    createRuntime?: (params: {
        sessionId: string;
        workspaceDir: string;
        cfg?: OpenClawConfig;
    }) => SessionMcpRuntime;
}): Promise<BundleMcpToolRuntime>;
