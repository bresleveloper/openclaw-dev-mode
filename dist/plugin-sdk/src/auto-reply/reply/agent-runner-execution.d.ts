import { runEmbeddedAgent } from "../../agents/embedded-agent.js";
import { type SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { TemplateContext } from "../templating.js";
import type { VerboseLevel } from "../thinking.js";
import type { GetReplyOptions, ReplyPayload } from "../types.js";
import type { BlockReplyPipeline } from "./block-reply-pipeline.js";
import type { FollowupRun } from "./queue.js";
import type { ReplyMediaContext } from "./reply-media-paths.js";
import type { ReplyOperation } from "./reply-run-registry.js";
import type { TypingSignaler } from "./typing-mode.js";
export declare const MAX_LIVE_SWITCH_RETRIES = 2;
export declare function buildCommandOutputFromToolResultEvent(evt: {
    stream: string;
    data: Record<string, unknown>;
}): Parameters<NonNullable<GetReplyOptions["onCommandOutput"]>>[0] | undefined;
/** One attempted runtime fallback candidate and its failure reason. */
export type RuntimeFallbackAttempt = {
    provider: string;
    model: string;
    error: string;
    reason?: string;
    status?: number;
    code?: string;
};
/** Result of running an agent turn through fallback/retry handling. */
export type AgentRunLoopResult = {
    kind: "success";
    runId: string;
    runResult: Awaited<ReturnType<typeof runEmbeddedAgent>>;
    fallbackProvider?: string;
    fallbackModel?: string;
    fallbackExhausted?: true;
    fallbackAttempts: RuntimeFallbackAttempt[];
    didLogHeartbeatStrip: boolean;
    autoCompactionCount: number;
    /** Payload keys sent directly (not via pipeline) during tool flush. */
    directlySentBlockKeys?: Set<string>;
    /** Payloads successfully sent directly during tool flush. */
    directlySentBlockPayloads?: ReplyPayload[];
} | {
    kind: "final";
    payload: ReplyPayload;
};
type FallbackSelectionState = Pick<SessionEntry, "providerOverride" | "modelOverride" | "modelOverrideSource" | "modelOverrideFallbackOriginProvider" | "modelOverrideFallbackOriginModel" | "authProfileOverride" | "authProfileOverrideSource" | "authProfileOverrideCompactionCount">;
/** Persists the fallback candidate selection onto a session entry. */
export declare function applyFallbackCandidateSelectionToEntry(params: {
    entry: SessionEntry;
    run: FollowupRun["run"];
    provider: string;
    model: string;
    origin?: {
        provider: string;
        model: string;
    };
    force?: boolean;
    now?: number;
}): {
    updated: boolean;
    nextState?: FallbackSelectionState;
};
/** Formats the reply shown when preflight compaction fails before a run. */
export declare function buildPreflightCompactionFailureText(message: string, options?: {
    includeDetails?: boolean;
}): string | null;
/** Converts known agent-run failures into user-facing reply payloads. */
export declare function buildKnownAgentRunFailureReplyPayload(params: {
    err: unknown;
    sessionCtx: TemplateContext;
    resolvedVerboseLevel: VerboseLevel | undefined;
    cfg?: OpenClawConfig;
}): ReplyPayload | undefined;
/** Computes a reserve-token floor scaled to the selected context window. */
export declare function computeContextAwareReserveTokensFloor(contextWindow: number | undefined): number;
/** Builds recovery instructions for context-overflow failures. */
export declare function buildContextOverflowRecoveryText(params: {
    duringCompaction?: boolean;
    preserveSessionMapping?: boolean;
    cfg: FollowupRun["run"]["config"];
    agentId?: string;
    primaryProvider?: string;
    primaryModel?: string;
    runtimeProvider?: string;
    runtimeModel?: string;
    activeSessionEntry?: SessionEntry;
}): string;
/** Resolves runtime provider override stored on the session entry. */
export declare function resolveSessionRuntimeOverrideForProvider(params: {
    provider: string;
    entry?: Pick<SessionEntry, "agentRuntimeOverride">;
    cfg?: OpenClawConfig;
}): string | undefined;
/** Decides whether to retry after rechecking auto-fallback primary probe state. */
export declare function resolveRunAfterAutoFallbackPrimaryProbeRecheck(params: {
    run: FollowupRun["run"];
    entry?: SessionEntry;
    sessionKey?: string;
}): FollowupRun["run"];
/** Runs the agent turn with provider/model fallback, retry, and failure mapping. */
export declare function runAgentTurnWithFallback(params: {
    commandBody: string;
    transcriptCommandBody?: string;
    followupRun: FollowupRun;
    sessionCtx: TemplateContext;
    replyThreading?: TemplateContext["ReplyThreading"];
    replyOperation?: ReplyOperation;
    opts?: GetReplyOptions;
    typingSignals: TypingSignaler;
    blockReplyPipeline: BlockReplyPipeline | null;
    blockStreamingEnabled: boolean;
    blockReplyChunking?: {
        minChars: number;
        maxChars: number;
        breakPreference: "paragraph" | "newline" | "sentence";
        flushOnParagraph?: boolean;
    };
    resolvedBlockStreamingBreak: "text_end" | "message_end";
    applyReplyToMode: (payload: ReplyPayload) => ReplyPayload;
    shouldEmitToolResult: () => boolean;
    shouldEmitToolOutput: () => boolean;
    pendingToolTasks: Set<Promise<void>>;
    resetSessionAfterRoleOrderingConflict: (reason: string) => Promise<boolean>;
    isHeartbeat: boolean;
    sessionKey?: string;
    runtimePolicySessionKey?: string;
    getActiveSessionEntry: () => SessionEntry | undefined;
    activeSessionStore?: Record<string, SessionEntry>;
    storePath?: string;
    resolvedVerboseLevel: VerboseLevel;
    toolProgressDetail?: "explain" | "raw";
    replyMediaContext?: ReplyMediaContext;
    onCompactionNoticePayload?: (payload: ReplyPayload) => Promise<void> | void;
    isRestartRecoveryArmed?: () => boolean;
}): Promise<AgentRunLoopResult>;
export {};
