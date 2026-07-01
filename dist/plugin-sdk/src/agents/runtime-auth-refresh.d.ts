/** Clamp an auth refresh deadline to a safe setTimeout delay. */
export declare function clampRuntimeAuthRefreshDelayMs(params: {
    refreshAt: number;
    now: number;
    minDelayMs: number;
}): number;
