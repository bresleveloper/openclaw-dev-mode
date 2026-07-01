/** Returns whether an error came from cron session target id validation. */
export declare function isInvalidCronSessionTargetIdError(error: unknown): boolean;
/** Validates the opaque session id portion of a `session:` cron target. */
export declare function assertSafeCronSessionTargetId(sessionId: string): string;
/** Extracts the persistent session key from a `session:` cron target, if present. */
export declare function resolveCronSessionTargetSessionKey(sessionTarget?: string | null): string | undefined;
/** Resolves `current` at creation time so scheduled jobs do not depend on future active UI state. */
export declare function resolveCronCurrentSessionTarget(params: {
    sessionTarget?: string | null;
    sessionKey?: string | null;
}): string | undefined;
/** Chooses the session key used for cron delivery, preferring explicit persistent targets. */
export declare function resolveCronDeliverySessionKey(job: {
    sessionTarget?: string | null;
    sessionKey?: string | null;
}): string | undefined;
/** Returns the notification session key, falling back to a stable per-job failure session. */
export declare function resolveCronNotificationSessionKey(params: {
    jobId: string;
    sessionKey?: string | null;
}): string;
