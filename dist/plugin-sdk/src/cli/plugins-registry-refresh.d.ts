import type { OpenClawConfig } from "../config/types.openclaw.js";
import { loadInstalledPluginIndexInstallRecords } from "../plugins/installed-plugin-index-records.js";
import type { InstalledPluginIndexRefreshReason } from "../plugins/installed-plugin-index.js";
/** Optional warning sink for best-effort registry/cache refresh failures. */
export type PluginRegistryRefreshLogger = {
    warn?: (message: string) => void;
};
/** Refresh persisted plugin registry and clear runtime discovery after a config mutation. */
export declare function refreshPluginRegistryAfterConfigMutation(params: {
    config: OpenClawConfig;
    reason: InstalledPluginIndexRefreshReason;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    installRecords?: Awaited<ReturnType<typeof loadInstalledPluginIndexInstallRecords>>;
    invalidateRuntimeCache?: boolean;
    policyPluginIds?: readonly string[];
    traceCommand?: string;
    logger?: PluginRegistryRefreshLogger;
}): Promise<void>;
export declare function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params: {
    logger?: PluginRegistryRefreshLogger;
}): Promise<void>;
