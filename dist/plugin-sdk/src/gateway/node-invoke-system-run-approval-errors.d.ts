type SystemRunApprovalGuardError = {
    ok: false;
    message: string;
    details: Record<string, unknown>;
};
/** Builds a failed system.run approval guard result with a structured code. */
export declare function systemRunApprovalGuardError(params: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}): SystemRunApprovalGuardError;
/** Builds the standard response for system.run calls that still need approval. */
export declare function systemRunApprovalRequired(runId: string): SystemRunApprovalGuardError;
export {};
