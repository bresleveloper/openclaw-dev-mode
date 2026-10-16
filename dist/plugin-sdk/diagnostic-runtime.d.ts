import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { a as formatDiagnosticTraceparent, c as isValidDiagnosticTraceFlags, i as createDiagnosticTraceContextFromActiveScope, l as isValidDiagnosticTraceId, n as createChildDiagnosticTraceContext, o as freezeDiagnosticTraceContext, r as createDiagnosticTraceContext, s as isValidDiagnosticSpanId, t as DiagnosticTraceContext, u as parseDiagnosticTraceparent } from "../diagnostic-trace-context-DIVmGNEt.js";
import { _ as onDiagnosticEvent, b as waitForDiagnosticEventsDrained, d as emitDiagnosticEvent, f as emitTrustedDiagnosticEvent, g as isInternalDiagnosticEventMetadata, h as isDiagnosticsEnabled, i as DiagnosticEventPrivateData, m as hasPendingInternalDiagnosticEvent, n as DiagnosticEventMetadata, o as DiagnosticModelCallContent, p as emitTrustedDiagnosticEventWithPrivateData, r as DiagnosticEventPayload, u as areDiagnosticsEnabledForProcess, v as onInternalDiagnosticEvent, y as resetDiagnosticEventsForTest } from "../diagnostic-events-BAgdO5A_.js";
import { t as isDiagnosticFlagEnabled } from "../diagnostic-flags-D8rSTad6.js";
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