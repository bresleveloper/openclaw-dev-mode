import type { CronJob } from "../../../cron/types.js";
type CronLegacyIssueCounts = Partial<Record<string, number>>;
/**
 * Advisory for isolated agentTurn cron jobs that describe a command but cannot access shell tools.
 * These need operator attention, but `doctor --fix` cannot safely infer whether to grant tool
 * access or recreate them as command cron jobs.
 */
export declare function formatUnresolvedCommandPromptAdvisory(names: string[]): string | null;
/**
 * Advisory for isolated agentTurn cron jobs that drive shell/process tools from the prompt.
 * These keep running and are not a legacy store row, so `doctor --fix` cannot rewrite them;
 * routing this through the auto-repair preview made the finding persist after every --fix.
 */
export declare function formatUnresolvedShellPromptAdvisory(names: string[]): string | null;
/** Convert legacy cron issue counts into doctor preview lines. */
export declare function formatLegacyIssuePreview(issues: CronLegacyIssueCounts): string[];
/** Merge legacy JSON jobs into current jobs without duplicating matching ids/jobIds. */
export declare function mergeLegacyCronJobs(params: {
    currentJobs: Array<Record<string, unknown>>;
    legacyJobs: Array<Record<string, unknown>>;
}): {
    jobs: Array<Record<string, unknown>>;
    importedCount: number;
};
/** Attach runtime SQLite state columns back onto a config-defined cron job row. */
export declare function mergeRuntimeEntryIntoConfigJob(params: {
    job: Record<string, unknown>;
    runtimeEntry?: {
        updatedAtMs?: number;
        state?: Record<string, unknown>;
    };
}): Record<string, unknown>;
/** Return true when a SQLite cron projection row no longer matches config JSON. */
export declare function needsSqliteProjectionBackfill(params: {
    configJob: Record<string, unknown>;
    projectedJob?: CronJob;
}): boolean;
export {};
