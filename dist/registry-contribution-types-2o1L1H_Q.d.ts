import { m as ModelProviderLocalServiceConfig, r as OpenClawConfig, rr as MemoryCitationsMode } from "./types.openclaw-D8uW-XQA.js";
import { _ as JsonSchemaObject } from "./zod-schema.implicit-mentions-C4-S3AOR.js";
import { c as MemoryReadResult, d as MemorySearchRuntimeDebug, m as MemorySyncParams, n as MemoryCliSearchResult, o as MemoryOriginClass, p as MemorySource, r as MemoryEmbeddingProbeResult, s as MemoryProviderStatus, t as LegacyMemoryReadResult, u as MemorySearchResult } from "./types-D2yUynI0.js";
import { u as SecretInput } from "./types.secrets-D_jefub3.js";
import { O as Usage, y as StopReason } from "./types-B1zI2CfC.js";
import { a as AgentMessage } from "./types-Bjy6vVru.js";
import { r as ThinkLevel } from "./thinking.shared-CbDUpGH9.js";
import { t as SessionDiscussionInfo } from "./session-discussion-CE9W2c7K.js";
import "./paths-C-0fLn2q.js";
import { i as EmbeddingProvider, n as EmbeddingBatchOptions, o as EmbeddingProviderIndexIdentity, r as EmbeddingDeadlineControlOptions, s as EmbeddingProviderRuntime, t as EmbeddingBatchChunk } from "./embedding-provider-runtime-types-CuJxbTgC.js";
/** Immutable transcript identity issued by the SQLite append transaction. */
type TranscriptEntryAnchor = Readonly<{
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  generation: string;
  entryId: string;
  rawSeq: number;
  effectiveParentId: string | null;
  activeMessagePosition: number;
  idempotencyKey?: string;
}>;
/** Current user row bound to one recorder-owned logical turn. */
type TranscriptTurnAdmission = TranscriptEntryAnchor & Readonly<{
  logicalTurnId: string;
  role: "user";
}>;
/** Exact accepted transcript range, inclusive of admission and terminal. */
type TranscriptTurnBoundary = Readonly<{
  admission: TranscriptTurnAdmission;
  terminal: TranscriptEntryAnchor;
}>;
type LlmCompleteCaller = {
  kind: "plugin" | "context-engine" | "host" | "unknown";
  id?: string;
  name?: string;
};
type LlmCompleteUsage = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  totalTokens?: number;
  costUsd?: number;
};
type LlmCompleteCommonParams = {
  /** Model ref (e.g. "anthropic/claude-sonnet-4-6"); defaults to the target agent's configured model. */
  model?: string;
  /** Advisory output limit; runtime owners without an equivalent control may ignore it. */
  maxTokens?: number;
  /** Advisory sampling hint; runtime owners without an equivalent control may ignore it. */
  temperature?: number;
  /** Requested reasoning effort; the host normalizes it for the selected model. */
  reasoning?: ThinkLevel;
  systemPrompt?: string;
  signal?: AbortSignal;
  /** Human-readable reason for audit/debug output. */
  purpose?: string;
  /** Agent whose model/credentials to use. Session-bound capabilities may disallow overrides. */
  agentId?: string;
};
type LlmIsolatedAgentRuntimeCompleteParams = LlmCompleteCommonParams & {
  /** Isolated runtimes currently accept one fresh user prompt, not a replayed chat history. */
  messages: [{
    role: "user";
    content: string;
  }];
  /** Advisory final-output schema; isolated runtimes without native support may ignore it. */
  outputSchema?: JsonSchemaObject;
  execution: {
    /**
     * Fresh completion through the configured agent runtime with no supplied tools.
     * Agents API may retain service-owned helpers; it cannot guarantee zero tools.
     */
    mode: "isolated-agent-runtime";
    /** Exact credential owner. Requires host-granted plugin policy. */
    authProfileId?: string;
    timeoutMs?: number;
  };
};
type LlmCompleteParams = (LlmCompleteCommonParams & {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  /** Provider-native constrained-output request. Unsupported transports may ignore it. */
  responseFormat?: Record<string, unknown>;
  /** Fail before dispatch unless the exact selected credential has this host-resolved mode. */
  requiredAuthMode?: "oauth";
  execution?: undefined;
}) | LlmIsolatedAgentRuntimeCompleteParams;
type LlmCompleteResult = {
  text: string;
  provider: string;
  model: string;
  /** Concrete model identity returned by the provider, when available. */
  responseModel?: string;
  /** Provider terminal reason for direct completions, when available. */
  stopReason?: StopReason;
  agentId: string;
  usage: LlmCompleteUsage;
  execution: {
    mode: "direct-provider";
    owner: {
      kind: "provider";
      id: string;
    };
  } | {
    mode: "isolated-agent-runtime";
    owner: {
      kind: "cli" | "harness";
      id: string;
    };
  };
  audit: {
    caller: LlmCompleteCaller;
    purpose?: string;
    sessionKey?: string;
  };
};
type ContextUsage = NonNullable<Usage["contextUsage"]>;
type PromptTokenDetails = {
  cached_tokens?: number;
  cache_write_tokens?: number;
  cache_creation_input_tokens?: number;
};
type UsageTokenFields = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  cacheWrite1h?: number;
  cacheWrite5m?: number;
  cacheTelemetry?: Usage["cacheTelemetry"];
  contextUsage?: ContextUsage;
  usageReport?: Usage["usageReport"];
  reasoningTokens?: number;
  total?: number;
};
type UsageLike = UsageTokenFields & {
  inputTokens?: number;
  outputTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  input_tokens?: number;
  output_tokens?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_creation?: {
    ephemeral_1h_input_tokens?: number;
  };
  reasoning_tokens?: number;
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
  output_tokens_details?: {
    reasoning_tokens?: number;
    thinking_tokens?: number;
  };
  cached_tokens?: number;
  input_tokens_details?: PromptTokenDetails;
  prompt_tokens_details?: PromptTokenDetails;
  cached_input_tokens?: number;
  cache_write_input_tokens?: number;
  cached?: number;
  totalTokens?: number;
  total_tokens?: number;
  cache_read?: number;
  cache_write?: number;
  prompt_n?: number;
  predicted_n?: number;
  timings?: {
    prompt_n?: number;
    predicted_n?: number;
  };
  cost?: Partial<Usage["cost"]>;
};
type NormalizedUsage = UsageTokenFields & {
  cost?: Pick<Usage["cost"], "total" | "totalOrigin"> & Partial<Pick<Usage["cost"], "input" | "output" | "cacheRead" | "cacheWrite">>;
  /** Aggregated candidate prices are authoritative, including zero and unavailable totals. */
  costStatus?: "complete" | "unavailable";
};
declare function normalizeUsage(raw?: UsageLike | null): NormalizedUsage | undefined;
type AssembleResult = {
  /** Ordered messages to use as model context */
  messages: AgentMessage[];
  /** Engine estimate of assembled tokens; does not control host request admission. */
  estimatedTokens: number;
  /**
   * Controls the history included in host token-pressure diagnostics.
   * The returned `messages` remain the model context.
   *
   * - "assembled": diagnostics use the host's assembled prompt estimate.
   * - "preassembly_may_overflow": diagnostics take the maximum of the host's
   *   assembled and pre-assembly (unwindowed) history estimates. This maximum
   *   does not block a fitting outgoing request.
   *
   * Defaults to "assembled". Neither value disables host request admission
   * checks for engines that own compaction.
   */
  promptAuthority?: "assembled" | "preassembly_may_overflow";
  /** Optional context-engine-provided instructions prepended to the runtime system prompt */
  systemPromptAddition?: string;
  /**
   * Optional projection lifecycle for hosts with persistent backend threads.
   *
   * Context engines that return `thread_bootstrap` ask the host to inject the
   * assembled context once for the supplied epoch, then reuse the backend
   * thread until the epoch changes. Engines that omit this field retain the
   * legacy per-turn projection behavior.
   */
  contextProjection?: ContextEngineProjection;
};
type ContextEngineProjection = {
  /** How the assembled context should be projected into the backend runtime. */
  mode: "per_turn" | "thread_bootstrap";
  /** Stable context epoch. Changing this tells persistent backends to rotate. */
  epoch?: string;
  /** Optional diagnostic fingerprint for the projected context payload. */
  fingerprint?: string;
};
type ContextEngineOperation = "agent-run" | "manual-compact" | "subagent-spawn";
type ContextEngineRuntimeMode = "normal" | "fallback" | "degraded";
type ContextEngineSelectionSource = "configured" | "default" | "unknown";
type ContextEngineRuntimeReasonCode = "provider_timeout" | "provider_unavailable" | "rate_limited" | "context_overflow" | "runtime_unavailable" | "unknown";
type ContextEngineHostCapability = "bootstrap" | "assemble-before-prompt" | "after-turn" | "maintain" | "compact" | "runtime-llm-complete" | "thread-bootstrap-projection";
type ContextEngineHostRequirements = {
  /** Host capabilities required before the engine can safely serve this operation. */
  requiredCapabilities: ContextEngineHostCapability[];
  /** Optional engine-authored guidance appended to the host compatibility error. */
  unsupportedMessage?: string;
};
type ContextEngineRuntimeSettings = {
  schemaVersion: 1;
  runtime: {
    host: "openclaw";
    mode: ContextEngineRuntimeMode;
    harnessId: string | null;
    runtimeId: string | null;
  };
  model: {
    requested: string | null;
    resolved: string | null;
    provider: string | null;
    family: string | null;
  };
  contextEngineSelection: {
    selectedId: string | null;
    source: ContextEngineSelectionSource;
  };
  executionHost: {
    id: string | null;
    label: string | null;
  };
  limits: {
    promptTokenBudget: number | null;
    maxOutputTokens: number | null;
  };
  diagnostics: {
    fallbackReason: ContextEngineRuntimeReasonCode | null;
    degradedReason: ContextEngineRuntimeReasonCode | null;
  };
};
type CompactResult = {
  ok: boolean;
  compacted: boolean;
  reason?: string;
  result?: {
    summary?: string;
    firstKeptEntryId?: string;
    tokensBefore: number;
    tokensAfter?: number;
    details?: unknown;
    /** Session id after compaction, when the runtime rotated transcripts. */
    sessionId?: string;
    /** Typed post-compaction live session target; successor when the runtime rotated transcripts. */
    sessionTarget?: ContextEngineSessionTarget;
    /**
     * Raw session file path after compaction.
     *
     * @deprecated Use `sessionTarget`. Shipped plugin-sdk contract: released
     * third-party context engines (v2026.6.x and earlier) report rotated
     * transcripts through this field. Remove once typed session targets are
     * the only successor contract.
     */
    sessionFile?: string;
  };
};
type IngestResult = {
  /** Whether the message was ingested (false if duplicate or no-op) */
  ingested: boolean;
};
type IngestBatchResult = {
  /** Number of messages ingested from the supplied batch */
  ingestedCount: number;
};
type BootstrapResult = {
  /** Whether bootstrap ran and initialized the engine's store */
  bootstrapped: boolean;
  /** Number of historical messages imported (if applicable) */
  importedMessages?: number;
  /** Optional reason when bootstrap was skipped */
  reason?: string;
};
type ContextEngineInfo = {
  id: string;
  name: string;
  version?: string;
  acceptedHostParams?: string[];
  transcriptSemantics?: {
    currentTurnFence?: "before-current-turn-entry-v1";
    turnAdvancementIdempotency?: "atomic-idempotent-v1";
  };
  /**
   * True when the engine manages compaction instead of built-in auto-compaction.
   * The embedded host checks every outgoing provider request, including the first,
   * using matching measured current-run usage plus appended content when available,
   * or a fresh estimate of the actual system prompt, messages, and tools otherwise.
   * The engine's estimatedTokens never controls host request admission.
   */
  ownsCompaction?: boolean;
  /**
   * Controls how turn-triggered maintenance should be executed.
   *
   * Engines remain compatible by default unless the host explicitly opts into
   * background turn maintenance.
   */
  turnMaintenanceMode?: "foreground" | "background";
  /**
   * Host capability requirements for operations where using an unsupported
   * runtime would silently degrade or corrupt the engine's behavior.
   */
  hostRequirements?: Partial<Record<ContextEngineOperation, ContextEngineHostRequirements>>;
};
type SubagentSpawnPreparation = {
  /** Roll back pre-spawn setup when subagent launch fails. */
  rollback: () => void | Promise<void>;
};
type SubagentEndReason = "deleted" | "completed" | "swept" | "released";
type TranscriptRewriteReplacement = {
  /** Existing transcript entry id to replace on the active branch. */
  entryId: string;
  /** Replacement message content for that entry. */
  message: AgentMessage;
};
type TranscriptRewriteRequest = {
  /** Message entry replacements to apply in one branch-and-reappend pass. */
  replacements: TranscriptRewriteReplacement[];
  /** Optional entry-id set that must cover every active-branch entry from the first replacement onward. */
  allowedRewriteSuffixEntryIds?: string[];
};
type TranscriptRewriteResult = {
  /** Whether the active branch changed. */
  changed: boolean;
  /** Estimated bytes removed from the active branch message payloads. */
  bytesFreed: number;
  /** Number of transcript message entries rewritten. */
  rewrittenEntries: number;
  /** Optional reason when no rewrite occurred. */
  reason?: string;
};
type ContextEngineMaintenanceResult = TranscriptRewriteResult;
type ContextEnginePromptCacheRetention = "none" | "short" | "long" | "in_memory" | "24h";
type ContextEnginePromptCacheUsage = Pick<NormalizedUsage, "input" | "output" | "cacheRead" | "cacheWrite" | "contextUsage" | "total">;
type ContextEnginePromptCacheObservationChangeCode = "historyRewrite" | "compaction" | "pruning" | "runtimeContextCarrier" | "aggregateToolResultTruncation" | "cacheRetention" | "model" | "streamStrategy" | "systemPrompt" | "systemPromptSuffix" | "tools" | "transport";
type ContextEnginePromptCacheObservationChange = {
  code: ContextEnginePromptCacheObservationChangeCode;
  detail: string;
};
type ContextEnginePromptCacheObservation = {
  broke: boolean;
  previousCacheRead?: number;
  cacheRead?: number;
  changes?: ContextEnginePromptCacheObservationChange[];
};
type ContextEnginePromptCacheInfo = {
  /** Runtime-resolved retention for the actual provider/model/request path. */
  retention?: ContextEnginePromptCacheRetention;
  /** Usage from the most recent API call, not accumulated retry/tool-loop totals. */
  lastCallUsage?: ContextEnginePromptCacheUsage;
  /** Result from the runtime's prompt-cache observability heuristic. */
  observation?: ContextEnginePromptCacheObservation;
  /** Last known cache-touch timestamp from runtime-managed cache-TTL bookkeeping. */
  lastCacheTouchAt?: number;
  /** Known cache expiry time when the runtime can source it confidently. */
  expiresAt?: number;
};
type ContextEngineTranscriptStorageInfo = {
  /**
   * Authoritative transcript backend for this runtime turn.
   *
   * Hosts may still pass legacy locator fields such as `sessionFile` for older
   * plugin contracts, but context engines should use this field to decide
   * whether that locator is a live transcript source.
   */
  kind: "sqlite";
};
type ContextEngineSessionTarget = {
  /** Agent that owns the session in the runtime store. */
  agentId?: string;
  /** Runtime session id to compact. */
  sessionId?: string;
  /** Stable session key used for aliases, policy, and store resolution. */
  sessionKey?: string;
  /** Session store path that scopes the SQLite-backed runtime session. */
  storePath?: string;
  /** Optional transport thread identity for session target resolution. */
  threadId?: string | number;
};
type ContextEngineRuntimeContext = Record<string, unknown> & {
  /** Runtime task working directory; workspaceDir remains the agent bootstrap workspace. */
  cwd?: string;
  /**
   * True when the host has explicitly opted this maintenance run into
   * consuming deferred compaction debt.
   */
  allowDeferredCompactionExecution?: boolean;
  /** Runtime-resolved context window budget for the active model call. */
  tokenBudget?: number;
  /** Selected agent harness id when compaction delegates back to the runtime. */
  agentHarnessId?: string;
  /** Best-effort current prompt/context token estimate for this turn. */
  currentTokenCount?: number;
  /** Optional prompt-cache telemetry for cache-aware engines. */
  promptCache?: ContextEnginePromptCacheInfo;
  /** Authoritative transcript backend for this turn. */
  transcriptStorage?: ContextEngineTranscriptStorageInfo;
  /** Storage-neutral runtime session target for compaction delegation. */
  sessionTarget?: ContextEngineSessionTarget;
  /**
   * Safe transcript rewrite helper implemented by the runtime.
   *
   * Engines decide what is safe to rewrite; the runtime owns how the session
   * DAG is updated on disk.
   */
  rewriteTranscriptEntries?: (request: TranscriptRewriteRequest) => Promise<TranscriptRewriteResult>;
  /** LLM completion capability for engines that need model inference. */
  llm?: {
    complete: (params: LlmCompleteParams) => Promise<LlmCompleteResult>;
  };
};
/**
 * ContextEngine defines the pluggable contract for context management.
 *
 * Required methods define a generic lifecycle; optional methods allow engines
 * to provide additional capabilities (retrieval, lineage, etc.).
 */
