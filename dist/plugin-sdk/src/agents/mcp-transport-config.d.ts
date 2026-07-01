import { type HttpMcpTransportType } from "./mcp-http.js";
type ResolvedBaseMcpTransportConfig = {
    description: string;
    connectionTimeoutMs: number;
    requestTimeoutMs: number;
    supportsParallelToolCalls: boolean;
};
type ResolvedStdioMcpTransportConfig = ResolvedBaseMcpTransportConfig & {
    kind: "stdio";
    transportType: "stdio";
    command: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
};
type ResolvedHttpMcpTransportConfig = ResolvedBaseMcpTransportConfig & {
    kind: "http";
    transportType: HttpMcpTransportType;
    url: string;
    headers?: Record<string, string>;
    auth?: "oauth";
    oauth?: Record<string, unknown>;
    sslVerify?: boolean;
    clientCert?: string;
    clientKey?: string;
};
type ResolvedMcpTransportConfig = ResolvedStdioMcpTransportConfig | ResolvedHttpMcpTransportConfig;
/** Resolve one MCP server's launch transport config, or null when unsupported. */
export declare function resolveMcpTransportConfig(serverName: string, rawServer: unknown): ResolvedMcpTransportConfig | null;
export {};
