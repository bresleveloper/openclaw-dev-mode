/** Root diagnostic subsystem logger. */
export declare const diagnosticLogger: import("./subsystem.js").SubsystemLogger;
/** Marks that diagnostics emitted useful activity. */
export declare function markDiagnosticActivity(): void;
/** Returns the last diagnostic activity timestamp for watchdog-style checks. */
export declare function getLastDiagnosticActivityAt(): number;
/** Clears diagnostic activity state for tests. */
export declare function resetDiagnosticActivityForTest(): void;
/** Logs and emits a diagnostic event when work enters a serialized lane. */
export declare function logLaneEnqueue(lane: string, queueSize: number): void;
/** Logs and emits a diagnostic event when work leaves a serialized lane. */
export declare function logLaneDequeue(lane: string, waitMs: number, queueSize: number): void;
