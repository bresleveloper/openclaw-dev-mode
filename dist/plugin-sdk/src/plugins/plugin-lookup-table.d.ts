/** Builds plugin lookup tables keyed by manifest ids, channels, providers, and commands. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type GatewayStartupPluginPlan } from "./channel-plugin-ids.js";
import { type PluginMetadataSnapshot } from "./plugin-metadata-snapshot.js";
import type { PluginRegistrySnapshot } from "./plugin-registry-snapshot.js";
export type PluginLookUpTableMetrics = PluginMetadataSnapshot["metrics"] & {
    startupPlanMs: number;
    startupPluginCount: number;
    deferredChannelPluginCount: number;
};
export type PluginLookUpTable = PluginMetadataSnapshot & {
    startup: GatewayStartupPluginPlan;
    metrics: PluginLookUpTableMetrics;
};
export type LoadPluginLookUpTableParams = {
    config: OpenClawConfig;
    activationSourceConfig?: OpenClawConfig;
    workspaceDir?: string;
    env: NodeJS.ProcessEnv;
    index?: PluginRegistrySnapshot;
    metadataSnapshot?: PluginMetadataSnapshot;
};
export declare function clearPluginLookUpTableMemoForTest(): void;
export declare function loadPluginLookUpTable(params: LoadPluginLookUpTableParams): PluginLookUpTable;
