/**
 * Durable inbound receive journal.
 *
 * Tracks accepted, pending, completed, and retryable inbound platform events.
 */
import type { PluginStateKeyedStore } from "../../plugin-state/plugin-state-store.types.js";
import type { ChannelIngressQueue, ChannelIngressQueuePruneOptions } from "./ingress-queue.js";
/** Pending inbound receive record kept until agent dispatch or durable send completes. */
export type DurableInboundReceivePendingRecord<TPayload, TMetadata = unknown> = {
    id: string;
    payload: TPayload;
    metadata?: TMetadata;
    receivedAt: number;
    updatedAt: number;
    attempts: number;
    lastAttemptAt?: number;
    lastError?: string;
};
/** Completed inbound receive tombstone used to detect duplicate platform events. */
export type DurableInboundReceiveCompletedRecord<TMetadata = unknown> = {
    id: string;
    completedAt: number;
    metadata?: TMetadata;
};
/** Accept result for a new or duplicate inbound platform event. */
export type DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata> = {
    kind: "accepted";
    duplicate: false;
    record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
    kind: "pending";
    duplicate: true;
    record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
    kind: "completed";
    duplicate: true;
    record: DurableInboundReceiveCompletedRecord<TCompletedMetadata>;
};
/** Store-backed durable receive journal options. */
export type DurableInboundReceiveJournalOptions<TPayload, TMetadata, TCompletedMetadata> = {
    pendingStore: PluginStateKeyedStore<DurableInboundReceivePendingRecord<TPayload, TMetadata>>;
    completedStore: PluginStateKeyedStore<DurableInboundReceiveCompletedRecord<TCompletedMetadata>>;
    now?: () => number;
    pendingTtlMs?: number;
    completedTtlMs?: number;
};
/** Options recorded when accepting a pending inbound event. */
export type DurableInboundReceiveAcceptOptions<TMetadata> = {
    metadata?: TMetadata;
    receivedAt?: number;
};
/** Options recorded when marking an inbound event complete. */
export type DurableInboundReceiveCompleteOptions<TCompletedMetadata> = {
    metadata?: TCompletedMetadata;
    completedAt?: number;
};
/** Options recorded when releasing an inbound event for retry. */
export type DurableInboundReceiveReleaseOptions = {
    lastError?: string;
    releasedAt?: number;
};
/** Durable receive journal facade used by channel receive pipelines. */
export type DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata> = {
    accept(id: string, payload: TPayload, options?: DurableInboundReceiveAcceptOptions<TMetadata>): Promise<DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata>>;
    pending(): Promise<Array<DurableInboundReceivePendingRecord<TPayload, TMetadata>>>;
    complete(id: string, options?: DurableInboundReceiveCompleteOptions<TCompletedMetadata>): Promise<void>;
    release(id: string, options?: DurableInboundReceiveReleaseOptions): Promise<boolean>;
    deletePending(id: string): Promise<boolean>;
};
/** Queue-backed durable receive journal options with optional retention pruning. */
export type DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata> = {
    queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
    retention?: ChannelIngressQueuePruneOptions;
};
/** Creates a store-backed journal for accepting, completing, and retrying inbound events. */
export declare function createDurableInboundReceiveJournal<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
/** Adapts the shared channel ingress queue to the durable receive journal API. */
export declare function createDurableInboundReceiveJournalFromQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
