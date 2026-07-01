import type { TaskRecord } from "./task-registry.types.js";
/** Returns only the session lookup fields needed by task status commands. */
export declare function getTaskSessionLookupByIdForStatus(taskId: string): Pick<TaskRecord, "requesterSessionKey" | "ownerKey" | "runId" | "agentId" | "requesterAgentId"> | undefined;
export declare function listTasksForSessionKeyForStatus(sessionKey: string): TaskRecord[];
export declare function listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey: string): TaskRecord[];
export declare function listTasksForAgentIdForStatus(agentId: string): TaskRecord[];
export declare function findTaskByRunIdForStatus(runId: string): TaskRecord | undefined;
