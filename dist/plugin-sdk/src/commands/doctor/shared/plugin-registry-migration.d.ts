import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import { type InstalledPluginIndexStoreInspection, type InstalledPluginIndexStoreOptions } from "../../../plugins/installed-plugin-index-store.js";
import { type InstalledPluginIndex, type LoadInstalledPluginIndexParams } from "../../../plugins/installed-plugin-index.js";
export declare const DISABLE_PLUGIN_REGISTRY_MIGRATION_ENV = "OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION";
export declare const FORCE_PLUGIN_REGISTRY_MIGRATION_ENV = "OPENCLAW_FORCE_PLUGIN_REGISTRY_MIGRATION";
export type PluginRegistryInstallMigrationPreflightAction = "disabled" | "skip-existing" | "migrate";
export type PluginRegistryInstallMigrationPreflight = {
    /** Migration action selected before reading or writing registry state. */
    action: PluginRegistryInstallMigrationPreflightAction;
    /** Persisted plugin index path that migration will inspect or write. */
    filePath: string;
    /** True when deprecated force env requested migration despite existing registry. */
    force: boolean;
    /** Deprecation warnings for env toggles that should be shown to users. */
    deprecationWarnings: readonly string[];
};
export type PluginRegistryInstallMigrationResult = {
    status: "disabled" | "skip-existing" | "dry-run";
    migrated: false;
    preflight: PluginRegistryInstallMigrationPreflight;
} | {
    status: "migrated";
    migrated: true;
    preflight: PluginRegistryInstallMigrationPreflight;
    inspection: InstalledPluginIndexStoreInspection;
    current: InstalledPluginIndex;
};
export type PluginRegistryInstallMigrationParams = LoadInstalledPluginIndexParams & InstalledPluginIndexStoreOptions & {
    dryRun?: boolean;
    existsSync?: (path: string) => boolean;
    readConfig?: () => Promise<OpenClawConfig> | OpenClawConfig;
};
/** Decide whether plugin install registry migration should run for this environment. */
export declare function preflightPluginRegistryInstallMigration(params?: PluginRegistryInstallMigrationParams): PluginRegistryInstallMigrationPreflight;
/** Persist a migrated plugin install registry from legacy config/install records when needed. */
export declare function migratePluginRegistryForInstall(params?: PluginRegistryInstallMigrationParams): Promise<PluginRegistryInstallMigrationResult>;
