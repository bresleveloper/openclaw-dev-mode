import { g as MemoryEntryProvenance } from "./types-D7I_F5Ux.js";
import { Bb as PluginStateKeyedStore, Pb as OpenKeyedStoreOptions } from "./config-contracts-CY87ANNp.js";
import "./database-engine-worker-runtime-DSU40AON.js";
import { a as ShortTermAuditSummary$1, i as RepairShortTermPromotionArtifactsResult$1, o as ShortTermDreamingStats } from "./dreaming-D2Tdqt2p.js";
import "./plugin-state-runtime-cWC3lBJR.js";
import "./memory-core-host-runtime-core-uGyluBS6.js";
import { DatabaseSync } from "node:sqlite";
//#region src/plugin-sdk/memory-core-host-engine-storage.d.ts
/** Health probe result for embedding provider availability checks. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
//#endregion
//#region extensions/memory-core/src/concept-vocabulary.d.ts
type ConceptTagScriptCoverage = ReturnType<typeof summarizeConceptTagScriptCoverage>;
declare function summarizeConceptTagScriptCoverage(conceptTagsByEntry: string[][]): {
  latinEntryCount: number;
  cjkEntryCount: number;
  mixedEntryCount: number;
  otherEntryCount: number;
};
//#endregion
//#region extensions/memory-core/src/short-term-promotion-types.d.ts
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
//#endregion
//#region extensions/memory-core/src/short-term-promotion-stats.d.ts
declare function loadShortTermPromotionDreamingStats(params: {
  workspaceDir: string;
  nowMs: number;
  timezone?: string;
}): Promise<ShortTermDreamingStats>;
//#endregion
//#region extensions/memory-core/src/short-term-promotion-artifacts.d.ts
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
//#endregion
//#region extensions/memory-core/src/dreaming-state.d.ts
type MemoryCoreOpenKeyedStore = <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
declare const configureMemoryCoreDreamingState: (next: MemoryCoreOpenKeyedStore) => void;
//#endregion
export { repairShortTermPromotionArtifacts as a, RepairShortTermPromotionArtifactsResult as c, MemoryEmbeddingProbeResult as d, removeGroundedShortTermCandidates as i, ShortTermAuditSummary as l, configureMemoryCoreDreamingState as n, loadShortTermPromotionDreamingStats as o, auditShortTermPromotionArtifacts as r, PromotionCandidate as s, MemoryCoreOpenKeyedStore as t, ShortTermRecallEntry as u };