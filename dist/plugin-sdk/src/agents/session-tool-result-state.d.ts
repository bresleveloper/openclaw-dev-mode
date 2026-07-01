/**
 * Tracks pending tool-call ids while repairing sanitized transcript messages.
 * The state object decides when dropped or reordered messages need synthetic
 * tool results flushed.
 */
type PendingToolCall = {
    id: string;
    name?: string;
};
type PendingToolCallState = {
    size: () => number;
    entries: () => IterableIterator<[string, string | undefined]>;
    getToolName: (id: string) => string | undefined;
    delete: (id: string) => void;
    clear: () => void;
    trackToolCalls: (calls: PendingToolCall[]) => void;
    getPendingIds: () => string[];
    shouldFlushForSanitizedDrop: () => boolean;
    shouldFlushBeforeNonToolResult: (nextRole: unknown, toolCallCount: number) => boolean;
    shouldFlushBeforeNewToolCalls: (toolCallCount: number) => boolean;
};
/** Tracks pending tool calls so sanitized transcript repair can flush in order. */
export declare function createPendingToolCallState(): PendingToolCallState;
export {};
