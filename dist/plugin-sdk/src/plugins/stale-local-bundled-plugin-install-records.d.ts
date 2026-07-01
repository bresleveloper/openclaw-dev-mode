import type { PluginInstallRecord } from "../config/types.plugins.js";
import { type BundledPluginSource } from "./bundled-sources.js";
/** Stale install record that points at old compiled bundled plugin output. */
export type StaleLocalBundledPluginInstallRecord = {
    pluginId: string;
    record: PluginInstallRecord;
    recordPathField: "installPath" | "sourcePath";
    stalePath: string;
    bundledPath: string;
};
/** Lists path install records that still point at stale compiled bundled plugin output. */
export declare function listStaleLocalBundledPluginInstallRecords(params: {
    installRecords: Record<string, PluginInstallRecord>;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    bundled?: ReadonlyMap<string, BundledPluginSource>;
}): StaleLocalBundledPluginInstallRecord[];
/** Removes stale compiled bundled plugin path records from an install record map. */
export declare function pruneStaleLocalBundledPluginInstallRecords(params: {
    installRecords: Record<string, PluginInstallRecord>;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    bundled?: ReadonlyMap<string, BundledPluginSource>;
}): {
    records: Record<string, PluginInstallRecord>;
    stale: StaleLocalBundledPluginInstallRecord[];
};
