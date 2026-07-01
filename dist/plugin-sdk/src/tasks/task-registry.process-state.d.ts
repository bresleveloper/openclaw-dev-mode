import type { TaskDeliveryState, TaskRecord } from "./task-registry.types.js";
/** Process-local indexes backing task lookup, owner access, and pending delivery scans. */
type TaskRegistryProcessState = {
    tasks: Map<string, TaskRecord>;
    taskDeliveryStates: Map<string, TaskDeliveryState>;
    taskIdsByRunId: Map<string, Set<string>>;
    taskIdsByOwnerKey: Map<string, Set<string>>;
    taskIdsByParentFlowId: Map<string, Set<string>>;
    taskIdsByRelatedSessionKey: Map<string, Set<string>>;
    tasksWithPendingDelivery: Set<string>;
};
/** Returns the singleton in-process task registry state. */
export declare function getTaskRegistryProcessState(): TaskRegistryProcessState;
export {};
