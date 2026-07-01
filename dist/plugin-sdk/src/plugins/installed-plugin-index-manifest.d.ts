import type { InstalledPluginIndexRecord } from "./installed-plugin-index-types.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
type ManifestBackedRecord = Pick<PluginManifestRecord | InstalledPluginIndexRecord, "bundleFormat" | "format" | "manifestPath">;
/** True when a Claude bundle record omits its optional manifest file. */
export declare function hasOptionalMissingPluginManifestFile(record: ManifestBackedRecord): boolean;
export {};
