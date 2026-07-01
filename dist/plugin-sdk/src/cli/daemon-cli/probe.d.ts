import type { OpenClawConfig } from "../../config/types.js";
/** Probe Gateway connectivity or read-capability status with optional RPC verification. */
export declare function probeGatewayStatus(opts: {
    url: string;
    token?: string;
    password?: string;
    config?: OpenClawConfig;
    tlsFingerprint?: string;
    timeoutMs: number;
    preauthHandshakeTimeoutMs?: number;
    json?: boolean;
    requireRpc?: boolean;
    allowRpcConfigCredentials?: boolean;
    configPath?: string;
}): Promise<{
    error?: undefined;
    readonly server: import("../../gateway/probe.js").GatewayProbeServerSummary;
    readonly ok: true;
    readonly kind: "connect" | "read";
    readonly capability: import("../../gateway/probe.js").GatewayProbeCapability | undefined;
    readonly auth: import("../../gateway/probe.js").GatewayProbeAuthSummary | undefined;
    readonly version?: string | undefined;
} | {
    error?: undefined;
    readonly server?: undefined;
    readonly ok: true;
    readonly kind: "connect" | "read";
    readonly capability: import("../../gateway/probe.js").GatewayProbeCapability | undefined;
    readonly auth: import("../../gateway/probe.js").GatewayProbeAuthSummary | undefined;
    readonly version?: string | undefined;
} | {
    readonly server: import("../../gateway/probe.js").GatewayProbeServerSummary;
    readonly ok: false;
    readonly kind: "connect" | "read";
    readonly capability: import("../../gateway/probe.js").GatewayProbeCapability | undefined;
    readonly auth: import("../../gateway/probe.js").GatewayProbeAuthSummary | undefined;
    readonly version?: string | undefined;
    readonly error: string;
} | {
    readonly server?: undefined;
    readonly ok: false;
    readonly kind: "connect" | "read";
    readonly capability: import("../../gateway/probe.js").GatewayProbeCapability | undefined;
    readonly auth: import("../../gateway/probe.js").GatewayProbeAuthSummary | undefined;
    readonly version?: string | undefined;
    readonly error: string;
} | {
    readonly ok: false;
    readonly kind: "connect" | "read";
    readonly error: string;
}>;
