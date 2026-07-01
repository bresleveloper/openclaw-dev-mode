type AgentCleanupLogger = {
    warn: (message: string) => void;
};
/** Run one cleanup step with timeout logging and late-rejection handling. */
export declare function runAgentCleanupStep(params: {
    runId: string;
    sessionId: string;
    step: string;
    cleanup: () => Promise<void>;
    getTimeoutDetails?: () => string | undefined;
    log: AgentCleanupLogger;
    env?: NodeJS.ProcessEnv;
    timeoutMs?: number;
}): Promise<void>;
export {};
