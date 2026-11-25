type MemorySource = "memory" | "sessions";
type MemoryOriginClass = "owner" | "agent" | "untrusted" | "system";
type MemorySessionKind = "interactive" | "cron" | "heartbeat" | "subagent" | "unknown";
/** Additional memory root, optionally narrowed by a root-relative glob. */
type MemoryExtraPath = string | {
  path: string;
  pattern?: string;
  /** Keep matching reference files out of mtime-based temporal decay. */
  evergreen?: boolean;
};
type MemoryEntryProvenance = {
  originClass: MemoryOriginClass;
  sessionKind: MemorySessionKind;
  observedAt: number;
  supersedesKey?: string;
};
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
type MemoryCliSearchResult = {
  results: MemorySearchResult[];
  stale?: true;
  warning?: string;
  action?: string;
};
/** Indexed-memory search response shared by the Gateway and browser presentation. */
type MemorySearchResponse = MemoryCliSearchResult & {
  agentId: string;
  provider: string;
  searchMode: "hybrid" | "fts-only";
};
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
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
type LegacyMemoryReadResult = Omit<MemoryReadSuccessResult, "status"> & {
  status?: never;
};
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
export { MemoryExtraPath as a, MemoryReadResult as c, MemorySearchRuntimeDebug as d, MemorySessionKind as f, MemorySyncProgressUpdate as h, MemoryEntryProvenance as i, MemorySearchResponse as l, MemorySyncParams as m, MemoryCliSearchResult as n, MemoryOriginClass as o, MemorySource as p, MemoryEmbeddingProbeResult as r, MemoryProviderStatus as s, LegacyMemoryReadResult as t, MemorySearchResult as u };