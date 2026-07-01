/**
 * In-memory registry for bash exec sessions.
 * Tracks running/backgrounded sessions, bounded pending output, finished
 * session retention, and process cleanup for reconnect/poll flows.
 */
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { EventSessionRoutingPolicy } from "../infra/event-session-routing.js";
import type { TerminationReason } from "../process/supervisor/types.js";
import type { DeliveryContext } from "../utils/delivery-context.js";
/** Lifecycle status recorded for background process sessions. */
type ProcessStatus = "running" | "completed" | "failed" | "killed";
/** Writable stdin surface shared by child-process and PTY-backed sessions. */
type SessionStdin = {
    write: (data: string, cb?: (err?: Error | null) => void) => void;
    end: () => void;
    destroy?: () => void;
    destroyed?: boolean;
    writable?: boolean;
    writableEnded?: boolean;
    writableFinished?: boolean;
};
/** Mutable session state for a running bash exec process. */
export interface ProcessSession {
    id: string;
    command: string;
    scopeKey?: string;
    sessionKey?: string;
    /** `session.mainKey` from the runtime config, snapshotted at exec start.
     *  Used by background-exit notifications to remap cron-run keys to the
     *  agent's main queue without an ambient config load. If config changes
     *  while the process runs, the exit notification follows the start-time
     *  session contract. */
    mainKey?: string;
    /** `session.scope` from the runtime config; required so the cron-run remap
     *  can route global-scope agents to the literal "global" queue instead
     *  of an agent-main queue the heartbeat never drains. Snapshotted with
     *  `mainKey` for the same start-time routing reason. */
    sessionScope?: "per-sender" | "global";
    /** Start-time routing policy for detached exec system events. */
    eventRouting?: EventSessionRoutingPolicy;
    notifyDeliveryContext?: DeliveryContext;
    notifyOnExit?: boolean;
    notifyOnExitEmptySuccess?: boolean;
    exitNotified?: boolean;
    child?: ChildProcessWithoutNullStreams;
    stdin?: SessionStdin;
    pid?: number;
    startedAt: number;
    cwd?: string;
    maxOutputChars: number;
    pendingMaxOutputChars?: number;
    totalOutputChars: number;
    pendingStdout: string[];
    pendingStderr: string[];
    pendingStdoutChars: number;
    pendingStderrChars: number;
    aggregated: string;
    tail: string;
    exitCode?: number | null;
    exitSignal?: NodeJS.Signals | number | null;
    exitReason?: TerminationReason;
    exited: boolean;
    truncated: boolean;
    backgrounded: boolean;
    /** PTY cursor key mode: unknown until a PTY reports smkx/rmkx. */
    cursorKeyMode: "unknown" | "normal" | "application";
}
/** Retained summary for a completed background session. */
interface FinishedSession {
    id: string;
    command: string;
    scopeKey?: string;
    startedAt: number;
    endedAt: number;
    cwd?: string;
    status: ProcessStatus;
    exitCode?: number | null;
    exitSignal?: NodeJS.Signals | number | null;
    exitReason?: TerminationReason;
    aggregated: string;
    tail: string;
    truncated: boolean;
    totalOutputChars: number;
}
/** Creates a unique short session id that avoids running and retained sessions. */
export declare function createSessionSlug(): string;
/** Adds a running session and starts retention sweeping if needed. */
export declare function addSession(session: ProcessSession): void;
/** Returns a running session by id. */
export declare function getSession(id: string): ProcessSession | undefined;
/** Returns a retained finished background session by id. */
export declare function getFinishedSession(id: string): FinishedSession | undefined;
/** Removes a session from both running and finished registries. */
export declare function deleteSession(id: string): void;
/** Appends process output while enforcing aggregate and pending-output caps. */
export declare function appendOutput(session: ProcessSession, stream: "stdout" | "stderr", chunk: string): void;
/** Drains pending stdout/stderr chunks returned by a process poll. */
export declare function drainSession(session: ProcessSession): {
    stdout: string;
    stderr: string;
};
/** Moves a session to finished state and records exit metadata. */
export declare function markExited(session: ProcessSession, exitCode: number | null, exitSignal: NodeJS.Signals | number | null, status: ProcessStatus, exitReason?: TerminationReason): void;
/** Marks a running session as reconnectable after the exec call returns. */
export declare function markBackgrounded(session: ProcessSession): void;
/** Returns the last `max` characters of text without adding ellipses. */
export declare function tail(text: string, max?: number): string;
/** Lists backgrounded running sessions visible to reconnect/poll callers. */
export declare function listRunningSessions(): ProcessSession[];
/** Lists retained finished background sessions. */
export declare function listFinishedSessions(): FinishedSession[];
/** Test-only reset for in-memory registry state and retention timers. */
export declare function resetProcessRegistryForTests(): void;
/** Overrides finished-session retention TTL, clamped to supported bounds. */
export declare function setJobTtlMs(value?: number): void;
export {};
