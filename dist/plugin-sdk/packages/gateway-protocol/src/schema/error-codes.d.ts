import type { ErrorShape } from "./types.js";
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
export declare const ErrorCodes: {
    /** Client has not completed account/device linking for this gateway. */
    readonly NOT_LINKED: "NOT_LINKED";
    /** Device exists but still needs an explicit pairing approval. */
    readonly NOT_PAIRED: "NOT_PAIRED";
    /** Agent turn exceeded the gateway wait window. */
    readonly AGENT_TIMEOUT: "AGENT_TIMEOUT";
    /** Request payload failed protocol validation or method preconditions. */
    readonly INVALID_REQUEST: "INVALID_REQUEST";
    /** Approval resolution referenced a missing or expired approval request. */
    readonly APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND";
    /** Gateway service or required backend is temporarily unavailable. */
    readonly UNAVAILABLE: "UNAVAILABLE";
};
/** Closed set of canonical gateway error code strings. */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
export declare function errorShape(code: ErrorCode, message: string, opts?: {
    details?: unknown;
    retryable?: boolean;
    retryAfterMs?: number;
}): ErrorShape;
