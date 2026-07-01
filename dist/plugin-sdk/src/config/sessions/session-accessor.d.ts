import type { SessionTranscriptUpdate } from "../../sessions/transcript-events.js";
import type { OpenClawConfig } from "../types.openclaw.js";
import { clearPluginOwnedSessionState, type PluginHostSessionCleanupStoreParams } from "./plugin-host-cleanup.js";
import type { ResolvedSessionMaintenanceConfig, SessionMaintenanceWarning } from "./store-maintenance.js";
import { type DeleteSessionEntryLifecycleResult, type ResetSessionEntryLifecycleMutation, type ResetSessionEntryLifecycleResult, type DeletedAgentSessionEntryPurgeParams, type SessionArchivedTranscriptCleanupRule, type SessionEntryLifecycleMutationResult, type SessionEntryLifecycleRemoval, type SessionEntryLifecycleUpsert, type SessionEntryPatchProjectionContext, type SessionEntryPatchProjectionFailure, type SessionEntryPatchProjectionResult, type SessionEntryPatchProjectionSnapshot, type SessionEntryPatchProjectionTarget, type SessionLifecycleArchivedTranscript, type SessionLifecycleArtifactCleanupParams, type SessionLifecycleArtifactCleanupResult, type SessionLifecycleStoreTarget } from "./store.js";
import type { SessionEntry } from "./types.js";
/**
 * Session access API for callers that need entries or transcripts without
 * depending on the persisted store layout. Callers provide stable session
 * identity, and this module resolves the current entry/transcript target while
 * preserving canonical-key, transcript-linking, and update-notification rules.
 *
 * Ownership contract (#88838): this accessor is the permanent storage-neutral
 * domain boundary for session/transcript runtime access; the SQLite storage
 * flip implements this interface. The entry workflow helpers in store.ts are
 * the file-backend implementation it delegates to plus the plugin-SDK
 * deprecation-window surface (RFC 0007); they become internal as direct
 * callers migrate here. New runtime callers use this module, not store.ts.
 */
