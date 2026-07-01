import type { DaemonInstallOptions } from "./types.js";
/** Merge safe existing service environment into the current install invocation environment. */
export declare function mergeInstallInvocationEnv(params: {
    env: NodeJS.ProcessEnv;
    existingServiceEnv?: Record<string, string>;
    platform?: NodeJS.Platform;
}): NodeJS.ProcessEnv;
/** Install or refresh the managed Gateway service. */
export declare function runDaemonInstall(opts: DaemonInstallOptions): Promise<void>;
