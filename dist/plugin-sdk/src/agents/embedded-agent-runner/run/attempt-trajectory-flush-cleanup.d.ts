/** Minimal recorder surface needed to flush trajectory data during run cleanup. */
type EmbeddedAttemptTrajectoryRecorder = {
    describeFlushState: () => string | undefined;
    flush: () => Promise<void>;
};
/**
 * Flushes attempt trajectory data through the shared cleanup timeout wrapper so
 * stuck recorder writes warn with run/session context instead of blocking run
 * teardown indefinitely.
 */
export declare function flushEmbeddedAttemptTrajectoryRecorder(params: {
    runId: string;
    sessionId: string;
    trajectoryRecorder: EmbeddedAttemptTrajectoryRecorder | null;
    log: {
        warn: (message: string) => void;
    };
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
}): Promise<void>;
export {};
