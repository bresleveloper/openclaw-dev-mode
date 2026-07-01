import { type DiagnosticPhaseDetails, type DiagnosticPhaseSnapshot } from "../infra/diagnostic-events.js";
export declare function getCurrentDiagnosticPhase(): string | undefined;
export declare function getRecentDiagnosticPhases(limit?: number): DiagnosticPhaseSnapshot[];
/** Records a completed phase in memory and emits it when diagnostics are enabled. */
export declare function recordDiagnosticPhase(snapshot: DiagnosticPhaseSnapshot): void;
/** Runs work inside a measured diagnostic phase with wall-clock and CPU metrics. */
export declare function withDiagnosticPhase<T>(name: string, run: () => Promise<T> | T, details?: DiagnosticPhaseDetails): Promise<T>;
/** Clears phase history and active stack for isolated tests. */
export declare function resetDiagnosticPhasesForTest(): void;
