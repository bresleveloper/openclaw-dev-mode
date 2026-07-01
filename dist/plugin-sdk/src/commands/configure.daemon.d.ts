import type { RuntimeEnv } from "../runtime.js";
import { type GatewayDaemonRuntime } from "./daemon-runtime.js";
/** Prompt to install, reinstall, restart, or skip the local Gateway service. */
export declare function maybeInstallDaemon(params: {
    runtime: RuntimeEnv;
    port: number;
    daemonRuntime?: GatewayDaemonRuntime;
}): Promise<void>;
