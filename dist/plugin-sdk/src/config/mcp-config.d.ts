import { normalizeConfiguredMcpServers } from "./mcp-config-normalize.js";
import type { OpenClawConfig } from "./types.openclaw.js";
type ConfigMcpServers = ReturnType<typeof normalizeConfiguredMcpServers>;
type ConfigMcpReadResult = {
    ok: true;
    path: string;
    config: OpenClawConfig;
    mcpServers: ConfigMcpServers;
    baseHash?: string;
} | {
    ok: false;
    path: string;
    error: string;
};
type ConfigMcpWriteResult = {
    ok: true;
    path: string;
    config: OpenClawConfig;
    mcpServers: ConfigMcpServers;
    removed?: boolean;
    updated?: boolean;
} | {
    ok: false;
    path: string;
    error: string;
};
/** Include/exclude tool selection stored for a configured MCP server. */
type McpServerToolSelection = {
    include?: string[];
    exclude?: string[];
};
export declare function listConfiguredMcpServers(): Promise<ConfigMcpReadResult>;
export declare function updateConfiguredMcpServerTools(params: {
    name: string;
    tools: McpServerToolSelection | null;
}): Promise<ConfigMcpWriteResult>;
export declare function updateConfiguredMcpServer(params: {
    name: string;
    update: (server: Record<string, unknown>) => Record<string, unknown>;
}): Promise<ConfigMcpWriteResult>;
export declare function setConfiguredMcpServer(params: {
    name: string;
    server: unknown;
}): Promise<ConfigMcpWriteResult>;
export declare function unsetConfiguredMcpServer(params: {
    name: string;
}): Promise<ConfigMcpWriteResult>;
export {};