export type SessionAccessScope = {
    /** Agent owner used when the session key does not already encode one. */
    agentId?: string;
    /**
     * Set false only for internal read-only hot paths that will not retain or
     * mutate the returned entry.
     */
    clone?: boolean;
    /** Environment override used when resolving agent-scoped store paths in tests/tools. */
    env?: NodeJS.ProcessEnv;
    /** Set false for metadata-only reads that do not need hydrated prompt refs. */
    hydrateSkillPromptRefs?: boolean;
    /** Use latest when the caller must bypass any in-process metadata snapshot. */
    readConsistency?: "latest";
    /** Canonical or alias session key for the entry being read or written. */
    sessionKey: string;
    /** Explicit store path for callers that already resolved the owning store. */
    storePath?: string;
};
export type LogicalSessionAccessScope = {
    /** Runtime config whose session store rules define the logical session owner. */
    cfg: OpenClawConfig;
    /** Environment override used when resolving configured/discovered agent stores. */
    env?: NodeJS.ProcessEnv;
    /** Canonical or alias session key for the logical entry being read or written. */
    sessionKey: string;
};
export type ResolvedSessionEntryAccessTarget = {
    /** Agent owner inferred from the canonical session key. */
    agentId: string;
    /** Canonical session key returned to callers even when an alias row won. */
    canonicalKey: string;
    /** Freshest matching entry, if any. */
    entry?: SessionEntry;
    /** Original caller-supplied key after trimming. */
    requestedKey: string;
    /** Persisted key for the selected row. */
    storeKey: string;
};
export type ResolvedSessionEntryUpdateContext = Omit<ResolvedSessionEntryAccessTarget, "entry"> & {
    /** Mutable entry inside the storage operation. */
    entry: SessionEntry;
};
export type ResolvedSessionEntryUpdateResult<T> = {
    canonicalKey: string;
    found: false;
} | {
    canonicalKey: string;
    entry: SessionEntry;
    found: true;
    result: T;
    storeKey: string;
};
export type SessionTranscriptAccessScope = Omit<SessionAccessScope, "sessionKey"> & {
    /** Explicit transcript file path; bypasses store lookup when already known. */
    sessionFile?: string;
    /** Runtime session id used to derive a transcript file when no explicit file is provided. */
    sessionId: string;
    /** Required when resolving through session metadata; optional for explicit transcript artifacts. */
    sessionKey?: string;
    /** Channel thread suffix used when deriving topic transcript paths. */
    threadId?: string | number;
};
export type SessionTranscriptRuntimeScope = SessionAccessScope & {
    /** Resolved file-backed artifact for the current runtime target. */
    sessionFile?: string;
    sessionId: string;
    threadId?: string | number;
};
export type SessionTranscriptReadScope = Omit<SessionTranscriptRuntimeScope, "sessionKey"> & {
    /** Canonical key when the caller has a session-store identity for this read. */
    sessionKey?: string;
    /** Entry already loaded by hot callers; avoids rereading the session store. */
    sessionEntry?: Pick<SessionEntry, "sessionFile"> & Partial<Pick<SessionEntry, "sessionId">>;
};
export type SessionTranscriptReadTarget = Omit<SessionTranscriptRuntimeTarget, "agentId" | "sessionKey"> & {
    agentId?: string;
    sessionKey?: string;
};
export type SessionTranscriptWriteScope = Omit<SessionTranscriptAccessScope, "sessionId"> & {
    /** Optional for appenders that can operate on an existing explicit transcript target. */
    sessionId?: string;
};
export type SessionEntrySummary = {
    /** Persisted key for the entry. */
    sessionKey: string;
    /** Entry value cloned from the backing store unless the caller requested borrowed reads. */
    entry: SessionEntry;
};
/** Raw transcript record for non-message events; message records use appendTranscriptMessage. */
export type TranscriptEvent = unknown;
export type TranscriptMessageAppendOptions<TMessage> = {
    /** Runtime config used for message redaction and transcript header metadata. */
    config?: OpenClawConfig;
    /** Working directory recorded in a newly created transcript header. */
    cwd?: string;
    /** How duplicate message idempotency keys are detected before append. */
    idempotencyLookup?: "scan" | "caller-checked";
    /** Provider/channel message payload to persist. */
    message: TMessage;
    /** Testable timestamp override for the generated transcript entry. */
    now?: number;
    /** Optional finalizer that runs after duplicate detection but before persistence. */
    prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined;
    /** Allow append without parent-link migration for large legacy linear transcripts. */
    useRawWhenLinear?: boolean;
};
export type TranscriptMessageAppendResult<TMessage> = {
    /** False when idempotency lookup found an existing transcript message. */
    appended: boolean;
    /** Redacted message payload as persisted or replayed from the transcript. */
    message: TMessage;
    /** Existing or newly generated transcript message id. */
    messageId: string;
};
/** Transcript update fields supplied by callers; sessionFile is resolved here. */
export type TranscriptUpdatePayload = Omit<SessionTranscriptUpdate, "sessionFile">;
export type SessionTranscriptTurnUpdateMode = "inline" | "file-only" | "none";
export type SessionTranscriptTurnMessageAppend = TranscriptMessageAppendOptions<unknown> & {
    /**
     * Runs inside the file-backed write lock before this message is appended.
     * SQLite implementation note: duplicate/skip decisions should be evaluated
     * inside the same write transaction as the transcript row append.
     */
    shouldAppend?: (context: SessionTranscriptTurnWriteContext) => Promise<boolean> | boolean;
};
export type SessionTranscriptTurnWriteContext = {
    agentId?: string;
    sessionFile: string;
    sessionId?: string;
    sessionKey?: string;
};
export type SessionTranscriptTurnPersistOptions = {
    /** Runtime config used for lock settings, redaction, and header metadata. */
    config?: OpenClawConfig;
    /** Working directory recorded in a newly created transcript header. */
    cwd?: string;
    /**
     * Rejects the turn when the persisted session key no longer points at this
     * runtime session id. SQLite implementations must evaluate this guard inside
     * the same write transaction as the transcript append and metadata touch.
     */
    expectedSessionId?: string;
    /** Message rows to append under one transcript write lock. */
    messages: readonly SessionTranscriptTurnMessageAppend[];
    /** Controls whether the update event includes the last appended message. */
    updateMode?: SessionTranscriptTurnUpdateMode;
    /** Emit file-only updates even when every candidate message was skipped. */
    publishWhen?: "always" | "when-appended";
    /**
     * Touch updatedAt/sessionFile metadata after appending.
     * SQLite implementation note: transcript row append(s) plus this session
     * metadata touch should be one SQLite write transaction; publish happens
     * after that transaction commits.
     */
    touchSessionEntry?: boolean;
};
export type SessionTranscriptTurnPersistResult = {
    appendedCount: number;
    messages: TranscriptMessageAppendResult<unknown>[];
    rejectedReason?: "session-rebound";
    sessionEntry: SessionEntry | undefined;
    sessionFile: string;
};
export type SessionTranscriptRuntimeTarget = {
    agentId: string;
    sessionFile: string;
    sessionId: string;
    sessionKey: string;
};
export type SessionTranscriptManualTrimResult = {
    compacted: false;
    reason: "no transcript";
} | {
    compacted: false;
    kept: number;
} | {
    archived: string;
    compacted: true;
    kept: number;
};
export type SessionTranscriptManualTrimPreflightResult = Extract<SessionTranscriptManualTrimResult, {
    compacted: false;
}> | {
    compacted: true;
};
export type SessionEntryUpdateOptions = {
    /** Skip prune/cap/rotation maintenance for specialized internal updates. */
    skipMaintenance?: boolean;
    /** Let the writer cache retain the updated object without cloning. */
    takeCacheOwnership?: boolean;
    /** Throw when best-effort store recovery cannot confirm the requested write. */
    requireWriteSuccess?: boolean;
};
export type SessionAbortTargetCutoff = {
    messageSid?: string;
    timestamp?: number;
};
export type SessionAbortTargetContext = {
    entry: SessionEntry;
    sessionKey: string;
};
export type SessionAbortTargetIdentity = SessionAbortTargetContext & {
    sessionId?: string;
};
export type SessionAbortTargetResult = SessionAbortTargetIdentity & {
    persisted: boolean;
    persistenceError?: string;
};
export type SessionLifecycleTranscriptInfo = {
    sessionFile?: string;
    transcriptArchived?: boolean;
};
export type SessionLifecycleRolloverResult = {
    previousSessionTranscript: SessionLifecycleTranscriptInfo;
    sessionEntry: SessionEntry;
};
export type ReplySessionInitializationSnapshot = {
    currentEntry?: SessionEntry;
    readEntry: (sessionKey: string) => SessionEntry | undefined;
    revision: string;
};
export type ReplySessionInitializationCommitContext = {
    currentEntry?: SessionEntry;
    readEntry: (sessionKey: string) => SessionEntry | undefined;
    sessionEntry: SessionEntry;
};
export type ReplySessionInitializationCommitResult = {
    ok: true;
    previousSessionTranscript: SessionLifecycleTranscriptInfo;
    sessionEntry: SessionEntry;
    sessionStoreView: Record<string, SessionEntry>;
} | {
    ok: false;
    currentEntry?: SessionEntry;
    reason: "stale-snapshot";
    revision: string;
};
type SessionEntryRetirement = {
    entry: SessionEntry;
    key: string;
};
export type SessionEntryPatchOptions = {
    /** Entry to synthesize when a patch operation is allowed to create. */
    fallbackEntry?: SessionEntry;
    /** Fully resolved maintenance settings when the caller already has config loaded. */
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    /** Keep the previous updatedAt value when the patch should not count as activity. */
    preserveActivity?: boolean;
    /** Throw when best-effort store recovery cannot confirm the requested write. */
    requireWriteSuccess?: boolean;
    /** Replace the whole entry instead of merging the returned patch. */
    replaceEntry?: boolean;
    /** Skip prune/cap/rotation maintenance for specialized internal updates. */
    skipMaintenance?: boolean;
    /** Let the writer cache retain the updated object without cloning. */
    takeCacheOwnership?: boolean;
};
export type SessionEntryPatchContext = {
    /** Present when the patched entry already existed before fallback synthesis. */
    existingEntry?: SessionEntry;
};
export type SessionEntryPatchResult = {
    /** Exact persisted key for the patched entry after alias normalization. */
    sessionKey: string;
    /** Persisted entry returned by the backing store. */
    entry: SessionEntry;
};
export type RestartRecoveryLifecycleEntry = {
    /** Exact persisted key for the restart recovery candidate row. */
    sessionKey: string;
    /** Detached entry snapshot; mutating it does not persist unless returned as a replacement. */
    entry: SessionEntry;
};
export type RestartRecoveryLifecycleReplacement = {
    /** Exact persisted key to replace. Missing keys are ignored. */
    sessionKey: string;
    /** Full replacement row to persist for this restart recovery lifecycle step. */
    entry: SessionEntry;
};
export type RestartRecoveryLifecycleUpdate<T> = {
    /** Caller-owned result returned after replacements are persisted. */
    result: T;
    /** Exact rows to replace inside the storage transaction. */
    replacements?: Iterable<RestartRecoveryLifecycleReplacement>;
};
export type SessionEntryCreateWithTranscriptContext = {
    /** Current entry under the requested key before creation, if any. */
    existingEntry?: SessionEntry;
    /** Current entries snapshot for validation rules such as label uniqueness. */
    sessionEntries: Record<string, SessionEntry>;
};
export type SessionEntryCreateWithTranscriptResult<TError = string> = {
    ok: true;
    entry: SessionEntry;
    sessionFile: string;
} | {
    ok: false;
    error: TError;
    phase: "entry";
} | {
    ok: false;
    error: string;
    phase: "transcript";
};
export type SessionEntryCreateWithTranscriptPrepareResult<TError = string> = {
    ok: true;
    entry: SessionEntry;
} | {
    ok: false;
    error: TError;
};
export type SessionPatchProjectionContext = SessionEntryPatchProjectionContext;
export type SessionPatchProjectionFailure = SessionEntryPatchProjectionFailure;
export type SessionPatchProjectionResult<TFailure extends SessionPatchProjectionFailure> = SessionEntryPatchProjectionResult<TFailure>;
export type SessionPatchProjectionSnapshot = SessionEntryPatchProjectionSnapshot;
export type SessionPatchProjectionTarget = SessionEntryPatchProjectionTarget;
export type { DeleteSessionEntryLifecycleResult, ResetSessionEntryLifecycleResult, SessionLifecycleArchivedTranscript, SessionLifecycleArtifactCleanupParams, SessionLifecycleArtifactCleanupResult, SessionLifecycleStoreTarget, };
export type { DeletedAgentSessionEntryPurgeParams, SessionArchivedTranscriptCleanupRule, SessionEntryLifecycleMutationResult, SessionEntryLifecycleRemoval, SessionEntryLifecycleUpsert, };
export type ResetSessionEntryLifecycleParams = {
    /** Runs after the persisted entry rotates and before transcript artifacts move. */
    afterEntryMutation?: (mutation: ResetSessionEntryLifecycleMutation) => Promise<void> | void;
    /** Agent owner used to resolve backend transcript artifacts. */
    agentId?: string;
    /** Builds the persisted replacement entry from the current backend row. */
    buildNextEntry: (context: {
        currentEntry?: SessionEntry;
        primaryKey: string;
    }) => Promise<SessionEntry> | SessionEntry;
    /** Explicit store target for file-backed stores and SQLite migration adapters. */
    storePath: string;
    /** Canonical key plus aliases that identify the logical entry. */
    target: SessionLifecycleStoreTarget;
};
export type DeleteSessionEntryLifecycleParams = {
    /** Agent owner used to resolve backend transcript artifacts. */
    agentId?: string;
    /** Whether transcript artifacts should be archived/deleted with the entry. */
    archiveTranscript: boolean;
    /** Explicit store target for file-backed stores and SQLite migration adapters. */
    storePath: string;
    /** Canonical key plus aliases that identify the logical entry. */
    target: SessionLifecycleStoreTarget;
};
export type CanonicalizeSessionEntryAliasesResult = {
    canonicalKey: string;
    entry?: SessionEntry;
};
export { clearPluginOwnedSessionState };
/**
 * Resolves a logical session key to the freshest matching entry across the
 * configured store and discovered same-agent stores.
 */
