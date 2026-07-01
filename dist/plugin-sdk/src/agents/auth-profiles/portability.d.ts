import type { AuthProfileCredential, AuthProfileSecretsStore, AuthProfileStore } from "./types.js";
/** Reason a credential is or is not portable into an agent copy. */
export type AuthProfilePortabilityReason = "portable-static-credential" | "non-portable-oauth-refresh-token" | "credential-opted-out" | "oauth-provider-opted-in";
/** Portability decision for copying credentials into an agent-local store. */
export type AuthProfilePortability = {
    portable: boolean;
    reason: AuthProfilePortabilityReason;
};
/** Resolves whether a credential can be copied into an agent-local store. */
export declare function resolveAuthProfilePortability(credential: AuthProfileCredential): AuthProfilePortability;
/** Returns true when a credential can be copied into an agent-local store. */
export declare function isAuthProfileCredentialPortableForAgentCopy(credential: AuthProfileCredential): boolean;
/** Builds an agent-copy store containing only portable credentials. */
export declare function buildPortableAuthProfileSecretsStoreForAgentCopy(store: AuthProfileStore): {
    store: AuthProfileSecretsStore;
    copiedProfileIds: string[];
    skippedProfileIds: string[];
};
