import type { CliBackendConfig } from "../../config/types.js";
import { type CliOutput, type CliStreamingDelta, type CliToolResultDelta, type CliToolUseStartDelta } from "../cli-output.js";
import type { PreparedCliRunContext } from "./types.js";
type ProcessSupervisor = ReturnType<typeof import("../../process/supervisor/index.js").getProcessSupervisor>;
type ClaudeLiveRunResult = {
    output: CliOutput;
};
/** Closes all live Claude CLI sessions and clears creation promises for tests. */
export declare function resetClaudeLiveSessionsForTest(): void;
/** Closes the live Claude session associated with a prepared run context, if one exists. */
export declare function closeClaudeLiveSessionForContext(context: PreparedCliRunContext): Promise<void>;
/** Close a tainted live process so its replacement gets a fresh MCP capture key. */
export declare function rotateClaudeLiveMcpCaptureKeyForContext(context: PreparedCliRunContext): Promise<void>;
/** Returns whether a prepared backend context is eligible for Claude live stdio reuse. */
export declare function shouldUseClaudeLiveSession(context: PreparedCliRunContext): boolean;
/** Builds Claude CLI args for stream-json live sessions, stripping one-shot session flags. */
export declare function buildClaudeLiveArgs(params: {
    args: string[];
    backend: CliBackendConfig;
    systemPrompt: string;
    useResume: boolean;
    permissionMode?: string;
}): string[];
/** Runs one prompt through a reusable Claude CLI live session. */
export declare function runClaudeLiveSessionTurn(params: {
    context: PreparedCliRunContext;
    args: string[];
    env: Record<string, string>;
    prompt: string;
    useResume: boolean;
    noOutputTimeoutMs: number;
    getProcessSupervisor: () => ProcessSupervisor;
    onAssistantDelta: (delta: CliStreamingDelta) => void;
    onToolUseStart?: (delta: CliToolUseStartDelta) => void;
    onToolResult?: (delta: CliToolResultDelta) => void;
    onCommentaryText?: (text: string) => void;
    onMcpCaptureReady?: (captureKey: string) => void;
    cleanup: () => Promise<void>;
}): Promise<ClaudeLiveRunResult>;
export {};
