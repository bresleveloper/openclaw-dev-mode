import { type ConfigReplaceResult, type ConfigMutationResult, type TransformConfigFileWithRetryParams } from "../config/config.js";
import type { ConfigWriteOptions } from "../config/io.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
/** Return whether config still contains legacy/transient plugin install records. */
export declare function hasPendingPluginInstallRecords(config: OpenClawConfig): boolean;
/** Find pending install records that match the base config and can be stripped as unchanged. */
export declare function unchangedPendingPluginInstallRecordIds(config: OpenClawConfig, baseConfig: OpenClawConfig): string[];
/** Remove pending plugin install records from config, optionally only for selected ids. */
export declare function stripPendingPluginInstallRecords(config: OpenClawConfig, pluginIds?: Iterable<string>): OpenClawConfig;
type ConfigCommit = (config: OpenClawConfig, writeOptions?: ConfigWriteOptions) => Promise<ConfigReplaceResult | void>;
/** Persist plugin install records and commit the matching config update to disk. */
export declare function commitPluginInstallRecordsWithConfig(params: {
    previousInstallRecords?: Record<string, PluginInstallRecord>;
    nextInstallRecords: Record<string, PluginInstallRecord>;
    nextConfig: OpenClawConfig;
    baseHash?: string;
    writeOptions?: ConfigWriteOptions;
}): Promise<void>;
/** Commit config while migrating any pending install records into the install index. */
export declare function commitConfigWriteWithPendingPluginInstalls(params: {
    nextConfig: OpenClawConfig;
    writeOptions?: ConfigWriteOptions;
    commit: ConfigCommit;
}): Promise<{
    config: OpenClawConfig;
    installRecords: Record<string, PluginInstallRecord>;
    movedInstallRecords: boolean;
    persistedHash: string | null;
}>;
/** Replace the config file after moving pending plugin install records into the install index. */
export declare function commitConfigWithPendingPluginInstalls(params: {
    nextConfig: OpenClawConfig;
    baseHash?: string;
    writeOptions?: ConfigWriteOptions;
}): Promise<{
    config: OpenClawConfig;
    installRecords: Record<string, PluginInstallRecord>;
    movedInstallRecords: boolean;
    persistedHash: string | null;
}>;
/** Transform config with retry support while preserving plugin install index consistency. */
export declare function transformConfigWithPendingPluginInstalls<T = void>(params: Omit<TransformConfigFileWithRetryParams<T>, "commit">): Promise<ConfigMutationResult<T>>;
export {};
