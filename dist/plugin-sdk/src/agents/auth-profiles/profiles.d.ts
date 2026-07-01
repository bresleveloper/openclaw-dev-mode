import type { AuthProfileCredential, AuthProfileStore } from "./types.js";
export { dedupeProfileIds, listProfilesForProvider, resolveSubscriptionAuthModeForProfiles, } from "./profile-list.js";
/** Sets or clears explicit auth profile order for a provider. */
export declare function setAuthProfileOrder(params: {
    agentDir?: string;
    provider: string;
    order?: string[] | null;
}): Promise<AuthProfileStore | null>;
/** Promotes one auth profile to the front of a provider order. */
export declare function promoteAuthProfileInOrder(params: {
    agentDir?: string;
    provider: string;
    profileId: string;
    createIfMissing?: boolean;
    createFromOrder?: string[];
}): Promise<AuthProfileStore | null>;
/** Upserts an auth profile immediately into the local store. */
export declare function upsertAuthProfile(params: {
    profileId: string;
    credential: AuthProfileCredential;
    agentDir?: string;
}): void;
/** Upserts an auth profile under the auth store lock. */
export declare function upsertAuthProfileWithLock(params: {
    profileId: string;
    credential: AuthProfileCredential;
    agentDir?: string;
}): Promise<AuthProfileStore | null>;
/** Removes all auth profiles and related state for a provider. */
export declare function removeProviderAuthProfilesWithLock(params: {
    provider: string;
    agentDir?: string;
}): Promise<AuthProfileStore | null>;
/** Clear the last-good profile pointer for a provider under the store lock. */
export declare function clearLastGoodProfileWithLock(params: {
    provider: string;
    profileId: string;
    agentDir?: string;
}): Promise<AuthProfileStore | null>;
/** Mark a profile as successfully used and update ordering/usage metadata. */
export declare function markAuthProfileSuccess(params: {
    store: AuthProfileStore;
    provider: string;
    profileId: string;
    agentDir?: string;
}): Promise<void>;
