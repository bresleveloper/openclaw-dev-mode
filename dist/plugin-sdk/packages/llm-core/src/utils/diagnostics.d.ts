export interface DiagnosticErrorInfo {
    name?: string;
    message: string;
    stack?: string;
    code?: string | number;
}
export interface AssistantMessageDiagnostic {
    type: string;
    timestamp: number;
    error?: DiagnosticErrorInfo;
    details?: Record<string, unknown>;
}
/** Formats arbitrary thrown values into diagnostic-safe text. */
export declare function formatThrownValue(value: unknown): string;
/** Extracts serializable diagnostic error fields from Error and non-Error throws. */
export declare function extractDiagnosticError(error: unknown): DiagnosticErrorInfo;
/** Creates a timestamped assistant-message diagnostic entry. */
export declare function createAssistantMessageDiagnostic(type: string, error: unknown, details?: Record<string, unknown>): AssistantMessageDiagnostic;
/** Appends a diagnostic while preserving existing message diagnostics. */
export declare function appendAssistantMessageDiagnostic(message: {
    diagnostics?: AssistantMessageDiagnostic[];
}, diagnostic: AssistantMessageDiagnostic): void;
