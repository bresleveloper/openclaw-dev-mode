/** Queue limits for bounded fire-and-forget hook execution. */
export type FireAndForgetBoundedHookOptions = {
    maxConcurrency?: number;
    maxQueue?: number;
    timeoutMs?: number;
};
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
export declare function formatHookErrorForLog(err: unknown): string;
/** Run a hook promise without awaiting it, logging rejection safely. */
export declare function fireAndForgetHook(task: Promise<unknown>, label: string, logger?: (message: string) => void): void;
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
export declare function fireAndForgetBoundedHook(task: () => Promise<unknown>, label: string, logger?: (message: string) => void, options?: FireAndForgetBoundedHookOptions): void;
