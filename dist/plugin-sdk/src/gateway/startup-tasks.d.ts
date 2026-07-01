type StartupTaskResult = {
    status: "skipped";
    reason: string;
} | {
    status: "ran";
} | {
    status: "failed";
    reason: string;
};
/** Startup task descriptor used by gateway startup side-effect runners. */
export type StartupTask = {
    source: string;
    agentId?: string;
    sessionKey?: string;
    workspaceDir?: string;
    run: () => Promise<StartupTaskResult>;
};
type StartupTaskLogger = {
    debug: (message: string, meta?: Record<string, unknown>) => void;
    warn: (message: string, meta?: Record<string, unknown>) => void;
};
/** Runs startup tasks in order and logs failed/skipped task metadata. */
export declare function runStartupTasks(params: {
    tasks: StartupTask[];
    log: StartupTaskLogger;
}): Promise<StartupTaskResult[]>;
export {};
