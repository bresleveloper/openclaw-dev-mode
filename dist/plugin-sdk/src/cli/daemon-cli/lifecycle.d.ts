import type { DaemonLifecycleOptions } from "./types.js";
/** Uninstall the managed Gateway service after stopping it. */
export declare function runDaemonUninstall(opts?: DaemonLifecycleOptions): Promise<void>;
/** Start the managed Gateway service, repairing stale service definitions when possible. */
export declare function runDaemonStart(opts?: DaemonLifecycleOptions): Promise<void>;
/** Stop the managed Gateway service or verified unmanaged listener fallback. */
export declare function runDaemonStop(opts?: DaemonLifecycleOptions): Promise<void>;
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
export declare function runDaemonRestart(opts?: DaemonLifecycleOptions): Promise<boolean>;
