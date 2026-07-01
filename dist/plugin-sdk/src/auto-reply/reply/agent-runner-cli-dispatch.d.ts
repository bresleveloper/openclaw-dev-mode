import type { RunCliAgentParams } from "../../agents/cli-runner/types.js";
import type { EmbeddedAgentRunResult } from "../../agents/embedded-agent.js";
import type { SessionEntry } from "../../config/sessions.js";
import { type ReplyPayload } from "../reply-payload.js";
type CommentaryTextPayload = {
    text: string;
    itemId?: string;
};
export type CliToolEventPayload = {
    name: string | undefined;
    phase: "start" | "update" | "result";
    args: Record<string, unknown> | undefined;
    toolCallId?: string;
    isError?: boolean;
    result?: unknown;
};
export declare function keepCliSessionBindingOnlyWhenReused(params: {
    result: EmbeddedAgentRunResult;
    existingSessionId?: string;
    onDroppedReplacement?: () => void;
}): EmbeddedAgentRunResult;
export declare function clearDroppedCliSessionBinding(params: {
    provider: string;
    sessionKey?: string;
    sessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    activeSessionEntry?: SessionEntry;
}): Promise<void>;
/**
 * Tracks CLI tool start/result events and renders the same durable tool
 * summaries the embedded runner emits: a formatToolAggregate line per result
 * (args-derived meta captured at start), plus the output block under full
 * verbose. Keeps CLI runs at tool-summary parity with embedded runs.
 */
export declare function createCliToolSummaryTracker(params: {
    detailMode?: "explain" | "raw";
    shouldEmitToolResult: () => boolean;
    shouldEmitToolOutput: () => boolean;
    deliver: (payload: {
        text: string;
        isError?: boolean;
    }) => Promise<void> | void;
}): {
    noteToolEvent: (payload: CliToolEventPayload) => Promise<void>;
};
type RunCliAgentWithLifecycleParams = {
    runId: string;
    lifecycleGeneration?: string;
    provider: string;
    runParams: RunCliAgentParams;
    startedAt?: number;
    emitLifecycleStart?: boolean;
    emitLifecycleTerminal?: boolean;
    onAgentRunStart?: () => void;
    suppressAssistantBridge?: boolean;
    onAssistantText?: (text: string) => Promise<void>;
    onReasoningText?: (text: string) => Promise<void>;
    onToolEvent?: (payload: CliToolEventPayload) => Promise<void>;
    onCommentaryText?: (payload: CommentaryTextPayload) => Promise<void>;
    onFastModeAutoProgress?: (payload: ReplyPayload) => Promise<void>;
    onErrorBeforeLifecycle?: (err: unknown) => Promise<void>;
    transformResult?: (result: EmbeddedAgentRunResult) => EmbeddedAgentRunResult;
};
export declare function runCliAgentWithLifecycle(params: RunCliAgentWithLifecycleParams): Promise<EmbeddedAgentRunResult>;
export {};
