import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileIdRepairResult, AuthProfileStore } from "./types.js";
/** Suggests a modern OAuth profile id for a legacy provider:default profile. */
export declare function suggestOAuthProfileIdForLegacyDefault(params: {
    cfg?: OpenClawConfig;
    store: AuthProfileStore;
    provider: string;
    legacyProfileId: string;
}): string | null;
/** Migrates config auth profile references away from a legacy OAuth default id. */
export declare function repairOAuthProfileIdMismatch(params: {
    cfg: OpenClawConfig;
    store: AuthProfileStore;
    provider: string;
    legacyProfileId?: string;
}): AuthProfileIdRepairResult;
