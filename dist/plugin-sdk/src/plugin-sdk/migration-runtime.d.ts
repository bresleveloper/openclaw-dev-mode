import type { MigrationApplyResult, MigrationItem, MigrationProviderContext } from "../plugins/types.js";
export type { MigrationApplyResult, MigrationItem } from "../plugins/types.js";
/** Wrap migration runtime config access with a cached mutable snapshot during apply. */
export declare function withCachedMigrationConfigRuntime(runtime: MigrationProviderContext["runtime"] | undefined, fallbackConfig: MigrationProviderContext["config"]): MigrationProviderContext["runtime"] | undefined;
/** Archive a migration item source into the report directory and mark the item migrated. */
export declare function archiveMigrationItem(item: MigrationItem, reportDir: string): Promise<MigrationItem>;
/** Copy a migration item source to its target, optionally backing up an overwritten target. */
export declare function copyMigrationFileItem(item: MigrationItem, reportDir: string, opts?: {
    overwrite?: boolean;
}): Promise<MigrationItem>;
/** Write redacted JSON and Markdown migration reports into the apply report directory. */
export declare function writeMigrationReport(result: MigrationApplyResult, opts?: {
    title?: string;
}): Promise<void>;
