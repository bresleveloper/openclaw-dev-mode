import { O as SessionMaintenanceMode } from "./types.base-DmKdGokm.js";
import { i as MsgContext } from "./templating-KsALmYhy.js";
import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { a as SessionEntry, n as GroupKeyResolution } from "./types-CmP2mjUp.js";
import { t as DeliveryContext } from "./delivery-context.types-DyNhFIjW.js";
//#region src/config/sessions/disk-budget.d.ts
type SessionDiskBudgetSweepResult = {
  totalBytesBefore: number;
  totalBytesAfter: number;
  removedFiles: number;
  removedEntries: number;
  freedBytes: number;
  maxBytes: number;
  highWaterBytes: number;
  overBudget: boolean;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type SessionMaintenanceWarning = {
  activeSessionKey: string;
  activeUpdatedAt?: number;
  totalEntries: number;
  pruneAfterMs: number;
  maxEntries: number;
  wouldPrune: boolean;
  wouldCap: boolean;
};
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  maxEntries: number;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
//#endregion
//#region src/config/sessions/store-maintenance-operations.d.ts
type SessionMaintenanceApplyReport = {
  mode: ResolvedSessionMaintenanceConfig["mode"];
  beforeCount: number;
  afterCount: number;
  pruned: number;
  capped: number;
  diskBudget: SessionDiskBudgetSweepResult | null;
};
//#endregion
//#region src/config/sessions/store-writer-state.d.ts
/** Clears session store writer queues and cache for tests. */
declare function clearSessionStoreCacheForTest(): void;
//#endregion
//#region src/config/sessions/store-load.d.ts
type LoadSessionStoreOptions = {
  skipCache?: boolean;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
  runMaintenance?: boolean;
  clone?: boolean;
  hydrateSkillPromptRefs?: boolean;
};
declare function loadSessionStore(storePath: string, opts?: LoadSessionStoreOptions): Record<string, SessionEntry>;
//#endregion
//#region src/config/sessions/store-entry.d.ts
declare function resolveSessionStoreEntry(params: {
  store: Record<string, SessionEntry>;
  sessionKey: string;
}): {
  normalizedKey: string;
  existing: SessionEntry | undefined;
  legacyKeys: string[];
};
//#endregion
//#region src/config/sessions/store.d.ts
type SaveSessionStoreOptions = {
  /** Skip pruning, capping, and rotation (e.g. during one-time migrations). */skipMaintenance?: boolean; /** Caller already proved the store serialization is unchanged unless maintenance mutates it. */
  skipSerializeForUnchangedStore?: boolean; /** Internal hot paths can hand writer-owned stores to the cache after persistence. */
  takeCacheOwnership?: boolean; /** Active session key for warn-only maintenance. */
  activeSessionKey?: string; /** Optional callback for warn-only maintenance. */
  onWarn?: (warning: SessionMaintenanceWarning) => void | Promise<void>; /** Optional callback with maintenance stats after a save. */
  onMaintenanceApplied?: (report: SessionMaintenanceApplyReport) => void | Promise<void>; /** Optional overrides used by maintenance commands. */
  maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig>; /** Fully resolved maintenance settings when the caller already has config loaded. */
  maintenanceConfig?: ResolvedSessionMaintenanceConfig; /** Changed top-level entry when a hot path only updated one existing session. */
  singleEntryPersistence?: SingleEntryPersistencePatch; /** Throw when best-effort store recovery cannot confirm the requested write. */
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
declare function saveSessionStore(storePath: string, store: Record<string, SessionEntry>, opts?: SaveSessionStoreOptions): Promise<void>;
declare function updateSessionStore<T>(storePath: string, mutator: (store: Record<string, SessionEntry>) => Promise<T> | T, opts?: UpdateSessionStoreOptions<T>): Promise<T>;
declare function recordSessionMetaFromInbound(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}): Promise<SessionEntry | null>;
declare function updateLastRoute(params: {
  storePath: string;
  sessionKey: string;
  channel?: SessionEntry["lastChannel"];
  to?: string;
  accountId?: string;
  threadId?: string | number;
  route?: SessionEntry["route"];
  deliveryContext?: DeliveryContext;
  ctx?: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}): Promise<SessionEntry | null>;
//#endregion
//#region src/sessions/transcript-events.d.ts
/** Storage-neutral identity for the session transcript that changed. */
type SessionTranscriptUpdateTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
};
type SessionTranscriptUpdateFields = {
  sessionFile?: string;
  target?: SessionTranscriptUpdateTarget;
  sessionKey?: string;
  agentId?: string; /** @deprecated Pre-SQLite compatibility mirror. Prefer `target.sessionId`. */
  sessionId?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
};
/** Normalized transcript update emitted after a session transcript changes. */
type SessionTranscriptUpdate = SessionTranscriptUpdateFields & {
  /** @deprecated File-backed compatibility hint. Prefer `target` for identity. */sessionFile: string;
};
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Emits a normalized transcript update to all registered listeners. */
declare function emitSessionTranscriptUpdate(update: string | SessionTranscriptUpdate): void;
//#endregion
//#region src/config/sessions/session-accessor.d.ts
type TranscriptMessageAppendOptions<TMessage> = {
  /** Runtime config used for message redaction and transcript header metadata. */config?: OpenClawConfig; /** Working directory recorded in a newly created transcript header. */
  cwd?: string; /** How duplicate message idempotency keys are detected before append. */
  idempotencyLookup?: "scan" | "caller-checked"; /** Provider/channel message payload to persist. */
  message: TMessage; /** Testable timestamp override for the generated transcript entry. */
  now?: number; /** Optional finalizer that runs after duplicate detection but before persistence. */
  prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined; /** Allow append without parent-link migration for large legacy linear transcripts. */
  useRawWhenLinear?: boolean;
};
type TranscriptMessageAppendResult<TMessage> = {
  /** False when idempotency lookup found an existing transcript message. */appended: boolean; /** Redacted message payload as persisted or replayed from the transcript. */
  message: TMessage; /** Existing or newly generated transcript message id. */
  messageId: string;
};
/** Transcript update fields supplied by callers; sessionFile is resolved here. */
type TranscriptUpdatePayload = Omit<SessionTranscriptUpdate, "sessionFile">;
//#endregion
//#region src/config/sessions/transcript.d.ts
type SessionTranscriptAppendResult = {
  ok: true;
  sessionFile: string;
  messageId: string;
} | {
  ok: false;
  reason: string;
  code?: "blocked" | "session-rebound";
};
type SessionTranscriptUpdateMode = "inline" | "file-only" | "none";
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
};
type AssistantTranscriptText = {
  id?: string;
  text: string;
  timestamp?: number;
};
type SessionRecentConversationText = {
  id?: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
  sourceChannel?: string;
};
type ReadRecentSessionConversationTextOptions = {
  beforeTimestampMs?: number;
  limit?: number;
  minTimestampMs?: number;
};
type ReadRecentSessionConversationTextParams = ReadRecentSessionConversationTextOptions & {
  agentId?: string;
  sessionKey: string;
  storePath?: string;
};
type LatestAssistantTranscriptText = AssistantTranscriptText;
declare function readRecentUserAssistantTextForSession(params: ReadRecentSessionConversationTextParams): Promise<SessionRecentConversationText[]>;
declare function readLatestAssistantTextFromSessionTranscript(sessionFile: string | undefined): Promise<LatestAssistantTranscriptText | undefined>;
//#endregion
export { resolveSessionStoreEntry as _, SessionTranscriptUpdateMode as a, ResolvedSessionMaintenanceConfig as b, TranscriptMessageAppendOptions as c, emitSessionTranscriptUpdate as d, onSessionTranscriptUpdate as f, updateSessionStore as g, updateLastRoute as h, SessionTranscriptDeliveryMirror as i, TranscriptMessageAppendResult as l, saveSessionStore as m, SessionRecentConversationText as n, readLatestAssistantTextFromSessionTranscript as o, recordSessionMetaFromInbound as p, SessionTranscriptAppendResult as r, readRecentUserAssistantTextForSession as s, LatestAssistantTranscriptText as t, TranscriptUpdatePayload as u, loadSessionStore as v, clearSessionStoreCacheForTest as y };