interface ContextEngine {
  /** Engine identifier and metadata */
  readonly info: ContextEngineInfo;
  /**
   * Initialize engine state for a session, optionally importing historical context.
   */
  bootstrap?(params: {
    sessionId: string;
    sessionKey?: string;
    /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<BootstrapResult>;
  /**
   * Run transcript maintenance after bootstrap, successful turns, or compaction.
   *
   * Engines can use runtimeContext.rewriteTranscriptEntries() to request safe
   * branch-and-reappend transcript rewrites without depending on runner internals.
   */
  maintain?(params: {
    sessionId: string;
    sessionKey?: string;
    /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
    /**
     * Optional caller cancellation for maintenance work that may block.
     * Engines should reject promptly when this signal aborts.
     */
    abortSignal?: AbortSignal;
  }): Promise<ContextEngineMaintenanceResult>;
  /**
   * Ingest a single message into the engine's store.
   */
  ingest(params: {
    sessionId: string;
    sessionKey?: string;
    message: AgentMessage;
  }): Promise<IngestResult>;
  /**
   * Ingest a completed turn batch as a single unit.
   */
  ingestBatch?(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[];
  }): Promise<IngestBatchResult>;
  /**
   * Execute optional post-turn lifecycle work after a run attempt completes.
   * Engines can use this to persist canonical context and trigger background
   * compaction decisions.
   */
  afterTurn?(params: {
    sessionId: string;
    sessionKey?: string;
    /** Storage-neutral runtime session target for transcript/session SDK helpers. */
    sessionTarget?: ContextEngineSessionTarget;
    sessionFile: string;
    messages: AgentMessage[];
    /** Number of messages that existed before the prompt was sent. */
    prePromptMessageCount: number;
    /** Optional auto-compaction summary emitted by the runtime. */
    autoCompactionSummary?: string;
    /** Optional model context token budget for proactive compaction. */
    tokenBudget?: number;
    /** Optional runtime-owned context for engines that need caller state. */
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<void>;
  /**
   * Atomically and idempotently commit one accepted durable transcript turn.
   * Messages span the admitted user entry through the accepted terminal entry.
   * Hosts may retry the same advancement key after process or plugin failure.
   */
  commitTurn?(params: {
    advancementKey: string;
    admission: TranscriptTurnAdmission;
    terminal: TranscriptEntryAnchor;
    messages: AgentMessage[];
    sessionId: string;
    sessionKey?: string;
    sessionTarget?: ContextEngineSessionTarget;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<{
    status: "committed" | "duplicate";
  }>;
  /**
   * Assemble model context under a token budget.
   * Returns an ordered set of messages ready for the model.
   */
  assemble(params: {
    sessionId: string;
    sessionKey?: string;
    messages: AgentMessage[];
    tokenBudget?: number;
    /** Tool names available for this run so engines can align prompt guidance with runtime tool access. */
    availableTools?: Set<string>;
    /** Active memory citation mode when engines want to mirror memory prompt guidance. */
    citationsMode?: MemoryCitationsMode;
    /** Current model identifier (e.g. "claude-opus-4", "gpt-4o", "qwen2.5-7b").
     *  Allows context engine plugins to adapt formatting per model. */
    model?: string;
    /** The incoming user prompt for this turn (useful for retrieval-oriented engines). */
    prompt?: string;
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
  }): Promise<AssembleResult>;
  /**
   * Compact context to reduce token usage.
   * May create summaries, prune old turns, etc.
   *
   * The host always bounds this call with a finite safety timeout (the same
   * one that protects native runtime compaction). Engines that run long
   * operations SHOULD additionally honor `abortSignal` so an in-flight
   * compaction can be canceled promptly on run abort or host timeout instead
   * of running to completion in the background.
   */
  compact(params: {
    sessionId: string;
    sessionKey: string;
    /** Caller-resolved owner agent for global session aliases. */
    agentId?: string;
    /** Storage-neutral runtime session target for delegated compaction. */
    sessionTarget?: ContextEngineSessionTarget;
    tokenBudget?: number;
    /** Force compaction even below the default trigger threshold. */
    force?: boolean;
    /** Optional live token estimate from the caller's active context. */
    currentTokenCount?: number;
    /** Controls convergence target; defaults to budget. */
    compactionTarget?: "budget" | "threshold";
    customInstructions?: string;
    /** Optional runtime-owned context for engines that need caller state. */
    runtimeSettings?: ContextEngineRuntimeSettings;
    runtimeContext?: ContextEngineRuntimeContext;
    /**
     * Optional abort signal honored before and during compaction. The host
     * aborts it on run-level abort or when its compaction safety timeout
     * fires; engines should stop work and reject promptly when it aborts.
     */
    abortSignal?: AbortSignal;
    /**
     * Report meaningful compaction progress to refresh the host's idle window.
     * Requires "onProgress" in info.acceptedHostParams. The same ten-window
     * overall ceiling applies; reports after completion or abort have no effect.
     */
    onProgress?: () => void;
  }): Promise<CompactResult>;
  /**
   * Prepare context-engine-managed subagent state before the child run starts.
   *
   * Implementations can return a rollback handle that is invoked when spawn
   * fails after preparation succeeds.
   */
  prepareSubagentSpawn?(params: {
    parentSessionKey: string;
    childSessionKey: string;
    contextMode?: "isolated" | "fork";
    parentSessionId?: string;
    parentSessionFile?: string;
    childSessionId?: string;
    childSessionFile?: string;
    ttlMs?: number;
  }): Promise<SubagentSpawnPreparation | undefined>;
  /**
   * Notify the context engine that a subagent lifecycle ended.
   */
  onSubagentEnded?(params: {
    childSessionKey: string;
    reason: SubagentEndReason;
  }): Promise<void>;
  /**
   * Dispose of any resources held by the engine.
   */
  dispose?(): Promise<void>;
}
type ConversationRecallContext = {
  /** Private conversation that requested this bounded recall pass. */
  anchorSessionKey: string;
  /** Only same-agent private transcript hits may pass. */
  scope: "same-agent-private";
  /** Product-only recall searches sessions; advanced recall keeps configured corpora. */
  corpus: "sessions" | "configured";
};
/** Opaque identity, scoped to its provider. A reference is not an authorization grant. */
type MemoryReference = {
  providerId: string;
  id: string;
  revision?: string;
  fragment?: string;
};
type MemoryCitation = {
  label: string;
  reference?: MemoryReference;
  url?: string;
  startLine?: number;
  endLine?: number;
};
type MemorySearchHit = {
  reference: MemoryReference;
  excerpt: string;
  score?: number;
  source?: string;
  citations?: MemoryCitation[];
  /** Provider-owned trusted selection facts; missing eligibility never permits injection. */
  automaticRecall?: {
    eligible: boolean;
    projectKeys?: readonly string[];
    triggers?: string;
    importance?: number;
  };
};
type MemorySearchPage = {
  hits: MemorySearchHit[];
  nextCursor?: string;
  coverage?: "complete" | "partial";
  warning?: string;
};
type MemorySearchRequest = {
  query: string;
  maxResults?: number;
  /** Minimum score every provider must enforce. */
  minScore?: number;
  cursor?: string;
  sources?: ("memory" | "sessions")[];
  /** Provider hint that may be ignored when lexical-only search is unavailable. */
  lexicalOnly?: boolean;
  activeProjectKeys?: readonly string[];
};
type MemoryGetRequest = {
  reference: MemoryReference;
  from?: number;
  lines?: number;
};
type MemoryGetResult = {
  status: "ok";
  reference: MemoryReference;
  text: string;
  citations?: MemoryCitation[];
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
} | {
  status: "not_found";
};
type MemoryHealth = {
  status: "ready" | "degraded" | "unavailable";
  message?: string;
  details?: Record<string, unknown>;
};
type MemoryCandidateRequest = {
  kind: "trigger" | "project";
  limit?: number;
  activeProjectKeys?: readonly string[];
};
type MemoryProviderCapabilities = {
  /** Corpora search can cover. Non-empty. */
  sources: readonly ("memory" | "sessions")[];
  /** search accepts `cursor` and may return `nextCursor`. */
  pagination: boolean;
  /** Candidate kinds `candidates()` can enumerate for automatic recall. */
  candidates: readonly ("trigger" | "project")[];
  /** search honours `activeProjectKeys` as a filter. */
  projectFilter: boolean;
};
/** A caller-bound lease. close releases this lease, not another caller's cached manager. */
type MemoryProviderHandle = {
  capabilities: MemoryProviderCapabilities;
  search(request: MemorySearchRequest): Promise<MemorySearchPage>;
  get(request: MemoryGetRequest): Promise<MemoryGetResult>;
  /**
   * Report readiness without revealing partition content. This must be answerable for every
   * authenticated caller, including host authority with the `status` purpose; search/get may deny.
   */
  health(): Promise<MemoryHealth>;
  candidates?(request: MemoryCandidateRequest): Promise<MemorySearchPage>;
  refresh?(): Promise<void>;
  close(): Promise<void>;
};
/** Host-resolved memory partition for one trusted session invocation. */
type MemoryAudience = {
  kind: "owner-private";
  agentId: string;
} | {
  kind: "conversation";
  agentId: string;
  sessionKey: string;
  sessionId: string;
};
/** Authenticated caller authority supplied by the trusted host, never inferred from IDs. */
type MemoryCallerAuthority = {
  kind: "operator";
  scopes: readonly string[];
  connId?: string;
} | {
  kind: "session";
  sessionKey: string;
  sandboxed: boolean;
  /** Host-granted bounded recall pass; the memory owner decides which hits it admits. */
  conversationRecall?: ConversationRecallContext;
  sessionId?: string;
  audience?: MemoryAudience;
} | {
  kind: "host";
  operation: string;
};
/** Facts and a live capability supplied by the trusted host caller. */
type MemoryCallerContext = {
  authority: MemoryCallerAuthority;
  assertCurrent(): void;
  signal?: AbortSignal;
};
type MemoryProviderOpenParams = {
  cfg: OpenClawConfig;
  agentId: string;
  context: MemoryCallerContext;
  purpose?: "default" | "status" | "cli";
};
type MemoryProviderOpenResult = {
  provider: MemoryProviderHandle | null;
  error?: string;
};
type ProviderLocalServiceReconcileContext = {
  baseUrl: string;
  signal?: AbortSignal;
};
type ProviderLocalServiceReconciler = (ctx: ProviderLocalServiceReconcileContext) => Promise<void>;
type MemorySearchDeadlineControlOptions = EmbeddingDeadlineControlOptions;
/** CLI search contract shared by the Gateway adapter and the owning memory plugin. */
type MemoryCliSearchParams = {
  manager: MemorySearchManager;
  cfg: OpenClawConfig;
  agentId: string;
  query: string;
  maxResults?: number;
  minScore?: number;
  assertCurrent?: () => void;
};
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
  /** @deprecated Prefer statusAsync when available to keep storage reads off the caller thread. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
  status(): MemoryProviderStatus;
  /** Set includeCounts to false for query-path facts without database diagnostics. */
  statusAsync?(options?: {
    includeCounts?: boolean;
  }): Promise<MemoryProviderStatus>;
  sync?(params?: MemorySyncParams): Promise<void>;
  getCachedEmbeddingAvailability?(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  close?(): Promise<void>;
}
/** Exact provider endpoint whose optional local process should be leased. */
type ProviderLocalServiceTarget = {
  providerId: string;
  baseUrl: string;
  headers?: HeadersInit;
  service?: ModelProviderLocalServiceConfig;
  reconcile?: ProviderLocalServiceReconciler | undefined;
  /** Reports readiness waits only; reconciliation and request work stay outside. */
  onReadinessWait?: (waiting: boolean) => void;
};
/** Configured provider endpoint whose host-owned local service may be leased. */
type ConfiguredProviderLocalServiceTarget = Omit<ProviderLocalServiceTarget, "service">;
/** Lease returned for a started or already-running local provider service. */
type ProviderLocalServiceLease = {
  release: () => void;
};
/** Host-injected acquisition hook that cannot supply process configuration. */
type AcquireConfiguredProviderLocalService = (target: ConfiguredProviderLocalServiceTarget, signal?: AbortSignal | null) => Promise<ProviderLocalServiceLease | undefined>;
/** Options passed to embedding provider adapters when creating providers. */
type EmbeddingProviderCreateOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  /** Host-injected acquisition of the configured provider's local service. */
  acquireLocalService?: AcquireConfiguredProviderLocalService;
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
  };
  dimensions?: number;
  taskType?: string;
};
/** Result returned by an embedding provider adapter create call. */
type EmbeddingProviderCreateResult = {
  provider: EmbeddingProvider | null;
  runtime?: EmbeddingProviderRuntime;
};
/** Adapter contract registered by core or plugin embedding providers. */
type EmbeddingProviderAdapter = {
  id: string;
  /** Alternate lookup ids; creation and index identity retain the canonical id. */
  aliases?: readonly string[];
  defaultModel?: string;
  transport?: "local" | "remote";
  authProviderId?: string;
  /** Canonical model from config only: synchronous, without auth or network access. */
  normalizeModel?: (options: EmbeddingProviderCreateOptions) => string;
  resolveIndexIdentity?: (options: EmbeddingProviderCreateOptions) => EmbeddingProviderIndexIdentity;
  create: (options: EmbeddingProviderCreateOptions) => Promise<EmbeddingProviderCreateResult>;
  formatSetupError?: (err: unknown) => string;
};
/** Provider-facing input while preserving the plain text fallback. */
type EmbeddingInput = {
  text: string;
  parts?: Array<{
    type: "text";
    text: string;
  } | {
    type: "inline-data";
    mimeType: string;
    data: string;
  }>;
};
type MemoryEmbeddingBatchChunk = EmbeddingBatchChunk & {
  embeddingInput?: EmbeddingInput;
};
type MemoryEmbeddingBatchOptions = Omit<EmbeddingBatchOptions, "chunks"> & {
  chunks: MemoryEmbeddingBatchChunk[];
};
type MemoryEmbeddingProviderRuntime = Omit<EmbeddingProviderRuntime, "batchEmbed"> & {
  batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};
type MemoryEmbeddingProvider = EmbeddingProvider;
type ContextEngineFactoryContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
};
type ContextEngineFactory = (ctx: ContextEngineFactoryContext) => ContextEngine | Promise<ContextEngine>;
type ContextEngineRegistrationLifecycle = "runtime" | "readOnlyDiscovery";
type ContextEngineRegistration = {
  factory: ContextEngineFactory;
  owner: string;
  lifecycle: ContextEngineRegistrationLifecycle;
};
type CompactionProviderSummarizationInstructions = {
  identifierPolicy?: "strict" | "off" | "custom";
  identifierInstructions?: string;
};
interface CompactionProvider {
  id: string;
  label: string;
  summarize(params: {
    messages: unknown[];
    signal?: AbortSignal;
    compressionRatio?: number;
    customInstructions?: string;
    summarizationInstructions?: CompactionProviderSummarizationInstructions;
    previousSummary?: string;
  }): Promise<string>;
}
type RegisteredCompactionProvider = {
  provider: CompactionProvider;
  ownerPluginId?: string;
};
type MemoryEmbeddingProviderCreateOptions = Omit<EmbeddingProviderCreateOptions, "local"> & {
  fallback?: string;
  local?: NonNullable<EmbeddingProviderCreateOptions["local"]> & {
    contextSize?: number | "auto";
  };
};
type MemoryEmbeddingProviderCreateResult = Omit<EmbeddingProviderCreateResult, "runtime"> & {
  runtime?: MemoryEmbeddingProviderRuntime;
};
type MemoryEmbeddingProviderAdapter = Omit<EmbeddingProviderAdapter, "create"> & {
  autoSelectPriority?: number;
  allowExplicitWhenConfiguredAuto?: boolean;
  supportsMultimodalEmbeddings?: (params: {
    model: string;
  }) => boolean;
  create: (options: MemoryEmbeddingProviderCreateOptions) => Promise<MemoryEmbeddingProviderCreateResult>;
  shouldContinueAutoSelection?: (err: unknown) => boolean;
};
type MemoryPromptSectionParams = {
  availableTools: Set<string>;
  citationsMode?: MemoryCitationsMode;
  agentId?: string;
  agentSessionKey?: string;
  sandboxed?: boolean;
  /** Host-resolved repository identity for this run; the plugin owns any memory-format guidance. */
  projectKey?: string;
};
type MemoryPromptSectionBuilder = (params: MemoryPromptSectionParams) => string[];
type MemoryPromptSectionPreparer = (params: MemoryPromptSectionParams) => Promise<readonly string[]>;
type PreparedMemoryPromptSection = Readonly<{
  context: Readonly<{
    availableTools: readonly string[];
    citationsMode?: MemoryCitationsMode;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed: boolean;
    projectKey?: string;
  }>;
  lines: readonly string[];
}>;
type MemoryCorpusSearchResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  score: number;
  snippet: string;
  id?: string;
  startLine?: number;
  endLine?: number;
  citation?: string;
  source?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};
type MemoryCorpusGetResult = {
  corpus: string;
  path: string;
  title?: string;
  kind?: string;
  content: string;
  fromLine: number;
  lineCount: number;
  id?: string;
  provenanceLabel?: string;
  sourceType?: string;
  sourcePath?: string;
  updatedAt?: string;
};
type MemoryCorpusSupplement = {
  search(params: {
    query: string;
    maxResults?: number;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed?: boolean;
  }): Promise<MemoryCorpusSearchResult[]>;
  get(params: {
    lookup: string;
    fromLine?: number;
    lineCount?: number;
    agentId?: string;
    agentSessionKey?: string;
    sandboxed?: boolean;
  }): Promise<MemoryCorpusGetResult | null>;
};
type MemoryCorpusSupplementRegistration = {
  pluginId: string;
  supplement: MemoryCorpusSupplement;
};
type MemoryPromptSupplementRegistration = {
  pluginId: string;
  builder: MemoryPromptSectionBuilder;
};
type MemoryPromptPreparationRegistration = {
  pluginId: string;
  prepare: MemoryPromptSectionPreparer;
};
/** A file-persistence flush plan with its resolved timing. */
type MemoryFlushPlan = {
  softThresholdTokens: number;
  forceFlushTranscriptBytes: number;
  reserveTokensFloor: number;
  prompt: string;
  systemPrompt: string;
  relativePath: string;
};
/** Flush timing the host resolves from memory-flush config and the model context window. */
type MemoryFlushPlanTiming = Pick<MemoryFlushPlan, "softThresholdTokens" | "forceFlushTranscriptBytes" | "reserveTokensFloor">;
/**
 * A file plan as a resolver may return it: omitted timing fields are filled by the host, and
 * defined ones deliberately override it.
 */
type MemoryFlushFilePlanDraft = Omit<MemoryFlushPlan, keyof MemoryFlushPlanTiming> & Partial<MemoryFlushPlanTiming> & {
  persistenceToolNames?: never;
  lookupToolNames?: never;
};
/**
 * Tool persistence for the selected memory slot owner. The host fills omitted timing;
 * defined values deliberately override it.
 */
type MemoryFlushToolsPlan = Partial<MemoryFlushPlanTiming> & {
  prompt: string;
  systemPrompt: string;
  /** Absent on every tools plan; a tools plan never names a workspace file. */
  relativePath?: never;
  persistenceToolNames: readonly string[];
  /** Read-only helper tools the flush may use to inspect existing provider memory. */
  lookupToolNames?: readonly string[];
};
type MemoryFlushPlanResolverParams = {
  cfg?: OpenClawConfig;
  nowMs?: number;
  contextWindowTokens?: number;
};
/** Resolves a complete file flush plan. */
type MemoryFlushPlanResolver = (params: MemoryFlushPlanResolverParams) => MemoryFlushPlan | null;
/**
 * Resolves a flush plan the host completes: a file plan whose omitted timing the host fills,
 * or a tools plan that persists through the selected slot owner's own tools.
 */
type MemoryProviderFlushPlanResolver = (params: MemoryFlushPlanResolverParams) => MemoryFlushFilePlanDraft | MemoryFlushToolsPlan | null;
type RegisteredMemorySearchManager = Omit<MemorySearchManager, "readFile"> & {
  readFile(params: Parameters<MemorySearchManager["readFile"]>[0]): Promise<LegacyMemoryReadResult | MemoryReadResult>;
};
type MemoryRuntimeBackendConfig = {
  backend: "builtin";
};
type MemoryPluginRuntime = {
  /** CLI search and recall recording run under the same plugin instance. */
  searchForCli?(params: MemoryCliSearchParams): Promise<MemoryCliSearchResult>;
  getMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
    /** Request a read-only source freshness scan; runtimes may ignore unsupported diagnostics. */
    inspectSources?: boolean;
  }): Promise<{
    manager: RegisteredMemorySearchManager | null;
    debug?: {
      backend?: "builtin";
      purpose?: "default" | "status" | "cli";
      managerMs?: number;
    };
    error?: string;
  }>;
  resolveMemoryBackendConfig(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): MemoryRuntimeBackendConfig;
  /** Authorize raw hits before caller-visible use; absent runtimes must not expose session hits. */
  authorizeSearchHits?(params: {
    cfg: OpenClawConfig;
    agentId: string;
    requesterSessionKey: string | undefined;
    sandboxed: boolean;
    hits: MemorySearchResult[];
    /** A sessionless host or operator caller acting for `agentId` may keep only that agent's hits. */
    trustedAgentScope?: boolean;
    /** The session caller's host-granted recall pass, exactly as its tool context received it. */
    conversationRecall?: ConversationRecallContext;
  }): Promise<MemorySearchResult[]>;
  /** The classifier consumes pinned read sources without probing Gateway-local paths. */
  supportsWorkspaceMemoryReadSources?: true;
  classifyWorkspaceMemoryPaths?(params: {
    cfg: OpenClawConfig;
    agentId: string;
    workspaceDir: string;
    relativePaths: string[];
    /** Already-read remote files; an absent canonical path must remain untrusted. */
    readSources?: readonly {
      relativePath: string;
      canonicalRelativePath?: string;
    }[];
  }): Promise<Array<{
    relativePath: string;
    originClass: MemoryOriginClass;
  }>>;
  /** Fence and drain managers consuming these exact retiring capability objects. */
  prepareReload?(change: {
    retireRuntime: boolean;
    retiringEmbeddingProviders: readonly MemoryEmbeddingProviderAdapter[];
  }): {
    drain(): Promise<void | {
      errors: readonly unknown[];
    }>;
    resume(): void;
  };
  closeMemorySearchManager?(params: {
    cfg: OpenClawConfig;
    agentId: string;
  }): Promise<void>;
  closeAllMemorySearchManagers?(): Promise<void>;
};
/** Additive runtime; lifecycle hooks share the existing memory runtime cleanup owner. */
type MemoryProviderRuntime = Pick<MemoryPluginRuntime, "prepareReload" | "closeMemorySearchManager" | "closeAllMemorySearchManagers"> & {
  open(params: MemoryProviderOpenParams): Promise<MemoryProviderOpenResult>;
};
type MemoryPluginPublicArtifactContentType = "markdown" | "json" | "text";
type MemoryPluginPublicArtifact = {
  kind: string;
  workspaceDir: string;
  relativePath: string;
  absolutePath: string;
  agentIds: string[];
  contentType: MemoryPluginPublicArtifactContentType;
};
type MemoryPluginPublicArtifactsProvider = {
  listArtifacts(params: {
    cfg: OpenClawConfig;
  }): Promise<MemoryPluginPublicArtifact[]>;
};
type MemoryPluginCapability = {
  promptBuilder?: MemoryPromptSectionBuilder;
  flushPlanResolver?: MemoryFlushPlanResolver;
  /** Host-completed flush plans, including tool persistence; preferred over flushPlanResolver. */
  providerFlushPlanResolver?: MemoryProviderFlushPlanResolver;
  runtime?: MemoryPluginRuntime;
  /** Provider-neutral host integration; preferred over runtime when present. */
  providerRuntime?: MemoryProviderRuntime;
  publicArtifacts?: MemoryPluginPublicArtifactsProvider;
  /** Agent-facing tools Active Memory may use for provider-owned deep recall. */
  recallToolNames?: readonly string[];
  /** Local deterministic recall tool required by provider-owned direct lookup. */
  deterministicRecallToolName?: string;
  /** Whether recall may read protected same-agent private session transcripts. */
  supportsPrivateTranscriptRecall?: boolean;
};
/**
 * What a /learn contribution writes. The host owns routing between media, so a medium is
 * host vocabulary: "memory" is reserved for the selected memory slot owner.
 */
