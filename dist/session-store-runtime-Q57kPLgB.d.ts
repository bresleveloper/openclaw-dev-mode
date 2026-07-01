import { o as SessionEntry } from "./types-DP8esrTo.js";
import { l as ResolvedSessionMaintenanceConfig, s as loadSessionStore$1 } from "./store-D2lD_QnZ.js";
//#region src/plugin-sdk/session-store-runtime.d.ts
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
declare const loadSessionStore: typeof loadSessionStore$1;
/** Loads one session entry by agent/session identity. */
declare function getSessionEntry(params: SessionStoreReadParams): SessionEntry | undefined;
/** Lists session entries for one agent. */
declare function listSessionEntries(params?: SessionStoreListParams): SessionStoreEntrySummary[];
/** Patches one session entry by agent/session identity. */
declare function patchSessionEntry(params: PatchSessionEntryParams): Promise<SessionEntry | null>;
/** Reads the last activity timestamp for one session entry. */
declare function readSessionUpdatedAt(params: ReadSessionUpdatedAtParams): number | undefined;
/** Updates an existing session entry by store path and session key. */
declare function updateSessionStoreEntry(params: UpdateSessionStoreEntryParams): Promise<SessionEntry | null>;
/** Replaces or creates one session entry by agent/session identity. */
declare function upsertSessionEntry(params: UpsertSessionEntryParams): Promise<void>;
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
declare function cleanupSessionLifecycleArtifacts(params: SessionLifecycleArtifactsCleanupParams): Promise<SessionLifecycleArtifactsCleanupResult>;
//#endregion
export { patchSessionEntry as a, upsertSessionEntry as c, loadSessionStore as i, getSessionEntry as n, readSessionUpdatedAt as o, listSessionEntries as r, updateSessionStoreEntry as s, cleanupSessionLifecycleArtifacts as t };