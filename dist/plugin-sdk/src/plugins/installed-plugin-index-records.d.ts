/** Builds and compares installed plugin index records for refresh decisions. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
import { clearLoadInstalledPluginIndexInstallRecordsCache, loadInstalledPluginIndexInstallRecords, loadInstalledPluginIndexInstallRecordsSync, readPersistedInstalledPluginIndexInstallRecords, readPersistedInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader.js";
import type { RefreshInstalledPluginIndexParams } from "./installed-plugin-index.js";
import { type PluginInstallUpdate } from "./installs.js";
export { clearLoadInstalledPluginIndexInstallRecordsCache, loadInstalledPluginIndexInstallRecords, loadInstalledPluginIndexInstallRecordsSync, readPersistedInstalledPluginIndexInstallRecords, readPersistedInstalledPluginIndexInstallRecordsSync, };
/** Config path for legacy plugin install records kept for migration/doctor flows. */
export declare const PLUGIN_INSTALLS_CONFIG_PATH: readonly ["plugins", "installs"];
/** Options shared by installed plugin index record storage helpers. */
export type InstalledPluginIndexRecordStoreOptions = {
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
    filePath?: string;
};
type InstalledPluginIndexRecordRefreshOptions = InstalledPluginIndexRecordStoreOptions & Partial<Omit<RefreshInstalledPluginIndexParams, "reason" | "installRecords">> & {
    now?: () => Date;
};
/** Resolves the installed plugin index record store path. */
export declare function resolveInstalledPluginIndexRecordsStorePath(options?: InstalledPluginIndexRecordStoreOptions): string;
/** Refreshes persisted installed plugin index records asynchronously. */
export declare function writePersistedInstalledPluginIndexInstallRecords(records: Record<string, PluginInstallRecord>, options?: InstalledPluginIndexRecordRefreshOptions): Promise<string>;
/** Refreshes persisted installed plugin index records synchronously. */
export declare function writePersistedInstalledPluginIndexInstallRecordsSync(records: Record<string, PluginInstallRecord>, options?: InstalledPluginIndexRecordRefreshOptions): string;
/** Returns config with plugin install records attached at the canonical config path. */
export declare function withPluginInstallRecords(config: OpenClawConfig, records: Record<string, PluginInstallRecord>): OpenClawConfig;
/** Returns config with legacy plugin install records removed. */
export declare function withoutPluginInstallRecords(config: OpenClawConfig, options?: {
    preserveEmptyPlugins?: boolean;
}): OpenClawConfig;
/** Applies one install update to an in-memory install record map. */
export declare function recordPluginInstallInRecords(records: Record<string, PluginInstallRecord>, update: PluginInstallUpdate): Record<string, PluginInstallRecord>;
/** Removes one plugin install record from an in-memory record map. */
export declare function removePluginInstallRecordFromRecords(records: Record<string, PluginInstallRecord>, pluginId: string): Record<string, PluginInstallRecord>;
