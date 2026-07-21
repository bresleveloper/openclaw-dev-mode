import { s as SessionEntry, t as AmbientTranscriptWatermark } from "./types-r7E6AIEo.js";
import { a as loadSessionStore$1, c as ResolvedSessionMaintenanceConfigInput } from "./store-CuBpdzxZ.js";
//#region src/config/sessions/ambient-transcript-watermark.d.ts
type AmbientTranscriptWatermarkScope = {
  channel: string;
  accountId?: string;
  conversationId: string;
  threadId?: string | number;
};
declare function resolveAmbientTranscriptWatermarkKey(scope: AmbientTranscriptWatermarkScope): string;
declare function updateAmbientTranscriptWatermark(params: {
  storePath: string;
  sessionKey: string;
  key: string;
  messageId: string;
  timestampMs?: number;
  expectedSessionId?: string;
}): Promise<SessionEntry | null>;
//#endregion
//#region src/plugin-sdk/session-store-runtime.d.ts
type SessionStoreReadParams = {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  readConsistency?: "latest";
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
  maintenanceConfig?: ResolvedSessionMaintenanceConfigInput;
  preserveActivity?: boolean;
  replaceEntry?: boolean;
  update: SessionStoreEntryPatch;
};
type ReadAmbientTranscriptWatermarkParams = SessionStoreReadParams & {
  key: string;
};
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
declare function readSessionUpdatedAt(params: SessionStoreReadParams): number | undefined;
declare function readAmbientTranscriptWatermark(params: ReadAmbientTranscriptWatermarkParams): AmbientTranscriptWatermark | undefined;
/** Updates an existing session entry by store path and session key. */
declare function updateSessionStoreEntry(params: UpdateSessionStoreEntryParams): Promise<SessionEntry | null>;
/** Replaces or creates one session entry by agent/session identity. */
declare function upsertSessionEntry(params: UpsertSessionEntryParams): Promise<void>;
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
declare function cleanupSessionLifecycleArtifacts(params: SessionLifecycleArtifactsCleanupParams): Promise<SessionLifecycleArtifactsCleanupResult>;
//#endregion
export { patchSessionEntry as a, updateSessionStoreEntry as c, resolveAmbientTranscriptWatermarkKey as d, updateAmbientTranscriptWatermark as f, loadSessionStore as i, upsertSessionEntry as l, getSessionEntry as n, readAmbientTranscriptWatermark as o, listSessionEntries as r, readSessionUpdatedAt as s, cleanupSessionLifecycleArtifacts as t, AmbientTranscriptWatermarkScope as u };