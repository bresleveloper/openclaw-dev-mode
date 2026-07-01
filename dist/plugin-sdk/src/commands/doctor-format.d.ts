import { type GatewayServiceRuntime } from "../daemon/service-runtime.js";
type RuntimeHintOptions = {
    platform?: NodeJS.Platform;
    env?: Record<string, string | undefined>;
};
/** Formats the platform-specific gateway service runtime into a compact status line. */
export declare function formatGatewayRuntimeSummary(runtime: GatewayServiceRuntime | undefined): string | null;
/** Builds follow-up hints for stopped, missing, or unhealthy gateway service runtimes. */
export declare function buildGatewayRuntimeHints(runtime: GatewayServiceRuntime | undefined, options?: RuntimeHintOptions): string[];
export {};
