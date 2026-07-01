/**
 * Shared before_tool_call state for adjusted tool params.
 * The adapter and wrapper both consult this map so later execution can use the
 * normalized payload selected by hook processing.
 */
export declare const adjustedParamsByToolCallId: Map<string, unknown>;
export declare const preExecutionBlockedToolCallIds: Set<string>;
export declare const structuredReplaySafeToolCallIds: Set<string>;
export declare function buildAdjustedParamsKey(params: {
    runId?: string;
    toolCallId: string;
}): string;
/** Consume and remove hook-adjusted params for a completed tool call. */
export declare function consumeAdjustedParamsForToolCall(toolCallId: string, runId?: string): unknown;
/** Snapshot hook-adjusted params without consuming later outcome bookkeeping. */
export declare function peekAdjustedParamsForToolCall(toolCallId: string, runId?: string): unknown;
/** Consume whether policy prevented the target tool from starting. */
export declare function consumePreExecutionBlockedToolCall(toolCallId: string, runId?: string): boolean;
export declare function recordStructuredReplaySafeToolCall(toolCallId: string, runId?: string): void;
export declare function consumeStructuredReplaySafeToolCall(toolCallId: string, runId?: string): boolean;
/** Clear adjusted tool parameters between isolated tests. */
export declare function resetAdjustedParamsByToolCallIdForTests(): void;
