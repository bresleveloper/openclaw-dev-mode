/**
 * OAuth credential manager.
 * Resolves usable access tokens, refreshes expired credentials under global
 * locks, adopts safer main-store credentials, and mirrors refreshed tokens.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { OAuthRefreshFailureError } from "./oauth-refresh-failure.js";
import { areOAuthCredentialsEquivalent, hasUsableOAuthCredential, isSafeToAdoptBootstrapOAuthIdentity, isSafeToAdoptMainStoreOAuthIdentity, isSafeToOverwriteStoredOAuthIdentity, overlayRuntimeExternalOAuthProfiles, shouldBootstrapFromExternalCliCredential, shouldPersistRuntimeExternalOAuthProfile, shouldReplaceStoredOAuthCredential, type RuntimeExternalOAuthProfile } from "./oauth-shared.js";
import type { AuthProfileStore, OAuthCredential, OAuthCredentials } from "./types.js";
export type OAuthManagerAdapter = {
    buildApiKey: (provider: string, credentials: OAuthCredential, context: {
        cfg?: OpenClawConfig;
        agentDir?: string;
    }) => Promise<string>;
    refreshCredential: (credential: OAuthCredential) => Promise<OAuthCredentials | null>;
    readBootstrapCredential: (params: {
        profileId: string;
        credential: OAuthCredential;
    }) => OAuthCredential | null;
    readFallbackCredential?: (params: {
        profileId: string;
        credential: OAuthCredential;
    }) => OAuthCredential | null;
    isRefreshTokenReusedError: (error: unknown) => boolean;
};
export type ResolvedOAuthAccess = {
    apiKey: string;
    credential: OAuthCredential;
};
/** Refresh failure that preserves a redacted refreshed store and credential. */
export declare class OAuthManagerRefreshError extends OAuthRefreshFailureError {
    #private;
    readonly profileId: string;
    readonly code?: string;
    readonly lockPath?: string;
    constructor(params: {
        credential: OAuthCredential;
        attemptedCredentials?: OAuthCredential[];
        profileId: string;
        refreshedStore: AuthProfileStore;
        cause: unknown;
    });
    getRefreshedStore(): AuthProfileStore;
    getCredential(): OAuthCredential;
    toJSON(): {
        name: string;
        message: string;
        profileId: string;
        provider: string;
    };
}
export { areOAuthCredentialsEquivalent, hasUsableOAuthCredential, isSafeToAdoptBootstrapOAuthIdentity, isSafeToAdoptMainStoreOAuthIdentity, isSafeToOverwriteStoredOAuthIdentity, overlayRuntimeExternalOAuthProfiles, shouldBootstrapFromExternalCliCredential, shouldPersistRuntimeExternalOAuthProfile, shouldReplaceStoredOAuthCredential, };
export type { RuntimeExternalOAuthProfile };
/** Select local OAuth unless a safe external bootstrap credential should win. */
export declare function resolveEffectiveOAuthCredential(params: {
    profileId: string;
    credential: OAuthCredential;
    readBootstrapCredential: OAuthManagerAdapter["readBootstrapCredential"];
}): OAuthCredential;
/** Create an OAuth manager bound to provider-specific build/refresh adapters. */
export declare function createOAuthManager(adapter: OAuthManagerAdapter): {
    resolveOAuthAccess: (params: {
        store: AuthProfileStore;
        profileId: string;
        credential: OAuthCredential;
        agentDir?: string;
        cfg?: OpenClawConfig;
        forceRefresh?: boolean;
    }) => Promise<ResolvedOAuthAccess | null>;
    resetRefreshQueuesForTest: () => void;
};
