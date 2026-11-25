import { VD as OpenKeyedStoreOptions, qD as PluginStateKeyedStore } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { i as MemoryEntryProvenance } from "./types-D2yUynI0.js";
import { t as DoctorMemoryDreamingPayload } from "./doctor-memory-BDagPv_v.js";
import "./kysely-sync-Dr57gDTk.js";
import "./memory-core-host-runtime-core-B6UF-6o1.js";
import "./plugin-state-runtime-HqbrbvLJ.js";
/** Health probe result for embedding provider availability checks. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
type AgentDefaults = NonNullable<NonNullable<OpenClawConfig["agents"]>["defaults"]>;
type WorkspaceFileMode = AgentDefaults["workspaceFileMode"];
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
type ShortTermAuditIssue = {
  severity: "warn" | "error";
  code: "recall-store-unreadable" | "recall-store-empty" | "recall-store-invalid" | "recall-store-dangling" | "recall-store-over-limit" | "recall-lock-stale" | "recall-lock-unreadable";
  message: string;
  fixable: boolean;
};
type ShortTermAuditSummary$1<TConceptTagScripts = Record<string, unknown>> = {
  storePath: string;
  lockPath: string;
  updatedAt?: string;
  exists: boolean;
  entryCount: number;
  promotedCount: number;
  spacedEntryCount: number;
  conceptTaggedEntryCount: number;
  conceptTagScripts?: TConceptTagScripts;
  invalidEntryCount: number;
  danglingEntryCount?: number;
  issues: ShortTermAuditIssue[];
};
type RepairShortTermPromotionArtifactsResult$1 = {
  changed: boolean;
  removedInvalidEntries: number;
  removedDanglingEntries?: number;
  removedOverflowEntries?: number;
  rewroteStore: boolean;
  removedStaleLock: boolean;
};
type ShortTermDreamingStatsEntry = DoctorMemoryDreamingPayload["shortTermEntries"][number];
type ShortTermDreamingStats = {
  shortTermCount: number;
  recallSignalCount: number;
  dailySignalCount: number;
  groundedSignalCount: number;
  totalSignalCount: number;
  phaseSignalCount: number;
  lightPhaseHitCount: number;
  remPhaseHitCount: number;
  promotedTotal: number;
  promotedToday: number;
  storePath: string;
  phaseSignalPath: string;
  phaseSignalError?: string;
  lastPromotedAt?: string;
  shortTermEntries: ShortTermDreamingStatsEntry[];
  signalEntries: ShortTermDreamingStatsEntry[];
  promotedEntries: ShortTermDreamingStatsEntry[];
};
type ConceptTagScriptCoverage = ReturnType<typeof summarizeConceptTagScriptCoverage>;
declare function summarizeConceptTagScriptCoverage(conceptTagsByEntry: string[][]): {
  latinEntryCount: number;
  cjkEntryCount: number;
  mixedEntryCount: number;
  otherEntryCount: number;
};
type PromotionWeights = {
  frequency: number;
  relevance: number;
  diversity: number;
  recency: number;
  consolidation: number;
  conceptual: number;
};
type ShortTermRecallEntry = {
  key: string;
  path: string;
  startLine: number;
  endLine: number;
  source: "memory";
  snippet: string;
  recallCount: number;
  dailyCount: number;
  groundedCount: number;
  totalScore: number;
  maxScore: number;
  firstRecalledAt: string;
  lastRecalledAt: string;
  queryHashes: string[];
  /** Hashes from interactive recalls only. */
  userQueryHashes?: string[];
  recallDays: string[];
  conceptTags: string[];
  claimHash?: string;
  projectKey?: string;
  promotedAt?: string;
  provenance?: MemoryEntryProvenance;
};
type PromotionCandidate = Omit<ShortTermRecallEntry, "dailyCount" | "groundedCount" | "totalScore" | "queryHashes" | "userQueryHashes"> & {
  dailyCount?: number;
  groundedCount?: number;
  signalCount: number;
  avgScore: number;
  uniqueQueries: number;
  ageDays: number;
  score: number;
  components: PromotionWeights;
};
type ShortTermAuditSummary = ShortTermAuditSummary$1<ConceptTagScriptCoverage>;
type RepairShortTermPromotionArtifactsResult = Omit<RepairShortTermPromotionArtifactsResult$1, "removedOverflowEntries"> & {
  removedOverflowEntries: number;
};
declare function loadShortTermPromotionDreamingStats(params: {
  workspaceDir: string;
  nowMs: number;
  timezone?: string;
}): Promise<ShortTermDreamingStats>;
declare function auditShortTermPromotionArtifacts(params: {
  workspaceDir: string;
}): Promise<ShortTermAuditSummary>;
declare function repairShortTermPromotionArtifacts(params: {
  workspaceDir: string;
}): Promise<RepairShortTermPromotionArtifactsResult>;
declare function removeGroundedShortTermCandidates(params: {
  workspaceDir: string;
}): Promise<{
  removed: number;
  storePath: string;
}>;
type MemoryCoreOpenKeyedStore = <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
declare const configureMemoryCoreDreamingState: (next: MemoryCoreOpenKeyedStore) => void;
export { repairShortTermPromotionArtifacts as a, RepairShortTermPromotionArtifactsResult as c, DreamingArtifactsAuditSummary as d, RepairDreamingArtifactsResult as f, MemoryEmbeddingProbeResult as g, WorkspaceFileMode as h, removeGroundedShortTermCandidates as i, ShortTermAuditSummary as l, ShortTermDreamingStatsEntry as m, configureMemoryCoreDreamingState as n, loadShortTermPromotionDreamingStats as o, ShortTermDreamingStats as p, auditShortTermPromotionArtifacts as r, PromotionCandidate as s, MemoryCoreOpenKeyedStore as t, ShortTermRecallEntry as u };