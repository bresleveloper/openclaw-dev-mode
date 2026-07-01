import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state.js";
import { type ResolvePluginControlPlaneContextParams } from "./plugin-control-plane-context.js";
import type { PluginMetadataSnapshot, PluginMetadataSnapshotPluginIdScope } from "./plugin-metadata-snapshot.types.js";
type CurrentPluginMetadataSnapshotState = ReturnType<typeof getCurrentPluginMetadataSnapshotState>;
export declare function resolvePluginMetadataControlPlaneFingerprint(config?: OpenClawConfig, options?: Omit<ResolvePluginControlPlaneContextParams, "config">): string;
export declare function isReusableCurrentPluginMetadataSnapshot(_snapshot: PluginMetadataSnapshot): boolean;
export declare function setCurrentPluginMetadataSnapshot(snapshot: PluginMetadataSnapshot | undefined, options?: {
    config?: OpenClawConfig;
    compatibleConfigs?: readonly OpenClawConfig[];
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
}): void;
export declare function clearCurrentPluginMetadataSnapshot(): void;
export declare function captureCurrentPluginMetadataSnapshotState(): CurrentPluginMetadataSnapshotState;
export declare function restoreCurrentPluginMetadataSnapshotState(state: CurrentPluginMetadataSnapshotState): void;
export declare function getCurrentPluginMetadataSnapshot(params?: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    allowScopedSnapshot?: boolean;
    pluginIds?: readonly string[];
    pluginIdScope?: PluginMetadataSnapshotPluginIdScope;
    workspaceDir?: string;
    allowWorkspaceScopedSnapshot?: boolean;
    requireDefaultDiscoveryContext?: boolean;
}): PluginMetadataSnapshot | undefined;
export {};
