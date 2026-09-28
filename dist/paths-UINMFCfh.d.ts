//#region packages/memory-host-sdk/src/host/search-deadline-control.d.ts
/**
 * Per-call control channel between a memory-search deadline owner and a nested
 * phase that runs on its own budget. The canonical example is managed
 * local-service acquisition during query embedding: service readiness is owned
 * and bounded by `models.providers.<id>.localService.readyTimeoutMs`, so the
 * whole-search deadline must not consume its budget while the caller waits for
 * a cold service to become ready.
 *
 * The channel is symbol-keyed so it never serializes into tool payloads or
 * provider request bodies and stays invisible to model-facing surfaces.
 */
declare const MEMORY_SEARCH_DEADLINE_CONTROL: unique symbol;
type MemorySearchDeadlineControlAction = "pause" | "resume";
/**
 * Owned phases call `report`; deadline owners `subscribe`.
 *
 * The control owner balances concurrent owned phases: subscribers see "pause"
 * only on the 0→1 transition and "resume" only on the final 1→0 transition, so
 * overlapping owned phases cannot re-arm a budget early. Caller cancellation
 * never passes through this channel; it stays on the AbortSignal.
 */
type MemorySearchDeadlineControl = {
  report: (action: MemorySearchDeadlineControlAction) => void;
  subscribe: (listener: (action: MemorySearchDeadlineControlAction) => void) => () => void;
};
type MemorySearchDeadlineControlOptions = {
  [MEMORY_SEARCH_DEADLINE_CONTROL]?: MemorySearchDeadlineControl;
};
//#endregion
//#region packages/memory-host-sdk/src/host/types.d.ts
type MemorySource = "memory" | "sessions";
type MemoryOriginClass = "owner" | "agent" | "untrusted" | "system";
type MemorySessionKind = "interactive" | "cron" | "heartbeat" | "subagent" | "unknown";
/** Additional memory root, optionally narrowed by a root-relative glob. */
type MemoryExtraPath = string | {
  path: string;
  pattern?: string;
};
type MemoryEntryProvenance = {
  originClass: MemoryOriginClass;
  sessionKind: MemorySessionKind;
  observedAt: number;
  supersedesKey?: string;
};
/** One ranked memory search hit with optional vector/text scoring details. */
type MemorySearchResult = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  snippet: string;
  source: MemorySource;
  importance?: number;
  triggers?: string;
  /** Semicolon-separated stable repository identities lifted from inline annotations. */
  projectKey?: string;
  /** @deprecated Use provenance.originClass. This field is not authoritative for automatic injection. */
  originClass?: string;
  citation?: string;
  provenance?: MemoryEntryProvenance;
};
/** Cached/probed embedding availability status. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
/** Progress event emitted during memory sync. */
type MemorySyncProgressUpdate = {
  completed: number;
  total: number;
  label?: string;
};
type MemorySessionSyncTarget = {
  /** Owning OpenClaw agent. Omit only when the active manager scope already supplies it. */
  agentId?: string;
  /** Storage-neutral transcript/session identity. */
  sessionId: string;
  /** Optional visible session-store key for callers that already carry it. */
  sessionKey?: string;
};
type MemorySyncParams = {
  reason?: string;
  force?: boolean;
  /** Storage-neutral session transcript targets to refresh. */
  sessions?: MemorySessionSyncTarget[];
  /** Archive/support transcript files to refresh without treating paths as active session identity. */
  archiveFiles?: string[];
  progress?: (update: MemorySyncProgressUpdate) => void;
};
type MemorySearchRuntimeDebug = {
  backend: "builtin";
  configuredMode?: string;
  effectiveMode?: string;
  fallback?: string;
  embeddingBootstrap?: {
    ok: false;
    provider: string;
    reason: string;
    degradedTo: "keyword-only";
  };
};
/** Successful memory-file excerpt, optionally paginated/truncated. */
type MemoryReadSuccessResult = {
  status: "ok";
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};
/** An allowed memory path that does not exist. */
type MemoryReadNotFoundResult = {
  status: "not_found";
  text: "";
  path: string;
  truncated?: never;
  from?: never;
  lines?: never;
  nextFrom?: never;
};
type MemoryReadResult = MemoryReadSuccessResult | MemoryReadNotFoundResult;
/** Pre-status result accepted only from registered memory managers during migration. */
type LegacyMemoryReadResult = {
  status?: never;
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};
/** Aggregated memory backend status for CLI/UI diagnostics. */
type MemoryVectorIndexState = {
  state: "empty";
} | {
  state: "complete";
} | {
  state: "incomplete";
} | {
  state: "unverified";
};
type MemoryProviderStatus = {
  backend: "builtin";
  provider: string;
  model?: string;
  requestedProvider?: string;
  files?: number;
  chunks?: number;
  dirty?: boolean;
  /** Process-local failure from the newest admitted sync without a newer successful sync. */
  lastSyncError?: string;
  workspaceDir?: string;
  dbPath?: string;
  /** Explicit diagnostics for the whole shared agent database; payload sizes are not additive. */
  storage?: {
    databaseBytes: number;
    walBytes: number;
    reusableBytes: number;
    embeddingCacheBytes: number;
    embeddingCacheEntries: number;
  };
  extraPaths?: MemoryExtraPath[];
  sources?: MemorySource[];
  sourceCounts?: Array<{
    source: MemorySource;
    files: number;
    chunks: number;
    /** Stored chunk text and JSON embedding bytes, excluding cache and index overhead. */
    chunkBytes?: number;
    eligible?: number | null;
    issues?: string[];
  }>;
  cache?: {
    enabled: boolean;
    entries?: number;
    maxEntries?: number;
  };
  fts?: {
    enabled: boolean;
    available: boolean;
    error?: string;
  };
  fallback?: {
    from: string;
    reason?: string;
  };
  vector?: {
    enabled: boolean;
    index?: MemoryVectorIndexState;
    storeAvailable?: boolean;
    semanticAvailable?: boolean;
    available?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  batch?: {
    enabled: boolean;
    failures: number;
    limit: number;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    lastError?: string;
    lastProvider?: string;
  };
  custom?: Record<string, unknown>;
};
/** Search/read/sync/status contract implemented by memory managers. */
interface MemorySearchManager {
  search(query: string, opts?: {
    maxResults?: number;
    minScore?: number;
    sessionKey?: string;
    /**
     * Keyword/FTS scoring only: skip query embedding and vector search.
     * For reply-path recall (trigger injection) that must not add a
     * network round-trip per inbound message.
     */
    lexicalOnly?: boolean;
    /** Active repository identities used only for project-aware ranking. */
    activeProjectKeys?: string[];
    onDebug?: (debug: MemorySearchRuntimeDebug) => void;
    /**
     * Ranked memory-file keyword candidates bounded by maxResults, available before semantic retrieval completes.
     * Callers must apply the same visibility checks as for final results.
     * Null invalidates a previous snapshot before its provider/index changes.
     */
    onPartialResults?: (results: MemorySearchResult[] | null) => void;
    sources?: MemorySource[];
    /** Optional caller cancellation; managers consume it where their runtime supports cancellation. */
    signal?: AbortSignal;
  } & MemorySearchDeadlineControlOptions): Promise<MemorySearchResult[]>;
  listTriggerCandidates?(opts?: {
    limit?: number;
    activeProjectKeys?: string[];
  }): Promise<MemorySearchResult[]>;
  listCuratedProjectCandidates?(opts: {
    activeProjectKeys: string[];
    limit?: number;
  }): Promise<MemorySearchResult[]>;
  readFile(params: {
    relPath: string;
    from?: number;
    lines?: number;
  }): Promise<MemoryReadResult>;
  status(): MemoryProviderStatus;
  sync?(params?: MemorySyncParams): Promise<void>;
  getCachedEmbeddingAvailability?(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  close?(): Promise<void>;
}
//#endregion
//#region src/sessions/transcript-events.d.ts
/** Storage-neutral identity for the session transcript that changed. */
type SessionTranscriptUpdateTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath?: string;
};
type SessionTranscriptUpdateFields = {
  sessionFile?: string;
  target?: SessionTranscriptUpdateTarget;
  sessionKey?: string;
  agentId?: string;
  sessionId?: string;
  /** Committed lifecycle owner; internal delivery must not expose it publicly. */
  lifecycleRevision?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
  runId?: string;
};
/** Normalized transcript update emitted after a session transcript changes. */
type SessionTranscriptUpdate = Omit<SessionTranscriptUpdateFields, "sessionFile" | "lifecycleRevision" | "target"> & {
  target: Omit<SessionTranscriptUpdateTarget, "storePath">;
};
/** Internal transcript update that may identify a transcript without a file path. */
type InternalSessionTranscriptUpdate = SessionTranscriptUpdateFields;
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
type InternalSessionTranscriptListener = (update: InternalSessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Registers an internal listener for identity-only or file-backed transcript updates. */
declare function onInternalSessionTranscriptUpdate(listener: InternalSessionTranscriptListener): () => void;
//#endregion
//#region src/config/sessions/paths.d.ts
declare function resolveSessionTranscriptsDirForAgent(agentId: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
declare class SessionStoreAgentIdRequiredError extends Error {
  constructor();
}
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
declare function resolveSessionStorePathCore(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
export { onInternalSessionTranscriptUpdate as a, MemoryEntryProvenance as c, MemoryReadResult as d, MemorySearchManager as f, InternalSessionTranscriptUpdate as i, MemoryExtraPath as l, MemorySearchDeadlineControlOptions as m, resolveSessionStorePathCore as n, onSessionTranscriptUpdate as o, MemorySearchResult as p, resolveSessionTranscriptsDirForAgent as r, LegacyMemoryReadResult as s, SessionStoreAgentIdRequiredError as t, MemoryOriginClass as u };