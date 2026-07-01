export type BootstrapMode = "full" | "limited" | "none";
/** Resolve the bootstrap mode for one agent run. */
export declare function resolveBootstrapMode(params: {
    bootstrapPending: boolean;
    runKind?: "default" | "heartbeat" | "cron";
    isInteractiveUserFacing: boolean;
    isPrimaryRun: boolean;
    isCanonicalWorkspace: boolean;
    hasBootstrapFileAccess: boolean;
}): BootstrapMode;
