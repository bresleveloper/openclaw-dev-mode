import { r as FileLockOptions } from "../file-lock-xrL5_hu3.js";
//#region src/plugin-sdk/persistent-dedupe.types.d.ts
type PersistentDedupeEntry = {
  key: string;
  seenAt: number;
};
type PersistentDedupeLegacyJsonImportEntry = {
  key: string;
  value: PersistentDedupeEntry;
  ttlMs?: number;
};
type PersistentDedupeBaseOptions = {
  /** Milliseconds a recorded key remains recent; `0` keeps keys until cache pruning. */
  ttlMs: number;
  /** Maximum process-local cache entries used before consulting SQLite. */
  memoryMaxSize: number;
  onDiskError?: (error: unknown) => void;
};
/** Configuration for a SQLite plugin-state dedupe namespace cache. */
type PersistentDedupePluginStateOptions = PersistentDedupeBaseOptions & {
  /** Plugin id that owns the persisted dedupe namespace. */
  pluginId: string;
  /** Prefix for persisted plugin-state namespaces; defaults to `persistent-dedupe`. */
  namespacePrefix?: string;
  /** Maximum persisted entries retained per namespace. */
  stateMaxEntries: number;
  /** Test/runtime env used to resolve the shared OpenClaw state database. */
  env?: NodeJS.ProcessEnv;
  resolveFilePath?: undefined;
  fileMaxEntries?: undefined;
  lockOptions?: undefined;
};
/** Legacy path-shaped configuration. Paths now name SQLite namespaces, not JSON files. */
type PersistentDedupeLegacyPathOptions = PersistentDedupeBaseOptions & {
  pluginId?: undefined;
  stateMaxEntries?: undefined;
  namespacePrefix?: undefined;
  /** Maximum persisted entries retained per legacy namespace. */
  fileMaxEntries: number;
  /** Maps a namespace to the retired JSON path; used only to derive a stable SQLite namespace. */
  resolveFilePath: (namespace: string) => string;
  /** Test/runtime env used to resolve the shared OpenClaw state database. */
  env?: NodeJS.ProcessEnv;
  /** @deprecated File locks are ignored because persistence is SQLite-backed. */
  lockOptions?: Partial<FileLockOptions>;
};
/** Configuration for a persisted dedupe namespace cache. */
type PersistentDedupeOptions = PersistentDedupePluginStateOptions | PersistentDedupeLegacyPathOptions;
/** Per-call options used when checking or recording a dedupe key. */
type PersistentDedupeCheckOptions = {
  /** Logical bucket for the key; omitted/blank values use `global`. */
  namespace?: string;
  /** Test or replay timestamp override used for TTL checks and writes. */
  now?: number;
  /** Per-call disk error hook, overriding the helper-level hook. */
  onDiskError?: (error: unknown) => void;
};
/** Disk-backed dedupe guard that records recently seen keys per namespace. */
type PersistentDedupe = {
  /** Returns true only when the key was not recently seen and was recorded for future checks. */
  checkAndRecord: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  /** Checks memory/disk recency without recording a new timestamp. */
  hasRecent: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  /** Removes a recorded key from process memory and persisted storage. */
  forget: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  /** Loads recent disk entries into memory for one namespace and returns the loaded count. */
  warmup: (namespace?: string, onError?: (error: unknown) => void) => Promise<number>;
  /** Clears only process-local memory; persisted namespace files are left intact. */
  clearMemory: () => void;
  /** Returns the current process-local cache size. */
  memorySize: () => number;
};
/** Claim attempt result for dedupe flows that need in-flight ownership. */
type ClaimableDedupeClaimResult = {
  kind: "claimed";
} | {
  kind: "duplicate";
} | {
  kind: "inflight";
  pending: Promise<boolean>;
};
/** Options for a claimable dedupe guard, either persistent or memory-only. */
type ClaimableDedupeOptions = PersistentDedupePluginStateOptions | PersistentDedupeLegacyPathOptions | {
  ttlMs: number;
  memoryMaxSize: number;
  pluginId?: undefined;
  stateMaxEntries?: undefined;
  namespacePrefix?: undefined;
  env?: undefined;
  resolveFilePath?: undefined;
  fileMaxEntries?: undefined;
  lockOptions?: undefined;
  onDiskError?: undefined;
};
/** Dedupe guard that lets one caller own a key while others wait or detect duplicates. */
type ClaimableDedupe = {
  /** Starts ownership of a key, reports duplicates, or returns the active claim's pending result. */
  claim: (key: string, options?: PersistentDedupeCheckOptions) => Promise<ClaimableDedupeClaimResult>;
  /** Records a claimed key as handled and resolves any waiters with the recorded result. */
  commit: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  /** Releases an active claim without recording it, rejecting waiters with the supplied error. */
  release: (key: string, options?: {
    namespace?: string;
    error?: unknown;
  }) => void;
  /** Checks whether the key is recent without claiming or committing it. */
  hasRecent: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  /** Removes an active or committed key from memory and persisted storage when supported. */
  forget?: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  /** Warms persistent storage into memory when configured; memory-only guards return zero. */
  warmup: (namespace?: string, onError?: (error: unknown) => void) => Promise<number>;
  /** Clears process-local caches and in-memory persistent state. */
  clearMemory: () => void;
  /** Returns the current process-local cache size. */
  memorySize: () => number;
};
//#endregion
//#region src/plugin-sdk/channel-replay-guard.d.ts
type ReplayKeys = string | readonly (string | null | undefined)[] | null | undefined;
type ChannelReplayCommitOptions = Omit<PersistentDedupeCheckOptions, "namespace">;
type ChannelReplayClaimHandle = {
  readonly keys: readonly [string, ...string[]];
  commit: (options?: ChannelReplayCommitOptions) => Promise<boolean>;
  release: (options?: {
    error?: unknown;
  }) => void;
};
type ChannelReplayClaimResult = {
  kind: "claimed";
  handle: ChannelReplayClaimHandle;
} | {
  kind: "duplicate";
} | {
  kind: "inflight";
  pending: Promise<boolean>;
} | {
  kind: "invalid";
};
type ChannelReplayProcessResult<T> = {
  kind: "processed";
  value: T;
} | {
  kind: "duplicate";
} | {
  kind: "inflight";
  pending: Promise<boolean>;
};
type ChannelReplayErrorMode = "commit" | "release";
type ChannelReplayProcessOptions = {
  dedupe?: PersistentDedupeCheckOptions;
  onError?: ChannelReplayErrorMode | ((error: unknown) => ChannelReplayErrorMode);
};
type ChannelReplayGuardParams<TEvent> = {
  dedupe: ClaimableDedupeOptions;
  buildReplayKey: (event: TEvent) => ReplayKeys;
  namespace?: (event: TEvent) => string | undefined;
};
type ChannelReplayGuard<TEvent> = {
  claim: (event: TEvent, options?: PersistentDedupeCheckOptions) => Promise<ChannelReplayClaimResult>;
  shouldProcess: (event: TEvent, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  processGuarded: <T>(event: TEvent, process: () => Promise<T>, options?: ChannelReplayProcessOptions) => Promise<ChannelReplayProcessResult<T>>;
  hasRecent: (event: TEvent, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  forget: (event: TEvent, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
  warmup: (namespace?: string, onError?: (error: unknown) => void) => Promise<number>;
  clearMemory: () => void;
};
//#endregion
//#region src/plugin-sdk/persistent-dedupe-store.d.ts
export declare function createPersistentDedupeImportEntry(params: {
  key: string;
  seenAt: number;
  ttlMs?: number;
}): PersistentDedupeLegacyJsonImportEntry;
export declare function resolvePersistentDedupePluginStateNamespace(options: {
  namespace: string;
  namespacePrefix?: string;
}): string;
//#endregion
//#region src/plugin-sdk/persistent-dedupe.d.ts
export type PersistentDedupeLegacyJsonMigrationResult = {
  imported: number;
  skippedExpired: number;
  skippedInvalid: number;
  skippedExisting: number;
  removed: boolean;
};
export type PersistentDedupeLegacyJsonMigrationOptions = PersistentDedupePluginStateOptions & {
  filePath: string;
  namespace: string;
  now?: number;
  removeFile?: boolean;
};
export declare function listPersistentDedupeLegacyJsonFileEntries(options: {
  filePath: string;
  ttlMs: number;
  now?: number;
}): Promise<PersistentDedupeLegacyJsonImportEntry[]>;
export declare function shouldReplacePersistentDedupeEntry(params: {
  existingValue: unknown;
  incomingValue: unknown;
}): boolean;
/** Import one retired JSON dedupe cache file into plugin-state SQLite during doctor repair. */
export declare function migratePersistentDedupeLegacyJsonFile(options: PersistentDedupeLegacyJsonMigrationOptions): Promise<PersistentDedupeLegacyJsonMigrationResult>;
/** Create a dedupe helper that combines in-memory fast checks with SQLite-backed state. */
export declare function createPersistentDedupe(options: PersistentDedupeOptions): PersistentDedupe;
type ClaimLoopInflight = {
  kind: "inflight";
  pending: Promise<boolean>;
};
type ClaimLoopSettled = {
  kind: "claimed";
} | {
  kind: "duplicate";
} | {
  kind: "invalid";
};
/** Resolve a claim, waiting on an active owner and retrying only when its release allows it. */
export declare function runClaimableDedupeClaimLoop<TClaim extends ClaimLoopSettled>(claimNext: () => Promise<TClaim | ClaimLoopInflight>, retryAfterRejection: (error: unknown, rejectionCount: number) => boolean): Promise<TClaim | {
  kind: "duplicate";
}>;
/** Create a claim/commit/release dedupe guard backed by memory and optional persistent storage. */
export declare function createClaimableDedupe(options: ClaimableDedupeOptions): ClaimableDedupe & Required<Pick<ClaimableDedupe, "forget">>;
/**
 * Create an event-keyed replay guard whose claims own their settlement handles.
 *
 * Layering contract vs the durable ingress drain (`src/channels/message/ingress-queue.ts`):
 * the drain already rejects duplicate event ids durably — `complete()` tombstones the row
 * and enqueue is `ON CONFLICT DO NOTHING` for the tombstone retention window. A replay
 * guard on a drained channel is justified only when its identity or retention exceeds the
 * queue's: a *logical* message key that differs from the transport delivery id (Telegram:
 * `chat_id:message_id` vs `update_id` — debounce/media-group merges can re-surface a
 * constituent message under a fresh update_id only the guard sees), or a window longer
 * than the channel's tombstone retention. If the guard key would equal the drain event_id
 * and retention fits the tombstone window, delete the guard when adopting the drain.
 */
export declare function createChannelReplayGuard<TEvent>(params: ChannelReplayGuardParams<TEvent>): ChannelReplayGuard<TEvent>;
//#endregion
export type { ChannelReplayClaimHandle, ClaimableDedupe, ClaimableDedupeClaimResult, ClaimableDedupeOptions, PersistentDedupe, PersistentDedupeCheckOptions, PersistentDedupeEntry, PersistentDedupeLegacyJsonImportEntry, PersistentDedupeLegacyPathOptions, PersistentDedupeOptions, PersistentDedupePluginStateOptions };