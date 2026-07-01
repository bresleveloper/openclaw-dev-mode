import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ChannelRuntimeSnapshot } from "../gateway/server-channel-runtime.types.js";
import { type RuntimeEnv } from "../runtime.js";
import type { HealthSummary } from "./health.types.js";
export { formatHealthChannelLines } from "./health-format.js";
export type { HealthSummary } from "./health.types.js";
export declare function emitReachableGatewayAuthDiagnostic(params: {
    error: unknown;
    config: OpenClawConfig;
    runtime: RuntimeEnv;
    timeoutMs?: number;
    token?: string;
    password?: string;
    localPortOverride?: number;
    json?: boolean;
}): Promise<boolean>;
/** Formats optional model-pricing cache degradation for text health output. */
export declare function formatModelPricingHealthLine(summary: HealthSummary): string | null;
/** Formats context engine quarantine state for text health output. */
export declare function formatContextEngineHealthLine(summary: HealthSummary): string | null;
/** Builds the gateway-side health snapshot for channels, agents, plugins, and sessions. */
export declare function getHealthSnapshot(params?: {
    timeoutMs?: number;
    probe?: boolean;
    includeSensitive?: boolean;
    runtimeSnapshot?: ChannelRuntimeSnapshot;
    eventLoop?: HealthSummary["eventLoop"];
}): Promise<HealthSummary>;
/** Runs the `openclaw health` command against the gateway and renders JSON or text. */
export declare function healthCommand(opts: {
    json?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
    config?: OpenClawConfig;
    token?: string;
    password?: string;
    localPortOverride?: number;
}, runtime: RuntimeEnv): Promise<void>;
