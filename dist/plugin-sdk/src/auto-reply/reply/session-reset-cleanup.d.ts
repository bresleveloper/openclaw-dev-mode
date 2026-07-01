import { type ClearSessionQueueResult } from "./queue/cleanup.js";
/** Runtime cleanup result for reset-related queues and system events. */
type ClearSessionResetRuntimeStateResult = ClearSessionQueueResult & {
    systemEventsCleared: number;
};
/** Clears queued follow-ups and pending system events for reset session keys. */
export declare function clearSessionResetRuntimeState(keys: Array<string | undefined>): ClearSessionResetRuntimeStateResult;
export {};
