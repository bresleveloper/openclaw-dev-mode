import { i as OpenClawConfig } from "../types.openclaw-DlpCUWMr.js";
import { n as PluginManifestRegistry } from "../manifest-registry-CggWNHxH.js";
import { a as SessionMcpRuntimeManager, i as SessionMcpRuntime } from "../agent-bundle-mcp-types-DfsgAjST.js";
import { jsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/types.js";

//#region src/agents/agent-bundle-mcp-runtime.d.ts
type CreateSessionMcpRuntime = (params: Parameters<typeof createSessionMcpRuntime>[0] & {
  configFingerprint?: string;
}) => SessionMcpRuntime;
declare function createBundleMcpJsonSchemaValidator(): jsonSchemaValidator;
declare function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs?: number): void;
/**
 * Loads enabled MCP config metadata for a session without creating runtimes,
 * connecting transports, or issuing MCP tools/list requests.
 */
declare function resolveSessionMcpConfigSummary(params: {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
}): {
  fingerprint: string;
  serverNames: string[];
};
declare function resolveSessionMcpRuntimeIdleTtlMs(cfg?: OpenClawConfig): number;
declare function createSessionMcpRuntime(params: {
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
declare function getSessionMcpRuntimeManager(): SessionMcpRuntimeManager;
declare function getOrCreateSessionMcpRuntime(params: {
  sessionId: string;
  sessionKey?: string;
  workspaceDir: string;
  cfg?: OpenClawConfig;
}): Promise<SessionMcpRuntime>;
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
declare function peekSessionMcpRuntime(params: {
  sessionId?: string | null;
  sessionKey?: string | null;
}): SessionMcpRuntime | undefined;
declare function disposeSessionMcpRuntime(sessionId: string): Promise<void>;
declare function retireSessionMcpRuntime(params: {
  sessionId?: string | null;
  reason: string;
  onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
declare function retireSessionMcpRuntimeForSessionKey(params: {
  sessionKey?: string | null;
  reason: string;
  onError?: (error: unknown, sessionId: string, reason: string) => void;
}): Promise<boolean>;
declare function disposeAllSessionMcpRuntimes(): Promise<void>;
declare const testing: {
  createSessionMcpRuntimeManager: typeof createSessionMcpRuntimeManager;
  resetSessionMcpRuntimeManager(): Promise<void>;
  getCachedSessionIds(): string[];
  setBundleMcpCatalogListTimeoutMsForTest: typeof setBundleMcpCatalogListTimeoutMsForTest;
  resolveSessionMcpRuntimeIdleTtlMs: typeof resolveSessionMcpRuntimeIdleTtlMs;
};
//#endregion
export { testing as __testing, testing, createBundleMcpJsonSchemaValidator, createSessionMcpRuntime, disposeAllSessionMcpRuntimes, disposeSessionMcpRuntime, getOrCreateSessionMcpRuntime, getSessionMcpRuntimeManager, peekSessionMcpRuntime, resolveSessionMcpConfigSummary, retireSessionMcpRuntime, retireSessionMcpRuntimeForSessionKey };