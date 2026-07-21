import { l as MigrationItem, m as MigrationProviderContext, s as MigrationApplyResult } from "./types-BpDhk2ev.js";

//#region src/plugin-sdk/migration-runtime.d.ts
/** Directories a migration provider writes imported agent data into. */
type PlannedMigrationTargets = {
  workspaceDir: string;
  stateDir: string;
  agentDir: string;
};
/**
 * Resolves the default agent's workspace/state/agent directories for a
 * migration run. Prefers the runtime resolver, then a configured agentDir
 * (home-relative paths honor the effective-home resolution used by the rest
 * of the product), then the canonical state-dir layout.
 */
declare function resolvePlannedMigrationTargets(ctx: MigrationProviderContext): PlannedMigrationTargets;
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
export { withCachedMigrationConfigRuntime as a, resolvePlannedMigrationTargets as i, archiveMigrationItem as n, writeMigrationReport as o, copyMigrationFileItem as r, PlannedMigrationTargets as t };