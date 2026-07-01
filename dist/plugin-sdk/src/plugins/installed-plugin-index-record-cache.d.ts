import type { PluginInstallRecord } from "../config/types.plugins.js";
/** Cached installed plugin records for one store/recovery key. */
export type InstallRecordsCacheEntry = {
    records: Record<string, PluginInstallRecord>;
};
/** Returns cached installed plugin records for a store/recovery key. */
export declare function getInstalledPluginIndexInstallRecordsCache(key: string): InstallRecordsCacheEntry | undefined;
/** Stores cached installed plugin records for a store/recovery key. */
export declare function setInstalledPluginIndexInstallRecordsCache(key: string, entry: InstallRecordsCacheEntry): void;
/** Current cache generation used to detect concurrent clears during async loads. */
export declare function getInstalledPluginIndexInstallRecordsCacheGeneration(): number;
/** Clears cached installed plugin records and advances the cache generation. */
export declare function clearLoadInstalledPluginIndexInstallRecordsCache(): void;
