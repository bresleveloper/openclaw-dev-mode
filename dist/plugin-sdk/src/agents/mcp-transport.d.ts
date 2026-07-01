import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
type ResolvedMcpTransport = {
    transport: Transport;
    description: string;
    transportType: "stdio" | "sse" | "streamable-http";
    connectionTimeoutMs: number;
    requestTimeoutMs: number;
    supportsParallelToolCalls: boolean;
    detachStderr?: () => void;
};
/** Resolves a configured MCP server into a live SDK transport instance. */
export declare function resolveMcpTransport(serverName: string, rawServer: unknown): ResolvedMcpTransport | null;
export {};
