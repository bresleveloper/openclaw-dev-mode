import { n as ToolInputError } from "../tool-input-error-BsUaQSlb.js";
import "../tool-metadata-XKaxd5PO.js";
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
export declare const EMPTY_CODE_MODE_OUTPUT: CodeModeOutputSource;
/** Capture after guest conversion, before any public projection discards source facts. */
export declare function captureCodeModeValue(value: unknown, maxBytes: number, structuredMaxBytes?: number): CodeModeJsonSource;
export declare function captureCodeModeOutput(output: unknown[], maxBytes: number): CodeModeOutputSource;
export declare function boundCodeModeError(error: string, maxBytes: number): string;
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
//#region src/agents/code-mode-worker-types.d.ts
export declare const CODE_MODE_WORKER_WATCHDOG_GRACE_MS = 2000;
type CodeModeBridgeMethod = "search" | "describe" | "callValue" | "resultSave" | "resultLoad" | "resultDelete" | "nodes" | "yield" | "namespace" | "agentSpawn" | "agentWait" | "skillsList" | "skillsRead" | "sleep" | "swarmNote";
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
type CodeModeNamespaceDescriptor = {
  id: string;
  globalName: string;
  description?: string;
  scope: SerializedCodeModeNamespaceValue;
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
  failurePhase: Extract<CodeModeFailurePhase, "input" | "guest">;
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
export declare class CodeModeHeadlessAbortError extends Error {
  constructor(message?: string);
}
export declare class CodeModeHeadlessTimeoutError extends Error {
  constructor(message?: string);
}
//#endregion
//#region src/agents/code-mode-controller-source.d.ts
export declare const CODE_MODE_CONTROLLER_SOURCE: string;
//#endregion
//#region src/agents/code-mode-source-location.d.ts
export declare const USER_SOURCE_FILE = "openclaw-code-mode:user.js";
export declare const SOURCE_LOCATION_KEY = "__openclawSourceLocation";
type SourceLocation = {
  file: typeof USER_SOURCE_FILE;
  lineOffset: number;
  lineCount: number;
  columnOffset: number;
  endColumn: number;
};
export declare function normalizeSourceStack(stack: string | undefined, location?: SourceLocation): string | undefined;
export declare function buildUserSource(code: string, prelude?: string, columnUnits?: "utf8" | "utf16"): {
  source: string;
  location: SourceLocation;
};
//#endregion
//#region src/agents/code-mode-source.d.ts
export declare function prepareSource(code: string): string;
//#endregion
export { type CodeModeApiVirtualFile, type CodeModeConfig, type CodeModeExecutor, type CodeModeExecutorContinuation, type CodeModeExecutorId, type CodeModeExecutorInlineHost, type CodeModeExecutorResumeInput, type CodeModeExecutorRunOptions, type CodeModeExecutorStartInput, type CodeModeFailureCode, type CodeModeNamespaceDescriptor, type CodeModeOutputSource, type CodeModeVmResult, type CodeModeWorkerBoundary, type CodeModeWorkerContinuation, type CodeModeWorkerPayload, type CodeModeWorkerResult, type CodeModeWorkerThreadResult, type PendingBridgeRequest, type SettledBridgeRequest, type SourceLocation, ToolInputError };