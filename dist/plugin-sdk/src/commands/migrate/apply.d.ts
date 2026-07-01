import type { MigrationApplyResult, MigrationProviderPlugin } from "../../plugins/types.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { MigrateApplyOptions } from "./types.js";
/** Creates a verified pre-migration backup, treating absent local state as empty. */
export declare function createPreMigrationBackup(opts: {
    output?: string;
}): Promise<string | undefined>;
/** Applies the selected migration provider plan and writes the final result. */
export declare function runMigrationApply(params: {
    runtime: RuntimeEnv;
    opts: MigrateApplyOptions;
    providerId: string;
    provider: MigrationProviderPlugin;
}): Promise<MigrationApplyResult>;
