import { O as SessionMaintenanceMode } from "./types.base-iHeWRS8q.js";
import { i as MsgContext } from "./templating-BpD1cfFX.js";
import { t as DeliveryContext } from "./delivery-context.types-DyNhFIjW.js";
import { n as GroupKeyResolution, o as SessionEntry } from "./types-DP8esrTo.js";

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
declare function updateSessionStoreEntry(params: {
  storePath: string;
  sessionKey: string;
  update: (entry: SessionEntry) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  requireWriteSuccess?: boolean;
}): Promise<SessionEntry | null>;
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
export { updateSessionStoreEntry as a, clearSessionStoreCacheForTest as c, updateSessionStore as i, ResolvedSessionMaintenanceConfig as l, saveSessionStore as n, resolveSessionStoreEntry as o, updateLastRoute as r, loadSessionStore as s, recordSessionMetaFromInbound as t };