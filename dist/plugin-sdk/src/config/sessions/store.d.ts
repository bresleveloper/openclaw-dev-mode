import type { MsgContext } from "../../auto-reply/templating.js";
import type { DeliveryContext } from "../../utils/delivery-context.types.js";
import type { OpenClawConfig } from "../types.openclaw.js";
import { type SessionUnreferencedArtifactSweepResult } from "./disk-budget.js";
import { getSessionStoreCacheVersion } from "./store-cache.js";
import { type SessionMaintenanceApplyReport } from "./store-maintenance-operations.js";
import { resolveMaintenanceConfig } from "./store-maintenance-runtime.js";
import { capEntryCount, getActiveSessionMaintenanceWarning, pruneStaleEntries, type ResolvedSessionMaintenanceConfig, type SessionMaintenanceWarning } from "./store-maintenance.js";
import { type SessionEntry } from "./types.js";
export { clearSessionStoreCacheForTest, drainSessionStoreWriterQueuesForTest, getSessionStoreWriterQueueSizeForTest, } from "./store-writer-state.js";
export { loadSessionStore, readSessionEntries, readSessionEntry, readSessionStoreSnapshot, } from "./store-load.js";
export type { SessionStoreSnapshot, SessionStoreSnapshotEntries, SessionStoreSnapshotEntry, } from "./store-cache.js";
export { normalizeStoreSessionKey, resolveSessionStoreEntry } from "./store-entry.js";
export type SessionEntryPatchProjectionSnapshot = {
    entries: ReadonlyArray<{
        sessionKey: string;
        entry: SessionEntry;
    }>;
};
export type SessionEntryPatchProjectionTarget = {
    candidateKeys?: readonly string[];
    primaryKey: string;
};
export type SessionEntryPatchProjectionContext = SessionEntryPatchProjectionSnapshot & SessionEntryPatchProjectionTarget & {
    existingEntry?: SessionEntry;
};
export type SessionEntryPatchProjectionFailure = {
    ok: false;
};
export type SessionEntryPatchProjectionResult<TFailure extends SessionEntryPatchProjectionFailure> = {
    ok: true;
    entry: SessionEntry;
} | TFailure;
export declare function readSessionUpdatedAt(params: {
    storePath: string;
    sessionKey: string;
}): number | undefined;
export { capEntryCount, getActiveSessionMaintenanceWarning, getSessionStoreCacheVersion, pruneStaleEntries, resolveMaintenanceConfig, };
export type { SessionMaintenanceApplyReport } from "./store-maintenance-operations.js";
export type { ResolvedSessionMaintenanceConfig, SessionMaintenanceWarning };
type SaveSessionStoreOptions = {
    /** Skip pruning, capping, and rotation (e.g. during one-time migrations). */
    skipMaintenance?: boolean;
    /** Caller already proved the store serialization is unchanged unless maintenance mutates it. */
    skipSerializeForUnchangedStore?: boolean;
    /** Internal hot paths can hand writer-owned stores to the cache after persistence. */
    takeCacheOwnership?: boolean;
    /** Active session key for warn-only maintenance. */
    activeSessionKey?: string;
    /** Optional callback for warn-only maintenance. */
    onWarn?: (warning: SessionMaintenanceWarning) => void | Promise<void>;
    /** Optional callback with maintenance stats after a save. */
    onMaintenanceApplied?: (report: SessionMaintenanceApplyReport) => void | Promise<void>;
    /** Optional overrides used by maintenance commands. */
    maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig>;
    /** Fully resolved maintenance settings when the caller already has config loaded. */
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    /** Changed top-level entry when a hot path only updated one existing session. */
    singleEntryPersistence?: SingleEntryPersistencePatch;
    /** Throw when best-effort store recovery cannot confirm the requested write. */
    requireWriteSuccess?: boolean;
};
type UpdateSessionStoreOptions<T> = SaveSessionStoreOptions & {
    /**
     * Specialized callers can prove their mutator made no changes through its result.
     * When true, the writer-owned object cache is restored and sessions.json is untouched.
     */
    skipSaveWhenResult?: (result: T) => boolean;
    resolveSingleEntryPersistence?: (result: T) => SingleEntryPersistencePatch | null | undefined;
};
type SingleEntryPersistencePatch = {
    sessionKey: string;
    entry: SessionEntry;
};
type SessionEntryWorkflowOptions = {
    agentId?: string;
    env?: NodeJS.ProcessEnv;
    hydrateSkillPromptRefs?: boolean;
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    storePath?: string;
};
export type SessionLifecycleArtifactCleanupParams = {
    /** Session store to clean. */
    storePath: string;
    /** Archive exact transcripts referenced by removed entries before the orphan marker scan. */
    archiveRemovedEntryTranscripts?: boolean;
    /** Matches the persisted session-key segment after `agent:<id>:`. */
    sessionKeySegmentPrefix: string;
    /** Marker that identifies transcript artifacts owned by this lifecycle. */
    transcriptContentMarker: string;
    /** Minimum age before a present transcript can be reclaimed or archived. */
    orphanTranscriptMinAgeMs: number;
    /** Testable clock override. */
    nowMs?: number;
};
export type SessionLifecycleArtifactCleanupResult = {
    removedEntries: number;
    archivedTranscriptArtifacts: number;
};
export type SessionLifecycleStoreTarget = {
    /** Canonical persisted key for the entry being reset or deleted. */
    canonicalKey: string;
    /** Canonical key plus legacy aliases that can still identify the same entry. */
    storeKeys: string[];
};
export type SessionLifecycleArchivedTranscript = {
    sourcePath: string;
    archivedPath: string;
};
export type ResetSessionEntryLifecycleResult = {
    archivedTranscripts: SessionLifecycleArchivedTranscript[];
    previousEntry?: SessionEntry;
    previousSessionFile?: string;
    previousSessionId?: string;
    nextEntry: SessionEntry;
};
export type ResetSessionEntryLifecycleMutation = Omit<ResetSessionEntryLifecycleResult, "archivedTranscripts">;
export type DeleteSessionEntryLifecycleResult = {
    archivedTranscripts: SessionLifecycleArchivedTranscript[];
    deleted: boolean;
    deletedEntry?: SessionEntry;
    deletedSessionFile?: string;
    deletedSessionId?: string;
};
export type SessionEntryLifecycleRemoval = {
    /** Exact persisted key to remove from the store. */
    sessionKey: string;
    /** Optional full-entry guard for plans built before the writer lock. */
    expectedEntry?: SessionEntry;
    /** Archive the removed entry's transcript only when no final store entry still references it. */
    archiveRemovedTranscript?: boolean;
    /** Optional guard for stale plans built from a prior store read. */
    expectedSessionId?: string;
    /** Optional guard for stale plans built from a prior store read. */
    expectedUpdatedAt?: number;
};
export type SessionEntryLifecycleUpsert = {
    /** Exact persisted key to create or replace. */
    sessionKey: string;
} & ({
    /** Entry to persist at the exact key. */
    entry: SessionEntry;
    buildEntry?: never;
} | {
    /** Builds the persisted entry after the storage writer lock is held. */
    buildEntry: (context: {
        currentEntry?: SessionEntry;
        sessionKey: string;
        store: Record<string, SessionEntry>;
    }) => Promise<SessionEntry | null | undefined> | SessionEntry | null | undefined;
    entry?: never;
});
export type SessionArchivedTranscriptCleanupRule = {
    reason: "deleted" | "reset";
    olderThanMs: number;
};
export type SessionEntryLifecycleMutationResult = {
    removedEntries: number;
    removedSessionKeys: string[];
    archivedTranscriptDirectories: string[];
    unreferencedArtifacts: SessionUnreferencedArtifactSweepResult | null;
    maintenanceReport: SessionMaintenanceApplyReport | null;
    afterCount: number;
    artifactCleanupError?: unknown;
};
export type DeletedAgentSessionEntryPurgeParams = {
    /** Runtime config used to preserve legacy default-agent key ownership rules. */
    cfg: OpenClawConfig;
    /** Deleted agent whose session entries should be purged. */
    agentId: string;
    /** Agent id represented by the current store path for legacy unscoped keys. */
    storeAgentId: string;
    /** Resolved session store path to mutate. */
    storePath: string;
};
export declare function getSessionEntry(options: SessionEntryWorkflowOptions & {
    sessionKey: string;
}): SessionEntry | undefined;
export declare function listSessionEntries(options?: SessionEntryWorkflowOptions): Array<{
    sessionKey: string;
    entry: SessionEntry;
}>;
export declare function saveSessionStore(storePath: string, store: Record<string, SessionEntry>, opts?: SaveSessionStoreOptions): Promise<void>;
export declare function updateSessionStore<T>(storePath: string, mutator: (store: Record<string, SessionEntry>) => Promise<T> | T, opts?: UpdateSessionStoreOptions<T>): Promise<T>;
/**
 * Applies a storage-neutral entry projection inside the session-store writer.
 * The projection receives a cloned snapshot and returns the replacement entry;
 * it cannot mutate the backing whole store.
 */
