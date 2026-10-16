import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { v as PluginMetadataSnapshot } from "../io-CwO8iq4h.js";
import { _ as ModelCatalogEntry, a as resolveThinkingDefaultWithRuntimeCatalogCore, d as resolveModelRefFromString, f as resolveDefaultModelForAgent, i as parseModelRef, l as buildConfiguredModelCatalog, n as DEFAULT_PROVIDER, o as resolveThinkingDefaultCore, r as findNormalizedProviderValue, s as resolveAllowedModelRefCore, u as buildModelAliasIndex, v as ModelCatalogSnapshot } from "../defaults-D0SAbcb2.js";
import { Cf as loadAuthProfileStoreWithoutExternalProfiles, Df as resolvePersistedAuthProfileOwnerAgentDir, Ef as findPersistedAuthProfileCredential, Ff as resolveApiKeyForProfile, If as resolveAuthProfileEligibility, Lf as resolveAuthProfileOrder, Li as getTtsProvider, Nf as listProfilesForProvider, Ni as agentCommandFromIngress, Of as clearRuntimeAuthProfileStoreSnapshots, Pf as refreshOAuthCredentialForRuntime, Rf as ProviderAuthAliasLookupParams, Ri as resolveTtsConfig, Ro as EmbeddedBlockChunker, Sf as loadAuthProfileStoreForSecretsRuntime, Wi as ResolvedTtsConfig, _f as resolveProfileUnusableUntilForDisplay, gf as isProfileInCooldown, hf as clearExpiredCooldowns, hr as formatReasoningMessage, kf as replaceRuntimeAuthProfileStoreSnapshots, mf as markAuthProfileBlockedUntil, mr as extractEmbeddedAssistantText, uf as resolveApiKeyForProviderCore, vf as resolveProfilesUnavailableReason, vs as modelSupportsVision, wf as saveAuthProfileStore, xf as loadAuthProfileStoreForRuntime, xs as findModelInCatalog, yf as ensureAuthProfileStore, zf as resolveProviderIdForAuth, zi as resolveTtsPrefsPath } from "../agent-harness-runtime-DZjstJNb.js";
import { D as AuthProfileFailureReason, O as AuthProfileStore, T as AuthProfileCredential, k as OAuthCredential } from "../types-BooLarQr.js";
import { d as readStringArrayParam, l as readPositiveIntegerParam, m as jsonResult, p as readToolStringParam, s as readNonNegativeIntegerParam } from "../common-K-HB_vKp.js";
import { d as resolveDefaultAgentDir, f as resolveDefaultAgentId, l as resolveAgentDir, o as setAgentEffectiveModelPrimary, p as listAgentIds, r as resolveAgentEffectiveModelPrimary, s as resolveAgentConfig, u as resolveAgentWorkspaceDir } from "../agent-scope-CQBriA71.js";
import { c as resolveAckReaction, d as resolveHumanDelayConfig, f as resolveIdentityNamePrefix, l as resolveAgentIdentity } from "../ack-reactions-NdNCdtJ_.js";
import { n as resolveSessionAgentIdsCompatibility } from "../agent-scope-runtime-rNgrwLoo.js";
import { t as CODEX_APP_SERVER_AUTH_MARKER } from "../model-auth-markers-C0aschiV.js";
//#region src/agents/auth-profiles/paths.d.ts
/** Resolve the user-facing path for the database selected by the auth store loader. */
export declare function resolveAuthStorePathForDisplay(agentDir?: string): string;
//#endregion
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
export declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string): AgentAvatarResolution;
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-marker.d.ts
type OAuthRefreshFenceCredential = {
  type: "oauth";
  access: string;
  refresh: string;
  expires: number;
};
/** True only while the durable refresh owner may still settle its claim. */
export declare function isPendingOAuthRefreshFence(credential: OAuthRefreshFenceCredential | undefined): boolean;
/** True when two persisted values share the same single-use refresh generation. */
export declare function isSameOAuthRefreshGeneration(params: {
  profileId: string;
  left: OAuthCredential;
  right: OAuthCredential;
}): boolean;
//#endregion
//#region src/plugin-sdk/agent-runtime.d.ts
/** Preserves the public SDK's writable default while internal catalog reads stay passive. */
export declare function loadPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogEntry[]>;
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
export declare function loadModelCatalog(params?: LoadModelCatalogCompatibilityParams): Promise<ModelCatalogEntry[]>;
export declare function resolveThinkingDefaultWithRuntimeCatalog(params: Omit<Parameters<typeof resolveThinkingDefaultWithRuntimeCatalogCore>[0], "loadRuntimeCatalog"> & {
  loadModelCatalog: Parameters<typeof resolveThinkingDefaultWithRuntimeCatalogCore>[0]["loadRuntimeCatalog"];
}): Promise<"adaptive" | "high" | "low" | "max" | "medium" | "minimal" | "off" | "ultra" | "xhigh">;
//#endregion
export { type AgentAvatarResolution, type AuthProfileCredential, type AuthProfileFailureReason, type AuthProfileStore, CODEX_APP_SERVER_AUTH_MARKER, DEFAULT_PROVIDER, EmbeddedBlockChunker, type ModelCatalogEntry, type OAuthCredential, type ProviderAuthAliasLookupParams, type ResolvedTtsConfig, agentCommandFromIngress, buildConfiguredModelCatalog, buildModelAliasIndex, clearExpiredCooldowns, clearRuntimeAuthProfileStoreSnapshots, ensureAuthProfileStore, extractEmbeddedAssistantText as extractAssistantText, findModelInCatalog, findNormalizedProviderValue, findPersistedAuthProfileCredential, formatReasoningMessage, refreshExpiredPreparedModelCatalog as getPreparedModelCatalogSnapshot, getTtsProvider, isProfileInCooldown, jsonResult, listAgentIds, listProfilesForProvider, loadAuthProfileStoreForRuntime, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles, markAuthProfileBlockedUntil, modelSupportsVision, parseModelRef, readNonNegativeIntegerParam, readPositiveIntegerParam, readStringArrayParam, readToolStringParam as readStringParam, refreshOAuthCredentialForRuntime, replaceRuntimeAuthProfileStoreSnapshots, resolveAckReaction, resolveAgentConfig, resolveAgentDir, resolveAgentEffectiveModelPrimary, resolveAgentIdentity, resolveAgentWorkspaceDir, resolveAllowedModelRefCore as resolveAllowedModelRef, resolveApiKeyForProfile, resolveApiKeyForProviderCore as resolveApiKeyForProvider, resolveAuthProfileEligibility, resolveAuthProfileOrder, resolveDefaultAgentDir, resolveDefaultAgentId, resolveDefaultModelForAgent, resolveHumanDelayConfig, resolveIdentityNamePrefix, resolveModelRefFromString, resolvePersistedAuthProfileOwnerAgentDir, resolveProfileUnusableUntilForDisplay, resolveProfilesUnavailableReason, resolveProviderIdForAuth, resolveSessionAgentIdsCompatibility as resolveSessionAgentIds, resolveThinkingDefaultCore as resolveThinkingDefault, resolveTtsConfig, resolveTtsPrefsPath, saveAuthProfileStore, setAgentEffectiveModelPrimary };