import type { OAuthCredential } from "./types.js";
/** Resolves the effective OAuth credential, optionally reading external CLI bootstrap state. */
export declare function resolveEffectiveOAuthCredential(params: {
    profileId: string;
    credential: OAuthCredential;
    allowKeychainPrompt?: boolean;
}): OAuthCredential;
