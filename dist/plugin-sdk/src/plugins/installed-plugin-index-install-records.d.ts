/** Normalizes durable plugin install records into installed-index metadata and back. */
import type { PluginInstallRecord } from "../config/types.plugins.js";
import type { InstalledPluginIndex, InstalledPluginInstallRecordInfo } from "./installed-plugin-index-types.js";
/** Normalizes raw plugin install records into index-safe install record metadata. */
export declare function normalizeInstallRecordMap(records: Record<string, PluginInstallRecord> | undefined): Record<string, InstalledPluginInstallRecordInfo>;
/** Extracts raw plugin install records from either current or legacy installed-index shapes. */
export declare function extractPluginInstallRecordsFromInstalledPluginIndex(index: InstalledPluginIndex | null | undefined): Record<string, PluginInstallRecord>;
