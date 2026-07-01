/** Pending or retryable inbound channel event stored in the durable ingress queue. */
export type ChannelIngressQueueRecord<TPayload, TMetadata = unknown> = {
    id: string;
    channelId: string;
    accountId: string;
    queueName: string;
    payload: TPayload;
    metadata?: TMetadata;
    receivedAt: number;
    updatedAt: number;
    laneKey?: string;
    attempts: number;
    lastAttemptAt?: number;
    lastError?: string;
};
/** Pending ingress event currently claimed by a worker. */
export type ChannelIngressQueueClaim<TPayload, TMetadata = unknown> = ChannelIngressQueueRecord<TPayload, TMetadata> & {
    claim: {
        token: string;
        ownerId: string;
        claimedAt: number;
    };
};
/** Minimal claim reference used to guard completion/release/failure with a claim token. */
export type ChannelIngressQueueClaimRef = {
    id: string;
    claim: {
        token: string;
    };
};
/** Completed ingress event tombstone retained for duplicate detection. */
export type ChannelIngressQueueCompletedRecord<TCompletedMetadata = unknown> = {
    id: string;
    channelId: string;
    accountId: string;
    queueName: string;
    completedAt: number;
    metadata?: TCompletedMetadata;
};
/** Failed ingress event tombstone retained for duplicate detection and diagnostics. */
export type ChannelIngressQueueFailedRecord = {
    id: string;
    channelId: string;
    accountId: string;
    queueName: string;
    failedAt: number;
    reason: string;
    message?: string;
};
/** Retention options for pending, completed, and failed ingress queue rows. */
export type ChannelIngressQueuePruneOptions = {
    pendingTtlMs?: number;
    completedTtlMs?: number;
    failedTtlMs?: number;
    pendingMaxEntries?: number;
    completedMaxEntries?: number;
    failedMaxEntries?: number;
    protectIds?: Iterable<string>;
    now?: number;
};
/** Result of enqueueing a possibly duplicate ingress event id. */
export type ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata> = {
    kind: "accepted";
    duplicate: false;
    record: ChannelIngressQueueRecord<TPayload, TMetadata>;
} | {
    kind: "pending";
    duplicate: true;
    record: ChannelIngressQueueRecord<TPayload, TMetadata>;
} | {
    kind: "claimed";
    duplicate: true;
    record: ChannelIngressQueueClaim<TPayload, TMetadata>;
} | {
    kind: "completed";
    duplicate: true;
    record: ChannelIngressQueueCompletedRecord<TCompletedMetadata>;
} | {
    kind: "failed";
    duplicate: true;
    record: ChannelIngressQueueFailedRecord;
};
/** Durable FIFO-ish ingress queue with claims, duplicate detection, and retention pruning. */
export type ChannelIngressQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown> = {
    enqueue(id: string, payload: TPayload, options?: {
        metadata?: TMetadata;
        receivedAt?: number;
        laneKey?: string;
    }): Promise<ChannelIngressQueueEnqueueResult<TPayload, TMetadata, TCompletedMetadata>>;
    listPending(options?: {
        limit?: number | "all";
        orderBy?: "received" | "id";
    }): Promise<Array<ChannelIngressQueueRecord<TPayload, TMetadata>>>;
    listClaims(): Promise<Array<ChannelIngressQueueClaim<TPayload, TMetadata>>>;
    claimNext(options?: {
        ownerId?: string;
        blockedLaneKeys?: Iterable<string>;
        staleMs?: number;
        orderBy?: "received" | "id";
        scanLimit?: number;
        candidateIds?: Iterable<string>;
        deriveLaneKey?: (record: ChannelIngressQueueRecord<TPayload, TMetadata>) => string | undefined;
    }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
    claim(id: string, options?: {
        ownerId?: string;
    }): Promise<ChannelIngressQueueClaim<TPayload, TMetadata> | null>;
    refreshClaim?(claim: ChannelIngressQueueClaimRef, options?: {
        refreshedAt?: number;
    }): Promise<boolean>;
    complete(idOrClaim: string | ChannelIngressQueueClaimRef, options?: {
        metadata?: TCompletedMetadata;
        completedAt?: number;
    }): Promise<boolean>;
    release(idOrClaim: string | ChannelIngressQueueClaimRef, options?: {
        lastError?: string;
        releasedAt?: number;
    }): Promise<boolean>;
    fail(idOrClaim: string | ChannelIngressQueueClaimRef, options: {
        reason: string;
        message?: string;
        failedAt?: number;
    }): Promise<boolean>;
    delete(idOrClaim: string | ChannelIngressQueueRecord<TPayload, TMetadata> | ChannelIngressQueueClaimRef): Promise<boolean>;
    recoverStaleClaims(options?: {
        staleMs?: number;
        now?: number;
        shouldRecover?: (claim: ChannelIngressQueueClaim<TPayload, TMetadata>) => boolean | Promise<boolean>;
    }): Promise<number>;
    prune(options?: ChannelIngressQueuePruneOptions): Promise<number>;
};
/** Construction options for a channel/account-scoped ingress queue. */
export type CreateChannelIngressQueueOptions = {
    channelId: string;
    accountId?: string;
    stateDir?: string;
    now?: () => number;
};
export declare function createStateDirEnv(stateDir: string, baseEnv?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
/** Creates a durable channel/account-scoped ingress queue backed by the OpenClaw state database. */
export declare function createChannelIngressQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: CreateChannelIngressQueueOptions): ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
