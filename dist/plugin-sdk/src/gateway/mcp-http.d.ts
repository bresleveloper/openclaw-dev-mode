export { createMcpLoopbackServerConfig, getActiveMcpLoopbackRuntime, resolveMcpLoopbackBearerToken, } from "./mcp-http.loopback-runtime.js";
type McpLoopbackServer = {
    port: number;
    close: () => Promise<void>;
};
/** Starts a new MCP loopback HTTP server and registers its bearer tokens. */
export declare function startMcpLoopbackServer(port?: number): Promise<{
    port: number;
    close: () => Promise<void>;
}>;
/** Returns the active MCP loopback server or starts one if none exists. */
export declare function ensureMcpLoopbackServer(port?: number): Promise<McpLoopbackServer>;
/** Closes the active MCP loopback server if one has been started. */
export declare function closeMcpLoopbackServer(): Promise<void>;
