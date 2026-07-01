import type { HookContext } from "./agent-tools.before-tool-call.js";
import type { ClientToolDefinition } from "./embedded-agent-runner/run/params.js";
import type { AgentTool } from "./runtime/index.js";
import type { ToolDefinition } from "./sessions/index.js";
type AnyAgentTool = AgentTool;
type ClientToolCallRecorder = ((toolName: string, params: Record<string, unknown>) => void) | {
    reserve?: (toolCallId: string, toolName: string) => void;
    complete: (toolCallId: string, toolName: string, params: Record<string, unknown>) => void;
    discard?: (toolCallId: string, toolName: string) => void;
};
/** Find client-hosted tool names that collide with runtime or sibling tools. */
export declare function findClientToolNameConflicts(params: {
    tools: ClientToolDefinition[];
    existingToolNames?: Iterable<string>;
}): string[];
/** Build a recognizable error for rejecting conflicting client tool names. */
export declare function createClientToolNameConflictError(conflicts: string[]): Error;
/** Detect client tool conflict errors without depending on object identity. */
export declare function isClientToolNameConflictError(err: unknown): err is Error;
/** Convert executable agent tools into session definitions with hook handling. */
export declare function toToolDefinitions(tools: AnyAgentTool[], hookContext?: HookContext): ToolDefinition[];
/** Convert client-hosted tools into pending session definitions. */
export declare function toClientToolDefinitions(tools: ClientToolDefinition[], onClientToolCall?: ClientToolCallRecorder, hookContext?: HookContext): ToolDefinition[];
export {};
