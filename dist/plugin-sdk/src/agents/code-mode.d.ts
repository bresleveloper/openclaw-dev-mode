import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { HookContext } from "./agent-tools.before-tool-call.js";
import { type CodeModeNamespaceRuntime } from "./code-mode-namespaces.js";
import type { ToolDefinition } from "./sessions/index.js";
import { ToolSearchRuntime, type ToolSearchCatalogRef, type ToolSearchToolContext } from "./tool-search.js";
import { type AnyAgentTool } from "./tools/common.js";
export { CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME, isCodeModeControlTool, } from "./code-mode-control-tools.js";
type CodeModeLanguage = "javascript" | "typescript";
/** Resolved Code Mode runtime limits and visible language options. */
export type CodeModeConfig = {
    enabled: boolean;
    runtime: "quickjs-wasi";
    mode: "only";
    languages: CodeModeLanguage[];
    timeoutMs: number;
    memoryLimitBytes: number;
    maxOutputBytes: number;
    maxSnapshotBytes: number;
    maxPendingToolCalls: number;
    snapshotTtlSeconds: number;
    searchDefaultLimit: number;
    maxSearchLimit: number;
};
type CodeModeBridgeMethod = "search" | "describe" | "call" | "yield" | "namespace";
type PendingBridgeRequest = {
    id: string;
    method: CodeModeBridgeMethod;
    args: unknown[];
};
type SettledBridgeRequest = {
    id: string;
    ok: boolean;
    value?: unknown;
    error?: string;
};
type PendingBridgeState = PendingBridgeRequest & {
    promise: Promise<SettledBridgeRequest>;
    settled?: SettledBridgeRequest;
};
type CodeModeRunState = {
    runId: string;
    parentToolCallId: string;
    ctx: ToolSearchToolContext;
    config: CodeModeConfig;
    snapshotBytes: Uint8Array;
    pending: PendingBridgeState[];
    output: unknown[];
    createdAt: number;
    expiresAt: number;
    runtime: ToolSearchRuntime;
    namespaceRuntime: CodeModeNamespaceRuntime;
};
type CodeModeToolContext = ToolSearchToolContext;
type CodeModeFailureCode = "invalid_input" | "runtime_unavailable" | "timeout" | "output_limit_exceeded" | "snapshot_limit_exceeded" | "internal_error";
type CodeModeWorkerResult = {
    status: "completed";
    value: unknown;
    output: unknown[];
} | {
    status: "waiting";
    snapshotBytes: Uint8Array;
    pendingRequests: PendingBridgeRequest[];
    output: unknown[];
} | {
    status: "failed";
    error: string;
    code: CodeModeFailureCode;
    output: unknown[];
};
/** Resolves Code Mode runtime limits and language support from config. */
export declare function resolveCodeModeConfig(config?: OpenClawConfig, agentId?: string): CodeModeConfig;
declare function resolveCodeModeWorkerUrl(currentModuleUrl: string): URL;
declare function codeModeWorkerUrl(): URL;
declare function normalizeCodeModeWorkerResult(result: CodeModeWorkerResult): CodeModeWorkerResult;
declare function runCodeModeWorker(workerData: unknown, timeoutMs: number, workerUrl?: URL): Promise<CodeModeWorkerResult>;
/** Create the exec/wait control tools for one Code Mode run context. */
export declare function createCodeModeTools(ctx: CodeModeToolContext): AnyAgentTool[];
/** Compact normal tools behind Code Mode exec/wait controls. */
export declare function applyCodeModeCatalog(params: {
    tools: AnyAgentTool[];
    config?: OpenClawConfig;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
    toolHookContext?: HookContext;
}): {
    tools: AnyAgentTool[];
    compacted: boolean;
    catalogToolCount: number;
    catalogRegistered: boolean;
    catalogReused: boolean;
};
/** Move client-side tool definitions into the active Code Mode catalog. */
export declare function addClientToolsToCodeModeCatalog(params: {
    tools: ToolDefinition[];
    config?: OpenClawConfig;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
}): {
    tools: ToolDefinition[];
    compacted: boolean;
    catalogToolCount: number;
};
/** Test-only hooks and state accessors for Code Mode worker orchestration. */
export declare const testing: {
    activeRuns: Map<string, CodeModeRunState>;
    resumingRunIds: Set<string>;
    codeModeWorkerUrl: typeof codeModeWorkerUrl;
    normalizeCodeModeWorkerResult: typeof normalizeCodeModeWorkerResult;
    runCodeModeWorker: typeof runCodeModeWorker;
    resolveCodeModeWorkerUrl: typeof resolveCodeModeWorkerUrl;
    resolveCodeModeConfig: typeof resolveCodeModeConfig;
    getTypescriptRuntimePromise: () => Promise<typeof import("typescript")> | null;
    setTypescriptRuntimeForTest: (runtime: typeof import("typescript") | null) => void;
};
export { testing as __testing };
