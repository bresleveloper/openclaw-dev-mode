import { type OpenClawConfig } from "../config/config.js";
import { type PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.js";
import { type ModelsJsonReadyResult } from "./models-config-state.js";
export { resetModelsJsonReadyCacheForTest } from "./models-config-state.js";
export type PreparedOpenClawModelsJsonSource = ModelsJsonReadyResult & {
    fingerprint: string;
    workspaceDir?: string;
};
type EnsureOpenClawModelsJsonOptions = {
    pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners">;
    workspaceDir?: string;
    providerDiscoveryProviderIds?: readonly string[];
    providerDiscoveryTimeoutMs?: number;
    providerDiscoveryEntriesOnly?: boolean;
};
/** Best-effort chmod for generated models.json and plugin catalog files. */
export declare function ensureModelsFileModeForModelsJson(pathname: string): Promise<void>;
/** Atomic private-file-store write used by models.json generation. */
export declare function writeModelsFileAtomicForModelsJson(targetPath: string, contents: string): Promise<void>;
/** Builds the canonical source freshness fingerprint for generated model catalogs. */
export declare function buildModelsJsonSourceFingerprint(config?: OpenClawConfig, agentDirOverride?: string, options?: {
    pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners">;
    workspaceDir?: string;
    providerDiscoveryProviderIds?: readonly string[];
    providerDiscoveryTimeoutMs?: number;
    providerDiscoveryEntriesOnly?: boolean;
}): Promise<{
    agentDir: string;
    fingerprint: string;
    workspaceDir?: string;
}>;
/** Ensures models.json and plugin catalog sidecars are current for an agent. */
export declare function prepareOpenClawModelsJsonSource(config?: OpenClawConfig, agentDirOverride?: string, options?: EnsureOpenClawModelsJsonOptions): Promise<PreparedOpenClawModelsJsonSource>;
/** Ensures models.json and plugin catalog sidecars are current for an agent. */
export declare function ensureOpenClawModelsJson(config?: OpenClawConfig, agentDirOverride?: string, options?: EnsureOpenClawModelsJsonOptions): Promise<ModelsJsonReadyResult>;
