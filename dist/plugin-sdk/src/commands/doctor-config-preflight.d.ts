import { readConfigFileSnapshot } from "../config/io.js";
import type { ConfigFileSnapshot } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type DoctorConfigPreflightResult = {
    snapshot: Awaited<ReturnType<typeof readConfigFileSnapshot>>;
    baseConfig: OpenClawConfig;
};
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
export declare function shouldSkipPluginValidationForDoctorConfigPreflight(env?: NodeJS.ProcessEnv): boolean;
/**
 * Runs early doctor config checks before the main config repair flow.
 *
 * It may migrate legacy state/config paths, recover corrupt target config when requested, and
 * returns the best-effort config snapshot used by later doctor checks.
 */
export declare function runDoctorConfigPreflight(options?: {
    migrateState?: boolean;
    migrateLegacyConfig?: boolean;
    repairPrefixedConfig?: boolean;
    recoverCorruptTargetStore?: boolean;
    invalidConfigNote?: string | false;
    beforeStateMigrations?: (snapshot?: ConfigFileSnapshot) => Promise<boolean>;
}): Promise<DoctorConfigPreflightResult>;