export declare function resolveSessionEntryAccessTarget(scope: LogicalSessionAccessScope): ResolvedSessionEntryAccessTarget;
/**
 * Mutates the freshest matching logical session entry without exposing the
 * backing store map to callers.
 */
export declare function updateResolvedSessionEntry<T>(scope: LogicalSessionAccessScope, update: (entry: SessionEntry, context: ResolvedSessionEntryUpdateContext) => Promise<T> | T): Promise<ResolvedSessionEntryUpdateResult<T>>;
/** Returns the entry for a canonical or alias session key, if one exists. */
export declare function loadSessionEntry(scope: SessionAccessScope): SessionEntry | undefined;
/** Lists entries from the resolved store, preserving the persisted key for each row. */
export declare function listSessionEntries(scope?: Partial<Omit<SessionAccessScope, "sessionKey">>): SessionEntrySummary[];
/** Reads the last activity timestamp for one session entry, or undefined when absent. */
export declare function readSessionUpdatedAt(scope: SessionAccessScope): number | undefined;
/** Creates or updates one entry from a partial patch and returns the persisted entry. */
export declare function upsertSessionEntry(scope: SessionAccessScope, patch: Partial<SessionEntry>): Promise<SessionEntry | null>;
/** Replaces one entry with the supplied value and returns the persisted entry. */
export declare function replaceSessionEntry(scope: SessionAccessScope, entry: SessionEntry): Promise<SessionEntry | null>;
/**
 * Applies an atomic patch to one entry.
 * The updater sees the current entry plus whether it was synthesized from a
 * fallback; returning null skips persistence.
 */
