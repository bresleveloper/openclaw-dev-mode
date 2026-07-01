/**
 * Runs compaction hooks and post-compaction side effects for embedded sessions.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { getGlobalHookRunner } from "../../plugins/hook-runner-global.js";
import type { AgentMessage } from "../runtime/index.js";
/** Emits post-compaction transcript and memory-index side effects for a compacted session file. */
export declare function runPostCompactionSideEffects(params: {
    config?: OpenClawConfig;
    sessionKey?: string;
    agentId?: string;
    sessionFile: string;
}): Promise<void>;
/** Narrow adapter over the global hook runner methods used by compaction. */
type CompactionHookRunner = {
    hasHooks?: (hookName?: string) => boolean;
    runBeforeCompaction?: (metrics: {
        messageCount: number;
        tokenCount?: number;
        sessionFile?: string;
    }, context: {
        sessionId: string;
        agentId: string;
        sessionKey: string;
        workspaceDir: string;
        messageProvider?: string;
    }) => Promise<void> | void;
    runAfterCompaction?: (metrics: {
        messageCount: number;
        tokenCount?: number;
        compactedCount: number;
        sessionFile: string;
    }, context: {
        sessionId: string;
        agentId: string;
        sessionKey: string;
        workspaceDir: string;
        messageProvider?: string;
    }) => Promise<void> | void;
};
/** Converts the global hook runner into the compaction-specific hook shape. */
export declare function asCompactionHookRunner(hookRunner: ReturnType<typeof getGlobalHookRunner> | null | undefined): CompactionHookRunner | null;
/** Builds before-hook metrics while tolerating providers that cannot estimate all messages. */
export declare function buildBeforeCompactionHookMetrics(params: {
    originalMessages: AgentMessage[];
    currentMessages: AgentMessage[];
    observedTokenCount?: number;
    estimateTokensFn: (message: AgentMessage) => number;
}): {
    messageCountOriginal: number;
    tokenCountOriginal: number | undefined;
    messageCountBefore: number;
    tokenCountBefore: number | undefined;
};
/** Runs internal and plugin before-compaction hooks, forwarding hook-produced messages. */
export declare function runBeforeCompactionHooks(params: {
    hookRunner?: CompactionHookRunner | null;
    sessionId: string;
    sessionKey?: string;
    sessionAgentId: string;
    workspaceDir: string;
    messageProvider?: string;
    metrics: ReturnType<typeof buildBeforeCompactionHookMetrics>;
    onHookMessages?: (payload: {
        phase: "before";
        messages: string[];
        sessionId: string;
        sessionKey: string;
    }) => void | Promise<void>;
}): Promise<{
    hookSessionKey: string;
    missingSessionKey: boolean;
}>;
/** Estimates compacted-session token count and rejects impossible growth from stale estimates. */
export declare function estimateTokensAfterCompaction(params: {
    messagesAfter: AgentMessage[];
    observedTokenCount?: number;
    fullSessionTokensBefore: number;
    estimateTokensFn: (message: AgentMessage) => number;
}): number | undefined;
/** Runs internal and plugin after-compaction hooks with the final compacted metrics. */
export declare function runAfterCompactionHooks(params: {
    hookRunner?: CompactionHookRunner | null;
    sessionId: string;
    sessionAgentId: string;
    hookSessionKey: string;
    missingSessionKey: boolean;
    workspaceDir: string;
    messageProvider?: string;
    messageCountAfter: number;
    tokensAfter?: number;
    compactedCount: number;
    sessionFile: string;
    summaryLength?: number;
    tokensBefore?: number;
    firstKeptEntryId?: string;
    onHookMessages?: (payload: {
        phase: "after";
        messages: string[];
        sessionId: string;
        sessionKey: string;
    }) => void | Promise<void>;
}): Promise<void>;
export {};
