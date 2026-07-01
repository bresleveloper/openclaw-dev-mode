import { type ProviderAuthAliasLookupParams } from "../../agents/provider-auth-aliases.js";
import type { FollowupRun } from "./queue.js";
/** Keeps an auth profile only when the current provider shares the primary auth scope. */
export declare function resolveProviderScopedAuthProfile(params: {
    provider: string;
    primaryProvider: string;
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
    config?: ProviderAuthAliasLookupParams["config"];
    workspaceDir?: ProviderAuthAliasLookupParams["workspaceDir"];
}): {
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
};
/** Resolves the auth profile override for a queued follow-up run. */
export declare function resolveRunAuthProfile(run: FollowupRun["run"], provider: string, params?: {
    config?: ProviderAuthAliasLookupParams["config"];
}): {
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
};
