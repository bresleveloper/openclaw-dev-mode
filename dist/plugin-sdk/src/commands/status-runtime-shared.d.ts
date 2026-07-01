import type { OpenClawConfig } from "../config/types.js";
import type { HeartbeatEventPayload } from "../infra/heartbeat-events.js";
import type { HealthSummary } from "./health.js";
/** Runs the lightweight security audit used by status JSON/all output. */
export declare function resolveStatusSecurityAudit(params: {
    config: OpenClawConfig;
    sourceConfig: OpenClawConfig;
    timeoutMs?: number;
}): Promise<import("../security/audit.types.ts").SecurityAuditReport>;
type StatusUsageSummaryOptions = {
    config: OpenClawConfig;
    timeoutMs?: number;
    agentDir?: string;
};
/** Loads provider usage for status output, defaulting to the config's default agent directory. */
export declare function resolveStatusUsageSummary(params: StatusUsageSummaryOptions): Promise<import("../infra/provider-usage.types.ts").UsageSummary>;
/** Exposes the lazily loaded provider-usage module for callers that need its helpers. */
export declare function loadStatusProviderUsageModule(): Promise<typeof import("../infra/provider-usage.js")>;
/** Calls gateway health and lets errors propagate to deep status callers. */
export declare function resolveStatusGatewayHealth(params: {
    config: OpenClawConfig;
    timeoutMs?: number;
}): Promise<HealthSummary>;
/** Calls gateway health but converts unreachable/failing probes into an error object. */
export declare function resolveStatusGatewayHealthSafe(params: {
    config: OpenClawConfig;
    timeoutMs?: number;
    gatewayReachable: boolean;
    gatewayProbeError?: string | null;
    callOverrides?: {
        url: string;
        token?: string;
        password?: string;
    };
}): Promise<HealthSummary | {
    error: string;
}>;
/** Reads gateway delivery diagnostics when reachable, returning null on failures. */
export declare function resolveStatusGatewayDiagnosticsSafe(params: {
    config: OpenClawConfig;
    timeoutMs?: number;
    gatewayReachable: boolean;
    callOverrides?: {
        url: string;
        token?: string;
        password?: string;
    };
}): Promise<unknown>;
/** Reads the most recent gateway heartbeat only when the gateway probe succeeded. */
export declare function resolveStatusLastHeartbeat(params: {
    config: OpenClawConfig;
    timeoutMs?: number;
    gatewayReachable: boolean;
}): Promise<HeartbeatEventPayload | null>;
/** Resolves launchd/systemd summaries for the gateway and node services together. */
export declare function resolveStatusServiceSummaries(): Promise<[{
    label: string;
    installed: boolean | null;
    loaded: boolean;
    managedByOpenClaw: boolean;
    externallyManaged: boolean;
    loadedText: string;
    runtime: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["runtime"];
    runtimeShort: string | null;
    layout: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["layout"];
    wrapperPath: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["wrapperPath"];
}, {
    label: string;
    installed: boolean | null;
    loaded: boolean;
    managedByOpenClaw: boolean;
    externallyManaged: boolean;
    loadedText: string;
    runtime: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["runtime"];
    runtimeShort: string | null;
    layout: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["layout"];
    wrapperPath: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["wrapperPath"];
}]>;
type StatusUsageSummary = Awaited<ReturnType<typeof resolveStatusUsageSummary>>;
type StatusGatewayHealth = Awaited<ReturnType<typeof resolveStatusGatewayHealth>>;
type StatusSecurityAudit = Awaited<ReturnType<typeof resolveStatusSecurityAudit>>;
/** Resolves optional usage/deep runtime details plus service summaries for status output. */
export declare function resolveStatusRuntimeDetails(params: {
    config: OpenClawConfig;
    timeoutMs?: number;
    usage?: boolean;
    deep?: boolean;
    gatewayReachable: boolean;
    suppressHealthErrors?: boolean;
    resolveUsage?: (input: StatusUsageSummaryOptions) => Promise<StatusUsageSummary>;
    resolveHealth?: (input: {
        config: OpenClawConfig;
        timeoutMs?: number;
    }) => Promise<StatusGatewayHealth>;
}): Promise<{
    usage: import("../infra/provider-usage.types.ts").UsageSummary | undefined;
    health: HealthSummary | undefined;
    lastHeartbeat: HeartbeatEventPayload | null;
    gatewayService: {
        label: string;
        installed: boolean | null;
        loaded: boolean;
        managedByOpenClaw: boolean;
        externallyManaged: boolean;
        loadedText: string;
        runtime: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["runtime"];
        runtimeShort: string | null;
        layout: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["layout"];
        wrapperPath: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["wrapperPath"];
    };
    nodeService: {
        label: string;
        installed: boolean | null;
        loaded: boolean;
        managedByOpenClaw: boolean;
        externallyManaged: boolean;
        loadedText: string;
        runtime: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["runtime"];
        runtimeShort: string | null;
        layout: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["layout"];
        wrapperPath: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["wrapperPath"];
    };
}>;
/** Resolves the full runtime snapshot, including optional security audit, for status JSON/text. */
export declare function resolveStatusRuntimeSnapshot(params: {
    config: OpenClawConfig;
    sourceConfig: OpenClawConfig;
    timeoutMs?: number;
    usage?: boolean;
    deep?: boolean;
    gatewayReachable: boolean;
    includeSecurityAudit?: boolean;
    suppressHealthErrors?: boolean;
    resolveSecurityAudit?: (input: {
        config: OpenClawConfig;
        sourceConfig: OpenClawConfig;
        timeoutMs?: number;
    }) => Promise<StatusSecurityAudit>;
    resolveUsage?: (input: StatusUsageSummaryOptions) => Promise<StatusUsageSummary>;
    resolveHealth?: (input: {
        config: OpenClawConfig;
        timeoutMs?: number;
    }) => Promise<StatusGatewayHealth>;
}): Promise<{
    usage: import("../infra/provider-usage.types.ts").UsageSummary | undefined;
    health: HealthSummary | undefined;
    lastHeartbeat: HeartbeatEventPayload | null;
    gatewayService: {
        label: string;
        installed: boolean | null;
        loaded: boolean;
        managedByOpenClaw: boolean;
        externallyManaged: boolean;
        loadedText: string;
        runtime: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["runtime"];
        runtimeShort: string | null;
        layout: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["layout"];
        wrapperPath: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["wrapperPath"];
    };
    nodeService: {
        label: string;
        installed: boolean | null;
        loaded: boolean;
        managedByOpenClaw: boolean;
        externallyManaged: boolean;
        loadedText: string;
        runtime: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["runtime"];
        runtimeShort: string | null;
        layout: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["layout"];
        wrapperPath: Awaited<ReturnType<typeof import("./status.service-summary.ts").readServiceStatusSummary>>["wrapperPath"];
    };
    securityAudit: import("../security/audit.types.ts").SecurityAuditReport | undefined;
}>;
export {};
