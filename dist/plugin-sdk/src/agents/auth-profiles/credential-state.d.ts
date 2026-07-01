import type { AuthProfileCredential, OAuthCredential } from "./types.js";
/** Reason code for why a stored auth credential can or cannot be used. */
export type AuthCredentialReasonCode = "ok" | "missing_credential" | "invalid_expires" | "expired" | "unresolved_ref";
/** Default OAuth access-token refresh margin before expiry. */
export declare const DEFAULT_OAUTH_REFRESH_MARGIN_MS: number;
/** Normalized expiry state for token-style credentials. */
export type TokenExpiryState = "missing" | "valid" | "expiring" | "expired" | "invalid_expires";
/** Classifies a token expiry timestamp for auth selection and refresh logic. */
export declare function resolveTokenExpiryState(expires: unknown, now?: number, opts?: {
    expiringWithinMs?: number;
}): TokenExpiryState;
/** Returns true when an OAuth credential has a non-expiring access token. */
export declare function hasUsableOAuthCredential(credential: OAuthCredential | undefined, opts?: {
    now?: number;
    refreshMarginMs?: number;
}): boolean;
/** Classifies whether a stored credential is eligible for auth selection. */
export declare function evaluateStoredCredentialEligibility(params: {
    credential: AuthProfileCredential;
    now?: number;
}): {
    eligible: boolean;
    reasonCode: AuthCredentialReasonCode;
};
