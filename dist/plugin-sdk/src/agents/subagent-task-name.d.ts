type NormalizeSubagentTaskNameResult = {
    taskName?: string;
    error?: undefined;
} | {
    taskName?: undefined;
    error: string;
};
/** Normalizes and validates an optional subagent task name. */
export declare function normalizeSubagentTaskName(value: unknown): NormalizeSubagentTaskNameResult;
export {};
