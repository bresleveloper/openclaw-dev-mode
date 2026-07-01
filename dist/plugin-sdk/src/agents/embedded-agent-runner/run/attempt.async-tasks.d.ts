import type { TaskRecord } from "../../../tasks/task-registry.types.js";
export type AsyncStartedToolMeta = {
    toolName?: string;
    asyncStarted?: boolean;
    asyncTaskRunId?: string;
    asyncTaskId?: string;
};
/** Summary of completion-required async task waits performed before a cron run can finish. */
export type CompletionRequiredAsyncTaskWaitResult = {
    waitedRunIds: string[];
    timedOutRunIds: string[];
    terminalTasks: TaskRecord[];
};
/** Returns whether a cron run has non-terminal generated-media tasks that must settle first. */
export declare function requiresCompletionRequiredAsyncTaskWait(params: {
    sessionKey: string | undefined;
    toolMetas: readonly AsyncStartedToolMeta[];
}): boolean;
/** Returns whether the current attempt should synchronously wait for media tasks. */
export declare function shouldWaitForCompletionRequiredAsyncTasks(params: {
    sessionKey: string | undefined;
    toolMetas: readonly AsyncStartedToolMeta[];
    yieldDetected?: boolean;
}): boolean;
/**
 * Polls completion-required async tasks until they reach terminal state, time
 * out at the run deadline, or abort. Newly discovered task run ids are folded
 * into later poll rounds so task metadata and registry state can arrive in any
 * order.
 */
export declare function waitForCompletionRequiredAsyncTasks(params: {
    getToolMetas: () => readonly AsyncStartedToolMeta[];
    sessionKey?: string;
    deadlineAtMs: number;
    now?: () => number;
    pollIntervalMs?: number;
    sleep?: (ms: number) => Promise<void>;
    abortSignal?: AbortSignal;
}): Promise<CompletionRequiredAsyncTaskWaitResult>;
