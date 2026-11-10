import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import "./config-contracts-CY87ANNp.js";
import { c as OAuthCredential } from "./types-CRfF42Lb.js";
import "./common-CCG3ut4I.js";
import { m as ModelCatalogSnapshot, p as ModelCatalogEntry, r as resolveThinkingDefaultWithRuntimeCatalogCore } from "./model-selection-DoE_lu2k.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot-C_ou8VB5.js";
import "./channel-feedback-kdk5VmEE.js";
//#region src/agents/prepared-model-catalog.d.ts
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
//#endregion
//#region src/agents/identity-avatar.d.ts
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
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-marker.d.ts
type OAuthRefreshFenceCredential = {
  type: "oauth";
  access: string;
  refresh: string;
  expires: number;
};
/** True only while the durable refresh owner may still settle its claim. */
declare function isPendingOAuthRefreshFence(credential: OAuthRefreshFenceCredential | undefined): boolean;
/** True when two persisted values share the same single-use refresh generation. */
declare function isSameOAuthRefreshGeneration(params: {
  profileId: string;
  left: OAuthCredential;
  right: OAuthCredential;
}): boolean;
//#endregion
//#region src/plugin-sdk/agent-runtime.d.ts
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
//#endregion
export { isSameOAuthRefreshGeneration as a, refreshExpiredPreparedModelCatalog as c, isPendingOAuthRefreshFence as i, loadPreparedModelCatalog as n, AgentAvatarResolution as o, resolveThinkingDefaultWithRuntimeCatalog as r, resolveAgentAvatar as s, loadModelCatalog as t };