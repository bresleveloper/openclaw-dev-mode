/**
 * Handles per-attempt thread prompt composition and cache TTL markers.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Custom transcript marker used to preserve cache-TTL pruning state across attempts. */
export declare const ATTEMPT_CACHE_TTL_CUSTOM_TYPE = "openclaw.cache-ttl";
/**
 * Combines hook-provided system context with the base prompt while preserving
 * stable structured-section bytes. Returning undefined when hooks add nothing
 * lets callers avoid rewriting the original prompt.
 */
export declare function composeSystemPromptWithHookContext(params: {
    baseSystemPrompt?: string;
    prependSystemContext?: string;
    appendSystemContext?: string;
}): string | undefined;
/**
 * Returns the workspace path that must be mounted for sandboxed spawn attempts.
 * Read-only sandbox modes need the resolved workspace explicitly; full rw
 * access uses the normal workspace wiring.
 */
export declare function resolveAttemptSpawnWorkspaceDir(params: {
    sandbox?: {
        enabled?: boolean;
        workspaceAccess?: string;
    } | null;
    resolvedWorkspace: string;
}): string | undefined;
/**
 * Appends the cache-TTL transcript marker when context-pruning policy and model
 * eligibility both allow it. The boolean result tells callers whether the
 * session transcript changed.
 */
export declare function appendAttemptCacheTtlIfNeeded(params: {
    sessionManager: {
        appendCustomEntry?: (customType: string, data: unknown) => void;
    };
    timedOutDuringCompaction: boolean;
    compactionOccurredThisAttempt: boolean;
    config?: OpenClawConfig;
    provider: string;
    modelId: string;
    modelApi?: string;
    isCacheTtlEligibleProvider: (provider: string, modelId: string, modelApi?: string) => boolean;
    now?: number;
}): boolean;
/**
 * Records completed bootstrap turns only after a clean, non-compaction attempt.
 * Failed, aborted, or compaction-mutated turns are not stable bootstrap history.
 */
export declare function shouldPersistCompletedBootstrapTurn(params: {
    shouldRecordCompletedBootstrapTurn: boolean;
    promptError: unknown;
    aborted: boolean;
    timedOutDuringCompaction: boolean;
    compactionOccurredThisAttempt: boolean;
}): boolean;
