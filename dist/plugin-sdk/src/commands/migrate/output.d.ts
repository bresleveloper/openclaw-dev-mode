import type { MigrationApplyResult, MigrationPlan } from "../../plugins/types.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { MigrateApplyOptions } from "./types.js";
/** Formats a redaction-safe migration preview for terminal output. */
export declare function formatMigrationPreview(plan: MigrationPlan): string[];
/** Formats migration apply results for terminal output. */
export declare function formatMigrationResult(plan: MigrationPlan): string[];
/** Shared short conflict phrases used by migration output and selection hints. */
export declare const MIGRATION_CONFLICT_REASON_PHRASES: Record<string, string>;
/** Throws when a plan still contains conflicts that require explicit overwrite. */
export declare function assertConflictFreePlan(plan: MigrationPlan, providerId: string): void;
/** Writes apply results as redacted JSON or terminal text with backup/report paths. */
export declare function writeApplyResult(runtime: RuntimeEnv, opts: MigrateApplyOptions, result: MigrationApplyResult): void;
/** Throws when apply completed with conflicts or errors. */
export declare function assertApplySucceeded(result: MigrationApplyResult): void;
