import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { PluginInstallRecord } from "../../../config/types.plugins.js";
export type RepairMissingPluginInstallsResult = {
    /** User-facing repair notes for installed or recovered plugin records. */
    changes: string[];
    /** User-facing warnings for failed or skipped plugin install repairs. */
    warnings: string[];
    /** Plugin ids successfully repaired from current configuration. */
    repairedPluginIds?: string[];
    /** User-facing details for repairs explicitly deferred until post-core convergence. */
    deferredRepairDetails?: string[];
    /** Plugin ids whose install repair failed and should be preserved from cleanup passes. */
    failedPluginIds?: string[];
    /**
     * The full install-record map after repair. Equal to the input
     * `baselineRecords` (or the disk-loaded records when no baseline was
     * provided) plus any mutations (newly-installed payloads, removed stale
     * bundled records). Callers that need to subsequently overwrite the
     * persisted index MUST seed their write from this map — the disk has
     * already been written to with the same set, but the in-memory caller
     * state is stale otherwise.
     */
    records: Record<string, PluginInstallRecord>;
};
/** Repair missing installs inferred from the current OpenClaw config. */
export declare function repairMissingConfiguredPluginInstalls(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    /**
     * Optional pre-seeded records. When provided, this map is used instead of
     * the disk-loaded install-record snapshot. Pass the in-memory records
     * from earlier post-core steps (sync/npm) so this repair pass can layer
     * its mutations on top of them rather than reading a stale disk
     * snapshot. The merged result is persisted before this function returns.
     */
    baselineRecords?: Record<string, PluginInstallRecord>;
}): Promise<RepairMissingPluginInstallsResult>;
/** Repair missing installs for an explicit plugin/channel id set. */
export declare function repairMissingPluginInstallsForIds(params: {
    cfg: OpenClawConfig;
    pluginIds: Iterable<string>;
    channelIds?: Iterable<string>;
    blockedPluginIds?: Iterable<string>;
    env?: NodeJS.ProcessEnv;
    baselineRecords?: Record<string, PluginInstallRecord>;
}): Promise<RepairMissingPluginInstallsResult>;
