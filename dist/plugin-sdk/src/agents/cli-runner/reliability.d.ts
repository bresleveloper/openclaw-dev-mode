import type { CliBackendConfig } from "../../config/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { EmbeddedRunTrigger } from "../embedded-agent-runner/run/params.js";
/** Resolves the no-output watchdog timeout for a fresh or resumed CLI run. */
export declare function resolveCliNoOutputTimeoutMs(params: {
    backend: CliBackendConfig;
    timeoutMs: number;
    useResume: boolean;
    trigger?: EmbeddedRunTrigger;
    runTimeoutOverrideMs?: number;
}): number;
export declare function resolveCliRunTimeoutOverrideMs(params: {
    config?: OpenClawConfig;
    lane?: string;
    timeoutMs: number;
    runTimeoutOverrideMs?: number;
}): number | undefined;
/** Builds a supervisor scope key for session-owned CLI processes. */
export declare function buildCliSupervisorScopeKey(params: {
    backend: CliBackendConfig;
    backendId: string;
    cliSessionId?: string;
}): string | undefined;
