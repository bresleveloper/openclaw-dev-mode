import type { AuthProfileStore, OAuthCredential } from "./types.js";
export { normalizeAuthEmailToken, normalizeAuthIdentityToken } from "./oauth-identity.js";
/** OAuth profile imported from a runtime external CLI source. */
export type RuntimeExternalOAuthProfile = {
    profileId: string;
    credential: OAuthCredential;
    persistence?: "runtime-only" | "persisted";
};
/** Returns true when two OAuth credentials contain the same token/identity data. */
export declare function areOAuthCredentialsEquivalent(a: OAuthCredential | undefined, b: OAuthCredential): boolean;
/** Returns true when an incoming OAuth credential should replace stored state. */
export declare function shouldReplaceStoredOAuthCredential(existing: OAuthCredential | undefined, incoming: OAuthCredential): boolean;
/** Returns true when an OAuth credential has a usable access token. */
export declare function hasUsableOAuthCredential(credential: OAuthCredential | undefined, now?: number): boolean;
/** Returns true when an OAuth credential has account or email identity. */
export declare function hasOAuthIdentity(credential: Pick<OAuthCredential, "accountId" | "email">): boolean;
/** Returns true when OAuth identity fields match by account id or email. */
export declare function hasMatchingOAuthIdentity(existing: Pick<OAuthCredential, "accountId" | "email">, incoming: Pick<OAuthCredential, "accountId" | "email">): boolean;
/** Returns true when stored OAuth identity can be overwritten. */
export declare function isSafeToOverwriteStoredOAuthIdentity(existing: OAuthCredential | undefined, incoming: OAuthCredential): boolean;
/** Returns true when bootstrap may adopt an external OAuth identity. */
export declare function isSafeToAdoptBootstrapOAuthIdentity(existing: OAuthCredential | undefined, incoming: OAuthCredential): boolean;
/** Returns true when agent-local state may adopt a main-store OAuth identity. */
export declare function isSafeToAdoptMainStoreOAuthIdentity(existing: OAuthCredential | undefined, incoming: OAuthCredential): boolean;
/** Returns true when an external CLI credential should bootstrap stored OAuth. */
export declare function shouldBootstrapFromExternalCliCredential(params: {
    existing: OAuthCredential | undefined;
    imported: OAuthCredential;
    now?: number;
}): boolean;
/** Overlays runtime external OAuth profiles on a cloned store. */
export declare function overlayRuntimeExternalOAuthProfiles(store: AuthProfileStore, profiles: Iterable<RuntimeExternalOAuthProfile>, options?: {
    runtimeExternalProfileIdsAuthoritative?: boolean;
}): AuthProfileStore;
/** Returns true when a runtime external OAuth profile should be persisted. */
export declare function shouldPersistRuntimeExternalOAuthProfile(params: {
    profileId: string;
    credential: OAuthCredential;
    profiles: Iterable<RuntimeExternalOAuthProfile>;
}): boolean;
