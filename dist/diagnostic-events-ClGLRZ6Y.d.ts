import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { t as SchemaContract } from "./schema-contract-c2sTcmgZ.js";
import { On as SessionsListParams, et as TalkEvent$1 } from "./index-DSy-_0fC.js";
import { a as DiagnosticRuntimeMeasurementFields, i as DiagnosticMemoryUsage, n as DiagnosticChildProcessSpawnFields, o as DiagnosticWorkerRequestFields, r as DiagnosticMemoryPressureFields, t as DiagnosticAsyncQueueDroppedFields } from "./diagnostic-process-types-BIzAFG7u.js";
import { r as GatewayClientId } from "./client-info-CIRM8sMN.js";
declare const EMBEDDED_AGENT_EXECUTION_PHASES: {
  readonly runner_entered: {
    readonly label: "runner-entered";
    readonly startupPhase: "preparing_workspace";
  };
  readonly workspace: {
    readonly label: "workspace";
    readonly startupPhase: "preparing_workspace";
  };
  readonly runtime_plugins: {
    readonly label: "runtime-plugins";
    readonly startupPhase: "preparing_workspace";
  };
  readonly before_agent_reply: {
    readonly label: "before-agent-reply";
    readonly startupPhase: "preparing_context";
  };
  readonly model_resolution: {
    readonly label: "model-resolution";
    readonly startupPhase: "preparing_context";
  };
  readonly auth: {
    readonly label: "auth";
    readonly startupPhase: "preparing_context";
  };
  readonly context_engine: {
    readonly label: "context-engine";
    readonly startupPhase: "preparing_context";
  };
  readonly attempt_dispatch: {
    readonly label: "attempt-dispatch";
    readonly startupPhase: "preparing_context";
  };
  readonly context_assembled: {
    readonly label: "context-assembled";
    readonly startupPhase: "preparing_context";
  };
  readonly turn_accepted: {
    readonly label: "turn-accepted";
    readonly startupPhase: "starting_model";
  };
  readonly process_spawned: {
    readonly label: "process-spawned";
    readonly startupPhase: "starting_model";
  };
  readonly tool_execution_started: {
    readonly label: "tool-execution-started";
    readonly startupPhase: undefined;
  };
  readonly assistant_output_started: {
    readonly label: "assistant-output-started";
    readonly startupPhase: undefined;
  };
  readonly model_call_started: {
    readonly label: "model-call-started";
    readonly startupPhase: "starting_model";
  };
};
type EmbeddedAgentExecutionPhase = keyof typeof EMBEDDED_AGENT_EXECUTION_PHASES;
type EmbeddedAgentExecutionPhaseInfo = {
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
/** Canonical Talk vocabulary shared by protocol validation and runtime sequencing. */
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
type InternalDiagnosticEventInterest<EventType extends string = string> = Readonly<{
  include?: readonly EventType[];
  exclude?: readonly EventType[];
  /** Restricts trusted events only; untrusted events still use include/exclude. */
  includeTrusted?: readonly EventType[];
  /** False avoids requesting prompt sizes; other listeners may still request them. */
  includePromptStats?: boolean;
}>;
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
/** Validates external trace fields without generating ids or changing their case. */
declare function normalizeDiagnosticTraceContext(value: unknown): DiagnosticTraceContext | undefined;
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
type DiagnosticBaseEvent = {
  ts: number;
  seq: number;
  trace?: DiagnosticTraceContext;
};
type DiagnosticEventMetadata = Readonly<{
  internal?: boolean;
  trustedTraceContext?: boolean;
  trusted: boolean;
}>;
/** Returns whether listener metadata marks dispatcher-internal provenance. */
declare function isInternalDiagnosticEventMetadata(metadata: DiagnosticEventMetadata): boolean;
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
type DiagnosticModelCallPromptStats = Readonly<{
  inputMessagesCount?: number;
  inputMessagesChars?: number;
  systemPromptChars?: number;
  toolDefinitionsCount?: number;
  toolDefinitionsChars?: number;
  totalChars?: number;
}>;
type DiagnosticModelCallUsage = Readonly<{
  usageReport?: {
    state: "available" | "unavailable";
  };
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  cacheWrite1h?: number;
  cacheWrite5m?: number;
  reasoningTokens?: number;
  promptTokens?: number;
  total?: number;
}>;
type DiagnosticModelCallTerminalFields = {
  durationMs: number;
  providerProcessingMs?: number;
  providerWaitEstimateMs?: number;
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  usage?: DiagnosticModelCallUsage;
  /** Provider-reported model from the terminal message; `model` stays the requested id, never synthesized. */
  responseModel?: string;
};
type DiagnosticModelCallBaseEvent = DiagnosticBaseEvent & Pick<DiagnosticRunScopeFields, "sessionKey" | "sessionId"> & {
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
type DiagnosticModelCallEndedEvent = DiagnosticModelCallBaseEvent & DiagnosticModelCallTerminalFields;
type DiagnosticModelCallCompletedEvent = DiagnosticModelCallEndedEvent & {
  type: "model.call.completed";
};
type DiagnosticModelCallErrorEvent = DiagnosticModelCallEndedEvent & {
  type: "model.call.error";
  errorCategory: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  memory?: DiagnosticMemoryUsage;
};
type DiagnosticModelResponseObservedEvent = Omit<DiagnosticModelCallBaseEvent, "observationUnit" | "promptStats" | "upstreamRequestIdHash"> & {
  type: "model.response.observed";
  upstreamRequestIdHash: string;
  /** The event timestamp is receipt time, not a provider completion boundary. */
  timestampSource: "receipt";
  usageSource: "native-normalized";
  usageScope: "response";
  usage?: DiagnosticModelCallUsage;
};
/** Bounded internal diagnostic labels, independent of execution policy triggers. */
type IsolatedCompletionPurpose = "isolated-completion" | "session-activity-summary" | "session-observer" | "conversation-label" | "composer-prediction" | "progress-narration" | "transcript-summary" | "skill-diet" | "plugin-completion";
type DiagnosticModelUsageFields = {
  type: "model.usage";
  channel?: string;
  agentId?: string;
  provider?: string;
  model?: string;
  purpose?: IsolatedCompletionPurpose;
  runtimeKind?: "cli" | "harness";
  /** Isolated runtime dispatch identity, not a provider request or billing receipt. */
  completionId?: string;
  attemptId?: string;
  usageReport?: {
    state: "available" | "unavailable";
  };
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
type ExecProcessFailureKind = "shell-command-not-found" | "shell-not-executable" | "overall-timeout" | "no-output-timeout" | "memory-limit" | "signal" | "aborted" | "runtime-error";
type SessionEventRowsResetCause = "close" | "delivery-lost" | "generation" | "evicted" | "projection";
type SessionsListBaseMissReason = "unknown-base" | "all-rows-changed";
type SessionsListAttribution = {
  clientKind: GatewayClientId;
  source: "wire" | "internal";
  callerSource: NonNullable<SessionsListParams["source"]> | "unspecified";
  rowMode: NonNullable<SessionsListParams["rowMode"]> | "full" | "other";
  filter: "search" | "children" | "owner" | "involving" | "active" | "general";
};
/** Payload-free facts from authenticated Gateway WebSocket request owners. */
type DiagnosticGatewayRpcFields = {
  type: "gateway.rpc";
  /** Registered method name, or a fixed other/unknown bucket. */
  method: string;
} & ({
  phase: "received";
  /** Coarse handshake identity; never a device id, platform, or display name. */
  clientKind?: "control-ui" | "macos" | "ios" | "android" | "cli" | "node" | "plugin" | "other";
  cronList?: {
    clientKind: GatewayClientId;
    source: "wire" | "internal";
    scope: "global" | "agent" | "session";
    compact: boolean;
    page: "first" | "append";
  };
  sessionsList?: SessionsListAttribution;
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
  sessionsList?: SessionsListAttribution & {
    rowsOutcome: "unchanged" | "delta" | "full-no-base" | "full-with-base" | "not-sidebar";
    baseMissReason?: SessionsListBaseMissReason;
  };
  chatHistory?: {
    clientKind: GatewayClientId;
    source: "wire" | "internal";
    shape: "cursor" | "older" | "pending" | "receipt" | "anchor" | "tail";
    limitBucket: "<=20" | "<=80" | "<=200" | ">200";
    outcome: "delta" | "reset" | "page";
  };
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
type GatewayWsPresenceMode = "delta" | "reset" | "legacy";
type GatewayWsSessionEventAttribution = {
  reason: string;
  delivery: "subscribed" | "roster";
};
/** Payload-free observations from the physical WebSocket transport. */
type DiagnosticGatewayWsFields = {
  type: "gateway.ws.event";
  event: string;
  count: number;
  bytes: number;
  /** Post-codec payload bytes; excludes WebSocket and lower-level headers. */
  wireBytes?: number;
  /** Cumulative raw frame counts by fixed upper byte bound, including +Inf. */
  frameBytes?: Record<string, number>;
  sessionEvent?: GatewayWsSessionEventAttribution;
  presenceMode?: GatewayWsPresenceMode;
} | {
  type: "gateway.ws.connections";
  operators: number;
};
type DiagnosticGatewayFields = DiagnosticGatewayRpcFields | DiagnosticGatewayWsFields | {
  type: "sessions.list.baseline.retired";
  cause: "projection-revision" | "config" | "identity" | "selection-reset" | "view-evicted" | "history-evicted";
} | {
  /** Process totals for retained session-list views and their estimated memory. */
  type: "sessions.list.retention";
  views: number;
  refs: number;
  estimatedBytes: number;
} | {
  /** Sampled owner inventory; bounded data estimates exclude closure/native storage. */
  type: "sessions.projection.retention";
  projections: number;
  entries: number;
  estimatedBytes: number;
  truncatedProjections: number;
} | {
  /** Process totals for per-connection session-event field-hash vectors. */
  type: "sessions.event.retention";
  entries: number;
  estimatedBytes: number;
} | {
  /** Number of retained wire baselines retired by one bounded lifecycle cause. */
  type: "sessions.event.rows.reset";
  cause: SessionEventRowsResetCause;
  count: number;
};
type DiagnosticSessionState = "idle" | "processing" | "waiting";
type DiagnosticSessionEvent = DiagnosticBaseEvent & Pick<DiagnosticRunScopeFields, "sessionKey" | "sessionId">;
type DiagnosticUsageEvent = DiagnosticSessionEvent & DiagnosticModelUsageFields;
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
type DiagnosticRunExecutionPhaseEvent = DiagnosticBaseEvent & EmbeddedAgentExecutionPhaseInfo & {
  type: "run.execution_phase";
  sessionKey?: string;
  sessionId: string;
  runId: string;
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
  detector: "tool_repeat";
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
type DiagnosticSkillUsedEvent = DiagnosticSessionEvent & {
  type: "skill.used";
  runId?: string;
  agentId?: string;
  skillName: string;
  skillSource: "bundled" | "unknown" | "workspace";
  activation: "command" | "read";
  /** SHA-256 of the complete instructions actually delivered, when known. */
  skillFingerprint?: string;
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
  failureKind?: ExecProcessFailureKind;
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
type DiagnosticEventPayload = (DiagnosticBaseEvent & DiagnosticGatewayFields) | (DiagnosticBaseEvent & DiagnosticRuntimeMeasurementFields) | (DiagnosticBaseEvent & DiagnosticWorkerRequestFields) | DiagnosticUsageEvent | DiagnosticWebhookReceivedEvent | DiagnosticWebhookProcessedEvent | DiagnosticWebhookErrorEvent | DiagnosticMessageQueuedEvent | DiagnosticMessageReceivedEvent | DiagnosticMessageDispatchStartedEvent | DiagnosticMessageDispatchCompletedEvent | DiagnosticMessageProcessedEvent | DiagnosticMessageDeliveryStartedEvent | DiagnosticMessageDeliveryCompletedEvent | DiagnosticMessageDeliveryErrorEvent | DiagnosticTalkEvent | DiagnosticSessionStateEvent | DiagnosticSessionLongRunningEvent | DiagnosticSessionStalledEvent | DiagnosticSessionStuckEvent | DiagnosticSessionRecoveryRequestedEvent | DiagnosticSessionRecoveryCompletedEvent | DiagnosticSessionTurnCreatedEvent | DiagnosticLaneEnqueueEvent | DiagnosticLaneDequeueEvent | DiagnosticRunAttemptEvent | DiagnosticRunProgressEvent | DiagnosticRunExecutionPhaseEvent | DiagnosticHeartbeatEvent | DiagnosticLivenessWarningEvent | DiagnosticPhaseCompletedEvent | DiagnosticToolLoopEvent | DiagnosticToolExecutionStartedEvent | DiagnosticToolExecutionCompletedEvent | DiagnosticToolExecutionErrorEvent | DiagnosticToolExecutionBlockedEvent | DiagnosticSkillUsedEvent | DiagnosticExecProcessCompletedEvent | DiagnosticExecApprovalFollowupSuppressedEvent | DiagnosticRunStartedEvent | DiagnosticRunCompletedEvent | DiagnosticHarnessRunStartedEvent | DiagnosticAgentCommentaryEvent | DiagnosticHarnessRunCompletedEvent | DiagnosticHarnessRunErrorEvent | DiagnosticModelCallStartedEvent | DiagnosticModelCallCompletedEvent | DiagnosticModelCallErrorEvent | DiagnosticModelResponseObservedEvent | (DiagnosticBaseEvent & {
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
/** Resets dispatcher state between tests. */
declare function resetDiagnosticEventsForTest(): void;
export { freezeDiagnosticTraceContext as A, TalkTransport as B, DiagnosticEventMetadata as C, createDiagnosticTraceContext as D, createChildDiagnosticTraceContext as E, parseDiagnosticTraceparent as F, EmbeddedAgentExecutionPhaseInfo as H, InternalDiagnosticEventInterest as I, TalkEvent as L, isValidDiagnosticTraceFlags as M, isValidDiagnosticTraceId as N, createDiagnosticTraceContextFromActiveScope as O, normalizeDiagnosticTraceContext as P, TalkEventContext as R, SessionEventRowsResetCause as S, DiagnosticTraceContext as T, EmbeddedAgentExecutionPhase as V, onInternalDiagnosticEvent as _, DiagnosticModelCallContent as a, GatewayWsPresenceMode as b, DiagnosticToolTerminalReason as c, emitDiagnosticEvent as d, emitTrustedDiagnosticEvent as f, onDiagnosticEvent as g, isDiagnosticsEnabled as h, DiagnosticLivenessWarningReason as i, isValidDiagnosticSpanId as j, formatDiagnosticTraceparent as k, TrustedToolExecutionEvent as l, hasPendingInternalDiagnosticEvent as m, DiagnosticEventPayload as n, DiagnosticSessionActiveWorkKind as o, emitTrustedDiagnosticEventWithPrivateData as p, DiagnosticEventPrivateData as r, DiagnosticSessionState as s, DiagnosticEventInput as t, areDiagnosticsEnabledForProcess as u, resetDiagnosticEventsForTest as v, isInternalDiagnosticEventMetadata as w, GatewayWsSessionEventAttribution as x, waitForDiagnosticEventsDrained as y, TalkEventInput as z };