import type { FetchLike } from "@modelcontextprotocol/sdk/shared/transport.js";
/** Builds an MCP fetch function with optional TLS/client-cert dispatcher support. */
export declare function buildMcpHttpFetch(params: {
    sslVerify?: boolean;
    clientCert?: string;
    clientKey?: string;
    resourceUrl?: string;
}): FetchLike;
/** Removes Authorization from MCP headers before forwarding to non-authorized paths. */
export declare function withoutMcpAuthorizationHeader(headers: Record<string, string> | undefined): Record<string, string> | undefined;
/** Wraps MCP fetch so configured headers are applied only to the resource origin. */
export declare function withSameOriginMcpHttpHeaders(params: {
    fetchFn: FetchLike;
    headers: Record<string, string> | undefined;
    resourceUrl: string;
}): FetchLike;
