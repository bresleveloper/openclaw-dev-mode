/**
 * Detects Codex app-server failures that should retry with recovery.
 */
import type { EmbeddedRunAttemptResult } from "./types.js";
/**
 * Decides whether a Codex app-server failure can be retried by replaying the
 * same turn. The retry is intentionally narrow: stdio-only, replay-safe, once
 * per run, and only before any assistant/tool/item side effects escape.
 */
export declare function resolveCodexAppServerRecoveryRetry(params: {
    attempt: EmbeddedRunAttemptResult;
    alreadyRetried: boolean;
}): {
    retry: boolean;
    reason?: string;
};
