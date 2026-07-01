import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../plugins/plugin-metadata-snapshot.types.js";
type AgentModelCatalogCacheKeyInput = {
    agentDir: string;
    cacheScope?: unknown;
    config: OpenClawConfig;
    metadataSnapshot?: PluginMetadataSnapshot;
    workspaceDir?: string;
};
type ReadCachedAgentModelCatalogParams = {
    agentDir: string;
    catalogKey: string;
    nowMs?: number;
};
type WriteCachedAgentModelCatalogParams = {
    agentDir: string;
    catalogKey: string;
    entries: readonly unknown[];
    nowMs?: number;
};
export declare function buildAgentModelCatalogCacheKey(input: AgentModelCatalogCacheKeyInput): string;
export declare function readCachedAgentModelCatalog(params: ReadCachedAgentModelCatalogParams): unknown[] | undefined;
export declare function writeCachedAgentModelCatalog(params: WriteCachedAgentModelCatalogParams): void;
export {};