type LearnMedium = "skills" | "memory";
type LearnGuidance = {
  /** Lines for the /learn prompt body. */
  lines: readonly string[];
  /** Reference blocks the host appends after the closing instruction, each after a blank line. */
  appendix?: readonly string[];
};
type LearnSubcommandContext = {
  /** Text after the subcommand name. */
  args: string;
  config: OpenClawConfig;
  agentId: string;
  sessionKey?: string;
  /** Revalidates admitted owner authority; call it after awaited work, before effects. */
  assertOwnerCurrent?: () => void;
};
/** A reply without a model turn, or the prompt that replaces this turn's user message. */
type LearnSubcommandResult = {
  text: string;
} | {
  prompt: string;
};
type LearnSubcommand = {
  /** The word after /learn, matched case-insensitively. */
  name: string;
  /**
   * Whether the raw text after the name, separator included, selects the subcommand;
   * other text stays a learning request. The handler gets the arguments without the separator.
   */
  matchArgs?: (args: string) => boolean;
  /**
   * Changes state without a model turn: only owners may run it, gateway clients need
   * operator.admin, and it runs even when the contribution's tools are unavailable.
   * Other subcommands run only when the contribution can learn on this turn.
   */
  direct?: boolean;
  handle: (context: LearnSubcommandContext) => LearnSubcommandResult | Promise<LearnSubcommandResult>;
};
type LearnContribution = {
  medium: LearnMedium;
  /** Tools a /learn turn may use to persist lessons; the host checks them against tool policy. */
  toolNames: readonly string[];
  /** Tools that must all be allowed for this contribution to learn; default: any of toolNames. */
  requiredToolNames?: readonly string[];
  /**
   * Builds this contribution's /learn guidance from the allowed tools and the media that
   * learn on this turn, including this one. It must be deterministic: it is prompt text.
   */
  buildGuidance: (params: {
    availableTools: Set<string>;
    media: ReadonlySet<LearnMedium>;
  }) => LearnGuidance;
  /** Words after /learn that this contribution handles instead of a learning request. */
  subcommands?: readonly LearnSubcommand[];
  /**
   * Reply when /learn cannot learn here and this contribution's medium is the only one
   * registered (or its subcommand was asked for). Default: a generic remedy.
   */
  unavailableText?: string;
};
type LearnContributionRegistration = {
  pluginId: string;
  contribution: LearnContribution;
};
type MemoryPluginCapabilityRegistration = {
  pluginId: string;
  capability: MemoryPluginCapability;
  /**
   * Registrar-provided memory slot ownership. Only the slot owner may displace
   * earlier fields during resolution; undeclared registrations contribute what
   * the owner lacks but never take over its runtime or consolidation surface.
   */
  memorySlotSelected?: boolean;
};
type SessionDiscussionProvider = {
  id: string;
  info(params: {
    sessionKey: string;
    agentId: string;
  }): Promise<SessionDiscussionInfo>;
  open(params: {
    sessionKey: string;
    agentId: string;
  }): Promise<SessionDiscussionInfo>;
};
type ResolvedPluginRuntimeArtifact = {
  source: string;
  rootDir: string;
};
export { TranscriptTurnAdmission as $, MemorySearchManager as A, ContextEnginePromptCacheInfo as B, SessionDiscussionProvider as C, EmbeddingProviderAdapter as D, EmbeddingInput as E, CompactResult as F, ContextUsage as G, ContextEngineRuntimeSettings as H, ContextEngine as I, normalizeUsage as J, NormalizedUsage as K, ContextEngineHostCapability as L, MemoryAudience as M, ConversationRecallContext as N, AcquireConfiguredProviderLocalService as O, AssembleResult as P, TranscriptEntryAnchor as Q, ContextEngineOperation as R, ResolvedPluginRuntimeArtifact as S, MemoryEmbeddingProviderRuntime as T, ContextEngineSessionTarget as U, ContextEngineRuntimeContext as V, TranscriptRewriteResult as W, LlmCompleteResult as X, LlmCompleteParams as Y, LlmCompleteUsage as Z, MemoryPromptSectionBuilder as _, LearnContributionRegistration as a, PreparedMemoryPromptSection as b, MemoryEmbeddingProviderAdapter as c, MemoryPluginCapability as d, TranscriptTurnBoundary as et, MemoryPluginCapabilityRegistration as f, MemoryPromptPreparationRegistration as g, MemoryPluginRuntime as h, LearnContribution as i, ProviderLocalServiceReconcileContext as j, MemoryCliSearchParams as k, MemoryEmbeddingProviderCreateOptions as l, MemoryPluginPublicArtifactsProvider as m, ContextEngineFactory as n, MemoryCorpusSupplement as o, MemoryPluginPublicArtifact as p, UsageLike as q, ContextEngineRegistration as r, MemoryCorpusSupplementRegistration as s, CompactionProvider as t, MemoryEmbeddingProviderCreateResult as u, MemoryPromptSectionParams as v, MemoryEmbeddingProvider as w, RegisteredCompactionProvider as x, MemoryPromptSupplementRegistration as y, ContextEngineProjection as z };