import type { ConfigFileSnapshot, GatewayBindMode, GatewayControlUiConfig } from "../../config/types.js";
import type { FindExtraGatewayServicesOptions } from "../../daemon/inspect.js";
import type { StaleOpenClawUpdateLaunchdJob } from "../../daemon/launchd.js";
import type { ServiceConfigAudit } from "../../daemon/service-audit.js";
import type { GatewayServiceRuntime } from "../../daemon/service-runtime.js";
import { type PortConnection, type PortListener, type PortUsageStatus } from "../../infra/ports.js";
import { type GatewayRestartHandoff } from "../../infra/restart-handoff.js";
import { type PluginVersionDriftReport } from "../../plugins/plugin-version-drift.js";
import type { GatewayRpcOpts } from "./types.js";
type ConfigSummary = {
    path: string;
    exists: boolean;
    valid: boolean;
    issues?: Array<{
        path: string;
        message: string;
    }>;
    warnings?: ConfigFileSnapshot["warnings"];
    controlUi?: GatewayControlUiConfig;
};
type GatewayStatusSummary = {
    bindMode: GatewayBindMode;
    bindHost: string;
    customBindHost?: string;
    tlsEnabled?: boolean;
    port: number;
    portSource: "service args" | "env/config";
    probeUrl: string;
    probeNote?: string;
    version?: string | null;
};
type CliStatusSummary = {
    version: string;
    entrypoint?: string;
};
export type DaemonStatus = {
    cli?: CliStatusSummary;
    logFile?: string;
    service: {
        label: string;
        loaded: boolean;
        loadedText: string;
        notLoadedText: string;
        command?: {
            programArguments: string[];
            workingDirectory?: string;
            environment?: Record<string, string>;
            sourcePath?: string;
        } | null;
        runtime?: GatewayServiceRuntime;
        configAudit?: ServiceConfigAudit;
        restartHandoff?: GatewayRestartHandoff;
        staleUpdateLaunchdJobs?: StaleOpenClawUpdateLaunchdJob[];
    };
    config?: {
        cli: ConfigSummary;
        daemon?: ConfigSummary;
        mismatch?: boolean;
    };
    gateway?: GatewayStatusSummary;
    port?: {
        port: number;
        status: PortUsageStatus;
        listeners: PortListener[];
        hints: string[];
    };
    portCli?: {
        port: number;
        status: PortUsageStatus;
        listeners: PortListener[];
        hints: string[];
    };
    connections?: {
        port: number;
        established: PortConnection[];
    };
    lastError?: string;
    rpc?: {
        ok: boolean;
        kind?: "connect" | "read";
        capability?: string;
        auth?: {
            role?: string | null;
            scopes?: string[];
            capability?: string;
        };
        server?: {
            version?: string | null;
            connId?: string | null;
        };
        version?: string | null;
        error?: string;
        url?: string;
        authWarning?: string;
    };
    health?: {
        healthy: boolean;
        staleGatewayPids: number[];
    };
    extraServices: Array<{
        label: string;
        detail: string;
        scope: string;
    }>;
    /**
     * Plugin version drift report. Surfaces active official external plugins
     * whose installed version does not match the running gateway version, which
     * can happen after `npm install -g openclaw@<v>` updates the gateway binary
     * without a corresponding `openclaw plugins update`.
     */
    pluginVersionDrift?: PluginVersionDriftReport;
};
export declare function gatherDaemonStatus(opts: {
    rpc: GatewayRpcOpts;
    probe: boolean;
    requireRpc?: boolean;
    deep?: boolean;
    allowExecSecretRefs?: boolean;
} & FindExtraGatewayServicesOptions): Promise<DaemonStatus>;
export declare function renderPortDiagnosticsForCli(status: DaemonStatus, rpcOk?: boolean): string[];
export declare function resolvePortListeningAddresses(status: DaemonStatus): string[];
export {};
