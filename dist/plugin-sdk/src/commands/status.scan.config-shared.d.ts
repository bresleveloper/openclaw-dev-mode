import type { OpenClawConfig } from "../config/types.js";
/** Returns true when tests should avoid the missing-config cold-start fast path. */
export declare function shouldSkipStatusScanMissingConfigFastPath(env?: NodeJS.ProcessEnv): boolean;
/** Returns whether status should treat this run as a no-config cold start. */
export declare function resolveStatusScanColdStart(params?: {
    env?: NodeJS.ProcessEnv;
    allowMissingConfigFastPath?: boolean;
}): boolean;
/** Loads best-effort config, resolves read-only secrets, and appends status secret diagnostics. */
export declare function loadStatusScanCommandConfig(params: {
    commandName: string;
    readConfigSnapshot: () => Promise<{
        config: OpenClawConfig;
        sourceConfig: OpenClawConfig;
    }>;
    resolveConfig: (sourceConfig: OpenClawConfig) => Promise<{
        resolvedConfig: OpenClawConfig;
        diagnostics: string[];
    }>;
    env?: NodeJS.ProcessEnv;
    allowMissingConfigFastPath?: boolean;
}): Promise<{
    coldStart: boolean;
    sourceConfig: OpenClawConfig;
    resolvedConfig: OpenClawConfig;
    secretDiagnostics: string[];
}>;
