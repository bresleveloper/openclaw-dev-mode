import type { AgentMessage } from "../runtime/index.js";
/** Runs best-effort after-tool-call hooks for a completed tool invocation. */
export declare function runAgentHarnessAfterToolCallHook(params: {
    toolName: string;
    toolCallId: string;
    runId?: string;
    agentId?: string;
    sessionId?: string;
    sessionKey?: string;
    channelId?: string;
    startArgs: Record<string, unknown>;
    result?: unknown;
    error?: string;
    startedAt?: number;
}): Promise<void>;
/** Runs before-message-write hooks and returns the possibly rewritten message. */
export declare function runAgentHarnessBeforeMessageWriteHook(params: {
    message: AgentMessage;
    agentId?: string;
    sessionKey?: string;
}): AgentMessage | null;
