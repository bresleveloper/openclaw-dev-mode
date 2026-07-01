declare const NODE_PENDING_WORK_TYPES: readonly ["status.request", "location.request"];
/** Work item types that connected nodes understand today. */
export type NodePendingWorkType = (typeof NODE_PENDING_WORK_TYPES)[number];
declare const NODE_PENDING_WORK_PRIORITIES: readonly ["default", "normal", "high"];
/** Priority labels used for pending work drain ordering. */
export type NodePendingWorkPriority = (typeof NODE_PENDING_WORK_PRIORITIES)[number];
type NodePendingWorkItem = {
    id: string;
    type: NodePendingWorkType;
    priority: NodePendingWorkPriority;
    createdAtMs: number;
    expiresAtMs: number | null;
    payload?: Record<string, unknown>;
};
type DrainOptions = {
    maxItems?: number;
    includeDefaultStatus?: boolean;
    nowMs?: number;
};
type DrainResult = {
    revision: number;
    items: NodePendingWorkItem[];
    hasMore: boolean;
};
export declare function enqueueNodePendingWork(params: {
    nodeId: string;
    type: NodePendingWorkType;
    priority?: NodePendingWorkPriority;
    expiresInMs?: number;
    payload?: Record<string, unknown>;
}): {
    revision: number;
    item: NodePendingWorkItem;
    deduped: boolean;
};
/** Drains pending work for a node, including a baseline status request unless disabled. */
export declare function drainNodePendingWork(nodeId: string, opts?: DrainOptions): DrainResult;
/** Clears all pending work state for tests. */
export declare function resetNodePendingWorkForTests(): void;
/** Returns the number of node queues retained in memory for tests. */
export declare function getNodePendingWorkStateCountForTests(): number;
export {};
