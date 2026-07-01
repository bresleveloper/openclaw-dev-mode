/** Legacy OAuth ref source persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
export declare const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
export type LegacyOAuthRef = {
    source: typeof LEGACY_OAUTH_REF_SOURCE;
    provider: typeof LEGACY_OAUTH_REF_PROVIDER;
    id: string;
};
/** Return true for the legacy OAuth reference shape persisted by older stores. */
export declare function isLegacyOAuthRef(value: unknown): value is LegacyOAuthRef;
export {};
