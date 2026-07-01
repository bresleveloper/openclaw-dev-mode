import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginInstallRecord } from "../../config/types.plugins.js";
import type { PluginLoadOptions } from "../loader.js";
import type { PluginManifestRegistry } from "../manifest-registry.js";
import type { PluginLogger } from "../types.js";
/** Resolved plugin runtime load context shared by runtime loader callers. */
export type PluginRuntimeLoadContext = {
    rawConfig: OpenClawConfig;
    config: OpenClawConfig;
    activationSourceConfig: OpenClawConfig;
    autoEnabledReasons: Readonly<Record<string, string[]>>;
    workspaceDir: string | undefined;
    env: NodeJS.ProcessEnv;
    logger: PluginLogger;
    manifestRegistry?: PluginManifestRegistry;
    installRecords?: Record<string, PluginInstallRecord>;
};
/** Runtime load option values that can be passed directly to plugin loading. */
export type PluginRuntimeResolvedLoadValues = Pick<PluginLoadOptions, "config" | "activationSourceConfig" | "autoEnabledReasons" | "workspaceDir" | "env" | "logger" | "manifestRegistry" | "installRecords">;
/** Options accepted while resolving plugin runtime load context. */
export type PluginRuntimeLoadContextOptions = {
    config?: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
    logger?: PluginLogger;
    manifestRegistry?: PluginManifestRegistry;
};
/** Creates the default plugin runtime loader logger. */
export declare function createPluginRuntimeLoaderLogger(): PluginLogger;
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
export declare function resolvePluginRuntimeLoadContext(options?: PluginRuntimeLoadContextOptions): PluginRuntimeLoadContext;
/** Builds plugin load options from a resolved runtime load context. */
export declare function buildPluginRuntimeLoadOptions(context: PluginRuntimeLoadContext, overrides?: Partial<PluginLoadOptions>): PluginLoadOptions;
/** Builds plugin load options from explicit runtime load values. */
export declare function buildPluginRuntimeLoadOptionsFromValues(values: PluginRuntimeResolvedLoadValues, overrides?: Partial<PluginLoadOptions>): PluginLoadOptions;
