import type { ToolHandlerContext } from "./embedded-agent-subscribe.handlers.types.js";
import type { AgentEvent } from "./runtime/index.js";
/** Returns the number of active tool executions tracked for one embedded run. */
export declare function countActiveToolExecutions(runId: string): number;
/** Handles a tool-execution start event and emits UI/telemetry start state. */
export declare function handleToolExecutionStart(ctx: ToolHandlerContext, evt: AgentEvent & {
    toolName: string;
    toolCallId: string;
    args: unknown;
    replaySafe?: boolean;
}): void | Promise<void>;
/** Handles partial tool output and emits throttled live UI updates. */
export declare function handleToolExecutionUpdate(ctx: ToolHandlerContext, evt: AgentEvent & {
    toolName: string;
    toolCallId: string;
    partialResult?: unknown;
}): void;
/** Handles a tool-execution result and commits replay, media, hook, and error state. */
export declare function handleToolExecutionEnd(ctx: ToolHandlerContext, evt: Extract<AgentEvent, {
    type: "tool_execution_end";
}>): Promise<void>;
