import type { SubscribeEmbeddedAgentSessionParams } from "../../embedded-agent-subscribe.types.js";
/** Shared timeout for waiting on aborted model/prompt cleanup before releasing resources. */
export declare const EMBEDDED_ABORT_SETTLE_TIMEOUT_MS: number;
type IdleAwareAgent = {
    waitForIdle?: (() => Promise<void>) | undefined;
};
type ToolResultFlushManager = {
    flushPendingToolResults?: (() => void) | undefined;
    clearPendingToolResults?: (() => void) | undefined;
};
/**
 * Identity helper that preserves the concrete subscription params type at call
 * sites. Keeping this as a named helper lets tests assert the exact shape passed
 * into the subscription layer without widening the object inline.
 */
export declare function buildEmbeddedSubscriptionParams(params: SubscribeEmbeddedAgentSessionParams): SubscribeEmbeddedAgentSessionParams;
/**
 * Tears down per-attempt resources in lock-safe order: remove guards, settle
 * aborted prompts, flush tool results, release the session lock, then dispose
 * runtimes. Lock release errors are reported after best-effort disposal so a
 * failed lock does not leak spawned runtimes.
 */
export declare function cleanupEmbeddedAttemptResources(params: {
    removeToolResultContextGuard?: () => void;
    flushPendingToolResultsAfterIdle: (params: {
        agent: IdleAwareAgent | null | undefined;
        sessionManager: ToolResultFlushManager | null | undefined;
        timeoutMs?: number;
    }) => Promise<void>;
    session?: {
        agent?: unknown;
        dispose(): void;
    };
    sessionManager: unknown;
    bundleMcpRuntime?: {
        dispose(): Promise<void> | void;
    };
    bundleLspRuntime?: {
        dispose(): Promise<void> | void;
    };
    sessionLock: {
        release(): Promise<void> | void;
    };
    aborted?: boolean;
    abortSettlePromise?: Promise<unknown> | null;
    skipSessionFlush?: boolean;
    runId?: string;
    sessionId?: string;
}): Promise<void>;
export {};
