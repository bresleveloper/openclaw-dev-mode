import { At as CodeModeOutputSource, Ct as CodeModeWorkerBoundary, Dt as PendingBridgeRequest, Et as CodeModeWorkerThreadResult, Ft as CodeModeApiVirtualFile, Mt as boundCodeModeError, Nt as captureCodeModeOutput, Ot as SettledBridgeRequest, Pt as captureCodeModeValue, St as CodeModeVmResult, Tt as CodeModeWorkerPayload, _t as CodeModeExecutorStartInput, bt as CODE_MODE_WORKER_WATCHDOG_GRACE_MS, dt as CodeModeExecutor, ft as CodeModeExecutorContinuation, gt as CodeModeExecutorRunOptions, ht as CodeModeExecutorResumeInput, jt as EMPTY_CODE_MODE_OUTPUT, kt as CodeModeNamespaceDescriptor, lt as CodeModeHeadlessAbortError, mt as CodeModeExecutorInlineHost, pt as CodeModeExecutorId, ut as CodeModeHeadlessTimeoutError, vt as CodeModeFailureCode, wt as CodeModeWorkerContinuation, xt as CodeModeConfig, yt as CodeModeWorkerResult } from "../config-contracts-hzlacViZ.js";
import { _ as ToolInputError } from "../channel-actions-CtYo87Zk.js";
/** Console is guest-only diagnostic text, not a host logging capability. */
export declare const CODE_MODE_CONTROLLER_SOURCE: string;
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
export declare function prepareSource(code: string): string;
export { CODE_MODE_WORKER_WATCHDOG_GRACE_MS, type CodeModeApiVirtualFile, type CodeModeConfig, type CodeModeExecutor, type CodeModeExecutorContinuation, type CodeModeExecutorId, type CodeModeExecutorInlineHost, type CodeModeExecutorResumeInput, type CodeModeExecutorRunOptions, type CodeModeExecutorStartInput, type CodeModeFailureCode, CodeModeHeadlessAbortError, CodeModeHeadlessTimeoutError, type CodeModeNamespaceDescriptor, type CodeModeOutputSource, type CodeModeVmResult, type CodeModeWorkerBoundary, type CodeModeWorkerContinuation, type CodeModeWorkerPayload, type CodeModeWorkerResult, type CodeModeWorkerThreadResult, EMPTY_CODE_MODE_OUTPUT, type PendingBridgeRequest, type SettledBridgeRequest, type SourceLocation, ToolInputError, boundCodeModeError, captureCodeModeOutput, captureCodeModeValue };