import type { ConfigWriteOptions } from "../config/io.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type HookInstallUpdate } from "../hooks/installs.js";
import type { PluginInstallUpdate } from "../plugins/installs.js";
import { type RuntimeEnv } from "../runtime.js";
export type ConfigSnapshotForInstallPersist = {
    config: OpenClawConfig;
    baseHash: string | undefined;
    writeOptions: Pick<ConfigWriteOptions, "assertConfigPathForWrite" | "expectedConfigPath" | "ownedConfigPathForWrite" | "envSnapshotForRestore" | "includeFileHashesForWrite" | "includeFileTargetsForWrite">;
};
type ConfigMutationSection = "hooks" | "plugins";
export type ConfigMutationPreflight = {
    mode: "allowed";
} | {
    mode: "blocked";
    scope: "config" | ConfigMutationSection;
    reason: string;
};
export declare function containsConfigIncludeDirective(value: unknown): boolean;
export declare function supportsInstallConfigSingleTopLevelIncludeShape(authoredSection: unknown): boolean;
export declare function resolveInstallConfigMutationPreflights(params: {
    parsed: Record<string, unknown>;
    snapshotPath: string;
    writeOptions: ConfigSnapshotForInstallPersist["writeOptions"];
}): {
    hookMutation: ConfigMutationPreflight;
    pluginMutation: ConfigMutationPreflight;
};
export declare function resolveCombinedPluginAndHookConfigMutationPreflight(params: {
    parsed: Record<string, unknown>;
    snapshotPath: string;
}): ConfigMutationPreflight;
export declare function selectInstallMutationWriteOptions(writeOptions: ConfigWriteOptions): ConfigSnapshotForInstallPersist["writeOptions"];
export declare function persistPluginInstall(params: {
    snapshot: ConfigSnapshotForInstallPersist;
    pluginId: string;
    install: Omit<PluginInstallUpdate, "pluginId">;
    enable?: boolean;
    invalidateRuntimeCache?: boolean;
    successMessage?: string;
    warningMessage?: string;
    runtime?: RuntimeEnv;
}): Promise<OpenClawConfig>;
export declare function persistHookPackInstall(params: {
    snapshot: ConfigSnapshotForInstallPersist;
    hookPackId: string;
    hooks: string[];
    install: Omit<HookInstallUpdate, "hookId" | "hooks">;
    successMessage?: string;
    runtime?: RuntimeEnv;
}): Promise<OpenClawConfig>;
export {};