export declare function patchSessionEntry(scope: SessionAccessScope, update: (entry: SessionEntry, context: SessionEntryPatchContext) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null, options?: SessionEntryPatchOptions): Promise<SessionEntry | null>;
/**
 * Applies an atomic patch and returns the persisted key selected by the backing
 * store. Use when a caller must keep sidecar state keyed to the final row.
 */
export declare function patchSessionEntryWithKey(scope: SessionAccessScope, update: (entry: SessionEntry, context: SessionEntryPatchContext) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null, options?: SessionEntryPatchOptions): Promise<SessionEntryPatchResult | null>;
/**
 * Promotes the freshest alias row to the canonical key, prunes legacy aliases,
 * and optionally patches the canonical entry under one accessor operation.
 */
export declare function canonicalizeSessionEntryAliases(params: {
    storePath: string;
    target: SessionLifecycleStoreTarget;
    update?: (entry: SessionEntry | undefined) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
}): Promise<CanonicalizeSessionEntryAliasesResult>;
/**
 * Creates or updates one session entry and initializes its transcript header as
 * one storage-sized lifecycle operation. File-backed storage still writes JSON
 * plus JSONL, but callers no longer compose entry write, header creation,
 * rollback, and normalized sessionFile persistence themselves.
 */
export declare function createSessionEntryWithTranscript<TError = string>(scope: SessionAccessScope, createEntry: (context: SessionEntryCreateWithTranscriptContext) => Promise<SessionEntryCreateWithTranscriptPrepareResult<TError>> | SessionEntryCreateWithTranscriptPrepareResult<TError>): Promise<SessionEntryCreateWithTranscriptResult<TError>>;
/** Updates an existing entry only; returns null when the session is absent. */
export declare function updateSessionEntry(scope: SessionAccessScope, update: (entry: SessionEntry) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null, options?: SessionEntryUpdateOptions): Promise<SessionEntry | null>;
/** Resolves one abort target identity without exposing the mutable store. */
export declare function resolveSessionAbortTarget(scope: SessionAccessScope): SessionAbortTargetIdentity | null;
/**
 * Resolves, marks, touches, and canonicalizes one abort target entry as a
 * storage-sized operation. Runtime abort side effects remain with callers.
 */
