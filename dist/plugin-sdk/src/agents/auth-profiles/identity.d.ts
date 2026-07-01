import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "./types.js";
/** Builds a provider-prefixed auth profile id. */
export declare function buildAuthProfileId(params: {
    providerId: string;
    profileName?: string | null;
    profilePrefix?: string;
}): string;
/** Resolves display metadata for an auth profile from config/store. */
export declare function resolveAuthProfileMetadata(params: {
    cfg?: OpenClawConfig;
    store?: AuthProfileStore;
    profileId: string;
}): {
    displayName?: string;
    email?: string;
};
