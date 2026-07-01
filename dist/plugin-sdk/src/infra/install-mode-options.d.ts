type InstallMode = "install" | "update";
type InstallModeOptions<TLogger> = {
    logger?: TLogger;
    mode?: InstallMode;
    dryRun?: boolean;
};
type TimedInstallModeOptions<TLogger> = InstallModeOptions<TLogger> & {
    timeoutMs?: number;
};
/** Resolves shared install/update mode options with a required logger fallback. */
export declare function resolveInstallModeOptions<TLogger>(params: InstallModeOptions<TLogger>, defaultLogger: TLogger): {
    logger: TLogger;
    mode: InstallMode;
    dryRun: boolean;
};
/** Resolves install/update mode options plus an operation timeout default. */
export declare function resolveTimedInstallModeOptions<TLogger>(params: TimedInstallModeOptions<TLogger>, defaultLogger: TLogger, defaultTimeoutMs?: number): {
    logger: TLogger;
    timeoutMs: number;
    mode: InstallMode;
    dryRun: boolean;
};
export {};
