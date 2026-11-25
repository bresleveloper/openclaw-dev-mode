import "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import { h as MemorySyncProgressUpdate, s as MemoryProviderStatus } from "../../types-D2yUynI0.js";
import { c as HealthCheck, d as HealthFinding } from "../../health-BiFk88ye.js";
import "../../memory-core-host-engine-foundation-B9GEQdKU.js";
import { t as MemoryDreamingStorageConfig } from "../../memory-core-host-runtime-core-B6UF-6o1.js";
import { g as MemoryEmbeddingProbeResult, h as WorkspaceFileMode, n as configureMemoryCoreDreamingState, s as PromotionCandidate, u as ShortTermRecallEntry } from "../../dreaming-state-DURGeEXv.js";
import { t as filterMemorySearchHitsBySessionVisibility } from "../../session-search-visibility-D7fy7WQS.js";
export declare function prewarmMemorySearchWorker(cfg: OpenClawConfig): Promise<void>;
export declare function writeBackfillDiaryEntries(params: {
  workspaceDir: string;
  workspaceFileMode?: WorkspaceFileMode;
  entries: Array<{
    isoDay: string;
    bodyLines: string[];
    sourcePath?: string;
  }>;
  preserveExisting?: boolean;
  timezone?: string;
}): Promise<{
  dreamsPath: string;
  written: number;
  replaced: number;
}>;
export declare function removeBackfillDiaryEntries(params: {
  workspaceDir: string;
}): Promise<{
  dreamsPath: string;
  removed: number;
}>;
export declare function dedupeDreamDiaryEntries(params: {
  workspaceDir: string;
}): Promise<{
  dreamsPath: string;
  removed: number;
  kept: number;
}>;
type GroundedRemPreviewItem = {
  text: string;
  refs: string[];
};
type GroundedRemCandidate = GroundedRemPreviewItem & {
  lean: "likely_durable" | "unclear" | "likely_situational";
};
export declare function previewGroundedRemMarkdown(params: {
  workspaceDir: string;
  inputPaths: string[];
}): Promise<{
  workspaceDir: string;
  scannedFiles: number;
  files: {
    path: string;
    facts: GroundedRemPreviewItem[];
    reflections: GroundedRemPreviewItem[];
    memoryImplications: {
      text: string;
      refs: string[];
    }[];
    candidates: GroundedRemCandidate[];
    renderedMarkdown: string;
  }[];
}>;
export declare function filterRecallEntriesWithinLookback(params: {
  entries: readonly ShortTermRecallEntry[];
  nowMs: number;
  lookbackDays: number;
}): ShortTermRecallEntry[];
type PreviewRemHarnessOptions = {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  grounded?: boolean;
  groundedInputPaths?: string[];
  groundedFileLimit?: number;
  includePromoted?: boolean;
  candidateLimit?: number;
  remPreviewLimit?: number;
  nowMs?: number;
};
type PreviewRemHarnessResult = Awaited<ReturnType<typeof previewRemHarness>>;
export declare function previewRemHarness(params: PreviewRemHarnessOptions): Promise<{
  workspaceDir: string;
  nowMs: number;
  remConfig: {
    enabled: boolean;
    cron: string;
    lookbackDays: number;
    limit: number;
    minPatternStrength: number;
    sources: ("daily" | "deep" | "memory")[];
    execution: {
      speed: "balanced" | "fast" | "slow";
      thinking: "high" | "low" | "medium";
      budget: "cheap" | "expensive" | "medium";
      model?: string;
      maxOutputTokens?: number;
      temperature?: number;
      timeoutMs?: number;
    };
  } & {
    enabled: boolean;
    timezone?: string | undefined;
    verboseLogging: boolean;
    storage: MemoryDreamingStorageConfig;
  };
  deepConfig: {
    enabled: boolean;
    cron: string;
    limit: number;
    minScore: number;
    minRecallCount: number;
    minUniqueQueries: number;
    recencyHalfLifeDays: number;
    maxAgeDays?: number;
    maxPromotedSnippetTokens?: number;
    maxPriorEntryLossFraction: number;
    sources: ("daily" | "logs" | "memory" | "recall" | "sessions")[];
    recovery: {
      enabled: boolean;
      triggerBelowHealth: number;
      lookbackDays: number;
      maxRecoveredCandidates: number;
      minRecoveryConfidence: number;
      autoWriteMinConfidence: number;
    };
    execution: {
      speed: "balanced" | "fast" | "slow";
      thinking: "high" | "low" | "medium";
      budget: "cheap" | "expensive" | "medium";
      model?: string;
      maxOutputTokens?: number;
      temperature?: number;
      timeoutMs?: number;
    };
  } & {
    enabled: boolean;
    timezone?: string | undefined;
    verboseLogging: boolean;
    storage: MemoryDreamingStorageConfig;
  };
  recallEntryCount: number;
  remSkipped: boolean;
  rem: {
    sourceEntryCount: number;
    reflections: string[];
    candidateTruths: {
      snippet: string;
      confidence: number;
      evidence: string;
    }[];
    candidateKeys: string[];
    bodyLines: string[];
  };
  groundedInputPaths: string[];
  grounded: {
    workspaceDir: string;
    scannedFiles: number;
    files: {
      path: string;
      facts: {
        text: string;
        refs: string[];
      }[];
      reflections: {
        text: string;
        refs: string[];
      }[];
      memoryImplications: {
        text: string;
        refs: string[];
      }[];
      candidates: ({
        text: string;
        refs: string[];
      } & {
        lean: "likely_durable" | "unclear" | "likely_situational";
      })[];
      renderedMarkdown: string;
    }[];
  } | null;
  deep: {
    candidateLimit?: number | undefined;
    candidateCount: number;
    truncated: boolean;
    candidates: PromotionCandidate[];
  };
}>;
export declare function captureMemoryRebuildNotice(status: MemoryProviderStatus): () => string | undefined;
export declare function inspectMemoryIndexPresence(databasePath: string, agentId?: string): Promise<boolean>;
type ProviderFailure = {
  provider: string;
  reason: string;
  requirement?: string;
  fixHint?: string;
};
type InspectConfiguredProvider = (params: {
  config: OpenClawConfig;
  agentId: string;
  env: NodeJS.ProcessEnv;
}) => Promise<ProviderFailure | null>;
declare function collectVectorProviderFindings(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  shouldInspectAgent: (agentId: string) => boolean;
}, inspectProvider: InspectConfiguredProvider): Promise<HealthFinding[]>;
export declare const MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID = "memory-core/managed-local-embedding-setup";
export declare const pluginStateIsolatedDoctorCheckIds: readonly ["memory-core/managed-local-embedding-setup"];
type InspectManagedLocalEmbeddingSetup = (params: {
  config: Parameters<typeof collectVectorProviderFindings>[0]["config"];
  env: NodeJS.ProcessEnv;
  agentId: string;
  provider: string;
}) => ProviderFailure | null | undefined | Promise<ProviderFailure | null | undefined>;
type MemoryCoreDoctorRegistrationHost = {
  registerHealthCheck: (check: HealthCheck) => void;
  getHealthCheck: (id: string) => HealthCheck | undefined;
  inspectEmbeddingProviderSetup: InspectManagedLocalEmbeddingSetup;
  memoryCoreActive: boolean;
};
export declare function registerMemoryCoreDoctorChecks(host: MemoryCoreDoctorRegistrationHost): void;
export declare const MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE: string;
export { type MemoryEmbeddingProbeResult, type MemoryProviderStatus, type MemorySyncProgressUpdate, type OpenClawConfig, type PreviewRemHarnessOptions, type PreviewRemHarnessResult, configureMemoryCoreDreamingState, filterMemorySearchHitsBySessionVisibility };