export declare function applySessionEntryPatchProjection<TFailure extends SessionEntryPatchProjectionFailure>(params: {
    storePath: string;
    resolveTarget: (snapshot: SessionEntryPatchProjectionSnapshot) => SessionEntryPatchProjectionTarget;
    project: (context: SessionEntryPatchProjectionContext) => Promise<SessionEntryPatchProjectionResult<TFailure>> | SessionEntryPatchProjectionResult<TFailure>;
}): Promise<SessionEntryPatchProjectionResult<TFailure>>;
/** Resets one persisted session entry and rotates its file-backed transcript artifacts. */
export declare function resetSessionEntryLifecycle(params: {
    afterEntryMutation?: (mutation: ResetSessionEntryLifecycleMutation) => Promise<void> | void;
    agentId?: string;
    buildNextEntry: (context: {
        currentEntry?: SessionEntry;
        primaryKey: string;
    }) => Promise<SessionEntry> | SessionEntry;
    storePath: string;
    target: SessionLifecycleStoreTarget;
}): Promise<ResetSessionEntryLifecycleResult>;
/** Deletes one persisted session entry and archives its file-backed transcript artifacts. */
export declare function deleteSessionEntryLifecycle(params: {
    agentId?: string;
    archiveTranscript: boolean;
    storePath: string;
    target: SessionLifecycleStoreTarget;
}): Promise<DeleteSessionEntryLifecycleResult>;
/**
 * Applies exact entry removals/upserts and lifecycle artifact cleanup as one
 * backend-owned operation. Callers choose domain keys; storage owns the final
 * referenced-session set used for transcript/artifact cleanup.
 */
