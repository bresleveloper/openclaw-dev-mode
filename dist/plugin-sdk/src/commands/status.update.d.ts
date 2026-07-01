import { type UpdateCheckResult } from "../infra/update-check.js";
/** Runs the update check using the configured update channel and current install root. */
export declare function getUpdateCheckResult(params: {
    timeoutMs: number;
    fetchGit: boolean;
    includeRegistry: boolean;
    updateConfigChannel?: string | null;
}): Promise<UpdateCheckResult>;
type UpdateAvailability = {
    available: boolean;
    hasGitUpdate: boolean;
    hasRegistryUpdate: boolean;
    latestVersion: string | null;
    gitBehind: number | null;
};
/** Determines whether git and/or registry data indicate an available update. */
export declare function resolveUpdateAvailability(update: UpdateCheckResult): UpdateAvailability;
/** Formats the actionable update hint shown in status footers. */
export declare function formatUpdateAvailableHint(update: UpdateCheckResult): string | null;
/** Formats a compact one-line update summary for overview rows. */
export declare function formatUpdateOneLiner(update: UpdateCheckResult): string;
export {};