export declare function markSessionAbortTarget(params: {
    resolveAbortCutoff?: (context: SessionAbortTargetContext) => SessionAbortTargetCutoff | undefined;
    scope: SessionAccessScope;
    now?: () => number;
}): Promise<SessionAbortTargetResult | null>;
/**
 * Applies a session patch projection through the accessor boundary.
 * The resolver sees a read-only snapshot and names the persisted key set; the
 * projector returns one replacement entry without receiving the mutable store.
 */
export declare function applySessionPatchProjection<TFailure extends SessionPatchProjectionFailure>(params: {
    storePath: string;
    resolveTarget: (snapshot: SessionPatchProjectionSnapshot) => SessionPatchProjectionTarget;
    project: (context: SessionPatchProjectionContext) => Promise<SessionPatchProjectionResult<TFailure>> | SessionPatchProjectionResult<TFailure>;
}): Promise<SessionPatchProjectionResult<TFailure>>;
/**
 * Applies restart-recovery lifecycle replacements without exposing the backing
 * store shape. The file backend runs selection and replacement under one writer
 * lock; the SQLite backend can map the same callback to a transaction.
 */
export declare function applyRestartRecoveryLifecycle<T>(params: {
    storePath: string;
    update: (entries: RestartRecoveryLifecycleEntry[]) => Promise<RestartRecoveryLifecycleUpdate<T>> | RestartRecoveryLifecycleUpdate<T>;
    requireWriteSuccess?: boolean;
    skipMaintenance?: boolean;
}): Promise<T>;
/** Removes entries and orphan transcript artifacts owned by a named session lifecycle. */
export declare function cleanupSessionLifecycleArtifacts(params: SessionLifecycleArtifactCleanupParams): Promise<SessionLifecycleArtifactCleanupResult>;
/** Resets one persisted session entry and transitions its transcript state. */
export declare function resetSessionEntryLifecycle(params: ResetSessionEntryLifecycleParams): Promise<ResetSessionEntryLifecycleResult>;
/** Deletes one persisted session entry and transitions its transcript state. */
export declare function deleteSessionEntryLifecycle(params: DeleteSessionEntryLifecycleParams): Promise<DeleteSessionEntryLifecycleResult>;
/** Applies exact entry lifecycle mutations and artifact cleanup at the storage boundary. */
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
/** Purges session entries owned by a deleted agent at the storage boundary. */
export declare function purgeDeletedAgentSessionEntries(params: DeletedAgentSessionEntryPurgeParams): Promise<SessionEntryLifecycleMutationResult>;
/**
 * Clears plugin host-owned state inside one resolved session store.
 * This is an internal transaction-sized boundary for the storage backend, not
 * a Plugin SDK API.
 */
