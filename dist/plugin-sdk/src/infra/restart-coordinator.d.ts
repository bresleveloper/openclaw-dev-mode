import { type ActiveTaskRestartBlocker } from "../tasks/task-registry.maintenance.js";
import { type ScheduledRestart } from "./restart.js";
export type SafeGatewayRestartCounts = {
    queueSize: number;
    pendingReplies: number;
    embeddedRuns: number;
    cronRuns: number;
    activeTasks: number;
    totalActive: number;
};
export type SafeGatewayRestartBlocker = {
    kind: "queue" | "reply" | "embedded-run" | "cron-run" | "task";
    count: number;
    message: string;
    task?: ActiveTaskRestartBlocker;
};
export type SafeGatewayRestartPreflight = {
    safe: boolean;
    counts: SafeGatewayRestartCounts;
    blockers: SafeGatewayRestartBlocker[];
    summary: string;
};
export type SafeGatewayRestartRequestResult = {
    ok: true;
    status: "scheduled" | "deferred" | "coalesced";
    preflight: SafeGatewayRestartPreflight;
    restart: ScheduledRestart;
};
type SafeRestartInspectors = {
    getQueueSize: () => number;
    getPendingReplies: () => number;
    getEmbeddedRuns: () => number;
    getCronRuns: () => number;
    getActiveTasks: () => number;
    getTaskBlockers: () => ActiveTaskRestartBlocker[];
};
export declare function createSafeGatewayRestartPreflight(inspectors?: Partial<SafeRestartInspectors>): SafeGatewayRestartPreflight;
/** Schedule a gateway restart after collecting queue/reply/task blockers. */
export declare function requestSafeGatewayRestart(opts?: {
    reason?: string;
    delayMs?: number;
    skipDeferral?: boolean;
    preservePendingEmitHooks?: boolean;
    inspect?: Partial<SafeRestartInspectors>;
}): SafeGatewayRestartRequestResult;
export {};
