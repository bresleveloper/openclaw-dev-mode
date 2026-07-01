import type { LegacyOAuthRef } from "../../../agents/auth-profiles/legacy-oauth-ref.js";
export { isLegacyOAuthRef } from "../../../agents/auth-profiles/legacy-oauth-ref.js";
export type { LegacyOAuthRef } from "../../../agents/auth-profiles/legacy-oauth-ref.js";
declare const LEGACY_OAUTH_SECRET_ALGORITHM = "aes-256-gcm";
export type LegacyOAuthSecretMaterial = {
    /** OAuth access token from the legacy sidecar. */
    access?: string;
    /** OAuth refresh token from the legacy sidecar. */
    refresh?: string;
    /** Optional OpenID Connect id token from the legacy sidecar. */
    idToken?: string;
};
type LegacyOAuthEncryptedPayload = {
    algorithm: typeof LEGACY_OAUTH_SECRET_ALGORITHM;
    iv: string;
    tag: string;
    ciphertext: string;
};
/** Resolve the legacy OAuth sidecar JSON path for an auth profile ref. */
export declare function resolveLegacyOAuthSidecarPath(ref: LegacyOAuthRef, env?: NodeJS.ProcessEnv): string;
/** Return true when raw JSON has the legacy OAuth sidecar envelope or plaintext token shape. */
export declare function isLegacyOAuthSidecarPayload(raw: unknown): boolean;
declare function buildLegacyOAuthSecretAad(params: {
    ref: LegacyOAuthRef;
    profileId: string;
    provider: string;
}): Buffer;
declare function buildLegacyOAuthSecretKey(seed: string): Buffer;
declare function encryptLegacyOAuthMaterialForTest(params: {
    ref: LegacyOAuthRef;
    profileId: string;
    provider: string;
    seed: string;
    material: Record<string, string>;
}): LegacyOAuthEncryptedPayload;
export declare const legacyOAuthSidecarInternalTestUtils: {
    resetKeychainOnlyMigrationHint(): void;
};
export declare function loadLegacyOAuthSidecarMaterial(params: {
    ref: LegacyOAuthRef;
    profileId: string;
    provider: string;
    allowKeychainPrompt?: boolean;
    env?: NodeJS.ProcessEnv;
}): LegacyOAuthSecretMaterial | null;
export declare const legacyOAuthSidecarTestUtils: {
    buildLegacyOAuthSecretAad: typeof buildLegacyOAuthSecretAad;
    buildLegacyOAuthSecretKey: typeof buildLegacyOAuthSecretKey;
    encryptLegacyOAuthMaterial: typeof encryptLegacyOAuthMaterialForTest;
};
