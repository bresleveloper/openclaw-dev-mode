//#region packages/llm-core/src/utils/diagnostics.d.ts
interface DiagnosticErrorInfo {
  name?: string;
  message: string;
  stack?: string;
  code?: string | number;
}
interface AssistantMessageDiagnostic {
  type: string;
  timestamp: number;
  error?: DiagnosticErrorInfo;
  details?: Record<string, unknown>;
}
/** Formats arbitrary thrown values into diagnostic-safe text. */
declare function formatThrownValue(value: unknown): string;
/** Extracts serializable diagnostic error fields from Error and non-Error throws. */
declare function extractDiagnosticError(error: unknown): DiagnosticErrorInfo;
/** Creates a timestamped assistant-message diagnostic entry. */
declare function createAssistantMessageDiagnostic(type: string, error: unknown, details?: Record<string, unknown>): AssistantMessageDiagnostic;
/** Appends a diagnostic while preserving existing message diagnostics. */
declare function appendAssistantMessageDiagnostic(message: {
  diagnostics?: AssistantMessageDiagnostic[];
}, diagnostic: AssistantMessageDiagnostic): void;
//#endregion
export { extractDiagnosticError as a, createAssistantMessageDiagnostic as i, DiagnosticErrorInfo as n, formatThrownValue as o, appendAssistantMessageDiagnostic as r, AssistantMessageDiagnostic as t };