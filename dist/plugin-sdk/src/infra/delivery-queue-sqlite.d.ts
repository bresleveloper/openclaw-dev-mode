type QueueStatus = "pending" | "failed";
/** Indexed metadata extracted from queue payloads for diagnostics and recovery. */
export type DeliveryQueueRowMetadata = {
    entryKind?: string;
    sessionKey?: string;
    channel?: string;
    target?: string;
    accountId?: string;
};
/** Persisted queue entry fields common to all delivery queue payloads. */
export type DeliveryQueueEntryState = {
    id: string;
    enqueuedAt: number;
    retryCount: number;
    lastAttemptAt?: number;
    lastError?: string;
    platformSendStartedAt?: number;
    recoveryState?: string;
};
/** Insert or replace a delivery queue entry under a queue namespace. */
export declare function upsertDeliveryQueueEntry(params: {
    queueName: string;
    entry: DeliveryQueueEntryState;
    metadata?: DeliveryQueueRowMetadata;
    status?: QueueStatus;
    stateDir?: string;
}): void;
/** Load a single pending delivery queue entry. */
export declare function loadDeliveryQueueEntry(queueName: string, id: string, stateDir?: string): DeliveryQueueEntryState | null;
/** Load all pending entries for a queue namespace in database order. */
export declare function loadDeliveryQueueEntries(queueName: string, stateDir?: string): DeliveryQueueEntryState[];
/** Delete a pending delivery queue entry after successful delivery. */
export declare function deleteDeliveryQueueEntry(queueName: string, id: string, stateDir?: string): void;
/** Load, transform, and persist a pending delivery queue entry. */
export declare function updateDeliveryQueueEntry(queueName: string, id: string, stateDir: string | undefined, update: (entry: DeliveryQueueEntryState) => DeliveryQueueEntryState): void;
/** Mark a pending delivery queue entry as failed for later diagnostics. */
export declare function moveDeliveryQueueEntryToFailed(queueName: string, id: string, stateDir?: string): void;
export {};
