import type { AuthProfileStore, OAuthCredential } from "./types.js";
export { areOAuthCredentialsEquivalent, hasUsableOAuthCredential, isSafeToAdoptBootstrapOAuthIdentity, isSafeToOverwriteStoredOAuthIdentity, shouldBootstrapFromExternalCliCredential, shouldReplaceStoredOAuthCredential, } from "./oauth-shared.js";
export type ExternalCliResolvedProfile = {
    profileId: string;
    credential: OAuthCredential;
    persistence?: "runtime-only" | "persisted";
};
export type ExternalCliAuthProfileOptions = {
    allowKeychainPrompt?: boolean;
    providerIds?: Iterable<string>;
    profileIds?: Iterable<string>;
};
/** Return true when imported CLI credentials match an existing profile identity. */
export declare function isSafeToUseExternalCliCredential(existing: OAuthCredential | undefined, imported: OAuthCredential): boolean;
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
export declare function readExternalCliBootstrapCredential(params: {
    profileId: string;
    credential: OAuthCredential;
    allowInlineOAuthTokenMaterial?: boolean;
    allowKeychainPrompt?: boolean;
}): OAuthCredential | null;
/** Read a CLI credential as a fallback for refresh/runtime auth recovery. */
export declare function readExternalCliFallbackCredential(params: {
    profileId: string;
    credential: OAuthCredential;
    allowKeychainPrompt?: boolean;
}): OAuthCredential | null;
/** Resolve scoped external CLI auth profiles available to overlay or persist. */
export declare function resolveExternalCliAuthProfiles(store: AuthProfileStore, options?: ExternalCliAuthProfileOptions): ExternalCliResolvedProfile[];
