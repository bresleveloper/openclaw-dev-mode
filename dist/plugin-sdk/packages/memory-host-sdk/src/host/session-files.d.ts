import type { MemorySessionSyncTarget } from "./types.js";
export { listSessionTranscriptCorpusEntriesForAgent, type SessionTranscriptCorpusArtifactKind, type SessionTranscriptCorpusEntry, } from "./session-transcript-corpus.js";
export type SessionFileEntry = {
    path: string;
    absPath: string;
    mtimeMs: number;
    size: number;
    hash: string;
    content: string;
    /** Maps each content line (0-indexed) to its 1-indexed JSONL source line. */
    lineMap: number[];
    /** Maps each content line (0-indexed) to epoch ms; 0 means unknown timestamp. */
    messageTimestampsMs: number[];
    /** True when this transcript belongs to an internal dreaming narrative run. */
    generatedByDreamingNarrative?: boolean;
    /** True when this transcript belongs to an isolated cron run session. */
    generatedByCronRun?: boolean;
};
export type BuildSessionEntryOptions = {
    /** Optional preclassification from a caller-managed dreaming transcript lookup. */
    generatedByDreamingNarrative?: boolean;
    /** Optional preclassification from a caller-managed cron transcript lookup. */
    generatedByCronRun?: boolean;
    /** Override for tests or specialized callers that need a tighter parse yield cadence. */
    parseYieldEveryLines?: number;
};
export type SessionTranscriptClassification = {
    dreamingNarrativeTranscriptPaths: ReadonlySet<string>;
    cronRunTranscriptPaths: ReadonlySet<string>;
};
export type ResolvedMemorySessionSyncTarget = {
    agentId: string;
    sessionFile: string;
    sessionId: string;
};
export type ResolvedSessionTranscriptIdentity = {
    agentId: string;
    sessionId: string;
    sessionKey?: string;
};
export declare function normalizeSessionTranscriptPathForComparison(pathname: string): string;
export declare function loadSessionTranscriptClassificationForSessionsDir(sessionsDir: string): SessionTranscriptClassification;
export declare function loadDreamingNarrativeTranscriptPathSetForAgent(agentId: string): ReadonlySet<string>;
export declare function loadSessionTranscriptClassificationForAgent(agentId: string): SessionTranscriptClassification;
export declare function listSessionFilesForAgent(agentId: string): Promise<string[]>;
export declare function sessionPathForFile(absPath: string): string;
/**
 * Parses a deprecated path-shaped memory sync hint only when it points at an
 * OpenClaw-owned usage-counted transcript in the canonical agent sessions dir.
 */
export declare function parseCanonicalSessionSyncTargetFromPath(sessionFile: string): MemorySessionSyncTarget | null;
/**
 * Resolves a current transcript path back to the canonical session-store
 * identity when available, falling back to the usage-counted file identity.
 */
export declare function resolveSessionIdentityForTranscriptFile(sessionFile: string): ResolvedSessionTranscriptIdentity | null;
/**
 * Resolves a storage-neutral memory sync target to the current file-backed
 * transcript. The SQLite adapter implements this identity contract without
 * deriving a path.
 */
export declare function resolveSessionFileForSyncTarget(target: MemorySessionSyncTarget, defaultAgentId?: string): ResolvedMemorySessionSyncTarget | null;
export declare function buildSessionEntry(absPath: string, opts?: BuildSessionEntryOptions): Promise<SessionFileEntry | null>;
