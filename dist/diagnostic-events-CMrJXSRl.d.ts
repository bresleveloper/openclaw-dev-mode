import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { t as SchemaContract } from "./schema-contract-v05QRSzC.js";
import { r as TalkEvent$1 } from "./channels-DhQONOcd.js";
import { r as GatewayClientId } from "./client-info-DmzJu9gO.js";
import { HeapSpaceInfo } from "node:v8";
//#region src/infra/gc-observer.d.ts
type GcSample = {
  kind: "scavenge" | "mark_sweep_compact" | "incremental" | "weak_processing";
  durationMs: number;
};
//#endregion
//#region src/infra/worker-message-metrics.d.ts
type WorkerMessageKind = "sqlite_request" | "sqlite_reply" | "task_input" | "task_reply" | "task_request" | "task_notification" | "task_consumed" | "admission" | "authority" | "resource" | "lifecycle" | "memory" | "realtime" | "other";
type WorkerMessageDirection = "to_worker" | "from_worker";
type WorkerMessageMetric = {
  kind: WorkerMessageKind;
  direction: WorkerMessageDirection;
  messages: number;
  payloadBytes: number;
  unmeasuredMessages: number;
};
//#endregion
//#region src/infra/runtime-process-entrypoints.d.ts
declare const runtimeProcessEntrypoints: {
  readonly sqliteHeaderProbe: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly postgresBridge: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly secretEgressProxy: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly codeModeNode: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly cronReadOnly: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly stateRead: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly workerNativeLifecycle: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly spawnBroker: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly cronStreamMatcher: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly controlUiFile: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly publicSessionCard: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly nodeBootstrapArtifact: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly nativeHookRelayClient: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly computerHost: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly imageProcessor: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly fileToolPlanning: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly fileToolRead: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly attachmentProcessor: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly gitOperations: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly gitPackCleanup: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly fsSafeCopy: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sharedStateStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly authProfileInlineUsage: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly pluginModelCatalogCredentials: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly agentDatabaseExecution: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly workspaceMemory: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly localAgentAvatar: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly identityFile: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly workspaceSkills: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly skillsDiscovery: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly boardStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly progressCardStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionSharingStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionForkDomain: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionGoalOperations: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionLifecyclePlanningDomain: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionMessageRewriteDomain: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionDiskBudget: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly heartbeatOutcomeStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly acpParentStreamStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly messageToolRunOutcomeStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly contextEngineTurnOutbox: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteStore: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteWriterAdmission: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly agentSchemaInspection: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly stateMigrationSnapshot: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly githubExec: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteReadOnly: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteSnapshotStaging: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteReadOnlyNativeResource: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteSourceRevision: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteIntegrity: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sqliteCloseProbe: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly preparedModelCatalog: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly providerPromptState: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly updateRepair: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly immutableBuild: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly updateMigratedFinalize: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly updateCandidateState: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly doctorLint: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly doctor: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly databaseVerify: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly stateOwnership: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly stateLeaseHeartbeat: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly gatewayStateOwnerHeartbeat: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionTranscriptArchive: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionTranscript: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly workerTranscriptCommit: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionManagerMetadata: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionTranscriptProjectionPublication: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionTranscriptReports: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly sessionTranscriptReconcile: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly tailscaleRouteOwner: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly serviceChildRelay: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly terminalPty: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly serviceChildGroupAnchor: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly serviceChildWindowsJobAnchor: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
  readonly bunSqliteLibrary: {
    readonly currentModuleUrl: string;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: `${string}.js`;
  };
};
//#endregion
//#region src/infra/worker-request-kind.d.ts
declare const standaloneKinds: {
  readonly "catalog-page.worker.js": "catalog";
  readonly "code-mode.worker.js": "codeMode";
  readonly "disk-budget.worker.js": "diskBudget";
  readonly "document-extractor.worker.js": "document";
  readonly "manager-index.worker.js": "memoryIndex";
  readonly "manager-search.worker.js": "memorySearch";
  readonly "memory-index.worker.js": "memoryIndex";
  readonly "memory-search.worker.js": "memorySearch";
  readonly "run.worker.js": "teamReports";
  readonly "session-history.worker.js": "sessionHistory";
};
type WorkerRequestKind = keyof typeof runtimeProcessEntrypoints | (typeof standaloneKinds)[keyof typeof standaloneKinds] | "sqlite_read" | "sqlite_writer" | "extension";
//#endregion
//#region src/infra/diagnostic-process-types.d.ts
type DiagnosticRuntimeMeasurementFields = {
  type: "gateway.http.cancelled";
  source: "client" | "shutdown";
} | {
  type: "gateway.event_loop.sample";
  intervalMs: number;
  delayMaxMs: number;
} | {
  type: "diagnostic.gc";
  durationMs: number;
  /** Optional for existing SDK event producers; native observers always supply both. */
  kind?: GcSample["kind"];
  /** main or an allowlisted worker script basename (other for unknown scripts). */
  thread?: string;
  /** Reusable Code Mode isolate slot (1–64), owned until native worker exit. */
  workerSlot?: number;
};
type DiagnosticWorkerRequestFields = {
  type: "worker.request";
  kind: WorkerRequestKind;
  requestClass: string;
  phase: "queued" | "started" | "completed";
  queueDepth: number;
  queueWaitMs?: number;
  durationMs?: number;
  /** Monotonic process timestamps spanning the complete request, including transport frames. */
  timing?: Partial<Record<"enqueued" | "dispatched" | "posted" | "postFinished" | "received" | "inputReady" | "executeStarted" | "executeFinished" | "serialized" | "replied" | "replyReceived", number>>;
};
type DiagnosticAsyncQueueDroppedFields = {
  type: "diagnostic.async_queue.dropped";
  droppedEvents: number;
  droppedTrustedEvents?: number;
  droppedUntrustedEvents?: number;
  droppedPriorityEvents?: number;
  queueLength: number;
  maxQueueLength: number;
  drainBatchSize: number;
};
type DiagnosticMemoryUsage = {
  rssBytes: number;
  heapTotalBytes: number;
  heapUsedBytes: number;
  externalBytes: number;
  arrayBuffersBytes: number;
  heapSpaces?: HeapSpaceInfo[];
  workerCount?: number;
  workerHeapSampledCount?: number;
  workerHeapTotalBytes?: number;
  workerHeapUsedBytes?: number;
  workerExternalBytes?: number;
  workerArrayBuffersBytes?: number;
  workerArrayBuffersSampledCount?: number;
  /** Coverage concerns direct Workers only; nested isolates are not in the parent registry. */
  workerMemoryScope?: "direct";
  workerMemoryCoverage?: "complete" | "partial" | "unavailable";
  workerMemoryMissing?: {
    script: string;
    threadId: number;
    reason: "pending" | "stale" | "unavailable";
  }[];
  /** Live, fresh isolate samples; script is an allowlisted basename or "other". */
  workerHeaps?: {
    script: string;
    heapUsed: number;
    heapTotal: number;
    /** Actual V8 isolate limit; unavailable on runtimes without V8. */
    heapSizeLimitBytes?: number;
    threadId?: number;
    /** Same bounded slot as diagnostic.gc; absent for overflow and other scripts. */
    workerSlot?: number;
    external?: number;
    /** Missing for native-only samplers; zero is a measured value. Included in external. */
    arrayBuffers?: number;
    sampleAgeMs?: number;
  }[];
  /** Cumulative process-owned counts; script and reason come from fixed allowlists. */
  workerLifecycle?: {
    script: string;
    started: number;
    retired: {
      reason: string;
      count: number;
    }[];
  }[];
  /** Main-thread transport totals; unknown payload sizes remain separate from known zero bytes. */
  workerMessages?: WorkerMessageMetric[];
};
declare const DIAGNOSTIC_MEMORY_PRESSURE_METRICS: readonly ["thresholdBytes", "limitBytes", "usedBytes", "workerThreadId", "rssGrowthBytes", "windowMs"];
type DiagnosticMemoryPressureMetrics = Partial<Record<(typeof DIAGNOSTIC_MEMORY_PRESSURE_METRICS)[number], number>>;
type DiagnosticMemoryPressureFields = DiagnosticMemoryPressureMetrics & {
  type: "diagnostic.memory.pressure";
  level: "warning" | "critical";
  reason: "rss_threshold" | "heap_threshold" | "worker_heap_threshold" | "rss_growth";
  memory: DiagnosticMemoryUsage;
};
type DiagnosticChildProcessSpawnFields = {
  type: "diagnostic.child_process.spawn";
  family: string;
  /** Bounded Git owner or SQLite session/transport; unknown for unattributed Git. */
  operation?: string;
  count: number;
  intervalMs: number;
};
//#endregion
//#region src/agents/embedded-agent-runner/execution-phase.d.ts
declare const EMBEDDED_AGENT_EXECUTION_PHASE_LABELS: {
  readonly runner_entered: "runner-entered";
  readonly workspace: "workspace";
  readonly runtime_plugins: "runtime-plugins";
  readonly before_agent_reply: "before-agent-reply";
  readonly model_resolution: "model-resolution";
  readonly auth: "auth";
  readonly context_engine: "context-engine";
  readonly attempt_dispatch: "attempt-dispatch";
  readonly context_assembled: "context-assembled";
  readonly turn_accepted: "turn-accepted";
  readonly process_spawned: "process-spawned";
  readonly tool_execution_started: "tool-execution-started";
  readonly assistant_output_started: "assistant-output-started";
  readonly model_call_started: "model-call-started";
};
type EmbeddedAgentExecutionPhase = keyof typeof EMBEDDED_AGENT_EXECUTION_PHASE_LABELS;
//#endregion
//#region src/infra/diagnostic-trace-context.d.ts
type DiagnosticTraceContext = {
  /** W3C trace id, 32 lowercase hex chars. */
  readonly traceId: string;
  /** Current span id, 16 lowercase hex chars. */
  readonly spanId?: string;
  /** Parent span id, 16 lowercase hex chars. */
  readonly parentSpanId?: string;
  /** W3C trace flags, 2 lowercase hex chars. Defaults to sampled. */
  readonly traceFlags?: string;
};
type DiagnosticTraceContextInput = Partial<DiagnosticTraceContext> & {
  traceparent?: string;
};
/** Returns whether a value is a non-zero W3C trace id. */
declare function isValidDiagnosticTraceId(value: unknown): value is string;
/** Returns whether a value is a non-zero W3C span id. */
declare function isValidDiagnosticSpanId(value: unknown): value is string;
/** Returns whether a value is a valid W3C trace-flags byte. */
declare function isValidDiagnosticTraceFlags(value: unknown): value is string;
/** Parses a W3C `traceparent` header into a normalized diagnostic trace context. */
declare function parseDiagnosticTraceparent(traceparent: string | undefined): DiagnosticTraceContext | undefined;
/** Formats a diagnostic trace context as a W3C `traceparent` header. */
declare function formatDiagnosticTraceparent(context: DiagnosticTraceContext | undefined): string | undefined;
/** Creates a normalized trace context from explicit fields, traceparent, or generated ids. */
declare function createDiagnosticTraceContext(input?: DiagnosticTraceContextInput): DiagnosticTraceContext;
/** Creates a child context that preserves the parent trace id and records the parent span id. */
declare function createChildDiagnosticTraceContext(parent: DiagnosticTraceContext, input?: Omit<DiagnosticTraceContextInput, "traceId" | "traceparent">): DiagnosticTraceContext;
/** Creates a child of the active trace scope, or a new root context when no scope is active. */
declare function createDiagnosticTraceContextFromActiveScope(input?: Omit<DiagnosticTraceContextInput, "traceId" | "traceparent">): DiagnosticTraceContext;
/** Returns an immutable defensive copy of a trace context. */
declare function freezeDiagnosticTraceContext(context: DiagnosticTraceContext): DiagnosticTraceContext;
//#endregion
//#region src/talk/talk-events.d.ts
/** Canonical event names emitted by Talk sessions across realtime and STT/TTS flows. */
declare const TALK_EVENT_TYPES: readonly ["session.started", "session.ready", "session.closed", "session.error", "session.replaced", "turn.started", "turn.ended", "turn.cancelled", "capture.started", "capture.stopped", "capture.cancelled", "capture.once", "input.audio.delta", "input.audio.committed", "transcript.delta", "transcript.done", "output.text.delta", "output.text.done", "output.audio.started", "output.audio.delta", "output.audio.done", "tool.call", "tool.progress", "tool.result", "tool.error", "usage.metrics", "latency.metrics", "health.changed"];
type TalkEventType = (typeof TALK_EVENT_TYPES)[number];
type TalkMode = TalkEvent$1["mode"];
type TalkTransport = TalkEvent$1["transport"];
type TalkBrain = TalkEvent$1["brain"];
type TalkEventContext = SchemaContract<Pick<TalkEvent$1, "sessionId" | "mode" | "transport" | "brain" | "provider">>;
type TalkEvent<TPayload = unknown> = SchemaContract<Omit<TalkEvent$1, "payload">> & {
  payload: TPayload;
};
/** Session context, id, sequence, and the default timestamp are supplied by the sequencer. */
type TalkEventInput<TPayload = unknown> = Omit<TalkEvent<TPayload>, keyof TalkEventContext | "id" | "seq" | "timestamp"> & {
  timestamp?: string;
};
//#endregion
//#region src/infra/diagnostic-event-listener-presence.d.ts
type InternalDiagnosticEventInterest<EventType extends string = string> = Readonly<{
  include?: readonly EventType[];
  exclude?: readonly EventType[];
  /** Restricts trusted events only; untrusted events still use include/exclude. */
  includeTrusted?: readonly EventType[];
}>;
//#endregion
//#region src/infra/diagnostic-rpc-types.d.ts
/** Payload-free facts from authenticated Gateway WebSocket request owners. */
type DiagnosticGatewayRpcFields = {
  type: "gateway.rpc";
  /** Registered method name, or a fixed other/unknown bucket. */
  method: string;
} & ({
  phase: "received";
  modelsList?: {
    clientKind: GatewayClientId;
    source: "wire" | "internal";
    view: "default" | "configured" | "provider-config" | "all" | "other";
    scope: "global" | "agent" | "session" | "auth-profile";
    refresh: boolean;
    preparedOnly: boolean;
  };
} | {
  phase: "response";
  outcome: "ok" | "error" | "unavailable" | "suppressed";
  durationMs: number;
  /** Later sent frames carry bytes without repeating first-response timings. */
  firstResponse?: boolean;
  responseBytes?: number;
} | {
  phase: "handler";
  outcome: "returned" | "threw";
  durationMs: number;
  admissionMs: number;
  /** Exclusive main-thread handler window; background work and GC can still affect it. */
  heapDeltaBytes?: number;
} | {
  phase: "dispatch";
  outcome: "returned" | "threw" | "rejected" | "cancelled";
  durationMs: number;
  queueWaitMs?: number;
  response: "none" | "sent" | "unavailable" | "suppressed";
});
//#endregion
//#region src/infra/diagnostic-run-types.d.ts
type DiagnosticRunScopeFields = {
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  provider?: string;
  model?: string;
  trigger?: string;
  channel?: string;
};
type DiagnosticAgentCommentaryFields = DiagnosticRunScopeFields & {
  type: "agent.commentary";
  harnessId: string;
  pluginId?: string;
  itemId?: string;
  sourceSequence: number;
  sourceTimestampMs: number;
  textLength: number;
  contentCaptured: boolean;
  contentTruncated: boolean;
};
//#endregion
//#region src/infra/diagnostic-events.d.ts
type DiagnosticSessionState = "idle" | "processing" | "waiting";
type DiagnosticBaseEvent = {
  ts: number;
  seq: number;
  trace?: DiagnosticTraceContext;
};
type DiagnosticSessionEvent = DiagnosticBaseEvent & Pick<DiagnosticRunScopeFields, "sessionKey" | "sessionId">;
type DiagnosticGatewayRpcEvent = DiagnosticBaseEvent & DiagnosticGatewayRpcFields;
type DiagnosticUsageEvent = DiagnosticSessionEvent & {
  type: "model.usage";
  channel?: string;
  agentId?: string;
  provider?: string;
  model?: string;
  usage: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    promptTokens?: number;
    total?: number;
  };
  lastCallUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  context?: {
    limit?: number;
    used?: number;
  };
  costUsd?: number;
  durationMs?: number;
};
type DiagnosticFailoverEvent = DiagnosticSessionEvent & {
  type: "model.failover";
  lane?: string;
  fromProvider?: string;
  fromModel?: string;
  toProvider?: string;
  toModel?: string;
  reason: string;
  cascadeDepth?: number;
  suspended?: boolean;
};
type DiagnosticSecurityEventActor = {
  kind: "operator" | "node" | "agent" | "plugin" | "channel_sender" | "system";
  idHash?: string;
  deviceIdHash?: string;
  channel?: string;
  role?: string;
  scopes?: string[];
};
type DiagnosticSecurityEventTarget = {
  kind: "gateway" | "device" | "node" | "tool" | "plugin" | "secret_ref" | "channel" | "config" | "session";
  idHash?: string;
  name?: string;
  owner?: string;
};
type DiagnosticSecurityEventPolicy = {
  id?: string;
  decision?: "allow" | "deny" | "ask" | "auto" | "full" | "not_applicable";
  reason?: string;
};
type DiagnosticSecurityEventControl = {
  id?: string;
  family?: "auth" | "authorization" | "approval" | "sandbox" | "secret" | "supply_chain";
};
type DiagnosticSecurityEvent = DiagnosticBaseEvent & {
  type: "security.event";
  eventId: string;
  category: "auth" | "approval" | "tool" | "plugin" | "secret" | "channel" | "config" | "audit" | "telemetry";
  action: string;
  outcome: "success" | "failure" | "denied" | "error";
  severity: "info" | "low" | "medium" | "high" | "critical";
  actor?: DiagnosticSecurityEventActor;
  target?: DiagnosticSecurityEventTarget;
  policy?: DiagnosticSecurityEventPolicy;
  control?: DiagnosticSecurityEventControl;
  reason?: string;
  attributes?: Record<string, string | number | boolean>;
};
type DiagnosticWebhookReceivedEvent = DiagnosticBaseEvent & {
  type: "webhook.received";
  channel: string;
  updateType?: string;
  chatId?: number | string;
};
type DiagnosticWebhookProcessedEvent = DiagnosticBaseEvent & {
  type: "webhook.processed";
  channel: string;
  updateType?: string;
  chatId?: number | string;
  durationMs?: number;
};
type DiagnosticWebhookErrorEvent = DiagnosticBaseEvent & {
  type: "webhook.error";
  channel: string;
  updateType?: string;
  chatId?: number | string;
  error: string;
};
type DiagnosticMessageQueuedEvent = DiagnosticSessionEvent & {
  type: "message.queued";
  channel?: string;
  source: string;
  queueDepth?: number;
};
type DiagnosticMessageReceivedEvent = DiagnosticSessionEvent & {
  type: "message.received";
  channel?: string;
  messageId?: number | string;
  chatId?: number | string;
  source: string;
};
type DiagnosticMessageDispatchStartedEvent = DiagnosticSessionEvent & {
  type: "message.dispatch.started";
  channel?: string;
  source: string;
};
type DiagnosticMessageDispatchCompletedEvent = DiagnosticSessionEvent & {
  type: "message.dispatch.completed";
  channel?: string;
  source: string;
  durationMs: number;
  outcome: "completed" | "skipped" | "error";
  reason?: string;
  error?: string;
};
type DiagnosticMessageProcessedEvent = DiagnosticSessionEvent & {
  type: "message.processed";
  channel: string;
  messageId?: number | string;
  chatId?: number | string;
  agentId?: string;
  durationMs?: number;
  outcome: "completed" | "skipped" | "error";
  reason?: string;
  error?: string;
};
type DiagnosticMessageDeliveryKind = "text" | "media" | "edit" | "reaction" | "other";
type DiagnosticMessageDeliveryBaseEvent = DiagnosticBaseEvent & {
  channel: string;
  sessionKey?: string;
  deliveryKind: DiagnosticMessageDeliveryKind;
};
type DiagnosticMessageDeliveryStartedEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.started";
};
type DiagnosticMessageDeliveryCompletedEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.completed";
  durationMs: number;
  resultCount: number;
};
type DiagnosticMessageDeliveryErrorEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.error";
  durationMs: number;
  errorCategory: string;
};
type DiagnosticTalkEvent = DiagnosticBaseEvent & {
  type: "talk.event";
  sessionId?: string;
  turnId?: string;
  captureId?: string;
  talkEventType: TalkEventType;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
  final?: boolean;
  durationMs?: number;
  byteLength?: number;
};
type DiagnosticSessionStateEvent = DiagnosticSessionEvent & {
  type: "session.state";
  prevState?: DiagnosticSessionState;
  state: DiagnosticSessionState;
  reason?: string;
  queueDepth?: number;
};
type DiagnosticSessionActiveWorkKind = "embedded_run" | "model_call" | "tool_call";
type DiagnosticSessionAttentionClassification = "long_running" | "blocked_tool_call" | "stalled_agent_run" | "stale_session_state";
type DiagnosticSessionAttentionBaseEvent = DiagnosticSessionEvent & {
  state: DiagnosticSessionState;
  ageMs: number;
  queueDepth?: number;
  reason?: string;
  classification: DiagnosticSessionAttentionClassification;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  repeatedRequestNoProgressAgeMs?: number;
  terminalProgressStale?: boolean;
};
type DiagnosticSessionLongRunningEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.long_running";
  classification: "long_running";
};
type DiagnosticSessionStalledEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.stalled";
  classification: "blocked_tool_call" | "stalled_agent_run";
};
type DiagnosticSessionStuckEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.stuck";
  classification: "stale_session_state";
};
type DiagnosticSessionRecoveryStatus = "aborted" | "released" | "skipped" | "noop" | "failed";
type DiagnosticSessionRecoveryBaseEvent = DiagnosticSessionEvent & {
  state: DiagnosticSessionState;
  stateGeneration?: number;
  ageMs: number;
  queueDepth?: number;
  reason?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  allowActiveAbort?: boolean;
};
type DiagnosticSessionRecoveryRequestedEvent = DiagnosticSessionRecoveryBaseEvent & {
  type: "session.recovery.requested";
};
type DiagnosticSessionRecoveryCompletedEvent = DiagnosticSessionRecoveryBaseEvent & {
  type: "session.recovery.completed";
  status: DiagnosticSessionRecoveryStatus;
  action: string;
  outcomeReason?: string;
  released?: number;
  stale?: boolean;
};
type DiagnosticSessionTurnCreatedEvent = DiagnosticSessionEvent & {
  type: "session.turn.created";
  runId: string;
  agentId?: string;
  channel?: string;
  trigger: "user" | "event" | "heartbeat";
};
type DiagnosticLaneEnqueueEvent = DiagnosticBaseEvent & {
  type: "queue.lane.enqueue";
  lane: string;
  queueSize: number;
};
type DiagnosticLaneDequeueEvent = DiagnosticBaseEvent & {
  type: "queue.lane.dequeue";
  lane: string;
  queueSize: number;
  waitMs: number;
};
type DiagnosticRunAttemptEvent = DiagnosticSessionEvent & {
  type: "run.attempt";
  runId: string;
  attempt: number;
};
type DiagnosticRunProgressEvent = DiagnosticSessionEvent & {
  type: "run.progress";
  runId?: string;
  reason: string;
};
/**
 * Session-correlated embedded-runner execution milestone. Emitted for every
 * phase transition so external status surfaces can render turn startup
 * without a control-UI subscription. `phase` is the closed
 * EmbeddedAgentExecutionPhase contract (type-only import keeps this module
 * runtime-independent of the agents layer).
 */
