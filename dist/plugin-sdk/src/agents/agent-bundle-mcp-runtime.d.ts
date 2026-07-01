import type { jsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { SessionMcpRuntime, SessionMcpRuntimeManager } from "./agent-bundle-mcp-types.js";
type CreateSessionMcpRuntime = (params: Parameters<typeof createSessionMcpRuntime>[0] & {
    configFingerprint?: string;
}) => SessionMcpRuntime;
export declare function createBundleMcpJsonSchemaValidator(): jsonSchemaValidator;
declare function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs?: number): void;
/**
 * Loads enabled MCP config metadata for a session without creating runtimes,
 * connecting transports, or issuing MCP tools/list requests.
 */
export declare function resolveSessionMcpConfigSummary(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): {
    fingerprint: string;
    serverNames: string[];
};
declare function resolveSessionMcpRuntimeIdleTtlMs(cfg?: OpenClawConfig): number;
export declare function createSessionMcpRuntime(params: {
    sessionId: string;
    sessionKey?: string;
    workspaceDir: string;
    cfg?: OpenClawConfig;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): SessionMcpRuntime;
declare function createSessionMcpRuntimeManager(opts?: {
    createRuntime?: CreateSessionMcpRuntime;
    now?: () => number;
    enableIdleSweepTimer?: boolean;
    idleSweepIntervalMs?: number;
}): SessionMcpRuntimeManager;
export declare function getSessionMcpRuntimeManager(): SessionMcpRuntimeManager;
export declare function getOrCreateSessionMcpRuntime(params: {
    sessionId: string;
    sessionKey?: string;
    workspaceDir: string;
    cfg?: OpenClawConfig;
}): Promise<SessionMcpRuntime>;
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
export declare function peekSessionMcpRuntime(params: {
    sessionId?: string | null;
    sessionKey?: string | null;
}): SessionMcpRuntime | undefined;
export declare function disposeSessionMcpRuntime(sessionId: string): Promise<void>;
export declare function retireSessionMcpRuntime(params: {
    sessionId?: string | null;
    reason: string;
    onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
export declare function retireSessionMcpRuntimeForSessionKey(params: {
    sessionKey?: string | null;
    reason: string;
    onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
export declare function disposeAllSessionMcpRuntimes(): Promise<void>;
export declare const testing: {
    createSessionMcpRuntimeManager: typeof createSessionMcpRuntimeManager;
    resetSessionMcpRuntimeManager(): Promise<void>;
    getCachedSessionIds(): string[];
    setBundleMcpCatalogListTimeoutMsForTest: typeof setBundleMcpCatalogListTimeoutMsForTest;
    resolveSessionMcpRuntimeIdleTtlMs: typeof resolveSessionMcpRuntimeIdleTtlMs;
};
export { testing as __testing };
