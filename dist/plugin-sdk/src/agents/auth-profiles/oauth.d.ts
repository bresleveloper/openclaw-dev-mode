import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileCredential, AuthProfileStore, OAuthCredential } from "./types.js";
export { isSafeToCopyOAuthIdentity, isSameOAuthIdentity, normalizeAuthEmailToken, normalizeAuthIdentityToken, shouldMirrorRefreshedOAuthCredential, } from "./oauth-identity.js";
export type { OAuthMirrorDecision, OAuthMirrorDecisionReason } from "./oauth-identity.js";
type ResolveApiKeyForProfileResult = {
    apiKey: string;
    provider: string;
    email?: string;
    profileId: string;
    profileType: AuthProfileCredential["type"];
    credential?: AuthProfileCredential;
};
/** Detect provider errors caused by single-use OAuth refresh token races. */
export declare function isRefreshTokenReusedError(error: unknown): boolean;
type ResolveApiKeyForProfileParams = {
    cfg?: OpenClawConfig;
    store: AuthProfileStore;
    profileId: string;
    agentDir?: string;
    forceRefresh?: boolean;
};
/** Refresh one OAuth credential and merge provider-returned token fields. */
export declare function refreshOAuthCredentialForRuntime(params: {
    credential: OAuthCredential;
}): Promise<OAuthCredential | null>;
/** Clear in-process OAuth refresh queues between isolated tests. */
export declare function resetOAuthRefreshQueuesForTest(): void;
/** Resolve a selected auth profile into the provider API key string. */
export declare function resolveApiKeyForProfile(params: ResolveApiKeyForProfileParams): Promise<ResolveApiKeyForProfileResult | null>;
