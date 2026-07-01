import { t as DeliveryContext } from "./delivery-context.types-DyNhFIjW.js";

//#region src/process/command-queue.types.d.ts
/**
 * Public enqueue knobs shared by command-lane callers and narrower injection
 * points that should not import the full queue implementation.
 */
type CommandQueueEnqueueOptions = {
  warnAfterMs?: number;
  onWait?: (waitMs: number, queuedAhead: number) => void;
  taskTimeoutMs?: number;
  taskTimeoutProgressAtMs?: () => number | undefined;
  taskTimeoutAbortSignal?: AbortSignal;
  taskTimeoutAbortGraceMs?: number; /** Ends the task after a caller-owned timeout cleanup grace has already elapsed. */
  taskTimeoutReleaseSignal?: AbortSignal;
  priority?: "foreground" | "normal" | "background";
};
/** Minimal queue function contract used by code that only needs to schedule work. */
type CommandQueueEnqueueFn = <T>(task: () => Promise<T>, opts?: CommandQueueEnqueueOptions) => Promise<T>;
//#endregion
//#region src/tasks/task-registry.types.d.ts
/** Runtime family that owns a task run lifecycle. */
type TaskRuntime = "subagent" | "acp" | "cli" | "cron";
type TaskStatus = "queued" | "running" | "succeeded" | "failed" | "timed_out" | "cancelled" | "lost";
type TaskDeliveryStatus = "pending" | "delivered" | "session_queued" | "failed" | "parent_missing" | "not_applicable";
type TaskNotifyPolicy = "done_only" | "state_changes" | "silent";
/** Semantic success detail for required-completion task outcomes. */
type TaskTerminalOutcome = "succeeded" | "blocked";
type TaskScopeKind = "session" | "system";
type TaskStatusCounts = Record<TaskStatus, number>;
type TaskRuntimeCounts = Record<TaskRuntime, number>;
type TaskRegistrySummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};
type TaskDeliveryState = {
  taskId: string;
  requesterOrigin?: DeliveryContext;
  lastNotifiedEventAt?: number;
};
type TaskRecord = {
  taskId: string;
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey: string;
  ownerKey: string;
  scopeKind: TaskScopeKind;
  childSessionKey?: string;
  parentFlowId?: string;
  parentTaskId?: string;
  agentId?: string;
  /** Agent store for requester transcripts whose session key is unscoped, such as `global`.
   * Task authorization remains keyed by ownerKey. */
  requesterAgentId?: string;
  runId?: string;
  label?: string;
  task: string;
  status: TaskStatus;
  deliveryStatus: TaskDeliveryStatus;
  notifyPolicy: TaskNotifyPolicy;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  lastEventAt?: number;
  cleanupAfter?: number;
  error?: string;
  progressSummary?: string;
  terminalSummary?: string;
  terminalOutcome?: TaskTerminalOutcome;
};
//#endregion
//#region src/tasks/task-flow-registry.types.d.ts
/** JSON value shape persisted with task-flow state and wait metadata. */
type JsonValue = null | boolean | number | string | JsonValue[] | {
  [key: string]: JsonValue;
};
type TaskFlowSyncMode = "task_mirrored" | "managed";
/** Lifecycle status for multi-step task flows. */
type TaskFlowStatus = "queued" | "running" | "waiting" | "blocked" | "succeeded" | "failed" | "cancelled" | "lost";
type TaskFlowRecord = {
  flowId: string;
  syncMode: TaskFlowSyncMode;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  controllerId?: string;
  revision: number;
  status: TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  blockedTaskId?: string;
  blockedSummary?: string;
  stateJson?: JsonValue;
  waitJson?: JsonValue;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};
//#endregion
export { TaskDeliveryStatus as a, TaskRegistrySummary as c, TaskScopeKind as d, TaskStatus as f, CommandQueueEnqueueFn as h, TaskDeliveryState as i, TaskRuntime as l, TaskTerminalOutcome as m, TaskFlowRecord as n, TaskNotifyPolicy as o, TaskStatusCounts as p, TaskFlowStatus as r, TaskRecord as s, JsonValue as t, TaskRuntimeCounts as u };