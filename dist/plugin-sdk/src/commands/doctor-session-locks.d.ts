import { type SessionLockOwnerProcessArgsReader, type SessionWriteLockAcquireTimeoutConfig } from "../agents/session-write-lock.js";
/** Reports session write locks and removes stale locks when doctor repair is enabled. */
export declare function noteSessionLockHealth(params?: {
    shouldRepair?: boolean;
    config?: SessionWriteLockAcquireTimeoutConfig;
    env?: NodeJS.ProcessEnv;
    staleMs?: number;
    readOwnerProcessArgs?: SessionLockOwnerProcessArgsReader;
}): Promise<void>;
