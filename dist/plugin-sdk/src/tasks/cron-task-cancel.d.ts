export declare const CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS = 60000;
export declare function startActiveCronTaskRunSettlementGrace(): void;
export declare function registerActiveCronTaskRun(params: {
    runId: string | undefined;
    controller: AbortController;
    onCancel?: (reason: string) => void;
}): (() => void) | undefined;
export declare function abortActiveCronTaskRuns(reason?: string): number;
export declare function trackActiveCronTaskRunSettlement(promise: Promise<unknown>): void;
export declare function retireActiveCronTaskRunTracking(): void;
export declare function waitForActiveCronTaskRuns(timeoutMs: number): Promise<{
    drained: boolean;
    active: number;
}>;
export declare function cancelActiveCronTaskRun(params: {
    runId: string | undefined;
    reason?: string;
}): boolean;
export declare function resetActiveCronTaskRunsForTests(): void;
