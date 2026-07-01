import type { MigrationDetection, MigrationItem, MigrationPlan, MigrationProviderContext, MigrationProviderPlugin, MigrationSummary } from "../plugins/types.js";
export type { MigrationDetection, MigrationItem, MigrationPlan, MigrationProviderContext, MigrationProviderPlugin, MigrationSummary, };
/** Shared migration failure reason when an item lacks required paths. */
export declare const MIGRATION_REASON_MISSING_SOURCE_OR_TARGET = "missing source or target";
/** Shared migration conflict reason when a target already exists. */
export declare const MIGRATION_REASON_TARGET_EXISTS = "target exists";
/** Creates a migration item, defaulting new provider output to the planned state. */
export declare function createMigrationItem(params: Omit<MigrationItem, "status"> & {
    status?: MigrationItem["status"];
}): MigrationItem;
/** Marks a planned item as blocked by an existing target value. */
export declare function markMigrationItemConflict(item: MigrationItem, reason: string): MigrationItem;
/** Marks an item as failed during detection or apply. */
export declare function markMigrationItemError(item: MigrationItem, reason: string): MigrationItem;
/** Marks an item as intentionally skipped, usually for manual follow-up. */
export declare function markMigrationItemSkipped(item: MigrationItem, reason: string): MigrationItem;
/** Counts migration item statuses for provider plans, apply results, and CLI reports. */
export declare function summarizeMigrationItems(items: readonly MigrationItem[]): MigrationSummary;
/** Structured config patch details stored on migration items. */
export type MigrationConfigPatchDetails = {
    /** Config object path where the patch should be merged. */
    path: string[];
    /** Patch value stored on the migration item. */
    value: unknown;
};
/** Reads a nested config value, returning undefined when a parent is not an object. */
export declare function readMigrationConfigPath(root: Record<string, unknown>, path: readonly string[]): unknown;
/** Deep-merges object patches and replaces scalar/array values with a cloned target value. */
export declare function mergeMigrationConfigValue(left: unknown, right: unknown): unknown;
/** Writes a config patch path in-place, creating missing object parents as needed. */
export declare function writeMigrationConfigPath(root: Record<string, unknown>, path: readonly string[], value: unknown): void;
/** Checks whether a config patch would overwrite existing leaf keys without `--overwrite`. */
export declare function hasMigrationConfigPatchConflict(config: MigrationProviderContext["config"], path: readonly string[], value: unknown): boolean;
/** Builds a planned or conflicting config-merge migration item. */
export declare function createMigrationConfigPatchItem(params: {
    id: string;
    target: string;
    path: string[];
    value: unknown;
    message: string;
    conflict?: boolean;
    reason?: string;
    source?: string;
    details?: Record<string, unknown>;
}): MigrationItem;
/** Builds a skipped item that records user-facing manual migration guidance. */
export declare function createMigrationManualItem(params: {
    id: string;
    source: string;
    message: string;
    recommendation: string;
}): MigrationItem;
/** Reads config patch metadata from an item produced by `createMigrationConfigPatchItem`. */
export declare function readMigrationConfigPatchDetails(item: MigrationItem): MigrationConfigPatchDetails | undefined;
/** Applies one planned config patch through the runtime config writer and returns its final status. */
export declare function applyMigrationConfigPatchItem(ctx: MigrationProviderContext, item: MigrationItem): Promise<MigrationItem>;
/** Manual items never mutate state; applying one preserves the skipped/manual status. */
export declare function applyMigrationManualItem(item: MigrationItem): MigrationItem;
/** Redacts likely secret values while preserving SecretRef-like objects for operator context. */
export declare function redactMigrationValue(value: unknown): unknown;
/** Redacts sensitive fields from one migration item before report/output serialization. */
export declare function redactMigrationItem(item: MigrationItem): MigrationItem;
/** Redacts sensitive fields from a full migration plan before report/output serialization. */
export declare function redactMigrationPlan<T extends MigrationPlan>(plan: T): T;
