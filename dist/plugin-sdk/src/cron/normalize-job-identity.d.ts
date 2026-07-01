/** Normalizes mutable cron job rows from old `jobId` storage into the canonical `id` field. */
export declare function normalizeCronJobIdentityFields(raw: Record<string, unknown>): {
    mutated: boolean;
    legacyJobIdIssue: boolean;
};
