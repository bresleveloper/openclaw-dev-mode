import type { PluginInstallRecord } from "../config/types.plugins.js";
import { type InstalledPluginIndexStoreOptions } from "./installed-plugin-index-store-path.js";
export { clearLoadInstalledPluginIndexInstallRecordsCache } from "./installed-plugin-index-record-cache.js";
/** Reads install records from the persisted installed plugin index. */
export declare function readPersistedInstalledPluginIndexInstallRecords(options?: InstalledPluginIndexStoreOptions): Promise<Record<string, PluginInstallRecord> | null>;
/** Synchronously reads install records from the persisted installed plugin index. */
export declare function readPersistedInstalledPluginIndexInstallRecordsSync(options?: InstalledPluginIndexStoreOptions): Record<string, PluginInstallRecord> | null;
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
export declare function loadInstalledPluginIndexInstallRecords(params?: InstalledPluginIndexStoreOptions): Promise<Record<string, PluginInstallRecord>>;
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
export declare function loadInstalledPluginIndexInstallRecordsSync(params?: InstalledPluginIndexStoreOptions): Record<string, PluginInstallRecord>;
