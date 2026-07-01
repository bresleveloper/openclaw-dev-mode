import { SessionManager } from "../agents/sessions/session-manager.js";
import type { SessionCompactionCheckpoint, SessionCompactionCheckpointReason, SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export declare const MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES: number;
export declare const MAX_COMPACTION_CHECKPOINT_RETAINED_BYTES_PER_SESSION: number;
export type CapturedCompactionCheckpointSnapshot = {
    sessionId: string;
    sessionFile?: string;
    leafId: string;
    entryId?: string;
};
type SessionLeafState = {
    leafId: string | null;
    entryId: string;
};
export declare function resolveCompactionCheckpointTranscriptPosition(params: {
    preferredLeafId?: string | null;
    transcriptState?: SessionLeafState | null;
}): {
    leafId?: string;
    entryId?: string;
};
type ForkedCompactionCheckpointTranscript = {
    sessionId: string;
    sessionFile: string;
};
export type CompactionCheckpointForkedTranscript = ForkedCompactionCheckpointTranscript & {
    totalTokens?: number;
};
export type CompactionCheckpointTranscriptForkResult = {
    status: "created";
    transcript: CompactionCheckpointForkedTranscript;
} | {
    status: "missing-boundary";
} | {
    status: "failed";
};
export type CompactionCheckpointSessionMutationResult = {
    status: "created";
    key: string;
    checkpoint: SessionCompactionCheckpoint;
    entry: SessionEntry;
} | {
    status: "missing-session";
} | {
    status: "missing-checkpoint";
} | {
    status: "missing-boundary";
} | {
    status: "failed";
};
export type BranchCheckpointSessionParams = {
    storePath: string;
    sourceKey: string;
    sourceStoreKey?: string;
    nextKey: string;
    checkpointId: string;
};
export type RestoreCheckpointSessionParams = {
    storePath: string;
    sessionKey: string;
    sessionStoreKey?: string;
    checkpointId: string;
};
export type PersistSessionCompactionCheckpointParams = {
    cfg: OpenClawConfig;
    sessionKey: string;
    sessionId: string;
    reason: SessionCompactionCheckpointReason;
    snapshot: CapturedCompactionCheckpointSnapshot;
    summary?: string;
    firstKeptEntryId?: string;
    tokensBefore?: number;
    tokensAfter?: number;
    postSessionFile?: string;
    postLeafId?: string;
    postEntryId?: string;
    createdAt?: number;
};
/**
 * Storage boundary for compaction checkpoint capture, persistence, branch,
 * restore, and cleanup operations.
 */
export type CompactionCheckpointStore = {
    /** Captures the pre-compaction transcript identity without copying rows/files. */
    captureSnapshot: typeof captureCompactionCheckpointSnapshotAsync;
    /** Persists checkpoint metadata and prunes checkpoint artifacts owned by this store. */
    persistCheckpoint: (params: PersistSessionCompactionCheckpointParams) => Promise<SessionCompactionCheckpoint | null>;
    /** Cleans unpersisted legacy snapshot artifacts after failed persistence. */
    cleanupSnapshot: typeof cleanupCompactionCheckpointSnapshot;
    /**
     * Creates a checkpoint branch and records its session entry in one logical
     * store mutation.
     */
    branchCheckpointSession: (params: BranchCheckpointSessionParams) => Promise<CompactionCheckpointSessionMutationResult>;
    /**
     * Restores a checkpoint and replaces the current session entry in one logical
     * store mutation.
     */
    restoreCheckpointSession: (params: RestoreCheckpointSessionParams) => Promise<CompactionCheckpointSessionMutationResult>;
};
/** Resolve the stored checkpoint reason from compaction trigger state. */
export declare function resolveSessionCompactionCheckpointReason(params: {
    trigger?: "budget" | "overflow" | "manual";
    timedOut?: boolean;
}): SessionCompactionCheckpointReason;
export declare function readSessionLeafStateFromTranscriptAsync(sessionFile: string, maxBytes?: number): Promise<{
    entryId: string;
    leafId: string | null;
} | null>;
export declare function forkCompactionCheckpointTranscriptAsync(params: {
    sourceFile: string;
    sourceLeafId?: string;
    targetCwd?: string;
    sessionDir?: string;
}): Promise<ForkedCompactionCheckpointTranscript | null>;
/**
 * Creates the current file-backed compaction checkpoint domain store.
 *
 * The branch/restore operations own the transcript fork plus session entry
 * update so a SQLite implementation can copy transcript rows and update
 * `session_entries.entry_json` inside one write transaction.
 */
export declare function createFileBackedCompactionCheckpointStore(): CompactionCheckpointStore;
/**
 * Capture the stable pre-compaction identity without duplicating the transcript.
 * Branch/restore uses the compacted successor transcript, while legacy
 * checkpoints that already have a snapshot file keep working.
 */
export declare function captureCompactionCheckpointSnapshotAsync(params: {
    sessionManager?: Pick<SessionManager, "getLeafId">;
    sessionFile: string;
    maxBytes?: number;
}): Promise<CapturedCompactionCheckpointSnapshot | null>;
export declare function cleanupCompactionCheckpointSnapshot(snapshot: CapturedCompactionCheckpointSnapshot | null | undefined): Promise<void>;
export declare function persistSessionCompactionCheckpoint(params: PersistSessionCompactionCheckpointParams): Promise<SessionCompactionCheckpoint | null>;
export declare function listSessionCompactionCheckpoints(entry: Pick<SessionEntry, "compactionCheckpoints"> | undefined): SessionCompactionCheckpoint[];
export declare function getSessionCompactionCheckpoint(params: {
    entry: Pick<SessionEntry, "compactionCheckpoints"> | undefined;
    checkpointId: string;
}): SessionCompactionCheckpoint | undefined;
export {};
