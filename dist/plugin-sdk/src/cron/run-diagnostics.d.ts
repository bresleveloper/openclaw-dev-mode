import type { CronRunDiagnostics, CronRunDiagnosticSeverity, CronRunDiagnosticSource } from "./types.js";
/** Returns the operator-facing summary for persisted cron diagnostics. */
export declare function summarizeCronRunDiagnostics(diagnostics: CronRunDiagnostics | undefined): string | undefined;
/** Normalizes untrusted cron diagnostic payloads into bounded, redacted entries. */
export declare function normalizeCronRunDiagnostics(value: unknown, opts?: {
    nowMs?: () => number;
}): CronRunDiagnostics | undefined;
/** Merges cron diagnostics while choosing the highest-severity latest summary. */
export declare function mergeCronRunDiagnostics(...values: Array<CronRunDiagnostics | undefined>): CronRunDiagnostics | undefined;
/** Converts an arbitrary thrown cron error into a redacted diagnostic entry. */
export declare function createCronRunDiagnosticsFromError(source: CronRunDiagnosticSource, error: unknown, opts?: {
    severity?: CronRunDiagnosticSeverity;
    nowMs?: () => number;
    toolName?: string;
    exitCode?: number | null;
}): CronRunDiagnostics | undefined;
/** Extracts failed exec details from tool metadata into cron diagnostics. */
export declare function createCronRunDiagnosticsFromExecDetails(details: unknown, opts?: {
    nowMs?: () => number;
    toolName?: string;
    finalStatus?: "ok" | "error" | "skipped";
}): CronRunDiagnostics | undefined;
/** Extracts tool-call failure diagnostics from an agent reply payload. */
export declare function createCronRunDiagnosticsFromToolPayload(payload: unknown, opts?: {
    nowMs?: () => number;
    finalStatus?: "ok" | "error" | "skipped";
}): CronRunDiagnostics | undefined;
/** Extracts cron run diagnostics from agent result payloads and metadata. */
export declare function createCronRunDiagnosticsFromAgentResult(result: unknown, opts?: {
    nowMs?: () => number;
    finalStatus?: "ok" | "error" | "skipped";
}): CronRunDiagnostics | undefined;
