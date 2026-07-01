import { a as formatDiagnosticTraceparent, c as isValidDiagnosticTraceFlags, i as createDiagnosticTraceContextFromActiveScope, l as isValidDiagnosticTraceId, n as createChildDiagnosticTraceContext, o as freezeDiagnosticTraceContext, r as createDiagnosticTraceContext, s as isValidDiagnosticSpanId, t as DiagnosticTraceContext, u as parseDiagnosticTraceparent } from "./diagnostic-trace-context-c5mRZYEt.js";
import { At as emitTrustedDiagnosticEventWithPrivateData, Bt as resetDiagnosticEventsForTest, Ft as isDiagnosticsEnabled, Ht as waitForDiagnosticEventsDrained, It as isInternalDiagnosticEventMetadata, Lt as onDiagnosticEvent, N as DiagnosticModelCallContent, Pt as hasPendingInternalDiagnosticEvent, Rt as onInternalDiagnosticEvent, Tt as emitDiagnosticEvent, a as DiagnosticEventPayload, i as DiagnosticEventMetadata, kt as emitTrustedDiagnosticEvent, o as DiagnosticEventPrivateData } from "./diagnostic-events-B93hMYj1.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-5VK2n4NS.js";

//#region src/infra/diagnostic-llm-content.d.ts
/** Per-field policy for diagnostic traces that may include model-visible content. */
type DiagnosticModelContentCapturePolicy = {
  /** Capture chat/message payloads sent to a model. */inputMessages: boolean; /** Capture model response messages. */
  outputMessages: boolean; /** Capture tool invocation arguments. */
  toolInputs: boolean; /** Capture tool result payloads. */
  toolOutputs: boolean; /** Capture the system prompt or instruction block. */
  systemPrompt: boolean; /** Capture tool schemas/definitions presented to a model. */
  toolDefinitions: boolean; /** Whether any model-visible prompt/response/schema content is enabled. */
  anyModelContent: boolean;
};
/** Resolves model-content diagnostic capture from config, defaulting to no content capture. */
declare function resolveDiagnosticModelContentCapturePolicy(config: unknown): DiagnosticModelContentCapturePolicy;
//#endregion
export { type DiagnosticEventMetadata, type DiagnosticEventPayload, type DiagnosticEventPrivateData, type DiagnosticModelCallContent, type DiagnosticModelContentCapturePolicy, type DiagnosticTraceContext, createChildDiagnosticTraceContext, createDiagnosticTraceContext, createDiagnosticTraceContextFromActiveScope, emitDiagnosticEvent, emitTrustedDiagnosticEvent, emitTrustedDiagnosticEventWithPrivateData, formatDiagnosticTraceparent, freezeDiagnosticTraceContext, hasPendingInternalDiagnosticEvent, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isInternalDiagnosticEventMetadata, isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, onDiagnosticEvent, onInternalDiagnosticEvent, parseDiagnosticTraceparent, resetDiagnosticEventsForTest, resolveDiagnosticModelContentCapturePolicy, waitForDiagnosticEventsDrained };