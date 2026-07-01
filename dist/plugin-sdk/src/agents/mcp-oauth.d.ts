import { type OAuthClientProvider } from "@modelcontextprotocol/sdk/client/auth.js";
import type { FetchLike } from "@modelcontextprotocol/sdk/shared/transport.js";
type McpOAuthConfig = {
    scope?: unknown;
    redirectUrl?: unknown;
    clientMetadataUrl?: unknown;
};
/** Persisted OAuth credential presence flags for one MCP server. */
export type McpOAuthCredentialsStatus = {
    hasTokens: boolean;
    hasClientInformation: boolean;
    hasCodeVerifier: boolean;
    hasDiscoveryState: boolean;
    hasLastAuthorizationUrl: boolean;
};
/** Creates the MCP SDK OAuth provider backed by OpenClaw's private store. */
export declare function createMcpOAuthClientProvider(params: {
    serverName: string;
    serverUrl: string;
    config?: McpOAuthConfig;
    onAuthorizationUrl?: (url: URL) => void | Promise<void>;
    allowAuthorizationRedirect?: boolean;
}): OAuthClientProvider;
/** Deletes stored OAuth credentials for one MCP server. */
export declare function clearMcpOAuthCredentials(params: {
    serverName: string;
    serverUrl: string;
}): Promise<void>;
/** Reads stored OAuth credential presence without exposing credential values. */
export declare function readMcpOAuthCredentialsStatus(params: {
    serverName: string;
    serverUrl: string;
}): Promise<McpOAuthCredentialsStatus>;
/** Runs the MCP OAuth login flow, returning whether it authorized or needs redirect. */
export declare function runMcpOAuthLogin(params: {
    serverName: string;
    serverUrl: string;
    config?: McpOAuthConfig;
    authorizationCode?: string;
    fetchFn?: FetchLike;
    onAuthorizationUrl?: (url: URL) => void | Promise<void>;
}): Promise<"authorized" | "redirect">;
export {};
