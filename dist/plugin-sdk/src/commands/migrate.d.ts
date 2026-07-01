import type { MigrationApplyResult, MigrationPlan } from "../plugins/types.js";
import type { RuntimeEnv } from "../runtime.js";
import type { MigrateApplyOptions, MigrateCommonOptions, MigrateDefaultOptions } from "./migrate/types.js";
/** Lists available migration providers as JSON or terse terminal rows. */
export declare function migrateListCommand(runtime: RuntimeEnv, opts?: {
    json?: boolean;
}): Promise<void>;
/** Creates and prints a migration plan without applying it. */
export declare function migratePlanCommand(runtime: RuntimeEnv, opts: MigrateCommonOptions): Promise<MigrationPlan>;
/** Applies a migration non-interactively when `yes` is true. */
export declare function migrateApplyCommand(runtime: RuntimeEnv, opts: MigrateApplyOptions & {
    yes: true;
}): Promise<MigrationApplyResult>;
/** Plans interactively when needed, prompts, then applies the selected migration. */
export declare function migrateApplyCommand(runtime: RuntimeEnv, opts: MigrateApplyOptions): Promise<MigrationApplyResult | MigrationPlan>;
/** Default migrate command: list providers, plan, dry-run, or apply based on flags. */
export declare function migrateDefaultCommand(runtime: RuntimeEnv, opts: MigrateDefaultOptions): Promise<MigrationPlan | MigrationApplyResult>;
