import { type BundleMcpConfig, type BundleMcpServerConfig } from "../plugins/bundle-mcp.js";
import type { CodexBundleMcpThreadConfig, CodexMcpServersConfig, LoadCodexBundleMcpThreadConfigParams } from "./codex-mcp-config.types.js";
export type { CodexBundleMcpThreadConfig, CodexMcpServersConfig, LoadCodexBundleMcpThreadConfigParams, } from "./codex-mcp-config.types.js";
/** Normalizes one bundle MCP server into Codex's mcp_servers shape. */
export declare function normalizeCodexMcpServerConfig(name: string, server: BundleMcpServerConfig): Record<string, unknown>;
/** Build Codex `mcp_servers` config from normalized bundle MCP config. */
export declare function buildCodexMcpServersConfig(config: BundleMcpConfig): CodexMcpServersConfig;
/** Load bundle MCP config for one Codex app-server thread. */
export declare function loadCodexBundleMcpThreadConfig(params: LoadCodexBundleMcpThreadConfigParams): CodexBundleMcpThreadConfig;
