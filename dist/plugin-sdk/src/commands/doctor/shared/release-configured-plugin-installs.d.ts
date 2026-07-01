import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import { type UpdatePostInstallDoctorResult } from "../../../infra/update-doctor-result.js";
export declare const CONFIGURED_PLUGIN_INSTALL_RELEASE_VERSION = "2026.5.2-beta.1";
type ReleaseConfiguredPluginIds = {
    pluginIds: string[];
    channelIds: string[];
};
/** Return true when this config has not yet crossed the configured-plugin install release gate. */
export declare function shouldRunConfiguredPluginInstallReleaseStep(params: {
    currentVersion?: string | null;
    touchedVersion?: string | null;
    releaseVersion?: string;
}): boolean;
/** Collect plugin/channel ids implied by config for the release install backfill step. */
export declare function collectReleaseConfiguredPluginIds(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): ReleaseConfiguredPluginIds;
/** Run the configured-plugin install release backfill when the config still needs it. */
export declare function maybeRunConfiguredPluginInstallReleaseStep(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    touchedVersion?: string | null;
    currentVersion?: string | null;
}): Promise<{
    changes: string[];
    warnings: string[];
    completed: boolean;
    touchedConfig: boolean;
    postInstallDoctorResult?: UpdatePostInstallDoctorResult;
}>;
export {};
