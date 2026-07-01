/** Persisted timestamps and optional TTL overrides for one channel thread binding. */
export type ThreadBindingLifecycleRecord = {
    /** Epoch milliseconds when the binding was created. */
    boundAt: number;
    /** Epoch milliseconds of the latest activity seen for the bound conversation. */
    lastActivityAt: number;
    /** Optional idle timeout override in milliseconds; zero disables idle expiry. */
    idleTimeoutMs?: number;
    /** Optional max-age override in milliseconds; zero disables max-age expiry. */
    maxAgeMs?: number;
};
/** Resolves the next expiration for a channel thread binding from idle and max-age limits. */
export declare function resolveThreadBindingLifecycle(params: {
    /** Stored binding timestamps and optional timeout overrides. */
    record: ThreadBindingLifecycleRecord;
    /** Fallback idle timeout in milliseconds when the record has no override. */
    defaultIdleTimeoutMs: number;
    /** Fallback max-age timeout in milliseconds when the record has no override. */
    defaultMaxAgeMs: number;
}): {
    /** Earliest expiration timestamp, omitted when both limits are disabled. */
    expiresAt?: number;
    /** Expiration source corresponding to `expiresAt`. */
    reason?: "idle-expired" | "max-age-expired";
};
