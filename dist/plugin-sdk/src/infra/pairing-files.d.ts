export { createAsyncLock, readJsonIfExists, tryReadJson, writeJson } from "./json-files.js";
/** Resolve pending/paired JSON file locations for one pairing namespace. */
export declare function resolvePairingPaths(baseDir: string | undefined, subdir: string): {
    dir: string;
    pendingPath: string;
    pairedPath: string;
};
/** Coerce persisted pairing maps, treating malformed arrays/scalars as empty state. */
export declare function coercePairingStateRecord<T>(value: unknown): Record<string, T>;
/** Remove pending requests older than the caller's pairing TTL. */
export declare function pruneExpiredPending<T extends {
    ts: number;
}>(pendingById: Record<string, T>, nowMs: number, ttlMs: number): void;
/** Result shape for creating or refreshing a pending pairing request. */
export type PendingPairingRequestResult<TPending> = {
    status: "pending";
    request: TPending;
    created: boolean;
};
/** Refresh one compatible pending request or replace a superseded request set atomically. */
export declare function reconcilePendingPairingRequests<TPending extends {
    requestId: string;
}, TIncoming>(params: {
    pendingById: Record<string, TPending>;
    existing: readonly TPending[];
    incoming: TIncoming;
    canRefreshSingle: (existing: TPending, incoming: TIncoming) => boolean;
    refreshSingle: (existing: TPending, incoming: TIncoming) => TPending;
    buildReplacement: (params: {
        existing: readonly TPending[];
        incoming: TIncoming;
    }) => TPending;
    persist: () => Promise<void>;
}): Promise<PendingPairingRequestResult<TPending>>;
