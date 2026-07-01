import type { OpenClawConfig } from "../../config/types.js";
import type { GatewayProbeCapability, GatewayProbeResult } from "../../gateway/probe.js";
type TargetKind = "explicit" | "configRemote" | "localLoopback" | "sshTunnel";
/** Concrete websocket endpoint that gateway status should probe. */
export type GatewayStatusTarget = {
    id: string;
    kind: TargetKind;
    url: string;
    active: boolean;
    tunnel?: {
        kind: "ssh";
        target: string;
        localPort: number;
        remotePort: number;
        pid: number | null;
    };
};
/** Sanitized config subset rendered by the deep gateway status view. */
export type GatewayConfigSummary = {
    path: string | null;
    exists: boolean;
    valid: boolean;
    issues: Array<{
        path: string;
        message: string;
    }>;
    legacyIssues: Array<{
        path: string;
        message: string;
    }>;
    gateway: {
        mode: string | null;
        bind: string | null;
        port: number | null;
        controlUiEnabled: boolean | null;
        controlUiBasePath: string | null;
        authMode: string | null;
        authTokenConfigured: boolean;
        authPasswordConfigured: boolean;
        remoteUrl: string | null;
        remoteTokenConfigured: boolean;
        remotePasswordConfigured: boolean;
        tailscaleMode: string | null;
    };
    discovery: {
        wideAreaEnabled: boolean | null;
    };
};
/** Parses CLI timeout input with the gateway-status fallback rules. */
export declare function parseTimeoutMs(raw: unknown, fallbackMs: number): number;
/** Builds the deduplicated ordered gateway probe targets from CLI input and config. */
export declare function resolveTargets(cfg: OpenClawConfig, explicitUrl?: string, localPortOverride?: number): GatewayStatusTarget[];
export declare function resolveProbeBudgetMs(overallMs: number, target: Pick<GatewayStatusTarget, "kind" | "active" | "url">): number;
/** Normalizes user-entered SSH targets, accepting both raw targets and `ssh host` input. */
export declare function sanitizeSshTarget(value: unknown): string | null;
/** Resolves auth for the probe surface represented by the selected status target. */
export declare function resolveAuthForTarget(cfg: OpenClawConfig, target: GatewayStatusTarget, overrides: {
    token?: string;
    password?: string;
}): Promise<{
    token?: string;
    password?: string;
    diagnostics?: string[];
}>;
/** Extracts the config fields displayed by `openclaw gateway status --deep`. */
export declare function extractConfigSummary(snapshotUnknown: unknown): GatewayConfigSummary;
/** Builds local and tailnet gateway URL hints for the selected gateway port. */
export declare function buildNetworkHints(cfg: OpenClawConfig, localPortOverride?: number): {
    localLoopbackUrl: string;
    localTailnetUrl: string | null;
    tailnetIPv4: string | null;
};
/** Renders the status heading for a single gateway probe target. */
export declare function renderTargetHeader(target: GatewayStatusTarget, rich: boolean): string;
/** Returns true when auth succeeded enough to connect but lacks the read scope. */
export declare function isScopeLimitedProbeFailure(probe: GatewayProbeResult): boolean;
/** Returns true when the gateway connection was established but a later probe failed. */
export declare function isPostConnectProbeFailure(probe: GatewayProbeResult): boolean;
/** Returns true when the probe established any gateway connection. */
export declare function isProbeReachable(probe: GatewayProbeResult): boolean;
export declare function summarizeGatewayProbeCapability(probes: GatewayProbeResult[]): GatewayProbeCapability;
export declare function renderProbeSummaryLine(probe: GatewayProbeResult, rich: boolean): string;
export {};
