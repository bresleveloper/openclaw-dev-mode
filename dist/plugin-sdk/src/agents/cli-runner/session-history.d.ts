import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Maximum transcript size read for CLI session history. */
export declare const MAX_CLI_SESSION_HISTORY_FILE_BYTES: number;
/** Maximum transcript messages exposed to CLI hook history. */
export declare const MAX_CLI_SESSION_HISTORY_MESSAGES = 100;
/** Minimum reseed-history prompt budget for fresh CLI sessions. */
export declare const MAX_CLI_SESSION_RESEED_HISTORY_CHARS: number;
/** Maximum automatic reseed-history prompt budget derived from context size. */
export declare const MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS: number;
type RawTranscriptReseedReason = "auth-profile" | "auth-epoch" | "system-prompt" | "cwd" | "mcp" | "missing-transcript" | "orphaned-tool-use" | "session-expired";
/** Resolves how much prior transcript text may reseed a fresh CLI session. */
export declare function resolveAutoCliSessionReseedHistoryChars(contextWindowTokens: number): number;
/** Builds a reseed prompt that carries prior OpenClaw transcript context. */
export declare function buildCliSessionHistoryPrompt(params: {
    messages: unknown[];
    prompt: string;
    maxHistoryChars?: number;
}): string | undefined;
/** Checks whether a safe, bounded transcript file exists for a CLI session. */
export declare function hasCliSessionTranscript(params: {
    sessionId: string;
    sessionFile: string;
    sessionKey?: string;
    agentId?: string;
    config?: OpenClawConfig;
}): Promise<boolean>;
/** Loads transcript messages for CLI lifecycle hook context. */
export declare function loadCliSessionHistoryMessages(params: {
    sessionId: string;
    sessionFile: string;
    sessionKey?: string;
    agentId?: string;
    config?: OpenClawConfig;
}): Promise<unknown[]>;
/** Loads transcript messages formatted for context-engine updates. */
export declare function loadCliSessionContextEngineMessages(params: {
    sessionId: string;
    sessionFile: string;
    sessionKey?: string;
    agentId?: string;
    config?: OpenClawConfig;
}): Promise<unknown[]>;
/** Loads compacted/raw transcript messages eligible for CLI session reseeding. */
export declare function loadCliSessionReseedMessages(params: {
    sessionId: string;
    sessionFile: string;
    sessionKey?: string;
    agentId?: string;
    config?: OpenClawConfig;
    allowRawTranscriptReseed?: boolean;
    rawTranscriptReseedReason?: RawTranscriptReseedReason;
}): Promise<unknown[]>;
export {};
