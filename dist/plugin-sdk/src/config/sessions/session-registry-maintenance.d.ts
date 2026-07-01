export type SessionRegistryMaintenanceStoreSummary = {
    afterCount: number;
    beforeCount: number;
    preservedRunning: number;
    pruned: number;
};
export type SessionRegistryMaintenanceStoreOptions = {
    /** Apply pruning to the backing store; false previews against a clone. */
    apply: boolean;
    /** Retention window for cron-run session entries. */
    retentionMs: number;
    /** Currently running cron job ids, normalized to lowercase. */
    runningCronJobIds: ReadonlySet<string>;
    /** Resolved session registry store path for one agent. */
    storePath: string;
};
/**
 * Runs task session-registry maintenance for one resolved agent store.
 * Preview prunes a clone; apply uses one store-sized write transaction and
 * skips generic session maintenance so non-cron rows stay outside this sweep.
 */
export declare function runSessionRegistryMaintenanceForStore(params: SessionRegistryMaintenanceStoreOptions): Promise<SessionRegistryMaintenanceStoreSummary>;
