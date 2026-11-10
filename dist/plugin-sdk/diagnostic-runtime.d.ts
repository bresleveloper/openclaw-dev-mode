import { A as createDiagnosticTraceContextFromActiveScope, D as DiagnosticTraceContext, F as isValidDiagnosticTraceId, I as parseDiagnosticTraceparent, M as freezeDiagnosticTraceContext, N as isValidDiagnosticSpanId, O as createChildDiagnosticTraceContext, P as isValidDiagnosticTraceFlags, _ as isInternalDiagnosticEventMetadata, b as resetDiagnosticEventsForTest, d as areDiagnosticsEnabledForProcess, f as emitDiagnosticEvent, g as isDiagnosticsEnabled, h as hasPendingInternalDiagnosticEvent, i as DiagnosticEventPrivateData, j as formatDiagnosticTraceparent, k as createDiagnosticTraceContext, m as emitTrustedDiagnosticEventWithPrivateData, n as DiagnosticEventMetadata, o as DiagnosticModelCallContent, p as emitTrustedDiagnosticEvent, r as DiagnosticEventPayload, v as onDiagnosticEvent, x as waitForDiagnosticEventsDrained, y as onInternalDiagnosticEvent } from "../diagnostic-events-CMrJXSRl.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { t as isDiagnosticFlagEnabled } from "../diagnostic-flags-xRxhSjdZ.js";
//#region src/infra/diagnostic-llm-content.d.ts
/** Per-field policy for diagnostic traces that may include model-visible content. */
type DiagnosticModelContentCapturePolicy = {
  /** Capture chat/message payloads sent to a model. */
  inputMessages: boolean;
  /** Capture model response messages. */
  outputMessages: boolean;
  /** Capture tool invocation arguments. */
  toolInputs: boolean;
  /** Capture tool result payloads. */
  toolOutputs: boolean;
  /** Capture the system prompt or instruction block. */
  systemPrompt: boolean;
  /** Capture tool schemas/definitions presented to a model. */
  toolDefinitions: boolean;
  /** Whether any model-visible prompt/response/schema content is enabled. */
  anyModelContent: boolean;
};
/** Resolves model-content diagnostic capture from config, defaulting to no content capture. */
export declare function resolveDiagnosticModelContentCapturePolicy(config: unknown): DiagnosticModelContentCapturePolicy;
//#endregion
//#region src/plugin-sdk/diagnostic-runtime.d.ts
export declare function normalizeDiagnosticValue(value: string | undefined, fallback?: string): string;
export declare function normalizeDiagnosticLane(value: string | undefined, fallback?: string): string;
//#endregion
export { type DiagnosticEventMetadata, type DiagnosticEventPayload, type DiagnosticEventPrivateData, type DiagnosticModelCallContent, type DiagnosticModelContentCapturePolicy, type DiagnosticTraceContext, areDiagnosticsEnabledForProcess, createChildDiagnosticTraceContext, createDiagnosticTraceContext, createDiagnosticTraceContextFromActiveScope, createSubsystemLogger, emitDiagnosticEvent, emitTrustedDiagnosticEvent, emitTrustedDiagnosticEventWithPrivateData, formatDiagnosticTraceparent, freezeDiagnosticTraceContext, hasPendingInternalDiagnosticEvent, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isInternalDiagnosticEventMetadata, isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, onDiagnosticEvent, onInternalDiagnosticEvent, parseDiagnosticTraceparent, resetDiagnosticEventsForTest, waitForDiagnosticEventsDrained };