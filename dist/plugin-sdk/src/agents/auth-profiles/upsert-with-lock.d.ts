import type { AuthProfileCredential, AuthProfileStore } from "./types.js";
/** Upserts an auth profile under the store lock, returning null on write failure. */
export declare function upsertAuthProfileWithLock(params: {
    profileId: string;
    credential: AuthProfileCredential;
    agentDir?: string;
}): Promise<AuthProfileStore | null>;
