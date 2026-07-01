/**
 * Subagent orphan recovery gate.
 *
 * Bounds automatic recovery attempts and tombstones repeatedly wedged session entries.
 */
import type { SessionEntry } from "../config/sessions.js";
/** Decision returned before attempting automatic subagent orphan recovery. */
type SubagentRecoveryGate = {
    allowed: true;
    nextAttempt: number;
} | {
    allowed: false;
    reason: string;
    shouldMarkWedged: boolean;
};
/** Returns true when recovery has been tombstoned for a session entry. */
export declare function isSubagentRecoveryWedgedEntry(entry: unknown): boolean;
/** Formats the operator-facing reason for a wedged recovery entry. */
export declare function formatSubagentRecoveryWedgedReason(entry: SessionEntry): string;
/** Checks whether automatic orphan recovery may run for this session entry. */
export declare function evaluateSubagentRecoveryGate(entry: SessionEntry, now: number): SubagentRecoveryGate;
/** Records one accepted automatic orphan-recovery attempt. */
export declare function markSubagentRecoveryAttempt(params: {
    entry: SessionEntry;
    now: number;
    runId: string;
    attempt: number;
}): void;
/** Tombstones automatic recovery until maintenance or doctor clears the state. */
export declare function markSubagentRecoveryWedged(params: {
    entry: SessionEntry;
    now: number;
    runId?: string;
    reason: string;
}): void;
/** Clears stale abort state when a wedged entry should no longer look runnable. */
export declare function clearWedgedSubagentRecoveryAbort(entry: SessionEntry, now: number): boolean;
export {};
