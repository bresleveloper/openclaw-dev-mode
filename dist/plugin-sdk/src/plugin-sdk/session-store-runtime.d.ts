import { loadSessionStore as loadSessionStoreImpl } from "../config/sessions/store-load.js";
import type { ResolvedSessionMaintenanceConfig } from "../config/sessions/store.js";
import type { SessionEntry } from "../config/sessions/types.js";
type SessionStoreReadParams = {
    agentId?: string;
    env?: NodeJS.ProcessEnv;
    hydrateSkillPromptRefs?: boolean;
    sessionKey: string;
    storePath?: string;
};
type SessionStoreListParams = Partial<Omit<SessionStoreReadParams, "sessionKey">>;
type SessionStoreEntrySummary = {
    sessionKey: string;
    entry: SessionEntry;
};
type SessionStoreEntryUpdate = (entry: SessionEntry) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
type SessionStoreEntryPatch = (entry: SessionEntry, context: {
    existingEntry?: SessionEntry;
}) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
type PatchSessionEntryParams = SessionStoreReadParams & {
    fallbackEntry?: SessionEntry;
    maintenanceConfig?: ResolvedSessionMaintenanceConfig;
    preserveActivity?: boolean;
    replaceEntry?: boolean;
    update: SessionStoreEntryPatch;
};
type ReadSessionUpdatedAtParams = SessionStoreReadParams;
type UpdateSessionStoreEntryParams = {
    storePath: string;
    sessionKey: string;
    update: SessionStoreEntryUpdate;
    skipMaintenance?: boolean;
    takeCacheOwnership?: boolean;
    requireWriteSuccess?: boolean;
};
type UpsertSessionEntryParams = SessionStoreReadParams & {
    entry: SessionEntry;
};
type SessionLifecycleArtifactsCleanupParams = {
    agentId?: string;
    archiveRemovedEntryTranscripts?: boolean;
    env?: NodeJS.ProcessEnv;
    orphanTranscriptMinAgeMs: number;
    sessionStore?: string;
    sessionKeySegmentPrefix: string;
    storePath?: string;
    transcriptContentMarker: string;
    nowMs?: number;
};
type SessionLifecycleArtifactsCleanupResult = {
    archivedTranscriptArtifacts: number;
    removedEntries: number;
};
/**
 * @deprecated Use getSessionEntry/listSessionEntries for reads and
 * patchSessionEntry/upsertSessionEntry for writes. This whole-store helper is
 * kept only during the transition before SQLite migration. Callers must
 * migrate away from reading sessions.json directly.
 */
export declare const loadSessionStore: typeof loadSessionStoreImpl;
/** Loads one session entry by agent/session identity. */
export declare function getSessionEntry(params: SessionStoreReadParams): SessionEntry | undefined;
/** Lists session entries for one agent. */
export declare function listSessionEntries(params?: SessionStoreListParams): SessionStoreEntrySummary[];
/** Patches one session entry by agent/session identity. */
export declare function patchSessionEntry(params: PatchSessionEntryParams): Promise<SessionEntry | null>;
/** Reads the last activity timestamp for one session entry. */
export declare function readSessionUpdatedAt(params: ReadSessionUpdatedAtParams): number | undefined;
/** Updates an existing session entry by store path and session key. */
export declare function updateSessionStoreEntry(params: UpdateSessionStoreEntryParams): Promise<SessionEntry | null>;
/** Replaces or creates one session entry by agent/session identity. */
export declare function upsertSessionEntry(params: UpsertSessionEntryParams): Promise<void>;
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
export declare function cleanupSessionLifecycleArtifacts(params: SessionLifecycleArtifactsCleanupParams): Promise<SessionLifecycleArtifactsCleanupResult>;
export { resolveSessionStoreEntry } from "../config/sessions/store-entry.js";
export { resolveSessionTranscriptPathInDir, resolveStorePath } from "../config/sessions/paths.js";
/**
 * @deprecated Use getSessionEntry to read session metadata by agent/session
 * identity instead of resolving transcript file paths. This file-path helper
 * is kept only during the transition before SQLite migration. Callers must
 * migrate away from resolving transcript file paths directly.
 */
export { resolveSessionFilePath } from "../config/sessions/paths.js";
/**
 * @deprecated Use patchSessionEntry/upsertSessionEntry to persist session
 * metadata by agent/session identity. This file-path helper is kept only during
 * the transition before SQLite migration. Callers must migrate away from
 * persisting transcript file paths directly.
 */
export { resolveAndPersistSessionFile } from "../config/sessions/session-file.js";
export { readLatestAssistantTextFromSessionTranscript, readRecentUserAssistantTextForSession, type SessionRecentConversationText, } from "../config/sessions/transcript.js";
export { resolveSessionKey } from "../config/sessions/session-key.js";
export { resolveGroupSessionKey } from "../config/sessions/group.js";
export { canonicalizeMainSessionAlias } from "../config/sessions/main-session.js";
export { clearSessionStoreCacheForTest, recordSessionMetaFromInbound, updateLastRoute, } from "../config/sessions/store.js";
/**
 * @deprecated Use patchSessionEntry/upsertSessionEntry for writes. These
 * whole-store helpers are kept only during the transition before SQLite
 * migration. Callers must migrate away from reading or writing sessions.json.
 */
export { saveSessionStore, updateSessionStore } from "../config/sessions/store.js";
export { evaluateSessionFreshness, resolveChannelResetConfig, resolveSessionResetPolicy, resolveSessionResetType, resolveThreadFlag, } from "../config/sessions/reset.js";
export { resolveSendPolicy } from "../sessions/send-policy.js";
export type { SessionEntry, SessionScope } from "../config/sessions/types.js";
