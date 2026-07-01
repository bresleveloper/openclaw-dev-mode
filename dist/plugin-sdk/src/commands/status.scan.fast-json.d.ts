import type { OpenClawConfig } from "../config/types.js";
import type { RuntimeEnv } from "../runtime.js";
import { executeStatusScanFromOverview } from "./status.scan-execute.ts";
import type { StatusScanResult } from "./status.scan-result.ts";
type StatusJsonScanPolicy = {
    commandName: string;
    allowMissingConfigFastPath?: boolean;
    includeChannelSummary?: boolean;
    fetchGitUpdate?: boolean;
    includeRegistryUpdate?: boolean;
    includeLocalStatusRpcFallback?: boolean;
    gatewayProbeTimeoutMs?: number | ((cfg: OpenClawConfig) => number | undefined);
    resolveHasConfiguredChannels: (cfg: OpenClawConfig, sourceConfig: OpenClawConfig) => boolean | Promise<boolean>;
    resolveMemory: Parameters<typeof executeStatusScanFromOverview>[0]["resolveMemory"];
};
/** Runs status JSON with an injectable policy for tests and specialized callers. */
export declare function scanStatusJsonWithPolicy(opts: {
    timeoutMs?: number;
    all?: boolean;
}, runtime: RuntimeEnv, policy: StatusJsonScanPolicy): Promise<StatusScanResult>;
/** Runs the default fast status JSON scan. */
export declare function scanStatusJsonFast(opts: {
    timeoutMs?: number;
    all?: boolean;
}, runtime: RuntimeEnv): Promise<StatusScanResult>;
export {};
