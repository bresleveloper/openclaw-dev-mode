import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Resolves a user-selected auth profile override for the requested provider. */
export declare function resolveProfileOverride(params: {
    rawProfile?: string;
    provider: string;
    cfg: OpenClawConfig;
    agentDir?: string;
}): {
    profileId?: string;
    error?: string;
};