export declare function cleanupPluginHostSessionStore(params: PluginHostSessionCleanupStoreParams): Promise<number>;
/**
 * Persists a runner-driven reset rotation together with transcript replay and
 * optional cleanup. File storage performs these steps sequentially; database
 * backends implement this operation as one lifecycle transaction.
 */
export declare function persistSessionResetLifecycle(params: {
    agentId?: string;
    cleanupPreviousTranscript?: boolean;
    nextEntry: SessionEntry;
    nextSessionFile: string;
    previousEntry: SessionEntry;
    previousSessionId?: string;
    sessionKey: string;
    storePath: string;
}): Promise<{
    replayedMessages: number;
}>;
/**
 * Persists a reply session rollover and returns stable previous-transcript
 * data for lifecycle hooks. Non-storage runtime cleanup remains with callers.
 */
export declare function persistSessionRolloverLifecycle(params: {
    activeSessionKey: string;
    agentId: string;
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    onArchiveError?: (error: unknown, sourcePath: string) => void;
    onMaintenanceWarning?: (warning: SessionMaintenanceWarning) => void | Promise<void>;
    previousEntry?: SessionEntry;
    retiredEntry?: SessionEntryRetirement;
    sessionEntry: SessionEntry;
    sessionKey: string;
    storePath: string;
}): Promise<SessionLifecycleRolloverResult>;
/** Loads the reply-session initialization rows without exposing a mutable store. */
export declare function loadReplySessionInitializationSnapshot(params: {
    storePath: string;
    sessionKey: string;
}): ReplySessionInitializationSnapshot;
/**
 * Persists one reply-session initialization result and archives the previous
 * transcript after metadata commits. SQLite adapters map the guarded write to a
 * transaction and keep archive failure warning-only, matching file storage.
 */
