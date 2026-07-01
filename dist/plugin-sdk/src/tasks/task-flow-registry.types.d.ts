import type { DeliveryContext } from "../utils/delivery-context.types.js";
import type { TaskNotifyPolicy } from "./task-registry.types.js";
/** JSON value shape persisted with task-flow state and wait metadata. */
export type JsonValue = null | boolean | number | string | JsonValue[] | {
    [key: string]: JsonValue;
};
export type TaskFlowSyncMode = "task_mirrored" | "managed";
/** Lifecycle status for multi-step task flows. */
export type TaskFlowStatus = "queued" | "running" | "waiting" | "blocked" | "succeeded" | "failed" | "cancelled" | "lost";
export declare function parseOptionalTaskFlowSyncMode(value: unknown): TaskFlowSyncMode | undefined;
export declare function parseTaskFlowStatus(value: unknown): TaskFlowStatus;
export type TaskFlowRecord = {
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