export declare function applySessionEntryLifecycleMutation(params: {
    storePath: string;
    removals?: Iterable<SessionEntryLifecycleRemoval>;
    upserts?: Iterable<SessionEntryLifecycleUpsert>;
    activeSessionKey?: string;
    maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig>;
    skipMaintenance?: boolean;
    archiveReason?: "deleted" | "reset";
    restrictArchivedTranscriptsToStoreDir?: boolean;
    cleanupArchivedTranscripts?: {
        rules: SessionArchivedTranscriptCleanupRule[];
        nowMs?: number;
    };
    pruneUnreferencedArtifacts?: {
        olderThanMs: number;
        dryRun?: boolean;
    };
    captureArtifactCleanupError?: boolean;
}): Promise<SessionEntryLifecycleMutationResult>;
/**
 * Purges entries owned by a deleted agent while holding the store writer lock.
 * This preserves the old delete-time current-store owner check without
 * exposing a mutable whole-store callback to callers.
 */
export declare function purgeDeletedAgentSessionEntries(params: DeletedAgentSessionEntryPurgeParams): Promise<SessionEntryLifecycleMutationResult>;
/** Cleans scoped session lifecycle entries and their unreferenced transcript artifacts. */
export declare function cleanupSessionLifecycleArtifacts(params: SessionLifecycleArtifactCleanupParams): Promise<SessionLifecycleArtifactCleanupResult>;
export declare function archiveRemovedSessionTranscripts(params: {
    removedSessionFiles: Iterable<[string, string | undefined]>;
    referencedSessionIds: ReadonlySet<string>;
    storePath: string;
    reason: "deleted" | "reset";
    restrictToStoreDir?: boolean;
}): Promise<Set<string>>;
export declare function updateSessionStoreEntry(params: {
    storePath: string;
    sessionKey: string;
    update: (entry: SessionEntry) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
    requireWriteSuccess?: boolean;
}): Promise<SessionEntry | null>;
export declare function applySessionStoreEntryPatch(params: {
    storePath: string;
    sessionKey: string;
    patch: Partial<SessionEntry>;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
}): Promise<SessionEntry | null>;
type SessionEntryPatchParams = SessionEntryWorkflowOptions & {
    sessionKey: string;
    fallbackEntry?: SessionEntry;
    preserveActivity?: boolean;
    requireWriteSuccess?: boolean;
    replaceEntry?: boolean;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
    update: (entry: SessionEntry, context: {
        existingEntry?: SessionEntry;
    }) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
};
export declare function patchSessionEntry(params: SessionEntryPatchParams): Promise<SessionEntry | null>;
export declare function patchSessionEntryWithKey(params: SessionEntryPatchParams): Promise<{
    sessionKey: string;
    entry: SessionEntry;
} | null>;
export declare function upsertSessionEntry(params: SessionEntryWorkflowOptions & {
    sessionKey: string;
    entry: SessionEntry;
}): Promise<void>;
export declare function recordSessionMetaFromInbound(params: {
    storePath: string;
    sessionKey: string;
    ctx: MsgContext;
    groupResolution?: import("./types.js").GroupKeyResolution | null;
    createIfMissing?: boolean;
}): Promise<SessionEntry | null>;
export declare function updateLastRoute(params: {
    storePath: string;
    sessionKey: string;
    channel?: SessionEntry["lastChannel"];
    to?: string;
    accountId?: string;
    threadId?: string | number;
    route?: SessionEntry["route"];
    deliveryContext?: DeliveryContext;
    ctx?: MsgContext;
    groupResolution?: import("./types.js").GroupKeyResolution | null;
    createIfMissing?: boolean;
}): Promise<SessionEntry | null>;
