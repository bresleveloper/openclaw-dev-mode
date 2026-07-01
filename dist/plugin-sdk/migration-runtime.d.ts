import { l as MigrationItem, m as MigrationProviderContext, s as MigrationApplyResult } from "./types-CXLy55Xw.js";

//#region src/plugin-sdk/migration-runtime.d.ts
/** Wrap migration runtime config access with a cached mutable snapshot during apply. */
declare function withCachedMigrationConfigRuntime(runtime: MigrationProviderContext["runtime"] | undefined, fallbackConfig: MigrationProviderContext["config"]): MigrationProviderContext["runtime"] | undefined;
/** Archive a migration item source into the report directory and mark the item migrated. */
declare function archiveMigrationItem(item: MigrationItem, reportDir: string): Promise<MigrationItem>;
/** Copy a migration item source to its target, optionally backing up an overwritten target. */
declare function copyMigrationFileItem(item: MigrationItem, reportDir: string, opts?: {
  overwrite?: boolean;
}): Promise<MigrationItem>;
/** Write redacted JSON and Markdown migration reports into the apply report directory. */
declare function writeMigrationReport(result: MigrationApplyResult, opts?: {
  title?: string;
}): Promise<void>;
//#endregion
export { type MigrationApplyResult, type MigrationItem, archiveMigrationItem, copyMigrationFileItem, withCachedMigrationConfigRuntime, writeMigrationReport };