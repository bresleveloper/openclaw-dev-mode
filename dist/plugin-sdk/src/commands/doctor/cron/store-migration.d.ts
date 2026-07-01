type CronStoreIssueKey = "jobId" | "missingId" | "nonStringId" | "legacyScheduleString" | "legacyScheduleCron" | "legacyPayloadKind" | "legacyPayloadCodexModel" | "legacyAgentTurnCommandPayload" | "unresolvedAgentTurnShellToolPrompt" | "legacyPayloadProvider" | "legacyTopLevelPayloadFields" | "legacyTopLevelDeliveryFields" | "legacyDeliveryMode" | "invalidSchedule" | "invalidPayload";
type CronStoreIssues = Partial<Record<CronStoreIssueKey, number>>;
type NormalizeCronStoreJobsResult = {
    issues: CronStoreIssues;
    unresolvedAgentTurnCommandPromptJobs: string[];
    unresolvedAgentTurnShellToolPromptJobs: string[];
    jobs: Array<Record<string, unknown>>;
    mutated: boolean;
    removedJobs: Array<{
        job: Record<string, unknown>;
        reason: string;
        sourceIndex: number;
    }>;
};
/** Normalize persisted cron jobs in place and report issues plus rows to quarantine. */
export declare function normalizeStoredCronJobs(jobs: Array<Record<string, unknown>>): NormalizeCronStoreJobsResult;
export {};
