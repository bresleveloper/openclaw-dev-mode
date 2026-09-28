import { $ as MemorySearchResult, C as RepairDreamingArtifactsResult, G as MemoryEmbeddingProviderRuntime, H as MemoryEmbeddingProviderAdapter, K as MemoryPluginRuntime, Q as MemorySearchManager, S as DreamingArtifactsAuditSummary, T as ShortTermDreamingStatsEntry, U as MemoryEmbeddingProviderCreateOptions, V as MemoryEmbeddingProvider, W as MemoryEmbeddingProviderCreateResult, X as MemoryOriginClass, Y as MemoryExtraPath, _ as removeGroundedShortTermCandidates, b as RepairShortTermPromotionArtifactsResult, d as configureMemoryCoreDreamingState, g as auditShortTermPromotionArtifacts, v as repairShortTermPromotionArtifacts, w as ShortTermDreamingStats, x as ShortTermAuditSummary, y as loadShortTermPromotionDreamingStats } from "../../runtime-api-B8EDHhvw.js";
import { q as OpenClawConfig$1 } from "../../runtime-types-D_4MTyiD.js";
//#region packages/memory-host-sdk/src/host/config-utils.d.ts
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Citation injection behavior for memory search results. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** Top-level memory config shared by host and runtime callers. */
type MemoryConfig = {
  citations?: MemoryCitationsMode;
  search?: MemorySearchConfig;
};
/** Per-agent memory search enablement and extra collection paths. */
type MemorySearchConfig = {
  enabled?: boolean;
  rememberAcrossConversations?: boolean;
  extraPaths?: MemoryExtraPath[];
};
/** Agent context limits that bound memory file reads. */
type AgentContextLimitsConfig = {
  memoryGetMaxChars?: number;
};
/** Secret reference accepted by provider header config. */
type SecretInput = string | {
  source: string;
  provider: string;
  id: string;
};
/** Agent-level config fields consumed by memory host helpers. */
type AgentConfig = {
  id?: string;
  default?: boolean;
  workspace?: string;
  memory?: {
    search?: MemorySearchConfig;
  };
  contextLimits?: AgentContextLimitsConfig;
};
/** Narrow OpenClaw config shape consumed by memory host utilities. */
type OpenClawConfig = {
  agents?: {
    ownership?: "explicit";
    defaults?: {
      workspace?: string;
      contextLimits?: AgentContextLimitsConfig;
    };
    entries?: Record<string, Omit<AgentConfig, "id">>;
    list?: AgentConfig[];
  };
  session?: {
    dmScope?: DmScope;
  };
  bindings?: unknown[];
  memory?: MemoryConfig;
  models?: {
    providers?: Record<string, {
      api?: string;
      baseUrl?: string;
      headers?: Record<string, SecretInput>;
    }>;
  };
};
//#endregion
//#region packages/memory-host-sdk/src/host/backend-config.d.ts
type ResolvedMemoryBackendConfig = {
  backend: "builtin";
  citations: MemoryCitationsMode;
};
declare function resolveMemoryBackendConfig(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): ResolvedMemoryBackendConfig;
//#endregion
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
//#region extensions/memory-core/src/memory/search-manager.d.ts
type MemorySearchManagerPurpose = "default" | "status" | "cli";
type MemorySearchManagerParams = {
  cfg: OpenClawConfig$1;
  agentId: string;
  purpose?: MemorySearchManagerPurpose;
  inspectSources?: boolean;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
type MemorySearchManagerResult = {
  manager: MemorySearchManager | null;
  error?: string;
  debug?: {
    backend: "builtin";
    purpose: MemorySearchManagerPurpose;
    managerMs: number;
  };
};
export declare function getMemorySearchManager(params: MemorySearchManagerParams): Promise<MemorySearchManagerResult>;
declare function closeAllMemorySearchManagers(): Promise<void>;
declare function closeMemorySearchManager(params: {
  cfg: OpenClawConfig$1;
  agentId: string;
}): Promise<void>;
//#endregion
//#region extensions/memory-core/src/memory/lifecycle.d.ts
type ReloadChange = Parameters<NonNullable<MemoryPluginRuntime["prepareReload"]>>[0];
type ReloadHandle = ReturnType<NonNullable<MemoryPluginRuntime["prepareReload"]>>;
type MemoryReloadState = {
  retireRuntime: boolean;
  adapters: Set<MemoryEmbeddingProviderAdapter>;
  generation: number;
};
type MemoryManagerLifecycle = {
  reload?: MemoryReloadState;
  prepare?: (reload: MemoryReloadState) => ReloadHandle["drain"];
};
/** Fence acquisition even before the lazy manager module has loaded. */
declare function prepareMemoryManagerReload(change: ReloadChange, lifecycle?: MemoryManagerLifecycle): ReloadHandle;
//#endregion
//#region extensions/memory-core/src/runtime-provider.d.ts
export declare const memoryRuntime: {
  prepareReload: typeof prepareMemoryManagerReload;
  getMemorySearchManager(params: {
    cfg: OpenClawConfig$1;
    agentId: string;
    purpose?: "default" | "status" | "cli";
    inspectSources?: boolean;
  }): Promise<{
    manager: MemorySearchManager | null;
    debug: {
      backend: "builtin";
      purpose: "cli" | "default" | "status";
      managerMs: number;
    } | undefined;
    error: string | undefined;
  }>;
  resolveMemoryBackendConfig: typeof resolveMemoryBackendConfig;
  authorizeSearchHits(params: {
    cfg: OpenClawConfig$1;
    agentId: string;
    requesterSessionKey: string | undefined;
    sandboxed: boolean;
    hits: MemorySearchResult[];
  }): Promise<MemorySearchResult[]>;
  supportsWorkspaceMemoryReadSources: true;
  classifyWorkspaceMemoryPaths: (params: {
    cfg: OpenClawConfig$1;
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
type EmbeddingProviderRequest = string;
type EmbeddingProviderFallback = string;
type EmbeddingProviderRuntime = MemoryEmbeddingProviderRuntime;
type EmbeddingProviderResult = {
  provider: EmbeddingProvider | null;
  requestedProvider: EmbeddingProviderRequest;
  fallbackFrom?: string;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  runtime?: EmbeddingProviderRuntime;
};
type CreateEmbeddingProviderOptions = Omit<MemoryEmbeddingProviderCreateOptions, "dimensions"> & {
  provider: EmbeddingProviderRequest;
  fallback: EmbeddingProviderFallback;
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