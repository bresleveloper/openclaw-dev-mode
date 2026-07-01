type ProgressOptions = {
    label: string;
    indeterminate?: boolean;
    total?: number;
    enabled?: boolean;
    delayMs?: number;
    stream?: NodeJS.WriteStream;
    fallback?: "spinner" | "line" | "log" | "none";
};
/** Minimal progress API exposed to CLI work callbacks. */
export type ProgressReporter = {
    setLabel: (label: string) => void;
    setPercent: (percent: number) => void;
    tick: (delta?: number) => void;
    done: () => void;
};
/** Completed/total progress update shape used by totals-based commands. */
export type ProgressTotalsUpdate = {
    completed: number;
    total: number;
    label?: string;
};
/** Decide whether the interactive spinner is safe for the current terminal state. */
export declare function shouldUseInteractiveProgressSpinner(params: {
    fallback?: ProgressOptions["fallback"];
    streamIsTty?: boolean;
    stdinIsRaw?: boolean;
}): boolean;
/** Create a no-op, spinner, line, log, and OSC-capable progress reporter. */
export declare function createCliProgress(options: ProgressOptions): ProgressReporter;
/** Run async work with a progress reporter that is always stopped in finally. */
export declare function withProgress<T>(options: ProgressOptions, work: (progress: ProgressReporter) => Promise<T>): Promise<T>;
/** Run async work with a progress reporter plus a completed/total update adapter. */
export declare function withProgressTotals<T>(options: ProgressOptions, work: (update: (update: ProgressTotalsUpdate) => void, progress: ProgressReporter) => Promise<T>): Promise<T>;
export {};
