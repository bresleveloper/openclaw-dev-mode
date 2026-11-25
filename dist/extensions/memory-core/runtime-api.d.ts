import "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig$1 } from "../../types.openclaw-D8uW-XQA.js";
import { a as MemoryExtraPath, n as MemoryCliSearchResult, o as MemoryOriginClass, u as MemorySearchResult } from "../../types-D2yUynI0.js";
import "../../sqlite-worker-broker.types-nFn1HEVb.js";
import { A as MemorySearchManager, N as ConversationRecallContext, O as AcquireConfiguredProviderLocalService, T as MemoryEmbeddingProviderRuntime, c as MemoryEmbeddingProviderAdapter, h as MemoryPluginRuntime, k as MemoryCliSearchParams, l as MemoryEmbeddingProviderCreateOptions, u as MemoryEmbeddingProviderCreateResult, w as MemoryEmbeddingProvider } from "../../registry-contribution-types-2o1L1H_Q.js";
import "../../setup-Bk0qGrve.js";
import "../../memory-core-host-engine-foundation-B9GEQdKU.js";
import "../../kysely-sync-Dr57gDTk.js";
import "../../memory-core-host-runtime-core-B6UF-6o1.js";
import { a as repairShortTermPromotionArtifacts, c as RepairShortTermPromotionArtifactsResult, d as DreamingArtifactsAuditSummary, f as RepairDreamingArtifactsResult, i as removeGroundedShortTermCandidates, l as ShortTermAuditSummary, m as ShortTermDreamingStatsEntry, n as configureMemoryCoreDreamingState, o as loadShortTermPromotionDreamingStats, p as ShortTermDreamingStats, r as auditShortTermPromotionArtifacts, t as MemoryCoreOpenKeyedStore } from "../../dreaming-state-DURGeEXv.js";
import "../../embedding-providers-B1O6AknT.js";
import "../../database-engine-worker-runtime-B6LH5KzA.js";
import { DatabaseSync } from "node:sqlite";
import { Kysely } from "kysely";
import { Command } from "commander";
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
type MemoryCitationsMode = "auto" | "on" | "off";
type MemoryConfig = {
  citations?: MemoryCitationsMode;
  search?: MemorySearchConfig;
};
type MemorySearchConfig = {
  enabled?: boolean;
  rememberAcrossConversations?: boolean;
  extraPaths?: MemoryExtraPath[];
};
type AgentContextLimitsConfig = {
  memoryGetMaxChars?: number;
};
/** Secret reference accepted by provider header config. */
type SecretInput = string | {
  source: string;
  provider: string;
  id: string;
};
type AgentConfig = {
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
    entries?: Record<string, AgentConfig>;
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
type ResolvedMemoryBackendConfig = {
  backend: "builtin";
  citations: MemoryCitationsMode;
};
declare function resolveMemoryBackendConfig(params: {
  cfg: OpenClawConfig;
  agentId: string;
}): ResolvedMemoryBackendConfig;
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
type ProviderFactory = () => Promise<MemoryEmbeddingProviderCreateResult>;
type MemoryManagerProviderFactory = (adapter: MemoryEmbeddingProviderAdapter, create: ProviderFactory) => Promise<MemoryEmbeddingProviderCreateResult>;
type EmbeddingProviderResult = {
  provider: MemoryEmbeddingProvider | null;
  requestedProvider: string;
  fallbackFrom?: string;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  runtime?: MemoryEmbeddingProviderRuntime;
};
type CreateEmbeddingProviderOptions = Omit<MemoryEmbeddingProviderCreateOptions, "dimensions"> & {
  provider: string;
  fallback: string;
  outputDimensionality?: number;
  createProvider?: MemoryManagerProviderFactory;
};
export declare function createEmbeddingProvider(options: CreateEmbeddingProviderOptions): Promise<EmbeddingProviderResult>;
type MemoryCoreRuntimeHost = {
  acquireLocalService?: AcquireConfiguredProviderLocalService;
  openKeyedStore?: MemoryCoreOpenKeyedStore;
  runInBackgroundContext?: <T>(run: () => T) => T;
};
declare function closeAllMemorySearchManagers(): Promise<void>;
type MemorySearchManagerPurpose = "default" | "status" | "cli";
type MemorySearchManagerParams = {
  cfg: OpenClawConfig$1;
  agentId: string;
  purpose?: MemorySearchManagerPurpose;
  inspectSources?: boolean;
  acquireLocalService?: AcquireConfiguredProviderLocalService;
  runInBackgroundContext?: MemoryCoreRuntimeHost["runInBackgroundContext"];
};
type MemorySearchManagerResult = {
  manager: MemorySearchManager | null;
  error?: string;
  code?: string;
  debug: {
    backend: "builtin";
    purpose: MemorySearchManagerPurpose;
    managerMs: number;
  };
};
export declare function getMemorySearchManager(params: MemorySearchManagerParams): Promise<MemorySearchManagerResult>;
declare function closeMemorySearchManager(params: {
  cfg: OpenClawConfig$1;
  agentId: string;
}): Promise<void>;
export declare function registerMemoryCli(program: Command, hostOptions?: MemoryCoreRuntimeHost): void;
export declare function createMemoryRuntime(host: MemoryCoreRuntimeHost): {
  searchForCli(params: MemoryCliSearchParams): Promise<MemoryCliSearchResult>;
  prepareReload: typeof prepareMemoryManagerReload;
  getMemorySearchManager(params: {
    cfg: OpenClawConfig$1;
    agentId: string;
    purpose?: "default" | "status" | "cli";
    inspectSources?: boolean;
  }): Promise<{
    manager: MemorySearchManager | null;
    error?: string;
    code?: string;
    debug: {
      backend: "builtin";
      purpose: "cli" | "default" | "status";
      managerMs: number;
    };
  }>;
  resolveMemoryBackendConfig: typeof resolveMemoryBackendConfig;
  authorizeSearchHits(params: {
    cfg: OpenClawConfig$1;
    agentId: string;
    requesterSessionKey: string | undefined;
    sandboxed: boolean;
    hits: MemorySearchResult[];
    trustedAgentScope?: boolean;
    conversationRecall?: ConversationRecallContext;
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
/** Return true when a configured memory secret contains a literal value or reference. */
export declare function hasConfiguredMemorySecretInput(value: unknown): boolean;
export declare function auditDreamingArtifacts(params: {
  workspaceDir: string;
}): Promise<DreamingArtifactsAuditSummary>;
export declare function repairDreamingArtifacts(params: {
  workspaceDir: string;
  archiveDiary?: boolean;
  now?: Date;
}): Promise<RepairDreamingArtifactsResult>;
export { type DreamingArtifactsAuditSummary, type RepairDreamingArtifactsResult, type RepairShortTermPromotionArtifactsResult, type ShortTermAuditSummary, type ShortTermDreamingStats, type ShortTermDreamingStatsEntry, type Tone, auditShortTermPromotionArtifacts, configureMemoryCoreDreamingState, loadShortTermPromotionDreamingStats, removeGroundedShortTermCandidates, repairShortTermPromotionArtifacts };