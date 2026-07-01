import type { QueueSettings } from "./queue.js";
/** Queue decisions for messages that arrive while an agent run is active. */
export type ActiveRunQueueAction = "run-now" | "enqueue-followup" | "drop";
/** Resolves whether an active session should run, queue, or drop a new inbound turn. */
export declare function resolveActiveRunQueueAction(params: {
    isActive: boolean;
    isHeartbeat: boolean;
    shouldFollowup: boolean;
    queueMode: QueueSettings["mode"];
    resetTriggered?: boolean;
}): ActiveRunQueueAction;
