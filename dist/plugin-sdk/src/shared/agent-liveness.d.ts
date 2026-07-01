/** Return true for the normalized liveness state that means a run is blocked. */
export declare function isBlockedLivenessState(livenessState: unknown): boolean;
/** Convert a blocked-run error payload into a user-facing wait/status message. */
export declare function formatBlockedLivenessError(error: unknown): string;
/** Coerce any blocked liveness state into an error status while preserving other statuses. */
export declare function normalizeBlockedLivenessWaitStatus<TStatus extends "ok" | "error" | "timeout" | "pending">(params: {
    status: TStatus;
    livenessState?: unknown;
    error?: unknown;
}): {
    status: TStatus | "error";
    error?: string;
};
