import type { OpenClawStateDatabaseOptions } from "../state/openclaw-state-db.js";
/** Options for resolving installed plugin index storage paths. */
export type InstalledPluginIndexStoreOptions = {
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
    filePath?: string;
};
/** Resolves the canonical SQLite-backed installed plugin index path. */
export declare function resolveInstalledPluginIndexStorePath(options?: InstalledPluginIndexStoreOptions): string;
/** Resolves state database options for the installed plugin index store. */
export declare function resolveInstalledPluginIndexStateDatabaseOptions(options?: InstalledPluginIndexStoreOptions): OpenClawStateDatabaseOptions;
/** Resolves the legacy JSON installed plugin index path for migration/doctor use. */
export declare function resolveLegacyInstalledPluginIndexStorePath(options?: InstalledPluginIndexStoreOptions): string;
