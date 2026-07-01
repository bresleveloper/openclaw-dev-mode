/** Backend failover helpers for ACP session initialization and turn execution. */
import type { AcpRuntimeErrorCode } from "../runtime/errors.js";
/** Captured backend attempt state used to decide whether failover is safe. */
export type BackendAttempt = {
    backend: string;
    error: string;
    code: AcpRuntimeErrorCode;
    sawOutput: boolean;
};
/** Ordered backend candidates plus display helper for diagnostics. */
type BackendCandidatePlan = {
    candidateBackends: string[];
    describeBackendCandidate: (backend: string) => string;
};
/** Builds the deduped backend order from configured primary, resolved primary, and fallbacks. */
export declare function resolveBackendCandidatePlan(params: {
    configuredPrimaryBackend?: string;
    resolvedPrimaryBackend?: string;
    fallbackBackends?: readonly unknown[];
}): BackendCandidatePlan;
/** Returns true for early transient backend errors where trying another backend is safe. */
export declare function isFailoverWorthyBackendError(attempt: BackendAttempt): boolean;
/** Returns whether another backend candidate remains after the current index. */
export declare function shouldAttemptBackendFailover(params: {
    backendIndex: number;
    candidateBackends: readonly string[];
}): boolean;
export {};
