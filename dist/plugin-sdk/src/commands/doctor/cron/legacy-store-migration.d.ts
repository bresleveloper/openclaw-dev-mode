import type { LoadedCronStore } from "../../../cron/store.js";
/** Return true when legacy cron JSON or state files exist for a store path. */
export declare function legacyCronStoreFilesExist(storePath: string): Promise<boolean>;
/** Rename legacy cron JSON/state files after successful migration. */
export declare function archiveLegacyCronStoreForMigration(storePath: string): Promise<void>;
/** Load legacy cron JSON/state files into the current loaded-store shape for migration. */
export declare function loadLegacyCronStoreForMigration(storePath: string): Promise<LoadedCronStore>;
