import { Un as resolveThinkingDefaultWithRuntimeCatalogCore, pk as PluginMetadataSnapshot } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./common-SasPqPvU.js";
import { C as ModelCatalogEntry, w as ModelCatalogSnapshot } from "./provider-context-BvC7EnIY.js";
import "./channel-feedback-P2Ehu88T.js";
type LoadPreparedModelCatalogParams = {
  agentId?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  readOnly?: boolean;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  providerDiscoveryProviderIds?: readonly string[];
  /** Explicitly requests full inventory acquisition; writable reads also replace completed data. */
  refreshFullCatalog?: boolean;
  /** Persist refreshed inventory only while the caller holds exclusive offline state custody. */
  persistOfflineRefresh?: boolean;
  /** Scoped read-only loads may run live discovery for the scoped providers only. */
  scopedLiveProviderDiscovery?: boolean;
  allowGatewaySubagentBinding?: boolean;
};
/** Requests expiry renewal for an inventory consumer without waiting for discovery. */
declare function refreshExpiredPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): ModelCatalogSnapshot | undefined;
type AgentAvatarResolution = {
  kind: "none";
  reason: string;
  source?: string;
} | {
  kind: "local";
  filePath: string;
  source: string;
} | {
  kind: "remote";
  url: string;
  source: string;
} | {
  kind: "data";
  url: string;
  source: string;
};
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string): AgentAvatarResolution;
/** Preserves the public SDK's writable default while internal catalog reads stay passive. */
declare function loadPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogEntry[]>;
type LoadModelCatalogCompatibilityParams = LoadPreparedModelCatalogParams & {
  /** @deprecated Lifecycle publication owns refreshes; retained for source compatibility. */
  useCache?: boolean;
  /** @deprecated Use getPreparedModelCatalogSnapshot for new nonblocking readers. */
  cacheOnly?: boolean;
  /** @deprecated Plugin metadata belongs to the published lifecycle generation. */
  metadataSnapshot?: Omit<PluginMetadataSnapshot, "owners" | "declaredProviderOwners"> & {
    declaredProviderOwners?: PluginMetadataSnapshot["declaredProviderOwners"];
    owners: Omit<PluginMetadataSnapshot["owners"], "modelIdNormalizationPolicies" | "providerAuthContributions"> & Partial<Pick<PluginMetadataSnapshot["owners"], "modelIdNormalizationPolicies" | "providerAuthContributions">>;
  };
};
/** @deprecated Use loadPreparedModelCatalog or getPreparedModelCatalogSnapshot. */
declare function loadModelCatalog(params?: LoadModelCatalogCompatibilityParams): Promise<ModelCatalogEntry[]>;
declare function resolveThinkingDefaultWithRuntimeCatalog(params: Omit<Parameters<typeof resolveThinkingDefaultWithRuntimeCatalogCore>[0], "loadRuntimeCatalog"> & {
  loadModelCatalog: Parameters<typeof resolveThinkingDefaultWithRuntimeCatalogCore>[0]["loadRuntimeCatalog"];
}): Promise<"adaptive" | "high" | "low" | "max" | "medium" | "minimal" | "off" | "ultra" | "xhigh">;
export { resolveAgentAvatar as a, AgentAvatarResolution as i, loadPreparedModelCatalog as n, refreshExpiredPreparedModelCatalog as o, resolveThinkingDefaultWithRuntimeCatalog as r, loadModelCatalog as t };