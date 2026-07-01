/** Optional lifecycle hooks fired around each queued task. */
export type KeyedAsyncQueueHooks = {
    onEnqueue?: () => void;
    onSettle?: () => void;
};
/** Serialize async work per key while allowing unrelated keys to run concurrently. */
export declare function enqueueKeyedTask<T>(params: {
    tails: Map<string, Promise<void>>;
    key: string;
    task: () => Promise<T>;
    hooks?: KeyedAsyncQueueHooks;
}): Promise<T>;
/** Small per-key async queue wrapper for plugin runtimes that need serialized work. */
export declare class KeyedAsyncQueue {
    private readonly tails;
    getTailMapForTesting(): Map<string, Promise<void>>;
    enqueue<T>(key: string, task: () => Promise<T>, hooks?: KeyedAsyncQueueHooks): Promise<T>;
}
