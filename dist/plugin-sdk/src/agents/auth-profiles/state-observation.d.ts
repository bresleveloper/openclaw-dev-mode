import type { AuthProfileFailureReason, ProfileUsageStats } from "./types.js";
/** Logs an auth profile failure/cooldown/disable state transition. */
export declare function logAuthProfileFailureStateChange(params: {
    runId?: string;
    profileId: string;
    provider: string;
    reason: AuthProfileFailureReason;
    previous: ProfileUsageStats | undefined;
    next: ProfileUsageStats;
    now: number;
}): void;
