import type { FailoverReason } from "./embedded-agent-helpers/types.js";
/** Structured error used to carry model fallback/failover metadata across layers. */
export declare class FailoverError extends Error {
    readonly reason: FailoverReason;
    readonly provider?: string;
    readonly model?: string;
    readonly profileId?: string;
    readonly authMode?: string;
    readonly status?: number;
    readonly code?: string;
    readonly rawError?: string;
    readonly authProfileFailure?: {
        allInCooldown: boolean;
    };
    readonly sessionId?: string;
    readonly lane?: string;
    readonly suspend?: boolean;
    constructor(message: string, params: {
        reason: FailoverReason;
        provider?: string;
        model?: string;
        profileId?: string;
        authMode?: string;
        status?: number;
        code?: string;
        rawError?: string;
        authProfileFailure?: {
            allInCooldown: boolean;
        };
        sessionId?: string;
        lane?: string;
        cause?: unknown;
        suspend?: boolean;
    });
}
/** Return true for native or serialized failover errors. */
export declare function isFailoverError(err: unknown): err is FailoverError;
/** Map a failover reason to the closest HTTP-like status code. */
export declare function resolveFailoverStatus(reason: FailoverReason): number | undefined;
/**
 * True when the error is a local runtime coordination error (session write-lock
 * timeout or embedded attempt session takeover) rather than a provider/model
 * failure. The model fallback chain must abort on these instead of consuming
 * candidate slots — retrying any model would hit the same local condition.
 * See #83510.
 */
export declare function isNonProviderRuntimeCoordinationError(err: unknown): boolean;
/** Return true when an unknown error shape represents a timeout. */
export declare function isTimeoutError(err: unknown): boolean;
/** Return true when an abort-signal reason is an intentional timeout; plain AbortError is a cancellation, not a timeout. */
export declare function isSignalTimeoutReason(reason: unknown): boolean;
/** Resolve the failover reason represented by an unknown provider/runtime error. */
export declare function resolveFailoverReasonFromError(err: unknown, providerHint?: string): FailoverReason | null;
/**
 * Build an actionable remediation hint for a failover error when the failure
 * reason is `auth` / `auth_permanent` and we have enough provider attribution
 * to suggest a re-authentication command. Returns `undefined` for any other
 * failure shape so callers can opportunistically append the hint without
 * branching on every reason themselves.
 *
 * Keep the string short and copy-pasteable — operators see it in fallback
 * summary errors and TUI status lines.
 */
export declare function buildFailoverRemediationHint(err: unknown): string | undefined;
/** Build the operator command for reauthenticating one provider. */
export declare function buildProviderReauthCommand(provider: string, env?: Record<string, string | undefined>): string | undefined;
/** Convert a failover or raw error into structured fields for logs/UI. */
export declare function describeFailoverError(err: unknown): {
    message: string;
    rawError?: string;
    reason?: FailoverReason;
    status?: number;
    code?: string;
    provider?: string;
    model?: string;
    profileId?: string;
    authMode?: string;
    sessionId?: string;
    lane?: string;
};
/** Convert a classified raw error into a FailoverError with optional request context. */
export declare function coerceToFailoverError(err: unknown, context?: {
    provider?: string;
    model?: string;
    profileId?: string;
    authMode?: string;
    sessionId?: string;
    lane?: string;
}): FailoverError | null;
