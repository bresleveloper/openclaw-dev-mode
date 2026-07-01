import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type InstalledPluginIndexRecordStoreOptions } from "../plugins/installed-plugin-index-records.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
import { type PluginRegistryInstallMigrationParams } from "./doctor/shared/plugin-registry-migration.js";
type PluginRegistryDoctorRepairParams = Omit<PluginRegistryInstallMigrationParams, "config"> & InstalledPluginIndexRecordStoreOptions & {
    config: OpenClawConfig;
    prompter: Pick<DoctorPrompter, "shouldRepair">;
};
/** Removes managed npm packages that shadow current bundled plugins when repair is enabled. */
export declare function maybeRepairStaleManagedNpmBundledPlugins(params: PluginRegistryDoctorRepairParams): boolean;
/** Removes local install records that shadow current bundled plugin sources. */
export declare function maybeRepairStaleLocalBundledPluginInstallRecords(params: PluginRegistryDoctorRepairParams): Promise<string[]>;
/** Relinks managed npm plugin packages to the current OpenClaw host packages. */
export declare function maybeRepairManagedNpmOpenClawPeerLinks(params: PluginRegistryDoctorRepairParams): Promise<boolean>;
/**
 * Runs plugin registry doctor repairs and refreshes the persisted plugin index when needed.
 *
 * Stale bundled shadows are removed before registry migration so the rebuilt index resolves the
 * current bundled source instead of an obsolete managed/local install record.
 */
export declare function maybeRepairPluginRegistryState(params: PluginRegistryDoctorRepairParams): Promise<OpenClawConfig>;
export {};
