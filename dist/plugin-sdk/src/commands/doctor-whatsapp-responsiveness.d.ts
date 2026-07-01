import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { StatusSummary } from "./status.types.js";
type LocalTuiProcess = {
    pid: number;
    command: string;
};
type ProcessSignal = "SIGTERM" | "SIGKILL";
type ProcessController = {
    kill: (pid: number, signal: ProcessSignal | 0) => boolean;
};
/** Lists local OpenClaw TUI processes that can contend with gateway responsiveness. */
export declare function listLocalTuiProcesses(): LocalTuiProcess[];
/** Terminates local TUI processes with SIGTERM, then SIGKILL for remaining pids. */
export declare function terminateLocalTuiProcesses(params: {
    processes: LocalTuiProcess[];
    controller?: ProcessController;
    graceMs?: number;
}): Promise<{
    stopped: number[];
    failed: number[];
}>;
/** Emits WhatsApp responsiveness warnings and optionally stops contending local TUI clients. */
export declare function noteWhatsappResponsivenessHealth(params: {
    cfg: OpenClawConfig;
    status?: Pick<StatusSummary, "eventLoop"> | null;
    shouldRepair: boolean;
    listLocalTuiProcesses?: () => LocalTuiProcess[];
    terminateLocalTuiProcesses?: typeof terminateLocalTuiProcesses;
}): Promise<void>;
export {};
