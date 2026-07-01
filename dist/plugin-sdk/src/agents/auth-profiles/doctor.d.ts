import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "./types.js";
/** Formats provider-specific auth doctor guidance for a profile/store. */
export declare function formatAuthDoctorHint(params: {
    cfg?: OpenClawConfig;
    store: AuthProfileStore;
    provider: string;
    profileId?: string;
}): Promise<string>;
