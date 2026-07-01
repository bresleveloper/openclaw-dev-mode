export type KillProcessTreeOptions = {
    graceMs?: number;
    detached?: boolean;
    force?: boolean;
};
/**
 * Best-effort process-tree termination with graceful shutdown.
 * - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
 *   first (without /F), then force-kills if process survives.
 * - Unix: send SIGTERM to process group first, wait grace period, then SIGKILL.
 *
 * When the child was spawned with `detached: false`, pass `detached: false` to
 * skip the Unix `process.kill(-pid, ...)` group-kill. That avoids signaling the
 * gateway's own process group.
 */
export declare function killProcessTree(pid: number, opts?: KillProcessTreeOptions): void;
export declare function signalProcessTree(pid: number, signal: "SIGTERM" | "SIGKILL", opts?: {
    detached?: boolean;
}): void;