type DiagnosticRunExecutionPhaseEvent = DiagnosticBaseEvent & {
  type: "run.execution_phase";
  sessionKey?: string;
  sessionId: string;
  runId: string;
  phase: EmbeddedAgentExecutionPhase;
  provider?: string;
  model?: string;
  backend?: string;
  source?: string;
  tool?: string;
  toolCallId?: string;
  itemId?: string;
  firstModelCallStarted?: boolean;
};
type DiagnosticHeartbeatEvent = DiagnosticBaseEvent & {
  type: "diagnostic.heartbeat";
  webhooks: {
    received: number;
    processed: number;
    errors: number;
  };
  active: number;
  waiting: number;
  queued: number;
};
type DiagnosticLivenessWarningReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type DiagnosticPhaseDetails = Record<string, string | number | boolean>;
type DiagnosticPhaseSnapshot = {
  name: string;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
  details?: DiagnosticPhaseDetails;
};
type DiagnosticLivenessWarningEvent = DiagnosticBaseEvent & {
  type: "diagnostic.liveness.warning";
  reasons: DiagnosticLivenessWarningReason[];
  intervalMs: number;
  degradedSinceMs?: number;
  eventLoopDelayP99Ms?: number;
  eventLoopDelayMaxMs?: number;
  eventLoopUtilization?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
  active: number;
  waiting: number;
  queued: number;
  phase?: string;
  recentPhases?: DiagnosticPhaseSnapshot[];
  activeWorkLabels?: string[];
  waitingWorkLabels?: string[];
  queuedWorkLabels?: string[];
};
type DiagnosticPhaseCompletedEvent = DiagnosticBaseEvent & DiagnosticPhaseSnapshot & {
  type: "diagnostic.phase.completed";
};
type DiagnosticToolLoopEvent = DiagnosticSessionEvent & {
  type: "tool.loop";
  agentId?: string;
  toolName: string;
  level: "warning" | "critical";
  action: "warn" | "block";
  detector: "generic_repeat" | "argument_churn" | "unknown_tool_repeat" | "known_poll_no_progress" | "global_circuit_breaker" | "ping_pong";
  count: number;
  message: string;
  pairedToolName?: string;
};
type DiagnosticToolParamsSummary = {
  kind: "object";
} | {
  kind: "array";
  length: number;
} | {
  kind: "string";
  length: number;
} | {
  kind: "number" | "boolean" | "null" | "undefined" | "other";
};
type DiagnosticToolSource = "channel" | "core" | "mcp" | "plugin";
type DiagnosticToolTerminalReason = "failed" | "cancelled" | "timed_out";
type DiagnosticToolExecutionBaseEvent = DiagnosticSessionEvent & {
  runId?: string;
  agentId?: string;
  /** Authoritative lifecycle time from the tool runtime, when it exposes one. */
  sourceTimestampMs?: number;
  toolName: string;
  toolSource?: DiagnosticToolSource;
  toolOwner?: string;
  toolCallId?: string;
  paramsSummary?: DiagnosticToolParamsSummary;
  /** Deterministic mutation classification computed before tool execution. */
  mutatingAction?: boolean;
};
type DiagnosticToolExecutionStartedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.started";
};
type DiagnosticToolExecutionCompletedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.completed";
  durationMs: number;
};
type DiagnosticToolExecutionErrorEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.error";
  durationMs: number;
  errorCategory: string;
  errorCode?: string;
  terminalReason?: DiagnosticToolTerminalReason;
};
type DiagnosticToolExecutionBlockedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.blocked";
  deniedReason: string;
  reason: string;
};
type DiagnosticSkillTelemetrySource = "bundled" | "unknown" | "workspace";
type DiagnosticSkillActivation = "command" | "read";
type DiagnosticSkillUsedEvent = DiagnosticSessionEvent & {
  type: "skill.used";
  runId?: string;
  agentId?: string;
  skillName: string;
  skillSource: DiagnosticSkillTelemetrySource;
  activation: DiagnosticSkillActivation;
  toolName?: string;
  toolCallId?: string;
};
type DiagnosticExecProcessCompletedEvent = DiagnosticBaseEvent & {
  type: "exec.process.completed";
  sessionKey?: string;
  target: "host" | "sandbox";
  mode: "child" | "pty";
  outcome: "completed" | "failed";
  durationMs: number;
  commandLength: number;
  exitCode?: number;
  exitSignal?: string;
  timedOut?: boolean;
  failureKind?: "shell-command-not-found" | "shell-not-executable" | "overall-timeout" | "no-output-timeout" | "signal" | "aborted" | "runtime-error";
};
type DiagnosticExecApprovalFollowupSuppressedEvent = DiagnosticBaseEvent & {
  type: "exec.approval.followup_suppressed";
  approvalId: string;
  reason: "session_rebound";
  phase: "direct_delivery" | "gateway_preflight";
};
type DiagnosticRunBaseEvent = DiagnosticBaseEvent & DiagnosticRunScopeFields;
type DiagnosticRunStartedEvent = DiagnosticRunBaseEvent & {
  type: "run.started";
};
type DiagnosticRunCompletedEvent = DiagnosticRunBaseEvent & {
  type: "run.completed";
  durationMs: number;
  outcome: "completed" | "aborted" | "blocked" | "error";
  errorCategory?: string;
  blockedBy?: string;
};
type DiagnosticHarnessRunPhase = "prepare" | "start" | "send" | "resolve" | "cleanup";
type DiagnosticHarnessRunOutcome = "completed" | "aborted" | "timed_out" | "error";
type DiagnosticHarnessRunBaseEvent = DiagnosticBaseEvent & DiagnosticRunScopeFields & {
  harnessId: string;
  pluginId?: string;
};
type DiagnosticHarnessRunStartedEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.started";
};
type DiagnosticAgentCommentaryEvent = DiagnosticBaseEvent & DiagnosticAgentCommentaryFields;
type DiagnosticHarnessRunCompletedEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.completed";
  durationMs: number;
  outcome: DiagnosticHarnessRunOutcome;
  resultClassification?: "empty" | "reasoning-only" | "planning-only";
  yieldDetected?: boolean;
  itemLifecycle?: {
    startedCount: number;
    completedCount: number;
    activeCount: number;
  };
};
type DiagnosticHarnessRunErrorEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.error";
  durationMs: number;
  phase: DiagnosticHarnessRunPhase;
  errorCategory: string;
  cleanupFailed?: boolean;
};
type DiagnosticModelCallBaseEvent = DiagnosticSessionEvent & {
  runId: string;
  agentId?: string;
  callId: string;
  provider: string;
  model: string;
  api?: string;
  transport?: string;
  /** Defaults to request for emitters created before turn-level CLI diagnostics. */
  observationUnit?: "request" | "turn";
  contextTokenBudget?: number;
  contextWindowSource?: "model" | "modelsConfig" | "agentContextTokens" | "default";
  contextWindowReferenceTokens?: number;
  upstreamRequestIdHash?: string;
  promptStats?: DiagnosticModelCallPromptStats;
};
type DiagnosticModelCallStartedEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.started";
};
type DiagnosticModelCallEndedEvent = DiagnosticModelCallBaseEvent & {
  durationMs: number;
  providerProcessingMs?: number;
  providerWaitEstimateMs?: number;
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  usage?: DiagnosticModelCallUsage;
};
type DiagnosticModelCallCompletedEvent = DiagnosticModelCallEndedEvent & {
  type: "model.call.completed";
};
type DiagnosticModelCallErrorEvent = DiagnosticModelCallEndedEvent & {
  type: "model.call.error";
  errorCategory: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  memory?: DiagnosticMemoryUsage;
};
type DiagnosticModelCallPromptStats = Readonly<{
  inputMessagesCount?: number;
  inputMessagesChars?: number;
  systemPromptChars?: number;
  toolDefinitionsCount?: number;
  toolDefinitionsChars?: number;
  totalChars?: number;
}>;
type DiagnosticModelCallUsage = Readonly<{
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  reasoningTokens?: number;
  promptTokens?: number;
  total?: number;
}>;
type DiagnosticContextAssembledEvent = DiagnosticSessionEvent & {
  type: "context.assembled";
  runId: string;
  provider: string;
  model: string;
  channel?: string;
  trigger?: string;
  messageCount: number;
  historyTextChars: number;
  historyImageBlocks: number;
  maxMessageTextChars: number;
  systemPromptChars: number;
  promptChars: number;
  promptImages: number;
  contextTokenBudget?: number;
  reserveTokens?: number;
};
type DiagnosticMemorySampleEvent = DiagnosticBaseEvent & {
  type: "diagnostic.memory.sample";
  memory: DiagnosticMemoryUsage;
  uptimeMs?: number;
};
type DiagnosticMemoryPressureEvent = DiagnosticBaseEvent & DiagnosticMemoryPressureFields;
type DiagnosticPayloadLargeEvent = DiagnosticBaseEvent & {
  type: "payload.large";
  surface: string;
  action: "rejected" | "truncated" | "chunked";
  bytes?: number;
  limitBytes?: number;
  count?: number;
  channel?: string;
  pluginId?: string;
  reason?: string;
};
type DiagnosticLogRecordEvent = DiagnosticBaseEvent & {
  type: "log.record";
  level: string;
  message: string;
  loggerName?: string;
  loggerParents?: string[];
  attributes?: Record<string, string | number | boolean>;
  code?: {
    line?: number;
    functionName?: string;
  };
};
type DiagnosticTelemetryExporterEvent = DiagnosticBaseEvent & {
  type: "telemetry.exporter";
  exporter: string;
  signal: "traces" | "metrics" | "logs";
  status: "started" | "failure" | "dropped";
  reason?: "configured" | "emit_failed" | "handler_failed" | "queue_full" | "shutdown_failed" | "start_failed" | "unsupported_protocol";
  errorCategory?: string;
};
type DiagnosticEventPayload = DiagnosticGatewayRpcEvent | (DiagnosticBaseEvent & DiagnosticRuntimeMeasurementFields) | (DiagnosticBaseEvent & DiagnosticWorkerRequestFields) | DiagnosticUsageEvent | DiagnosticWebhookReceivedEvent | DiagnosticWebhookProcessedEvent | DiagnosticWebhookErrorEvent | DiagnosticMessageQueuedEvent | DiagnosticMessageReceivedEvent | DiagnosticMessageDispatchStartedEvent | DiagnosticMessageDispatchCompletedEvent | DiagnosticMessageProcessedEvent | DiagnosticMessageDeliveryStartedEvent | DiagnosticMessageDeliveryCompletedEvent | DiagnosticMessageDeliveryErrorEvent | DiagnosticTalkEvent | DiagnosticSessionStateEvent | DiagnosticSessionLongRunningEvent | DiagnosticSessionStalledEvent | DiagnosticSessionStuckEvent | DiagnosticSessionRecoveryRequestedEvent | DiagnosticSessionRecoveryCompletedEvent | DiagnosticSessionTurnCreatedEvent | DiagnosticLaneEnqueueEvent | DiagnosticLaneDequeueEvent | DiagnosticRunAttemptEvent | DiagnosticRunProgressEvent | DiagnosticRunExecutionPhaseEvent | DiagnosticHeartbeatEvent | DiagnosticLivenessWarningEvent | DiagnosticPhaseCompletedEvent | DiagnosticToolLoopEvent | DiagnosticToolExecutionStartedEvent | DiagnosticToolExecutionCompletedEvent | DiagnosticToolExecutionErrorEvent | DiagnosticToolExecutionBlockedEvent | DiagnosticSkillUsedEvent | DiagnosticExecProcessCompletedEvent | DiagnosticExecApprovalFollowupSuppressedEvent | DiagnosticRunStartedEvent | DiagnosticRunCompletedEvent | DiagnosticHarnessRunStartedEvent | DiagnosticAgentCommentaryEvent | DiagnosticHarnessRunCompletedEvent | DiagnosticHarnessRunErrorEvent | DiagnosticModelCallStartedEvent | DiagnosticModelCallCompletedEvent | DiagnosticModelCallErrorEvent | (DiagnosticBaseEvent & {
  type: "secret.egress";
  outcome: "forwarded" | "refused";
  substituted: boolean;
}) | (DiagnosticBaseEvent & {
  type: "tool.catalog";
  source: "builtin" | "client";
  mode: "code-mode" | "tool-search";
  toolCount: number;
}) | DiagnosticContextAssembledEvent | DiagnosticMemorySampleEvent | DiagnosticMemoryPressureEvent | (DiagnosticBaseEvent & DiagnosticChildProcessSpawnFields) | DiagnosticPayloadLargeEvent | DiagnosticLogRecordEvent | DiagnosticSecurityEvent | DiagnosticTelemetryExporterEvent | (DiagnosticBaseEvent & DiagnosticAsyncQueueDroppedFields) | DiagnosticFailoverEvent;
type DiagnosticNonSecurityEventPayload = Exclude<DiagnosticEventPayload, DiagnosticSecurityEvent>;
type DiagnosticEventInput = DiagnosticNonSecurityEventPayload extends (infer Event) ? Event extends DiagnosticEventPayload ? Omit<Event, "seq" | "ts"> : never : never;
type DiagnosticEventMetadata = Readonly<{
  internal?: boolean;
  trustedTraceContext?: boolean;
  trusted: boolean;
}>;
type DiagnosticModelCallContent = Readonly<{
  inputMessages?: unknown;
  outputMessages?: unknown;
  systemPrompt?: string;
  toolDefinitions?: unknown;
}>;
type DiagnosticToolCallContent = Readonly<{
  toolInput?: unknown;
  toolOutput?: unknown;
}>;
type DiagnosticSkillUsagePrivateData = Readonly<{
  skillFile: string;
}>;
type DiagnosticEventPrivateData = Readonly<{
  /** Raw failure text for trusted diagnostics exporters; never part of the public event payload. */
  errorMessage?: string;
  modelContent?: DiagnosticModelCallContent;
  skillUsage?: DiagnosticSkillUsagePrivateData;
  toolContent?: DiagnosticToolCallContent;
  messageContent?: {
    userPrompt?: string;
    finalResponse?: string;
  };
  harnessContent?: {
    userPrompt?: string;
    finalResponse?: string;
  };
}>;
type DiagnosticEventListener = (evt: DiagnosticEventPayload, metadata: DiagnosticEventMetadata) => void;
type TrustedToolExecutionEvent = Extract<DiagnosticEventPayload, {
  type: "tool.execution.started" | "tool.execution.completed" | "tool.execution.error" | "tool.execution.blocked";
}>;
/** Returns whether diagnostics are enabled for a loaded config; missing config defaults enabled. */
declare function isDiagnosticsEnabled(config?: OpenClawConfig): boolean;
/** Returns the current process-wide diagnostic dispatcher enable flag. */
declare function areDiagnosticsEnabledForProcess(): boolean;
/** Waits until async diagnostic events queued when called are no longer pending. */
declare function waitForDiagnosticEventsDrained(): Promise<void>;
/** Emits an untrusted diagnostic event from external/plugin-facing code. */
declare function emitDiagnosticEvent(event: DiagnosticEventInput): void;
/** Emits a trusted diagnostic event from core/runtime-owned instrumentation. */
declare function emitTrustedDiagnosticEvent(event: DiagnosticEventInput): void;
/** Emits a trusted diagnostic event with private listener-only payload data. */
declare function emitTrustedDiagnosticEventWithPrivateData(event: DiagnosticEventInput, privateData?: DiagnosticEventPrivateData): void;
/** Subscribes to diagnostic events with dispatcher metadata. */
declare function onInternalDiagnosticEvent(listener: DiagnosticEventListener, filter?: InternalDiagnosticEventInterest<DiagnosticEventPayload["type"]>): () => void;
/** Checks currently queued async diagnostic events without draining the queue. */
declare function hasPendingInternalDiagnosticEvent(predicate: (event: DiagnosticEventPayload, metadata: DiagnosticEventMetadata) => boolean): boolean;
/** Subscribes to public untrusted diagnostic events only. */
declare function onDiagnosticEvent(listener: (evt: DiagnosticEventPayload) => void): () => void;
/** Returns whether listener metadata marks dispatcher-internal provenance. */
declare function isInternalDiagnosticEventMetadata(metadata: DiagnosticEventMetadata): boolean;
/** Resets dispatcher state between tests. */
declare function resetDiagnosticEventsForTest(): void;
//#endregion
export { createDiagnosticTraceContextFromActiveScope as A, TalkEvent as C, DiagnosticTraceContext as D, TalkTransport as E, isValidDiagnosticTraceId as F, parseDiagnosticTraceparent as I, EmbeddedAgentExecutionPhase as L, freezeDiagnosticTraceContext as M, isValidDiagnosticSpanId as N, createChildDiagnosticTraceContext as O, isValidDiagnosticTraceFlags as P, DiagnosticMemoryUsage as R, InternalDiagnosticEventInterest as S, TalkEventInput as T, isInternalDiagnosticEventMetadata as _, DiagnosticLivenessWarningReason as a, resetDiagnosticEventsForTest as b, DiagnosticSessionState as c, areDiagnosticsEnabledForProcess as d, emitDiagnosticEvent as f, isDiagnosticsEnabled as g, hasPendingInternalDiagnosticEvent as h, DiagnosticEventPrivateData as i, formatDiagnosticTraceparent as j, createDiagnosticTraceContext as k, DiagnosticToolTerminalReason as l, emitTrustedDiagnosticEventWithPrivateData as m, DiagnosticEventMetadata as n, DiagnosticModelCallContent as o, emitTrustedDiagnosticEvent as p, DiagnosticEventPayload as r, DiagnosticSessionActiveWorkKind as s, DiagnosticEventInput as t, TrustedToolExecutionEvent as u, onDiagnosticEvent as v, TalkEventContext as w, waitForDiagnosticEventsDrained as x, onInternalDiagnosticEvent as y };