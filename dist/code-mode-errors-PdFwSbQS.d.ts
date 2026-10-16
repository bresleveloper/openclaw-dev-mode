import { j as McpCodexToolApprovalMode } from "./types.openclaw-DWWUw8hA.js";
import { t as PluginManifestRecord } from "./manifest-registry-Bj1Q7bnt.js";
import { n as AnyAgentTool } from "./common-K-HB_vKp.js";
//#region src/agents/mcp-codex-tool-approval.d.ts
type McpCodexToolAnnotations = {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
};
//#endregion
//#region src/plugins/tool-metadata.d.ts
/** MCP bridge metadata attached to plugin tools surfaced through agent tool lists. */
type PluginToolMcpMeta = {
  serverName: string;
  safeServerName: string;
  toolName: string;
  operation: "tool" | "resources_list" | "resources_read" | "prompts_list" | "prompts_get";
  excludedFromOpenClawCatalog?: true;
  deniedBySession?: true;
  /** Trusted requester OAuth sign-in bootstrap; exempt from per-call MCP approval. */
  oauthConnectBootstrap?: true;
  codexApproval?: {
    mode?: McpCodexToolApprovalMode;
    annotations?: McpCodexToolAnnotations;
  };
  node?: {
    id: string;
    displayName?: string;
  };
};
/** Runtime metadata used to trace an agent tool back to its owning plugin registration. */
type PluginToolMeta = {
  pluginId: string;
  kind?: PluginManifestRecord["kind"];
  optional: boolean;
  replaySafe?: boolean;
  sideEffecting?: boolean;
  trustedLocalMedia?: boolean;
  mcp?: PluginToolMcpMeta;
};
/** Reads plugin ownership metadata for a concrete agent tool instance. */
declare function getPluginToolMeta(tool: AnyAgentTool): PluginToolMeta | undefined;
/** Binds a side-effect declaration to the concrete plugin tool that owns it. */
declare function getPluginToolSideEffectOwnerKey(tool: AnyAgentTool): string | undefined;
//#endregion
//#region src/agents/code-mode-mcp-api.d.ts
/** Virtual TypeScript-style API file exposed to code mode. */
type CodeModeApiVirtualFile = {
  path: string;
  description?: string;
  content: string;
  bytes: number;
};
//#endregion
//#region src/agents/code-mode-json.d.ts
type CodeModeJsonSource = {
  kind: "complete";
  json: string;
} | {
  kind: "prefix";
  json: string;
  originalBytes: number;
};
type CodeModeOutputSource = {
  count: number;
  source: CodeModeJsonSource;
};
declare const EMPTY_CODE_MODE_OUTPUT: CodeModeOutputSource;
/** Capture after guest conversion, before any public projection discards source facts. */
declare function captureCodeModeValue(value: unknown, maxBytes: number, structuredMaxBytes?: number): CodeModeJsonSource;
declare function captureCodeModeOutput(output: unknown[], maxBytes: number): CodeModeOutputSource;
declare function boundCodeModeError(error: string, maxBytes: number): string;
//#endregion
//#region src/agents/code-mode-namespaces.d.ts
/** JSON-serializable descriptor value emitted to the code-mode runtime. */
type SerializedCodeModeNamespaceValue = {
  kind: "array";
  items: SerializedCodeModeNamespaceValue[];
} | {
  kind: "function";
  path: string[];
} | {
  kind: "object";
  entries: Array<[string, SerializedCodeModeNamespaceValue]>;
} | {
  kind: "value";
  value: unknown;
};
/** Descriptor sent to code mode for one visible namespace. */
type CodeModeNamespaceDescriptor = {
  id: string;
  globalName: string;
  description?: string;
  scope: SerializedCodeModeNamespaceValue;
};
//#endregion
//#region src/agents/code-mode-worker-types.d.ts
declare const CODE_MODE_WORKER_WATCHDOG_GRACE_MS = 2000;
type CodeModeBridgeMethod = "search" | "describe" | "callValue" | "resultSave" | "resultLoad" | "resultDelete" | "nodes" | "yield" | "namespace" | "agentSpawn" | "agentWait" | "skillsList" | "skillsSearch" | "skillsRead" | "sleep" | "swarmNote";
type CodeModeConfig = {
  timeoutMs: number;
  memoryLimitBytes: number;
  maxOutputBytes: number;
  maxPendingToolCalls: number;
  maxSnapshotBytes: number;
};
type PendingBridgeRequest = {
  id: string;
  method: CodeModeBridgeMethod;
  args: unknown[];
};
type SettledBridgeRequest = {
  id: string;
  ok: boolean;
  json: string;
};
type CodeModeWorkerInput<State> = {
  kind: "exec";
  source: string;
  prelude?: string;
  executionTimeoutMs?: number;
  config: CodeModeConfig;
  catalog: unknown[];
  apiFiles?: CodeModeApiVirtualFile[];
  namespaces: CodeModeNamespaceDescriptor[];
  swarmEnabled?: boolean;
} | {
  kind: "resume";
  continuation: State;
  config: CodeModeConfig;
  settledRequests: SettledBridgeRequest[];
  pendingRequests?: PendingBridgeRequest[];
};
type CodeModeWorkerPayload<State> = CodeModeWorkerInput<State> & {
  /** Only interactive, non-replay cells can hand full final JSON to the run store. */
  retainFinalValue?: boolean;
};
type CodeModeSettlementMode = {
  kind: "awaiting";
} | {
  kind: "draining";
  requiredRequestIds: string[];
};
/** Transient worker boundary; no heap serialization and no resumable handle. */
type CodeModeWorkerBoundary = {
  networkContentObserved?: true;
  status: "boundary";
  pendingRequests: PendingBridgeRequest[];
  canceledRequestIds: string[];
  settlementMode: CodeModeSettlementMode;
  output: CodeModeOutputSource;
  /** Engine-reported allocations for diagnostics, not RSS or admission authority. */
  memoryUsedBytes: number;
};
type CodeModeWorkerContinuation = {
  kind: "checkpoint";
} | {
  kind: "continue";
  timeoutMs: number;
  settledRequests: SettledBridgeRequest[];
  pendingRequests: PendingBridgeRequest[];
};
type CodeModeFailurePhase = "input" | "guest" | "bridge" | "host";
type CodeModeWorkerOutcome<Output, Value, State> = {
  networkContentObserved?: true;
} & ({
  status: "completed";
  value: Value;
  output: Output;
} | {
  status: "waiting";
  continuation: State;
  pendingRequests: PendingBridgeRequest[];
  canceledRequestIds: string[];
  settlementMode: CodeModeSettlementMode;
  output: Output;
} | {
  status: "failed";
  error: string;
  code: "invalid_input" | "runtime_unavailable" | "timeout" | "snapshot_limit_exceeded" | "internal_error";
  failurePhase: Extract<CodeModeFailurePhase, "input" | "guest" | "bridge">;
  bridgeDispatchStarted: false;
  output: Output;
});
type CodeModeVmResult<State> = CodeModeWorkerOutcome<unknown[], unknown, State>;
type CodeModeWorkerThreadResult<State> = CodeModeWorkerOutcome<CodeModeOutputSource, CodeModeJsonSource, State>;
//#endregion
//#region src/agents/code-mode-executor-types.d.ts
type CodeModeExecutorId = "node" | "quickjs";
type CodeModeFailureCode = "aborted" | "invalid_input" | "runtime_unavailable" | "timeout" | "output_limit_exceeded" | "snapshot_limit_exceeded" | "internal_error";
type CodeModeExecutorStartInput = Extract<CodeModeWorkerPayload<never>, {
  kind: "exec";
}>;
type CodeModeExecutorResumeInput = Omit<Extract<CodeModeWorkerPayload<never>, {
  kind: "resume";
}>, "continuation">;
type CodeModeExecutorInlineHost = {
  onNetworkContent?: () => void;
  onInputConsumed?: () => void;
  onBoundary: (boundary: CodeModeWorkerBoundary, context: {
    signal: AbortSignal;
    yieldSignal: AbortSignal;
    maxTimeoutMs: number;
  }) => Promise<CodeModeWorkerContinuation & {
    onConsumed?: () => void;
  }>;
};
type CodeModeExecutorRunOptions = {
  timeoutMs: number;
  signal?: AbortSignal;
  inlineHost?: CodeModeExecutorInlineHost;
};
/** One-shot custody of a parked execution; resuming transfers its resources to the next result. */
type CodeModeExecutorContinuation = {
  readonly executor: CodeModeExecutorId;
  readonly retainedBytes: number;
  resume: (input: CodeModeExecutorResumeInput, options: CodeModeExecutorRunOptions) => Promise<CodeModeWorkerResult>;
  /** Revokes resume and joins cleanup; failed cleanup is retryable, consumed continuations are inert. */
  dispose: () => Promise<void>;
};
type CodeModeWorkerResult = Extract<CodeModeWorkerThreadResult<CodeModeExecutorContinuation>, {
  status: "completed" | "waiting";
}> | {
  status: "failed";
  error: string;
  code: CodeModeFailureCode;
  failurePhase: CodeModeFailurePhase;
  bridgeDispatchStarted: boolean;
  networkContentObserved?: true;
  output: CodeModeOutputSource;
};
type CodeModeExecutor = {
  readonly id: CodeModeExecutorId;
  execute: (input: CodeModeExecutorStartInput, options: CodeModeExecutorRunOptions) => Promise<CodeModeWorkerResult>;
};
//#endregion
//#region src/agents/code-mode-errors.d.ts
declare class CodeModeHeadlessAbortError extends Error {
  constructor(message?: string);
}
declare class CodeModeHeadlessTimeoutError extends Error {
  constructor(message?: string);
}
//#endregion
export { getPluginToolSideEffectOwnerKey as A, EMPTY_CODE_MODE_OUTPUT as C, CodeModeApiVirtualFile as D, captureCodeModeValue as E, PluginToolMcpMeta as O, CodeModeOutputSource as S, captureCodeModeOutput as T, CodeModeWorkerPayload as _, CodeModeExecutorId as a, SettledBridgeRequest as b, CodeModeExecutorRunOptions as c, CodeModeWorkerResult as d, CODE_MODE_WORKER_WATCHDOG_GRACE_MS as f, CodeModeWorkerContinuation as g, CodeModeWorkerBoundary as h, CodeModeExecutorContinuation as i, McpCodexToolAnnotations as j, getPluginToolMeta as k, CodeModeExecutorStartInput as l, CodeModeVmResult as m, CodeModeHeadlessTimeoutError as n, CodeModeExecutorInlineHost as o, CodeModeConfig as p, CodeModeExecutor as r, CodeModeExecutorResumeInput as s, CodeModeHeadlessAbortError as t, CodeModeFailureCode as u, CodeModeWorkerThreadResult as v, boundCodeModeError as w, CodeModeNamespaceDescriptor as x, PendingBridgeRequest as y };