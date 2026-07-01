/**
 * Shared queue overflow, debounce, and collection helpers.
 *
 * Queue owners use these helpers to cap pending work, summarize dropped items,
 * debounce drains, and force individual collection when cross-channel ordering matters.
 */
/** Mutable summary state for a capped queue. */
type QueueSummaryState = {
    dropPolicy: "summarize" | "old" | "new";
    droppedCount: number;
    summaryLines: string[];
};
/** Queue overflow strategy. */
type QueueDropPolicy = QueueSummaryState["dropPolicy"];
/** Generic capped queue state with shared overflow summary fields. */
type QueueState<T> = QueueSummaryState & {
    items: T[];
    cap: number;
};
/** Clear accumulated overflow summary state after it has been emitted. */
export declare function clearQueueSummaryState(state: QueueSummaryState): void;
/** Build a summary prompt preview without mutating the source queue state. */
export declare function previewQueueSummaryPrompt(params: {
    state: QueueSummaryState;
    noun: string;
    title?: string;
}): string | undefined;
/** Apply runtime queue settings while preserving previous values for omitted fields. */
export declare function applyQueueRuntimeSettings<TMode extends string>(params: {
    target: {
        mode: TMode;
        debounceMs: number;
        cap: number;
        dropPolicy: QueueDropPolicy;
    };
    settings: {
        mode: TMode;
        debounceMs?: number;
        cap?: number;
        dropPolicy?: QueueDropPolicy;
    };
}): void;
/** Run optional duplicate detection before an item enters a queue. */
export declare function shouldSkipQueueItem<T>(params: {
    item: T;
    items: T[];
    dedupe?: (item: T, items: T[]) => boolean;
}): boolean;
/** Apply overflow policy before enqueueing another item. */
export declare function applyQueueDropPolicy<T>(params: {
    queue: QueueState<T>;
    summarize: (item: T) => string;
    summaryLimit?: number;
    onDrop?: (items: T[]) => void;
}): boolean;
/** Wait until the queue has been quiet for its debounce window. */
export declare function waitForQueueDebounce(queue: {
    debounceMs: number;
    lastEnqueuedAt: number;
}): Promise<void>;
/** Mark one queue as draining unless another drain is already active. */
export declare function beginQueueDrain<T extends {
    draining: boolean;
}>(map: Map<string, T>, key: string): T | undefined;
export declare function removeQueuedItemsByRef<T>(items: T[], processed: readonly T[]): void;
/** Run and remove the next queued item, returning false when empty. */
export declare function drainNextQueueItem<T>(items: T[], run: (item: T) => Promise<void>): Promise<boolean>;
/** Drain one collect step using mutable queue collection state. */
export declare function drainCollectQueueStep<T>(params: {
    collectState: {
        forceIndividualCollect: boolean;
    };
    isCrossChannel: boolean;
    items: T[];
    run: (item: T) => Promise<void>;
}): Promise<"skipped" | "drained" | "empty">;
/** Render a collect prompt from queued items and optional overflow summary. */
export declare function buildCollectPrompt<T>(params: {
    title: string;
    items: T[];
    summary?: string;
    renderItem: (item: T, index: number) => string;
}): string;
/** Return true when queued items span keys or explicitly mark cross-channel state. */
export declare function hasCrossChannelItems<T>(items: T[], resolveKey: (item: T) => {
    key?: string;
    cross?: boolean;
}): boolean;
export {};
