import { type DiagnosticModelContentCapturePolicy } from "../../../infra/diagnostic-llm-content.js";
import { type DiagnosticTraceContext } from "../../../infra/diagnostic-trace-context.js";
import type { PluginHookContextWindowSource } from "../../../plugins/hook-types.js";
import type { StreamFn } from "../../runtime/index.js";
type ModelCallDiagnosticContext = {
    runId: string;
    sessionKey?: string;
    sessionId?: string;
    provider: string;
    model: string;
    api?: string;
    transport?: string;
    contextTokenBudget?: number;
    contextWindowSource?: PluginHookContextWindowSource;
    contextWindowReferenceTokens?: number;
    trace: DiagnosticTraceContext;
    contentCapture?: DiagnosticModelContentCapturePolicy;
    nextCallId: () => string;
    onStarted?: () => void;
};
/**
 * Wraps a model stream function with diagnostic model-call lifecycle events,
 * traceparent propagation, request/response byte accounting, optional captured
 * model content, progress heartbeats, and plugin hook dispatch.
 */
export declare function wrapStreamFnWithDiagnosticModelCallEvents(streamFn: StreamFn, ctx: ModelCallDiagnosticContext): StreamFn;
export {};
