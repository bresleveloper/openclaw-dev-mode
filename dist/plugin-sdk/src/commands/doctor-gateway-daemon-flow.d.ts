import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { DoctorOptions, DoctorPrompter } from "./doctor-prompter.js";
/**
 * Repairs or diagnoses the local gateway service after the health check fails.
 *
 * Remote gateway mode is only diagnosed; local mode may bootstrap launchd, install missing
 * services, report port conflicts, or restart unhealthy supervision when policy allows.
 */
export declare function maybeRepairGatewayDaemon(params: {
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    prompter: DoctorPrompter;
    options: DoctorOptions;
    gatewayDetailsMessage: string;
    healthOk: boolean;
    healthSkipped?: boolean;
}): Promise<void>;
