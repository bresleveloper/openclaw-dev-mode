import { n as createSubsystemLogger } from "../subsystem-wnS6DJyq.js";
import { A as freezeDiagnosticTraceContext, C as DiagnosticEventMetadata, D as createDiagnosticTraceContext, E as createChildDiagnosticTraceContext, F as parseDiagnosticTraceparent, M as isValidDiagnosticTraceFlags, N as isValidDiagnosticTraceId, O as createDiagnosticTraceContextFromActiveScope, P as normalizeDiagnosticTraceContext, T as DiagnosticTraceContext, _ as onInternalDiagnosticEvent, a as DiagnosticModelCallContent, d as emitDiagnosticEvent, f as emitTrustedDiagnosticEvent, g as onDiagnosticEvent, h as isDiagnosticsEnabled, j as isValidDiagnosticSpanId, k as formatDiagnosticTraceparent, m as hasPendingInternalDiagnosticEvent, n as DiagnosticEventPayload, p as emitTrustedDiagnosticEventWithPrivateData, r as DiagnosticEventPrivateData, u as areDiagnosticsEnabledForProcess, v as resetDiagnosticEventsForTest, w as isInternalDiagnosticEventMetadata, y as waitForDiagnosticEventsDrained } from "../diagnostic-events-ClGLRZ6Y.js";
import { t as isDiagnosticFlagEnabled } from "../diagnostic-flags-DvcC9FZY.js";
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
export declare function normalizeDiagnosticValue(value: string | undefined, fallback?: string): string;
export declare function normalizeDiagnosticLane(value: string | undefined, fallback?: string): string;
export { type DiagnosticEventMetadata, type DiagnosticEventPayload, type DiagnosticEventPrivateData, type DiagnosticModelCallContent, type DiagnosticModelContentCapturePolicy, type DiagnosticTraceContext, areDiagnosticsEnabledForProcess, createChildDiagnosticTraceContext, createDiagnosticTraceContext, createDiagnosticTraceContextFromActiveScope, createSubsystemLogger, emitDiagnosticEvent, emitTrustedDiagnosticEvent, emitTrustedDiagnosticEventWithPrivateData, formatDiagnosticTraceparent, freezeDiagnosticTraceContext, hasPendingInternalDiagnosticEvent, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isInternalDiagnosticEventMetadata, isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, normalizeDiagnosticTraceContext, onDiagnosticEvent, onInternalDiagnosticEvent, parseDiagnosticTraceparent, resetDiagnosticEventsForTest, waitForDiagnosticEventsDrained };