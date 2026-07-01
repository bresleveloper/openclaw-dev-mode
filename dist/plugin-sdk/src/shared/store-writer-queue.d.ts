/** Pending exclusive store write plus the promise hooks for its caller. */
export type StoreWriterTask = {
    /** Write operation to run once earlier tasks for the same store path finish. */
    fn: () => Promise<unknown>;
    /** Resolves the caller's promise with the write result. */
    resolve: (value: unknown) => void;
    /** Rejects the caller's promise with the write failure or test cleanup error. */
    reject: (reason: unknown) => void;
};
/** Per-store-path FIFO queue that serializes file writes within one process. */
export type StoreWriterQueue = {
    /** True while a drain loop owns this queue. */
    running: boolean;
    /** Writes waiting behind the active drain. */
    pending: StoreWriterTask[];
    /** Active drain promise, reused by waiters until the current batch settles. */
    drainPromise: Promise<void> | null;
};
/** Store writer queues keyed by the canonical store path. */
type StoreWriterQueues = Map<string, StoreWriterQueue>;
/** Runs one store write after prior writes for the same store path have finished. */
export declare function runQueuedStoreWrite<T>(params: {
    queues: StoreWriterQueues;
    storePath: string;
    label: string;
    fn: () => Promise<T>;
}): Promise<T>;
/** Rejects pending queued writes and clears queue state for test cleanup. */
export declare function clearStoreWriterQueuesForTest(queues: StoreWriterQueues, message: string): void;
/** Waits for active drains to settle while rejecting still-pending test writes. */
export declare function drainStoreWriterQueuesForTest(queues: StoreWriterQueues, message: string): Promise<void>;
export {};
