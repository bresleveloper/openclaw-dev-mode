import type { OpenClawConfig } from "../config/types.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
export type PluginVersionDriftEntry = {
    pluginId: string;
    installedVersion: string;
    gatewayVersion: string;
    source: PluginInstallRecord["source"];
    packageName?: string;
    spec?: string;
};
export type PluginVersionDriftReport = {
    gatewayVersion: string;
    drifts: PluginVersionDriftEntry[];
};
/** Exact npm pins need a package@version target; id-only updates preserve the old pin. */
export declare function resolvePluginVersionDriftUpdateCommand(entry: PluginVersionDriftEntry): string;
/**
 * Compare active official external plugin installs against the running gateway
 * version and return any mismatches.
 *
 * @param params.gatewayVersion The gateway version string (typically the
 *   `version` field of the installed openclaw package.json).
 * @param params.installRecords The full set of recorded plugin installs (as
 *   produced by `loadInstalledPluginIndexInstallRecords`).
 * @param params.config The merged daemon-side OpenClawConfig (optional).
 *   Plugins inactive under the effective activation policy are skipped.
 *
 * The returned `drifts` list is sorted by `pluginId` for stable output.
 */
export declare function detectPluginVersionDrift(params: {
    gatewayVersion: string;
    installRecords: Record<string, PluginInstallRecord>;
    config?: OpenClawConfig;
}): PluginVersionDriftReport;
