import type { MemoryEmbeddingProvider, MemoryEmbeddingProviderCreateOptions, MemoryEmbeddingProviderRuntime } from "./memory-core-host-engine-embeddings.js";
import type { OpenKeyedStoreOptions, PluginStateKeyedStore } from "./plugin-state-runtime.js";
type EmbeddingProviderResult = {
    provider: MemoryEmbeddingProvider | null;
    requestedProvider: string;
    fallbackFrom?: string;
    fallbackReason?: string;
    providerUnavailableReason?: string;
    runtime?: MemoryEmbeddingProviderRuntime;
};
type RuntimeFacadeModule = {
    configureMemoryCoreDreamingState: (openKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>) => void;
    createEmbeddingProvider: (options: MemoryEmbeddingProviderCreateOptions & {
        provider: string;
        fallback: string;
    }) => Promise<EmbeddingProviderResult>;
    removeGroundedShortTermCandidates: (params: {
        workspaceDir: string;
    }) => Promise<{
        removed: number;
        storePath: string;
    }>;
    loadShortTermPromotionDreamingStats: (params: {
        workspaceDir: string;
        nowMs: number;
        timezone?: string;
    }) => Promise<ShortTermDreamingStats>;
    repairDreamingArtifacts: (params: {
        workspaceDir: string;
        archiveDiary?: boolean;
        now?: Date;
    }) => Promise<RepairDreamingArtifactsResult>;
};
type GroundedRemPreviewItem = {
    text: string;
    refs: string[];
};
type GroundedRemCandidate = GroundedRemPreviewItem & {
    lean: "likely_durable" | "unclear" | "likely_situational";
};
type GroundedRemFilePreview = {
    path: string;
    facts: GroundedRemPreviewItem[];
    reflections: GroundedRemPreviewItem[];
    memoryImplications: GroundedRemPreviewItem[];
    candidates: GroundedRemCandidate[];
    renderedMarkdown: string;
};
type GroundedRemPreviewResult = {
    workspaceDir: string;
    scannedFiles: number;
    files: GroundedRemFilePreview[];
};
type RemDreamingPreview = {
    sourceEntryCount: number;
    reflections: string[];
    candidateTruths: Array<{
        snippet: string;
        confidence: number;
        evidence: string;
    }>;
    candidateKeys: string[];
    bodyLines: string[];
};
type PromotionCandidate = {
    key: string;
    path: string;
    startLine: number;
    endLine: number;
    snippet: string;
    recallCount: number;
    uniqueQueries: number;
    avgScore: number;
    maxScore: number;
    ageDays: number;
    firstRecalledAt: string;
    lastRecalledAt: string;
    promotedAt?: string;
};
export type ShortTermDreamingStatsEntry = {
    key: string;
    path: string;
    startLine: number;
    endLine: number;
    snippet: string;
    recallCount: number;
    dailyCount: number;
    groundedCount: number;
    totalSignalCount: number;
    lightHits: number;
    remHits: number;
    phaseHitCount: number;
    promotedAt?: string;
    lastRecalledAt?: string;
};
export type ShortTermDreamingStats = {
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
type RemHarnessPreviewResult = {
    workspaceDir: string;
    nowMs: number;
    remConfig: {
        enabled: boolean;
        lookbackDays: number;
        limit: number;
        minPatternStrength: number;
    };
    deepConfig: {
        minScore: number;
        minRecallCount: number;
        minUniqueQueries: number;
        recencyHalfLifeDays: number;
        maxAgeDays?: number;
    };
    recallEntryCount: number;
    remSkipped: boolean;
    rem: RemDreamingPreview;
    groundedInputPaths: string[];
    grounded: GroundedRemPreviewResult | null;
    deep: {
        candidateLimit?: number;
        candidateCount: number;
        truncated: boolean;
        candidates: PromotionCandidate[];
    };
};
type ApiFacadeModule = {
    configureMemoryCoreDreamingState: (openKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>) => void;
    previewGroundedRemMarkdown: (params: {
        workspaceDir: string;
        inputPaths: string[];
    }) => Promise<GroundedRemPreviewResult>;
    dedupeDreamDiaryEntries: (params: {
        workspaceDir: string;
    }) => Promise<{
        dreamsPath: string;
        removed: number;
        kept: number;
    }>;
    writeBackfillDiaryEntries: (params: {
        workspaceDir: string;
        entries: Array<{
            isoDay: string;
            bodyLines: string[];
            sourcePath?: string;
        }>;
        timezone?: string;
    }) => Promise<{
        dreamsPath: string;
        written: number;
        replaced: number;
    }>;
    removeBackfillDiaryEntries: (params: {
        workspaceDir: string;
    }) => Promise<{
        dreamsPath: string;
        removed: number;
    }>;
    filterRecallEntriesWithinLookback: (params: {
        entries: readonly unknown[];
        nowMs: number;
        lookbackDays: number;
    }) => unknown[];
    previewRemHarness: (params: {
        workspaceDir: string;
        cfg?: unknown;
        pluginConfig?: Record<string, unknown>;
        grounded?: boolean;
        groundedInputPaths?: string[];
        groundedFileLimit?: number;
        includePromoted?: boolean;
        candidateLimit?: number;
        remPreviewLimit?: number;
        nowMs?: number;
    }) => Promise<RemHarnessPreviewResult>;
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
/** Create a memory embedding provider with built-in fallback metadata. */
export declare const createEmbeddingProvider: RuntimeFacadeModule["createEmbeddingProvider"];
/** Remove short-term recall candidates already grounded into durable memory. */
export declare const removeGroundedShortTermCandidates: RuntimeFacadeModule["removeGroundedShortTermCandidates"];
/** Load short-term dreaming stats for doctor/control status. */
export declare const loadShortTermPromotionDreamingStats: RuntimeFacadeModule["loadShortTermPromotionDreamingStats"];
/** Repair or archive problematic dreaming artifacts through the bundled runtime facade. */
export declare const repairDreamingArtifacts: RuntimeFacadeModule["repairDreamingArtifacts"];
/** Preview grounded REM markdown facts and candidates for selected input files. */
export declare const previewGroundedRemMarkdown: ApiFacadeModule["previewGroundedRemMarkdown"];
/** Remove duplicate dreaming diary entries while preserving canonical records. */
export declare const dedupeDreamDiaryEntries: ApiFacadeModule["dedupeDreamDiaryEntries"];
/** Write synthetic/backfill dreaming diary entries for harness or migration use. */
export declare const writeBackfillDiaryEntries: ApiFacadeModule["writeBackfillDiaryEntries"];
/** Remove dreaming diary entries previously written by the backfill helper. */
export declare const removeBackfillDiaryEntries: ApiFacadeModule["removeBackfillDiaryEntries"];
/** Filter recall entries to the configured REM lookback window. */
export declare const filterRecallEntriesWithinLookback: ApiFacadeModule["filterRecallEntriesWithinLookback"];
/** Preview REM harness output across dreaming, grounded, and deep promotion candidates. */
export declare const previewRemHarness: ApiFacadeModule["previewRemHarness"];
export {};
