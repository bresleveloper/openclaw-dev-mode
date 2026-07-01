import { type StoreWriterQueue } from "../../shared/store-writer-queue.js";
export type SessionStoreWriterQueue = StoreWriterQueue;
export declare const WRITER_QUEUES: Map<string, StoreWriterQueue>;
/** Clears session store writer queues and cache for tests. */
export declare function clearSessionStoreCacheForTest(): void;
export declare function drainSessionStoreWriterQueuesForTest(): Promise<void>;
export declare function getSessionStoreWriterQueueSizeForTest(): number;
