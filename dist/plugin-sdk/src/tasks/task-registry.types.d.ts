import type { DeliveryContext } from "../utils/delivery-context.types.js";
/** Runtime family that owns a task run lifecycle. */
export type TaskRuntime = "subagent" | "acp" | "cli" | "cron";
export type TaskStatus = "queued" | "running" | "succeeded" | "failed" | "timed_out" | "cancelled" | "lost";
export type TaskDeliveryStatus = "pending" | "delivered" | "session_queued" | "failed" | "parent_missing" | "not_applicable";
export type TaskNotifyPolicy = "done_only" | "state_changes" | "silent";
/** Semantic success detail for required-completion task outcomes. */
export type TaskTerminalOutcome = "succeeded" | "blocked";
export type TaskScopeKind = "session" | "system";
export type TaskStatusCounts = Record<TaskStatus, number>;
export type TaskRuntimeCounts = Record<TaskRuntime, number>;
export declare function parseTaskRuntime(value: unknown): TaskRuntime;
export declare function parseTaskStatus(value: unknown): TaskStatus;
export declare function parseTaskDeliveryStatus(value: unknown): TaskDeliveryStatus;
export declare function parseTaskNotifyPolicy(value: unknown): TaskNotifyPolicy;
export declare function parseTaskScopeKind(value: unknown): TaskScopeKind;
export declare function parseOptionalTaskTerminalOutcome(value: unknown): TaskTerminalOutcome | undefined;
export type TaskRegistrySummary = {
    total: number;
    active: number;
    terminal: number;
    failures: number;
    byStatus: TaskStatusCounts;
    byRuntime: TaskRuntimeCounts;
};
export type TaskEventKind = TaskStatus | "progress";
export type TaskEventRecord = {
    at: number;
    kind: TaskEventKind;
    summary?: string;
};
export type TaskDeliveryState = {
    taskId: string;
    requesterOrigin?: DeliveryContext;
    lastNotifiedEventAt?: number;
};
export type TaskRecord = {
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
