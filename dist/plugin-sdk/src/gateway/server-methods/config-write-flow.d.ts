import { readConfigFileSnapshotForWrite } from "../../config/config.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type RestartSentinelPayload } from "../../infra/restart-sentinel.js";
import { scheduleGatewaySigusr1Restart } from "../../infra/restart.js";
import { type ControlPlaneActor } from "../control-plane-audit.js";
import type { GatewayRequestContext } from "./types.js";
export type ConfigWriteSnapshot = Awaited<ReturnType<typeof readConfigFileSnapshotForWrite>>["snapshot"];
export type ConfigWriteOptions = Awaited<ReturnType<typeof readConfigFileSnapshotForWrite>>["writeOptions"];
/** Resolves the on-disk config path used in config method responses. */
export declare function resolveGatewayConfigPath(snapshot?: Pick<ConfigWriteSnapshot, "path">): string;
/** Compares the effective shared Gateway auth surface that active clients use. */
export declare function didSharedGatewayAuthChange(prev: OpenClawConfig, next: OpenClawConfig): boolean;
/** Compares against the active secrets-expanded config when one is available. */
export declare function didActiveSharedGatewayAuthChange(params: {
    fallbackPrev: OpenClawConfig;
    next: OpenClawConfig;
}): boolean;
/** Persists a gateway config write and returns follow-up work that must run after response. */
export declare function commitGatewayConfigWrite(params: {
    snapshot: ConfigWriteSnapshot;
    writeOptions: ConfigWriteOptions;
    nextConfig: OpenClawConfig;
    context?: GatewayRequestContext;
    disconnectSharedAuthClients?: boolean;
}): Promise<{
    path: string;
    config: OpenClawConfig;
    queueFollowUp: () => void;
}>;
/** Builds restart sentinel/queue state for config.patch and config.apply writes. */
export declare function resolveGatewayConfigRestartWriteResult(params: {
    requestParams: unknown;
    kind: RestartSentinelPayload["kind"];
    mode: "config.patch" | "config.apply";
    configPath: string;
    changedPaths: string[];
    nextConfig: OpenClawConfig;
    actor: ControlPlaneActor;
    context?: GatewayRequestContext;
}): Promise<{
    payload: RestartSentinelPayload;
    sentinelPersisted: boolean;
    restart: ReturnType<typeof scheduleGatewaySigusr1Restart> | undefined;
}>;
