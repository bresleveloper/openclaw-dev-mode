import type { OpenClawConfig } from "../config/types.js";
import { buildGatewayConnectionDetailsWithResolvers } from "../gateway/connection-details.js";
import type { probeGateway as probeGatewayFn } from "../gateway/probe.js";
import { type MemoryProviderStatus } from "../memory-host-sdk/engine-storage.js";
import { pickGatewaySelfPresence } from "./gateway-presence.js";
export type MemoryStatusSnapshot = MemoryProviderStatus & {
    agentId: string;
};
export type MemoryPluginStatus = {
    enabled: boolean;
    slot: string | null;
    reason?: string;
};
export type GatewayProbeSnapshot = {
    gatewayConnection: ReturnType<typeof buildGatewayConnectionDetailsWithResolvers>;
    remoteUrlMissing: boolean;
    gatewayMode: "local" | "remote";
    gatewayProbeAuth: {
        token?: string;
        password?: string;
    };
    gatewayProbeAuthWarning?: string;
    gatewayProbe: Awaited<ReturnType<typeof probeGatewayFn>> | null;
    gatewayReachable: boolean;
    gatewaySelf: ReturnType<typeof pickGatewaySelfPresence>;
    gatewayCallOverrides?: {
        url: string;
        token?: string;
        password?: string;
    };
};
type StatusMemorySearchManager = {
    probeVectorStoreAvailability?(): Promise<boolean>;
    probeVectorAvailability(): Promise<boolean>;
    status(): MemoryProviderStatus;
    close?(): Promise<void>;
};
type StatusMemorySearchManagerResolver = (params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose: "status";
}) => Promise<{
    manager: StatusMemorySearchManager | null;
}>;
/** Resolves whether memory status should be shown and which slot owns it. */
export declare function resolveMemoryPluginStatus(cfg: OpenClawConfig): MemoryPluginStatus;
/** Resolves gateway connection details, probe result, auth warnings, and call overrides. */
export declare function resolveGatewayProbeSnapshot(params: {
    cfg: OpenClawConfig;
    opts: {
        timeoutMs?: number;
        all?: boolean;
        skipProbe?: boolean;
        detailLevel?: "none" | "presence" | "full";
        probeWhenRemoteUrlMissing?: boolean;
        resolveAuthWhenRemoteUrlMissing?: boolean;
        mergeAuthWarningIntoProbeError?: boolean;
        localStatusRpcFallback?: boolean;
    };
}): Promise<GatewayProbeSnapshot>;
/** Builds the published Tailscale HTTPS Control UI URL when exposure is enabled. */
export declare function buildTailscaleHttpsUrl(params: {
    tailscaleMode: string;
    tailscaleDns: string | null;
    serviceName?: string | null;
    controlUiBasePath?: string;
}): string | null;
/** Resolves memory provider status without creating default stores just for status output. */
export declare function resolveSharedMemoryStatusSnapshot(params: {
    cfg: OpenClawConfig;
    agentStatus: {
        defaultId?: string | null;
    };
    memoryPlugin: MemoryPluginStatus;
    resolveMemoryConfig: (cfg: OpenClawConfig, agentId: string) => {
        store: {
            databasePath: string;
        };
    } | null;
    getMemorySearchManager: StatusMemorySearchManagerResolver;
    requireDefaultDatabasePath?: (agentId: string) => string | null;
}): Promise<MemoryStatusSnapshot | null>;
export {};
