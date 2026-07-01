import type { LegacyConfigRule } from "../config/legacy.shared.js";
import type { OpenClawConfig } from "../config/types.js";
import type { OpenKeyedStoreOptions, PluginStateKeyedStore } from "../plugin-state/plugin-state-store.js";
import type { DoctorSessionRouteStateOwner } from "./doctor-session-route-state-owner-types.js";
import { type PluginModuleLoaderFactory } from "./plugin-module-loader-cache.js";
export type PluginDoctorStateMigrationDetection = {
    preview: string[];
};
export type PluginDoctorStateMigrationContext = {
    openPluginStateKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
};
export type PluginDoctorStateMigration = {
    id: string;
    label: string;
    detectLegacyState: (params: {
        config: OpenClawConfig;
        env: NodeJS.ProcessEnv;
        stateDir: string;
        oauthDir: string;
        context: PluginDoctorStateMigrationContext;
    }) => Promise<PluginDoctorStateMigrationDetection | null> | PluginDoctorStateMigrationDetection | null;
    migrateLegacyState: (params: {
        config: OpenClawConfig;
        env: NodeJS.ProcessEnv;
        stateDir: string;
        oauthDir: string;
        context: PluginDoctorStateMigrationContext;
    }) => Promise<{
        changes: string[];
        warnings: string[];
    }> | {
        changes: string[];
        warnings: string[];
    };
};
export type PluginDoctorStateMigrationEntry = {
    pluginId: string;
    migration: PluginDoctorStateMigration;
};
export declare function collectRelevantDoctorPluginIds(raw: unknown): string[];
export declare function collectRelevantDoctorPluginIdsForTouchedPaths(params: {
    raw: unknown;
    touchedPaths: ReadonlyArray<ReadonlyArray<string>>;
}): string[];
export declare function clearPluginDoctorContractRegistryCache(): void;
export declare function setPluginDoctorContractRegistryModuleLoaderFactoryForTest(factory: PluginModuleLoaderFactory | undefined): void;
export declare function listPluginDoctorLegacyConfigRules(params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    pluginIds?: readonly string[];
}): LegacyConfigRule[];
export declare function listPluginDoctorSessionRouteStateOwners(params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    pluginIds?: readonly string[];
}): DoctorSessionRouteStateOwner[];
export declare function listPluginDoctorStateMigrationEntries(params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    pluginIds?: readonly string[];
}): PluginDoctorStateMigrationEntry[];
export declare function applyPluginDoctorCompatibilityMigrations(cfg: OpenClawConfig, params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    pluginIds?: readonly string[];
}): {
    config: OpenClawConfig;
    changes: string[];
};
