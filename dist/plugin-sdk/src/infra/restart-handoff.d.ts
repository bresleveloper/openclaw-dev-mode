export declare const GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND = "gateway-supervisor-restart-handoff";
export type GatewayRestartHandoffRestartKind = "full-process" | "update-process";
export type GatewayRestartHandoffSource = "config-write" | "gateway-update" | "operator-restart" | "plugin-change" | "signal" | "unknown";
export type GatewayRestartHandoffSupervisorMode = "launchd" | "systemd" | "schtasks" | "external";
export type GatewayRestartHandoff = {
    kind: typeof GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND;
    version: 1;
    intentId: string;
    pid: number;
    processInstanceId?: string;
    createdAt: number;
    expiresAt: number;
    reason?: string;
    source: GatewayRestartHandoffSource;
    restartKind: GatewayRestartHandoffRestartKind;
    supervisorMode: GatewayRestartHandoffSupervisorMode;
    restartTrace?: {
        startedAt: number;
        lastAt: number;
    };
};
/** Format a compact diagnostic for a recently consumed restart handoff. */
export declare function formatGatewayRestartHandoffDiagnostic(handoff: GatewayRestartHandoff, now?: number): string;
/** Write the bounded supervisor restart handoff atomically. */
export declare function writeGatewayRestartHandoffSync(opts: {
    env?: NodeJS.ProcessEnv;
    pid?: number;
    processInstanceId?: string;
    reason?: string;
    source?: GatewayRestartHandoffSource;
    restartKind: GatewayRestartHandoffRestartKind;
    supervisorMode?: GatewayRestartHandoffSupervisorMode | null;
    restartTrace?: GatewayRestartHandoff["restartTrace"];
    ttlMs?: number;
    createdAt?: number;
}): GatewayRestartHandoff | null;
/** Read the current unexpired restart handoff without consuming it. */
export declare function readGatewayRestartHandoffSync(env?: NodeJS.ProcessEnv, now?: number): GatewayRestartHandoff | null;
