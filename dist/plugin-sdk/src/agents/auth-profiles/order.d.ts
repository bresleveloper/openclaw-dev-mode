import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type ProviderAuthAliasLookupParams } from "../provider-auth-aliases.js";
import { type AuthCredentialReasonCode } from "./credential-state.js";
import type { AuthProfileCredential, AuthProfileStore } from "./types.js";
/** Reason a profile is or is not eligible for provider auth. */
export type AuthProfileEligibilityReasonCode = AuthCredentialReasonCode | "profile_missing" | "provider_mismatch" | "mode_mismatch";
/** Eligibility decision for one auth profile candidate. */
type AuthProfileEligibility = {
    eligible: boolean;
    reasonCode: AuthProfileEligibilityReasonCode;
};
/** Returns true when a stored credential can authenticate the requested provider. */
export declare function isStoredCredentialCompatibleWithAuthProvider(params: {
    cfg?: OpenClawConfig;
    authAliasLookupParams?: ProviderAuthAliasLookupParams;
    provider: string;
    credential: AuthProfileCredential;
}): boolean;
/** Returns true when config declares an aws-sdk auth profile for a provider. */
export declare function isConfiguredAwsSdkAuthProfileForProvider(params: {
    cfg?: OpenClawConfig;
    provider: string;
    profileId: string;
}): boolean;
/** Resolves whether a profile can be used for a provider right now. */
export declare function resolveAuthProfileEligibility(params: {
    cfg?: OpenClawConfig;
    store: AuthProfileStore;
    provider: string;
    profileId: string;
    now?: number;
}): AuthProfileEligibility;
/** Resolves ordered auth profile candidates for a provider. */
/** Resolve ordered usable auth profile ids for a provider. */
export declare function resolveAuthProfileOrder(params: {
    cfg?: OpenClawConfig;
    store: AuthProfileStore;
    provider: string;
    preferredProfile?: string;
}): string[];
export {};
