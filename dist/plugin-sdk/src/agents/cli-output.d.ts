import type { CliBackendConfig } from "../config/types.js";
import type { MessagingToolSend, MessagingToolSourceReplyPayload } from "./embedded-agent-messaging.types.js";
type CliUsage = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
};
type CliProcessDiagnostics = {
    backendId: string;
    processReason: string;
    exitCode: number | null;
    exitSignal: NodeJS.Signals | number | null;
    durationMs: number;
    stdoutBytes: number;
    stdoutHash: string;
    stderrBytes: number;
    stderrHash: string;
    useResume: boolean;
};
/** Normalized result from a CLI-backed model provider turn. */
export type CliOutput = {
    text: string;
    rawText?: string;
    sessionId?: string;
    usage?: CliUsage;
    errorText?: string;
    diagnostics?: {
        process?: CliProcessDiagnostics;
    };
    finalPromptText?: string;
    didSendViaMessagingTool?: boolean;
    didDeliverSourceReplyViaMessageTool?: boolean;
    messagingToolSentTexts?: string[];
    messagingToolSentMediaUrls?: string[];
    messagingToolSentTargets?: MessagingToolSend[];
    messagingToolSourceReplyPayloads?: MessagingToolSourceReplyPayload[];
    yielded?: true;
};
/** Incremental assistant text emitted while parsing a streaming CLI response. */
export type CliStreamingDelta = {
    text: string;
    delta: string;
    sessionId?: string;
    usage?: CliUsage;
};
/** Tool-call start event reconstructed from CLI stream output. */
export type CliToolUseStartDelta = {
    toolCallId: string;
    name: string;
    args: Record<string, unknown>;
};
/** Tool-call result event reconstructed from CLI stream output. */
export type CliToolResultDelta = {
    toolCallId: string;
    name: string;
    isError: boolean;
    result?: unknown;
};
/** Returns whether JSONL output carries correlated provider tool events. */
export declare function supportsCliJsonlToolEvents(params: {
    backend: CliBackendConfig;
    providerId: string;
}): boolean;
/** Parses JSON CLI output, including mixed stdout that contains embedded JSON objects. */
/** Parses a single JSON payload emitted by a CLI backend. */
export declare function parseCliJson(raw: string, backend: CliBackendConfig, providerId?: string): CliOutput | null;
/** Creates a stateful parser for streaming JSONL CLI backend output. */
export declare function createCliJsonlStreamingParser(params: {
    backend: CliBackendConfig;
    providerId: string;
    onAssistantDelta: (delta: CliStreamingDelta) => void;
    onToolUseStart?: (delta: CliToolUseStartDelta) => void;
    onToolResult?: (delta: CliToolResultDelta) => void;
    onCommentaryText?: (text: string) => void;
}): {
    push(chunk: string): void;
    finish(): void;
    getOutput(): CliOutput | null;
};
/** Parses complete JSONL CLI output into the final assistant result and metadata. */
/** Parses complete JSONL output from a CLI backend into normalized text and metadata. */
export declare function parseCliJsonl(raw: string, backend: CliBackendConfig, providerId: string): CliOutput | null;
/** Parses CLI output according to the backend output mode with text fallback. */
/** Parses CLI backend output using the configured JSON/JSONL/plain-text mode. */
export declare function parseCliOutput(params: {
    raw: string;
    backend: CliBackendConfig;
    providerId: string;
    outputMode?: "json" | "jsonl" | "text";
    fallbackSessionId?: string;
}): CliOutput;
/** Extracts the most specific structured CLI error message from mixed or JSON output. */
/** Extracts a human-readable error message from mixed CLI stderr/stdout text. */
export declare function extractCliErrorMessage(raw: string): string | null;
export {};