export declare function commitReplySessionInitialization(params: {
    activeSessionKey: string;
    agentId: string;
    expectedRevision: string;
    fallbackSessionFile?: string;
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    onArchiveError?: (error: unknown, sourcePath: string) => void;
    onMaintenanceWarning?: (warning: SessionMaintenanceWarning) => void | Promise<void>;
    prepareSessionEntry?: (context: ReplySessionInitializationCommitContext) => Promise<SessionEntry> | SessionEntry;
    previousEntry?: SessionEntry;
    retiredEntry?: SessionEntryRetirement;
    sessionEntry: SessionEntry;
    sessionKey: string;
    storePath: string;
}): Promise<ReplySessionInitializationCommitResult>;
/**
 * Appends a non-message transcript record such as session or metadata events.
 * Message records must use appendTranscriptMessage so parent links, idempotency,
 * and redaction are preserved.
 */
export declare function appendTranscriptEvent(scope: SessionTranscriptAccessScope, event: TranscriptEvent): Promise<void>;
/**
 * Appends one transcript message with message-id generation and optional
 * idempotency lookup. The returned message is the redacted persisted value.
 */
export declare function appendTranscriptMessage<TMessage>(scope: SessionTranscriptWriteScope, options: TranscriptMessageAppendOptions<TMessage> & {
    prepareMessageAfterIdempotencyCheck: (message: TMessage) => TMessage | undefined;
}): Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
export declare function appendTranscriptMessage<TMessage>(scope: SessionTranscriptWriteScope, options: TranscriptMessageAppendOptions<TMessage>): Promise<TranscriptMessageAppendResult<TMessage>>;
/** Emits a transcript update after resolving the current transcript target. */
export declare function publishTranscriptUpdate(scope: SessionTranscriptWriteScope, update?: TranscriptUpdatePayload): Promise<void>;
/**
 * Trims a transcript for manual sessions.compact and clears stale token metadata.
 * This is one storage-sized mutation: future stores can trim transcript rows and
 * update entry metadata inside the same backend transaction.
 */
export declare function preflightSessionTranscriptForManualCompact(scope: SessionTranscriptRuntimeScope, params: {
    maxLines: number;
    sessionFile?: string;
}): Promise<SessionTranscriptManualTrimPreflightResult>;
export declare function trimSessionTranscriptForManualCompact(scope: SessionTranscriptRuntimeScope, params: {
    maxLines: number;
    nowMs?: number;
    sessionFile?: string;
}): Promise<SessionTranscriptManualTrimResult>;
/**
 * Persists one logical transcript turn through the current file-backed writer.
 * The file implementation resolves/rebinds the transcript file, holds one
 * session write lock across all message appends, optionally touches session
 * metadata, then publishes after the write has completed.
 *
 * SQLite implementation note: the transcript row append(s), sessionFile marker,
 * and requested updatedAt touch become one SQLite write transaction; transcript
 * update delivery must run only after commit.
 */
export declare function persistSessionTranscriptTurn(scope: SessionTranscriptWriteScope & {
    sessionEntry?: SessionEntry;
    sessionStore?: Record<string, SessionEntry>;
}, options: SessionTranscriptTurnPersistOptions): Promise<SessionTranscriptTurnPersistResult>;
/**
 * Resolves the current file-backed target for a storage-neutral runtime
 * transcript scope. Callers use the scope as identity; sessionFile is returned
 * only for current file-backed implementation details such as locks/events.
 */
export declare function resolveSessionTranscriptRuntimeTarget(scope: SessionTranscriptRuntimeScope): Promise<SessionTranscriptRuntimeTarget>;
/**
 * Resolves the file-backed runtime transcript target for read/delete probes
 * without persisting missing sessionFile metadata into the session store.
 */
export declare function resolveSessionTranscriptRuntimeReadTarget(scope: SessionTranscriptRuntimeScope): Promise<SessionTranscriptRuntimeTarget>;
/**
 * Resolves the current file-backed target for read-only transcript callers.
 * Unlike writer/runtime resolution, this does not persist missing sessionFile
 * metadata; reader projections must not mutate session metadata.
 */
export declare function resolveSessionTranscriptReadTarget(scope: SessionTranscriptReadScope): SessionTranscriptReadTarget;
