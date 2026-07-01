/** Converts cron jobs between public store shape and normalized SQLite rows. */
import type { DatabaseSync } from "node:sqlite";
import type { CronStoreFile } from "../types.js";
import type { CronJobRow } from "./schema.js";
import type { LoadedCronStore } from "./types.js";
/** Fails before replacing SQLite rows when any config job cannot round-trip. */
export declare function assertCronStoreCanPersist(store: CronStoreFile): void;
/** Loads cron rows in config order with deterministic fallbacks for old rows. */
export declare function loadCronRows(db: DatabaseSync, storeKey: string): CronJobRow[];
/** Replaces all persisted cron rows for one store key from the config store snapshot. */
export declare function replaceCronRows(db: DatabaseSync, storeKey: string, store: CronStoreFile): void;
/** Updates only mutable runtime columns without rewriting full job config JSON. */
export declare function updateCronRuntimeRows(db: DatabaseSync, storeKey: string, store: CronStoreFile): void;
/** Reconstructs loaded cron store data and config-runtime sidecars from SQLite rows. */
export declare function loadedCronStoreFromRows(rows: CronJobRow[]): LoadedCronStore;
