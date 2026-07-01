import { type SessionDiskBudgetSweepResult } from "./disk-budget.js";
import { type ResolvedSessionMaintenanceConfig, type SessionMaintenanceWarning } from "./store-maintenance.js";
import type { SessionEntry } from "./types.js";
export type SessionMaintenanceApplyReport = {
    mode: ResolvedSessionMaintenanceConfig["mode"];
    beforeCount: number;
    afterCount: number;
    pruned: number;
    capped: number;
    diskBudget: SessionDiskBudgetSweepResult | null;
};
type SessionMaintenanceLogger = {
    warn: (message: string, context?: Record<string, unknown>) => void;
    info: (message: string, context?: Record<string, unknown>) => void;
};
type RemovedSessionFiles = Map<string, string | undefined>;
type RemovedSessionArtifactCleanup = {
    archiveRemovedSessionTranscripts: (params: {
        removedSessionFiles: Iterable<[string, string | undefined]>;
        referencedSessionIds: ReadonlySet<string>;
        storePath: string;
        reason: "deleted";
        restrictToStoreDir: true;
    }) => Promise<Set<string>>;
    removeRemovedSessionTrajectoryArtifacts: (params: {
        removedSessionFiles: RemovedSessionFiles;
        referencedSessionIds: ReadonlySet<string>;
        storePath: string;
        restrictToStoreDir: true;
    }) => Promise<void>;
    cleanupArchivedSessionTranscripts: (params: {
        directories: string[];
        rules: Array<{
            reason: "deleted" | "reset";
            olderThanMs: number;
        }>;
    }) => Promise<void>;
};
export type FileBackedSessionStoreMaintenanceParams = {
    storePath: string;
    store: Record<string, SessionEntry>;
    activeSessionKey?: string;
    onWarn?: (warning: SessionMaintenanceWarning) => void | Promise<void>;
    onMaintenanceApplied?: (report: SessionMaintenanceApplyReport) => void | Promise<void>;
    maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig>;
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    log: SessionMaintenanceLogger;
    artifacts: RemovedSessionArtifactCleanup;
};
export type FileBackedSessionStoreMaintenanceResult = {
    changedStore: boolean;
};
/**
 * Applies automatic session-store maintenance to the in-memory file-store image.
 *
 * Future SQLite adapters should map this into named boundaries: entry retention,
 * removed-session artifact cleanup, disk-budget eviction, and archive retention cleanup.
 */
export declare function applyFileBackedSessionStoreMaintenance(params: FileBackedSessionStoreMaintenanceParams): Promise<FileBackedSessionStoreMaintenanceResult>;
export {};
