import { M as OpenClawConfig, S as MemorySearchResult, h as MemoryCliSearchResult, m as MemoryCliSearchParams, v as MemoryOriginClass, x as MemorySearchManager } from "../../types-D7I_F5Ux.js";
import { Fm as MemoryEmbeddingProviderRuntime, Mm as MemoryEmbeddingProviderAdapter, Nm as MemoryEmbeddingProviderCreateOptions, Pm as MemoryEmbeddingProviderCreateResult, RC as ConversationRecallContext, jm as MemoryEmbeddingProvider, zm as MemoryPluginRuntime } from "../../config-contracts-CY87ANNp.js";
import { o as ShortTermDreamingStats, r as RepairDreamingArtifactsResult, s as ShortTermDreamingStatsEntry, t as DreamingArtifactsAuditSummary } from "../../dreaming-D2Tdqt2p.js";
import "../../memory-core-host-engine-embeddings-BSewlUJd.js";
import { a as repairShortTermPromotionArtifacts, c as RepairShortTermPromotionArtifactsResult, i as removeGroundedShortTermCandidates, l as ShortTermAuditSummary, n as configureMemoryCoreDreamingState, o as loadShortTermPromotionDreamingStats, r as auditShortTermPromotionArtifacts, t as MemoryCoreOpenKeyedStore } from "../../dreaming-state-Bbascr8N.js";
import { t as resolveMemoryBackendConfig } from "../../memory-core-host-runtime-core-uGyluBS6.js";
import "../../memory-core-host-engine-foundation-FxqvW1N9.js";
//#region packages/memory-host-sdk/src/host/status-format.d.ts
/** Display tone used by memory status renderers. */
type Tone = "ok" | "warn" | "muted";
/** Resolve vector indexing state from enabled and availability flags. */
export declare function resolveMemoryVectorState(vector: {
  enabled: boolean;
  available?: boolean;
}): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled" | "unknown";
};
/** Resolve full-text search state from enabled and availability flags. */
export declare function resolveMemoryFtsState(fts: {
  enabled: boolean;
  available: boolean;
}): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled";
};
/** Format cache state as concise status text with optional entry count. */
export declare function resolveMemoryCacheSummary(cache: {
  enabled: boolean;
  entries?: number;
}): {
  tone: Tone;
  text: string;
};
//#endregion
//#region extensions/memory-core/src/memory/embedding-local-service.d.ts
type MemoryCoreAcquireLocalService = (target: {
  providerId: string;
  baseUrl: string;
  headers?: HeadersInit;
}, signal?: AbortSignal | null) => Promise<{
  release: () => void;
} | undefined>;
//#endregion
//#region extensions/memory-core/src/memory/runtime-host.d.ts
type MemoryCoreRuntimeHost = {
  acquireLocalService?: MemoryCoreAcquireLocalService;
  openKeyedStore?: MemoryCoreOpenKeyedStore;
  runInBackgroundContext?: <T>(run: () => T) => T;
};
//#endregion
//#region extensions/memory-core/src/memory/search-manager.d.ts
type MemorySearchManagerPurpose = "default" | "status" | "cli";
type MemorySearchManagerParams = {
  cfg: OpenClawConfig;
  agentId: string;
  purpose?: MemorySearchManagerPurpose;
  inspectSources?: boolean;
  acquireLocalService?: MemoryCoreAcquireLocalService;
  runInBackgroundContext?: MemoryCoreRuntimeHost["runInBackgroundContext"];
};
type MemorySearchManagerResult = {
  manager: MemorySearchManager | null;
  error?: string;
  debug: {
    backend: "builtin";
    purpose: MemorySearchManagerPurpose;
    managerMs: number;
  };
};
export declare function getMemorySearchManager(params: MemorySearchManagerParams): Promise<MemorySearchManagerResult>;
declare function closeAllMemorySearchManagers(): Promise<void>;
declare function closeMemorySearchManager(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): Promise<void>;
//#endregion
//#region extensions/memory-core/src/memory/lifecycle.d.ts
type ReloadChange = Parameters<NonNullable<MemoryPluginRuntime["prepareReload"]>>[0];
type ReloadHandle = ReturnType<NonNullable<MemoryPluginRuntime["prepareReload"]>>;
type MemoryReloadState = {
  retireRuntime: boolean;
  adapters: Set<MemoryEmbeddingProviderAdapter>;
};
type MemoryManagerLifecycle = {
  reload?: MemoryReloadState;
  prepare?: (reload: MemoryReloadState) => ReloadHandle["drain"];
};
/** Pause new acquisition while the plugin owner replaces its adapters. */
declare function prepareMemoryManagerReload(change: ReloadChange, lifecycle?: MemoryManagerLifecycle): ReloadHandle;
//#endregion
//#region extensions/memory-core/src/runtime-provider.d.ts
export declare function createMemoryRuntime(host: MemoryCoreRuntimeHost): {
  searchForCli(params: MemoryCliSearchParams): Promise<MemoryCliSearchResult>;
  prepareReload: typeof prepareMemoryManagerReload;
  getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
    inspectSources?: boolean;
  }): Promise<{
    manager: MemorySearchManager | null;
    error?: string;
    debug: {
      backend: "builtin";
      purpose: "cli" | "default" | "status";
      managerMs: number;
    };
  }>;
  resolveMemoryBackendConfig: typeof resolveMemoryBackendConfig;
  authorizeSearchHits(params: {
    cfg: OpenClawConfig;
    agentId: string;
    requesterSessionKey: string | undefined;
    sandboxed: boolean;
    hits: MemorySearchResult[];
    trustedAgentScope?: boolean;
    conversationRecall?: ConversationRecallContext;
  }): Promise<MemorySearchResult[]>;
  supportsWorkspaceMemoryReadSources: true;
  classifyWorkspaceMemoryPaths: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    workspaceDir: string;
    relativePaths: string[];
    readSources?: readonly {
      relativePath: string;
      canonicalRelativePath?: string;
    }[];
  }) => Promise<Array<{
    relativePath: string;
    originClass: MemoryOriginClass;
  }>>;
  closeAllMemorySearchManagers: typeof closeAllMemorySearchManagers;
  closeMemorySearchManager: typeof closeMemorySearchManager;
};
//#endregion
//#region extensions/memory-core/src/memory/manager-registry.d.ts
type ProviderFactory = () => Promise<MemoryEmbeddingProviderCreateResult>;
type MemoryManagerProviderFactory = (adapter: MemoryEmbeddingProviderAdapter, create: ProviderFactory) => Promise<MemoryEmbeddingProviderCreateResult>;
//#endregion
//#region extensions/memory-core/src/memory/embeddings.d.ts
type EmbeddingProvider = MemoryEmbeddingProvider;
type EmbeddingProviderRuntime = MemoryEmbeddingProviderRuntime;
type EmbeddingProviderResult = {
  provider: EmbeddingProvider | null;
  requestedProvider: string;
  fallbackFrom?: string;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  runtime?: EmbeddingProviderRuntime;
};
type CreateEmbeddingProviderOptions = Omit<MemoryEmbeddingProviderCreateOptions, "dimensions"> & {
  provider: string;
  fallback: string;
  outputDimensionality?: number;
  acquireLocalService?: MemoryCoreAcquireLocalService;
  createProvider?: MemoryManagerProviderFactory;
};
export declare function createEmbeddingProvider(options: CreateEmbeddingProviderOptions): Promise<EmbeddingProviderResult>;
//#endregion
//#region packages/memory-host-sdk/src/host/secret-input.d.ts
/** Return true when a configured memory secret contains a literal value or reference. */
export declare function hasConfiguredMemorySecretInput(value: unknown): boolean;
//#endregion
//#region extensions/memory-core/src/dreaming-repair.d.ts
export declare function auditDreamingArtifacts(params: {
  workspaceDir: string;
}): Promise<DreamingArtifactsAuditSummary>;
export declare function repairDreamingArtifacts(params: {
  workspaceDir: string;
  archiveDiary?: boolean;
  now?: Date;
}): Promise<RepairDreamingArtifactsResult>;
//#endregion
export { type DreamingArtifactsAuditSummary, type RepairDreamingArtifactsResult, type RepairShortTermPromotionArtifactsResult, type ShortTermAuditSummary, type ShortTermDreamingStats, type ShortTermDreamingStatsEntry, type Tone, auditShortTermPromotionArtifacts, configureMemoryCoreDreamingState, loadShortTermPromotionDreamingStats, removeGroundedShortTermCandidates, repairShortTermPromotionArtifacts };