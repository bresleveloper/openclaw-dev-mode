/** Error thrown when a session write lock cannot be acquired before timeout. */
export declare class SessionWriteLockTimeoutError extends Error {
    readonly code = "OPENCLAW_SESSION_WRITE_LOCK_TIMEOUT";
    readonly timeoutMs: number;
    readonly owner: string;
    readonly lockPath: string;
    constructor(params: {
        timeoutMs: number;
        owner: string;
        lockPath: string;
    });
}
/** Error thrown when an existing session write lock is stale and needs cleanup. */
export declare class SessionWriteLockStaleError extends Error {
    readonly code = "OPENCLAW_SESSION_WRITE_LOCK_STALE";
    readonly owner: string;
    readonly lockPath: string;
    readonly staleReasons: string[];
    constructor(params: {
        owner: string;
        lockPath: string;
        staleReasons?: string[];
    });
}
/** Returns whether an error is any session write-lock acquisition failure. */
export declare function isSessionWriteLockAcquireError(err: unknown): boolean;
