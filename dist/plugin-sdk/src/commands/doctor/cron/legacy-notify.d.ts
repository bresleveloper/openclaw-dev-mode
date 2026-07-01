type LegacyNotifyMigrationOutcome = {
    changed: boolean;
    warnings: string[];
};
/** Migrate legacy notify fallback flags into explicit delivery destinations when possible. */
export declare function migrateLegacyNotifyFallback(params: {
    jobs: Array<Record<string, unknown>>;
    legacyWebhook?: string;
}): LegacyNotifyMigrationOutcome;
export {};
