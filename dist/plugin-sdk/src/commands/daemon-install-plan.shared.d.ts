import { type DaemonInstallWarnFn } from "./daemon-install-runtime-warning.js";
import type { GatewayDaemonRuntime } from "./daemon-runtime.js";
/** Detect source-checkout dev mode from the current CLI entrypoint. */
export declare function resolveGatewayDevMode(argv?: string[]): boolean;
/** Resolve dev-mode and Node path inputs for daemon service install planning. */
export declare function resolveDaemonInstallRuntimeInputs(params: {
    env: Record<string, string | undefined>;
    runtime: GatewayDaemonRuntime;
    devMode?: boolean;
    nodePath?: string;
}): Promise<{
    devMode: boolean;
    nodePath?: string;
}>;
/** Emit runtime warnings for daemon install command arguments. */
export declare function emitDaemonInstallRuntimeWarning(params: {
    env: Record<string, string | undefined>;
    runtime: GatewayDaemonRuntime;
    programArguments: string[];
    warn?: DaemonInstallWarnFn;
    title: string;
}): Promise<void>;
/** Return the Node binary directory that should be added to daemon PATH. */
export declare function resolveDaemonNodeBinDir(nodePath?: string): string[] | undefined;
/** Resolve the OpenClaw CLI binary directory from argv/PATH for daemon PATH. */
export declare function resolveDaemonOpenClawBinDir(params?: {
    argv?: string[];
    env?: Record<string, string | undefined>;
    platform?: NodeJS.Platform;
    existsSync?: (path: string) => boolean;
    realpathSync?: (path: string) => string;
}): string[] | undefined;
/** Merge Node and OpenClaw binary directories for the daemon service PATH. */
export declare function resolveDaemonServicePathDirs(params: {
    nodePath?: string;
    argv?: string[];
    env?: Record<string, string | undefined>;
    platform?: NodeJS.Platform;
}): string[] | undefined;
