import { n as ToolInputError } from "../tool-input-error-BsUaQSlb.js";
import { C as EMPTY_CODE_MODE_OUTPUT, D as CodeModeApiVirtualFile, E as captureCodeModeValue, S as CodeModeOutputSource, T as captureCodeModeOutput, _ as CodeModeWorkerPayload, a as CodeModeExecutorId, b as SettledBridgeRequest, c as CodeModeExecutorRunOptions, d as CodeModeWorkerResult, f as CODE_MODE_WORKER_WATCHDOG_GRACE_MS, g as CodeModeWorkerContinuation, h as CodeModeWorkerBoundary, i as CodeModeExecutorContinuation, l as CodeModeExecutorStartInput, m as CodeModeVmResult, n as CodeModeHeadlessTimeoutError, o as CodeModeExecutorInlineHost, p as CodeModeConfig, r as CodeModeExecutor, s as CodeModeExecutorResumeInput, t as CodeModeHeadlessAbortError, u as CodeModeFailureCode, v as CodeModeWorkerThreadResult, w as boundCodeModeError, x as CodeModeNamespaceDescriptor, y as PendingBridgeRequest } from "../code-mode-errors-PdFwSbQS.js";
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
export { CODE_MODE_WORKER_WATCHDOG_GRACE_MS, type CodeModeApiVirtualFile, type CodeModeConfig, type CodeModeExecutor, type CodeModeExecutorContinuation, type CodeModeExecutorId, type CodeModeExecutorInlineHost, type CodeModeExecutorResumeInput, type CodeModeExecutorRunOptions, type CodeModeExecutorStartInput, type CodeModeFailureCode, CodeModeHeadlessAbortError, CodeModeHeadlessTimeoutError, type CodeModeNamespaceDescriptor, type CodeModeOutputSource, type CodeModeVmResult, type CodeModeWorkerBoundary, type CodeModeWorkerContinuation, type CodeModeWorkerPayload, type CodeModeWorkerResult, type CodeModeWorkerThreadResult, EMPTY_CODE_MODE_OUTPUT, type PendingBridgeRequest, type SettledBridgeRequest, type SourceLocation, ToolInputError, boundCodeModeError, captureCodeModeOutput, captureCodeModeValue };