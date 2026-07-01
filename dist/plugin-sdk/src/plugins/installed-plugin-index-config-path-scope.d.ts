import type { InstalledPluginIndex, InstalledPluginIndexRecord } from "./installed-plugin-index-types.js";
/** Compat code marking install records that need config-path activation metadata. */
export declare const CONFIG_PATH_ACTIVATION_COMPAT_CODE = "activation-config-path-hint";
/** True when an index still has config-path activation records missing startup metadata. */
export declare function hasMissingConfigPathActivationMetadata(index: InstalledPluginIndex): boolean;
/** True when a record migrated config-path activation startup metadata. */
export declare function hasConfigPathActivationMetadataMigration(params: {
    previous: InstalledPluginIndexRecord;
    current: InstalledPluginIndexRecord;
}): boolean;
