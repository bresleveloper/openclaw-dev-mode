import { type RespawnSupervisor } from "./supervisor-markers.js";
import type { UpdateRestartSentinelMeta } from "./update-restart-sentinel-payload.js";
export type ManagedServiceUpdateHandoffResult = {
    status: "started";
    pid?: number;
    command: string;
    logPath: string;
};
export declare function formatManagedServiceUpdateCommand(params?: {
    timeoutMs?: number;
    channel?: "stable" | "beta" | "dev";
}): string;
export declare function stripSupervisorHintEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
export declare function startManagedServiceUpdateHandoff(params: {
    root: string;
    timeoutMs?: number;
    channel?: "stable" | "beta" | "dev";
    restartDelayMs?: number;
    meta: UpdateRestartSentinelMeta;
    handoffId?: string;
    supervisor?: RespawnSupervisor | null;
    env?: NodeJS.ProcessEnv;
    execPath?: string;
    argv1?: string;
    parentPid?: number;
}): Promise<ManagedServiceUpdateHandoffResult>;
export declare function buildManagedServiceHandoffUnavailableMessage(command: string): string;
