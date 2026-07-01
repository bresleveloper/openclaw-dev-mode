/**
 * Identity metadata extracted from OpenAI Codex ChatGPT OAuth tokens.
 */
export type OpenAICodexAuthIdentity = {
    /**
     * ChatGPT account id used to group imported profiles under the same account.
     */
    accountId?: string;
    /**
     * ChatGPT subscription plan claim captured for diagnostics and credential metadata.
     */
    chatgptPlanType?: string;
    /**
     * Profile email from the OpenAI token profile claim when available.
     */
    email?: string;
    /**
     * Stable local profile name derived from email, account-scoped subject, or fallback id.
     */
    profileName?: string;
};
/**
 * Decodes a JWT payload without verifying signatures for local metadata extraction.
 */
export declare function decodeOpenAICodexJwtPayload(token: string): Record<string, unknown> | undefined;
/**
 * Resolves stable account/profile metadata from OpenAI Codex OAuth access-token claims.
 */
export declare function resolveOpenAICodexAuthIdentity(params: {
    /**
     * OpenAI Codex OAuth access token containing ChatGPT auth/profile claims.
     */
    access: string;
    /**
     * Account id supplied by the import source when the access token omits one.
     */
    accountId?: string;
}): OpenAICodexAuthIdentity;
/**
 * Resolves the OAuth access-token expiry timestamp in milliseconds.
 */
export declare function resolveOpenAICodexAccessTokenExpiry(access: string): number | undefined;
/**
 * Builds persisted credential metadata for OpenAI Codex OAuth profiles.
 */
export declare function buildOpenAICodexCredentialExtra(identity: OpenAICodexAuthIdentity & {
    idToken?: string;
}): Record<string, unknown> | undefined;
/**
 * Picks the imported profile name used when migrating OpenAI Codex auth.
 */
export declare function resolveOpenAICodexImportProfileName(identity: Pick<OpenAICodexAuthIdentity, "accountId" | "profileName">, 
/**
 * Name to use when imported metadata does not contain an account or stable subject.
 */
fallback: string): string;
