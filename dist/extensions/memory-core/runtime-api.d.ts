import { i as OpenClawConfig } from "../../types.openclaw-DlpCUWMr.js";
import { gs as DEFAULT_LOCAL_MODEL } from "../../types-BVLQjFJF.js";
import { f as MemoryPluginRuntime, z as MemorySearchManager } from "../../memory-state-C4PorYFR.js";
import { a as ShortTermDreamingStats, c as auditShortTermPromotionArtifacts, d as repairShortTermPromotionArtifacts, i as ShortTermAuditSummary, l as loadShortTermPromotionDreamingStats, o as ShortTermDreamingStatsEntry, r as RepairShortTermPromotionArtifactsResult, t as configureMemoryCoreDreamingState, u as removeGroundedShortTermCandidates } from "../../dreaming-state-D5iKNSHd.js";
import { i as resolveMemoryVectorState, n as resolveMemoryCacheSummary, r as resolveMemoryFtsState, t as Tone } from "../../memory-core-host-status-DFdKQ9Ot.js";
import { i as createEmbeddingProvider, t as MemoryIndexManager } from "../../manager-DMnmfSfE.js";
import { i as checkQmdBinaryAvailability } from "../../memory-core-host-engine-qmd-BAtKQHki.js";
import { t as hasConfiguredMemorySecretInput } from "../../memory-core-host-secret-CPKoKypy.js";

//#region extensions/memory-core/src/memory/search-manager.d.ts
type Maybe<T> = T | null;
type MemorySearchManagerResult = {
  manager: Maybe<MemorySearchManager>;
  error?: string;
};
type MemorySearchManagerPurpose = "default" | "status" | "cli";
declare function getMemorySearchManager(params: {
  cfg: OpenClawConfig;
  agentId: string;
  purpose?: MemorySearchManagerPurpose;
}): Promise<MemorySearchManagerResult>;
//#endregion
//#region extensions/memory-core/src/runtime-provider.d.ts
declare const memoryRuntime: MemoryPluginRuntime;
//#endregion
//#region extensions/memory-core/src/memory/provider-adapters.d.ts
type BuiltinMemoryEmbeddingProviderDoctorMetadata = {
  providerId: string;
  authProviderId: string;
  envVars: string[];
  transport: "local" | "remote";
  autoSelectPriority?: number;
};
declare function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId: string): BuiltinMemoryEmbeddingProviderDoctorMetadata | null;
declare function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata(): Array<BuiltinMemoryEmbeddingProviderDoctorMetadata>;
//#endregion
//#region extensions/memory-core/src/dreaming-repair.d.ts
type DreamingArtifactsAuditIssue = {
  severity: "warn" | "error";
  code: "dreaming-session-corpus-unreadable" | "dreaming-session-corpus-self-ingested" | "dreaming-session-ingestion-unreadable" | "dreaming-diary-unreadable";
  message: string;
  fixable: boolean;
};
type DreamingArtifactsAuditSummary = {
  dreamsPath?: string;
  sessionCorpusDir: string;
  sessionCorpusFileCount: number;
  suspiciousSessionCorpusFileCount: number;
  suspiciousSessionCorpusLineCount: number;
  sessionIngestionPath: string;
  sessionIngestionExists: boolean;
  issues: DreamingArtifactsAuditIssue[];
};
type RepairDreamingArtifactsResult = {
  changed: boolean;
  archiveDir?: string;
  archivedDreamsDiary: boolean;
  archivedSessionCorpus: boolean;
  archivedSessionIngestion: boolean;
  archivedPaths: string[];
  warnings: string[];
};
declare function auditDreamingArtifacts(params: {
  workspaceDir: string;
}): Promise<DreamingArtifactsAuditSummary>;
declare function repairDreamingArtifacts(params: {
  workspaceDir: string;
  archiveDiary?: boolean;
  now?: Date;
}): Promise<RepairDreamingArtifactsResult>;
//#endregion
export { type BuiltinMemoryEmbeddingProviderDoctorMetadata, DEFAULT_LOCAL_MODEL, type DreamingArtifactsAuditSummary, MemoryIndexManager, type RepairDreamingArtifactsResult, type RepairShortTermPromotionArtifactsResult, type ShortTermAuditSummary, type ShortTermDreamingStats, type ShortTermDreamingStatsEntry, type Tone, auditDreamingArtifacts, auditShortTermPromotionArtifacts, checkQmdBinaryAvailability, configureMemoryCoreDreamingState, createEmbeddingProvider, getBuiltinMemoryEmbeddingProviderDoctorMetadata, getMemorySearchManager, hasConfiguredMemorySecretInput, listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata, loadShortTermPromotionDreamingStats, memoryRuntime, removeGroundedShortTermCandidates, repairDreamingArtifacts, repairShortTermPromotionArtifacts, resolveMemoryCacheSummary, resolveMemoryFtsState, resolveMemoryVectorState };