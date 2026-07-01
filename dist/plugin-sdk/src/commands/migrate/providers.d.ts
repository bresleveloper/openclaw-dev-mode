import type { MigrationPlan, MigrationProviderPlugin } from "../../plugins/types.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { MigrateCommonOptions } from "./types.js";
/** Resolves a migration provider from the loaded plugin migration registry. */
export declare function resolveMigrationProvider(providerId: string, config?: import("../../config/types.openclaw.ts").OpenClawConfig): MigrationProviderPlugin;
/** Builds provider-specific options from shared migrate CLI flags. */
export declare function buildMigrationProviderOptions(opts: MigrateCommonOptions, providerId?: string | undefined): Record<string, unknown> | undefined;
/** Creates a migration plan after validating provider-specific flag support. */
export declare function createMigrationPlan(runtime: RuntimeEnv, opts: MigrateCommonOptions & {
    provider: string;
}): Promise<MigrationPlan>;
