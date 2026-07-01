/**
 * Exponential backoff helpers for command-output polling. Session diagnostics
 * use this state to slow no-output polls while resetting promptly on output.
 */
import type { SessionState } from "../logging/diagnostic-session-state.js";
/**
 * Record a command poll and return suggested retry delay.
 * @param state Session state to track polling in
 * @param commandId Unique identifier for the command being polled
 * @param hasNewOutput Whether this poll returned new output
 * @returns Suggested delay in milliseconds before next poll
 */
export declare function recordCommandPoll(state: SessionState, commandId: string, hasNewOutput: boolean): number;
/**
 * Reset poll count for a command (e.g., when command completes).
 */
export declare function resetCommandPollCount(state: SessionState, commandId: string): void;
/**
 * Prune stale command poll records (older than 1 hour).
 * Call periodically to prevent memory bloat.
 */
export declare function pruneStaleCommandPolls(state: SessionState, maxAgeMs?: number): void;
