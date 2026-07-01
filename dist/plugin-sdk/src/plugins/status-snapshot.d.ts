import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginRegistrySnapshotDiagnostic, type PluginRegistrySnapshotSource } from "./plugin-registry.js";
import { type PluginRegistry } from "./registry.js";
import type { PluginLogger } from "./types.js";
/** Control-plane plugin status shape used by `openclaw plugins status` style surfaces. */
export type PluginRegistryStatusReport = PluginRegistry & {
    workspaceDir?: string;
    registrySource: PluginRegistrySnapshotSource;
    registryDiagnostics: readonly PluginRegistrySnapshotDiagnostic[];
};
type PluginRegistrySnapshotReportParams = {
    config?: OpenClawConfig;
    workspaceDir?: string;
    /** Use an explicit env when plugin roots should resolve independently from process.env. */
    env?: NodeJS.ProcessEnv;
    logger?: PluginLogger;
};
/** Resolves the best available plugin registry snapshot and annotates dependency status. */
export declare function buildPluginRegistrySnapshotReport(params?: PluginRegistrySnapshotReportParams): PluginRegistryStatusReport;
export {};
