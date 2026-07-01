/** Shared option types for the migrate command family. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MigrationPlan } from "../../plugins/types.js";
/** Embedded migration mode that returns config patch details instead of persisting them. */
type MigrationConfigPatchMode = "return";
/** Common options accepted by migrate list, plan, apply, and default flows. */
export type MigrateCommonOptions = {
    provider?: string;
    source?: string;
    includeSecrets?: boolean;
    authCredentials?: boolean;
    overwrite?: boolean;
    skills?: string[];
    plugins?: string[];
    verifyPluginApps?: boolean;
    json?: boolean;
    suppressPlanLog?: boolean;
    configOverride?: OpenClawConfig;
    configPatchMode?: MigrationConfigPatchMode;
};
/** Options for migrate apply, including backup and preflight-plan controls. */
export type MigrateApplyOptions = MigrateCommonOptions & {
    yes?: boolean;
    noBackup?: boolean;
    force?: boolean;
    backupOutput?: string;
    preflightPlan?: MigrationPlan;
};
/** Options for the default migrate command that can plan, dry-run, or apply. */
export type MigrateDefaultOptions = MigrateApplyOptions & {
    dryRun?: boolean;
};
export {};
