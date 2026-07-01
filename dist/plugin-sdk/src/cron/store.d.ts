import type { CronQuarantineFile, LoadedCronStore, QuarantinedCronConfigJob } from "./store/types.js";
export type { CronConfigJobRuntimeEntry, CronQuarantineFile, LoadedCronStore, QuarantinedCronConfigJob, } from "./store/types.js";
import type { CronStoreFile } from "./types.js";
/** Resolves the sidecar quarantine path used for invalid cron config rows. */
export declare function resolveCronQuarantinePath(storePath: string): string;
/** Resolves the cron jobs store path, expanding home-relative user input. */
export declare function resolveCronJobsStorePath(storePath?: string): string;
/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
export declare function loadCronJobsStoreWithConfigJobs(storePath: string): Promise<LoadedCronStore>;
/** Loads only the persisted cron job store payload. */
export declare function loadCronJobsStore(storePath: string): Promise<CronStoreFile>;
/** Synchronously loads only the persisted cron job store payload. */
export declare function loadCronJobsStoreSync(storePath: string): CronStoreFile;
type SaveCronStoreOptions = {
    stateOnly?: boolean;
};
/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
export declare function saveCronJobsStore(storePath: string, store: CronStoreFile, opts?: SaveCronStoreOptions): Promise<void>;
/** Resolves the public plugin-SDK cron store path. */
export declare function resolveCronStorePath(storePath?: string): string;
/** Plugin-SDK alias for loading the cron store. */
export declare function loadCronStore(storePath: string): Promise<CronStoreFile>;
/** Plugin-SDK alias for saving the cron store. */
export declare function saveCronStore(storePath: string, store: CronStoreFile, opts?: SaveCronStoreOptions): Promise<void>;
/** Loads the cron quarantine sidecar, validating its persisted v1 shape. */
export declare function loadCronQuarantineFile(pathLocal: string): Promise<CronQuarantineFile>;
/** Appends new invalid cron config rows to the quarantine sidecar without duplicating entries. */
export declare function saveCronQuarantineFile(params: {
    storePath: string;
    entries: QuarantinedCronConfigJob[];
    nowMs: number;
}): Promise<string | null>;
