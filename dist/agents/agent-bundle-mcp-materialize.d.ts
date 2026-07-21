import { i as OpenClawConfig } from "../types.openclaw-B5gtuEn_.js";
import { r as AnyAgentTool } from "../common-CZ-od2BP.js";
import { i as SessionMcpRuntime, n as McpCatalogTool, r as McpToolCatalog, t as BundleMcpToolRuntime } from "../agent-bundle-mcp-types-B6KhN2ZS.js";

//#region src/agents/agent-bundle-mcp-materialize.d.ts
/**
 * Projects an already-listed MCP catalog into agent tools. Without `createExecute`,
 * the projected tools are inventory-only and throw if execution is attempted.
 */
declare function buildBundleMcpToolsFromCatalog(params: {
  catalog: McpToolCatalog;
  reservedToolNames?: Iterable<string>;
  createExecute?: (tool: McpCatalogTool) => AnyAgentTool["execute"];
  createResourceListExecute?: (serverName: string) => AnyAgentTool["execute"];
  createResourceReadExecute?: (serverName: string) => AnyAgentTool["execute"];
  createPromptListExecute?: (serverName: string) => AnyAgentTool["execute"];
  createPromptGetExecute?: (serverName: string) => AnyAgentTool["execute"];
}): AnyAgentTool[];
declare function materializeBundleMcpToolsForRun(params: {
  runtime: SessionMcpRuntime;
  reservedToolNames?: Iterable<string>;
  disposeRuntime?: () => Promise<void>;
}): Promise<BundleMcpToolRuntime>;
declare function createBundleMcpToolRuntime(params: {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  reservedToolNames?: Iterable<string>;
  createRuntime?: (params: {
    sessionId: string;
    workspaceDir: string;
    cfg?: OpenClawConfig;
  }) => SessionMcpRuntime;
}): Promise<BundleMcpToolRuntime>;
//#endregion
export { buildBundleMcpToolsFromCatalog, createBundleMcpToolRuntime, materializeBundleMcpToolsForRun };